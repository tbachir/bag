---
name: documentation-architect
description: Audit and restructure developer/product documentation with task-based information architecture, progressive disclosure, onboarding, versioning and evidence-backed maintenance.
license: MIT
metadata:
  language: en
  reviewed_at: "2026-10-29"
---

# Documentation Architecture

Use when planning, auditing, consolidating, migrating or restructuring documentation for newcomers, contributors, operators and AI agents.

## Inspect
- Read README, docs directories, AGENTS.md, contribution rules, existing navigation and project maturity.
- Identify audiences and concrete jobs: understand, install, integrate, operate, troubleshoot, contribute, and decide.
- Record canonical sources, ownership, versions, content duplicates, broken URLs and missing topics.

## Structure
1. Separate **tutorials** (learning), **how-to guides** (accomplish a task), **reference** (precise factual information) and **explanations** (concepts and trade-offs). Organize navigation by user intent, not solely by internal team structures.
2. Provide a short newcomer path: what this is, visual or concrete demo, prerequisites, first successful action, next contribution.
3. Keep each topic's authoritative source unique; cross-link other appearances. Preserve URLs or document migration/redirect needs.
4. Write for scanability: precise heading hierarchy, direct introductions, meaningful link labels, tested commands with OS/platform, expected output and failure recovery.
5. Differentiate verified fact, hypothesis and recommendation. Cite authoritative sources and their date/version; never invent runtime behavior.
6. For multilingual docs, track locale coverage, untranslated pages and parity instead of silently presenting partial translation as complete.
7. Add contribution instructions: owner, review trigger, changelog/deprecation, and tests for links/examples where feasible.

## Review checklist
Can a newcomer reach a first success? Is every instruction safe to run? Are there any orphan pages, duplicate canonicals, obsolete screenshots, unverified promises, broken links or role-specific blind spots?

## Deliverable
Provide a navigable table of contents, migration map, priority gaps and verification report. Do not move/delete files until referencing links and consumers have been assessed.

## References
- https://diataxis.fr/
- https://developers.google.com/style
- https://www.w3.org/WAI/tutorials/

