# workflow-threads-manager

- **Category:** Skill Tree / external skill reference
- **Status:** evaluating (not installed or executed)
- **Upstream skill:** https://github.com/MengTo/Skills/blob/main/agent-skills/workflow/workflow-threads-manager/SKILL.md
- **Upstream collection:** https://github.com/MengTo/Skills/tree/main/agent-skills/workflow
- **License:** MIT ([upstream license](https://github.com/MengTo/Skills/blob/main/LICENSE))
- **Last reviewed:** 2026-10-30
- **Compatibility:** Multi-agent environments (Claude Code, git worktrees, background processes)

## Purpose

Coordinate and triage concurrent agent sessions working on a single repository: monitor what landed on `main`, audit changelog coverage, verify live site health, recover cut-off threads, and archive completed sessions safely without losing unmerged work or visual captures.

## Use and acceptance

Review the [canonical SKILL.md](https://github.com/MengTo/Skills/blob/main/agent-skills/workflow/workflow-threads-manager/SKILL.md). Core triage questions:
1. **What landed on `main`:** Commits landed since last check, versioning, and changelog image coverage.
2. **Live site health:** Are live endpoints healthy, serving all referenced scripts and assets (catching 200 HTML with 404 assets).
3. **Thread status:** Triage active threads (running, clean done, cut off mid-task, waiting on user, or broken).
4. **Safe archiving:** Archive only fully committed and merged sessions after preserving ignored screenshots in persistent archive storage.

## Trade-offs and safety

- **No permission laundering:** Never execute an action another thread was denied (e.g. production deploy or permission bypass).
- **No uncoordinated edits:** Inspect other worktrees before modifying shared resources (changelogs, asset manifests) to avoid conflict overwrites.
- **Session tool dependency:** Upstream references `mcp__ccd_session_mgmt__*` tools; in other agent platforms, adapt this to native session/process inspection tools or git worktree tracking.

## Reusable integration prompt

> Inspect our multi-agent setup, git worktree structure, session tools, and changelog/audit scripts. Read BAG's root-to-item instructions and [this reference](https://github.com/tbachir/bag/blob/main/skill-tree/skills/agent-workflows/workflow-threads-manager/README.md), then review the upstream SKILL.md. Perform a structured triage check: inspect recent commits on main, verify changelog coverage and live health, report open worktrees and threads, and archive or rescue sessions safely without repeating blocked operations.

[Back to Agent Workflows collection](../README.md).
