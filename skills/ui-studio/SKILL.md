---
name: ui-studio
description: Inspect any project, extract or validate its design/DESIGN.md, inventory screens and components, audit dead features, and generate an interactive UI prototype and documentation studio.
---

# UI Studio & Prototype Generator

> Universal BAG Skill for Frontend, Mobile, and Web Applications.

Generate a self-contained, interactive HTML Prototype Studio for any application, complete with a mobile/desktop device frame, screen specifications, component storybook, and dead-features audit.

## When to use

Use this skill when:
- Asked to create an interactive HTML prototype or visual sandbox from an existing application.
- Standardizing a project's design system using the `design/DESIGN.md` convention.
- Generating developer documentation, route specifications, or a component catalog.
- Auditing a frontend codebase for dead features, placeholder boilerplate, unmounted screens, and technical debt.
- Preparing design handoffs or stakeholder presentations without spinning up local dev servers or databases.

## The `design/` Directory Standard

Any repository adopting the UI Studio standard organizes its design artifacts into a dedicated `design/` folder:

```text
my-project/
├── design/
│   ├── DESIGN.md           # Visual language: colors, typography, radii, rules
│   └── studio.config.json  # (Optional) Route inventory, components, audit items
└── ui-studio.html          # Self-contained generated prototype
```

### 1. `design/DESIGN.md` Contract
Adheres to the `google-labs-code/design.md` schema with YAML frontmatter:
- `name`: Brand or product name.
- `colors`: Semantic tokens (`background`, `foreground`, `surface`, `border`, `accent`, `deep`, inks).
- `typography`: Scale mappings (`display-hero`, `display-title`, `body`, `caption`, `eyebrow`).
- `rounded`: Radius rungs (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`).
- Markdown prose: Design principles, component rules, accessibility requirements, and do's/don'ts.

### 2. `design/studio.config.json` Contract
```json
{
  "schemaVersion": 1,
  "meta": { "name": "App Name", "stack": "Expo | Next.js | Vite | Generic" },
  "personas": [
    { "id": "user", "name": "User", "ink": "#...", "soft": "#..." }
  ],
  "routes": [
    {
      "path": "/dashboard",
      "title": "Dashboard",
      "group": "core",
      "icon": "📊",
      "health": "live | mock | orphan | dead | device",
      "healthLabel": "Production UI",
      "file": "app/dashboard.tsx",
      "contract": "DashboardDTO",
      "status": "Fully verified.",
      "missing": "None.",
      "drawer": true
    }
  ],
  "components": [
    {
      "id": "card",
      "name": "Card",
      "category": "Molecules",
      "file": "components/card.tsx",
      "props": { "tone": "default", "title": "Card Title" },
      "tones": ["default", "raised", "highlight"]
    }
  ],
  "audit": [
    {
      "component": "app/modal.tsx",
      "status": "dead",
      "issue": "Starter template placeholder.",
      "action": "Delete file.",
      "priority": "Medium"
    }
  ]
}
```

## Agent Workflow

### Step 1: Inspect Project Reality
1. Inspect `package.json` to identify framework (`expo`, `next`, `vite`, `nuxt`, etc.).
2. Locate existing design tokens in CSS (`global.css`, `tailwind.config`, `theme.ts`, `tokens.ts`).
3. Scan route directories (`app/`, `pages/`, `src/routes/`).
4. Identify dead features and technical debt:
   - Leftover starter redirects (e.g. `(tabs)/_layout.tsx`).
   - Unlinked template modals (e.g. `modal.tsx`).
   - Unmounted screens (components created in `features/` or `components/` but absent from routing).
   - In-memory mock stores (`createMockSlice`, local state) versus server-verified queries.

### Step 2: Establish `design/DESIGN.md`
If `design/DESIGN.md` or `DESIGN.md` does not exist:
- Extract tokens and draft `design/DESIGN.md` strictly matching the actual code.
- Never invent imaginary tokens; document what the codebase actually uses.

### Step 3: Run UI Studio Generator
Execute the universal BAG generator:
```bash
# Using BAG CLI
node <path-to-bag>/spellbook/scripts/ui-studio.mjs --target ./path/to/app --out ./prototype.html

# Or using project npm/pnpm script if equipped:
pnpm ui:studio
```

### Step 4: Verify Generated Artifacts
1. Ensure the generated `.html` opens cleanly in any browser with zero runtime syntax errors.
2. Confirm the 5 integrated tabs function properly:
   - 📱 **Mobile Prototype:** Switching routes, drawer navigation, perspective changes, and health overlays.
   - 📋 **Specs & Routes:** Route parameters and Markdown/JSON export buttons.
   - 📑 **Architecture Docs:** Rendering `DESIGN.md` principles and guidelines.
   - 🎨 **Storybook Kit:** Interactive component canvas, prop controls, and code snippets.
   - ⚠️ **Dead Features & Audit:** Actionable technical debt matrix.
