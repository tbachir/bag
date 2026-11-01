# BAG skill freshness audit — 2026-11-01 (UTC)

## Scope and method

Read the `main` branch's root `AGENTS.md`, `maps-and-guides/skill-freshness-policy.md`, skills index, docs app `package.json` and `README.md`, and 16 locally indexed `SKILL.md` packages. Read `CHANGELOG.md` for each where present. This is a targeted audit of indexed local skills, **not proof of exhaustive recursive repository discovery**: the available GitHub connector did not expose a complete recursive tree listing. External linked skills (e.g. MengTo collections) were not audited as locally installed skills.

The original 30-day policy classifies an entry as stale only when it declares a fast-changing policy and its last evidence-based verification is missing/invalid or older than its interval. New upstream breaking/security changes override this age rule.

## Results

- **Overdue (>30 days) among the six originally policy-tracked skills:** **0** on 2026-11-01. All recorded 2026-10-29, age 3 days.
- **Important defect found:** nested `metadata.freshness` objects were not portable under the Agent Skills specification's string-to-string `metadata` contract. Migrate to flat `bag-*` string keys; the checker retains a legacy reader during transition.
- **Important classification gap:** Fumadocs Engineering, UI/UX Design Review and Agent-ready Documentation lacked fast-changing metadata and per-skill changelogs. This change adds both after reviewing their authoritative sources.
- **After proposed edits:** nine tracked fast-changing skills. Six evidence-reviewed on 2026-11-01 (Fumadocs Engineering, Docs Architect, UI/UX Design Review, Agent-ready Documentation, API Documentation Quality, Prompt Quality Reviewer), next review 2026-12-01 UTC. Three metadata-migrated only (Repository Auditor, Reusable Component Extractor, Skill Maintainer), **verification stays 2026-10-29**, next due 2026-11-28 UTC.
- **Seven untracked indexed skills:** `addbag`, `bag-inventory`, `o2switch-cloud`, `bag-author-item`, `bag-author-task`, `bag-author-library`, `bag-author-metadata`. Untracked does not automatically mean stale. Prioritize o2switch and addbag for provider/client-specific review before deciding their freshness policy.
- One stale reference name in `addbag` (`documentation-architect`) corrected to canonical `docs-architect`.
- The Skill Maintainer's own stale gate could imply recursive self-invocation; added an explicit one-pass bootstrap exception without changing its 2026-10-29 verification date.

## Evidence-backed changes to methods

| Area | Primary evidence (opened 2026-11-01) | Concrete correction / remaining work |
| --- | --- | --- |
| Fumadocs | [Changelog](https://www.fumadocs.dev/changelog), [page trees](https://www.fumadocs.dev/docs/page-conventions), [static builds](https://www.fumadocs.dev/docs/deploying/static) | Official changelog lists `fumadocs@16.17.9` on 2026-10-28; BAG package file pins Core 16.17.8, MDX 15.4.10 and Base UI alias 16.17.8. Distinguish `loader()` conventions from BAG's custom Markdown compiler; verify search/static export on any upgrade. No upgrade performed. |
| Prompt evaluation | [OpenAI evals](https://platform.openai.com/docs/guides/evaluation-best-practices), [Claude prompt guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview), [Google prompt strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies) | Prompt-only changes are not always best. Require fixed model/settings, representative held-out evals, human calibration and regression/cost tracking before claiming improvement. No live model eval executed. |
| API documentation | [OpenAPI latest](https://spec.openapis.org/oas/latest.html), [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html), [GitHub REST practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api) | OAS latest is **3.2.1 (2026-09-10)**; do not force upgrades beyond parser/tool support. Schema validation is not runtime conformance. RFC 9457 is conditional on the real API error envelope. |
| Design and accessibility | [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [NN/g heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) | Heuristics are diagnostic, not evidence of user failure. Map WCAG claims to testable criteria and manual/automated evidence; avoid unsupported AA conformance claims. |
| Agent skills | [Agent Skills specification](https://agentskills.io/specification), [GitHub repository instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) | Use flat string-valued `metadata`, explicit skill triggers, client-specific activation, and untrusted-document test cases. Do not assume automatic activation across Codex/Claude/Copilot. |
| Documentation architecture | [Diátaxis](https://diataxis.fr/), [Fumadocs page tree](https://www.fumadocs.dev/docs/page-conventions) | Four reader needs are not mandatory directories. Test the actual adapter and canonical Markdown before reorganizing navigation. |

## Proposed files and verification

- Updated the nine tracked `SKILL.md` and corresponding `CHANGELOG.md` (new changelogs for four previously untracked).
- Updated root `AGENTS.md`, freshness policy and read-only checker to use flat metadata and support `--all` for `UNTRACKED` visibility.
- Added `tests/skill-freshness.test.mjs` for fresh/stale/untracked cases and flat frontmatter.
- Fixed one skill name in `addbag/SKILL.md`.

**Actually performed:** connector read of main source and authoritative upstream pages, static inspection of proposed GitHub files, and in-memory assertions of nine frontmatter/changelog pairs (9/9 passed). **Not performed:** Node execution from a checked-out BAG tree, `node spellbook/scripts/validate.mjs`, docs build, typecheck, browser tests, live model evals, security advisory sweep or external client skill activation. Do not interpret the in-memory assertions as a passing CI build.

Required checks before merge:

```sh
node spellbook/scripts/check-skill-freshness.mjs --all --json --date 2026-11-01
node spellbook/scripts/check-skill-freshness.mjs --strict --date 2026-11-01
node --test tests/skill-freshness.test.mjs
node spellbook/scripts/validate.mjs
cd apps/docs
pnpm install --frozen-lockfile
pnpm test:unit
pnpm build
pnpm types:check
pnpm test:e2e
```

## Blockers / next review

1. No complete recursive listing was available through the connector; additional local `SKILL.md` outside the indexed set might exist.
2. Runtime checks and CI evidence are still needed; leave PR unmerged until required gates are demonstrated.
3. Provider-specific review of `o2switch-cloud` and agent-client behavior of `addbag` remain unverified. Their lack of a freshness policy should be resolved separately with primary evidence, not by inventing a last-verified date.
4. No exhaustive security advisory audit or downstream compatibility test was performed. Investigate urgent advisories separately if detected.
