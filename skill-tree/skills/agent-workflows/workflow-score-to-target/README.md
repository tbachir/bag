# workflow-score-to-target

- **Category:** Skill Tree / external skill reference
- **Status:** evaluating (not installed or executed)
- **Upstream skill:** https://github.com/MengTo/Skills/blob/main/agent-skills/workflow/workflow-score-to-target/SKILL.md
- **Upstream collection:** https://github.com/MengTo/Skills/tree/main/agent-skills/workflow
- **License:** MIT ([upstream license](https://github.com/MengTo/Skills/blob/main/LICENSE))
- **Last reviewed:** 2026-10-30
- **Compatibility:** Agent-agnostic procedure; relies on rubrics, scorecards, and multi-round verification

## Purpose

Score deliverables out of 10 against an explicit, anchored rubric and iteratively refine each item round-by-round until every target reaches the specified quality bar (e.g., 8/10).

## Use and acceptance

Review the [canonical SKILL.md](https://github.com/MengTo/Skills/blob/main/agent-skills/workflow/workflow-score-to-target/SKILL.md). Key methodology:
- **Restate the bar:** Pin down target score, scope (per-item vs average), and external benchmarks.
- **Anchor the rubric:** Establish a 0–10 scale where 10 is best-in-class, 8 is polished/intentional, and 6 is acceptable. Break items into 3–5 criteria (0–2 points each).
- **Measure rather than guess:** Replace subjective impressions with concrete metrics (frame rates, file sizes, test coverage, animation clipping) where possible.
- **Independent/blind judging:** Use an unprimed subagent or blind scoring without prior bias when evaluating candidate rounds.
- **Prevent score drift:** Document before/after scorecards and lock achieved standards with automated regression tests.

## Trade-offs and safety

Avoid premature rounding up or scoring code/memory directly without evaluating rendered or running output. Iteration must respect performance budgets and test integrity without regressing other items.

## Reusable integration prompt

> Inspect my project's quality standards, benchmarks and evaluation criteria. Read BAG's root-to-item instructions and [this reference](https://github.com/tbachir/bag/blob/main/skill-tree/skills/agent-workflows/workflow-score-to-target/README.md), then inspect the upstream SKILL.md. Establish an anchored 0–10 rubric with measurable criteria, evaluate the baseline with evidence, run structured refinement rounds, and present a before/after scorecard with known caveats.

[Back to Agent Workflows collection](../README.md).
