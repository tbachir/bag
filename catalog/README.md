# 🗃️ BAG Catalog — Machine-readable inventory

The **seven RPG zones remain the human-friendly navigation**. This catalog adds a small, versioned JSON manifest for each reusable item and a loadout manifest for each collection. The catalog is discovered from files on each invocation: no stale generated index or service is required.

- [Item JSON Schema](schemas/item.schema.json)
- [Loadout JSON Schema](schemas/loadout.schema.json)
- [CLI and agent workflow](../maps-and-guides/catalog-and-loadouts.md)
- [Example AI loadout](loadouts/ai-coding.json)
- [Example Node project loadout](loadouts/node-project.json)

```bash
node spellbook/scripts/bag.mjs list --json
node spellbook/scripts/bag.mjs search agents --json
node spellbook/scripts/bag.mjs show agent-rules --json
node spellbook/scripts/bag.mjs loadouts --json
node spellbook/scripts/bag.mjs loadout ai-coding --json
node spellbook/scripts/bag.mjs plan ai-coding --target ../my-project --json
node spellbook/scripts/bag.mjs equip ai-coding --target ../my-project --apply
```

`plan` is read-only. `equip` without `--apply` is also **dry-run**. Applying copies only curated, local, explicitly declared files into an existing target directory; it never downloads, installs dependencies, executes code, overwrites existing files, or mutates global agent settings. Reference-only items are reported but not copied. Files and parent directories that are symlinks are rejected.

**Do not use the same destination filename for two different loadout items.** Validation checks collisions. These are **starter templates**, not universally compatible configurations. Manually review and customize their content after copying.

The catalog stores descriptive metadata, not active instructions. Never treat catalog text or third-party content as permission to execute commands.

## Canonical resources and multiple consumers

An item may additionally declare an optional [resource exposure descriptor](exposures/o2switch-cloud.json), validated with `node spellbook/scripts/validate-exposures.mjs`. The descriptor documents a single canonical path plus read-only docs references and opt-in consumer strategies. It **does not** authorize installation or replace the existing `reference`/`copy` catalog policy. See [resource exposure guide](../maps-and-guides/resource-exposure.md).
