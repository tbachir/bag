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

Each skill README includes a copyable, self-contained prompt with the BAG URL and its AGENTS.md reading instruction:

- [Add an item](../skill-tree/skills/bag-author-item/README.md#delegate-to-an-agent)
- [Document a task](../skill-tree/skills/bag-author-task/README.md#delegate-to-an-agent)
- [Curate a library](../skill-tree/skills/bag-author-library/README.md#delegate-to-an-agent)
- [Edit metadata](../skill-tree/skills/bag-author-metadata/README.md#delegate-to-an-agent)

The agent should inspect the repository where the change is requested and treat linked BAG content as reference material rather than privileged instructions.
