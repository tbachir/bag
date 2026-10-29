---
name: api-documentation-quality
description: Create and audit contract-driven API documentation and practical integration guides.
license: MIT
metadata:
  language: en
  freshness:
    policy: fast-changing
    review_interval_days: 30
    last_verified: "2026-10-29"
    update_skill: skill-maintainer
---

# Api Documentation Quality

## Activate
When adding or revising REST, GraphQL, RPC, SDK or webhook documentation.

## Freshness gate — before applying this skill
Read [BAG's freshness policy](../../../maps-and-guides/skill-freshness-policy.md). If `metadata.freshness.last_verified` is missing, invalid, or more than 30 days old (UTC), **invoke the skill-maintainer workflow first**, using its `SKILL.md`. If it cannot verify sources or save an approved update, disclose the stale state, use only validated non-version-sensitive advice and ask for authorization before applying risky changes. Never pretend that a reference link or GitHub commit establishes verification.

## Procedure
1. Inspect the actual schema and deployed/versioned API contract; avoid inventing endpoints or assuming implementation matches an old spec.
2. For OpenAPI REST, document method, route, version, auth/scopes, path/query/body, validation, error status, idempotency, pagination, rate limits and stable examples. Mark implementation-specific requirements distinctly from standards.
3. Cover secure secret handling, auth/permissions, data minimization, retry/backoff, error recovery, breaking changes and deprecation.
4. Provide real request/response examples with synthetic values; make examples copyable but safe.
5. Generate reference from schemas where possible; add task-oriented tutorials separately. Cross-link canonical contract instead of duplicating it.
6. Test examples and schema validation against available mock/dev environments; note unavailable runtime and speculative behavior.

## Definition of done
Contract-linked API reference, practical quickstart, versioning/migration notes, validated examples and gap report.

## Authoritative references to recheck
- https://spec.openapis.org/oas/latest.html
- https://www.rfc-editor.org/rfc/rfc9457.html
- https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api

## Change history
See [CHANGELOG.md](CHANGELOG.md). A change in documentation is not a verified refresh unless its sources and outcome are logged.
