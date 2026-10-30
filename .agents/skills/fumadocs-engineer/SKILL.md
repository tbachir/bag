---
name: fumadocs-engineer
description: Design, maintain and validate Fumadocs/Next.js documentation sites, navigation, Markdown/MDX pipelines, search, i18n and static exports while respecting the repository's actual setup.
license: MIT
metadata:
  language: en
  reviewed_at: "2026-10-29"
---

# Fumadocs Engineering

Use when implementing or troubleshooting Fumadocs documentation sites, content pipelines, navigation, search, internationalization, or deploys.

## Inspect first
1. Read repository AGENTS.md and the existing docs app README, package.json, source configuration and content layout. Detect whether the project uses Fumadocs MDX macro/config APIs or another content adapter; never mix examples without confirming versions.
2. Identify the canonical authoring source and generated directories; never edit generated artifacts as source.
3. Confirm site mode: static export vs runtime server, base path, search provider, supported locales, and hosting.

## Workflow
1. Inventory page hierarchy, onboarding paths, title consistency, broken links, redirects, and search discoverability.
2. Propose a small information architecture: start here, conceptual guide, tutorials, how-to, reference, contribution. Preserve stable slugs or add redirects where supported.
3. Implement changes using the installed Fumadocs APIs, existing theme and content conventions. Keep code examples copyable and version-specific.
4. For i18n, identify locale routing, fallback behavior, per-locale navigation, translated slugs, language switcher and search indices. Do not claim a translation is complete without a file-by-file coverage report.
5. For accessibility and usability, verify keyboard navigation, headings, focus order, contrast, mobile navigation, code blocks and meaningful link labels.
6. Check generated outputs and metadata: SEO titles/descriptions, canonical URLs, sitemap where applicable, `llms.txt`, copy-Markdown routes, and broken internal anchors.
7. Run repository's actual tests/build/typechecks; report failures and unavailable checks.

## BAG-specific integration
BAG's docs app compiles tracked repository Markdown into a **static** site. Its authoritative instructions are in `apps/docs/README.md`; source lives in BAG's seven zones and is not meant to be moved into `apps/docs/content`. Run `pnpm content:generate`, `pnpm content:check`, and relevant unit/build/e2e checks from `apps/docs` as defined there. Do not assume a Next.js server or database is deployed.

## Deliverable
Report changed source paths, navigation before/after, content coverage, checks executed and deployment compatibility. Distinguish tested behavior from recommended future enhancements.

## References
- https://www.fumadocs.dev/docs
- https://www.fumadocs.dev/docs/mdx
- https://www.w3.org/WAI/WCAG22/quickref/

