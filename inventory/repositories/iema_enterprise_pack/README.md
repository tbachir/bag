# IEMA enterprise pack

> Multi-app product, prototype and guided-demo separation

- **Category:** inventory / repositories
- **Status:** evaluating
- **Kind:** Learning reference
- **Source:** https://github.com/tbachir/iema_enterprise_pack
- **License:** Not verified; do not redistribute source code without checking
- **Last reviewed:** 2026-10-29
- **Compatibility:** Check the source project's current runtime and dependencies before adoption

## Why keep it?

The project separates a portal, simulated prototype, authenticated MVP, API server and voluntary questionnaire widget.

## What to extract or study

Study `docs/03_TECHNICAL/MVP_Prototype_Separation.md` and the portal/widget READMEs for environments, demonstrations and staged feature gates.

## Trade-offs & safety

The prototype uses simulated data, while widget collection is blocked pending G2. Do not copy demo assumptions into production.

## Delegate — assess for my project

```text
Evaluate whether this BAG item would benefit my current project.
BAG item: https://github.com/tbachir/bag/tree/main/inventory/repositories/iema_enterprise_pack
Read BAG's root AGENTS.md and all applicable nested AGENTS.md files down to this item. Inspect my project's existing architecture, alternatives and constraints. Identify reusable patterns versus project-specific code, verify source license, and propose a minimal integration plan. Do not apply changes without approval.
```

## Related resources

- [Repository shelf](../README.md)
- [BAG delegation protocol](../../../maps-and-guides/agent-delegation-protocol.md)
