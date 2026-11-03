# ⚡ Supabase MCP Server

Model Context Protocol server for managing Supabase projects, running migrations, executing SQL, and managing database advisors.

## Tools Provided

- `list_tables`, `execute_sql`, `list_migrations`, `apply_migration`
- `query_logs`, `get_advisors`, `list_edge_functions`
- `generate_typescript_types`

## Configuration

With `bag` CLI:
```bash
bag mcp add supabase
```

Or configure manually in your agent client:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<your-personal-access-token>"
      }
    }
  }
}
```
