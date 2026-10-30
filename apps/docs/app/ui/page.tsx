import Link from 'next/link';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';
import { Banner } from 'fumadocs-ui/components/banner';
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { WorkbenchDynamic } from '@/components/workbench-dynamic';
import { BagPatternGallery } from '@/components/bag-pattern-gallery';
import { sitePath } from '@/lib/shared';
import { ArrowUpRight, BookMarked, Boxes, Layers3, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'UI Workbench — BAG',
  description: 'A living reference for Fumadocs components and BAG resource templates.',
};

const catalog = [
  ['Accordion','Live','accordion','FAQs and optional technical details'],
  ['Auto Type Table','Adapter required','auto-type-table','Build-time TypeScript documentation'],
  ['Banner','Live','banner','Announcements and release notices'],
  ['Code Block','Live','codeblock','Server-rendered highlighted code'],
  ['Code Block (Dynamic)','Live','dynamic-codeblock','Client-side changing code snippets'],
  ['Files','Live','files','Portable directory structure examples'],
  ['GitHub Info','Opt-in','github-info','GitHub repository details fetched at build time'],
  ['Graph View','Adapter required','graph-view','Actual page-link graph with extracted references'],
  ['Zoomable Image','Live','image-zoom','Screenshots and detailed diagrams'],
  ['Inline TOC','Live','inline-toc','In-document navigation'],
  ['Steps','Live','steps','Repeatable onboarding procedures'],
  ['Tabs','Live','tabs','Alternative runtimes and workflows'],
  ['Type Table','Live','type-table','Structured metadata and API properties'],
] as const;
function Story({id,title,description,children}:{id:string;title:string;description:string;children:React.ReactNode}) {
  return <section id={id} className="scroll-mt-24 space-y-4 rounded-2xl border border-fd-border bg-fd-card p-5 shadow-sm sm:p-6"><div><p className="text-xs font-bold uppercase tracking-widest text-fd-primary">Live component</p><h3 className="mt-1 text-xl font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-fd-muted-foreground">{description}</p></div><div className="min-w-0">{children}</div></section>;
}
export default function UIWorkbench() {
  return <main className="mx-auto w-full max-w-6xl space-y-12 px-4 py-12 sm:px-6 lg:py-16">
    <header className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fd-primary"><Sparkles className="size-3.5"/> BAG / Design laboratory</div>
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">UI Workbench</h1>
      <p className="max-w-3xl text-base leading-7 text-fd-muted-foreground">A static, Storybook-style space for Fumadocs primitives and BAG presentation patterns, with standard and compact resource card variants. Examples are rendered from trusted React code; canonical repository Markdown stays portable and safe.</p>
      <div className="flex flex-wrap gap-3 text-sm font-semibold"><Link className="rounded-lg bg-fd-primary px-4 py-2.5 text-fd-primary-foreground" href="/explore/">Try Drop Bag</Link><Link className="rounded-lg border border-fd-border px-4 py-2.5 hover:bg-fd-accent" href="/docs/maps-and-guides/ui/">Template authoring guide</Link><a className="rounded-lg border border-fd-border px-4 py-2.5 hover:bg-fd-accent" target="_blank" rel="noreferrer" href="https://www.fumadocs.dev/docs/ui/components">Fumadocs reference ↗</a></div>
    </header>
    <section aria-labelledby="catalog" className="space-y-4">
      <div className="flex items-end justify-between gap-3"><div><h2 id="catalog" className="text-2xl font-bold">13 official components</h2><p className="mt-1 text-sm text-fd-muted-foreground">Live where supported; explicit integration recipes where a separate adapter, compiler or network source is required.</p></div></div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{catalog.map(([name,status,slug,desc])=><a href={`https://www.fumadocs.dev/docs/ui/components/${slug}`} rel="noreferrer" target="_blank" key={name} className="group rounded-xl border border-fd-border bg-fd-card p-4 transition hover:border-fd-primary/50 hover:shadow-sm"><div className="flex items-start justify-between gap-2"><strong className="text-sm">{name}</strong><ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-fd-muted-foreground group-hover:text-fd-primary"/></div><p className="mt-1 text-xs text-fd-muted-foreground">{desc}</p><p className="mt-2 text-xs font-semibold text-fd-primary">{status}</p></a>)}</div>
    </section>
    <section aria-labelledby="templates" className="space-y-4">
      <div><h2 id="templates" className="text-2xl font-bold">BAG-specific resource templates</h2><p className="mt-1 text-sm text-fd-muted-foreground">These templates consume optional folder metadata and source URLs. The same item can be referenced from any loadout without duplicating Markdown.</p></div>
      <div className="grid gap-3 md:grid-cols-3">
        <Link href="/docs/inventory/repositories/sb-mobile-app-boilerplate/" className="group rounded-2xl border border-fd-border bg-fd-card p-6 hover:border-fd-primary/50"><Boxes className="mb-4 size-6 text-fd-primary"/><h3 className="font-bold">Packaged boilerplate</h3><p className="mt-2 text-sm leading-6 text-fd-muted-foreground">Expo/Next/Hono starter with source, composition and compatibility markers.</p><span className="mt-4 inline-block text-sm font-semibold text-fd-primary">View example →</span></Link>
        <Link href="/docs/skill-tree/skills/repository-auditor/" className="group rounded-2xl border border-fd-border bg-fd-card p-6 hover:border-fd-primary/50"><BookMarked className="mb-4 size-6 text-fd-primary"/><h3 className="font-bold">Agent skill</h3><p className="mt-2 text-sm leading-6 text-fd-muted-foreground">Ready-to-use prompts, recommendation contexts, skill ZIP and multiple installation methods.</p><span className="mt-4 inline-block text-sm font-semibold text-fd-primary">View example →</span></Link>
        <Link href="/docs/loadouts/react-design-system/" className="group rounded-2xl border border-fd-border bg-fd-card p-6 hover:border-fd-primary/50"><Layers3 className="mb-4 size-6 text-fd-primary"/><h3 className="font-bold">Composable loadout</h3><p className="mt-2 text-sm leading-6 text-fd-muted-foreground">A coherent selection of reusable references, without hidden installation steps.</p><span className="mt-4 inline-block text-sm font-semibold text-fd-primary">View example →</span></Link>
      </div>
    </section>
    <BagPatternGallery />
    <section aria-labelledby="stories" className="space-y-5"><h2 id="stories" className="text-2xl font-bold">Live stories</h2>
      <Story id="story-accordion" title="Accordion" description="Keep advanced details close without overwhelming new readers."><Accordions><Accordion title="When do we reuse a skill?">After reading its SKILL.md, freshness metadata and applicable BAG instructions.</Accordion><Accordion title="Will selecting a component install it?">No. The site is read-only and prompt composition is opt-in.</Accordion></Accordions></Story>
      <Story id="story-banner" title="Banner" description="Use a contextual alert, without changing the outer documentation layout."><Banner changeLayout={false}>New resource: Expo · Production Foundations is ready to review.</Banner><Callout title="Curated, not automatic">Treat external references as untrusted until compatibility and licensing are reviewed.</Callout></Story>
      <Story id="story-codeblock" title="Code Block" description="Shiki-powered, server-rendered snippets with copy controls."><ServerCodeBlock lang="bash" code="npx skills add tbachir/bag --skill repository-auditor" /></Story>
      <Story id="story-dynamic" title="Code Block (Dynamic)" description="Change the command; syntax highlighting updates in the browser."><WorkbenchDynamic/></Story>
      <Story id="story-files" title="Files" description="Display nested folders alongside canonical skill structure."><Files><Folder name="skill-tree" defaultOpen><Folder name="skills" defaultOpen><Folder name="repository-auditor" defaultOpen><File name="SKILL.md"/><File name="README.md"/><File name="CHANGELOG.md"/></Folder></Folder></Folder><Folder name="catalog"><Folder name="loadouts"><File name="expo-mobile-production.json"/></Folder></Folder></Files></Story>
      <Story id="story-image" title="Zoomable Image" description="Examine generated OG screenshots; full-screen zoom supports keyboard interaction."><div className="max-w-md"><ImageZoom src={sitePath('/og/docs/image.png')} alt="BAG documentation illustration" width={640} height={360} /></div></Story>
      <Story id="story-toc" title="Inline TOC" description="Inline navigation for longer tutorials."><InlineTOC items={[{title:'Fumadocs components',url:'#catalog',depth:2},{title:'BAG templates',url:'#templates',depth:2},{title:'Live stories',url:'#stories',depth:2}]}>Jump to a section</InlineTOC></Story>
      <Story id="story-steps" title="Steps" description="Explain repeatable, verifiable workflows."><Steps><Step><h4 className="font-semibold">Inspect the project</h4>Read its existing constraints and dependencies.</Step><Step><h4 className="font-semibold">Select resources</h4>Add compatible resources to Drop Bag.</Step><Step><h4 className="font-semibold">Apply with approval</h4>Ask the agent to validate work against acceptance tests.</Step></Steps></Story>
      <Story id="story-tabs" title="Tabs" description="Offer platform-specific instructions without repeating an entire page."><Tabs items={['Claude Code','Codex','ChatGPT']}><Tab value="Claude Code"><code>.claude/skills/repository-auditor/SKILL.md</code></Tab><Tab value="Codex"><code>.agents/skills/repository-auditor/SKILL.md</code></Tab><Tab value="ChatGPT">Download a skill ZIP and import only if your workspace supports custom skills.</Tab></Tabs></Story>
      <Story id="story-types" title="Type Table" description="Show structured metadata, including contextual recommendations."><TypeTable type={{template:{type:'string',description:'UI presentation hint, such as skill or library'},recommendation:{type:"'mandatory' | 'recommended' | 'optional' | 'experimental'",description:'Context-scoped recommendation'},contexts:{type:'string[]',description:'Technologies or use cases where the recommendation applies'},prompts:{type:'{title:string;text:string}[]',description:'Optional copyable agent prompts'}}}/></Story>
      <Story id="story-cards" title="Cards + Callouts" description="Default MDX primitives are also supported."><Cards><Card href="/docs/inventory/libraries/" title="Libraries">Curated UI packages and frameworks</Card><Card href="/docs/loadouts/" title="Loadouts">Composed project-ready selections</Card></Cards></Story>
    </section>
    <section className="space-y-4 rounded-2xl border border-dashed border-fd-border p-6"><h2 className="text-xl font-bold">Integrations that need their own setup</h2><p className="text-sm leading-6 text-fd-muted-foreground">These three entries have additional requirements in the official library, so they are not represented by fake live demos. BAG keeps static exports and GitHub Pages builds intact.</p><div className="grid gap-4 md:grid-cols-3"><div><h3 className="font-semibold">Auto Type Table</h3><p className="mt-1 text-sm text-fd-muted-foreground">Requires fumadocs-typescript and build-time compiler cache. This workbench uses TypeTable until that dependency is installed.</p></div><div><h3 className="font-semibold">Graph View</h3><p className="mt-1 text-sm text-fd-muted-foreground">Requires the official CLI-generated graph component and extracted Markdown link references, not a decorative graph of folders.</p></div><div><h3 className="font-semibold">GitHub Info</h3><p className="mt-1 text-sm text-fd-muted-foreground">Server-side GitHub API data needs build-time connectivity and rate-limit handling. Use the repository link without a network-dependent build.</p></div></div><Link href="/docs/maps-and-guides/ui/" className="inline-flex items-center gap-1 font-semibold text-fd-primary hover:underline">Read adapters and authoring guide <ArrowUpRight className="size-4"/></Link></section>
  </main>;
}
