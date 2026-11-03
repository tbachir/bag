# 🧠 Agent Skills Registry

A curated collection of modular, production-ready AI agent skills conforming to the **Agent Skills specification**.

## Quick Start (with `bag` CLI)

```bash
# List all available skills
bag skill list

# Inspect a skill before installation
bag skill show fumadocs-engineer

# Install a skill into your project (.agents/skills/ or .claude/skills/)
bag skill add fumadocs-engineer --target ./my-project
bag skill add addbag -a claude-code
```

## Available Skills

| Skill | Description | Primary File |
| --- | --- | --- |
| [addbag](addbag/README.md) | Capture valuable discoveries and patterns into BAG | [SKILL.md](addbag/SKILL.md) |
| [agent-ready-documentation](agent-ready-documentation/README.md) | Make project documentation reliable for AI coding agents | [SKILL.md](agent-ready-documentation/SKILL.md) |
| [api-documentation-quality](api-documentation-quality/README.md) | Contract-driven API documentation & integration guides | [SKILL.md](api-documentation-quality/SKILL.md) |
| [bag-author-item](bag-author-item/README.md) | Author and enrich BAG inventory items | [SKILL.md](bag-author-item/SKILL.md) |
| [bag-author-library](bag-author-library/README.md) | Curate libraries, frameworks, and SDKs | [SKILL.md](bag-author-library/SKILL.md) |
| [bag-author-metadata](bag-author-metadata/README.md) | Define item metadata and navigation | [SKILL.md](bag-author-metadata/SKILL.md) |
| [bag-author-task](bag-author-task/README.md) | Write actionable task guides and manifests | [SKILL.md](bag-author-task/SKILL.md) |
| [bag-inventory](bag-inventory/README.md) | Discover and evaluate items from the BAG catalog | [SKILL.md](bag-inventory/SKILL.md) |
| [clean-code](clean-code/README.md) | Syntax-aware code hygiene, dead code analysis, and safe whitespace cleanup | [SKILL.md](clean-code/SKILL.md) |
| [docs-architect](docs-architect/README.md) | Plan and audit task-oriented documentation architecture | [SKILL.md](docs-architect/SKILL.md) |
| [fumadocs-engineer](fumadocs-engineer/README.md) | Design and maintain Fumadocs/Next.js documentation sites | [SKILL.md](fumadocs-engineer/SKILL.md) |
| [o2switch-cloud](o2switch-cloud/README.md) | Cloud hosting & deployment guidance for o2switch | [SKILL.md](o2switch-cloud/SKILL.md) |
| [project-environment-setup](project-environment-setup/README.md) | Upstream research, library-first architecture, and governance baseline (AGENTS.md, design.md) | [SKILL.md](project-environment-setup/SKILL.md) |
| [prompt-quality-reviewer](prompt-quality-reviewer/README.md) | Evaluate and iteratively improve prompts | [SKILL.md](prompt-quality-reviewer/SKILL.md) |
| [repository-auditor](repository-auditor/README.md) | Audit repositories for reusable, safe assets | [SKILL.md](repository-auditor/SKILL.md) |
| [reusable-component-extractor](reusable-component-extractor/README.md) | Extract portable components and configs | [SKILL.md](reusable-component-extractor/SKILL.md) |
| [skill-maintainer](skill-maintainer/README.md) | Review and refresh fast-changing skills | [SKILL.md](skill-maintainer/SKILL.md) |
| [ui-studio](ui-studio/README.md) | Universal UI Studio and prototype generator | [SKILL.md](ui-studio/SKILL.md) |
| [ui-ux-design-review](ui-ux-design-review/README.md) | Measure UI/UX quality, responsive design & accessibility | [SKILL.md](ui-ux-design-review/SKILL.md) |

## Skill Structure
Each skill directory contains:
- `SKILL.md`: The actionable prompt instructions and YAML frontmatter (`name`, `description`).
- `README.md`: Human-facing overview, usage examples, and trade-offs.
- `bag.item.json`: Optional catalog metadata, tags, and ready-to-run prompts.
- `references/`: Optional templates, schemas, and reference material.
- `CHANGELOG.md`: Optional version history and revision notes.
