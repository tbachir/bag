# Changelog — audit-to-execution

## 2026-11-14 — v2.1.1 (independent Codex review fixes)

- `bun run test` invokes the configured package script rather than Bun's built-in test command.
- Timeout now terminates the check process **and child process tree** (POSIX process group / Windows taskkill fallback) before returning, preventing orphan background checks.
- New bounded pilots ignore stale `in_progress` checkpoints of TODO tasks already verified complete, so a second pilot can start without manual checkpoint edits.
- Three regression tests added: Bun script command, real orphan-child timeout, and closed-pilot restart.


## 2026-11-14 — v2.1.0 (measured bounded pilots, fast preflight, structured backlog)

- Added `run-all --pilot` to execute only explicit task IDs (default cap four) with persistent scope, stop conditions and refused out-of-scope records. No agent execution is claimed by the CLI.
- Added `scripts/preflight.py`: read-only preview, allowlisted typecheck/lint/format/unit execution, finite budget, early exit and explicit missing-check reporting. No shell or third-party install.
- Added optional `docs/EXECUTION-METADATA.json` contract for per-task dependencies, ownership, priority and environment; rejects unknown IDs, malformed fields, cycles and conflicting TODO entries. Does not change TODO state.
- Added isolated Python regression coverage, examples and reproducible commands from the four-task Studio pilot. Actual live-agent speed/token improvements **remain unmeasured**; CI timing and failures are reported without fabricated A/B claims.


## 2026-11-14 — v2.0.0 (continuous execution and deferred-blocker orchestration)

- Added explicit `execute`, `run-all`, `resume`, `converge` and `optimize` modes; `full` remains planning unless implementation is requested.
- Added dependency-safe wave scheduler with critical-path sorting, optional parallel file ownership, status checkpointing, environment deferral and bounded attempts (no autonomous code execution in helper).
- **One-tract requirement:** `run-all` continues every safe feasible task in the active session; noncritical missing Mac/iOS/Android/device/GPU/network/access constraints are recorded, postponed to a final pass and never represented as completed. Mandatory security/release approvals remain blocking.
- Added minimal worker mission packets, coordinator/worktree isolation, metrics evaluation and an optional installed-only Spec Kit adapter.
- Added deterministic execution tests and behavioral evaluation cases for deferral, exact/prefix-glob and active-worker ownership conflicts, occupied worker capacity, cycles, retries and resume. Neither offline tests nor skills instructions prove live multi-agent throughput improvements.
- Preserved earlier audited/approved project evidence, task IDs and safety policy; no automatic merge or deployment permission added.

## 2026-11-14 — v1.1.0 (portable installation and BAG integration)

- Added verified, scope-aware installation instructions for Codex, Claude Code, Antigravity App/IDE/CLI and eligible ChatGPT Skills or private plugins.
- Added focused, ready-to-run example prompts for audit, spec, plan, full, refresh, skills, migration, parallel agents, non-software projects and PR handoff.
- Added distribution/provenance safeguards: skills and repositories are opt-in, suggestions do not equal installs, and evidence cannot be inferred from prior CI runs.
- Preserved the non-destructive project scaffolder, verifier, tests and existing reference templates. Installation commands require a review of external scripts and the target agent environment.

Source verification: Agent Skills specification, Vercel Skills CLI, official Codex, Claude Code, Antigravity and ChatGPT product documentation, checked 2026-11-14. This is a documentation and packaging review; the skill has not been behaviorally benchmarked on all five agent products.

## 2026-11-14 — v1.0.0

- Initial cross-project audit-to-execution workflow derived from a real repository documentation pivot.
- Added project templates, 3 no-dependency Python helpers, unit tests and evaluation examples.

## 2026-11-14 — BAG integration and shared installer documentation

- Integrated portable skill with BAG catalogue metadata and canonical template/installation guide references.
- Rechecked upstream skill installation paths for Codex, Claude Code, Antigravity, and ChatGPT using official documentation (see `references/installation.md`).
- The skill's Python unit tests and structural validation are separate from client-level use; no real remote agent execution is implied.

## 2026-11-14 — Codex PR review fixes

- Added a self-contained BAG delegation prompt to the skill README and entrypoint READMEs for permanent subfolders.
- Hardened scaffold writes with symlink-ancestor preflight and exclusive/no-follow file creation when supported; added a regression test for a linked `docs/` directory.
- Kept completion claims separate from reference links and actual client-level usage evidence.
