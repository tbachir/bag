# workflow-progress-screenshots

- **Category:** Skill Tree / external skill reference
- **Status:** evaluating (not installed or executed)
- **Upstream skill:** https://github.com/MengTo/Skills/blob/main/agent-skills/workflow/workflow-progress-screenshots/SKILL.md
- **Upstream collection:** https://github.com/MengTo/Skills/tree/main/agent-skills/workflow
- **License:** MIT ([upstream license](https://github.com/MengTo/Skills/blob/main/LICENSE))
- **Last reviewed:** 2026-10-30
- **Compatibility:** Node.js (CDP) / Python (Pillow for compare) / Browser viewports

## Purpose

Capture and present real rendered visual proof (screenshots) unasked as work progresses, capturing the initial state, key interactive moment, and final outcome.

## Use and acceptance

Review the [canonical SKILL.md](https://github.com/MengTo/Skills/blob/main/agent-skills/workflow/workflow-progress-screenshots/SKILL.md) and any linked upstream scripts. Core rules:
- **Send, don't describe:** File attachments or inline images, not plain text path descriptions.
- **Three-state framing:** Capture the start, the key interactive moment (e.g., hover, animation, modal open), and the final result with consistent viewport dimensions.
- **Real renders only:** Inspect real renders or headless CDP captures, not mockups or stagnant canvases.
- **Self-review before sending:** Verify images are free of missing fonts, broken textures, or stray UI toasts.

## Trade-offs and safety

Upstream scripts (`capture.mjs`, `compare.py`) are reference helpers; do not execute untrusted external scripts without prior review. Adapt viewport and capture mechanisms to your environment (e.g. Chrome DevTools MCP, Playwright, or local browser sidecars).

## Reusable integration prompt

> Inspect the current project's UI/visual testing tools, AGENTS.md and capture capabilities. Read BAG's root-to-item instructions and [this reference](https://github.com/tbachir/bag/blob/main/skill-tree/skills/agent-workflows/workflow-progress-screenshots/README.md), then review the canonical upstream SKILL.md. Configure a local, gitignored capture folder, verify headless browser tooling, establish start/moment/result capture routines for visual changes, and report visual outcomes with honest labels and captions.

[Back to Agent Workflows collection](../README.md).
