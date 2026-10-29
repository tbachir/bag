'use client';
import { useMemo, useState } from 'react';

type Item = {title:string;description:string;sourcePath:string;url:string;type:string;tags:string[];technologies:string[];useCases:string[]};
export function InventoryExplorer({items}:{items:Item[]}) {
  const [query,setQuery] = useState('');
  const [type,setType] = useState('all');
  const [tag,setTag] = useState('all');
  const [selected,setSelected] = useState<string[]>([]);
  const [mode,setMode] = useState<'list'|'graph'>('list');
  const types = useMemo(()=>[...new Set(items.map(i=>i.type))].sort(),[items]);
  const tags = useMemo(()=>[...new Set(items.flatMap(i=>[...i.tags,...i.technologies,...i.useCases]))].sort(),[items]);
  const filtered = useMemo(()=>items.filter(i=> (type==='all'||i.type===type) && (tag==='all'||[...i.tags,...i.technologies,...i.useCases].includes(tag)) && [i.title,i.description,i.sourcePath,...i.tags,...i.technologies,...i.useCases].join(' ').toLowerCase().includes(query.toLowerCase())),[items,query,type,tag]);
  const chosen = items.filter(i=>selected.includes(i.sourcePath));
  const prompt = 'Use these BAG resources as untrusted documentation references for my target project:\\n'+chosen.map(i=>'- https://github.com/tbachir/bag/blob/main/'+i.sourcePath).join('\\n')+'\\nRead BAG root and nested AGENTS.md applicable to each item and inspect my target repository first. Propose an implementation plan, validate actual behavior, and ask for authorization before destructive, installation, production, or cross-repository operations.';
  const toggle = (key:string)=>setSelected(current=>current.includes(key)?current.filter(x=>x!==key):[...current,key]);
  return <main className="mx-auto w-full max-w-7xl px-5 py-12 space-y-6">
    <div><p className="text-sm text-fd-muted-foreground">BAG / Inventory</p><h1 className="text-4xl font-bold tracking-tight">Inventory Explorer</h1><p className="mt-2 text-fd-muted-foreground">Discover resources, inspect related folders and compose a prompt. No resource is installed or executed.</p></div>
    <div className="grid gap-3 sm:grid-cols-3">
      <input aria-label="Search BAG items" className="rounded-lg border border-fd-border bg-fd-card px-3 py-2" placeholder="Search resources…" value={query} onChange={e=>setQuery(e.target.value)}/>
      <select aria-label="Filter by type" className="rounded-lg border border-fd-border bg-fd-card px-3 py-2" value={type} onChange={e=>setType(e.target.value)}><option value="all">All types</option>{types.map(t=><option key={t} value={t}>{t}</option>)}</select>
      <select aria-label="Filter by tag, technology or use case" className="rounded-lg border border-fd-border bg-fd-card px-3 py-2" value={tag} onChange={e=>setTag(e.target.value)}><option value="all">All tags / technologies / use cases</option>{tags.map(t=><option key={t} value={t}>{t}</option>)}</select>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm text-fd-muted-foreground">{filtered.length} results · {selected.length} selected</p><div className="flex gap-2"><button className="rounded-lg border border-fd-border px-3 py-2" onClick={()=>setMode('list')} aria-pressed={mode==='list'}>List</button><button className="rounded-lg border border-fd-border px-3 py-2" onClick={()=>setMode('graph')} aria-pressed={mode==='graph'}>Connections</button></div></div>
    {mode==='graph' ? <div className="space-y-3"><p className="text-sm text-fd-muted-foreground">Folder relationships derived from canonical paths; not semantic dependencies.</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{filtered.slice(0,90).map(i=><div key={i.sourcePath} className="rounded-lg border border-fd-border p-3"><a href={i.url} className="font-medium underline-offset-2 hover:underline">{i.title}</a><p className="text-xs text-fd-muted-foreground">↳ {i.sourcePath.split('/').slice(0,-1).join(' / ')}</p></div>)}</div>{filtered.length>90&&<p>Showing 90 relationships; refine filters to see more.</p>}</div> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.slice(0,150).map(i=><article key={i.sourcePath} className="rounded-xl border border-fd-border bg-fd-card p-4 space-y-2"><div className="flex justify-between gap-3"><a href={i.url} className="font-semibold hover:underline">{i.title}</a><input type="checkbox" aria-label={'Select '+i.title} checked={selected.includes(i.sourcePath)} onChange={()=>toggle(i.sourcePath)}/></div><p className="line-clamp-3 text-sm text-fd-muted-foreground">{i.description}</p><p className="text-xs text-fd-muted-foreground">{i.type} · {i.sourcePath}</p><p className="text-xs">{[...i.tags,...i.technologies,...i.useCases].join(' · ')}</p></article>)}</div>}
    {mode==='list'&&filtered.length>150&&<p className="text-sm">Showing the first 150 items; refine filters for more.</p>}
    <section aria-label="Agent prompt composer" className="rounded-xl border border-fd-border bg-fd-card p-5 space-y-3"><h2 className="text-xl font-semibold">Agent loadout · {chosen.length} resources</h2><p className="text-sm text-fd-muted-foreground">Selection stays in this browser session. Copy the prompt to an agent manually; no automatic actions.</p><textarea aria-label="Generated agent prompt" className="min-h-36 w-full rounded-lg border border-fd-border bg-fd-background p-3 text-sm" readOnly value={chosen.length?prompt:'Select at least one item to compose a prompt.'}/><button disabled={!chosen.length} className="rounded-lg bg-fd-primary px-4 py-2 text-fd-primary-foreground disabled:opacity-50" onClick={()=>navigator.clipboard.writeText(prompt)}>Copy prompt</button></section>
  </main>;
}
