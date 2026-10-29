import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateTaskManifest,safeTaskPath,findTaskManifests} from './task-manifest.mjs';

const owner='inventory/examples/camera';
const manifestPath=owner+'/workflows/index.json';
const files=new Set([owner+'/workflows/prepare.md',owner+'/workflows/verify.md',owner+'/README.md']);
const raw={version:1,item:owner,groups:[{id:'setup',title:'Setup',tasks:['prepare'],groups:[{id:'qa',title:'QA',tasks:['verify']}]}],tasks:{
 prepare:{title:'Prepare',file:'prepare.md',default:true},
 verify:{title:'Verify',file:'verify.md',requires:['prepare']}
}};
test('manifest supports nested groups and a nonreserved folder',()=>{
 const m=validateTaskManifest(raw,{owner,manifestPath,files});
 assert.equal(m.groups[0].groups[0].tasks[0],'verify');
 assert.equal(m.tasks.verify.file,owner+'/workflows/verify.md');
 assert.equal(m.tasks.prepare.default,true);
});
test('rejects traversal, missing docs and cyclic prerequisites',()=>{
 assert.equal(safeTaskPath('../secret.md'),false);
 assert.throws(()=>validateTaskManifest({...raw,tasks:{...raw.tasks,verify:{...raw.tasks.verify,file:'../outside.md'}}},{owner,manifestPath,files}),/missing or outside|invalid Markdown/);
 assert.throws(()=>validateTaskManifest({...raw,tasks:{...raw.tasks,prepare:{...raw.tasks.prepare,requires:['verify']}}},{owner,manifestPath,files}),/cyclic requires/);
});
test('discovers declared custom manifest as well as legacy tasks/index.json',async()=>{
 const folderConfigs=new Map([[owner,{taskManifest:'workflows/index.json'}]]);
 const found=await findTaskManifests([...files,manifestPath],folderConfigs,async()=>raw);
 assert.equal(found.get(owner).tasks.verify.title,'Verify');
 const legacy='inventory/auth/tasks/index.json';
 const files2=[legacy,'inventory/auth/tasks/base.md'];
 const found2=await findTaskManifests(files2,new Map(),async()=>({version:1,item:'inventory/auth',tasks:{base:{title:'Base',file:'base.md'}}}));
 assert.equal(found2.get('inventory/auth').tasks.base.title,'Base');
});
