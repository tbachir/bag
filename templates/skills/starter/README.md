# __SKILL_TITLE__

**Use when:** __SKILL_DESCRIPTION__

This is a portable, project-agnostic Agent Skill. Its [SKILL.md](SKILL.md) defines the method; [prompts](prompts.md) provide copy-ready requests; [evaluations](evals/evals.json) support testing.

## Installation

Install the reviewed skill via [BAG's multi-agent installation guide](https://github.com/tbachir/bag/blob/main/templates/skills/INSTALL.md). Select **project** or **global** scope deliberately. ChatGPT has its own Skills/plugin workflow and cannot load skills from your PC automatically.

## Delegate to an agent

```text
Use __SKILL_NAME__ on the current project.
BAG item: https://github.com/tbachir/bag/tree/main/skills/__SKILL_NAME__
Read BAG root AGENTS.md and applicable nested AGENTS.md files down to this item. Read the skill's SKILL.md, references and this project's own AGENTS.md. Perform the requested scoped work, verify actual results and report limits. Do not install, merge or deploy unless authorized.
```

## More prompts

See [prompts.md](prompts.md).

## Applicability and limits

- The skill offers instructions, **not** authentication, tool privileges, internet access or persistent memory.
- Review all scripts, third-party references and platform-specific install instructions before executing them.
- Update this README when distribution methods or minimum requirements change.
