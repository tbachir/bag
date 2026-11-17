'use client';
import { useEffect, useMemo, useState } from 'react';
import { Check, Clipboard, Filter, Search, ShoppingBag, Trash2 } from 'lucide-react';
import { LoadoutGrid } from '@/components/explorer/loadout-grid';
import { ResourceResults } from '@/components/explorer/resource-results';
import { PAGE_SIZE, Pagination } from '@/components/explorer/pagination';
import { useDropBag } from '@/components/use-drop-bag';
import { analyzeBag, composePrompt, type BagItem, type BagLoadout } from '@/lib/drop-bag';
import { TaskComposer } from '@/components/task-composer';
import { AlertTriangle, Info } from 'lucide-react';

export function InventoryExplorer({items,loadouts}:{items:BagItem[];loadouts:BagLoadout[]}) {
  const [query,setQuery]=useState('');
  const [page,setPage]=useState(1);
  const [urlReady,setUrlReady]=useState(false);
  const [type,setType]=useState('all');
  const [context,setContext]=useState('all');
  const [level,setLevel]=useState('all');
  const [mode,setMode]=useState<'cards'|'paths'>('cards');
  const [copied,setCopied]=useState(false);
  const [targetContext,setTargetContext]=useState('all');
  const {selected,taskSelections,toggle,add,replace}=useDropBag();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') ?? '');
    setType(params.get('type') ?? 'all');
    setContext(params.get('context') ?? 'all');
    const recommendation = params.get('recommendation') ?? 'all';
    setLevel(['all','mandatory','recommended','optional','experimental'].includes(recommendation) ? recommendation : 'all');
    setMode(params.get('view') === 'paths' ? 'paths' : 'cards');
    setPage(Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1));
    setUrlReady(true);
  }, []);
  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (type !== 'all') params.set('type', type);
    if (context !== 'all') params.set('context', context);
    if (level !== 'all') params.set('recommendation', level);
    if (mode !== 'cards') params.set('view', mode);
    if (page > 1) params.set('page', String(page));
    const next = params.toString();
    const destination = window.location.pathname + (next ? `?${next}` : '') + window.location.hash;
    window.history.replaceState(window.history.state, '', destination);
  }, [query,type,context,level,mode,page,urlReady]);
  function changePage(next: number) {
    setPage(next);
    document.getElementById('resource-inventory')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }

  const types=useMemo(()=>[...new Set(items.map(i=>i.template||i.type))].sort(),[items]);
  const contexts=useMemo(()=>[...new Set(items.flatMap(i=>[...(i.contexts??[]),...i.tags,...i.technologies,...i.useCases]))].sort(),[items]);
  const filtered=useMemo(()=>items.filter(i=>
    (type==='all'||(i.template||i.type)===type) &&
    (context==='all'||[...(i.contexts??[]),...i.tags,...i.technologies,...i.useCases].includes(context)) &&
    (level==='all'||i.recommendation===level) &&
    [i.title,i.description,i.sourcePath,...(i.contexts??[]),...i.tags,...i.technologies,...i.useCases].join(' ').toLowerCase().includes(query.toLowerCase())
  ),[items,query,type,context,level]);
  useEffect(() => {
    const maximum = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (page > maximum) setPage(maximum);
  }, [page, filtered.length]);
  const chosen=useMemo(()=>selected.map(path=>items.find(i=>i.sourcePath===path)).filter((i):i is BagItem=>Boolean(i)),[selected,items]);
  const targetContexts=targetContext==='all'?[]:[targetContext];
  const notices=useMemo(()=>analyzeBag(chosen,taskSelections,targetContexts),[chosen,taskSelections,targetContext]);
  const prompt=useMemo(()=>composePrompt(chosen,taskSelections,targetContexts),[chosen,taskSelections,targetContext]);
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
    <LoadoutGrid items={items} loadouts={loadouts} selected={selected} add={add} />
    <a href="#drop-bag" className="inline-flex min-h-10 items-center rounded-lg border border-fd-border px-4 text-sm font-semibold xl:hidden">Open your Drop Bag ({selected.length})</a>
    <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
      <section id="resource-inventory" className="min-w-0 scroll-mt-24 space-y-4" aria-label="Resource inventory">
        <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-xl font-bold">Inventory <span className="text-fd-muted-foreground">({filtered.length})</span></h2><div className="flex gap-2 text-xs"><button aria-pressed={mode==='cards'} className="rounded-lg border border-fd-border px-3 py-2" onClick={()=>{setMode('cards');setPage(1);}}>Cards</button><button aria-pressed={mode==='paths'} className="rounded-lg border border-fd-border px-3 py-2" onClick={()=>{setMode('paths');setPage(1);}}>Folder view</button></div></div>
        <div className="grid gap-2 rounded-xl border border-fd-border bg-fd-card p-3 sm:grid-cols-2">
          <label className="relative sm:col-span-2"><span className="sr-only">Search BAG items</span><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 size-4 text-fd-muted-foreground"/><input aria-label="Search BAG items" className="min-h-10 w-full rounded-lg border border-fd-border bg-fd-background pl-9 pr-3 text-sm" placeholder="Search skills, tools, libraries, templates…" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}}/></label>
          <label className="text-xs text-fd-muted-foreground">Type<select aria-label="Filter by type" className="mt-1 block min-h-10 w-full rounded-lg border border-fd-border bg-fd-background px-2 text-sm text-fd-foreground" value={type} onChange={e=>{setType(e.target.value);setPage(1);}}><option value="all">All types</option>{types.map(t=><option key={t} value={t}>{t}</option>)}</select></label>
          <label className="text-xs text-fd-muted-foreground">Technology or use case<select aria-label="Filter by tag, technology or use case" className="mt-1 block min-h-10 w-full rounded-lg border border-fd-border bg-fd-background px-2 text-sm text-fd-foreground" value={context} onChange={e=>{setContext(e.target.value);setPage(1);}}><option value="all">All contexts</option>{contexts.map(t=><option key={t} value={t}>{t}</option>)}</select></label>
          <label className="flex items-center gap-2 text-xs text-fd-muted-foreground sm:col-span-2"><Filter className="size-3.5"/>Recommendation<select aria-label="Filter by recommendation" className="min-h-10 flex-1 rounded-lg border border-fd-border bg-fd-background px-2 text-sm text-fd-foreground" value={level} onChange={e=>{setLevel(e.target.value);setPage(1);}}><option value="all">Any recommendation</option>{['mandatory','recommended','optional','experimental'].map(t=><option key={t} value={t}>{t}</option>)}</select></label>
        </div>
        <p aria-live="polite" role="status" className="text-xs text-fd-muted-foreground">{filtered.length} results · {selected.length} saved to Drop Bag</p>
        <ResourceResults items={filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE)} mode={mode} selected={selected} toggle={toggle} />
        <Pagination page={page} count={filtered.length} onPage={changePage} />
        {!filtered.length&&<p className="rounded-xl border border-dashed border-fd-border p-8 text-center text-sm">No matching resources. Try a different query or filter.</p>}
      </section>
      <aside id="drop-bag" aria-labelledby="bag-heading" className="scroll-mt-24 space-y-4 rounded-2xl border border-fd-border bg-fd-card p-5 shadow-sm xl:sticky xl:top-6">
        <div className="flex items-start justify-between gap-2"><div><div className="flex items-center gap-2"><ShoppingBag className="size-5 text-fd-primary"/><h2 id="bag-heading" className="text-xl font-bold">Your Drop Bag</h2></div><p className="mt-1 text-xs text-fd-muted-foreground">{chosen.length} selected resources</p></div><button type="button" title="Clear Drop Bag" aria-label="Clear Drop Bag" disabled={!selected.length} onClick={()=>replace([])} className="rounded-lg p-2 hover:bg-fd-accent disabled:opacity-40"><Trash2 className="size-4"/></button></div>
        <div className="max-h-80 space-y-3 overflow-y-auto" aria-live="polite">{chosen.length?chosen.map(i=><div key={i.sourcePath} className="rounded-lg bg-fd-muted p-3 text-xs"><div className="flex items-center justify-between gap-2"><span className="min-w-0 truncate font-semibold">{i.title}</span><button type="button" aria-label={`Remove ${i.title}`} onClick={()=>toggle(i.sourcePath)} className="shrink-0 font-semibold text-fd-primary">Remove</button></div>{i.taskManifest&&<div className="mt-3"><TaskComposer item={i} compact/></div>}</div>):<p className="rounded-lg border border-dashed border-fd-border px-4 py-6 text-center text-sm text-fd-muted-foreground">Choose an item or add a loadout to start composing.</p>}</div>
        <label className="block text-xs font-semibold text-fd-muted-foreground">Target project context<select aria-label="Target context" value={targetContext} onChange={e=>setTargetContext(e.target.value)} className="mt-1 block min-h-10 w-full rounded-lg border border-fd-border bg-fd-background px-3 text-sm text-fd-foreground"><option value="all">Not specified — inspect target project</option>{contexts.map(ctx=><option key={ctx} value={ctx}>{ctx}</option>)}</select></label>
        {notices.length>0&&<section aria-label="Drop Bag compatibility analysis" className="space-y-2"><h3 className="flex items-center gap-2 text-sm font-bold"><AlertTriangle className="size-4"/>Compatibility checks ({notices.length})</h3>{notices.map((notice,index)=><div key={index} className={`rounded-lg border p-3 text-xs leading-5 ${notice.level==='error'?'border-red-500/40':notice.level==='warning'?'border-amber-500/40':'border-fd-border'}`}><div className="flex items-start gap-2">{notice.level==='info'?<Info className="mt-0.5 size-3.5 shrink-0"/>:<AlertTriangle className="mt-0.5 size-3.5 shrink-0"/>}<span>{notice.message}</span></div>{notice.kind==='dependency' && notice.related && items.some(i=>i.sourcePath===notice.related) && <button type="button" onClick={()=>add([notice.related!])} className="mt-2 rounded-md border border-fd-border px-2.5 py-1 font-semibold hover:bg-fd-accent">Add required reference</button>}</div>)}</section>}
        <label htmlFor="drop-bag-prompt" className="block text-sm font-semibold">One prompt. One coherent mission.</label><textarea id="drop-bag-prompt" readOnly aria-label="Generated agent prompt" value={prompt||'Select resources to generate your prompt.'} className="min-h-56 w-full resize-y rounded-lg border border-fd-border bg-fd-background p-3 font-mono text-xs leading-5"/>
        <button type="button" disabled={!chosen.length} onClick={copyPrompt} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground disabled:opacity-40">{copied?<Check className="size-4"/>:<Clipboard className="size-4"/>}{copied?'Copied':'Copy combined prompt'}</button>
        <p className="text-xs leading-5 text-fd-muted-foreground">Saved locally in this browser. Links are references, not installation commands. Review target-specific compatibility, security, costs and licenses with your agent before changes.</p>
      </aside>
    </div>
  </main>;
}
