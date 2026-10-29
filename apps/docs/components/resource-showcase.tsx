import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, BookMarked, Layers, Package, Sparkles, Terminal } from 'lucide-react';
import { DropBagButton } from '@/components/drop-bag-button';
import { sitePath } from '@/lib/shared';
import type { BagItem } from '@/lib/drop-bag';
const titles:Record<string,string>={skill:'AI skill',boilerplate:'Packaged starter',library:'Library',resource:'Curated resource',loadout:'Composed loadout'};
const colors:Record<string,string>={mandatory:'text-fd-primary bg-fd-accent',recommended:'text-emerald-700 bg-emerald-500/10 dark:text-emerald-300',optional:'text-fd-muted-foreground bg-fd-muted',experimental:'text-amber-700 bg-amber-500/10 dark:text-amber-300'};
export function ResourceShowcase({item}: {item:BagItem}) {
  if (!item.template || !item.sourcePath) return null;
  const skillSlug=item.template==='skill'?item.sourcePath.split('/')[2]:null;
  const tags=[...(item.contexts??[]),...item.tags].filter((x,i,a)=>a.indexOf(x)===i).slice(0,8);
  return <aside aria-label="Resource details" className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
    <div className="border-b border-fd-border bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--fd-primary)_13%,transparent),transparent_65%)] p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-fd-secondary px-2.5 py-1"><Package className="size-3.5"/>{titles[item.template]??'Resource'}</span>
        {item.recommendation && <span className={`rounded-md px-2.5 py-1 ${colors[item.recommendation]??''}`}>{item.recommendation}{item.contexts?.length?' · context-specific':''}</span>}
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-fd-muted-foreground">{item.description}</p>
      {!!tags.length&&<div className="mt-4 flex flex-wrap gap-1.5">{tags.map(x=><span key={x} className="rounded-full border border-fd-border px-2.5 py-1 text-xs">{x}</span>)}</div>}
      <div className="mt-5 flex flex-wrap items-center gap-2"><DropBagButton sourcePath={item.sourcePath}/><Link href="/explore/" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-fd-accent"><Layers className="size-4"/>Open Drop Bag</Link></div>
    </div>
    <div className="grid gap-px bg-fd-border sm:grid-cols-2">
      <div className="bg-fd-card p-5"><div className="flex items-center gap-2 text-sm font-semibold"><BookMarked className="size-4 text-fd-primary"/>Canonical source</div><p className="mt-2 break-all font-mono text-xs text-fd-muted-foreground">{item.sourcePath}</p><a className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-fd-primary hover:underline" target="_blank" rel="noreferrer" href={`https://github.com/tbachir/bag/blob/main/${item.sourcePath}`}>Review on GitHub <ArrowUpRight className="size-3.5"/></a></div>
      <div className="bg-fd-card p-5"><div className="flex items-center gap-2 text-sm font-semibold">{skillSlug?<Terminal className="size-4 text-fd-primary"/>:<Sparkles className="size-4 text-fd-primary"/>}{skillSlug?'Install this skill':'Compose before using'}</div>
      {skillSlug?<><code className="mt-2 block break-all rounded-lg bg-fd-muted p-3 text-xs">npx skills add tbachir/bag --skill {skillSlug}</code><a className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-fd-primary hover:underline" href={sitePath(`/files/skills/${skillSlug}.zip`)}>Download skill ZIP <ArrowUpRight className="size-3.5"/></a></>:<p className="mt-2 text-xs leading-5 text-fd-muted-foreground">Add this resource to your Drop Bag to receive one consolidated project-aware agent prompt. No automatic install.</p>}</div>
    </div>
    <div className="flex gap-2 border-t border-fd-border px-5 py-3 text-xs text-fd-muted-foreground"><BadgeCheck className="size-4 shrink-0"/>A recommendation is scoped to its listed contexts, never a universal mandate. Read compatibility and licensing notes before reuse.</div>
  </aside>;
}
