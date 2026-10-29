# Castly release

> Digital signage runtime and deployment reference

- **Category:** inventory / repositories
- **Status:** evaluating
- **Kind:** Learning reference
- **Source:** https://github.com/tbachir/castly-release
- **License:** Not verified; do not redistribute source code without checking
- **Last reviewed:** 2026-10-29
- **Compatibility:** Check the source project's current runtime and dependencies before adoption

## Why keep it?

Castly contains a Hono backend, Next.js admin web app, Vite/PWA display runtime and desktop application, backed by PostgreSQL and Better Auth.

## What to extract or study

Study `apps/docs/content/docs/how-to/install-ffmpeg-windows.mdx`, environment setup and migration instructions for platform-specific runbooks.

## Trade-offs & safety

Do not reuse project secrets or development credentials. A local `db:push` workflow is not a substitute for shared-environment migrations.

## Delegate — assess for my project

```text
Evaluate whether this BAG item would benefit my current project.
BAG item: https://github.com/tbachir/bag/tree/main/inventory/repositories/castly-release
Read BAG's root AGENTS.md and all applicable nested AGENTS.md files down to this item. Inspect my project's existing architecture, alternatives and constraints. Identify reusable patterns versus project-specific code, verify source license, and propose a minimal integration plan. Do not apply changes without approval.
```

## Related resources

- [Repository shelf](../README.md)
- [BAG delegation protocol](../../../maps-and-guides/agent-delegation-protocol.md)
