# 🤖 AI Coding Loadout — Starter kit

**Quest:** prepare a repository to collaborate productively with AI agents without granting unnecessary access.

**Status:** starter/reference only. No tool installation or provider connection is performed.

## Equipment slots

| Slot | BAG item | Role |
| --- | --- | --- |
| Project rules | [AGENTS.md example](../../skill-tree/agents/AGENTS.example.md) | State architecture, commands, boundaries, and test evidence |
| Repo guardrails | [BAG agent conventions](../../AGENTS.md) | Example of scope-limited instructions |
| Reusable capability | [SKILL.md template](../../skill-tree/skills/_template/SKILL.md) | Define a narrow, verifiable skill |
| Integrations | [MCP catalog](../../skill-tree/mcp/README.md) | Review servers, access scope, compatibility |
| Plugins | [Plugin catalog](../../skill-tree/plugins/README.md) | Assess available actions and data permissions |
| Checks | [Validation script](../../spellbook/scripts/README.md) | Validate BAG's own docs, not arbitrary project tests |

## Equip sequence

1. Copy and customize the project [AGENTS.md example](../../skill-tree/agents/AGENTS.example.md) in your **target project**; replace all placeholders and verify real commands.
2. Choose your AI client; consult its **official current** setup docs for supported rules, skills, and MCP transports.
3. Install only the specific skills/integrations you need after checking provenance and permissions.
4. Keep credentials in your chosen secure environment or secrets manager — never in BAG or Git.
5. Run your target project's real lint, typecheck, test, and build commands. Report PASS/FAIL/NOT RUN.

## Not included

No preconfigured agent credentials, no automatic installer, no assumption that client features are interchangeable, and no claim that this template alone configures an AI client.
