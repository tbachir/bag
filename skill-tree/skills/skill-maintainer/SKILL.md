---
name: skill-maintainer
description: Review and refresh time-sensitive BAG skills against authoritative sources before dependent workflows use stale guidance.
license: MIT
metadata:
  language: en
  freshness:
    policy: fast-changing
    review_interval_days: 30
    last_verified: "2026-10-29"
    update_skill: skill-maintainer
---

# Skill Maintainer

## Activate
When any skill has freshness.review_interval_days and last_verified is older than interval, or a breaking change/security advisory is suspected.

## Freshness gate — before applying this skill
Read [BAG's freshness policy](../../../maps-and-guides/skill-freshness-policy.md). If `metadata.freshness.last_verified` is missing, invalid, or more than 30 days old (UTC), **invoke the skill-maintainer workflow first**, using its `SKILL.md`. If it cannot verify sources or save an approved update, disclose the stale state, use only validated non-version-sensitive advice and ask for authorization before applying risky changes. Never pretend that a reference link or GitHub commit establishes verification.

## Procedure
1. Read the target SKILL.md, its references and CHANGELOG.md; determine the last *verified* date, not commit date.
2. Check authoritative vendor docs, specifications, release notes and migrations, plus security advisories if applicable. Record direct URLs, versions and retrieval date; compare actual changes with documented assumptions.
3. Challenge the method: test examples/commands where feasible, compatibility, deprecated behavior, security, accessibility and alternative approaches. Do not confuse a new version with a better approach.
4. If changes are justified, update only validated assertions, examples, dependencies, sources and metadata. If no change is required, record a reviewed-no-change entry supported by evidence.
5. Append to CHANGELOG.md: date, previous/new verification date, sources checked, what changed (or no change), validation done/not done, reviewer, and outstanding risks. Update metadata.last_verified only after evidence review; do not use a superficial timestamp bump.
6. Run repo quality gates; propose a PR for review. Never change production systems or downstream projects as a side effect.
7. On unavailable network, insufficient permissions or unreliable sources, mark status STALE / UNVERIFIED and state which checks could not be completed. Do not fabricate completion.

## Definition of done
A change summary or evidence-backed no-change result, updated skill and changelog when permitted, exact commands/tests run, remaining uncertainty and review link if created.

## Authoritative references to recheck
- https://agentskills.io/specification
- https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases

## Change history
See [CHANGELOG.md](CHANGELOG.md). A change in documentation is not a verified refresh unless its sources and outcome are logged.
