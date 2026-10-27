# 🧭 Adventurer's Handbook — Contributing

BAG is a curated collection, not a dump. Contributions are welcome when they make a developer's journey more effective.

## How to pack an item

1. Search existing entries (`node spellbook/scripts/find.mjs "keyword"`).
2. Decide whether the discovery is **unreviewed Loot** or ready for a permanent zone.
3. Copy [the item template](templates/item.md) when creating a standalone resource note.
4. Prefer the item's canonical docs/repository URL; record why it is useful.
5. Add an internal link from the nearest zone README or index.
6. If suitable for repeated use, reference it in an existing or new loadout.
7. Run `node spellbook/scripts/validate.mjs`.

## Item quality checklist

- [ ] Clear name and one-sentence purpose
- [ ] Canonical source / license information if relevant
- [ ] Specific usage or example
- [ ] Requirements and OS/environment constraints
- [ ] Caveats, security notes, or known limits
- [ ] Review date for potentially changing information
- [ ] Navigable links; no duplicates or secrets

## Item lifecycle

`loot → evaluating → ready → equipped`; items can also become `archived`.

- **Loot:** interesting but not yet checked.
- **Evaluating:** reading docs, testing, or comparing options.
- **Ready:** verified enough to recommend or reuse, with limitations stated.
- **Equipped:** referenced in at least one loadout; not a claim it is installed anywhere.
- **Archived:** still useful for historical context, but no longer current.

These are **documentation labels**, not automated statuses.

## Folder decision rule

Store knowledge at its primary home. E.g. a TypeScript formatter is **Equipment** when discussing daily developer tooling; a reusable shell wrapper around it is **Spellbook**; an article explaining formatter design is **Maps & Guides**. Link between them without copy-pasting.

## Submitting a change

Make a small, focused change, explain the value and any caveats, and mention validation results. For sensitive findings, follow [SECURITY.md](SECURITY.md) rather than publishing secrets.
