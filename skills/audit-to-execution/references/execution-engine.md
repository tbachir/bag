# Execution engine v2 — continuous work, safe waves, deferred blockers

## Activation and autonomy contract

Modes: `execute` (carry out the plan), `run-all` (execute **all feasible work in one uninterrupted engagement**), `resume` (continue from Git and checkpoint), `converge` (identify gaps and repair), `optimize` (improve performance without weakening evidence). `full` still only means **audit + specification + plan** unless the user explicitly asks to **implement/finish**; don't infer production merge/deployment permission from any mode.

**One-tract execution is the default when the user asks to finish, implement fully, work autonomously, or not consult them at every step.** No planned pause between waves, no per-task approval request for ordinary authorized changes. The agent continues in the **current execution environment/session** as long as tools and time permit; it cannot promise unattended background work or a future result when no scheduling facility is available. When interrupted by context/session limits, save a truthful compact checkpoint and a ready-to-paste resume instruction. If the user prefers interactive control, select `execute --one-wave` behavior instead.

## Continuous execution loop

1. **Reconcile current truth:** inspect AGENTS, current ref, clean/dirty worktrees, live PR/CI, `TODO.md`, `ROADMAP.md`, accepted specifications, prior approvals, `docs/STATUS.md`, and `docs/EXECUTION-STATE.json` when present. Refuse fabricated checkmarks. Record current commit.
2. **Validate the plan:** check unique IDs and proof, dependencies/cycles, critical acceptance, risks, authorization, unavailable execution environments, max parallelism and actual tools. No unnecessary re-audit of unchanged areas.
3. **Select the next ready wave:** choose dependency-satisfied tasks with highest critical-path impact and value; prefer a complete vertical slice. Start parallel assignments **only** with stable contracts, explicit nonoverlapping file ownership and enough agent/tool capacity. A serial wave is preferable if context/coordination costs outweigh gains.
4. **Dispatch tight task packets:** objective, project/ref, task ID, allowed files, relevant interfaces and decisions, 1–2 skills, acceptance, negative tests, tool/permission boundaries and required response (patch/diff, test evidence, limitations). Give each worker no global history unless indispensable.
5. **Implement and verify:** agent edits code/docs or executes operational steps within granted scope; changes are integrated into a single authoritative branch/PR, tested against the **actual changed commit**, and independently reviewed where possible. On failed tests, attempt scoped correction with a bounded retry cap.
6. **Handle blockers without stopping useful work:** classify a blocker (see below), record it with exact missing precondition and attempted steps; replan around it and complete every **safe independent task**. A dependency chain is never skipped to mark downstream work complete.
7. **Checkpoint after each wave and significant interruption:** update TODO only when acceptance and proof are real, append to STATUS and decision log as needed; store transient work state in the machine-readable checkpoint **without marking tasks done**. Avoid duplicate narratives in TODO and checkpoint.
8. **Converge:** compare implementation against requirements and tests; add missing tasks with stable IDs, verify negative cases, repair bounded failures, repeat with the next ready wave. **Do not stop merely because one wave, PR or initial feature passed.**
9. **Final deferred pass:** after all independently executable work is handled, revisit every deferred item and try a documented fallback: different runner, mocked/contract tests where acceptable, accessible browser/device, safe manual checklist, alternate tool or PR for external completion. **Do not represent simulator/contract tests as real-device verification.**
10. **End state:** `CONVERGED` only if all mandatory acceptance, required reviews and authorized delivery gates pass. Otherwise use `PARTIALLY_COMPLETE` with maximal feasible work done and an explicit small **deferred tail** (task, criticality, evidence, remaining action, required environment/access). Stop on actual safety/authorization violations, no independent feasible work, retry budget exhaustion, context limit or an explicit user stop.

## Severity and blocker policy

