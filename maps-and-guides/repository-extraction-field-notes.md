# Extraction candidates from recent repositories — first evidence pass

**Scope:** source inspection on 2026-10-29, without executing code or copying third-party assets. The corresponding source repositories are reference material; this is not a production-tested extraction.

## SpecOS — readiness rules and specification profiles

Source: https://github.com/tbachir/specos/blob/main/rules/readiness.yaml and https://github.com/tbachir/specos/blob/main/specos.yaml (repository default branch must be confirmed before pinning a commit).

Observed: configurable engineering profiles, canonical Git docs, human gates, traceability and structured readiness checks. The source `rules/readiness.yaml` differentiates BLOCKER, ERROR, WARNING and INFO, with concrete rules for duplicate IDs, unknown references, dependency cycles, requirement ownership, acceptance criteria, contracts and generated-versus-canonical truth.

**Reusable extraction:** adapt a *methodological checklist* describing each check, applicability, waiver policy and evidence; avoid directly bundling enterprise defaults into every BAG project. Proposed canonical home: `maps-and-guides/best-practices/`, with links from the SpecOS inventory reference. Keep schema and code copies out until rights, provenance and standalone tests are settled.

## Mobile boilerplate — safe customization

Source: https://github.com/tbachir/sb-mobile-app-boilerplate/blob/main/docs/runbooks/customization.md

Observed: a PowerShell-compatible customization CLI, dry-run/diff, per-module operation, explicit confirmation for writes, separate remote provisioning, and checks `pnpm brand:check` / `pnpm test:customize`. The runbook warns that existing service identifiers can remain in forks and must be detached before remote actions.

**Reusable extraction:** a language-agnostic customization safety checklist and verification template, not its coupled CLI source. Proposed home: `maps-and-guides/best-practices/`, with references from a future branding/tooling loadout.

## Ombre — delegated execution risk model

Source: https://github.com/tbachir/ombre/blob/main/README.md

Observed: explicit preparation-only V1; deterministic risk and delegation gates; append-only history; human-validated preferences. **Not a functioning autonomous executor.**

**Reusable extraction:** study the risk/irreversibility matrix and decision journal before deriving an independent agent delegation rubric. The README alone is insufficient to certify the implementation or copy engine code; keep this at evaluating status.

## Required next validation

For each candidate: inspect actual implementation paths and license; pin a source commit; compare existing BAG items; run negative tests and verify no secrets or side effects. Promote to `ready` only with recorded evidence. The Repository Auditor and Reusable Component Extractor skills define those gates.
