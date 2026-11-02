# ⚡ Actionable Recipes & Task Blueprints

Recipes are structured, phased task blueprints and prompt sequences designed for developers and AI agents.

## Quick Start (with `bag` CLI)

```bash
# List all available recipes
bag recipe list

# Inspect recipe tasks and generate an agent prompt
bag recipe show auth --prompt
```

## Available Recipes

| Recipe | Domain | Description | Tasks / Manifest |
| --- | --- | --- | --- |
| [auth](auth/README.md) | Authentication | Step-by-step Supabase Auth setup, methods (Magic link, OAuth, Passwords), and RLS policies | [Auth Tasks](auth/README.md) |
| [mobile](mobile/README.md) | Mobile / Expo | Mobile app audit, branding, contracts, device testing, and release checklist | [Mobile Workflows](mobile/README.md) |

## How Recipes Work

Unlike generic scripts, a BAG Recipe:
1. Breaks a complex goal into granular, verifiable steps.
2. Specifies dependencies (`requires`), alternatives (`conflicts`), and capabilities (`provides`).
3. Generates a project-tailored, copyable prompt for your coding agent.
