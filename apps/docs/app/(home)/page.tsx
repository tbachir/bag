import Link from 'next/link';
import { ArrowRight, BookOpenText, Boxes, Compass, Cpu, Layers3, Sparkles, WandSparkles } from 'lucide-react';

const primitives = [
  { name: 'Agent Skills', description: 'Modular AI capabilities conforming to the open standard.', href: '/docs/skills/', icon: Sparkles },
  { name: 'MCP Hub', description: 'Model Context Protocol servers for Claude, Cursor, and Gemini.', href: '/docs/mcp/', icon: Cpu },
  { name: 'Recipes', description: 'Actionable task blueprints and automation workflows.', href: '/docs/recipes/', icon: WandSparkles },
  { name: 'Templates', description: 'Configurations, dotfiles, and application starters.', href: '/docs/templates/', icon: Boxes },
  { name: 'Packs', description: 'Curated full-stack bundles ready to plan and equip.', href: '/docs/packs/', icon: Layers3 },
  { name: 'Guides & Docs', description: 'Diátaxis-aligned tutorials, how-tos, and architecture notes.', href: '/docs/guides/', icon: Compass },
];

export default function HomePage() {
  return (
    <main className="relative isolate flex-1 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_65%)]" />
      <div className="mx-auto w-full max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:pt-32">
        <section className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-fd-muted-foreground shadow-sm">
            <span aria-hidden="true" className="size-2 rounded-full bg-fd-primary" />
            Agent-first Developer Inventory
          </div>
          <h1 className="mt-8 text-balance text-5xl font-extrabold tracking-[-0.055em] text-fd-foreground sm:text-6xl lg:text-7xl">
            Everything you need.<br /><span className="text-fd-primary">Nothing you don't.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-fd-muted-foreground sm:text-lg">
            BAG is a curated ecosystem of Agent Skills, MCP servers, automation recipes, and templates.
            Equip what works, automate with confidence, and elevate your development journey.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/explore/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-fd-border bg-fd-card px-5 py-3 text-sm font-semibold text-fd-foreground hover:bg-fd-accent">
              Inventory Explorer <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/docs/" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-ring">
              Browse Documentation <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/docs/guides/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-fd-border bg-fd-card px-5 py-3 text-sm font-semibold text-fd-foreground transition hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-ring">
              <BookOpenText className="size-4" aria-hidden="true" /> Read the guides
            </Link>
          </div>
        </section>
        <section aria-labelledby="primitives-heading" className="mt-24 sm:mt-32">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-fd-primary">Primitives</p>
              <h2 id="primitives-heading" className="mt-2 text-2xl font-bold tracking-tight text-fd-foreground sm:text-3xl">Explore by building block</h2>
            </div>
            <Link href="/docs/" className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-muted-foreground hover:text-fd-primary">View all docs <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {primitives.map(({ name, description, href, icon: Icon }) => (
              <Link key={name} href={href} className="group rounded-2xl border border-fd-border bg-fd-card/85 p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-fd-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-ring">
                <span className="mb-5 flex size-11 items-center justify-center rounded-xl bg-fd-accent text-fd-primary"><Icon className="size-5" aria-hidden="true" /></span>
                <span className="flex items-center justify-between gap-3 text-lg font-semibold text-fd-foreground">{name}<ArrowRight className="size-4 text-fd-muted-foreground transition group-hover:translate-x-1 group-hover:text-fd-primary" aria-hidden="true" /></span>
                <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">{description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
