# 🪄 Scripts

Small, reviewed helpers runnable from the BAG root.

## Intelligent catalog CLI

```bash
node spellbook/scripts/bag.mjs list --json
node spellbook/scripts/bag.mjs search "mcp" --json
node spellbook/scripts/bag.mjs plan ai-coding --target ../existing-project
```

See [catalog documentation](../../catalog/README.md) for loadouts and opt-in local file copy. The default is read-only, including `equip` without `--apply`.

## BAG MCP Server

```bash
node spellbook/scripts/bag-mcp.mjs
```

Runs a Model Context Protocol (MCP) server over stdio (JSON-RPC 2.0). Provides AI coding agents (Claude, Cursor, Antigravity, VS Code, Gemini CLI, etc.) with read-only tools to search, discover, inspect items, read documentation, and plan loadouts from BAG. No external dependencies.

## Search the bag

```bash
node spellbook/scripts/find.mjs "skill"
node spellbook/scripts/find.mjs "agent"
```

Case-insensitive text search across `.md` files. Displays up to 40 matching lines with relative file paths. It skips common hidden/dependency directories and does not search secrets.

## Validate documentation

```bash
node spellbook/scripts/validate.mjs
```

Checks required RPG zones and local Markdown link targets. The check is lightweight and dependency-free; it does **not** validate external URLs or guarantee the correctness of docs, code, or security.

Requirements: Node.js 20+; runs on Windows, macOS, and Linux. Scripts are read-only.

## Portable task readiness

[Readiness checker](readiness/README.md) — independently authored, dependency-free JSON checks for task IDs, owners, acceptance criteria and dependency graph integrity. Includes a runnable example and Node tests. Read-only; not a replacement for project-specific acceptance decisions.
