# Audit to Execution — portable Agent Skill

A reusable, **cross-project** skill capturing an evidence-based workflow from idea or existing repository to audit, solution comparison, requirements, implementation plan, checkable roadmap/TODO, task-specific skill discovery, governance updates, **and continuous execution to convergence when requested**.

It is **not limited** to website templates or to software projects. It also handles operations, design, research, process improvement and project pivots.

## V2 — finish the plan in one go

Say **"Use audit-to-execution in run-all mode: implement as much of the entire plan as safely possible in this session, without stopping between tasks. If macOS/simulators/devices or external access are unavailable, defer those noncritical checks to the end, continue every independent task, and report remaining blockers explicitly. Do not merge/publish without my authorization."**

Under the hood, the skill prioritizes dependency-safe waves and can delegate work to independent agents/worktrees, but **doesn't ask for approval for every wave**. It bounds retries, checkpoints state, runs quality gates, and revisits deferred items at the end. Actual implementation still requires a coding agent with repository tools; the bundled Python planner forecasts work but **doesn't execute code**. There is no unattended background execution unless an authorized scheduler supports it.

See [continuous execution and deferred blockers](references/execution-engine.md), [minimal agent packets](references/context-contract.md), [optional Spec Kit](references/spec-kit-adapter.md) and [metrics](references/metrics-and-optimization.md).

## What it produces

- Evidence-backed audit and comparisons with explicit uncertainty
- Structured requirements with measurable acceptance criteria
- Milestones and scoped/parallelizable execution plan
- `ROADMAP.md` and `TODO.md` with stable checkboxes and IDs
- Recommended **agent skills per task**, task-specific `npx skills find` queries and source/safety review
- Preserved status, history, decisions, instructions and handoff
- Optional branch/PR workflow only if explicitly authorized and possible
- When requested: ongoing implementation, bounded tests/reviews/convergence and a clearly identified deferred environment/permission tail

## Install in your chosen agent

Once published in BAG, use the shared installer and explicitly select the target agent. Check versions and commands at installation time.

```sh
# Codex (global)
npx skills add https://github.com/tbachir/bag --skill audit-to-execution -a codex -g
# Claude Code (global)
npx skills add https://github.com/tbachir/bag --skill audit-to-execution -a claude-code -g
# Antigravity (project-local)
npx skills add https://github.com/tbachir/bag --skill audit-to-execution -a antigravity
```

Use the [installation guide](references/installation.md) for manual Windows paths, Antigravity App vs CLI differences, and ChatGPT Skills/private plugin support. **Before the BAG PR is merged**, install the extracted folder locally with `npx skills add ./audit-to-execution` instead of the remote source. A discussion or GitHub reference is not a persistent ChatGPT skill installation.

## Usage examples

- `Use audit-to-execution to audit this repo and create a complete spec + roadmap with skills and an implementation plan.`
- `Use audit-to-execution run-all. Finish the entire feasible plan without asking me at each step. Put unavailable iOS/macOS/device checks at the end; keep completing independent work; verify and report evidence.`
- `Audit several architectures, preserve our existing decisions and update ROADMAP.md/TODO.md. No pushes.`
- `Turn our onboarding process notes into a cahier des charges, checkable delivery plan and validated skills shortlist.`
- `Continue the current PR and add find-skills recommendations to every unchecked task without changing completion states.`
- `Before changes, read STATUS.md as the source of truth, then update the plan and prepare a PR. Do not merge.`

The skill is meant to **trigger naturally** on requests for feasibility audits, specifications, project pivots, roadmaps, execution plans and task-specific agent skills.

For one-click copy/paste workflows, see [12+ example prompts](references/prompts.md).

## Delegate directly from BAG (no prior installation required)

Copy this **self-contained** prompt into an agent operating in your target repository:

```text
Use the Audit to Execution skill from https://github.com/tbachir/bag/tree/main/skills/audit-to-execution to audit this project, then prepare an evidence-based specification, implementation plan, checkable ROADMAP.md and TODO.md with task-specific skill discovery.

First read https://github.com/tbachir/bag/blob/main/AGENTS.md and all applicable nested BAG AGENTS.md files down to this skill, then its README.md, SKILL.md and relevant references. Read this project's own instructions and existing status before editing anything. Preserve completed work and approved decisions, run actual checks, report unverified items, and use a branch/PR only if authorized. Do not merge or deploy without permission.
```

This works as a **reference-reading request** when the agent can access GitHub; it does not install the skill or grant repository access. For actual persistent installation, see [the installation guide](references/installation.md).

## Files

- `SKILL.md`: main agent instructions, short enough to load by default
- `references/`: focused methodology and governance guides, read on demand
- `assets/`: safe starter templates (not final decisions)
- `examples/`: example modes, including non-software and existing projects
- `scripts/scaffold.py`: dry-run by default, creates only absent files when `--write` is supplied
- `scripts/execution.py`: read-only dependency-wave forecasting + explicit atomic checkpoint writing; does **not** implement tasks
- `scripts/validate_project.py`: checks task IDs, roadmap linkage, discovery guidance and evidence placeholders
- `scripts/validate_skill.py`: local skill structure/frontmatter check
- `tests/`: offline unit tests; `evals/evals.json`: prompts for future agent-level behavioral evaluation

## Optional scaffold and validation

Run these commands from the **extracted skill folder**:

```sh
python scripts/validate_skill.py
python -m unittest discover -s tests -v
python scripts/scaffold.py --root /path/to/existing-project --project "My Product" --prefix PRJ
# Review the dry-run output, then (only if safe):
python scripts/scaffold.py --root /path/to/existing-project --project "My Product" --prefix PRJ --write
python scripts/validate_project.py --root /path/to/existing-project --prefix PRJ
python scripts/execution.py --root /path/to/existing-project plan --max-parallel 3 --json
```

The scaffold **never overwrites files** and never alters AGENTS.md, README.md or CHANGELOG.md automatically; the agent reconciles them against project conventions and preserved instructions. Structural validation does not replace code tests, functional review, links verification, or permission/security review.

## Boundaries

The skill never assumes it has deployment, repository or account access. No automatic installation of third-party skills, merges, publications, bills, admin approvals or secrets operations. Skill candidates are rechecked at the time of use; internal collections such as BAG are optional sources among others. Completion claims must point to actual evidence.

## Portability and maintenance

The folder uses standard `SKILL.md` frontmatter, no tool-specific magic. It relies on Python 3 standard library for helpers; core instructions work without scripts. Keep it in a versioned skills repository or your personal library to reuse across machines, and check external references when technology changes. Test it with the example prompts in `evals/evals.json` to refine trigger phrasing and output quality.
