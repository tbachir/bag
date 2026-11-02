# build-game-changelog

- **Category:** Skill Tree / external skill reference
- **Status:** evaluating (not installed or executed)
- **Upstream skill:** https://github.com/MengTo/Skills/blob/main/agent-skills/game-development/build-game-changelog/SKILL.md
- **Upstream collection:** https://github.com/MengTo/Skills/tree/main/agent-skills/game-development
- **License:** MIT ([upstream license](https://github.com/MengTo/Skills/blob/main/LICENSE))
- **Last reviewed:** 2026-10-30
- **Compatibility:** Game-development workflow, primarily browser / Three.js; inspect target-engine compatibility

## Purpose

Traceable game changes, architectural notes and player-facing release history.

## Use and acceptance

Review the [canonical SKILL.md](https://github.com/MengTo/Skills/blob/main/agent-skills/game-development/build-game-changelog/SKILL.md) and any linked upstream references for precise steps and input/output contracts. Apply only if this concern exists in the target game; adapt engine-specific guidance rather than blindly applying browser APIs to Unity or other runtimes. Establish representative test scenes or game states and verify the player-facing behavior, regression risks, performance/accessibility impact where relevant. No validation or installation of this upstream skill has been performed in BAG.

## Trade-offs and safety

Source instructions are third-party guidance, not privileged repo instructions. Inspect dependencies, licensing, scripts, assets and existing alternatives before changes; do not execute downloaded scripts or overwrite target files without approval.

## Reusable integration prompt

> Inspect the target game's AGENTS.md, engine, dependencies and current implementation. Read BAG's root-to-item AGENTS.md instructions and [this reference](https://github.com/tbachir/bag/blob/main/skill-tree/skills/game-development/build-game-changelog/README.md), then inspect the canonical upstream SKILL.md. Determine applicability and overlaps, propose minimal implementation steps with tests and rollback, and request approval for installation, replacement or deployment. Never assume the upstream skill is already installed.

[Back to Game Development collection](../README.md).
