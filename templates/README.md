# 📄 Project Templates & Configurations

Reusable scaffolding, dotfiles, boilerplates, and content templates for developers and coding agents.

## Quick Start (with `bag` CLI)

```bash
# List available templates
bag template list

# Apply a template to your project
bag template apply configs/editorconfig --target ./my-project
bag template apply configs/node-gitignore --target ./my-project
```

## Categories

- [Configs](configs/README.md): Pre-configured `.editorconfig`, `.gitignore`, and tooling configurations.
- [Boilerplates](boilerplates/README.md): Project starters for documentation (Fumadocs), mobile apps (Expo), and web apps.
- [Agent Skill Factory](skills/README.md): complete portable skill starter, safe no-overwrite generator/validator, test cases, [Codex/Claude/ChatGPT/Antigravity install guide](skills/INSTALL.md) and [copy-ready prompts](skills/PROMPTS.md).
- [Item Templates](item.md): Templates for authoring new BAG inventory items and [delegable items](delegable-item.md).
