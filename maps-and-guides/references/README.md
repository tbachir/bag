# 🗞️ References — Canonical specifications & contracts

> **Diátaxis Role:** Reference · Authoritative, technical descriptions, data contracts, policy specifications, and schema definitions for developers and AI agents.

Reference documentation is purely factual, comprehensive, and structured for lookup. Unlike [Tutorials](../tutorials/README.md) or [How-To guides](../README.md#how-to-guides), reference material does not tell you what to do or teach principles; it documents exact contracts, invariants, constraints, and schemas.

---

## BAG Specifications & Policies

| Contract / Specification | Canonical Path | Description |
| :--- | :--- | :--- |
| **Skill Freshness Policy** | [skill-freshness-policy.md](../skill-freshness-policy.md) | Independent timestamps, 30-day review intervals, and pre-use verification gates for fast-changing skills. |
| **Resource Exposure Contract** | [resource-exposure.md](../resource-exposure.md) | Single-source asset exposure across agent skills, IDE plugins, and static web docs without file duplication. |
| **Agent Delegation Protocol** | [agent-delegation-protocol.md](../agent-delegation-protocol.md) | Strict entry contract and root-to-item `AGENTS.md` reading protocol for external AI coding agents. |
| **UI Components & Templates** | [ui/README.md](../ui/README.md) | Storybook-style gallery of Fumadocs UI components and the 5 BAG template schemas (`boilerplate`, `skill`, `library`, `resource`, `loadout`). |
| **Task Manifest Contract** | [task-composer.md](../task-composer.md) | Hierarchical `tasks/index.json` schema for declaring missions, prerequisites, and atomic task execution. |

---

## Machine Schemas & Manifests

The machine-readable catalog is governed by versioned JSON schemas in [`catalog/`](../../catalog/README.md):

- **Item manifest schema:** [`catalog/schemas/item.schema.json`](../../catalog/schemas/item.schema.json) — defines item IDs, titles, primary source paths, tags, and equip modes.
- **Loadout manifest schema:** [`catalog/schemas/loadout.schema.json`](../../catalog/schemas/loadout.schema.json) — defines curated combinations of items for specific development stacks.
- **Exposure descriptor schema:** [`catalog/schemas/exposure.schema.json`](../../catalog/schemas/exposure.schema.json) — defines multi-consumer distribution strategies (`reference`, `symlink`, `copy`, `generate`, `native-reuse`).

Validate all catalog manifests against their schemas using:

```bash
node spellbook/scripts/bag.mjs validate --json
```

---

## Standards for Authoring References

When adding or updating reference documents in BAG:
1. **Primary URLs:** Link directly to official upstream documentation and authoritative specs; avoid secondary blogs or scrapers.
2. **Version sensitivity:** Explicitly record supported version numbers (e.g. Node >= 22, pnpm >= 10, Next.js 16.4.2).
3. **Audit dates:** Include `last_verified` timestamps (ISO 8601 or YYYY-MM-DD) so readers and agents know when facts were confirmed.
4. **No implicit execution:** Never format untrusted shell commands or scripts as executable instructions.
