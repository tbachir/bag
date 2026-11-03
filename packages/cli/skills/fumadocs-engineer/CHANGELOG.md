# Changelog — fumadocs-engineer

## 2026-11-01 — Evidence-based review (changed)

- Previous verified date: not recorded (reviewed_at 2026-10-29 only); new verified date: **2026-11-01**. Next due: **2026-12-01 UTC**, unless upstream breaking/security change triggers earlier review.
- Findings and changes: Added Agent Skills-compatible freshness metadata and adapter-specific release checks. BAG pins Fumadocs Core 16.17.8, MDX 15.4.10, Base UI alias 16.17.8; official changelog lists fumadocs 16.17.9 (2026-10-28). No upgrade performed.
- Primary sources opened on 2026-11-01:
  - https://www.fumadocs.dev/changelog
  - https://www.fumadocs.dev/docs/page-conventions
  - https://www.fumadocs.dev/docs/deploying/static
- Paths: `SKILL.md` and this `CHANGELOG.md`. No downstream applications or runtime dependencies changed.
- Validation: sources and BAG `apps/docs/package.json` inspected; **repository Node tests, docs build, link checker, Playwright and real agent integrations not executed** in this connector-based review. No API or UI runtime compatibility claim.
- Reviewer: automated BAG audit; review PR before merging.

