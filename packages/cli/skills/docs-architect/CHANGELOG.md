# Changelog — docs-architect

## 2026-11-01 — Evidence-based review (changed)

- Previous verified date: 2026-10-29; new verified date: **2026-11-01**. Next due: **2026-12-01 UTC**, unless upstream breaking/security change triggers earlier review.
- Findings and changes: Converted nested freshness metadata to flat Agent Skills-compatible string keys and clarified Diátaxis vs folders and Fumadocs loader() vs BAG custom compiler. No site code changed.
- Primary sources opened on 2026-11-01:
  - https://diataxis.fr/
  - https://www.fumadocs.dev/docs/page-conventions
  - https://www.fumadocs.dev/docs/deploying/static
- Paths: `SKILL.md` and this `CHANGELOG.md`. No downstream applications or runtime dependencies changed.
- Validation: sources and BAG `apps/docs/package.json` inspected; **repository Node tests, docs build, link checker, Playwright and real agent integrations not executed** in this connector-based review. No API or UI runtime compatibility claim.
- Reviewer: automated BAG audit; review PR before merging.

