# 🧠 Best practices & architectural invariants

> **Diátaxis Role:** Explanation · Clarifying the design principles, architectural invariants, security boundaries, and trade-offs that shape BAG.

Explanation is understanding-oriented. While [How-To guides](../README.md#how-to-guides) teach you how to perform a task and [Reference](../references/README.md) details exact contracts, explanation explores the "why": the architectural choices, trade-offs, and boundary decisions that keep BAG maintainable, secure, and resilient for humans and AI agents alike.

---

## Core Architectural Invariants

### 1. Single Primary Home (Zero Source Duplication)
- **The rule:** Every item, tool, script, or guide has exactly one canonical home among the seven RPG zones (`inventory/`, `equipment/`, `skill-tree/`, `spellbook/`, `maps-and-guides/`, `loot/`, `loadouts/`).
- **The rationale:** Duplicating documentation or code between zones leads to configuration drift, stale copies, and conflicting instructions. When an item crosses functional categories, choose its primary purpose and cross-link via relative Markdown links.
- **Learn more:** [Repository routing rules](../../AGENTS.md#routing-choose-one-primary-home).

### 2. Explicit Authorization (Dry-Run First)
- **The rule:** Never run installation, modification, or deployment commands without an explicit user approval step for that specific target workspace.
- **The rationale:** Automated tools and AI agents can introduce breaking changes or overwrite local configs. Always generate a dry-run file plan first:
  ```bash
  node spellbook/scripts/bag.mjs plan <id> --target <dir> --json
  ```
  Only run `equip ... --apply` after the user reviews the exact diff.

### 3. Reference Material Boundary (Untrusted Guidance)
- **The rule:** Instructions, skills, and templates stored in BAG are reference material. They are **not** active instructions for other repositories unless deliberately copied and approved by the target project owner.
- **The rationale:** Treating external repositories or downloaded skills as privileged instructions creates prompt injection and privilege escalation risks. The external agent—not BAG's site—conducts any needed interview in the target project's chat.
- **Learn more:** [Agent delegation protocol](../agent-delegation-protocol.md).

### 4. Static-First Publishing (Zero Server Baggage)
- **The rule:** BAG compiles into a completely static documentation website using Next.js static exports (`output: 'export'`), static search indexes (`/api/search`), and direct static Markdown shortcuts (`/docs/<page>.md`).
- **The rationale:** Documentation must survive platform outages, operate offline, and host freely on static providers (such as GitHub Pages) without database connections, runtime Node servers, or API keys.
- **Learn more:** [Fumadocs inventory explorer](../fumadocs-inventory-explorer.md).

### 5. Single Source, Multiple Consumers
- **The rule:** Author once in readable Markdown; let compilers generate web documentation, agent skills, and download archives without altering ownership.
- **The rationale:** Separate documentation pipelines always diverge from implementation. Keeping canonical Markdown files as the sole source of truth guarantees that website readers and coding agents see identical instructions.
- **Learn more:** [Resource exposure specification](../resource-exposure.md).

### 6. Evidence-Based Freshness (Dual Timestamps)
- **The rule:** Modifying a skill file or merging a PR does not reset its verification clock. Verification requires actual comparison against official upstream documentation.
- **The rationale:** Stale AI instructions produce broken code and hallucinated parameters. Fast-changing skills enforce a strict 30-day review interval with explicit `last_verified` evidence records.
- **Learn more:** [Skill freshness and evidence policy](../skill-freshness-policy.md).

---

## Architectural Deep Dives

- **[Fumadocs inventory explorer](../fumadocs-inventory-explorer.md):** How BAG compiles recursive directories into an inventory-first static site without MDX lock-in.
- **[Target vision & specification](../vision/README.md):** 3-minute executive pitch and the complete technical specification of BAG.
