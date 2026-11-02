# Changelog — skill-maintainer

## 2026-11-01 — Metadata compatibility migration (NOT a verification refresh)
- Replaced nested BAG-only freshness metadata with flat, string-valued `bag-*` keys per [Agent Skills specification](https://agentskills.io/specification).
- **Previous and current last verified: 2026-10-29**. This metadata-only edit does not establish a new upstream review. Next due: 2026-11-28 UTC.
- Source consulted: https://agentskills.io/specification (2026-11-01). Vendor-specific procedures, tests, builds and integrations **not reverified**.
- Also clarified flat-key workflow terminology and added a non-recursive bootstrap when Skill Maintainer itself is stale; this is a method correction, not an upstream verification refresh.
- Changed path: `SKILL.md`; reviewer: automated BAG audit.

## 2026-10-29 — Initial edition (baseline)
- Added the skill with initial official reference URLs and a 30-day review policy.
- **Verification scope:** documented source links and workflow design; no integration or compatibility tests executed.
- **Next review due:** 2026-11-28 (UTC).
- **Reviewer:** initial BAG curation.

