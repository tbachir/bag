# Planning, checkpoints and execution

## Make tasks executable

Tasks should be independent units with an observable outcome: `verb + artifact + acceptance`. A task is too broad when it spans multiple modules, has no verification, or must be split by another agent to make progress. Avoid false precision in time estimates.

For each task, record:

- Unique ID and checkbox
- Requirement / milestone
- Action and deliverable
- Blocking dependencies and parallelizable boundary
- Acceptance / explicit negative test
- 0–2 appropriate skill recommendations and targeted discovery query
- Proof reference on completion

Milestones require an exit gate such as `copy of product generated without manual code editing`, `release refuses unapproved artifact`, `mobile and desktop accessible`, not merely `UI built`.

## Dependency guidance

- Architecture or interface contracts come before parallel implementation.
- Prototype uncertain tools BEFORE broad migration.
- Break work into separate read/write ownership boundaries; avoid competing writes.
- Keep quality controls active during migration: snapshot parity, compatibility adapter, backup, rollback.
- Do not mark a phase complete until its required task evidence is current and there are no blocking errors.

## Verification matrix (adapt by domain)

| Domain | Automatic evidence | Independent evidence |
|---|---|---|
| Web/mobile | Type/lint/unit/integration/E2E/a11y/Lighthouse/build | Keyboard/screen-reader/device/human product review |
| Documentation | Links/structure/IDs/consistency checks | Owner/editorial/subject-matter approval |
| API/data | Contract tests, migrations, rollback, access tests | Security review and production-sample validation |
| Design/UX | Screenshot diff, design token checks | Human usability/accessibility testing |
| Business/process | Data reconciliation, sample workflow simulation | Responsible-person signoff and real-world pilot |
| Research/policy | Source traceability, date verification | Domain-expert verification where needed |

Tests that were **not run** should be explicitly marked as such. Historical tests are useful baseline but not proof for a changed commit.

## Prioritization

Recommended sequence: critical safety/data correctness → compatibility/data contract → minimum coherent user workflow → quality and review → external integrations → multi-project/optional automation. Prefer proof of one end-to-end vertical slice before building a generalized platform.

## Closure report

Summarize files, changed behavior, checks actually executed, evidence links, unchecked/blocked tasks, next actionable task and PR state. Never say a job, release, or merge happened unless verified through a tool or user-supplied evidence.
