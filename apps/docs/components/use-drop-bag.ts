'use client';
import { useCallback, useEffect, useState } from 'react';
import { BAG_CHANGE_EVENT, BAG_STORAGE_KEY, sanitizePaths } from '@/lib/drop-bag';

function read(): string[] {
  try { return sanitizePaths(JSON.parse(window.localStorage.getItem(BAG_STORAGE_KEY) ?? '[]')); }
  catch { return []; }
}
export function useDropBag() {
  const [selected,setSelected] = useState<string[]>([]);
  useEffect(()=>{
    const sync = () => setSelected(read());
    sync();
    window.addEventListener('storage',sync);
    window.addEventListener(BAG_CHANGE_EVENT,sync);
    return ()=>{window.removeEventListener('storage',sync);window.removeEventListener(BAG_CHANGE_EVENT,sync);};
  },[]);
  const replace=useCallback((values:string[])=>{
    const paths=sanitizePaths(values);
    try {window.localStorage.setItem(BAG_STORAGE_KEY,JSON.stringify(paths));}
    catch { /* Private browsing: keep an in-memory selection. */ }
    setSelected(paths);
    window.dispatchEvent(new Event(BAG_CHANGE_EVENT));
  },[]);
  const toggle=useCallback((path:string)=>replace(selected.includes(path)?selected.filter(v=>v!==path):[...selected,path]),[selected,replace]);
  const add=useCallback((paths:string[])=>replace([...selected,...paths]),[selected,replace]);
  return {selected,toggle,add,replace};
}
