# Emil Kowalski / Skills

- **Category:** Inventory / repositories
- **Status:** evaluating
- **Source:** https://github.com/emilkowalski/skills
- **Catalog & distribution:** https://www.ui-skills.com
- **License:** MIT
- **Last reviewed:** 2026-10-30
- **Compatibility:** Agent-oriented instructions and guidelines for Claude Code, Cursor, Codex, Antigravity; not directly executable code packages.

## Why keep it?

A curated collection of ~15 specialized design-engineering and motion skills authored by Emil Kowalski (creator of Sonner and design engineer with background at Vercel/Linear). The collection helps coding agents produce polished, intentional user interfaces and avoid generic "AI slop".

Key skills in the collection:
- **`emil-design-eng`**: Core design engineering philosophy, component anatomy, and micro-interactions.
- **`animate`**: Web animation fundamentals (timing curves, spring physics, proper duration and properties).
- **`animate-expo`**: React Native & Expo motion engineering (Worklets / Reanimated 4, Gesture Handler, thread isolation, haptics). Indexed in BAG at [Animate Expo](../../../skill-tree/skills/animate-expo/README.md).
- **`review-animations` & `improve-animations`**: Structured audits and actionable critique of existing motion in codebases.
- **`animation-performance`**: Keeping animations within frame budgets (off-main-thread transforms/opacity, avoiding layout thrashing).
- **`apple-design`**: Translating fluid iOS/macOS physics and gestures to interface implementations.
- **`pick-ui-library`**: Opinionated, trusted component and utility recommendations. Indexed in BAG at [Pick UI Library](../../../skill-tree/skills/pick-ui-library/README.md).
- **`break-ui`**: Stress-testing UI components with edge-case data (extreme strings, empty states, viewport stress).

## When to use it

When an AI coding agent is tasked with implementing complex frontend interactions, polishing animation curves, building mobile gesture flows in Expo, or reviewing interface quality.

## Safety and limits

These skills are markdown instruction files designed to guide agent decision-making; they do not require or bundle runtime dependencies. Installing individual skills can be done via `npx skills add https://github.com/emilkowalski/skills --skill <name>` or via the [UI Skills MCP server](../../../skill-tree/mcp/README.md).

## Integration prompt

> Inspect my project's frontend stack, UI primitives and motion libraries. Read BAG's root-to-item AGENTS.md chain and [this item](https://github.com/tbachir/bag/blob/main/inventory/repositories/emilkowalski-skills/README.md), then reference the relevant design skills ([animate-expo](https://github.com/tbachir/bag/blob/main/skill-tree/skills/animate-expo/README.md), [pick-ui-library](https://github.com/tbachir/bag/blob/main/skill-tree/skills/pick-ui-library/README.md)). Verify constraints against our design system, plan minimal changes, and request approval before installing dependencies.
