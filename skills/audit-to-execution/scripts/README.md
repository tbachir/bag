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
