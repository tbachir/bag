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

## Continuous execution helper (V2)

- [`execution.py`](execution.py): read-only wave forecast from TODO, explicit transient checkpoint, no code execution or PR side effects.
- Preview: `python scripts/execution.py --root /path/to/project plan --max-parallel 3 --json`.
- Simulate missing environment: `python scripts/execution.py --root /path/to/project plan --unavailable macos --unavailable ios-device --json`.
- Save blocker: `python scripts/execution.py --root /path/to/project record --task PRJ-001.2 --status deferred --category environment --reason "No signed device"`.
- Revisit deferred work at the end: `python scripts/execution.py --root /path/to/project plan --retry-deferred --json`.

The coordinator executes, tests and records proof in TODO/STATUS. This helper never auto-completes tasks or runs code. Use one checkpoint writer at a time.
