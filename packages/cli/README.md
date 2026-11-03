# @tbachir/bag — BAG CLI

Agent-first developer inventory and scaffolding tool.
Manages Skills, MCP servers, Recipes, Templates, and Packs.

## Installation

```bash
# Run directly via npx
npx @tbachir/bag --help

# Or install globally
npm install -g @tbachir/bag
```

## Quick Start

```bash
# Search developer inventory
bag search mcp

# Inspect and add skills
bag skill list
bag skill show clean-code
bag skill add clean-code --target ./my-project --apply

# Configure MCP servers
bag mcp list
bag mcp add supabase -a cursor --target ./my-project --apply

# Inspect recipes and copy prompts
bag recipe list
bag recipe show auth --prompt

# Apply configuration templates
bag template list
bag template apply configs/editorconfig --target ./my-project --apply

# Equip curated packs
bag pack list
bag pack plan ai-coding --target ./my-project
bag pack equip ai-coding --target ./my-project --apply
```

## Publishing

See [How to publish the BAG CLI](../../guides/how-to/publishing-cli.md) for automated GitHub Actions workflows and local packaging details.

## License

MIT
