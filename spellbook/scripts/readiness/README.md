# Portable task readiness checker

A small dependency-free Node.js tool derived **conceptually** from the idea of structured readiness checks in [SpecOS](https://github.com/tbachir/specos/blob/main/rules/readiness.yaml). This is an independently written minimal implementation; it does not copy its YAML rules or imply full SpecOS compliance.

## Use

Requires Node.js 20+ and JSON tasks with IDs, owners, nonempty acceptance criteria and optional `dependsOn` task IDs.

```sh
node spellbook/scripts/readiness/check-readiness.mjs spellbook/scripts/readiness/example.json
node --test spellbook/scripts/readiness/check-readiness.test.mjs
```

Returns JSON containing `valid` and `issues`, with exit code 0 for valid, 1 for findings and 2 for invalid JSON/IO/usage. Read-only: no dependencies, network, writes or external commands. A tool result is not a substitute for human approval.

## Scope and limitations

Checks duplicate/missing IDs, missing owner, missing acceptance, dependency representation, self/unknown references and dependency cycles. Does **not** inspect source code, authenticate claims, assess requirement semantics, validate whole SpecOS schema, or make deployment decisions. This is a lightweight example suitable for adapting to target-project contracts, not a universal enterprise gate.

## Provenance and freshness

- Source concept: [SpecOS readiness rules](https://github.com/tbachir/specos/blob/main/rules/readiness.yaml)
- Extraction date: 2026-10-29
- Rewritten independently for BAG; no copied source code.
- Validate requirements with your actual team and project context.

## Delegate

```text
Evaluate whether BAG's portable task readiness checker is appropriate for my project.
BAG item: https://github.com/tbachir/bag/tree/main/spellbook/scripts/readiness
Read root and nested AGENTS.md, inspect current project schemas and existing validators, and propose a safe integration with tests. Do not copy or install without explicit authorization.
```
