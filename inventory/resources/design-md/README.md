# DESIGN.md — design-system context for coding agents

DESIGN.md is a portable, human-readable representation of a project's visual system (tokens, typography, spacing, component conventions and usage rationale). A community directory of kits exists at [designmd.ai](https://designmd.ai/); inspect the format/specification upstream at [google-labs-code/design.md](https://github.com/google-labs-code/design.md). The two links are not interchangeable: one is a format project, the other a resource catalog.

- **Type:** Design resource / inspiration
- **Recommendation:** Recommended where agents regularly generate or redesign UI
- **Reviewed:** 2026-10-29

## Best use

Create a project-local DESIGN.md matching the *existing* brand; document component patterns and light/dark tokens, then require agents to consult it. Do not blindly copy another kit or overwrite actual token files. Reconcile it with Tailwind/shadcn and accessibility requirements.

## Delegate — create a project design language

```text
Inspect my project's current visual language, branding assets, tailwind tokens and existing UI. Using https://github.com/tbachir/bag/tree/main/inventory/resources/design-md as a reference, draft a DESIGN.md matching what the product actually uses. Flag conflicting tokens and missing choices; do not invent an unrelated brand or change production styling without my approval. Include a verification checklist and design do's/don'ts.
```

[Resource shelf](../README.md).
