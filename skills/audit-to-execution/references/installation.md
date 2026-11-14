# Installing Audit to Execution across agents

Checked against the official documentation on **2026-11-14**. Product capabilities may change; verify the current target application's documentation before using these commands. Installation changes local files or a user/workspace plugin and requires appropriate authorization. A skill does not itself grant GitHub, browser or deployment credentials.

## Install from BAG (once the BAG PR is merged)

From the project folder, inspect before installing:

```bash
npx skills add https://github.com/tbachir/bag --skill audit-to-execution
```

The CLI may prompt for which agents should receive the skill and whether to install project-local or globally. To target a specific agent, use `-a` with a supported value (examples below); confirm with `npx skills add --help` because supported agent identifiers can change.

```bash
npx skills add https://github.com/tbachir/bag --skill audit-to-execution -a codex
npx skills add https://github.com/tbachir/bag --skill audit-to-execution -a claude-code
npx skills add https://github.com/tbachir/bag --skill audit-to-execution -a antigravity
```

To install globally, append `-g`. To test the local skill before it is published, run `npx skills add ./audit-to-execution` from the extraction parent. **Do not run unreviewed remote scripts or install skills blindly.**

## Manual locations

| Agent | Project | Global user location | Invoke |
| --- | --- | --- | --- |
| Codex | `<repo>/.agents/skills/audit-to-execution/` | `~/.agents/skills/audit-to-execution/` | `$audit-to-execution` or natural language |
| Claude Code | `<repo>/.claude/skills/audit-to-execution/` | `~/.claude/skills/audit-to-execution/` | `/audit-to-execution` or natural language |
| Antigravity App / IDE | `<repo>/.agents/skills/audit-to-execution/` | `~/.gemini/config/skills/audit-to-execution/` | `/audit-to-execution` or natural language |
| Antigravity CLI | `<repo>/.agents/skills/audit-to-execution/` | `~/.gemini/antigravity-cli/skills/audit-to-execution/` | `/audit-to-execution` or natural language |
| ChatGPT | Skills directory / compatible private plugin | Account/workspace scope, not a local machine directory | Mention the skill, or select the connected plugin |

On Windows, `~` denotes your user home and can be reached as `$HOME` in PowerShell. Prefer project-local installs for reproducible team usage. Check that **the entire folder** with `SKILL.md`, `references/`, `assets/` and `scripts/` is copied. Reopen the agent session and request a skill listing when the agent does not see it.

## ChatGPT

ChatGPT does not read the folder on your Windows PC automatically, and chatting about a skill does not install or train it into the model. In an eligible workspace, open **Plugins → Skills → Create → Upload from your computer**, upload a skill ZIP, review the scan and install/enable it where available. Access varies by plan/workspace. Alternatively a **private skills-only plugin** can package the skill and expose it through the Plugins directory; plugin creation and installation are separate steps. If none of those controls is present, attach `SKILL.md` or the ZIP to a conversation / Project and explicitly request to use it; that is contextual access rather than persistent installation.

## Verify and maintain

1. Confirm the skill is listed in the intended agent and open its `SKILL.md`.
2. Try a read-only sample prompt: "Use audit-to-execution in audit mode for this repository; do not write or push."
3. Ask it to identify mode, sources, and output without inventing test evidence.
4. Update from the canonical source after source review; don't assume installed copies automatically track BAG or ChatGPT.

Primary sources:
- Agent Skills: https://agentskills.io/specification
- Skills CLI: https://www.skills.sh/docs/cli
- Codex skills: https://developers.openai.com/codex/skills
- Claude Code: https://code.claude.com/docs/en/skills
- Antigravity: https://antigravity.google/docs/skills
- ChatGPT skills: https://help.openai.com/en/articles/20001066-skills-in-chatgpt
- ChatGPT plugins: https://help.openai.com/en/articles/20001256-plugins-in-chatgpt
