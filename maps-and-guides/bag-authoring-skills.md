# BAG authoring skills

BAG is an unrestricted recursive library. Every folder under `inventory/` may be an item with any number of nested items. No folder name, type, README, task manifest, or metadata file is required. These skills are **optional reference workflows** for coding agents, not auto-installed instructions.

| Need | Skill |
| --- | --- |
| Save any new link, note, folder or resource | [Author item](../skill-tree/skills/bag-author-item/SKILL.md) |
| Document a desired outcome and how to achieve it | [Author task](../skill-tree/skills/bag-author-task/SKILL.md) |
| Reference a library or framework | [Author library](../skill-tree/skills/bag-author-library/SKILL.md) |
| Choose tags, type or navigation settings | [Author metadata](../skill-tree/skills/bag-author-metadata/SKILL.md) |

## Common principles

- A task is a kind of content, never a hardcoded `tasks/` directory. Type metadata is optional and does not yet imply a working task composer.
- Rich descriptions are encouraged when they help, but a simple link is a first-class item.
- Use native Fumadocs metadata where possible; BAG-specific namespace is proposed and requires runtime compatibility validation.
- There is **no mandatory schema** for all items, no arbitrary maximum nesting depth, and no need for special handling of categories.
- The current repository still contains pre-migration zones and an older compiler. These skills define a forward-looking authoring convention **without silently moving files or claiming that migration is implemented**.
- Always verify authoritative facts, preserve internal links and report what was actually tested.

## Suggested authoring prompts

```text
Add this resource to BAG in the most discoverable location. Follow the BAG author-item skill; keep the entry as lightweight as its value warrants.
```

```text
Document this repeatable goal as a BAG task-oriented item. Follow the BAG author-task skill and only include sections with useful evidence.
```

```text
Review the metadata of this BAG item. Follow the BAG author-metadata skill and prefer native Fumadocs navigation settings.
```
