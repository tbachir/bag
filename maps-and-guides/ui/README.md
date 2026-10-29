# BAG UI component library and resource templates

The [UI Workbench](https://tbachir.github.io/bag/ui/) is a Storybook-style gallery **inside** the static Fumadocs site. It covers the 13 components from the [official Fumadocs component catalog](https://www.fumadocs.dev/docs/ui/components), documenting which are live and which require a separate integration. It is not the independent Storybook toolchain.

## Existing live stories

Accordion, Banner, Code Block (server), Dynamic Code Block (client), Files, Zoomable Image, Inline TOC, Steps, Tabs and Type Table, plus default Cards and Callouts. Story source is [apps/docs/app/ui/page.tsx](../../apps/docs/app/ui/page.tsx). Component exports are explicit in [components/mdx.tsx](../../apps/docs/components/mdx.tsx).

## Additional integrations (not silently enabled)

| Component | Needed before using in production | Official guide |
| --- | --- | --- |
| Auto Type Table | Install `fumadocs-typescript`, configure `createGenerator`, ensure build-time FS and lockfile integrity | [Auto Type Table](https://www.fumadocs.dev/docs/ui/components/auto-type-table) |
| Graph View | Run `npx @fumadocs/cli@latest add graph-view`, extract real link references, build graph data, validate static export | [Graph View](https://www.fumadocs.dev/docs/ui/components/graph-view) |
| GitHub Info | Server-render repository information at build time, handle GitHub API limits and token injection securely; do not put tokens in client JS | [GitHub Info](https://www.fumadocs.dev/docs/ui/components/github-info) |

Do not call folder nesting a semantic relationship graph. Do not replace TypeTable with Auto Type Table without verifying compiler support.

## BAG template architecture

Each canonical directory may optionally include `bag.item.json` with `type`, `template`, `recommendation`, `contexts`, `tags`, `technologies`, `useCases`, `prompts` and `navigation`. A folder without this file still compiles as a normal recursive item. The configuration is parsed strictly at build time. `ResourceShowcase` renders an optional resource hero on the original generated documentation page, without copying the README into the app.

| Template | Example | What appears |
| --- | --- | --- |
| `boilerplate` | [Expo/Next/Hono starter](../../inventory/repositories/sb-mobile-app-boilerplate/README.md) | Source, target contexts, trade-offs and Drop Bag action |
| `skill` | [Repository Auditor](../../skill-tree/skills/repository-auditor/README.md) | Commands, agent-specific paths, ZIP and prompts |
| `library` | [shadcn/ui](../../inventory/libraries/shadcn-ui/README.md) | Technology, use cases, compatibility and source |
| `resource` | [DESIGN.md](../../inventory/resources/design-md/README.md) | Reference and usage notes |
| `loadout` | [Expo Production](../../loadouts/expo-mobile-production/README.md) | Composition and a link to Drop Bag |

Set recommendation to `mandatory` **only when the scope is named by `contexts`**. It is not a blanket instruction: e.g., a Fumadocs-specific review skill may be mandatory for Fumadocs docs changes, but not for arbitrary React or Expo projects.

### Create a new skill template

1. Start from [skill template](../../skill-tree/skills/_template/SKILL.md), ensure valid frontmatter, and add a README with usage, safety notes and one delegation prompt.
2. Add optional `bag.item.json` in the same directory:
   ```json
   {
     "type": "skill", "template": "skill", "recommendation": "recommended",
     "contexts": ["react", "expo"],
     "tags": ["ui"], "prompts": [
       {"title": "Audit this screen", "text": "Read the skill, inspect my UI and give prioritized actionable findings."}
     ]
   }
   ```
3. Add a meaningful real-world prompt, not a broad instruction to change everything.
4. Run `node spellbook/scripts/validate.mjs`, `node spellbook/scripts/bag.mjs validate`, `pnpm test:unit` and the docs static build/tests.
5. Confirm the ZIP is generated at `/files/skills/<slug>.zip`; check extracted files include `<slug>/SKILL.md`. Only offer ZIP import on clients where the feature exists.

### Agent installation

The [skills CLI](https://www.npmjs.com/package/skills) can install skills from GitHub:

```bash
npx skills add tbachir/bag --list
npx skills add tbachir/bag --skill repository-auditor
npx skills add tbachir/bag --skill repository-auditor -a claude-code
npx skills add tbachir/bag --skill repository-auditor -a codex
```

For manual project-level installs, copy the **whole skill folder** to `.claude/skills/<slug>/` (Claude Code) or `.agents/skills/<slug>/` (Codex). The exact supported paths depend on client/version. ChatGPT skill ZIP uploads are not universally available: upload only where the active ChatGPT interface exposes custom skills, otherwise attach the ZIP or Markdown as reference files. Neither a skill link nor a ZIP automatically activates instructions in an unrelated project.

## Drop Bag architecture

- The build-time generator reads `catalog/items/*.json` and `catalog/loadouts/*.json` as the canonical composition registry. Loadout cards are derived, not manually duplicated in the website.
- The Explorer persists up to 100 selected, validated BAG paths in the current browser's local storage. No account, cookies, external search API or server state is needed.
- A resource detail page and the Explorer share a single client-side selection hook. Prompt generation resolves selected paths to indexed items even when their filters are hidden.
- Prompts explicitly instruct agents to inspect the target project's files and rules and to request approval for installation, copying, production actions or destructive changes.

## General authoring rules

Preserve the original Markdown and nested folders; do not allow JSX embedded in resource Markdown to execute. Use typed server-side components for actual React presentation. New templates should render missing metadata gracefully, use semantic headings and accessible buttons, work in light/dark mode, and pass GitHub Pages `/bag` static export.

## Verification

From `apps/docs`: `pnpm test:unit`, `pnpm types:check`, `pnpm build`, `pnpm content:check`, then `pnpm test:e2e`. Repeat production export with `DOCS_BASE_PATH=/bag`. Archive support must not depend on server execution at request time.
