'use client';

import type { BagItem } from '@/lib/drop-bag';

type Props = {
  items: BagItem[];
  mode: 'cards' | 'paths';
  selected: string[];
  toggle: (path: string) => void;
};

export function ResourceResults({ items, mode, selected, toggle }: Props) {
  if (mode === 'paths') {
    // Folder groups reflect the canonical source path. They are not a semantic dependency graph.
    const groups = new Map<string, BagItem[]>();
    for (const item of items) {
      const segments = item.sourcePath.split('/');
      const folder = segments.length > 1 ? segments.slice(0, -1).join('/') : 'Root';
      groups.set(folder, [...(groups.get(folder) ?? []), item]);
    }
    return (
      <div className="space-y-3">
        {[...groups.entries()].map(([folder, entries]) => (
          <details key={folder} open className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
            <summary className="cursor-pointer border-b border-fd-border bg-fd-muted/40 px-4 py-3 text-sm font-semibold">
              <span className="break-all">{folder}</span>
              <span className="ml-2 text-xs text-fd-muted-foreground">({entries.length})</span>
            </summary>
            <div className="divide-y divide-fd-border">
              {entries.map(item => (
                <div key={item.sourcePath} className="flex items-center gap-3 px-4 py-3">
                  <input type="checkbox" aria-label={`Select ${item.title}`}
                    checked={selected.includes(item.sourcePath)} onChange={() => toggle(item.sourcePath)} />
                  <div className="min-w-0">
                    <a className="block truncate text-sm font-semibold hover:underline" href={item.url}>{item.title}</a>
                    <code className="block truncate text-xs text-fd-muted-foreground">{item.sourcePath}</code>
                  </div>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(item => (
        <article key={item.sourcePath}
          className={`flex flex-col justify-between gap-4 rounded-xl border bg-fd-card p-4 transition hover:shadow-sm ${selected.includes(item.sourcePath) ? 'border-fd-primary/70' : 'border-fd-border'}`}>
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <a href={item.url} className="font-semibold leading-6 hover:text-fd-primary hover:underline">{item.title}</a>
              <input aria-label={`Select ${item.title}`} type="checkbox"
                className="mt-1 size-4 shrink-0 accent-current"
                checked={selected.includes(item.sourcePath)} onChange={() => toggle(item.sourcePath)} />
            </div>
            <p className="line-clamp-3 text-sm leading-6 text-fd-muted-foreground">{item.description}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-fd-muted px-2 py-1 text-xs">{item.template || item.type}</span>
            {item.recommendation && <span className="rounded-md bg-fd-accent px-2 py-1 text-xs text-fd-primary">{item.recommendation}</span>}
            {(item.contexts ?? []).slice(0, 2).map(context => <span key={context} className="rounded-md border border-fd-border px-2 py-1 text-xs">{context}</span>)}
          </div>
        </article>
      ))}
    </div>
  );
}
