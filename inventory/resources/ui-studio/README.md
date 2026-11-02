# UI Studio — Universal Interactive Prototype & Documentation Generator

> Portable HTML Studio with mobile frame, route specs, component storybook, and dead-features audit.

- **Category:** spellbook | skill-tree | inventory
- **Status:** ready
- **Official source:** `spellbook/scripts/ui-studio.mjs`
- **Documentation:** `skill-tree/skills/ui-studio/SKILL.md`
- **License:** MIT
- **Last reviewed:** 2026-11-02
- **Compatibility:** Any web, mobile or frontend repository (React Native/Expo, Next.js, Vite, Vue, Svelte, HTML). Node.js 20+.

## Why keep it?

Frontend codebases frequently suffer from:
1. Fragmented documentation: routes, specs, and design systems living in separate disconnected tools.
2. Silent technical debt: unmounted screens, dead starter boilerplate (`modal.tsx`, `(tabs)`), and prototype mock slices persisting unnoticed.
3. Heavy barrier to preview: stakeholders and reviewers must install dependencies, configure databases, and spin up dev servers just to inspect UI behavior.

**UI Studio** compiles any frontend project into a single, self-contained, offline-first `.html` application that runs natively in any browser with zero setup.

## Features

- **📱 Interactive Device Prototype:** Embedded responsive frame (iPhone, tablet, desktop) with dynamic island, status bar, and sliding drawer.
- **🛡️ Live Health Overlay:** Toggleable visual badges highlighting the implementation status of every screen element (Live Server, Mock Slice, Orphan, Dead Boilerplate, Device Native).
- **📋 Screen Specifications:** Route contracts, view models, inputs, and one-click Markdown/JSON exporters.
- **📑 Architecture Guide:** Direct rendering of the project's `design/DESIGN.md` visual system and invariants.
- **🎨 Component Storybook:** Interactive workbench with dynamic prop controls, live preview, and auto-generated TSX code snippets.
- **⚠️ Tech Debt Matrix:** Detailed audit table flagging orphaned screens, legacy redirects, and server-parity gaps with actionable remediation plans.

## Quick start

```bash
# In BAG:
node spellbook/scripts/ui-studio.mjs --target ../my-app --out ../my-app/ui-studio.html

# In a project configured with BAG recipes:
pnpm ui:studio
```

## Related gear

- [DESIGN.md Resource](../design-md/README.md)
- [UI Studio Skill](../../../skill-tree/skills/ui-studio/SKILL.md)
- [UI Studio Recipe Loadout](../../../loadouts/ui-studio/README.md)
