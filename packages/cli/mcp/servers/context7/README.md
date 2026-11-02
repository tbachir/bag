# 📚 Context7 Documentation MCP Server

Model Context Protocol server for retrieving current, version-accurate documentation, API references, and code examples for popular libraries and frameworks.

## Tools Provided

- `resolve-library-id`: Resolve framework or library package name.
- `query-docs`: Query upstream official documentation and examples.

## Configuration

With `bag` CLI:
```bash
bag mcp add context7
```

Manual configuration:
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    }
  }
}
```
