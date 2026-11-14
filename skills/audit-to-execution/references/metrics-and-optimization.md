# Optimize for accepted output, not agent count

## Baseline and measurement

The reason for v2 is to improve **throughput and reliability**, not to maximize parallelism or produce elaborate dashboards. Use a simple per-wave record when the environment exposes actual data:

- task IDs and dependency class; accepted/completed/reopened/blocked counts;
- wall-clock and model usage **only if observed** (do not invent dollars, time or token numbers);
- number of worker attempts and context resets; integration conflicts and failed tests;
- evidence/CI status at merged or proposed commit;
- human interventions or authorizations actually requested;
- time spent on environment blockers, deferred items and retries.

## Decision heuristics

1. **Priority/critical path:** unblock high-value end-to-end workflows and safety contracts first; a task's `Impact`/`Effort` are rough human-assigned planning inputs, not measured ROI.
2. **Reuse-first:** search installed tools/skills once per active domain and reuse known-good ones; defer exhaustive skill discovery until the relevant wave starts. Persist source/version so unchanged choices need not be reaudited every session.
3. **Parallel only when safe:** independent files/contracts plus sufficient available tooling. For small tasks, one agent may be faster/cheaper than 3.
4. **Early integration:** integrate short vertical slices and run relevant tests rather than many unmerged branches.
5. **Bounded retry:** maximum 2 identical-scope attempts by default, with a different hypothesis between attempts; escalate/defer rather than thrash.
6. **Contract tests for absent devices:** use them to advance code quality but never substitute for mandatory real-device/production verification.
7. **Stop research when a decision is good enough:** compare a few serious alternatives, perform one decisive POC, record trade-off and proceed unless risk warrants deeper inquiry.

## Evaluation protocol

Compare v1 planning-only vs v2 run-all on **the same small repository fixture**, and then an existing repo with a realistic unavailability (e.g. mobile simulator absent). Record actual task acceptance, failures and PR reviews; don't claim speedup without matched measurements. Evaluate serial vs delegated wave only if available and authorized. Keep unit tests for deterministic scheduling separate from live-agent behavior evaluation.

A task is 'finished' only after acceptance evidence and applicable reviews; unexecuted environmental tests remain clearly marked pending. Avoid gaming metrics by splitting tasks artificially or lowering acceptance checks.
