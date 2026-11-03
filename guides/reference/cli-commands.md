# 💻 BAG CLI Command Reference

The `bag` CLI provides machine-readable discovery, agent integration, MCP installation, recipe execution, and non-destructive project scaffolding.

## Global Options

- `--json`: Output machine-readable JSON (ideal for AI agent pipelines).
- `--help`, `-h`: Show help documentation.
- `--version`, `-v`: Display current CLI version.

---

## Commands

### `bag search <query>`
Searches the entire catalog across skills, MCP servers, recipes, templates, and packs.

```bash
bag search "auth"
bag search "docs" --json
```

---

### `bag skill`
Manage and install Agent Skills into your project.

```bash
# List all available skills
bag skill list

# Show skill details and prompt
bag skill show fumadocs-engineer

# Install a skill into target project
bag skill add fumadocs-engineer --target ./my-project
bag skill add addbag -a claude-code
```

---

### `bag mcp`
Configure Model Context Protocol servers for AI coding assistants (Claude Desktop, Cursor, Gemini, VS Code).

```bash
# List available MCP servers
bag mcp list

# Configure an MCP server in target project or editor
bag mcp add supabase --target ./my-project
bag mcp add bag-mcp -a claude-desktop
```

---

### `bag recipe`
Inspect and compose multi-step task blueprints and workflows.

```bash
# List available recipes
bag recipe list

# Show recipe tasks and generate an agent prompt
bag recipe show auth --prompt
```

---

### `bag template`
Apply reusable configurations, dotfiles, or starters to an existing project.

```bash
# List available templates
bag template list

# Apply configuration (never overwrites without approval)
bag template apply configs/editorconfig --target ./my-project
```

---

### `bag pack`
Plan and equip composed stacks (formerly loadouts).

```bash
# List available packs
bag pack list

# Preview planned changes (dry-run, no files written)
bag pack plan ai-coding --target ./my-project

# Apply pack files to project
bag pack equip ai-coding --target ./my-project --apply
```

---

### `bag validate`
Validates catalog consistency, schemas, and resource links.

```bash
bag validate
```
