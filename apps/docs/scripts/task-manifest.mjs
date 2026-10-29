import path from 'node:path';

const ID=/^[a-z][a-z0-9-]{0,63}$/;
const REF=/^[a-z0-9._/-]+$/i;
const LIMIT=150;
function requireValid(condition, message) { if (!condition) throw new Error('Task manifest: '+message); }
export function safeTaskPath(value) {
  return typeof value==='string' && value.length>0 && value.length<240 &&
    !value.startsWith('/') && !value.includes('\\') && REF.test(value) &&
    value.split('/').every(part=>part!=='.' && part!=='..' && part!=='');
}
/** Supports any nested item folder: the manifest file is configurable, not necessarily tasks/index.json. */
export function validateTaskManifest(raw,{owner,manifestPath,files}) {
  requireValid(raw && typeof raw==='object' && !Array.isArray(raw), 'expected object');
  requireValid(raw.version===1,'unsupported version');
  requireValid(typeof owner==='string' && safeTaskPath(owner), 'invalid owner');
  requireValid(!raw.item || raw.item===owner,'manifest owner mismatch');
  requireValid(raw.tasks && typeof raw.tasks==='object' && !Array.isArray(raw.tasks),'missing tasks');
  const keys=Object.keys(raw.tasks);
  requireValid(keys.length>0 && keys.length<=LIMIT,'task count must be 1-150');
  const set=new Set(keys);
  const tasks={};
  for(const id of keys) {
    requireValid(ID.test(id),'invalid task ID '+id);
    const task=raw.tasks[id];
    requireValid(task && typeof task==='object' && !Array.isArray(task),'invalid task '+id);
    requireValid(Object.keys(task).every(key=>['title','file','requires','suggests','conflicts','default','description','provides'].includes(key)),'unexpected field on '+id);
    requireValid(typeof task.title==='string' && task.title.length>0 && task.title.length<=100,'invalid title on '+id);
    requireValid(safeTaskPath(task.file) && /\.mdx?$/i.test(task.file),'invalid Markdown path on '+id);
    const source=path.posix.normalize(path.posix.join(path.posix.dirname(manifestPath),task.file));
    requireValid(source.startsWith(owner+'/') && files.has(source),'missing or outside task documentation '+source);
    const relations={};
    for(const key of ['requires','suggests','conflicts']){
      const list=task[key]??[];
      requireValid(Array.isArray(list) && list.length<=30 && list.every(v=>typeof v==='string' && set.has(v) && v!==id),'invalid '+key+' on '+id);
      requireValid(new Set(list).size===list.length,'duplicate '+key+' on '+id);
      relations[key]=list;
    }
    const provides=task.provides??[];
    requireValid(Array.isArray(provides) && provides.length<=30 && provides.every(v=>typeof v==='string' && ID.test(v)), 'invalid provides on '+id);
    requireValid(task.default===undefined || typeof task.default==='boolean','invalid default on '+id);
    requireValid(task.description===undefined || (typeof task.description==='string' && task.description.length<=400),'invalid description on '+id);
    tasks[id]={title:task.title,file:source,...relations,provides,default:task.default===true,...(task.description?{description:task.description}:{})};
  }
  // A cycle would make a "required" task impossible to deselect safely.
  const state=new Map();
  function walk(id){
    if(state.get(id)===1) throw new Error('Task manifest: cyclic requires at '+id);
    if(state.get(id)===2) return;
    state.set(id,1);
    for(const dep of tasks[id].requires) walk(dep);
    state.set(id,2);
  }
  keys.forEach(walk);
  const groups=[];
  const encountered=new Set();
  function visitGroup(group,level=0){
    requireValid(level<=8,'group nesting exceeds eight levels');
    requireValid(group && typeof group==='object' && !Array.isArray(group),'invalid group');
    requireValid(ID.test(group.id||''),'invalid group ID');
    requireValid(typeof group.title==='string' && !!group.title.trim() && group.title.length<=100,'invalid group title');
    requireValid(group.groups===undefined || (Array.isArray(group.groups) && group.groups.length<=40), 'invalid nested groups');
    const groupTasks=group.tasks??[];
    requireValid(Array.isArray(groupTasks) && groupTasks.every(id=>set.has(id)),'unknown task in group '+group.id);
    for(const id of groupTasks){requireValid(!encountered.has(id),'task assigned to multiple groups: '+id);encountered.add(id);}
    return {id:group.id,title:group.title,tasks:groupTasks,groups:(group.groups??[]).map(child=>visitGroup(child,level+1))};
  }
  const rawGroups=raw.groups??[];
  requireValid(Array.isArray(rawGroups) && rawGroups.length<=60,'invalid groups');
  for(const group of rawGroups) groups.push(visitGroup(group));
  const ungrouped=keys.filter(id=>!encountered.has(id));
  if(ungrouped.length) groups.push({id:'ungrouped',title:'Other tasks',tasks:ungrouped,groups:[]});
  return {version:1,item:owner,manifestPath,groups,tasks};
}

/** Build once, reuse in docs, Drop Bag and agent-facing manifest. */
export function findTaskManifests(files,folderConfigs,readJSON){
  const found=new Map();
  const set=new Set(files);
  for(const [folder,meta] of folderConfigs) if(meta.taskManifest){
    const filepath=path.posix.join(folder,meta.taskManifest);
    requireValid(set.has(filepath),'missing declared taskManifest '+filepath);
    found.set(folder,{filepath,explicit:true});
  }
  for(const file of files){
    if(!file.endsWith('/tasks/index.json')) continue;
    const folder=path.posix.dirname(path.posix.dirname(file));
    if(!found.has(folder)) found.set(folder,{filepath:file,explicit:false});
  }
  return Promise.all([...found].map(async ([owner,{filepath}])=>[owner,validateTaskManifest(await readJSON(filepath),{owner,manifestPath:filepath,files:set})])).then(pairs=>new Map(pairs));
}
