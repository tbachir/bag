---
name: example-skill
description: A safe, focused starter example for writing an Agent Skill. Replace this template with your own name, triggers, workflow and evidence requirements before distributing.
---

# Agent Skill Template (reference only)

This file intentionally remains as a **compatibility entry point** for older BAG links and `bag template apply skills/SKILL.md` workflows. It is **not an installed skill or proof of compatibility**. The canonical, complete replacement is [Agent Skill Factory](README.md) and its [starter bundle](starter/SKILL.md), [installation guide](INSTALL.md), [prompt library](PROMPTS.md) and [quality checklist](QUALITY.md).

## Recommended workflow

1. **Inspect before creating:** search BAG, skills.sh and the existing target project's skills. Avoid duplicate capabilities.
2. **Generate the complete bundle:** `node templates/skills/scripts/create-skill.mjs --name example-flow --description "Use when an agent needs to ..." --target skills` (dry-run); inspect, then add `--write`.
3. **Author carefully:** define the trigger, non-trigger, input/output contract, steps, action scope, authoritative sources and testable completion criteria. Keep `SKILL.md` short and move details to `references/`.
4. **Document installation:** explicitly distinguish Codex, Claude Code, Antigravity and ChatGPT rather than claiming shared local folders.
5. **Write copy-ready prompts:** include a self-contained delegation prompt and short audit, execute and verify variations. Link BAG root `AGENTS.md` and the exact item path.
6. **Evaluate and validate:** include positive, negative and constrained-authority cases. Run `node templates/skills/scripts/validate-skill.mjs <dir>`, project quality checks and the relevant client smoke tests.
7. **Publish only with permission:** open a reviewable PR; don't install globally, merge, deploy, upload secrets or claim account integration solely from documentation.

## Starter components

- [Canonical SKILL.md starter](starter/SKILL.md)
- [Human README starter](starter/README.md)
- [Ready-to-edit prompts starter](starter/prompts.md)
- [Evaluations starter](starter/evals/evals.json)
- [Complete multi-agent installation guide](INSTALL.md)
- [Prompts to install, invoke or audit a skill](PROMPTS.md)

## Definition of done

Skill triggers reliably for its intended job, does not activate for unrelated requests, preserves permissions, reports real checks and can be installed and verified on at least one **actually tested** target client. Unverified clients remain documented as instructions only.
