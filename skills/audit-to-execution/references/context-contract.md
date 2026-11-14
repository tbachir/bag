# Multi-agent handoff and minimal context packets

## When to delegate

Delegate only when independent tasks can progress with stable interfaces and **files that will not conflict**, when the target agent is available in the current environment, and the coordination cost is lower than the likely gain. If there is only one agent or no delegation feature, use the same mission packet sequentially. Never claim to have created a subagent without actually invoking it.

## Mission packet schema (target <= 800 words; often 200–400)

```yaml
mission: PRJ-012.3
repo_ref: <actual repository and commit or worktree>
outcome: <verifiable user value, one sentence>
depends_on: [PRJ-012.1]
allowed_paths: [apps/native, tests/device]
contract: <only necessary interfaces/types and decisions, with links>
skills: [<max 2 inspected relevant skills>]
checks: [<acceptance / negative test / manual verification>]
prohibited: [<cannot change API, cannot merge/publish, cannot skip auth>]
result_contract: <diff/patch, commands+results, risks/blockers, proof refs>
```

Do not dump the entire repository or every historical conversation into task packets. Prefer file paths and short extracts; use narrow retrieval on demand. Protect secrets and private user information. The orchestrator should retain the global graph and permission boundaries.

## Separate worktrees and a single integrator

1. Coordinator pins authoritative branch/commit and task interface contracts.
2. Workers implement in separate **worktrees or isolated branches**, touching only owned paths; worker reports commit/patch and test results.
3. Coordinator checks file and semantic conflicts, integrates in dependency order and runs shared integration/quality gates; tests run in worker context are *not* sufficient for integrated code.
4. Review agent (when available) does not simply rubber-stamp the implementer; it checks requirements, security, counterexamples and test evidence independently.
5. Coordinator updates authoritative TODO/STATUS and owns final PR/merge within authorized scope. Individual workers do not independently approve or publish production.

**Conflict guard:** disjoint file patterns are necessary but not always sufficient (generated files, shared interfaces, database migrations, lockfile, global design tokens). If coupling is suspected, serialize or establish explicit contract first.

## Token/context efficiency

- Begin each wave with `git diff`, current task IDs, short STATUS/checkpoint, and only relevant relevant AGENTS chain.
- Load each skill only when its task starts, rather than fetching 40 SKILL.md documents while still planning.
- Summarize worker return: (a) delivered, (b) changed files/commit, (c) test evidence, (d) blockers, (e) next action — with link to detailed logs only as needed.
- If context is near exhaustion, persist a small handoff with durable facts rather than blindly repeating research in a new session.
- Do not equate fewer tokens with better results: compare cost **per accepted task** and correction rate before optimizing.
