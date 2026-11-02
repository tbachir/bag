---
name: fumadocs-engineer
description: Design, maintain and validate Fumadocs/Next.js documentation sites, navigation, Markdown/MDX pipelines, search, i18n and static exports while respecting the repository's actual setup.
license: MIT
metadata:
  language: en
  reviewed_at: "2026-10-29"
  bag-freshness-policy: fast-changing
  bag-review-interval-days: "30"
  bag-last-verified: "2026-11-01"
  bag-update-skill: skill-maintainer
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

## Version-sensitive checks (reviewed 2026-11-01)

- Inspect actual package aliases, not just package names: BAG currently pins `fumadocs-core@16.17.8`, `fumadocs-mdx@15.4.10`, and aliases `fumadocs-ui` to `@fumadocs/base-ui@16.17.8`. Do not replace Base UI imports with standard UI examples without testing.
- The upstream [Fumadocs changelog](https://www.fumadocs.dev/changelog) lists `fumadocs@16.17.9` (2026-10-28). A newer release alone is **not** a migration mandate; compare its release notes, lockfile, API usage and static build behavior before changing dependencies.
- The [page-tree convention](https://www.fumadocs.dev/docs/page-conventions) is explicitly scoped to sources using `loader()`; BAG compiles tracked Markdown with its own generator. Audit the resulting tree rather than assuming every `meta.json` feature is active.
- On upgrades touching search indexing, inspect release-specific changes, rebuild the browser index, and test French/English queries and fallback. Check static-export behavior against [official static guidance](https://www.fumadocs.dev/docs/deploying/static).

## Deliverable
Report changed source paths, navigation before/after, content coverage, checks executed and deployment compatibility. Distinguish tested behavior from recommended future enhancements.

## References
- https://www.fumadocs.dev/docs
- https://www.fumadocs.dev/docs/mdx
- https://www.w3.org/WAI/WCAG22/quickref/

