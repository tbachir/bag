import Link from 'next/link';
import { CheckCircle2, ExternalLink, FileCode2, Layers, ShieldAlert } from 'lucide-react';

type ResourceExample = {
  name: string;
  kind: string;
  description: string;
  href: string;
  tags: string[];
  status: 'Ready to reference' | 'Review required';
};

const resources: ResourceExample[] = [
  { name: 'Repository Auditor', kind: 'Skill', description: 'Review repository structure and risks before proposing changes.', href: '/docs/skill-tree/skills/repository-auditor/', tags: ['AI agents', 'Audit'], status: 'Ready to reference' },
  { name: 'shadcn/ui', kind: 'Library', description: 'Composable UI primitives that require project-specific integration.', href: '/docs/inventory/libraries/shadcn-ui/', tags: ['React', 'Components'], status: 'Review required' },
  { name: 'React Design System', kind: 'Loadout', description: 'A collection of references to evaluate together, not an automatic installer.', href: '/docs/loadouts/react-design-system/', tags: ['Composition', 'Design'], status: 'Review required' },
];

function ResourceCard({ item, compact = false }: { item: ResourceExample; compact?: boolean }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-fd-border bg-fd-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-md bg-fd-secondary px-2 py-1 text-xs font-semibold text-fd-secondary-foreground">{item.kind}</span>
        <span className="flex items-center gap-1 text-xs text-fd-muted-foreground">
          {item.status === 'Ready to reference' ? <CheckCircle2 aria-hidden="true" className="size-3.5" /> : <ShieldAlert aria-hidden="true" className="size-3.5" />}
          {item.status}
        </span>
      </div>
      <h4 className="mt-3 font-semibold">{item.name}</h4>
      {!compact && <p className="mt-1 flex-1 text-sm leading-6 text-fd-muted-foreground">{item.description}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Resource tags">
        {item.tags.map((tag) => <span key={tag} className="rounded-full border border-fd-border px-2 py-0.5 text-xs">{tag}</span>)}
      </div>
      <Link className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-fd-primary hover:underline" href={item.href}>
        Open reference <ExternalLink aria-hidden="true" className="size-3.5" />
      </Link>
    </article>
  );
}

export function BagPatternGallery() {
  return (
    <section aria-labelledby="bag-pattern-gallery" className="space-y-5">
      <div>
        <h2 id="bag-pattern-gallery" className="text-2xl font-bold">BAG presentation patterns</h2>
        <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">Reusable, accessible layouts backed by repository references. These are presentation examples, not live catalog records or installation controls.</p>
      </div>
      <div className="space-y-4 rounded-2xl border border-fd-border bg-fd-card p-5 sm:p-6">
        <div className="flex items-center gap-2"><Layers aria-hidden="true" className="size-5 text-fd-primary" /><h3 className="font-bold">Resource cards · Standard</h3></div>
        <p className="text-sm text-fd-muted-foreground">Use for browse pages: type, editorial status, useful tags and a clear destination.</p>
        <div className="grid gap-3 md:grid-cols-3">{resources.map((item) => <ResourceCard key={item.href} item={item} />)}</div>
      </div>
      <div className="space-y-4 rounded-2xl border border-fd-border bg-fd-card p-5 sm:p-6">
        <div className="flex items-center gap-2"><FileCode2 aria-hidden="true" className="size-5 text-fd-primary" /><h3 className="font-bold">Resource cards · Compact</h3></div>
        <p className="text-sm text-fd-muted-foreground">Use for related resources and side panels. Keep the same fields and links, removing only descriptive copy.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{resources.map((item) => <ResourceCard key={item.href} item={item} compact />)}</div>
      </div>
      <div className="rounded-xl border border-dashed border-fd-border p-4 text-sm leading-6 text-fd-muted-foreground">
        <strong className="text-fd-foreground">Pattern contract:</strong> Resolve URLs and metadata from the generated catalog in production. Missing status, tags and description must degrade gracefully. Do not imply that browsing, selecting or previewing a resource installs it.
      </div>
    </section>
  );
}
