# 🔌 MCP — Model Context Protocol

Catalog MCP servers and their capabilities without assuming every client supports the same transport or configuration syntax.

## Native BAG MCP Server

BAG provides a built-in, zero-dependency MCP server via standard library Node.js:

- **Script:** [`spellbook/scripts/bag-mcp.mjs`](../../spellbook/scripts/bag-mcp.mjs)
- **Transport:** stdio (JSON-RPC 2.0)
- **Permissions:** Read-only (never modifies disk or executes external scripts)

### Exposed Tools

- `bag_search`: Search items in BAG catalog across title, summary, tags, zone, and kind.
- `bag_list_items`: Filter items by RPG zone, kind, status, or tag.
- `bag_get_item`: Inspect a catalog item and read its main documentation/skill file.
- `bag_list_loadouts`: List all pre-composed workflow loadouts.
- `bag_get_loadout`: Inspect a specific loadout and its resolved items.
- `bag_read_document`: Safely read any Markdown guide or doc within BAG.
- `bag_plan_loadout`: Preview (dry-run) applying a loadout to a local project directory.

### Client Configuration

Add this entry to your AI client's configuration file (e.g. `claude_desktop_config.json`, `.cursor/mcp.json`, or Antigravity):

```json
{
  "mcpServers": {
    "bag": {
      "command": "node",
      "args": [
        "/path/to/bag/spellbook/scripts/bag-mcp.mjs"
      ]
    }
  }
}
```

See [mcp-servers.example.json](mcp-servers.example.json) for the configuration template.
