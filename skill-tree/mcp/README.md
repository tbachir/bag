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

## Curated integrations

- **Storybook MCP** (`@storybook/addon-mcp`) — Expose les composants, manifestes de props et exécutions de tests (`dev`, `docs`, `test` toolsets) pour outiller les agents de code IA dans le développement d'interface. Voir [Guide Storybook](../../maps-and-guides/ui/storybook-fondations-et-automatisation.md) et la fiche [Storybook](../../inventory/libraries/storybook/README.md).
- **UI Skills MCP** — Serveur MCP distant (`https://www.ui-skills.com/mcp`) exposant le catalogue de skills de design-engineering et de motion UI (*ibelick*). Outils : `list_skills` (recherche dans le registre) et `get_skill` (récupération à la demande des contraintes et instructions pour agents). Voir la documentation officielle sur [UI Skills MCP Docs](https://www.ui-skills.com/mcp/docs).

**Status:** shelf ready; MCP servers to be curated.
