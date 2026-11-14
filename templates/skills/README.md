# Agent Skill Factory — BAG canonical skill template

This directory is the **single source of truth for creating, documenting, evaluating and installing a portable Agent Skill** in BAG or a separate project. It replaces the former minimal `SKILL.md` scaffold. The template is usable with **Codex, Claude Code, Antigravity** and clients supporting the [Agent Skills standard](https://agentskills.io/specification). **ChatGPT** uses its Skills UI or a private skills-only plugin, when available; local installation alone does not grant ChatGPT access.

## Choose the shortest path

| Need | Start here |
| --- | --- |
| Create a new skill with consistent documentation | [Generate](#generate-a-skill-with-no-overwrite) |
| Install a skill into Codex, Claude Code, Antigravity or ChatGPT | [INSTALL.md](INSTALL.md) |
| Ask an AI agent to install/verify it for you | [PROMPTS.md](PROMPTS.md#installation-prompts) |
| Run an existing skill on a real project | [PROMPTS.md](PROMPTS.md#invocation-prompts) |
| Make the skill good, small, testable and safe | [QUALITY.md](QUALITY.md) |
| Start from canonical text without scripts | [Starter files](starter/SKILL.md) |
| Reuse a real end-to-end planning skill | [audit-to-execution](../../skills/audit-to-execution/README.md) |

## Generate a skill with no overwrite

From a clone of BAG (Node.js 22+; no npm dependency):

```sh
# Preview the exact files (default: does not write)
node templates/skills/scripts/create-skill.mjs --name my-workflow --description "Use when ..." --target skills

# Create in BAG after inspecting the preview
node templates/skills/scripts/create-skill.mjs --name my-workflow --description "Use when ..." --target skills --write

# Or create in another repository
node templates/skills/scripts/create-skill.mjs --name my-workflow --description "Use when ..." --target ../my-app/.agents/skills --write

# Check structure and example prompts
node templates/skills/scripts/validate-skill.mjs skills/my-workflow
```

The generator **refuses existing destinations and symlinked target paths**; `--write` creates files only, never installs packages, calls a remote server or publishes changes. Do not use `--write` against a destination you have not reviewed. You can also copy `starter/` manually, rename the folder and replace all `__PLACEHOLDER__` markers.

### Generated skill bundle

```text
my-workflow/
  SKILL.md                      # Short instructions and trigger
  README.md                     # Human overview and delegation prompt
  CHANGELOG.md                  # Version and evidence trail
  references/usage.md           # Optional in-depth methodology
  references/install.md         # Link to canonical installation guide
  prompts.md                    # Copy-ready scoped prompts
  evals/evals.json              # Test cases and success signals
```

Keep `SKILL.md` concise. Additional scripts/assets can be added when justified, never as filler. A skill should do **one identifiable job**, with explicit output and verification. Complex broad workflows belong in a carefully scoped orchestrator, not in every skill.

## How to use it in BAG

1. Search for an existing item or equivalent skill first. Prefer improvement over duplication.
2. Review upstream docs and choose a narrow trigger; inspect generated text and the project policies.
3. Add tests/examples and real evidence (not only intentions); populate the skill's `README.md` with a **self-contained** delegation prompt linking to its canonical BAG directory.
4. Add `bag.item.json` **only where the catalogue benefits**; it is optional. Link the skill from `skills/README.md` and related resources.
5. Run `node templates/skills/scripts/validate-skill.mjs skills/<name>`, `node spellbook/scripts/validate.mjs`, `node packages/cli/bin/bag.mjs validate`, `node --test tests/*.test.mjs` and relevant docs checks when available.
6. Create a PR and accurately report commands run, statuses and limitations. A newly written skill is **not** automatically installed in ChatGPT or on someone else's machine.

## Installation philosophy

- Prefer per-project installation when multiple people need **reproducibility**; use user/global installation for your personal workflows.
- Use [Skills CLI](https://skills.sh/docs/cli) for discovery, installation and updates **after reviewing source code**; use manual copying where better supported.
- In ChatGPT, check eligibility and workspace/plugin permissions; a skill embedded in a private plugin must still be **installed or selected** by the user. See [INSTALL.md](INSTALL.md).
- Store **no tokens**, local absolute paths, private content or production credentials in skills, examples or logs.

## Source documents and status

Official references: [Agent Skills spec](https://agentskills.io/specification), [Skills CLI](https://skills.sh/docs/cli), [Claude Code](https://code.claude.com/docs/en/skills), [Codex](https://developers.openai.com/codex/skills), [Antigravity](https://antigravity.google/docs/skills), [ChatGPT Skills](https://help.openai.com/en/articles/20001066-skills-in-chatgpt). Paths and UIs were checked on **2026-11-14** and should be reverified when installing. The upstream skill and its scripts remain untrusted until reviewed.
