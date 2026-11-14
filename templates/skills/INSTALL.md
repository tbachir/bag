# Installing portable Agent Skills — Codex, Claude Code, Antigravity and ChatGPT

**Last checked:** 2026-11-14. These are installation **routes**, not promises of agent capabilities, credentials, plans, versions or successful installation. The entire skill directory must be installed, not just `SKILL.md` if it references other files. Read the skill and bundled scripts before installing.

## Pick scope and source

1. **Project:** shared with the repo (good for teams), install into a project directory.
2. **Global:** usable in multiple local repos (personal use), install into your user home, when supported.
3. **ChatGPT:** separate account/workspace installation mechanism; local file installation does *not* sync to ChatGPT.
4. Source: clone/download a reviewed repo, then install its exact skill; pin a commit/tag when reproducibility/security requires it. An `npx skills` invocation can fetch third-party code: it is not a security review.

### Skills CLI — simple cross-agent path

```sh
# Discover a relevant skill
npx skills find "repository audit and planning"

# Install BAG skill into a project; inspect the interactive choices
npx skills add https://github.com/tbachir/bag --skill audit-to-execution

# Target an agent, in the project directory
npx skills add https://github.com/tbachir/bag --skill audit-to-execution -a codex
npx skills add https://github.com/tbachir/bag --skill audit-to-execution -a claude-code
npx skills add https://github.com/tbachir/bag --skill audit-to-execution -a antigravity

# Make a compatible skill global for a selected local agent (review before applying)
npx skills add https://github.com/tbachir/bag --skill audit-to-execution -a codex -g
```

**Check syntax with** `npx skills add --help`: supported agent identifiers/options can change. Do not execute an installation automatically in a remote user environment. Skills CLI can report anonymous installation telemetry; see its documentation for opt-out controls.

## Manual paths (entire folder)

| Client | Project skill directory | Global skill directory | Typical invocation |
| --- | --- | --- | --- |
| **Codex CLI / IDE** | `<repo>/.agents/skills/<skill-name>/` | `~/.agents/skills/<skill-name>/` | `$skill-name` or natural language |
| **Claude Code** | `<repo>/.claude/skills/<skill-name>/` | `~/.claude/skills/<skill-name>/` | `/skill-name` or natural language |
| **Antigravity App / IDE** | `<repo>/.agents/skills/<skill-name>/` | `~/.gemini/config/skills/<skill-name>/` | `/skill-name` or natural language |
| **Antigravity CLI** | `<repo>/.agents/skills/<skill-name>/` | `~/.gemini/config/skills/<skill-name>/` (also legacy CLI-specific locations) | `/skill-name` |
| **ChatGPT** | No local filesystem path that ChatGPT automatically reads | Account/workspace Skills or plugin, if eligible | Ask naturally or select installed skill/plugin |

**Antigravity:** Prefer `.agents/skills` (not older `.agent/skills`). Its current docs explicitly describe the shared global `~/.gemini/config/skills` and the `/skills reload` CLI command if skills were added during a session. The older `~/.gemini/antigravity-cli/skills` path is additional, not the universal default. See [Antigravity docs](https://antigravity.google/docs/skills).

**Windows:** `$HOME` in PowerShell is the user's home; `~` in these tables denotes the home folder. Example local install: copy the full folder into `.agents/skills/my-workflow/`, including `references/`, `scripts/` and `evals/` as applicable. Reopen or reload the agent and verify it can read the target `SKILL.md`.

## ChatGPT: distinguish Skills from Plugins

According to the [ChatGPT Skills Help Center](https://help.openai.com/en/articles/20001066-skills-in-chatgpt), direct Skills authoring/import is supported for **eligible Business, Enterprise, Healthcare and Edu** users, subject to account/workspace controls. If present: **Plugins → Skills → Create → Upload from your computer** (or Create with editor/chat); complete review/scanning and install. Availability on a given user account must be checked in its actual UI.

The broader [Plugins directory](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt) can expose a **skills-only private plugin**; creation is separate from installation/selection. If a private plugin was created for your account, open its provided plugin URL and complete the user-side install/enable flow. **A GitHub commit or a ChatGPT conversation cannot train the base model or guarantee persistent activation.**

If neither installation surface is available, provide the skill folder/ZIP in the relevant conversation or Project and reference it explicitly; this is **contextual use**, not a durable account installation. Never tell the user a skill is available globally without checking.

## Prompt: ask your agent to install it safely

```text
Install the Agent Skill audit-to-execution for the current project, if the current client supports local skills.
Source: https://github.com/tbachir/bag/tree/main/skills/audit-to-execution
Read the project's AGENTS.md first, inspect SKILL.md and scripts for safety, detect this agent's actual skill directory, show the file changes, install the full folder without overwriting anything, then verify it is discoverable. Do not install globally, download scripts blindly, modify unrelated files or claim that ChatGPT is connected. If permissions or the client are unsupported, tell me the correct manual steps.
```

More installation and execution prompts: [PROMPTS.md](PROMPTS.md).

## Verification / updates / uninstall

- **Verify:** open the skill's `SKILL.md` from the correct destination; start a new session or reload; invoke a **read-only** sample prompt and check actual behavior rather than mere folder presence.
- **Update:** review the source change, version, compatibility, bundled scripts and security before copying or running `npx skills update`. BAG's freshness policy marks fast-changing guidance stale after its declared review interval; checking a box does not refresh upstream verification.
- **Uninstall:** remove the previously installed skill directory or use the corresponding agent/CLI management UI after checking whether it is shared by another workspace. Removing from a repo is different from removing a global install or ChatGPT plugin.

## Official sources

[Agent Skills](https://agentskills.io/specification) · [Skills CLI](https://skills.sh/docs/cli) · [Codex](https://developers.openai.com/codex/skills) · [Claude Code](https://code.claude.com/docs/en/skills) · [Antigravity](https://antigravity.google/docs/skills) · [ChatGPT Skills](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) · [ChatGPT Plugins](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt)
