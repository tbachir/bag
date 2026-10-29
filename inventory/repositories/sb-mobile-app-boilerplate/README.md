# Mobile app boilerplate

> Expo + Next.js + Hono multi-app starter with branding CLI

- **Category:** inventory / repositories
- **Status:** evaluating
- **Kind:** Template candidate
- **Source:** https://github.com/tbachir/sb-mobile-app-boilerplate
- **License:** Not verified; do not redistribute source code without checking
- **Last reviewed:** 2026-10-29
- **Compatibility:** Check the source project's current runtime and dependencies before adoption

## Why keep it?

The monorepo documents Expo, Next.js, Hono, Prisma, a shared UI package, and a Windows PowerShell-friendly customization wizard for app identity and branding.

## What to extract or study

Review `docs/runbooks/customization.md`, `branding/README.md`, and the branding CLI as reusable setup practices. Especially interesting: dry runs, diff previews, and explicit approval for remote provisioning.

## Trade-offs & safety

Branding and deployment adapters are coupled to this repo's layout. Prefer extracting documented patterns before sharing code.

## Delegate — assess for my project

```text
Evaluate whether this BAG item would benefit my current project.
BAG item: https://github.com/tbachir/bag/tree/main/inventory/repositories/sb-mobile-app-boilerplate
Read BAG's root AGENTS.md and all applicable nested AGENTS.md files down to this item. Inspect my project's existing architecture, alternatives and constraints. Identify reusable patterns versus project-specific code, verify source license, and propose a minimal integration plan. Do not apply changes without approval.
```

## Related resources

- [Repository shelf](../README.md)
- [BAG delegation protocol](../../../maps-and-guides/agent-delegation-protocol.md)

## Compose just the workflows you need

The [selectable boilerplate workflows](workflows/README.md) cover architecture audit, contracts, branding, authentication, device testing and release readiness. Open the resource in BAG's documentation to check individual tasks; required prerequisites are added to the generated prompt, but no installation or deployment occurs automatically. The corresponding manifest lives at [workflows/index.json](workflows/index.json).
