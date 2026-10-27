# Resource exposure descriptors

This directory holds **optional, declarative** descriptors for BAG resources that have multiple consumers (documentation, local agents, target projects, workflows). The canonical files remain at their original paths; do not copy or move skills, CI workflows, configs or scripts here.

- [Contract](../schemas/exposure.schema.json) — JSON Schema v1, including required `docs` and consumer `status` fields.
- [Example](o2switch-cloud.json) — one canonical skill, documentation and opt-in agent exposure.
- [Guide](../../maps-and-guides/resource-exposure.md) — rationale, strategy semantics and safety.

## Adding an entry

Use `<item-id>.json` where the item ID already exists in `catalog/items/`. Reference only existing, local, canonical source and docs paths. Give each consumer a unique `id`, an explicit `status` (`documented`, `opt-in`, or `active`), and describe portability constraints in `notes`. Only mark `active` if its runtime usage was actually verified.

Validate after changes from the repository root:

```bash
node spellbook/scripts/validate-exposures.mjs
node spellbook/scripts/bag.mjs validate
node --test tests/*.test.mjs
```

**Descriptors do not install anything.** The existing catalog's explicit, reviewed `reference`/`copy` rules remain authoritative; exposure strategies are not authorization to execute commands or write into consumer projects.
