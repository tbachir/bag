# Changelog — audit-to-execution

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
