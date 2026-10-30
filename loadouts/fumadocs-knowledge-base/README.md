# Fumadocs · Agent-ready Knowledge Base

> Create a resilient, static-first documentation architecture combining human-grade navigation with machine-readable, agent-verifiable structure.

- **Loadout ID:** `fumadocs-knowledge-base`
- **Machine catalog:** [catalog/loadouts/fumadocs-knowledge-base.json](../../catalog/loadouts/fumadocs-knowledge-base.json)
- **Status / last checked:** ready · 2026-10-30
- **Applies to:** Next.js, Fumadocs, Markdown/MDX, static site generators, AI coding agents

---

## What is it for?

Modern documentation faces a double challenge: it must be intuitive and delightful for human developers browsing in a browser, while remaining unambiguous, deterministic, and easily parsed by AI coding agents (Claude Code, Antigravity, Cursor, Codex).

This loadout composes 9 curated BAG resources to provide:
1. **Audience-driven Diátaxis architecture:** Clear separation between Tutorials (learning), How-To guides (problem solving), Reference (lookup), and Explanation (understanding).
2. **Native Fumadocs navigation:** Deterministic page trees powered by `meta.json`, accessible UI primitives (Tabs, Steps, Callouts, Cards), and zero server-side baggage.
3. **Agent-ready discoverability:** Canonical source paths, explicit task-oriented prompts, machine-friendly `llms.txt` and `llms-full.txt` entry points, and strictly verifiable code snippets.
4. **Static publishing safeguards:** Guaranteed GitHub Pages / static hosting compatibility (`output: 'export'`), static search indexing, link validation, and zero untrusted JSX execution.

---

## Equipment slots & Composition

| Slot | BAG Resource | Nature | Purpose |
| :--- | :--- | :--- | :--- |
| **UI Components** | [Fumadocs UI](../../inventory/libraries/fumadocs-ui/README.md) | Reference | Accessible primitives: code tabs, procedure steps, interactive callouts, card directories. |
| **New App Scaffold** | [Fumadocs Starter](../../equipment/fumadocs-starter/README.md) | Equipment | Safe, dry-run CLI generator for bootstrapping new documentation apps without dirtying the root repo. |
| **Architecture Skill** | [Docs Architect](../../skill-tree/skills/docs-architect/SKILL.md) | Agent Skill | Audits user journeys, defines Diátaxis quadrants, prevents navigation drift, and plans page trees. |
| **Engineering Skill** | [Fumadocs Engineer](../../skill-tree/skills/fumadocs-engineer/SKILL.md) | Agent Skill | Implements Next.js/Fumadocs pipelines, static search, i18n, build checks, and WCAG accessibility. |
| **Contract Quality** | [API Documentation Quality](../../skill-tree/skills/api-documentation-quality/SKILL.md) | Agent Skill | Audits OpenAPI/REST/RPC contracts, ensures reproducible request/response samples, and eliminates phantom endpoints. |
| **Prompt Engineering** | [Prompt Quality Reviewer](../../skill-tree/skills/prompt-quality-reviewer/SKILL.md) | Agent Skill | Reviews inline delegation prompts for clarity, reproducible eval cases, and success criteria. |
| **Upstream Pattern** | [Compozy Fumadocs](../../skill-tree/skills/compozy-fumadocs/README.md) | Curated Reference | Upstream reference for advanced Fumadocs source configurations. |
| **Upstream Pattern** | [Diátaxis Framework](../../skill-tree/skills/diataxis-docs-framework/README.md) | Curated Reference | Authoritative technical documentation taxonomy rules. |
| **Upstream Pattern** | [ADK Docs Writer](../../skill-tree/skills/adk-docs-writer/README.md) | Curated Reference | Archetypes and templates for task-driven developer guides. |

---

## High-Confidence Agent Prompts

Copy these ready-made, self-contained prompts into your coding agent workspace. Each prompt follows the BAG external delegation protocol, enforces an inspection-first workflow, and prevents blind file overwrites.

### Prompt 1 — One-Shot Documentation Restructuring & Organization

