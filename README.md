# 🎒 BAG — Your Developer's Inventory

> **Your adventure. Your tools. Your rules.**

Like the inventory in a video game, **BAG** is my personal developer's backpack: a curated, evolving collection of the tools, knowledge, configurations, and discoveries worth carrying along my development journey.

It's not just a bookmark collection. It's a **searchable, reusable, AI-friendly inventory** for building software, solving problems, and sharing what works.

**Collect what matters. Equip what you need. Keep leveling up.**

---

## ⚡ The Five First-Class Primitives

BAG organizes resources into five core primitives and comprehensive Diátaxis guides, fully accessible via CLI, web documentation, and MCP:

| Primitive | Directory | Purpose |
| --- | --- | --- |
| 🛠️ **Skills** | [`skills/`](skills/README.md) | 27 portable agent skills (`SKILL.md`) for Codex, Claude Code, Cursor, Antigravity |
| 🔌 **MCP Hub** | [`mcp/`](mcp/README.md) | Model Context Protocol servers (`bag-mcp`, `supabase`, `context7`, `ui-skills`) & client adapters |
| 📋 **Recipes** | [`recipes/`](recipes/README.md) | Actionable, multi-step task blueprints with composer manifests (`auth`, `mobile`) |
| 📦 **Templates** | [`templates/`](templates/README.md) | Clean boilerplates and configuration defaults (`.editorconfig`, `.gitignore`, `fumadocs-starter`) |
| 🎒 **Packs** | [`packs/`](packs/README.md) | Curated loadouts for immediate adoption (`ai-coding`, `fumadocs-knowledge-base`, `ui-studio`) |
| 🗺️ **Guides** | [`guides/`](guides/README.md) | Diátaxis documentation: [Tutorials](guides/tutorials/README.md), [How-To](guides/how-to/README.md), [Concepts](guides/concepts/README.md), [Reference](guides/reference/README.md) |

*(The original seven RPG zones — [`inventory/`](inventory/README.md), `equipment/`, `skill-tree/`, `spellbook/`, `maps-and-guides/`, `loot/`, `loadouts/` — remain fully indexed and preserved for backward compatibility).*

---

## 🛠️ BAG CLI (`@tbachir/bag`)

BAG includes a modern, zero-dependency command-line interface matching the primitives:

```bash
# Search and discover
node packages/cli/bin/bag.mjs search "supabase"
node packages/cli/bin/bag.mjs skill list
node packages/cli/bin/bag.mjs skill show clean-code

# Equip agent skills
node packages/cli/bin/bag.mjs skill add clean-code --target ../my-project -a claude-code

# Setup MCP servers in your editor
node packages/cli/bin/bag.mjs mcp add supabase -a cursor --target ../my-project --apply

# Inspect recipe prompts
node packages/cli/bin/bag.mjs recipe show auth --prompt

# Equip complete packs (dry-run first, safe by default)
node packages/cli/bin/bag.mjs pack plan ai-coding --target ../my-project
node packages/cli/bin/bag.mjs pack equip ai-coding --target ../my-project --apply
```

**Safe by design:** Zero automatic installations, external commands, secret handling, or destructive overwrites. Applying only copies explicitly reviewed files into your target workspace.

---

## 🚀 Quick start

**Browsing:** choose a primitive above or explore the docs web app.

```bash
git clone https://github.com/tbachir/bag.git
cd bag
node spellbook/scripts/find.mjs "mcp"
node spellbook/scripts/validate.mjs
```

No dependencies required for these scripts; use Node.js 20+ (CI uses Node.js 24).

### Documentation website

The [standalone Fumadocs app](apps/docs/README.md) lives in `apps/docs` and runs
separately from the inventory scripts. It requires Node.js 22+ and pnpm.

```bash
cd apps/docs
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000/docs. `pnpm build` compiles tracked content into static files in `out/` for static hosting (GitHub Pages, Vercel, or custom servers).

---

## 🧭 Rules of the bag

- **Useful over exhaustive.** Every kept item needs a reason to exist.
- **Source of truth first.** Link to the original project or official documentation; never mirror blindly.
- **Portable by default.** Keep templates generic and identify OS/tool-specific requirements.
- **Secrets stay outside the bag.** Share `.example` files, not credentials or private data.
- **Make it discoverable.** Favor descriptive names, relative links, short summaries, and reproducible examples.
- **Humans and agents welcome.** Start with [AGENTS.md](AGENTS.md) for automation and [CONTRIBUTING.md](CONTRIBUTING.md) to add items.

---

## 🎯 Starter quests

- [Learn how to pack a new item](guides/tutorials/getting-started.md)
- [Open the item card template](templates/item.md)
- [Explore AI coding pack](packs/ai-coding/README.md)
- [Use the skill template](templates/skills/SKILL.md)
- [Inspect the Clean Code skill](skills/clean-code/SKILL.md)
- [Explore the o2switch Cloud Expert skill](skills/o2switch-cloud/SKILL.md)
- [Storybook: Fondations & Automatisation IA](guides/how-to/storybook-fondations.md)

### 🇫🇷 En bref

**BAG, c'est mon sac d'aventurier développeur** : un inventaire vivant de skills, agents IA, MCP, scripts, configurations, outils, bibliothèques, documentation, bonnes pratiques et inspirations. Je collecte, je trie, je réutilise — seul ou avec mes agents IA.

---

## 🤖 Delegate an item to your own AI agent

Each reusable item can offer short prompts to copy into Codex, Claude Code, or another agent running in **your target project**. The prompt links directly to the BAG item; the agent reads BAG's root and nested `AGENTS.md` instructions, relevant docs and references, inspects your project, then asks only necessary questions before execution.

- [Delegation protocol](guides/concepts/agent-delegation-protocol.md)
- [Inline prompts anywhere in Markdown](guides/how-to/inline-prompts.md)
- [Delegable item template](templates/delegable-item.md)
- [Supabase Auth recipe with composer](recipes/auth/README.md)
- [Task Composer guide](guides/how-to/task-composer.md)
