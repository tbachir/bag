# Offline script tests

[Python scaffold tests](test_scripts.py) validate no-overwrite scaffolding, TODO proof discipline, structural checks and symlink boundary protection. [Execution tests](test_execution.py) validate dependency-safe waves, conflicts, retry budgets, deferred environments, persistence and no false completion. Run from the skill folder:

```sh
python -m unittest discover -s tests -v
```

Do not equate these tests with end-to-end behavior in Codex, Claude Code, ChatGPT or Antigravity.

- [`test_pilot.py`](test_pilot.py) verifies hard bounded pilot scopes, exact dependency validation, sidecar conflicts, fast preflight fail-early behavior, dry-run and missing-environment handling.
