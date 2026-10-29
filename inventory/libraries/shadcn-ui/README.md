# shadcn/ui

A source-owned component collection with a CLI; particularly useful for React applications that want customisable, accessible design foundations.

- **Official source:** https://ui.shadcn.com
- **Role:** Curated reference, not an automatic project dependency.
- **Recommendation:** recommended for react, nextjs, ui when the project needs this capability.
- **Reviewed:** 2026-10-29

## Practical workflow

1. Audit the project's current React framework, UI primitives, dependencies and tokens.
2. Consult the official source and evaluate the smallest compatible solution.
3. Integrate only after reviewing installation steps, licenses and potential collisions.
4. Verify accessibility, responsiveness, reduced motion, theme variants and automated tests.

## Trade-offs

Components are copied into the application and must be maintained. Verify the project's Radix/Base UI choice before adding variants.

## Delegate — project-aware integration

```text
Evaluate shadcn/ui for my current project. BAG item: https://github.com/tbachir/bag/tree/main/inventory/libraries/shadcn-ui
Read BAG root and nested AGENTS.md files, audit existing packages, compatibility, licensing and cost, and propose the smallest realistic integration. Avoid redundant UI libraries. Ask before installing or overwriting code. Run focused tests and report outcomes.
```

[Return to libraries](../README.md).
