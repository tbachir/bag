# Claude Code repository guidance

Read [AGENTS.md](AGENTS.md) for the canonical BAG repository rules. This file adds Claude Code discovery, not a second independent policy.

Before using any `skill-tree/skills/*/SKILL.md`:
1. Read the selected SKILL.md metadata and [freshness policy](maps-and-guides/skill-freshness-policy.md).
2. For `fast-changing` skills, check `last_verified` against `review_interval_days` in UTC. Run `node spellbook/scripts/check-skill-freshness.mjs --json` as a read-only aid when Node is available; evaluate the **selected skill**, not only global script exit status.
3. If stale, explicitly load [skill-maintainer](skill-tree/skills/skill-maintainer/SKILL.md) **before** following the selected skill, check current primary sources and append an evidence-backed changelog entry if authorized. If unavailable, mark STALE/UNVERIFIED and restrict recommendations accordingly.
4. Do not imply the freshness check is a security boundary, that a skill is installed globally, or that reviewing an external reference grants permission for writes.

For real Claude Code native discovery, copy or symlink an approved skill into the compatible project skill directory only after checking the client's current documentation and the target's permissions. BAG's `skill-tree/skills` is a reference library, not an automatically installed set.

Official references: https://code.claude.com/docs/en/memory ; https://code.claude.com/docs/en/skills ; https://code.claude.com/docs/en/hooks
