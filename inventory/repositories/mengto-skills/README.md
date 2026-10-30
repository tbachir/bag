# MengTo/Skills — Agent Skills collection

- **Category:** Inventory / repositories
- **Status:** evaluating
- **Source:** https://github.com/MengTo/Skills
- **Game Development:** https://github.com/MengTo/Skills/tree/main/agent-skills/game-development
- **Agent Workflows:** https://github.com/MengTo/Skills/tree/main/agent-skills/workflow
- **License:** MIT (copyright Meng To, 2026); keep notices if copying substantial content
- **Last reviewed:** 2026-10-30
- **Compatibility:** Agent-oriented instructions for Three.js/browser games and general coding-agent workflows (Claude Code, Codex, Antigravity); not directly executable, not Unity-specific.

## Why keep it?

A curated reference repository containing two complementary collections of agent skills:
1. **Game Development (20 skills):** Workflows spanning 3D architecture, combat, monster rigs, map editing, mobile touch, performance budgets, browser QA and game shipping. Indexed in the [Game Development skill catalog](../../../skill-tree/skills/game-development/README.md).
2. **Agent Workflows (4 skills):** Core daily collaboration procedures covering unprompted progress screenshots, anchored 0–10 scoring loops, disciplined shipping guardrails (with a 50 MB upload stop), and multi-thread session management. Indexed in the [Agent Workflows skill catalog](../../../skill-tree/skills/agent-workflows/README.md).

## When to use it

When a project requires focused game-development processes or structured daily agent workflow discipline, and an agent can inspect and adapt the upstream instructions to local repository constraints. Read the narrowest skill, evaluate potential overlap, and verify acceptance tests in the actual target.

## Safety and limits

Project-specific Vesperfall procedures and proprietary Claude session MCPs (`mcp__ccd_session_mgmt__*`) need adaptation. No package, asset or script from the upstream repository is implicitly approved for installation or execution. License and source checks apply to all copied materials. Upstream methods have not been executed or installed inside BAG.

## Integration prompt

> Inspect my project's engine, AGENTS.md, tools, scripts and target runtime. Read BAG's root-to-item AGENTS.md chain and [this item](https://github.com/tbachir/bag/blob/main/inventory/repositories/mengto-skills/README.md), then select relevant [Game Development skills](https://github.com/tbachir/bag/blob/main/skill-tree/skills/game-development/README.md) or [Agent Workflow skills](https://github.com/tbachir/bag/blob/main/skill-tree/skills/agent-workflows/README.md). Verify upstream instructions, licenses, safety and dependencies, plan the minimum scoped changes and tests, and request approval for installs, overwrites or deployment.
