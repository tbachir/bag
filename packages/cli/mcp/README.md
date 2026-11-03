# 🔌 Model Context Protocol (MCP) Hub

BAG provides pre-configured **Model Context Protocol (MCP)** server definitions and one-command installation adapters for AI coding agents and editors (Claude Desktop, Cursor, Gemini Antigravity, VS Code, Codex).

## Quick Start (with `bag` CLI)

```bash
# List all available MCP servers in BAG
bag mcp list

# Add an MCP server to your current project or editor
bag mcp add bag-mcp --target ./my-project
bag mcp add supabase -a cursor
bag mcp add context7 -a claude-desktop
```

## Available MCP Servers

| Server | Category | Description | Setup Guide |
| --- | --- | --- | --- |
| **`bag-mcp`** | Tool / Search | Exposes the entire BAG inventory, skills, and catalog over stdio JSON-RPC | [Setup Guide](servers/bag-mcp/README.md) |
| **`supabase`** | Backend / Database | Database schemas, Postgres migrations, advisors, logs, and edge functions | [Setup Guide](servers/supabase/README.md) |
| **`context7`** | Documentation | Up-to-date documentation and type references for libraries and frameworks | [Setup Guide](servers/context7/README.md) |
| **`ui-skills`** | Design / UI | Design system audits and UI component discovery | [Setup Guide](servers/ui-skills/README.md) |

## Supported Client Adapters

The BAG CLI automatically generates or updates configurations for:
- **Claude Desktop**: `claude_desktop_config.json`
- **Cursor**: `.cursor/mcp.json`
- **Gemini / Antigravity**: `.gemini/settings.json`
- **VS Code**: `.vscode/mcp.json`

Read [Client Adapters](adapters/README.md) for custom environment variables and manual configuration examples.
