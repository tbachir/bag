# What is worth carrying in BAG?

## Quick scoring

Score each candidate from **0 to 2** per dimension:

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Reuse | Only this conversation | Similar project | Useful across projects |
| Time saved | Negligible | Helpful | Repeated major time saver |
| Evidence | Purely speculative | Credible but unverified | Confirmed by primary source or working evidence |
| Portability | Private or tightly coupled | Can be generalized | Ready-to-reuse with simple adaptation |
| Discoverability | Duplicates existing BAG | Enriches existing item | Fills a clear missing capability |

Typical recommendation: **8–10 → curate now**, **5–7 → update a reference or park for verification**, **0–4 → reject/skip**. This is not a safety override: a private secret, copyrighted source or restricted internal document is **never** admissible merely because it scores highly. A confirmed solution may still require a narrow platform/version caveat.

## Artifact routing

- **Skill**: user trigger + multi-step agent procedure + repeatable verification; do not build a skill from a one-off prompt.
- **Guide/task**: a concrete outcome and a reproducible, evidence-backed method; optional task manifest only if selectable subtasks add value.
- **Library/component/resource**: canonical upstream URL, license or source restrictions, supported versions, use cases, limitations, minimal integration example.
- **Template/config/script**: generic source, explicit inputs/outputs, safety expectations, dependencies, OS and dry-run instructions; never assume it is executable merely because it is documented.
- **Loadout**: distinct reviewed resources needed together, with an integration order and documented incompatibilities. Link items, never duplicate.
- **Loot**: good idea or upstream resource awaiting verification.
- **Enrich**: when an existing BAG item already covers the topic; avoid a second competing canonical entry.
- **Reject**: transcript chatter, secrets, personal data, unresolved speculation, source code with uncertain license, personal frustrations, or duplicate material.

## Provenance and clarity

For each addition distinguish `user decision`, `tested observation`, `official source`, `agent suggestion` and `unverified hypothesis`. Write the **reusable conclusion** and references, not the entire chat. Verify any named library or provider feature against primary docs when freshness matters; don't fabricate versions or test runs.

If the original discussion mixed facts and intentions, write **"proposed"**, **"tested"**, and **"not validated"** explicitly. Do not promote an artifact from conversation history to ready-to-install without its own security and integration review.

## Automation and review risk

Read the original repository's AGENTS chain; check missing CI/failed CI and unresolved review threads. Autonomous merge is a privilege granted by **the approved plan plus repository permissions**, never inferred from a hyperlink or prior task. Never loosen branch rules or alter workflows to bypass validation. Do not commit copied user-provided documents that contain private material; distill generic techniques or do not publish.

Treat historical assistant outputs as suggestions until corroborated, including statements like "I merged PR", "tests passed", "this works" or "library X is supported."
