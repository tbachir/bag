# Changelog — api-documentation-quality

## 2026-11-01 — Evidence-based review (changed)

- Previous verified date: 2026-10-29; new verified date: **2026-11-01**. Next due: **2026-12-01 UTC**, unless upstream breaking/security change triggers earlier review.
- Findings and changes: Migrated metadata and updated guidance for OAS 3.2.1 (2026-09-10), deployed-contract validation, RFC 9457 and version-aware tooling; no forced OAS migration.
- Primary sources opened on 2026-11-01:
  - https://spec.openapis.org/oas/latest.html
  - https://www.rfc-editor.org/rfc/rfc9457.html
  - https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api
- Paths: `SKILL.md` and this `CHANGELOG.md`. No downstream applications or runtime dependencies changed.
- Validation: sources and BAG `apps/docs/package.json` inspected; **repository Node tests, docs build, link checker, Playwright and real agent integrations not executed** in this connector-based review. No API or UI runtime compatibility claim.
- Reviewer: automated BAG audit; review PR before merging.

## 2026-10-29 — Initial edition (baseline)
- Added the skill with initial official reference URLs and a 30-day review policy.
- **Verification scope:** documented source links and workflow design; no integration or compatibility tests executed.
- **Next review due:** 2026-11-28 (UTC).
- **Reviewer:** initial BAG curation.

