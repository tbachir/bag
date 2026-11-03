---
name: api-documentation-quality
description: Create and audit contract-driven API documentation and practical integration guides.
license: MIT
metadata:
  language: en
  bag-freshness-policy: fast-changing
  bag-review-interval-days: "30"
  bag-last-verified: "2026-11-01"
  bag-update-skill: skill-maintainer
---

# Api Documentation Quality

## Activate
When adding or revising REST, GraphQL, RPC, SDK or webhook documentation.

## Freshness gate — before applying this skill
Read [BAG's freshness policy](../../maps-and-guides/skill-freshness-policy.md). If `metadata.bag-last-verified` is missing, invalid, or more than 30 days old (UTC), **invoke the skill-maintainer workflow first**, using its `SKILL.md`. If it cannot verify sources or save an approved update, disclose the stale state, use only validated non-version-sensitive advice and ask for authorization before applying risky changes. Never pretend that a reference link or GitHub commit establishes verification.

## Procedure
1. Inspect the actual schema and deployed/versioned API contract; avoid inventing endpoints or assuming implementation matches an old spec.
2. For OpenAPI REST, document method, route, version, auth/scopes, path/query/body, validation, error status, idempotency, pagination, rate limits and stable examples. Mark implementation-specific requirements distinctly from standards.
3. Cover secure secret handling, auth/permissions, data minimization, retry/backoff, error recovery, breaking changes and deprecation.
4. Provide real request/response examples with synthetic values; make examples copyable but safe.
5. Generate reference from schemas where possible; add task-oriented tutorials separately. Cross-link canonical contract instead of duplicating it.
6. Test examples and schema validation against available mock/dev environments; note unavailable runtime and speculative behavior.

## Current standard and compatibility review (2026-11-01)

- The [current OpenAPI specification](https://spec.openapis.org/oas/latest.html) is **3.2.1 (2026-09-10)**. Record the version of the *actual contract* and the parser/generator's supported dialect; do not silently upgrade a 3.0/3.1 description just because 3.2.1 exists.
- Treat an OpenAPI schema check as a syntax/contract gate, **not** proof that deployed endpoints, authorization or examples behave as documented. Exercise examples against a permitted mock or test environment and record differences.
- [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) defines Problem Details for HTTP APIs and obsoletes RFC 7807. Document `application/problem+json` only when the API actually implements it; otherwise describe its real error envelope. Check pagination, idempotency and retry behavior against the provider's contract (for example [GitHub REST practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api)).

## Definition of done
Contract-linked API reference, practical quickstart, versioning/migration notes, validated examples and gap report.

## Authoritative references to recheck
- https://spec.openapis.org/oas/latest.html
- https://www.rfc-editor.org/rfc/rfc9457.html
- https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api

## Change history
See [CHANGELOG.md](CHANGELOG.md). A change in documentation is not a verified refresh unless its sources and outcome are logged.
