# 🔌 MCP — Model Context Protocol

Catalog MCP servers and their capabilities without assuming every client supports the same transport or configuration syntax.

Useful metadata for each server: official source, trust/maintenance, transport (stdio or HTTP), client compatibility, tools/resources exposed, scopes, installation prerequisites, secrets, and least-privilege guidance.

The [example JSON](mcp-servers.example.json) intentionally contains **no configured servers or credentials**. It's a structural placeholder, not a universal copy-paste setup; adapt keys and placement to the chosen client and its official documentation.

A discovered MCP server is not authorized for use just because it appears in this inventory.

## Curated integrations

- **Storybook MCP** (`@storybook/addon-mcp`) — Expose les composants, manifestes de props et exécutions de tests (`dev`, `docs`, `test` toolsets) pour outiller les agents de code IA dans le développement d'interface. Voir [Guide Storybook](../../maps-and-guides/ui/storybook-fondations-et-automatisation.md) et la fiche [Storybook](../../inventory/libraries/storybook/README.md).

**Status:** shelf ready; MCP servers to be curated.
