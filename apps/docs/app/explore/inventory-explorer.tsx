'use client';
import { useMemo, useState } from 'react';
import { Check, Clipboard, Filter, Layers3, Search, ShoppingBag, Trash2 } from 'lucide-react';
import { useDropBag } from '@/components/use-drop-bag';
import { composePrompt, type BagItem, type BagLoadout } from '@/lib/drop-bag';

export function InventoryExplorer({items,loadouts}:{items:BagItem[];loadouts:BagLoadout[]}) {
  const [query,setQuery]=useState('');
  const [type,setType]=useState('all');
  const [context,setContext]=useState('all');
  const [level,setLevel]=useState('all');
  const [mode,setMode]=useState<'cards'|'paths'>('cards');
  const [copied,setCopied]=useState(false);
  const {selected,toggle,add,replace}=useDropBag();
  const types=useMemo(()=>[...new Set(items.map(i=>i.template||i.type))].sort(),[items]);
  const contexts=useMemo(()=>[...new Set(items.flatMap(i=>[...(i.contexts??[]),...i.tags,...i.technologies,...i.useCases]))].sort(),[items]);
  const filtered=useMemo(()=>items.filter(i=>
    (type==='all'||(i.template||i.type)===type) &&
    (context==='all'||[...(i.contexts??[]),...i.tags,...i.technologies,...i.useCases].includes(context)) &&
    (level==='all'||i.recommendation===level) &&
    [i.title,i.description,i.sourcePath,...(i.contexts??[]),...i.tags,...i.technologies,...i.useCases].join(' ').toLowerCase().includes(query.toLowerCase())
  ),[items,query,type,context,level]);
  const chosen=useMemo(()=>selected.map(path=>items.find(i=>i.sourcePath===path)).filter((i):i is BagItem=>Boolean(i)),[selected,items]);
  const prompt=useMemo(()=>composePrompt(chosen),[chosen]);
  async function copyPrompt() {
    try { await navigator.clipboard.writeText(prompt);setCopied(true); }
    catch {setCopied(false);}
  }
  return <main className="mx-auto w-full max-w-7xl space-y-9 px-4 py-10 sm:px-6 lg:py-14">
    <header className="max-w-3xl space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fd-primary"><ShoppingBag className="size-3.5"/>BAG / Drop Bag</div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Pick your tools. <span className="text-fd-primary">Build your quest.</span></h1>
      <p className="text-base leading-7 text-fd-muted-foreground">Explore the inventory, equip curated loadouts, and create one project-aware agent prompt. Your bag remains on this device until you clear it; nothing runs or installs automatically.</p>
    </header>
    <section aria-labelledby="loadouts" className="space-y-4">
      <div className="flex items-center justify-between gap-3"><h2 id="loadouts" className="text-xl font-bold">Ready-made loadouts</h2><span className="text-xs text-fd-muted-foreground">Composable, never automatic</span></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {loadouts.filter(l=>l.sourcePaths.some(path=>items.some(i=>i.sourcePath===path))).map(l=>{
          const available=l.sourcePaths.filter(path=>items.some(i=>i.sourcePath===path));
          const already=available.every(path=>selected.includes(path));
          return <article key={l.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-fd-border bg-fd-card p-5 shadow-sm">
            <div><div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-fd-accent text-fd-primary"><Layers3 className="size-4.5"/></div><h3 className="font-bold">{l.title}</h3><p className="mt-1.5 text-sm leading-6 text-fd-muted-foreground">{l.summary}</p></div>
            <div className="flex items-center justify-between gap-2"><span className="text-xs text-fd-muted-foreground">{available.length} documented resources</span><button type="button" disabled={already} onClick={()=>add(available)} className="rounded-lg border border-fd-border px-3 py-2 text-sm font-semibold hover:bg-fd-accent disabled:opacity-50">{already?'In your bag':'+ Add loadout'}</button></div>
          </article>;
        })}
      </div>
    </section>
    <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0 space-y-4" aria-label="Resource inventory">
        <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-xl font-bold">Inventory <span className="text-fd-muted-foreground">({filtered.length})</span></h2><div className="flex gap-2 text-xs"><button aria-pressed={mode==='cards'} className="rounded-lg border border-fd-border px-3 py-2" onClick={()=>setMode('cards')}>Cards</button><button aria-pressed={mode==='paths'} className="rounded-lg border border-fd-border px-3 py-2" onClick={()=>setMode('paths')}>Folder view</button></div></div>
        <div className="grid gap-2 rounded-xl border border-fd-border bg-fd-card p-3 sm:grid-cols-2">
          <label className="relative sm:col-span-2"><span className="sr-only">Search BAG items</span><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 size-4 text-fd-muted-foreground"/><input aria-label="Search BAG items" className="min-h-10 w-full rounded-lg border border-fd-border bg-fd-background pl-9 pr-3 text-sm" placeholder="Search skills, tools, libraries, templates…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
          <label className="text-xs text-fd-muted-foreground">Type<select aria-label="Filter by type" className="mt-1 block min-h-10 w-full rounded-lg border border-fd-border bg-fd-background px-2 text-sm text-fd-foreground" value={type} onChange={e=>setType(e.target.value)}><option value="all">All types</option>{types.map(t=><option key={t} value={t}>{t}</option>)}</select></label>
          <label className="text-xs text-fd-muted-foreground">Technology or use case<select aria-label="Filter by tag, technology or use case" className="mt-1 block min-h-10 w-full rounded-lg border border-fd-border bg-fd-background px-2 text-sm text-fd-foreground" value={context} onChange={e=>setContext(e.target.value)}><option value="all">All contexts</option>{contexts.map(t=><option key={t} value={t}>{t}</option>)}</select></label>
          <label className="flex items-center gap-2 text-xs text-fd-muted-foreground sm:col-span-2"><Filter className="size-3.5"/>Recommendation<select aria-label="Filter by recommendation" className="min-h-10 flex-1 rounded-lg border border-fd-border bg-fd-background px-2 text-sm text-fd-foreground" value={level} onChange={e=>setLevel(e.target.value)}><option value="all">Any recommendation</option>{['mandatory','recommended','optional','experimental'].map(t=><option key={t} value={t}>{t}</option>)}</select></label>
        </div>
        <p aria-live="polite" role="status" className="text-xs text-fd-muted-foreground">{filtered.length} results · {selected.length} saved to Drop Bag</p>
        {mode==='paths'?<div className="grid gap-2">{filtered.slice(0,160).map(i=><div className="flex items-center gap-3 rounded-lg border border-fd-border bg-fd-card px-3 py-2" key={i.sourcePath}><input type="checkbox" aria-label={`Select ${i.title}`} checked={selected.includes(i.sourcePath)} onChange={()=>toggle(i.sourcePath)}/><div className="min-w-0"><a className="block truncate text-sm font-semibold hover:underline" href={i.url}>{i.title}</a><code className="block truncate text-xs text-fd-muted-foreground">{i.sourcePath}</code></div></div>)}</div>:
          <div className="grid gap-3 md:grid-cols-2">{filtered.slice(0,160).map(i=><article key={i.sourcePath} className={`flex flex-col justify-between gap-4 rounded-xl border bg-fd-card p-4 transition hover:shadow-sm ${selected.includes(i.sourcePath)?'border-fd-primary/70':'border-fd-border'}`}><div className="space-y-2"><div className="flex items-start justify-between gap-2"><a href={i.url} className="font-semibold leading-6 hover:text-fd-primary hover:underline">{i.title}</a><input aria-label={`Select ${i.title}`} type="checkbox" className="mt-1 size-4 shrink-0 accent-current" checked={selected.includes(i.sourcePath)} onChange={()=>toggle(i.sourcePath)}/></div><p className="line-clamp-3 text-sm leading-6 text-fd-muted-foreground">{i.description}</p></div><div className="flex flex-wrap gap-1.5"><span className="rounded-md bg-fd-muted px-2 py-1 text-xs">{i.template||i.type}</span>{i.recommendation&&<span className="rounded-md bg-fd-accent px-2 py-1 text-xs text-fd-primary">{i.recommendation}</span>}{(i.contexts??[]).slice(0,2).map(x=><span key={x} className="rounded-md border border-fd-border px-2 py-1 text-xs">{x}</span>)}</div></article>)}</div>}
        {filtered.length>160&&<p className="text-sm text-fd-muted-foreground">Showing the first 160 matches. Refine filters to see more.</p>}
        {!filtered.length&&<p className="rounded-xl border border-dashed border-fd-border p-8 text-center text-sm">No matching resources. Try a different query or filter.</p>}
      </section>
      <aside aria-labelledby="bag-heading" className="space-y-4 rounded-2xl border border-fd-border bg-fd-card p-5 shadow-sm xl:sticky xl:top-6">
        <div className="flex items-start justify-between gap-2"><div><div className="flex items-center gap-2"><ShoppingBag className="size-5 text-fd-primary"/><h2 id="bag-heading" className="text-xl font-bold">Your Drop Bag</h2></div><p className="mt-1 text-xs text-fd-muted-foreground">{chosen.length} selected resources</p></div><button type="button" title="Clear Drop Bag" aria-label="Clear Drop Bag" disabled={!selected.length} onClick={()=>replace([])} className="rounded-lg p-2 hover:bg-fd-accent disabled:opacity-40"><Trash2 className="size-4"/></button></div>
        <div className="max-h-52 space-y-1 overflow-y-auto" aria-live="polite">{chosen.length?chosen.map(i=><div key={i.sourcePath} className="flex items-center justify-between gap-2 rounded-lg bg-fd-muted px-3 py-2 text-xs"><span className="min-w-0 truncate">{i.title}</span><button type="button" aria-label={`Remove ${i.title}`} onClick={()=>toggle(i.sourcePath)} className="shrink-0 font-semibold text-fd-primary">Remove</button></div>):<p className="rounded-lg border border-dashed border-fd-border px-4 py-6 text-center text-sm text-fd-muted-foreground">Choose an item or add a loadout to start composing.</p>}</div>
        <label htmlFor="drop-bag-prompt" className="block text-sm font-semibold">One prompt. One coherent mission.</label><textarea id="drop-bag-prompt" readOnly aria-label="Generated agent prompt" value={prompt||'Select resources to generate your prompt.'} className="min-h-56 w-full resize-y rounded-lg border border-fd-border bg-fd-background p-3 font-mono text-xs leading-5"/>
        <button type="button" disabled={!chosen.length} onClick={copyPrompt} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground disabled:opacity-40">{copied?<Check className="size-4"/>:<Clipboard className="size-4"/>}{copied?'Copied':'Copy combined prompt'}</button>
        <p className="text-xs leading-5 text-fd-muted-foreground">Saved locally in this browser. Links are references, not installation commands. Review target-specific compatibility, security, costs and licenses with your agent before changes.</p>
      </aside>
    </div>
  </main>;
}
