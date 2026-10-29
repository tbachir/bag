import Link from 'next/link';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';

export const metadata = {
  title: 'UI Workbench — BAG',
  description: 'Living Fumadocs component showcase and UI template authoring guide.',
};

const catalog = [
  ['Cards and Callouts', 'Highlight resources, navigation and important decisions', 'fumadocs-ui/components/card · fumadocs-ui/components/callout'],
  ['Tabs', 'Switch between implementations or platforms', 'fumadocs-ui/components/tabs'],
  ['Steps', 'Explain a sequential workflow', 'fumadocs-ui/components/steps'],
  ['Accordions', 'Reveal optional guidance and FAQs', 'fumadocs-ui/components/accordion'],
  ['Files', 'Show folder trees and source locations', 'fumadocs-ui/components/files'],
  ['TypeTable', 'Document structured API and metadata contracts', 'fumadocs-ui/components/type-table'],
  ['Code blocks', 'Copyable examples with syntax highlighting', 'fumadocs-ui/mdx'],
  ['Banner', 'Site-level contextual messages', 'fumadocs-ui/components/banner'],
  ['Zoomable Image', 'Inspect screenshots and diagrams', 'fumadocs-ui/components/image'],
  ['Inline TOC', 'Navigate long pages', 'fumadocs-ui/components/inline-toc'],
  ['GitHub Info', 'Display repository metadata', 'fumadocs-ui/components/github-info'],
  ['Graph View', 'Visualize connected documentation pages', 'fumadocs-ui/components/graph-view'],
  ['Root Toggle', 'Switch documentation roots', 'fumadocs-ui/components/root-toggle'],
  ['Auto Type Table', 'Generate API type documentation', 'fumadocs-ui/components/auto-type-table'],
] as const;

export default function UIWorkbench() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-fd-primary">BAG / UI system / Component library</p>
        <h1 className="text-4xl font-bold tracking-tight">UI Workbench</h1>
        <p className="max-w-3xl text-fd-muted-foreground">An integrated, Storybook-style showcase for the Fumadocs components used by BAG. The page is included in the regular static export; it does not depend on a Storybook development server.</p>
        <div className="flex flex-wrap gap-3 text-sm"><Link className="underline" href="/docs/maps-and-guides/ui/">UI authoring guide</Link><a className="underline" href="https://www.fumadocs.dev/docs/ui/components" target="_blank" rel="noreferrer">Official Fumadocs component catalog</a></div>
      </header>
      <section aria-labelledby="components-heading" className="space-y-3">
        <h2 id="components-heading" className="text-2xl font-semibold">Available components</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {catalog.map(([name, purpose, importPath]) => <article key={name} className="rounded-xl border border-fd-border bg-fd-card p-4"><h3 className="font-semibold">{name}</h3><p className="mt-1 text-sm text-fd-muted-foreground">{purpose}</p><code className="mt-2 block break-all text-xs">{importPath}</code></article>)}
        </div>
        <p className="text-sm text-fd-muted-foreground">The list is a reference index; the live stories below cover representative components. Optional integrations and layout-specific components require configuration.</p>
      </section>
      <section className="space-y-4" aria-label="Live component stories">
        <h2 className="text-2xl font-semibold">Live examples</h2>
        <div className="rounded-xl border border-fd-border p-5 space-y-3">
          <h3 className="font-semibold">Cards and Callouts</h3>
          <Cards><Card title="Explore resources" href="/docs/inventory/">Go to BAG Inventory</Card><Card title="Learn authoring" href="/docs/maps-and-guides/ui/">Create a new template</Card></Cards>
          <Callout title="Safety first">Catalog entries are documentation, not executable agent instructions.</Callout>
        </div>
        <div className="rounded-xl border border-fd-border p-5 space-y-3">
          <h3 className="font-semibold">Tabs</h3>
          <Tabs items={['Markdown', 'MDX']}><Tab value="Markdown">Canonical repository source stays portable.</Tab><Tab value="MDX">Trusted app-authored pages can render React components.</Tab></Tabs>
        </div>
        <div className="rounded-xl border border-fd-border p-5 space-y-3">
          <h3 className="font-semibold">Steps</h3>
          <Steps><Step><h4 className="font-semibold">Choose a resource</h4><p>Start from the canonical Markdown item.</p></Step><Step><h4 className="font-semibold">Select a presentation</h4><p>Use the simplest component suitable for the content.</p></Step><Step><h4 className="font-semibold">Validate</h4><p>Check the generated site and mobile rendering.</p></Step></Steps>
        </div>
        <div className="rounded-xl border border-fd-border p-5 space-y-3">
          <h3 className="font-semibold">Accordions</h3>
          <Accordions><Accordion title="Can items contain arbitrary MDX?">No. Repository Markdown is escaped intentionally; only trusted app-authored MDX executes JSX.</Accordion><Accordion title="Does this require a server?">No. The showcase is exported as static HTML.</Accordion></Accordions>
        </div>
        <div className="rounded-xl border border-fd-border p-5 space-y-3">
          <h3 className="font-semibold">Files</h3>
          <Files><Folder name="apps" defaultOpen><Folder name="docs" defaultOpen><Folder name="app"><File name="ui/page.tsx" /></Folder><Folder name="components"><File name="mdx.tsx" /></Folder></Folder></Folder><Folder name="maps-and-guides"><Folder name="ui"><File name="README.md" /></Folder></Folder></Files>
        </div>
        <div className="rounded-xl border border-fd-border p-5 space-y-3">
          <h3 className="font-semibold">TypeTable</h3>
          <TypeTable type={{name:{type:'string',description:'Display title',required:true},description:{type:'string',description:'Optional summary'},tags:{type:'string[]',description:'Optional categories'}}} />
        </div>
      </section>
    </main>
  );
}
