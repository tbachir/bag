'use client';
import {useCallback,useEffect,useState} from 'react';
import {BAG_CHANGE_EVENT,BAG_STORAGE_KEY,BAG_TASKS_STORAGE_KEY,sanitizePaths,sanitizeTasks,type TaskSelections} from '@/lib/drop-bag';

function snapshot():{paths:string[];tasks:TaskSelections}{
  try {
    const paths=sanitizePaths(JSON.parse(localStorage.getItem(BAG_STORAGE_KEY)??'[]'));
    const tasks=sanitizeTasks(JSON.parse(localStorage.getItem(BAG_TASKS_STORAGE_KEY)??'{}'));
    const allowed=new Set(paths);
    return {paths,tasks:Object.fromEntries(Object.entries(tasks).filter(([p])=>allowed.has(p)))};
  } catch {return {paths:[],tasks:{}};}
}
export function useDropBag(){
  const [selected,setSelected]=useState<string[]>([]);
  const [taskSelections,setTaskSelections]=useState<TaskSelections>({});
  useEffect(()=>{
    const sync=()=>{const next=snapshot();setSelected(next.paths);setTaskSelections(next.tasks);};
    sync();window.addEventListener('storage',sync);window.addEventListener(BAG_CHANGE_EVENT,sync);
    return ()=>{window.removeEventListener('storage',sync);window.removeEventListener(BAG_CHANGE_EVENT,sync);};
  },[]);
  const write=useCallback((paths:string[],tasks:TaskSelections)=>{
    const safe=sanitizePaths(paths);
    const allowed=new Set(safe);
    const clean=Object.fromEntries(Object.entries(sanitizeTasks(tasks)).filter(([p])=>allowed.has(p)));
    setSelected(safe);setTaskSelections(clean);
    try {
      localStorage.setItem(BAG_STORAGE_KEY,JSON.stringify(safe));
      localStorage.setItem(BAG_TASKS_STORAGE_KEY,JSON.stringify(clean));
      window.dispatchEvent(new Event(BAG_CHANGE_EVENT));
    } catch {/* In private browsing, changes remain in this component instance. */}
  },[]);
  const replace=useCallback((paths:string[])=>write(paths,taskSelections),[write,taskSelections]);
  const toggle=useCallback((path:string)=>replace(selected.includes(path)?selected.filter(x=>x!==path):[...selected,path]),[selected,replace]);
  const add=useCallback((paths:string[])=>replace([...selected,...paths]),[selected,replace]);
  const setItemTasks=useCallback((path:string,ids:string[])=>write([...selected,path],{...taskSelections,[path]:ids}),[write,selected,taskSelections]);
  return {selected,taskSelections,toggle,add,replace,setItemTasks};
}
