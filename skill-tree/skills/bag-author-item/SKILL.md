---
name: bag-author-item
description: Add or enrich any BAG inventory item without imposing a schema or content length. Use for new links, notes, directories, nested knowledge, and existing resources.
---

# Author a BAG item

Use when a user asks to save, classify, update, or expand something in BAG.

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

1. Inspect the surrounding inventory tree and nearby documentation; choose the most discoverable location, not a predefined category.
2. Determine the lightest useful shape: existing item update, a Markdown document, or a directory with nested documents. A single external URL in Markdown is acceptable.
3. Write a useful human-readable title or link and only information the user supplied or you have verified. Keep notes brief unless the subject needs depth.
4. Optionally add item metadata with [bag-author-metadata](../bag-author-metadata/SKILL.md); do not require it.
5. Keep Fumadocs navigation conventions intact and avoid creating redundant generated indexes.
6. Verify paths, links, and renderability when possible, then report the exact changes.

## Output

An existing or new source item, its location, and the minimal evidence of validation.

## Examples

- `inventory/libraries/zod.md` can be a one-link entry.
- `inventory/hosting/o2switch/` can grow with independent notes, guides and nested folders.
- `inventory/anything/nested/deeper/` remains a valid item without custom registration.
