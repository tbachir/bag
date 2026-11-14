# Offline script tests

[Python unit tests](test_scripts.py) validate no-overwrite scaffolding, TODO proof discipline, structural checks and symlink boundary protection. Run from the skill folder:

```sh
python -m unittest discover -s tests -v
```

Do not equate these tests with end-to-end behavior in Codex, Claude Code, ChatGPT or Antigravity.
