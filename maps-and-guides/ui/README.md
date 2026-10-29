# BAG UI component library

BAG's [UI Workbench](https://tbachir.github.io/bag/ui/) is a Storybook-style living showroom hosted inside the static Fumadocs documentation site. It is **not** the standalone Storybook framework or a second deployment.

## Component inventory

Fumadocs provides default MDX components (Cards, Callouts, headings, code blocks) and opt-in Accordion, Tabs, Steps, Files, Type Table, Banner, Zoomable Image, Inline TOC, GitHub Info, Graph View, Root Toggle, and Auto Type Table components. Some components require additional packages, hooks, or layout wiring; see [official components documentation](https://www.fumadocs.dev/docs/ui/components).

The docs app registers Accordion, Tabs, Steps, Files and Type Table, alongside default MDX components, in `apps/docs/components/mdx.tsx`. For a runnable example of these registered components see `apps/docs/app/ui/page.tsx`. This page is built as part of the static export.

## Creating a new visual template

1. Decide whether it is a **presentational component** (Cards, Tabs, Files) or a **data-driven template** (library, skill, task, loadout).
2. Keep the canonical content in the existing BAG folders. Do not move source Markdown into the documentation app.
3. Add a typed React template to `apps/docs/components/` that accepts sanitized props; no arbitrary source JSX execution.
4. Add a representative story to `apps/docs/app/ui/page.tsx` with realistic data and at least one accessibility edge case.
5. If adding a trusted MDX primitive, register its exports explicitly in `apps/docs/components/mdx.tsx`. Do not blindly re-export server-only or browser-only components.
6. Link to the canonical item rather than duplicating its full documentation. Preserve recursive folder navigation.
7. Test light/dark mode, keyboard navigation, viewport widths, static export and GitHub Pages `/bag` prefix.

## Using existing components

For a trusted, hand-authored MDX page:

```mdx
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Files, Folder, File } from 'fumadocs-ui/components/files';

<Tabs items={['Install', 'Configure']}>
  <Tab value="Install">Use an approved setup procedure.</Tab>
  <Tab value="Configure">Adjust only reviewed configuration.</Tab>
</Tabs>

<Files>
  <Folder name="docs"><File name="README.md" /></Folder>
</Files>
```

For a **BAG resource Markdown file**, use ordinary portable Markdown. The current compiler escapes embedded HTML/JSX to ensure that untrusted source never runs as React. Prefer template metadata and app-side rendering rather than changing that boundary.

## Verification

From `apps/docs` run `pnpm test:unit`, `pnpm types:check`, `pnpm build`, `pnpm content:check`, and `pnpm test:e2e`. Validate the default export and the GitHub Pages build with `DOCS_BASE_PATH=/bag`. Do not claim visual examples were browser-tested until these checks have actually run.

See also [Fumadocs Components](https://www.fumadocs.dev/docs/ui/components), [Steps](https://www.fumadocs.dev/docs/ui/components/steps), [Tabs](https://www.fumadocs.dev/docs/ui/components/tabs), and [Customize UI](https://www.fumadocs.dev/docs/guides/customize-ui).
