---
name: reusable-component-extractor
description: Extract portable configurations, functions, components, skills and workflows from real projects into curated BAG items.
license: MIT
metadata:
  language: en
  freshness:
    policy: fast-changing
    review_interval_days: 30
    last_verified: "2026-10-29"
    update_skill: skill-maintainer
---

# Reusable Component Extractor

## Activate
When a repository audit has identified a specific candidate for reusable extraction.

## Freshness gate — before applying this skill
Read [BAG's freshness policy](../../../maps-and-guides/skill-freshness-policy.md). If `metadata.freshness.last_verified` is missing, invalid, or more than 30 days old (UTC), **invoke the skill-maintainer workflow first**, using its `SKILL.md`. If it cannot verify sources or save an approved update, disclose the stale state, use only validated non-version-sensitive advice and ask for authorization before applying risky changes. Never pretend that a reference link or GitHub commit establishes verification.

## Procedure
1. Confirm a documented candidate and legitimate reuse permission; record source repository, commit, path, license and copyright notices.
2. Trace imports, runtime assumptions, env vars, hidden dependencies, OS restrictions, side effects and framework/version coupling.
3. Choose reference-only, adapted template or independently maintained extraction; default to link if portability or rights are uncertain.
4. Remove project-specific branding, identifiers, secrets and hard-coded infrastructure assumptions. Preserve required attribution and upstream URL.
5. Package one canonical item in the correct BAG zone, with README/SKILL.md as appropriate, examples using placeholders, integration prompt, requirements, tradeoffs and version notes.
6. Verify positive and negative cases: clean install where permitted, lint/typecheck/tests, Windows compatibility when applicable, safe dry-run, no overwrite and no network side effect where advertised.
7. Add index links and catalog manifests only when compatible with BAG schemas; compare existing BAG assets and avoid duplicate source ownership.

## Definition of done
A minimal reusable asset or reference card, provenance and license evidence, smoke-test results and documented integration limitations.

## Authoritative references to recheck
- https://reuse.software/spec-3.3/
- https://choosealicense.com/
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository

## Change history
See [CHANGELOG.md](CHANGELOG.md). A change in documentation is not a verified refresh unless its sources and outcome are logged.
