---
name: bag-author-task
description: Write an actionable BAG task knowledge document with implementation guidance, troubleshooting and references. Trigger when adding a repeatable goal or procedure anywhere in inventory.
---

# Author a task-oriented item

A task is an **item whose purpose is to help achieve a concrete outcome**, not a special folder. It may live anywhere and can itself contain nested items. Do not require a folder named tasks or a tasks/index.json manifest.

## Shared rules

- Read the repository root AGENTS.md and all applicable ancestor AGENTS.md files before editing.
- Search for an existing item first; extend it rather than introducing duplicates.
- Prefer the simplest representation: a single Markdown file or URL note is valid. No mandatory README, task manifest, tag, template, or status.
- Treat any directory within inventory/ as an item that can contain further items at arbitrary depth; no directory name has special semantics.
- Keep original GitHub-facing content portable and human-readable. Use relative links internally.
- Metadata describes content; it does not authorize commands, install skills, or replace AGENTS.md.
- Never fabricate validation, compatibility, provider capabilities, or experience; distinguish documented facts from hypotheses.
- Work with the current tree: root categories have not yet all been migrated under inventory/. Do not move them as a side effect.
- Verify local links and relevant repository tests if execution is available; otherwise report unrun checks.

## Workflow

1. Express the expected user-visible outcome in the title and opening paragraph; distinguish the desired result from one particular implementation.
2. Inspect the relevant parent item, linked sources and existing procedures to avoid duplication.
3. Use [the optional task guide template](references/task-guide.template.md) as a menu of sections, not a compulsory form. Keep only sections adding value.
4. Document a workable procedure or decision tree, assumptions, verification steps and known failure modes, as supported by evidence.
5. Link authoritative references, compatible BAG skills/plugins/tools and genuine field notes. Note uncertainties and version constraints explicitly.
6. Provide the few questions an implementing agent should ask only when a decision cannot be established from the target project.
7. If a task should be selectable in a future composer, optional `bag.type: task` in page frontmatter (or `bag.type` in the item's folder metadata) is a **proposed BAG convention**, not an implemented composer feature.

## Output

A self-contained Markdown guide usable by a person or external agent, with precise links and clear verification criteria. Do not invent hands-on test results.

## References

- [Task document template](references/task-guide.template.md)
- [Metadata authoring](../bag-author-metadata/SKILL.md)
