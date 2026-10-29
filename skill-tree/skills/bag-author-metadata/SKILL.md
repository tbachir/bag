---
name: bag-author-metadata
description: Define or edit optional BAG item metadata, tags, type, links and Fumadocs navigation without inventing required fields or changing agent instructions.
---

# Add optional item metadata

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

## Format selection

- Directory: use its `meta.json` for native Fumadocs navigation settings. Optional BAG extensions belong under a namespaced `bag` key **only after verifying that the installed Fumadocs loader accepts or strips custom keys**.
- Document: use ordinary Markdown frontmatter for title/description, and optionally a `bag` object for BAG-specific data. Do not require frontmatter for a link-only file.
- Keep `AGENTS.md` for agent instructions; never mix executable directions into metadata.

## Proposed BAG extension fields (NOT yet a production contract)

- `bag.type`: descriptive hint such as `task`, `library`, `skill`, `resource` (open vocabulary).
- `bag.tags`: zero or more discovery labels.
- `bag.template`: optional UI view preference, not an automatic content generator.
- `bag.links`: labelled canonical URLs.

Do not introduce defaults, inheritance, parent-child type restrictions or required fields. If Fumadocs rejects unknown keys, keep BAG metadata in a small sidecar or adjust the loader deliberately in a separate tested change; do not break the docs build.

## Workflow

1. Inspect nearby Fumadocs meta.json conventions and the actual page loader/version.
2. Prefer native `title`, `pages`, `icon`, `root` and similar fields for navigation when supported; preserve existing values and page ordering.
3. Add only requested and useful BAG attributes; validate JSON/YAML syntax and existing schema behavior.
4. Confirm metadata does not silently hide content or authorize external execution.
5. Check the website build if possible, and state explicitly whether custom metadata is currently consumed by the UI.

## Examples

[Directory metadata example](references/directory-meta.example.json) and [page metadata example](references/page-frontmatter.example.md).
