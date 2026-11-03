# 🧰 Curated Packs (Loadouts)

Thoughtfully assembled combinations of skills, MCP servers, templates, and recipes tailored for specific project types.

## Quick Start (with `bag` CLI)

```bash
# List all curated packs
bag pack list

# Plan changes (dry-run preview, no files written)
bag pack plan ai-coding --target ./my-project

# Apply pack files to project (never overwrites existing files)
bag pack equip ai-coding --target ./my-project --apply
```

## Available Packs

| Pack | Focus | Key Inclusions |
| --- | --- | --- |
| [ai-coding](ai-coding/README.md) | AI Developer Starter | `.editorconfig`, `.gitignore`, `AGENTS.md`, AI skill template, MCP catalog |
| [expo-mobile-production](expo-mobile-production/README.md) | Mobile / React Native | Mobile boilerplate, repository auditor, UI/UX review, Supabase Auth |
| [fumadocs-knowledge-base](fumadocs-knowledge-base/README.md) | Documentation Sites | Fumadocs UI, starter kit, docs architect, fumadocs engineer, API doc quality |
| [react-design-system](react-design-system/README.md) | Design Systems | shadcn/ui, ReUI, `DESIGN.md`, UI/UX review, component extractor |
| [ui-studio](ui-studio/README.md) | Interactive Prototypes | UI Studio generator, `DESIGN.md` visual tokens, component gallery |
