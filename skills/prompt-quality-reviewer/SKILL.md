---
name: prompt-quality-reviewer
description: Evaluate and iteratively improve prompts using official prompting guidance, reproducible eval cases and explicit success criteria.
license: MIT
metadata:
  language: en
  bag-freshness-policy: fast-changing
  bag-review-interval-days: "30"
  bag-last-verified: "2026-11-01"
  bag-update-skill: skill-maintainer
---

# Prompt Quality Reviewer

## Activate
When writing, reviewing, composing or revising prompts for coding agents, assistants or structured-output systems.

## Freshness gate — before applying this skill
Read [BAG's freshness policy](../../maps-and-guides/skill-freshness-policy.md). If `metadata.bag-last-verified` is missing, invalid, or more than 30 days old (UTC), **invoke the skill-maintainer workflow first**, using its `SKILL.md`. If it cannot verify sources or save an approved update, disclose the stale state, use only validated non-version-sensitive advice and ask for authorization before applying risky changes. Never pretend that a reference link or GitHub commit establishes verification.

## Procedure
1. Identify intended model/provider, task, authorized tools, context, user audience, output contract and safety constraints; distinguish system/developer/user responsibility.
2. Obtain current official guidance for the specific provider/model and read the evaluation docs; approaches are not universal across models.
3. State objective success criteria and build a small representative evaluation suite: normal, ambiguous, adversarial/untrusted-input, missing-context, long-context and failure scenarios.
4. Review clarity, minimal sufficient context, unambiguous actions, bounded scope, required format, evidence requests, safe tool permissions, non-hallucination and graceful uncertainty. Avoid unsupported claims such as universal "magic words" or always requiring chain-of-thought.
5. Revise prompts, compare baseline vs candidate under equivalent conditions, grade task success, correctness, safety and consistency; record regressions and costs where measurable.
6. Ensure external documents cannot override instructions, and destructive changes require user permission. Report outcomes rather than claiming "optimized" without tests.
7. Capture target model/version/date, links to sources, test dataset, evaluator and results; apply the freshness gate before use when >30 days.

## Evidence-driven evaluation refinements (2026-11-01)

- Treat prompting as **one possible intervention**: a model, tool, retrieval or architecture change may solve the failure more effectively. [Claude's current guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) explicitly calls for success criteria and empirical tests before prompt tuning.
- Freeze model ID/version, parameters, tool permissions, dataset split and scoring rubric when comparing baseline and candidate. Include representative, adversarial and multilingual cases; protect held-out cases from iterative prompt overfitting.
- [OpenAI's evaluation guidance](https://platform.openai.com/docs/guides/evaluation-best-practices) recommends task-specific evals and human calibration; compare task success, regressions, latency and cost where measurable. An LLM judge needs a rubric and agreement checks against human labels.
- [Google's prompt guidance](https://ai.google.dev/gemini-api/docs/prompting-strategies) emphasizes iterative, observed results. Do not transfer provider-specific syntax or heuristics to another model without testing.

## Definition of done
Revised prompt, rationale, scored evaluation matrix, failure examples, residual risk and primary-source references.

## Authoritative references to recheck
- https://platform.openai.com/docs/guides/prompt-engineering
- https://platform.openai.com/docs/guides/evaluation-best-practices
- https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
- https://ai.google.dev/gemini-api/docs/prompting-strategies

## Change history
See [CHANGELOG.md](CHANGELOG.md). A change in documentation is not a verified refresh unless its sources and outcome are logged.
