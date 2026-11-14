# Changelog — audit-to-execution

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
