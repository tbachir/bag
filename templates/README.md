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
- [Skills](skills/README.md): Official `SKILL.md` starter template for authoring new agent skills.
- [Item Templates](item.md): Templates for authoring new BAG inventory items and [delegable items](delegable-item.md).