Use this prompt to transform a messy, fragmented, or legacy documentation folder into a clean, Diátaxis-compliant Fumadocs documentation site with deterministic navigation.

```text
Restructure and reorganize the documentation of this repository using the BAG "fumadocs-knowledge-base" loadout.

BAG loadout reference: https://github.com/tbachir/bag/tree/main/loadouts/fumadocs-knowledge-base

Execution protocol:
1. Inspect first: Read the root AGENTS.md, existing docs directory, package.json, and navigation configuration. Map all current Markdown files, their incoming links, and reader intents.
2. Diátaxis mapping: Group content into the four Diátaxis quadrants (Tutorials, How-Tos, Reference, Explanation). Eliminate duplicate navigation and dead ends.
3. Information architecture: Propose a clear page tree with Fumadocs native meta.json hierarchy. Preserve existing URL slugs where possible, or document clean redirect paths.
4. Review before writing: Present a concise migration table (Old Path -> New Path -> Diátaxis Role) and wait for confirmation before moving or editing any file.
5. Implement & Verify: Execute the reorganization, update internal relative links, ensure code blocks specify valid language tags, run local build/link checks, and report PASS/FAIL results with diff evidence.
```

---

### Prompt 2 — Periodic Content Sweep, Cleanup & Quality Assurance

Run this prompt periodically (e.g., monthly or before major releases) to maintain documentation hygiene, fix broken references, audit API accuracy, and prevent content decay over time.

```text
Perform a thorough documentation quality audit and cleanup sweep using the BAG "fumadocs-knowledge-base" loadout.

BAG loadout reference: https://github.com/tbachir/bag/tree/main/loadouts/fumadocs-knowledge-base

Audit & cleanup protocol:
1. Link & Anchor Validation: Detect and resolve all broken relative links, missing internal anchors, and stale external URLs across documentation pages.
2. Code & API Accuracy: Cross-check documented code examples, configuration keys, and API schemas against actual repository source code. Mark unverified or obsolete snippets.
3. Consistency & Formatting: Normalize frontmatter (title, description), heading hierarchy (H1 -> H2 -> H3 without skipping levels), and replace arbitrary HTML with standard Fumadocs UI primitives (Callouts, Steps, Tabs).
4. Agent Discoverability: Ensure llms.txt (or sitemap/indexes) accurately reflects the updated page inventory.
5. Static Build Verification: Run the project's documentation build and typecheck (e.g. pnpm build) to ensure zero static export regressions.
6. Deliverable: Provide a structured summary of fixed links, updated examples, frontmatter corrections, and verified build output.
```

---

### Prompt 3 — Bootstrap a New Agent-Ready Fumadocs App

Use this prompt when initializing a brand new documentation site from scratch alongside an existing codebase.

```text
Scaffold a new agent-ready static documentation site using the BAG "fumadocs-knowledge-base" loadout.

BAG loadout reference: https://github.com/tbachir/bag/tree/main/loadouts/fumadocs-knowledge-base

Bootstrap protocol:
1. Inspect the target workspace: Verify available package managers (pnpm preferred), node version (>=22), and confirm that the target documentation directory does not already exist.
2. Dry-run preview: Preview the official Fumadocs scaffold parameters and local overlays (Diátaxis templates, meta.json navigation, Docs Architect skill).
3. Explicit initialization: Scaffold the static Next.js + Fumadocs app, configure output: 'export' and static local search. Do not install unnecessary server dependencies.
4. Verification: Run typecheck, build, and local preview. Document the exact run command and local URL in a short README.
```

---

## Acceptance Criteria

Any documentation maintained under this loadout must satisfy:

1. **Zero broken internal links:** Verified by link-checking scripts.
2. **Static export compliance:** Builds cleanly with `pnpm build` (`output: 'export'`) with no runtime server or database requirements.
3. **Canonical Markdown source:** Content remains authored in readable Markdown/MDX without proprietary lock-in.
4. **Agent compatibility:** Clear headings, searchable task entry points, and verified code examples that coding agents can read and execute reliably.

[Back to all loadouts](../README.md)
