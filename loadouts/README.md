# 🧰 Loadouts — Ready for the next quest

A **loadout** is a purpose-built set of **links to items already documented in BAG**, plus the order in which to use them. It is a recipe, not a copied collection or an automatic installer.

Each loadout should include a goal, target environment, prerequisites, selected items, setup sequence, verification steps, and limitations.

## Machine-readable loadouts

The CLI composes versioned [loadout manifests](../catalog/README.md). The default `plan`/`equip` behavior is read-only; `--apply` copies only explicitly listed reviewed local templates, skips existing destinations, and does not install external tools.

```bash
node spellbook/scripts/bag.mjs loadouts --json
node spellbook/scripts/bag.mjs plan ai-coding --target ../my-project
```

## Available loadouts

| Loadout | Quest |
| --- | --- |
| [AI Coding](ai-coding/README.md) | Prepare a safe baseline for coding with AI agents |
| [Node Project](../catalog/loadouts/node-project.json) | Add simple Node/TypeScript config templates without installing packages |

Future loadouts might target Windows development, Next.js, Expo mobile, offline-first systems, self-hosting, or observability. Add them when concrete, reviewed items exist.

## Production-oriented compositions

- [Expo Production Foundations](expo-mobile-production/README.md) — Expo/Next/Hono, auth, design and test reviews.
- [React Design System](react-design-system/README.md) — shadcn, ReUI, DESIGN.md and UI audits.
- [Fumadocs Knowledge Base](fumadocs-knowledge-base/README.md) — task-first docs and static agent-friendly references.

Open the [Drop Bag](https://tbachir.github.io/bag/explore/) to compose any of these with individual catalog items; selections are never executed automatically.
