# 🧠 Skills

Reusable, focused AI capabilities. A skill should answer *when should an agent use this, what inputs does it need, and what output counts as done?*

Start from [the `SKILL.md` template](_template/SKILL.md) and adapt for your agent's supported skill format.

Suggested convention:

```text
skills/
  my-skill/
    SKILL.md
    references/       # only when needed
    scripts/          # optional reviewed helpers
```

Include activation criteria, workflow, safety boundaries, authoritative references, and verification. Do not paste secret values or assume all AI products share one installation scheme.

## First usable skill

[🎒 BAG inventory discovery skill](bag-inventory/SKILL.md) teaches a compatible AI agent to search the catalog, inspect loadouts, preview target changes, and require user approval before copy operations. **Opt-in installation only** — see your AI client's current official skill setup instructions.

## Hosting and infrastructure

[☁️ o2switch Cloud Expert](o2switch-cloud/SKILL.md) reproduces the cPanel navigation, links to 65 official documentation pages, and records 31 capability decisions, including Redis, Node.js/Passenger, PostgreSQL, WAF, backups, and uncertain limitations. The skill is opt-in; source availability is not account activation.

**Status:** BAG inventory and o2switch Cloud skills available; other personal skills to be curated.

## BAG authoring workflows

- [Author an item](bag-author-item/SKILL.md) — any resource, link, note or nested directory.
- [Author a task](bag-author-task/SKILL.md) — outcome-oriented practical guide with optional template.
- [Curate a library](bag-author-library/SKILL.md) — official sources, evaluation and examples.
- [Author metadata](bag-author-metadata/SKILL.md) — optional Fumadocs navigation and proposed BAG extensions.

See [the full authoring guide](../../maps-and-guides/bag-authoring-skills.md).

## Repository curation and quality skills

- [Repository Auditor](repository-auditor/README.md) — inspect projects, select portable resources and establish license/provenance.
- [Reusable Component Extractor](reusable-component-extractor/README.md) — adapt and verify individual assets before adding them to BAG.
- [API Documentation Quality](api-documentation-quality/README.md) — contract-first, example-backed API references.
- [Prompt Quality Reviewer](prompt-quality-reviewer/README.md) — provider-specific prompt guidance and reproducible evaluations.
- [Skill Maintainer](skill-maintainer/README.md) — evidence-based version reviews, updates and changelogs.

[Skill freshness policy](../../maps-and-guides/skill-freshness-policy.md): fast-changing skills require a pre-use check and a 30-day verified review interval; an agent must invoke Skill Maintainer before using stale guidance. This policy does not claim automatic client-wide activation.
