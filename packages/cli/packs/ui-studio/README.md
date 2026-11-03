# Universal UI Studio & Prototype Suite

A complete, reviewable BAG loadout recipe. The machine-readable composition is defined in [catalog/loadouts/ui-studio.json](../../catalog/loadouts/ui-studio.json).

**Best for:** Any frontend, web, or mobile codebase (Expo, Next.js, Vite, Vue, Svelte) needing a clean design system, interactive visual prototype, screen specifications, and technical debt audit.

## Recipe Workflow

1. **Establish the `design/` Directory:** Create `design/DESIGN.md` following the standard design token schema (colors, typography, radii, surfaces, guidelines).
2. **Configure or Auto-Discover Routes:** Provide `design/studio.config.json` or let the engine auto-discover routes and components.
3. **Audit Dead Code & Gaps:** Identify unrouted screens, leftover template boilerplate (`modal.tsx`, `(tabs)`), and mock state slices.
4. **Generate the Standalone Studio:** Run `ui-studio.mjs` to generate a self-contained `.html` studio featuring mobile frame previews, specs explorer, docs, storybook, and health overlay.
5. **Add Local Project Command:** Add `"ui:studio": "node scripts/ui-studio.mjs"` to `package.json`.

**Acceptance criteria:**
- Single-file standalone HTML studio runs in any browser with zero network or server dependencies.
- Design tokens align with actual codebase styling.
- All routes and components documented with contracts and status indicators.
- Dead features clearly identified with prioritized remediation actions.

## Delegate — use this loadout

```text
Plan an integration of BAG loadout "ui-studio" for my existing project. First inspect my actual repo structure and design tokens. Draft design/DESIGN.md matching product reality, configure design/studio.config.json with routes and audit findings, and generate the interactive prototype studio.
```

[All loadouts](../README.md).
