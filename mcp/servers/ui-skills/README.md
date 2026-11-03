# 🎨 UI Skills MCP Server

Model Context Protocol server for design system standards, component inspection, and token discovery.

## Configuration

With `bag` CLI:
```bash
bag mcp add ui-skills
```

Manual configuration:
```json
{
  "mcpServers": {
    "ui-skills": {
      "command": "npx",
      "args": ["-y", "@ui-skills/mcp-server"]
    }
  }
}
```
