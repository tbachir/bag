# UI Skills CLI (`ui-skills`)

> CLI and interactive terminal registry for discovering and inspecting frontend design-engineering skills.

- **Category:** Equipment / tools
- **Status:** ready
- **Official source:** https://www.ui-skills.com/
- **Documentation:** https://www.ui-skills.com/mcp/docs
- **Package:** `ui-skills` (npm: https://www.npmjs.com/package/ui-skills)
- **License:** MIT (Julien Thibeaut / ibelick)
- **Last reviewed:** 2026-10-30
- **Compatibility:** Node.js 18+, cross-platform (`npx ui-skills`)

## What is it for?

`ui-skills` provides a terminal interface and catalog client for the UI Skills registry. It allows developers and coding assistants to list, explore, and retrieve specialized agent instruction sets for UI polish, accessibility, component anatomy, and motion engineering without manually browsing web pages.

### Common commands

```bash
# Run the interactive menu
npx ui-skills

# List categories and skills
npx ui-skills list
npx ui-skills categories

# Fetch a skill's instructions by slug
npx ui-skills get emilkowalski/animate-expo
npx ui-skills get emilkowalski/pick-ui-library
```

## Delegate: inspect and query UI skills

```text
Inspect UI Skills via CLI or MCP endpoint for design guidelines relevant to this task.

BAG item: https://github.com/tbachir/bag/tree/main/equipment/tools/ui-skills

Read BAG's root AGENTS.md and nested AGENTS.md files down to this item. Use `npx ui-skills list` or the remote MCP server at `https://www.ui-skills.com/mcp` to locate guidelines before writing UI or animation code; do not run untrusted scripts or modify dependencies without authorization.
```

## Safety and limits

- Invoking via `npx ui-skills` downloads and executes the npm package; review `package.json` and versions in production CI.
- For AI agent workflows, prefer connecting to the read-only remote MCP endpoint (`https://www.ui-skills.com/mcp`) which requires zero local dependency installation.
- Skills retrieved are prompt/instruction rules, not verified executable code libraries.

## Related gear

- [UI Skills MCP](../../../skill-tree/mcp/README.md) — Remote MCP server configuration.
- [Animate Expo (Emil Kowalski)](../../../skill-tree/skills/animate-expo/README.md) — React Native & Expo animation skill reference.
- [Pick UI Library (Emil Kowalski)](../../../skill-tree/skills/pick-ui-library/README.md) — Frontend library lookup skill reference.
- [Emil Kowalski / Skills](../../../inventory/repositories/emilkowalski-skills/README.md) — Upstream repository card.
