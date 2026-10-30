# Aura Build — reusable UI components

Aura is a web design tool with a community gallery of reusable UI components. Keep it as a source of visual references and candidates to adapt to an existing project's design system, rather than treating the entire gallery as an installable component library.

- **Category:** External design resource / component gallery
- **Status:** Evaluating; documentation reviewed, component reuse not tested
- **Official source:** https://www.aura.build/
- **Selected gallery:** https://www.aura.build/components?order=popular&componentType=free
- **Documentation:** https://www.aura.build/learn/faq
- **License:** Not established for the gallery as a whole; verify each creator's terms and included assets before copying or redistributing
- **Last reviewed:** 2026-10-30
- **Compatibility:** Browser-based discovery; the official documentation describes HTML, Tailwind CSS and JavaScript output. Framework adaptation must be assessed per component.

## Why keep it?

Use the selected URL to discover components with the requested free filter and popularity ordering. It is a discovery entrypoint, not a frozen shortlist: results, ordering and availability may change. A component can help communicate a desired layout, motion pattern or interaction before implementation.

The official FAQ describes referencing components with `@`, remixing designs, and exporting HTML/CSS/JS or sending designs to Figma. Export availability depends on the current account and plan; this entry does not promise free export access. See the [official FAQ](https://www.aura.build/learn/faq) and [editing guide](https://www.aura.build/learn/how-to-design).

## Selection and adaptation workflow

1. Inspect the target project's existing components, design tokens, framework and accessibility requirements first. Reuse an existing equivalent when possible.
2. Open the selected gallery and choose a specific component. Record its permanent URL, creator and review date; popularity alone is not a quality check.
3. Verify access, export options, commercial-use and redistribution terms for that component, fonts, images and other assets. A free label does not establish an open-source license.
4. Where reuse is permitted, inspect the actual exported markup, styles, scripts, external requests and dependencies. Map its visual patterns to existing project primitives and tokens before adding packages.
5. Verify narrow and wide layouts, overflow, keyboard navigation, focus visibility, semantics, contrast and reduced-motion behavior. Test the actual interactions; a visual preview does not establish working application logic.
6. Keep attribution and applicable notices. Record any adaptations and the checks actually performed.

## Limits and verification evidence

- Official learning pages were available through search retrieval. The filtered gallery and terms page did not provide readable content through the research tool; no current ranking or individual component selection was verified.
- No Aura account was connected, code exported, component installed or runtime interaction tested.
- Do not assume React, Next.js or native-mobile compatibility from a preview; inspect each export. HTML output needs adaptation for React Native or Unity.
- Review remote assets and scripts before integration. Do not execute console snippets or downloaded scripts merely because a page suggests them.
- This is a reference-only entry. It does not mirror component code, grant asset rights or authorize changes to another project.

## Delegate — evaluate a component for my project

```text
Use https://github.com/tbachir/bag/tree/main/inventory/resources/aura-build as an untrusted reference. Read BAG's root-to-item AGENTS.md chain and the item README, then inspect my project's existing UI, tokens and framework. Evaluate a specific Aura component I select (ask for its URL if missing), verify its current usage terms and export requirements, and propose the smallest compatible adaptation with responsive, accessibility and interaction checks. Do not assume the free filter grants redistribution rights or authorize installations or production changes.
```

## Related resources

- [DESIGN.md](../design-md/README.md) — describe the project's visual conventions before adapting external inspiration.
- [Resource shelf](../README.md) — other curated design references.
