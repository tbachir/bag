# Discover, verify, and map skills per task

This skill deliberately separates **skills discovery** from **installation or execution**.

## Discovery sources in order

1. Installed skills/capabilities in the actual target agent; load only those relevant.
2. Open Agent Skills catalog and the community **find-skills** guide: https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md and https://skills.sh/.
3. Search via `npx skills find "specific task keywords"` (if network/CLI allowed); try synonyms and category terms.
4. Official framework/vendor skill repositories and their primary docs.
5. Internal curated sources (including BAG), organization repositories, team conventions and reusable project work.

BAG is never the only source and may not be accessible. Never assert a skill exists, is installed, or has an install count based on memory alone.

## Review before recommendation

- What does the actual SKILL.md say? Is the task a good match?
- Source repo, maintainer reputation, license and update recency (especially rapidly changing stacks).
- Relevance to current stack and versions, with known conflicts.
- Executable scripts, install-time hooks, remote downloads, access to files/secrets/network, destructive commands and telemetry.
- Install count/stars only when available, verifiable and dated; these are weak quality signals, not security certification.

Score each candidate **suitable / conditional / rejected**, with one-line reason. Use no more than 1–2 candidates per task when possible. Prefer available installed skills, but avoid forcing a skill onto a task where general expertise suffices. Mark explicit `none recommended` when appropriate.

## Proposed TODO syntax

```markdown
- [ ] **ABC-004.2** Check localization routes, reciprocal hreflang and 404s.
  - **Skills recommended:** [SEO](https://skills.sh/addyosmani/web-quality-skills/seo), [i18n](https://skills.sh/sickn33/agentic-awesome-skills/i18n-localization) — candidates, review before use.
  - **Discovery:** `npx skills find "Next.js hreflang i18n e2e"`.
  - **Acceptance:** tests for only enabled locales, correct sitemap and no silent language fallback.
```

Use descriptive search queries specific to the work item, not the same query 40 times. If discovery has no result, retain the query and record `none found as of YYYY-MM-DD` instead of inventing a skill.

## Installation: only after explicit permission where required

A tested install command for the `skills` CLI can be proposed; it is not evidence of an installation:

```sh
npx skills find "react accessibility"
npx skills add owner/repo --skill skill-name
# Optional user-level installation across projects:
npx skills add owner/repo --skill skill-name -g
```

Official CLI guide: https://github.com/vercel-labs/skills/blob/main/docs/commands.md . Use an appropriate local or global scope; on unsupported agents, follow their official skills directory mechanism. Review and authorize third-party scripts before execution. Avoid adding a skill dependency to production runtime.

## Freshness

At task start, refresh tool/skill docs when stack is fast-moving or last inspection exceeds ~30 days; re-check severe security advisories, breaking changes and required credentials. Record provenance and use in the PR. A project may configure its own freshness threshold.

## On-demand discovery during an execution run

At planning time attach credible candidate skills **or a relevant discovery query** to each task, without downloading every candidate's full instructions. At the beginning of a scheduled wave, inspect only skills needed for its tasks; cache source/version/verification dates in the current project. Re-search when missing, stale, security-relevant or poor fit. Spending more time reading 40 SKILL.md files than completing 4 tasks is a failure of the optimization goal, not a requirement of this skill.
