# Example requests and mode selection

## A. Existing software repository: add a new admin capability

**User:** "Audit the best way to turn this website template into a configurable editor. Create specifications, a checkable roadmap, attach skills to every task, update the repository and open a PR."

**Mode:** `full`.

**Workflow:** read baseline, source/CI/architecture; compare CMS/editor/bespoke options; draft scoped MVP + migration + release gates; create feature spec without deleting original product contract; ROADMAP/TODO with stable task IDs and skills find queries; update STATUS/AGENTS/README/ADRs/HANDOFF; verify docs-only diff; open PR only if authorized.

**Critical:** do not mark a new editor shipped; historical tests of the old site are not evidence for the new feature.

## B. New business initiative without code

**User:** "Design a scalable process for onboarding 100 new franchise partners with a clear playbook, tasks and skill suggestions."

**Mode:** `full` + non-code adaptations.

**Workflow:** audit current process and stakeholder constraints, compare automation/CRM/no-new-tool options, spec operational workflow, milestones with pilot + consent/privacy gates, TODO tasks with process/analytics/compliance skills or justified none. Produce a plan for a real-world pilot; do not fabricate staff approval or assume a CRM subscription.

## C. Existing plan needs updating

**User:** "We completed part of the migration and changed the scope. Update the roadmap, keep history and propose the next work packages."

**Mode:** `refresh`.

**Workflow:** read current repo and evidence, reconcile done/not done/blocked, retain stable IDs, supersede outdated ADR instead of erasing, add new tasks with targeted skill discovery, preserve project-specific constraints. No new audit unless material facts/technology have changed.

## D. Audit only

**User:** "Which of three CMS approaches is best for our nonprofit website?"

**Mode:** `audit`.

**Workflow:** examine organizational constraints and existing assets, research current sources and compare alternatives with uncertainty and cost assumptions; deliver justified verdict and a small pilot plan. Do not create repository files or PR without being asked.

## E. Skills only

**User:** "Add skills to each TODO item; don't restrict yourself to our internal skill repo."

**Mode:** `skills`.

**Workflow:** use `find-skills`, broad discovery and installed capabilities; add task-specific links and queries to TODO; add a catalog and review policy; leave original completion states untouched. A skill recommendation is not an installation.

## Test prompts

The skill's `evals/evals.json` includes these scenarios plus explicit expected checks. Run them with and without this skill when the relevant agents and target repositories are available; static package validation alone does not demonstrate agent behavioral quality.
