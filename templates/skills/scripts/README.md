# Skill Factory helpers

Node.js 22+; **no npm package dependencies**. From a BAG clone:

```sh
# Dry-run; inspect output paths
node templates/skills/scripts/create-skill.mjs --name my-skill --description "Use when ..." --target skills
# Explicit creation, never overwrite
node templates/skills/scripts/create-skill.mjs --name my-skill --description "Use when ..." --target skills --write
# Validate a completed skill
node templates/skills/scripts/validate-skill.mjs skills/my-skill
node --test tests/skill-template.test.mjs
```

[create-skill.mjs](create-skill.mjs) refuses existing destinations and symlinked target ancestors. [validate-skill.mjs](validate-skill.mjs) checks a subset of structural rules and does not establish runtime safety, agent-level behavior or current API compatibility.
