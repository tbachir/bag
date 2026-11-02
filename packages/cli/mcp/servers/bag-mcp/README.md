# 🎒 BAG MCP Server

The native Model Context Protocol server for the BAG developer inventory.

## Capabilities

Exposes BAG tools to connected agents:
- `bag_search`: Search items and skills across the catalog.
- `bag_list_items`: Filter items by kind, status, or tag.
- `bag_get_item`: Inspect canonical metadata and source content.
- `bag_read_document`: Safely read local markdown and guide documentation.
- `bag_plan_loadout`: Generate a dry-run equip plan.
- `bag_ui_studio`: Run the UI prototype generator.

## Usage

```bash
# Run stdio server directly
node spellbook/scripts/bag-mcp.mjs

# Or install configuration with BAG CLI
bag mcp add bag-mcp
```

### Manual Configuration

```json
{
  "mcpServers": {
    "bag": {
      "command": "node",
      "args": ["<path-to-bag>/spellbook/scripts/bag-mcp.mjs"]
    }
  }
}
```
