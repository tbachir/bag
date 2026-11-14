# Bounded run-all pilot, fast preflight, and backlog metadata (v2.1)

## What this improves

A real November 2026 pilot on `tbachir/mobile-app-website-template` delivered four narrowly scoped test additions on a separate draft PR. It needed **three CI runs**: one typecheck failure, one formatting failure, and one green full pipeline (unit, build, Playwright, Lighthouse). That observation motivated a **fast check before full CI**. It was **not** an A/B comparison, a token measurement, or proof that the agent executed parallel workers; the prior scheduler only forecast waves.

This version keeps the difference explicit: the planner **does not write application code**, and pilot stop conditions guide the coding agent. A closed pilot intentionally dispatches no more work, but the summary **still reports the global number of unchecked TODO tasks** (`open`); `pilotOpen` counts unfinished selected IDs and `scheduledOpen` counts permitted dispatch candidates. A checkpoint is not an OS-level permission boundary. Use branch/worktree isolation, the target repository's AGENTS rules, and ordinary authorization checks.

## Mode `run-all --pilot`: hard scope and automatic stopping

1. Choose **2–5 atomic unchecked TODO IDs**, a concrete acceptance test for each, an execution budget (time/tokens if instrumented), and explicit exclusions. A pilot is not permission to do the remainder of the project.
2. For each selected ID, include every **open** dependency within the cap, or choose a smaller independent slice. Checked prerequisites may remain outside the cap.
3. Inspect the dry-run pilot definition **first**. The `--write` flag makes an atomic checkpoint at `docs/EXECUTION-STATE.json`; it never writes code or checks a TODO.
4. Execute only selected tasks, one wave at a time, with scoped agents/worktrees when available. The coordinator calls `record` only for selected IDs. Test and check off completed tasks with evidence under the target repository's governance.
5. Re-run `plan` / `pilot status`: stop immediately when `pilot.stopNow` is true, or when time/tokens/attempts or safety/permission bounds are reached. Do **not** select more IDs because the rest of TODO remains open.
6. Close the pilot explicitly (no new implementation tasks), report all partial results, and keep the PR draft/unmerged unless the user separately authorized publishing.

Run from the **skill directory**; `/project` is the **target repository path**:

```sh
# No write. Start from explicit task IDs and inspect dependency enforcement.
python scripts/execution.py --root /project pilot start \
  --task PRJ-001.1 --task PRJ-001.2 --max-tasks 2 --json
# After reviewing the selection and scope, persist the checkpoint:
python scripts/execution.py --root /project pilot start \
  --task PRJ-001.1 --task PRJ-001.2 --max-tasks 2 --write --json
python scripts/execution.py --root /project plan --max-parallel 2 --json
# After actually verifying one task, update the TODO with a proof, then re-run:
python scripts/execution.py --root /project pilot status --json
# Only when ending; dry-run without --write, explicit closure with it.
python scripts/execution.py --root /project pilot stop --write --json
```

**Hard protections:** `plan` stays inside selected IDs while a pilot is active and has zero waves when closed. `record` refuses IDs outside the scope. A pilot cannot begin while unrelated recorded workers are in progress. It rejects unselected open prerequisites, duplicates, completed tasks and over-cap selections. It never modifies `TODO.md` or approves legal/security/release checks. If the selected work is blocked by an unavailable environment, stop at the bounded pilot tail, accurately reporting the blocker. To start a different pilot, explicitly close and start a new one. An old `in_progress` checkpoint on a task checked complete in TODO does not block a later pilot; **the verified TODO is authoritative**.

**What it cannot prevent:** manually editing files outside the scope, using another program instead of this CLI, malicious users editing checkpoints, or inaccurate human proof. Scope is enforceable within this helper, not a sandbox security boundary.

## Fast preflight: fail early and conserve CI cycles

Run **typecheck → lint → format:check → unit tests** (only scripts actually present) **before** full build, browser installation, E2E, Lighthouse or review. This is a preflight, **not** a replacement for those validations:

```sh
python scripts/preflight.py --root /project --json              # preview only
python scripts/preflight.py --root /project --run --max-seconds 180 --json
# For a narrower first iteration:
python scripts/preflight.py --root /project --checks typecheck,lint --run --json
```

Supported JS package managers: `pnpm`, `npm`, `yarn`, `bun`. `packageManager` is auto-detected; `--manager` can override when necessary. The script **never runs arbitrary commands supplied by the prompt**, doesn't invoke a command shell explicitly, doesn't install dependencies, and is read-only with respect to the repository (though the target project's own scripts can modify outputs). Bun uses `bun run test`, not its built-in `bun test`. Process-group cleanup kills descendant workers on a timeout (POSIX process group or Windows taskkill fallback), preventing watchers running after the budget ends. Allowed check names are fixed; a missing script is listed under `skippedAbsent`, **not** counted as full PASS. Run only after inspecting the repository's own scripts and trust boundary. For non-JS projects, apply the same cheap-first principle using their own build system, without pretending this helper supports it.

Stop at first failure, make a targeted correction, rerun fast checks, then run the **complete target-project QA gate once per coherent candidate**. On a timeout/missing runner, record an environment/tooling limitation rather than treating it as success. Keep logs compact and scrub sensitive values before copying outputs to prompts, STATUS or PR descriptions.

## Task metadata without rewriting TODO.md

The file `docs/EXECUTION-METADATA.json` is **optional**. It enriches stable TODO task IDs without changing checkboxes or proofs. Generate a read-only skeleton:

```sh
python scripts/execution.py --root /project metadata --json
```

Save/review a deliberately curated mapping (the skeleton leaves each task empty because files/dependencies must **not be guessed**):

```json
{
  "schemaVersion": 1,
  "tasks": {
    "PRJ-001.1": {
      "dependsOn": [],
      "files": ["src/components/**", "tests/components/**"],
      "environment": [],
      "priority": "P1",
      "effort": 2,
      "impact": 4,
      "critical": false,
      "parallelSafe": true
    },
    "PRJ-001.2": {
      "dependsOn": ["PRJ-001.1"],
      "files": ["src/app/**"],
      "environment": ["browser"],
      "parallelSafe": false
    }
  }
}
```

**Validation:** unknown IDs/fields, duplicate or malformed lists, unsafe absolute paths, unsupported priorities, cycles, missing prerequisites, and divergent values already defined inline in TODO all fail closed. No absent field is inferred as safe/parallelizable. File scopes describe proposed ownership but **do not prevent an agent or script from writing there**. A separate reviewer must check implicit coupling before parallel delegation.

Prefer targeting only **the next bounded slice**, not inventing dependencies/effort/permissions for all future work. The canonical checkbox and completion evidence remain in `TODO.md`; checkpoint state is transient and may be ignored in Git when appropriate. A complete run-all still uses the same scheduler without a pilot unless the user explicitly limits scope.

## Measurement protocol

- Record exact scope, baseline SHA, end SHA/PR, task-level acceptance and deferred status, local preflight outcomes, CI runs, retries and review notes.
- Use timestamps when actually measured; distinguish wall-clock engagement from CI duration and from planned waves.
- If instrumentation exposes tokens, report them with the same definition and model configuration in baseline and variant. Otherwise mark token cost **unavailable**, never an invented optimization.
- Use a matched task set and a repeated baseline to claim comparative improvement; single-run results are a **functionality evaluation**, not an A/B speedup.
