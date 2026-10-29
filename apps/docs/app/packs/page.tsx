import Link from 'next/link';
import manifest from '../../.generated/manifest.json';
import { sitePath } from '@/lib/shared';
import { ArrowRight, Boxes, Layers3, PackageOpen, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Packs & Templates — BAG',
  description: 'Packaged project starters, reusable templates and curated loadouts.',
};

const starters = manifest.pages.filter(page =>
  page.sourcePath?.endsWith('/README.md') &&
  'template' in page && (page.template === 'boilerplate' || page.template === 'loadout')
);
const packaged = starters.filter(page => 'template' in page && page.template === 'boilerplate');

export default function PacksPage() {
  return <main className="mx-auto w-full max-w-6xl space-y-12 px-4 py-12 sm:px-6 lg:py-16">
    <header className="max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-fd-primary"><PackageOpen className="size-3.5"/> BAG / Packaged resources</div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Packs & Templates</h1>
      <p className="text-base leading-7 text-fd-muted-foreground">Ready-to-study starters and thoughtfully composed project kits. Nothing here runs automatically: inspect the canonical sources, choose what matches your stack, then hand a single Drop Bag prompt to your agent.</p>
      <Link href="/explore/" className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-3 text-sm font-semibold text-fd-primary-foreground">Compose your Drop Bag <ArrowRight className="size-4"/></Link>
    </header>
    <section className="space-y-5" aria-labelledby="packaged-heading">
      <div><h2 id="packaged-heading" className="flex items-center gap-2 text-2xl font-bold"><Boxes className="size-6 text-fd-primary"/> Packaged starters</h2><p className="mt-2 text-sm text-fd-muted-foreground">Canonical source repositories and their reuse constraints, not copies of their entire codebase.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">{packaged.map(page=><Link key={page.sourcePath} href={sitePath(page.url)} className="group rounded-2xl border border-fd-border bg-fd-card p-6 shadow-sm transition hover:border-fd-primary/50 hover:shadow-md"><div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-fd-accent text-fd-primary"><PackageOpen className="size-5"/></div><h3 className="text-lg font-bold group-hover:text-fd-primary">{page.title}</h3><p className="mt-2 text-sm leading-6 text-fd-muted-foreground">{page.description}</p><span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-fd-primary">View package <ArrowRight className="size-4"/></span></Link>)}</div>
      {!packaged.length && <p className="rounded-2xl border border-dashed border-fd-border p-8 text-sm text-fd-muted-foreground">No curated starter packages have been registered yet.</p>}
    </section>
    <section className="space-y-5" aria-labelledby="loadouts-heading">
      <div><h2 id="loadouts-heading" className="flex items-center gap-2 text-2xl font-bold"><Layers3 className="size-6 text-fd-primary"/> Curated loadouts</h2><p className="mt-2 text-sm text-fd-muted-foreground">Loadouts reference existing items and provide a phased plan, prerequisites and acceptance checks.</p></div>
      <div className="grid gap-4 md:grid-cols-3">{manifest.loadouts.map(loadout=><article key={loadout.id} className="flex flex-col justify-between gap-5 rounded-2xl border border-fd-border bg-fd-card p-5"><div><div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-fd-accent text-fd-primary"><Sparkles className="size-5"/></div><h3 className="font-bold">{loadout.title}</h3><p className="mt-2 text-sm leading-6 text-fd-muted-foreground">{loadout.summary}</p><p className="mt-3 text-xs text-fd-muted-foreground">{loadout.sourcePaths.length} referenced resources</p></div><Link href="/explore/" className="inline-flex items-center gap-2 text-sm font-semibold text-fd-primary hover:underline">Build from this loadout <ArrowRight className="size-4"/></Link></article>)}</div>
    </section>
  </main>;
}
