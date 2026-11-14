# Prompts — __SKILL_NAME__

Each prompt should be independently usable. Replace the placeholders and ensure the BAG path exists before publishing.

## Preview safely

```text
Use __SKILL_NAME__ from https://github.com/tbachir/bag/tree/main/skills/__SKILL_NAME__. Read BAG root AGENTS.md and the skill files, then this project's instructions. Audit the relevant state and present a concrete plan, without changing files or executing external actions.
```

## Implement a scoped change

```text
Use __SKILL_NAME__ from https://github.com/tbachir/bag/tree/main/skills/__SKILL_NAME__. Read BAG root AGENTS.md, this skill's SKILL.md and my project's instructions. Implement only the stated change on a branch where permitted; run real checks, report their results and leave a PR for review. Do not merge or deploy unless I explicitly authorize it.
```

## Review and verify

```text
Use __SKILL_NAME__ from https://github.com/tbachir/bag/tree/main/skills/__SKILL_NAME__. Read BAG root AGENTS.md and target project instructions. Inspect the implementation against its acceptance criteria, reproduce failures, and mark each check PASS, FAIL or NOT RUN with evidence. Do not assume the previous agent's success claims are correct.
```
