# 🔌 MCP Client Adapters

BAG provides configuration generators for all major agent environments and IDEs.

## Supported Clients & Paths

| Client | Configuration Path | Format |
| --- | --- | --- |
| **Claude Desktop** | `%APPDATA%\Claude\claude_desktop_config.json` (Windows)<br/>`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) | JSON |
| **Cursor** | `.cursor/mcp.json` (Project-specific) | JSON |
| **Gemini / Antigravity** | `<appDataDir>/antigravity-cli/mcp/` or project config | JSON |
| **VS Code** | `.vscode/mcp.json` | JSON |

## Automatic Installation

Use `bag mcp add <server-name>` with the `-a` / `--adapter` flag:

```bash
# Add to Cursor project config
bag mcp add supabase -a cursor

# Add to Claude Desktop global config
bag mcp add bag-mcp -a claude-desktop
```
