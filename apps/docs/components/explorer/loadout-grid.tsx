'use client';

import { Layers3 } from 'lucide-react';
import type { BagItem, BagLoadout } from '@/lib/drop-bag';

export function LoadoutGrid({ items, loadouts, selected, add }: {
  items: BagItem[];
  loadouts: BagLoadout[];
  selected: string[];
  add: (paths: string[]) => void;
}) {
  const availablePaths = new Set(items.map(item => item.sourcePath));
  const ready = loadouts
    .map(loadout => ({ loadout, paths: loadout.sourcePaths.filter(path => availablePaths.has(path)) }))
    .filter(item => item.paths.length > 0);
  return (
    <section aria-labelledby="loadouts" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="loadouts" className="text-xl font-bold">Ready-made loadouts</h2>
          <p className="mt-1 text-xs text-fd-muted-foreground">Curated starting points; selecting never installs anything.</p>
        </div>
        <a href="#resource-inventory" className="text-sm font-medium text-fd-primary hover:underline">Browse individual resources</a>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ready.map(({ loadout, paths }) => {
          const already = paths.every(path => selected.includes(path));
          return (
            <article key={loadout.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-fd-border bg-fd-card p-5 shadow-sm">
              <div>
                <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-fd-accent text-fd-primary"><Layers3 className="size-4" /></div>
                <h3 className="font-bold">{loadout.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-fd-muted-foreground">{loadout.summary}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-fd-muted-foreground">{paths.length} documented resources</span>
                <button type="button" disabled={already} onClick={() => add(paths)}
                  className="min-h-10 rounded-lg border border-fd-border px-3 py-2 text-sm font-semibold hover:bg-fd-accent disabled:opacity-50">
                  {already ? 'In your bag' : '+ Add loadout'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
