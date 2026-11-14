# Copy-ready prompts — create, install and use skills

All prompts below are **standalone**: they include an exact BAG reference and a request to read the relevant BAG AGENTS.md chain and the destination project instructions. Use the shortest prompt that fits the task. **Do not paste the entire skill into every agent request.** The agent must not claim that it installed, tested or connected anything unless it actually did.

## Installation prompts

### Install in Codex (project-only)

```text
Install audit-to-execution for Codex in this repository only. Source: https://github.com/tbachir/bag/tree/main/skills/audit-to-execution
Read https://github.com/tbachir/bag/blob/main/AGENTS.md and the item's README and SKILL.md, plus this repository's own AGENTS.md. Check versions and bundled scripts, then use the Codex project skill directory (.agents/skills/). Do not overwrite files. Verify discovery in a new Codex session and show exact files changed; no global installation or push.
```

### Install in Claude Code (project-only)

```text
Install audit-to-execution for Claude Code in this repository only. Source: https://github.com/tbachir/bag/tree/main/skills/audit-to-execution
Read BAG root AGENTS.md, the skill README/SKILL.md and this project's AGENTS.md. Verify the source, copy the full skill folder under .claude/skills/ without overwriting, and test read-only invocation /audit-to-execution. Report any unsupported features. Do not install globally, push or deploy.
```

### Install in Antigravity (project-only)

```text
Install audit-to-execution as a project Agent Skill for Google Antigravity. Source: https://github.com/tbachir/bag/tree/main/skills/audit-to-execution
Read BAG's root AGENTS.md, the skill files, and this project's AGENTS.md. Use .agents/skills/audit-to-execution/ according to the current official docs; do not use legacy .agent/skills unless necessary. Check accessibility to the slash command /audit-to-execution, reload if needed, and report exact evidence. No global changes or deployments.
```

### Set up ChatGPT reuse (account capability dependent)

```text
Help me reuse audit-to-execution across ChatGPT chats. Canonical source: https://github.com/tbachir/bag/tree/main/skills/audit-to-execution
Read BAG root AGENTS.md and the skill README/SKILL.md. Check which ChatGPT Skills or private skills-only Plugins option is actually available to this account, package the full skill securely, and present the real install/enable action. Do not call it learned, permanently installed or enabled until the platform confirms and I complete any required UI authorization.
```

### Install the skill globally, after review

```text
I want audit-to-execution available across my local projects in [Codex / Claude Code / Antigravity]. Source: https://github.com/tbachir/bag/tree/main/skills/audit-to-execution
Read BAG's root AGENTS.md and this skill. Validate its source and any scripts, inspect the official current global path for my chosen client, then propose or perform the global installation only within my authorization. Verify discovery and provide a rollback/uninstall method. Do not assume that this changes ChatGPT account skills.
```

## Invocation prompts

### 1 — Full project audit → spec → plan → PR

```text
Use audit-to-execution from https://github.com/tbachir/bag/tree/main/skills/audit-to-execution on this project. Read BAG root AGENTS.md and the skill, and this project's own instructions. Inspect the real current state and official sources; write a comparative audit, a testable cahier des charges, an implementation plan, ROADMAP.md and TODO.md with stable checkbox IDs. Recommend skills for each task using find-skills (not BAG alone). Keep STATUS/ADR/README/AGENTS/HANDOFF consistent. Work on a new branch and prepare a PR if authorized; do not merge or deploy.
```

### 2 — Research only / decision record

```text
Use audit-to-execution (https://github.com/tbachir/bag/tree/main/skills/audit-to-execution), reading BAG root AGENTS.md and my project's instructions. Audit the technical options for this request, compare evidence, maintenance, cost, accessibility and security, identify unknowns, and recommend a small POC. Read-only: no commits, installs or publication.
```

### 3 — Existing roadmap refresh

```text
Use audit-to-execution (https://github.com/tbachir/bag/tree/main/skills/audit-to-execution) to reconcile my existing ROADMAP.md, TODO.md, STATUS.md, current CI/PR and ADRs. Read BAG root AGENTS.md and the target project's instructions first. Preserve historical evidence, maintain stable task IDs and only check tasks with fresh proofs. Report the next executable lot and blocked items.
```

### 4 — Add find-skills to every task

```text
Use audit-to-execution (https://github.com/tbachir/bag/tree/main/skills/audit-to-execution) and BAG root AGENTS.md. For each actionable TODO, search the open skills ecosystem (find-skills/skills.sh and other primary sources, not just BAG), inspect provenance/security/freshness, recommend 0–2 relevant skills with a task-specific discovery query, and update docs/SKILLS.md. Do not install unreviewed skills or mark tasks complete.
```

### 5 — Migration with reversible stages

```text
Use audit-to-execution (https://github.com/tbachir/bag/tree/main/skills/audit-to-execution) after reading BAG root AGENTS.md and current project instructions. Audit the migration, list all consumers, define compatibility gates and rollback, then plan small work packages with tests and evidence. Preserve current services until equivalent behavior is verified; no production cutover.
```

### 6 — Multi-agent autonomous implementation plan

```text
Use audit-to-execution (https://github.com/tbachir/bag/tree/main/skills/audit-to-execution) and BAG root AGENTS.md. Break the validated plan into parallelizable, bounded tasks, each with interfaces, ownership, dependency IDs, worktree isolation, 1–2 suggested skills, acceptance criteria, integration reviews and evidence requirements. Minimize context duplication; don't launch agents or commit until authorized.
```

### 7 — Validate this new skill before distributing

```text
Audit the skill in my current project against https://github.com/tbachir/bag/tree/main/templates/skills. Read BAG root AGENTS.md and this project's instructions. Inspect its SKILL.md, README, references, installation instructions, prompts, examples and evaluations. Run relevant local validation, simulate 3 realistic user prompts, identify ambiguous triggers and unsafe commands, and prepare fixes on a branch without automatically publishing.
```

### 8 — Generate a new reusable skill from a completed workflow

```text
Create a portable Agent Skill from the reusable parts of our current work, following https://github.com/tbachir/bag/tree/main/templates/skills. Read BAG root AGENTS.md, the template docs and project instructions. Deduplicate against existing BAG skills, produce a focused SKILL.md, README, install guide, copyable prompts and eval cases; use the generator where available. Validate it, open a PR if authorized and report how to install it into Codex, Claude Code, Antigravity and ChatGPT. Never archive confidential conversation contents.
```

### 9 — Non-software project

```text
Use audit-to-execution from https://github.com/tbachir/bag/tree/main/skills/audit-to-execution and BAG root AGENTS.md to turn this operational/design/research goal into verifiable requirements, milestones, checkable tasks, skills or resources suited to the domain, and a handoff plan. Use operational evidence instead of invented CI/build results. Do not create a GitHub repo unless requested.
```

## Authoring tip

Keep invocation prompts **short and outcome-oriented**. The source skill contains the methodology, and the target repository contains the technical rules. Cross-link both instead of repeating a long runbook in every prompt. Change the fixed skill link only when working from a pinned tag/private fork or pre-merge branch; ensure the referenced path actually exists.
