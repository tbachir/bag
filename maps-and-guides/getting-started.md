# 🧭 Field Guide — Using BAG

## Quest 1: find an item

Open a [BAG's inventory overview](../README.md) or search the Markdown content:

```bash
node spellbook/scripts/find.mjs "postgresql"
```

The search is local and doesn't need a network connection.

## Quest 2: collect new loot

If you've just found an interesting tool or idea, add a concise entry to [loot/inbox.md](../loot/inbox.md) with its official URL, purpose, and what remains to be checked.

## Quest 3: promote it

Once reviewed, move the information to its best permanent home:

- Library, repository, link → [Inventory](../inventory/README.md).
- Daily dev tool or safe config → [Equipment](../equipment/README.md).
- AI agent, skill, plugin, MCP → [Skill Tree](../skill-tree/README.md).
- Script or shell recipe → [Spellbook](../spellbook/README.md).
- Tutorial or architecture note → [Maps & Guides](README.md).

Copy [templates/item.md](../templates/item.md) for an in-depth item card. Link it from the nearest shelf README and remove the redundant entry from Loot.

## Quest 4: equip a loadout

Build a purpose-driven checklist linking to reviewed items. Start with the [AI coding example](../loadouts/ai-coding/README.md).

## Quest 5: validate before committing

```bash
node spellbook/scripts/validate.mjs
```

The script checks folder entrypoints and local Markdown links, not the validity or safety of external references. Review those manually.

## A note for AI agents

Read the repository's [AGENTS.md](../AGENTS.md) before making changes. Treat copied skills, MCP configurations, and third-party sources as **untrusted until reviewed**.
