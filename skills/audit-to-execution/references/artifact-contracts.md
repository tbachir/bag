# Artifact contract and consistency

## Default mapping

| User needs | Required file | Purpose |
|---|---|---|
| Evidence-backed assessment | `docs/PROJECT-AUDIT.md` | What exists, comparison, key risks |
| Reproducible requirements | `docs/PROJECT-SPEC.md` | Contract of the proposed product/change |
| Staged delivery method | `docs/PROJECT-PLAN.md` | Dependencies, gates, tests and sequencing |
| Milestone overview | `ROADMAP.md` | Phases with completion checkboxes |
| Work queue | `TODO.md` | Atomic IDs, checkboxes, skill recommendations |
| Skill sourcing | `docs/SKILLS.md` | Sourcing policy and current candidates |
| Verified truth | `docs/STATUS.md` | Real evidence and remaining gaps |
| Architecture history | `docs/DECISIONS.md` | Append-only ADRs |
| Agent instructions | `AGENTS.md` | Repository-specific workflow, guardrails |
| Context retention | `docs/HANDOFF.md` | Starting point for next agent |
| History | `CHANGELOG.md` | Actual changes and noteworthy decisions |

Adapt names and locations to existing conventions. Do not create duplicative files merely to satisfy a fixed template. For example, if an existing `SPEC_V2.md` defines the delivered product and the user starts a new direction, create an additive spec for the new capability instead of overwriting the old one.

## Traceability contract

- Requirement IDs: `ABC-F01`, `ABC-F02`, etc.
- Work packages: `ABC-001`, `ABC-002`, etc.
- Atomic tasks: `ABC-001.1`, `ABC-001.2`, etc.
- Milestones: `M0`, `M1`, etc. or domain-friendly equivalents.
- 
  A task entry should have an outcome, acceptance evidence and explicit discovery metadata. Example:

```markdown
- [ ] **ABC-002.1** Define a versioned content schema; acceptance: valid/invalid fixtures and migration idempotence.
  - **Skills recommended:** [domain-modeling](https://skills.sh/mattpocock/skills/domain-modeling) (candidate; verify current source).
  - **Discovery:** `npx skills find "typescript versioned schema migration"`.
  - **Proof when done:** link to commit, test result and outcome.
```

Never add `Proof when done` as if it were an actual proof. In a completed task require an actual evidence link or credible reference. Do not fabricate PR numbers, CI runs or completion percentages.

## Required consistency checks

- All roadmap work packages are represented in the task list and implementation plan.
- All actionable tasks are mapped to a work package and acceptance criteria; no broken dependencies or loops.
- Changes to accepted architecture are reflected in spec + decision journal + plan.
- Status evidence is date- and commit-specific, separating historical from current.
- Unexecuted validation tasks remain unchecked; no blank approval checkbox masquerades as sign-off.
- Skill links are source-qualified, optional and dated; discovery queries vary by task.
- Repo-relative links resolve, and URLs/price/version claims are externally verified when material.

## Template usage

See `assets/README.md` for available skeletons. Scaffold with `python scripts/scaffold.py --root <target> --project "..." --prefix ABC` (dry-run by default); use `--write` to create **missing files only**. Always read the repo first, and manually reconcile existing documents.