| Class | Examples | Agent action |
|---|---|---|
| **Stop now / unsafe** | Secret exfiltration, destructive data operation not authorized, violation of explicit repo policy, tampering with tests/approval, production release without approval | Do not perform unsafe action. Isolate it and continue **only other safe work**, report need for authorization |
| **Critical dependency** | Missing database migration required for all data writes; broken baseline that invalidates downstream; unapproved API contract change | Mark as blocked with evidence, do not run dependent tasks; continue unrelated lanes where safe; cannot claim convergence |
| **Noncritical environment** | macOS/iOS real device not available, Android emulator absent, browser binary missing, unreliable external API, GPU unavailable | Defer validation/task, write exact preconditions, run other independent work, revisit at tail |
| **Access/cost outside scope** | OAuth to private account, paid SaaS, ungranted secrets, signing keys, infrastructure provisioning | Never bypass auth or incur costs. Defer, use safe local equivalents only when valid, and report required action at end |
| **Ordinary failed test** | Deterministic unit failure, lint/type error, unstable fixture | Fix within bounded attempts (default 2), rerun; if unresolved classify critical or noncritical by blast radius and continue safe lanes |
| **Unknown** | Ambiguous behavior without evidence | Investigate a small spike; if not resolvable, preserve assumption and defer only if scope/safety permit |

**Noncritical does not mean optional acceptance.** A deferred real-device check still blocks a release if the project requires it; it merely does not block independent coding, docs or simulated tests. A failed security check is never moved to the deferred tail to justify a merge.

## Tool: execution.py (optional, stdlib only)

This is a **read-only wave planner** plus a checkpoint writer, not an automatic coding agent or a CI runner. Run from the skill folder:

```sh
python scripts/execution.py --root /path/to/project plan --max-parallel 3 --json
# Compare scheduling when a platform/environment is missing:
python scripts/execution.py --root /path/to/project plan --unavailable macos --unavailable ios-device --max-parallel 3 --json
# Explicitly defer an unavailable task rather than halting the whole project:
python scripts/execution.py --root /path/to/project record --task PRJ-012.3 --status deferred --category environment --reason "Requires signed iOS device and Xcode"
# Resume: checkpoints + TODO/CI/repo facts are reread at the next turn.
python scripts/execution.py --root /path/to/project plan --json
# Only at the END, re-evaluate deferred tasks after environment changes:
python scripts/execution.py --root /path/to/project plan --retry-deferred --json
```

Input fields are optional except task ID/checkbox. In `TODO.md` use per-task metadata:

```markdown
- [ ] **PRJ-012.3** Verify app deep links on signed iOS device
  - **Depends on:** PRJ-004.1, PRJ-012.1
  - **Priority:** P1
  - **Effort:** 2
  - **Impact:** 4
  - **Critical:** no
  - **Environment:** macos, ios-device
  - **Files:** apps/native/**, tests/device/**
  - **Parallel safe:** no
  - **Skills recommended:** actual reviewed candidates or none needed
  - **Discovery:** `npx skills find "iOS universal links device testing"`
  - **Acceptance:** installation signed, real-device links verified
  - **Proof when done:** pending (remains unchecked)
```

**Important:** file scopes are advisory strings, not a sandbox permission system. Parallelism requires explicit `Parallel safe: yes`, nonempty **disjoint file scopes**, a stable shared interface and a human/agent review of indirect coupling; missing metadata defaults to **serial**. Forecast waves assume success, do not change code and cannot establish completion. `TODO.md` checked+proof is the source of truth for done; `docs/EXECUTION-STATE.json` stores only active/deferred/failed checkpoints, never completion. Only one coordinator should write the checkpoint to avoid lost updates. The generator uses atomic replace and refuses symlinked state destinations; don't store secrets in reason fields.

When metadata is not present, execute a short bounded manual dependency analysis or run serially. A full green test suite is not sufficient if a required manual verification is missing.

## Bounded convergence policy

- No infinite retries: default **2 attempts per failed task**; the recorder refuses further `in_progress` transitions beyond the cap unless a responsible user sets a different explicit cap. Log the exact failure and choose an alternative or defer.
- Avoid thrashing: a second attempt must change a specific hypothesis, tool, implementation or test, not blindly rerun the same command.
- Preserve work already delivered: a blocked task should not cause a reset/re-scaffold of verified work.
- Keep every wave's output small: changed files + accepted results + blockers, not huge tool logs; expand logs only when needed.
- No hidden background execution: continuous mode is instruction to finish **in this run**; external scheduled or Work orchestration is only used when explicitly available and authorized.

## Minimal final report

1. Completed tasks with current commit/CI evidence (and what code or artifact exists).
2. Pending tasks reachable only after critical dependencies.
3. Deferred noncritical tail with missing environment/access and exact next verification action.
4. Tests PASS/FAIL/NOT RUN, outstanding approval/review and whether merge/deploy was authorized and performed.
5. Compact resume command/prompt and current branch/PR/state ref.
