# Offline script tests

[Python scaffold tests](test_scripts.py) validate no-overwrite scaffolding, TODO proof discipline, structural checks and symlink boundary protection. [Execution tests](test_execution.py) validate dependency-safe waves, file scope conflicts, retry caps, deferred environments, checkpoint persistence and no false completion. Run from the skill folder:

```sh
python -m unittest discover -s tests -v
```

Do not equate these tests with end-to-end behavior in Codex, Claude Code, ChatGPT or Antigravity.
