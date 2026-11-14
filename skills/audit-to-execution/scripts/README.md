# Offline helper scripts

Run from the skill directory with **Python 3**, no third-party dependencies. Review before running; they only create/check local project-planning files.

```sh
python scripts/validate_skill.py
python scripts/scaffold.py --help
python scripts/scaffold.py --root /path/to/repo --project "My Product" --prefix PRJ
# Dry-run first. After inspecting file paths:
python scripts/scaffold.py --root /path/to/repo --project "My Product" --prefix PRJ --write
python scripts/validate_project.py --root /path/to/repo --prefix PRJ
```

- [scaffold.py](scaffold.py): dry-run default, creates only absent files and rejects symlinked destination ancestors.
- [validate_project.py](validate_project.py): TODO/ROADMAP IDs, unchecked/checked evidence and skills coverage. This is structural validation, not proof of success.
- [validate_skill.py](validate_skill.py): local SKILL.md bundle integrity check.

Never write into an untrusted workspace containing attacker-controlled symlinks; project filesystem permissions and sandboxing remain necessary against concurrent replacement attacks.

## Continuous execution helper (V2.1)

- [`execution.py`](execution.py): read-only wave forecast from TODO, explicit transient checkpoint, no code execution or PR side effects.
- Preview: `python scripts/execution.py --root /path/to/project plan --max-parallel 3 --json`.
- Simulate missing environment: `python scripts/execution.py --root /path/to/project plan --unavailable macos --unavailable ios-device --json`.
- Save blocker: `python scripts/execution.py --root /path/to/project record --task PRJ-001.2 --status deferred --category environment --reason "No signed device"`.
- Revisit deferred work at the end: `python scripts/execution.py --root /path/to/project plan --retry-deferred --json`.

The coordinator executes, tests and records proof in TODO/STATUS. This helper never auto-completes tasks or runs code. Use one checkpoint writer at a time.

## Bounded pilots, metadata and fast preflight

- [`pilot_runtime.py`](pilot_runtime.py): strict optional `docs/EXECUTION-METADATA.json` schema, sidecar/inline conflict detection and pilot cap validation (imported by the scheduler).
- `python scripts/execution.py --root /project metadata --json`: read-only empty metadata skeleton. Curate dependencies and file ownership; never infer them blindly.
- `python scripts/execution.py --root /project pilot start --task PRJ-001.1 --max-tasks 1 --json`: dry-run and check open prerequisites. Add `--write` for an explicit scope checkpoint.
- `python scripts/execution.py --root /project pilot status --json` then `pilot stop --write`: inspect stop condition and close. The record helper rejects out-of-scope IDs.
- [`preflight.py`](preflight.py): `python scripts/preflight.py --root /project --run --json` runs **only** allowlisted `typecheck`, `lint`, `format:check`, `test` package scripts in order; the default without `--run` is dry-run. No shell or dependency installation.

See [full pilot and preflight guide](../references/pilot-and-preflight.md). Pilot scope is a **coordinator checkpoint** and cannot enforce file-system or cloud resource permissions; use an isolated branch/worktree and target repo rules. Missing package scripts or real-environment checks never equal validated success.
