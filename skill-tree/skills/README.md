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

**Status:** template and BAG inventory skill ready; other personal skills to be curated.
