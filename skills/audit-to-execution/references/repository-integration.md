# Existing-repository integration and PR workflow

## Read first

Inspect README, AGENTS or equivalent agent instructions, status/current work records, previous specs, audit, ADRs, roadmap, TODO, package/lockfiles, tests, CI rules and release instructions. For GitHub user content, use a connected GitHub app/CLI rather than public web indexing when authenticated access exists.

## Avoid accidental rewriting

- Preserve checked tasks from earlier deliveries and their evidence. If an old plan becomes obsolete, archive/supersede with explanation rather than deleting traceability.
- Read existing docs before updating. Append ADR entries with status, leave original decisions intact.
- Make a new feature specification separate from a historically delivered spec (e.g., a new studio for an existing site template).
- Keep `STATUS.md` a snapshot of what was actually verified as of date/commit, and distinguish a newly planned direction.
- Adapt repo conventions rather than forcing `docs/` hierarchy; avoid duplicate TODO sources of truth.
- Do not convert an existing technical rule into a softer suggestion merely because a UI should be convenient.

## Controlled Git flow

1. Confirm repository/ref and authorization. Reuse existing work branch/PR when requested.
2. Make new branch for major new documentation or work, unless the user authorized editing a specific existing branch.
3. Write a coherent set of documents; cross-check links and IDs.
4. Inspect diff; no unexpected code, permissions, lockfile, secrets, or env changes.
5. Run relevant checks. For docs-only work, run structural validation; don't claim source tests were rerun. For code, run project-required tests with version/SHA.
6. If user authorized GitHub updates, open PR with scope, decisions, evidence, limits and next action. Do not merge without authority/review checks.
7. Update user with direct file/PR URLs **only after their existence is verified**.

## Safety rules

Never upload secret values, API keys, signing credentials, private user data, or copies of `.env.local`. Never bypass protected branch rules, CI, governance, or security checks to complete a deliverable. When CI is unavailable because of quota/billing, mark unknown and give reproducible local validation if permitted, not a false pass.

## Continuation after a later session

Read the current `STATUS.md` and roadmap/plan, inspect current main/head and PR reviews, then resolve contradictions. Preserve task IDs and re-check earlier evidence against the new commit. Do not rely on prior conversational memory when repository evidence is available.
