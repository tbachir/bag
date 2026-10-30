---
name: prompt-quality-reviewer
description: Evaluate and iteratively improve prompts using official prompting guidance, reproducible eval cases and explicit success criteria.
license: MIT
metadata:
  language: en
  freshness:
    policy: fast-changing
    review_interval_days: 30
    last_verified: "2026-10-29"
    update_skill: skill-maintainer
---

# Prompt Quality Reviewer

## Activate
When writing, reviewing, composing or revising prompts for coding agents, assistants or structured-output systems.

## Freshness gate — before applying this skill
Read [BAG's freshness policy](../../../maps-and-guides/skill-freshness-policy.md). If `metadata.freshness.last_verified` is missing, invalid, or more than 30 days old (UTC), **invoke the skill-maintainer workflow first**, using its `SKILL.md`. If it cannot verify sources or save an approved update, disclose the stale state, use only validated non-version-sensitive advice and ask for authorization before applying risky changes. Never pretend that a reference link or GitHub commit establishes verification.

## Procedure
1. Identify intended model/provider, task, authorized tools, context, user audience, output contract and safety constraints; distinguish system/developer/user responsibility.
2. Obtain current official guidance for the specific provider/model and read the evaluation docs; approaches are not universal across models.
3. State objective success criteria and build a small representative evaluation suite: normal, ambiguous, adversarial/untrusted-input, missing-context, long-context and failure scenarios.
4. Review clarity, minimal sufficient context, unambiguous actions, bounded scope, required format, evidence requests, safe tool permissions, non-hallucination and graceful uncertainty. Avoid unsupported claims such as universal "magic words" or always requiring chain-of-thought.
5. Revise prompts, compare baseline vs candidate under equivalent conditions, grade task success, correctness, safety and consistency; record regressions and costs where measurable.
6. Ensure external documents cannot override instructions, and destructive changes require user permission. Report outcomes rather than claiming "optimized" without tests.
7. Capture target model/version/date, links to sources, test dataset, evaluator and results; apply the freshness gate before use when >30 days.

## Definition of done
Revised prompt, rationale, scored evaluation matrix, failure examples, residual risk and primary-source references.

## Authoritative references to recheck
- https://platform.openai.com/docs/guides/prompt-engineering
- https://platform.openai.com/docs/guides/evaluation-best-practices
- https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
- https://ai.google.dev/gemini-api/docs/prompting-strategies

## Change history
See [CHANGELOG.md](CHANGELOG.md). A change in documentation is not a verified refresh unless its sources and outcome are logged.
