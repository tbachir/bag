# Changelog — prompt-quality-reviewer

## 2026-11-01 — Evidence-based review (changed)

- Previous verified date: 2026-10-29; new verified date: **2026-11-01**. Next due: **2026-12-01 UTC**, unless upstream breaking/security change triggers earlier review.
- Findings and changes: Migrated metadata and challenged prompt-only optimization: add held-out evals, frozen model/config, human calibration and model-vs-prompt intervention choices.
- Primary sources opened on 2026-11-01:
  - https://platform.openai.com/docs/guides/evaluation-best-practices
  - https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
  - https://ai.google.dev/gemini-api/docs/prompting-strategies
- Paths: `SKILL.md` and this `CHANGELOG.md`. No downstream applications or runtime dependencies changed.
- Validation: sources and BAG `apps/docs/package.json` inspected; **repository Node tests, docs build, link checker, Playwright and real agent integrations not executed** in this connector-based review. No API or UI runtime compatibility claim.
- Reviewer: automated BAG audit; review PR before merging.

## 2026-10-29 — Initial edition (baseline)
- Added the skill with initial official reference URLs and a 30-day review policy.
- **Verification scope:** documented source links and workflow design; no integration or compatibility tests executed.
- **Next review due:** 2026-11-28 (UTC).
- **Reviewer:** initial BAG curation.

