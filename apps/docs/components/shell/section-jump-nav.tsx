import Link from 'next/link';

export type SectionJump = { label: string; href: `#${string}` };

export function SectionJumpNav({ sections, title = 'On this page' }: {
  sections: readonly SectionJump[];
  title?: string;
}) {
  return (
    <nav aria-label={title} className="rounded-2xl border border-fd-border bg-fd-card p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">{title}</span>
        {sections.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex min-h-10 items-center rounded-lg border border-fd-border px-3 py-2 text-sm font-medium text-fd-foreground transition hover:border-fd-primary/40 hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
