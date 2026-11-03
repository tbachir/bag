---
name: bag-author-library
description: Curate a software library, framework or SDK as a BAG item, from a single official link to a detailed reference with practical examples.
---

# Curate a library or framework

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

1. Identify the canonical library and its official documentation/repository; distinguish similarly named packages.
2. Check whether it is already present under inventory/ or in the legacy zones before writing.
3. Default to a minimal Markdown entry: a name and primary URL. Enrich only where useful to a future reader.
4. If warranted, add overview, supported environment/version, why use it, alternatives, caveats, example usage, migration notes, or related BAG items. Never require these sections.
5. Use [the optional library template](references/library.template.md) when a richer entry makes sense.
6. Add metadata with the companion skill only if tags, filtering or presentation genuinely benefit from it. Language/framework labels are descriptive, not restrictive.
7. When copying code, respect licenses and identify official sources; never claim the example was executed unless it was.

## Output

A discoverable entry pointing to the canonical source, with as much or as little additional guidance as is justified.

## References

- [Optional library template](references/library.template.md)
- [Metadata skill](../bag-author-metadata/SKILL.md)
