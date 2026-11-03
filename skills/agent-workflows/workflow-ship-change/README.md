# workflow-ship-change

- **Category:** Skill Tree / external skill reference
- **Status:** evaluating (not installed or executed)
- **Upstream skill:** https://github.com/MengTo/Skills/blob/main/agent-skills/workflow/workflow-ship-change/SKILL.md
- **Upstream collection:** https://github.com/MengTo/Skills/tree/main/agent-skills/workflow
- **License:** MIT ([upstream license](https://github.com/MengTo/Skills/blob/main/LICENSE))
- **Last reviewed:** 2026-10-30
- **Compatibility:** Git, CI pipelines, shell scripts; hosting/changelog specifics require target adaptation

## Purpose

Enforce strict, multi-step shipping discipline: visual verification, changelog synchronisation, automated test validation, single cohesive commits, fast-forward push to `main`, draft-then-live validation, and hard stop guardrails for large uploads (> 50 MB).

## Use and acceptance

Review the [canonical SKILL.md](https://github.com/MengTo/Skills/blob/main/agent-skills/workflow/workflow-ship-change/SKILL.md). Definition of done includes:
- **Visual proof:** Real captures of start, key moment, and result included inline.
- **Changelog version:** Player-facing or user-facing release notes with associated imagery.
- **Verified testing:** Targeted tests, merged incoming tests, and complete test suites executed and documented.
- **Clean commit & fast-forward push:** Stage explicit files only (no blanket `git add -A`), rebase on `origin/main`, and confirm push as fast-forward.
- **Draft-then-live deployment:** Validate on preview/draft URLs first (catching missing assets or 404s) before promoting to production.
- **Mandatory 50 MB guardrail:** Measure commit, push pack, and upload sizes; stop and ask the user before any upload exceeding 50 MB.

## Trade-offs and safety

Never force-push, rewrite remote history, deploy uncommitted files, or bypass failed checks. Upstream bash scripts (`commit-size.sh`, `push-main.sh`, `upload-size.sh`, `verify-live.sh`) provide reference logic that must be adapted to target platform CI/CD.

## Reusable integration prompt

> Inspect our repository's git workflow, CI/CD pipeline, changelog conventions, and deployment targets. Read BAG's root-to-item instructions and [this reference](https://github.com/tbachir/bag/blob/main/skill-tree/skills/agent-workflows/workflow-ship-change/README.md), then examine the upstream SKILL.md. Plan an end-to-end shipping sequence with visual captures, changelog entry, test passes, fast-forward verification, and size measurement. Stop and ask before any upload exceeding 50 MB or when permission boundaries are reached.

[Back to Agent Workflows collection](../README.md).
