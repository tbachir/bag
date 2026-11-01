# Changelog — agent-ready-documentation

## 2026-11-01 — Evidence-based review (changed)

- Previous verified date: not recorded (reviewed_at 2026-10-29 only); new verified date: **2026-11-01**. Next due: **2026-12-01 UTC**, unless upstream breaking/security change triggers earlier review.
- Findings and changes: Added freshness metadata and clarified portable Agent Skills metadata schema (flat string values), client-specific activation, and untrusted-document test requirement.
- Primary sources opened on 2026-11-01:
  - https://agentskills.io/specification
  - https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions
- Paths: `SKILL.md` and this `CHANGELOG.md`. No downstream applications or runtime dependencies changed.
- Validation: sources and BAG `apps/docs/package.json` inspected; **repository Node tests, docs build, link checker, Playwright and real agent integrations not executed** in this connector-based review. No API or UI runtime compatibility claim.
- Reviewer: automated BAG audit; review PR before merging.

