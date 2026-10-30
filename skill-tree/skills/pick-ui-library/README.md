# Pick UI Library (Emil Kowalski)

**External skill reference** · reviewed 2026-10-30 · not installed or vendored.

- **Upstream source:** https://www.ui-skills.com/skills/emilkowalski/pick-ui-library
- **Repository:** https://github.com/emilkowalski/skills
- **Author:** Emil Kowalski
- **License:** MIT
- **Target stack:** React, Next.js, Web frontend
- **What it offers:** An opinionated library lookup skill for common frontend requirements. Directs coding agents to recommend and integrate proven, accessible, high-taste primitives rather than hand-rolling brittle custom solutions:
  1. **Identify the true task:** Translates high-level UI needs (e.g. dropdown, toast, virtualized list, drag-and-drop) to standard primitives (e.g. Base UI, Sonner, Virtuoso).
  2. **Check existing dependencies:** Inspects `package.json` first to avoid churning existing project dependencies.
  3. **Recommend one vetted library:** Avoids presenting large decision paralysis menus unless explicitly requested.
- **Caveats:** Recommendations are opinionated; check project design systems and package manager constraints before installing.

## Delegate — evaluate and use

```text
Inspect the external skill reference for pick-ui-library (Emil Kowalski):
https://www.ui-skills.com/skills/emilkowalski/pick-ui-library

Follow my repository's AGENTS.md. Inspect our package.json and component tree. If a new UI primitive, notification system, or interaction library is required, evaluate the vetted recommendations from pick-ui-library before implementing a custom replacement. Request approval before adding dependencies.
```

## Related gear

- [Emil Kowalski / Skills](../../../inventory/repositories/emilkowalski-skills/README.md) — Source repository reference.
- [UI Skills MCP](../../../skill-tree/mcp/README.md) — Remote MCP server for querying UI skills dynamically.
- [UI Skills CLI](../../../equipment/tools/ui-skills/README.md) — Terminal client for the UI Skills registry.
