# 🎒 BAG — Your Developer's Inventory

> **Your adventure. Your tools. Your rules.**

Like the inventory in a video game, **BAG** is my personal developer's backpack: a curated, evolving collection of the tools, knowledge, configurations, and discoveries worth carrying along my development journey.

It's not just a bookmark collection. It's a **searchable, reusable, AI-friendly inventory** for building software, solving problems, and sharing what works.

**Collect what matters. Equip what you need. Keep leveling up.**

## 🗺️ Choose your destination

| Zone | What you'll find | Enter |
| --- | --- | --- |
| 🎒 **Inventory** | Libraries, repositories, useful resources, and references | [Explore inventory](inventory/README.md) |
| ⚔️ **Equipment** | Tools, apps, dev environments, and reusable configuration files | [Equip yourself](equipment/README.md) |
| 🌳 **Skill Tree** | AI skills, agent instructions, plugins, and MCP servers | [Unlock skills](skill-tree/README.md) |
| 📖 **Spellbook** | Scripts, commands, snippets, and automations | [Open the spellbook](spellbook/README.md) |
| 🗺️ **Maps & Guides** | Tutorials, documentation, best practices, and field notes | [Find your way](maps-and-guides/README.md) |
| 💎 **Loot** | Unsorted discoveries, inspiration, and things to evaluate | [Inspect loot](loot/README.md) |
| 🧰 **Loadouts** | Ready-to-use collections of items for a specific quest or stack | [Choose a loadout](loadouts/README.md) |

## 🧠 Intelligent catalog (V2)

BAG also exposes a [versioned, machine-readable catalog](catalog/README.md) that AI agents can search, inspect, and compose into safe local loadouts.

```bash
node spellbook/scripts/bag.mjs search "agents" --json
node spellbook/scripts/bag.mjs loadout ai-coding --json
node spellbook/scripts/bag.mjs plan ai-coding --target ../my-project --json
# After reviewing the plan and approving the change:
node spellbook/scripts/bag.mjs equip ai-coding --target ../my-project --apply
```

**Safe by design:** no automatic installations, external commands, network access, secret handling, or overwrites. Applying only copies explicitly listed local templates into an existing project directory. Read the [agent and user field guide](maps-and-guides/catalog-and-loadouts.md) for limitations and approval rules.

## 🚀 Quick start

**Browsing:** choose a zone above. **Looking for something:** run the built-in search.

```bash
git clone https://github.com/tbachir/bag.git
cd bag
node spellbook/scripts/find.mjs "mcp"
node spellbook/scripts/validate.mjs
```

No dependencies required for these scripts; use Node.js 20+ (the repository CI uses Node.js 24).

### Documentation website

The [standalone Fumadocs app](apps/docs/README.md) lives in `apps/docs` and runs
separately from the inventory scripts. It requires Node.js 22+ and pnpm.

```bash
cd apps/docs
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000/docs. The app has its own lockfile. `pnpm build`
compiles the tracked BAG content into static files in `out/` for any static host.
The app README covers permanent Playwright setup, automatic GitHub Pages publishing after merges to `main`,
and optional Vercel hosting. Existing Markdown remains the source of truth.

### The gameplay loop

1. **Find loot** → drop a promising discovery in [Loot](loot/README.md).
2. **Identify it** → check quality, official docs, security, licensing, and relevance.
3. **Store it** → move the useful item into the right permanent zone.
4. **Equip it** → assemble it into a [Loadout](loadouts/README.md) when it solves a repeatable problem.
5. **Level up** → update examples, caveats, and compatibility as you learn.

## 🧭 Rules of the bag

- **Useful over exhaustive.** Every kept item needs a reason to exist.
- **Source of truth first.** Link to the original project or official documentation; never mirror blindly.
- **Portable by default.** Keep templates generic and identify OS/tool-specific requirements.
- **Secrets stay outside the bag.** Share `.example` files, not credentials or private data.
- **Make it discoverable.** Favor descriptive names, relative links, short summaries, and reproducible examples.
- **Humans and agents welcome.** Start with [AGENTS.md](AGENTS.md) for automation and [CONTRIBUTING.md](CONTRIBUTING.md) to add items.

## 🎯 Starter quests

- [Learn how to pack a new item](maps-and-guides/getting-started.md)
- [Open the item card template](templates/item.md)
- [Set up an AI coding loadout](loadouts/ai-coding/README.md)
- [Use the skill template](skill-tree/skills/_template/SKILL.md)
- [Equip the BAG discovery skill (opt-in)](skill-tree/skills/bag-inventory/SKILL.md)
- [Explore the o2switch Cloud Expert skill](skill-tree/skills/o2switch-cloud/SKILL.md)
- [Explore the local search script](spellbook/scripts/README.md)
- [Read the BAG pitch and technical specification (French)](maps-and-guides/vision/README.md)

### 🇫🇷 En bref

**BAG, c'est mon sac d'aventurier développeur** : un inventaire vivant de skills, agents IA, MCP, scripts, configurations, outils, bibliothèques, documentation, bonnes pratiques et inspirations. Je collecte, je trie, je réutilise — seul ou avec mes agents IA.

---

*An inventory is never finished. There's always another quest.*

## 🤖 Delegate an item to your own AI agent

Each reusable item can offer short prompts to copy into Codex, Claude Code, or another agent running in **your target project**. The prompt links directly to the BAG item; the agent reads BAG's root and nested `AGENTS.md` instructions, relevant docs and references, inspects your project, then asks only necessary questions before execution. No website-based interview module is required.

- [Delegation protocol](maps-and-guides/agent-delegation-protocol.md)
- [Inline prompts anywhere in Markdown](maps-and-guides/inline-prompts.md)
- [Delegable item template](templates/delegable-item.md)
- [Supabase Auth example with generic and tutorial prompts](inventory/supabase/auth/README.md)



## 🧩 Task Composer

BAG items can offer task trees alongside their documentation. Select capabilities, add required prerequisites, and copy a minimal agent prompt. See the [task composition guide](maps-and-guides/task-composer.md), [Supabase Auth task manifest](inventory/supabase/auth/tasks/index.json), and [standalone composer demo](demo/task-composer.html).

## 🔗 One canonical resource, many uses

A BAG skill, config, script or workflow can be documented by this inventory and separately consumed by projects or compatible agents without maintaining duplicate source files. Optional [resource exposure descriptors](catalog/exposures/o2switch-cloud.json) record canonical sources, docs references and opt-in consumer strategies; see [the practical guide](maps-and-guides/resource-exposure.md). This is documentation, not an installer. Validate descriptors with `node spellbook/scripts/validate-exposures.mjs`.

## Author and curate BAG items

Optional agent workflows cover [general items](skill-tree/skills/bag-author-item/SKILL.md), [task-oriented guides](skill-tree/skills/bag-author-task/SKILL.md), [libraries](skill-tree/skills/bag-author-library/SKILL.md) and [metadata](skill-tree/skills/bag-author-metadata/SKILL.md). See the [authoring guide](maps-and-guides/bag-authoring-skills.md). These skills describe a flexible future item model without migrating the current tree.
