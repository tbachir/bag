# Prompt recipes — Audit to Execution

Copy the prompt that matches the desired scope. In an agent where the skill is installed, prefix with `/audit-to-execution` (Claude/Antigravity) or `$audit-to-execution` (Codex) if manual invocation is necessary. The skill's instructions stay in `SKILL.md` — do not paste its full content into every prompt.

## 0. Verify installation without changing anything

```text
Use the audit-to-execution skill. Confirm you can read its SKILL.md, state which mode you would choose for this repository, and summarize the current sources of truth. Read-only: no changes, installs, pushes or deployments.
```

## 1. Audit an existing repository

```text
Use audit-to-execution in audit mode on the current repository. Read its AGENTS.md, STATUS, tests and decisions; verify today's versions and authoritative sources. Compare realistic approaches with costs, trade-offs and risks; give a verdict, evidence and a small POC for unresolved compatibility. Do not edit files.
```

## 2. Turn an idea into executable specifications

```text
Use audit-to-execution in spec mode for the idea described in this conversation. Define users, outcomes, in/out-of-scope, requirements with stable IDs, acceptance tests, security/privacy assumptions and measurable definition of done. Do not invent validation results.
```

## 3. Complete end-to-end project planning

```text
Use audit-to-execution in full mode on this project. Audit the current state, research alternatives, write a new or reconciled spec and plan, ROADMAP.md, checkable TODO.md with dependencies and task-specific skill discovery, and refresh necessary governance files. Preserve prior decisions and completed work. Work in a branch and prepare a PR if repository access and authorization allow; do not merge or deploy.
```

## 4. Research and attach skills to an existing TODO

```text
Use audit-to-execution in skills mode. For every actionable unchecked task in TODO.md, recommend at most two relevant skills and a task-specific `npx skills find` query. Search the open ecosystem, not just BAG. Check sources, recency and security; indicate installed vs suggested honestly. Update the skills catalog and documentation without changing task completion status.
```

## 5. Resume after a break

```text
Use audit-to-execution in refresh mode. Treat the repository's STATUS.md and current PR/CI as sources to inspect. Reconcile the roadmap, TODO, decision log and handoff with actual evidence. Keep stable task IDs; never re-check completed work without evidence or reset accepted decisions. Show the next executable tasks.
```

## 6. Migrate or rewrite an existing project

```text
Use audit-to-execution in full mode for a migration. First establish a tested baseline and inventory consumers, then compare migration paths, choose reversible intermediate stages, define compatibility and rollback gates, and create a checkable plan. Separate research from code implementation; do not cut over to production without explicit authorization.
```

## 7. Design a new product and validate a prototype first

```text
Use audit-to-execution to define the product and compare available starters or templates. Include a rapid user-journey/UI prototype as an early milestone, with criteria to accept or revise it before building the backend. Keep the new architecture compatible with the project constraints and document unresolved choices.
```

## 8. Parallel execution by several agents

```text
Use audit-to-execution in plan mode. Partition work into independent tasks with stable contracts and separate worktrees, minimizing overlapping files and repeated context. Include integration checkpoints, review roles, tests and bounded token/context budgets. Mark all unfinished tasks unchecked.
```

## 9. Non-software project

```text
Use audit-to-execution for this operational/process project. Replace code/build checks with measurable operational evidence, responsible roles, dates only when grounded, milestone exit gates and rollback/contingency steps. Produce a concise specification, roadmap, TODO and ready-to-execute prompts.
```

## 10. Audit quality of an agent-generated plan

```text
Use audit-to-execution to review the existing spec, plan and TODO. Flag speculative claims, missing requirement-to-task traceability, weak acceptance criteria, unsupported skill recommendations and unproven checked boxes. Propose the smallest corrections and verification plan; no automatic rewrite.
```

## 11. Prepare a reviewable PR (when explicitly authorized)

```text
Use audit-to-execution to implement the approved documentation plan on a dedicated branch. Preserve historic statements and repo conventions, run all applicable documentation/quality checks, inspect the final diff and open a PR with exact changed files and checks. Leave the PR open for review; do not merge or publish.
```

## 12. Create a project-specific derivative skill

```text
Use audit-to-execution as the baseline methodology. Inspect this project's domain constraints and AGENTS.md, then create a narrowly scoped new Agent Skill for its repeatable workflow. Reuse generic templates by reference, design evaluation cases, and keep high-level governance out of every task prompt. Do not duplicate the entire original skill or install anything until reviewed.
```
