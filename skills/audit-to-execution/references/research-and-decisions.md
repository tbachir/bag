# Research, audit and decision quality

## Evidence hierarchy

1. The user's explicit goals and non-negotiable constraints.
2. Live repository state, source code, tests, actual CI/deploy results with commit identity.
3. Primary vendor/framework documentation and public standards with as-of date.
4. Reliable case studies, user feedback and community discussions where relevant.
5. Hypotheses, estimates and professional judgment — **clearly labeled**.

If claims from these sources conflict, explain and verify; do not quietly choose whichever confirms the preferred architecture. For regulatory, security, pricing, release and compatibility questions, check current primary sources.

## Audit structure

- Scope and baseline (paths, versions, evidence, known unknowns)
- Problem statement and user outcomes
- Findings by criticality: P0 (blocking), P1 (material), P2 (optional)
- Options matrix (2–5 real candidates)
- Verdict, assumptions and tradeoffs
- What to validate before commitment (spike/tests)
- Risks and mitigations
- Out of scope / explicitly not promised
- Source URLs and date checked

Suggested qualitative decision criteria (reweight for domain): functional coverage, fit with constraints, portability, operational complexity, security/privacy, accessibility, performance, cost, long-term maintenance, migration risk. Scores are **optional**. Never assign precise scores without a documented basis; comparisons such as High/Medium/Low may be more honest.

## Spike protocol

For decisive uncertainty, write one small experiment with:

- Hypothesis / alternatives and environment versions
- Actions and how to reproduce
- Measurable success and failure conditions
- Evidence artifact (logs, tests, screenshots, source diff)
- Go/no-go decision and consequences
- Post-spike ADR entry with date

A library showing a marketing demo is not equivalent to compatibility verified against the target repository.

## Decision journal pattern

Append, never erase earlier decisions:

`ADR-NNN — Title — YYYY-MM-DD` with **Status** (proposed/accepted/superseded), **Context**, **Decision**, **Alternatives**, **Consequences**, **Evidence**, **Supersedes** when applicable.

Preserve uncertainty as `open` until a test or real product decision closes it.
