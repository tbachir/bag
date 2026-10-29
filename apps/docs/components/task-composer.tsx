'use client';
import {CheckCircle2, CircleHelp, ListChecks, RotateCcw} from 'lucide-react';
import type { ReactNode } from 'react';
import {useDropBag} from '@/components/use-drop-bag';
import {resolveTasks,type BagItem,type TaskGroup} from '@/lib/drop-bag';

export function TaskComposer({item,compact=false}:{item:BagItem;compact?:boolean}){
  const manifest=item.taskManifest;
  const {selected,taskSelections,setItemTasks}=useDropBag();
  if(!manifest)return null;
  const taskManifest=manifest;
  const requested=(taskSelections[item.sourcePath]??[]).filter(id=>!!taskManifest.tasks[id]);
  const effective=resolveTasks(manifest,requested);
  const derived=new Set(effective.filter(id=>!requested.includes(id)));
  const chosen=new Set(effective);
  const defaults=Object.keys(taskManifest.tasks).filter(id=>taskManifest.tasks[id].default);
  const active=selected.includes(item.sourcePath);
  function toggle(id:string){
    const next=requested.includes(id)?requested.filter(v=>v!==id):[...requested,id];
    // Remove all dependants when a required task is explicitly deselected.
    if(requested.includes(id)){
      const toRemove=new Set([id]);
      let changed=true;
      while(changed){changed=false;for(const taskId of next){
        if(taskManifest.tasks[taskId]?.requires.some(dep=>toRemove.has(dep))&&!toRemove.has(taskId)){
          toRemove.add(taskId);changed=true;
        }
      }}
      setItemTasks(item.sourcePath,next.filter(v=>!toRemove.has(v)));
    }else setItemTasks(item.sourcePath,next);
  }
  function groupView(group:TaskGroup,depth=0):ReactNode{
    return <details key={group.id} open={depth===0||undefined} className="rounded-lg border border-fd-border bg-fd-background/70">
      <summary className="cursor-pointer select-none px-3 py-2.5 text-sm font-semibold">{group.title}</summary>
      <div className="space-y-2 px-3 pb-3">
        {group.tasks.map(id=>{
          const task=taskManifest.tasks[id];
          const auto=derived.has(id);
          const checked=chosen.has(id);
          return <label key={id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-fd-border/60 p-3 text-sm hover:bg-fd-accent/40">
            <input aria-label={`Task: ${task.title}`} type="checkbox" checked={checked} disabled={auto}
              onChange={()=>toggle(id)} className="mt-1 size-4 shrink-0"/>
            <span className="min-w-0 flex-1"><span className="block font-semibold">{task.title}</span>
              {task.description&&<span className="mt-1 block text-xs text-fd-muted-foreground">{task.description}</span>}
              {auto&&<span className="mt-1 block text-xs text-fd-primary">Required by your selection</span>}
              {task.requires.length>0&&!auto&&<span className="mt-1 block text-xs text-fd-muted-foreground">Requires: {task.requires.map(x=>taskManifest.tasks[x]?.title??x).join(', ')}</span>}
              <a className="mt-1 inline-block text-xs font-semibold text-fd-primary hover:underline" href={`https://github.com/tbachir/bag/blob/main/${task.file}`} target="_blank" rel="noreferrer" onClick={event=>event.stopPropagation()}>Read task reference</a>
            </span>
          </label>;
        })}
        {group.groups?.map(x=>groupView(x,depth+1))}
      </div>
    </details>;
  }
  return <section aria-label={`Task composer: ${item.title}`} className={`space-y-3 ${compact?'':'my-5 rounded-xl border border-fd-border bg-fd-card p-5'}`}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div><h3 className={`flex items-center gap-2 font-bold ${compact?'text-sm':'text-lg'}`}><ListChecks className="size-4 text-fd-primary"/>Choose individual tasks</h3><p className="mt-1 text-xs text-fd-muted-foreground">{requested.length? `${requested.length} requested · ${derived.size} required prerequisites`:'Full resource scope (no task filter)'}</p></div>
      <div className="flex flex-wrap gap-2">
        {!!defaults.length&&<button type="button" onClick={()=>setItemTasks(item.sourcePath,defaults)} className="rounded-lg border border-fd-border px-2.5 py-1.5 text-xs hover:bg-fd-accent">Use defaults</button>}
        {!!requested.length&&<button type="button" onClick={()=>setItemTasks(item.sourcePath,[])} className="inline-flex items-center gap-1 rounded-lg border border-fd-border px-2.5 py-1.5 text-xs hover:bg-fd-accent"><RotateCcw className="size-3"/>Entire item</button>}
      </div>
    </div>
    <p className="flex items-start gap-2 text-xs leading-5 text-fd-muted-foreground"><CircleHelp className="mt-0.5 size-3.5 shrink-0"/>Select a task to narrow the generated prompt; required prerequisites are included automatically. Selecting tasks adds this item to your bag.</p>
    <div className="space-y-2">{taskManifest.groups.map(group=>groupView(group))}</div>
    {requested.length>0&&<p className="flex items-center gap-1.5 text-xs font-semibold text-fd-primary"><CheckCircle2 className="size-4"/>Custom selection saved {active?'to your Drop Bag':'locally'}</p>}
  </section>;
}
