# Fumadocs enhancements: inventory-first architecture

BAG remains Markdown-first: source files and optional `bag.item.json` live anywhere under published repository zones. No authored file belongs in `.generated/`.

## Per-folder metadata

Place an optional `bag.item.json` next to a folder's README:

```json
{
  "type": "library",
  "tags": ["authentication", "mobile"],
  "technologies": ["supabase", "expo"],
  "useCases": ["user onboarding"],
  "navigation": { "title": "Authentication", "defaultOpen": true, "pages": ["index", "setup"] }
}
```

Every folder is an independent item, with unlimited nesting (subject to the host file system). Navigation is generated recursively; unspecified children are appended so they never disappear. The supported navigation keys are title, description, icon, defaultOpen, collapsible, pages. Only simple local filenames are accepted for pages. No external links or instructions are executed from metadata. The generated manifest exposes type, tags, technologies and useCases to the statically rendered inventory explorer.

## Explorer and templates

The `/explore/` route filters static manifest entries by text, type, tag, technology and use case and allows multi-selection for a copyable, opt-in prompt. The connections mode currently displays path-based relationships, not a semantic dependency graph. Fumadocs default MDX Cards and other components remain available for the small hand-authored pages; source Markdown stays escaped and is not automatically executed as MDX. This distinction is deliberate. Rich interactive templates must consume validated metadata, not arbitrary source JSX.

## Agent interoperability and feedback

`/llms.txt`, `/llms-full.txt`, per-page Markdown and `/api/search` remain static discovery surfaces. Fumadocs' MCP integration requires a running server transport; GitHub Pages cannot host a live MCP endpoint. A separate opt-in stdio/HTTP adapter may be added after validating the official MCP server versions. Source pages link to GitHub editing/issue workflows for corrections; issues require a user's GitHub session.

## Localization

English remains canonical. Optional reviewed French translations and checksum safeguards remain in `apps/docs/I18N.md`. Do not publish empty or stale French pages or claim FR coverage before both static builds and locale route tests pass. Use `pnpm translations:check` to measure coverage.

## Verify

From `apps/docs`: `pnpm test:unit`, `pnpm build`, `pnpm content:check`, `pnpm types:check` and `pnpm test:e2e`. From repository root run `node spellbook/scripts/validate.mjs`. Test both default and `DOCS_BASE_PATH=/bag` exports. This PR may not have executed all checks if the GitHub connector cannot supply a local Node workspace.

Primary references: https://www.fumadocs.dev/docs/headless/page-conventions , https://www.fumadocs.dev/docs/deploying/static , https://www.fumadocs.dev/docs/headless/utils/mcp , https://www.fumadocs.dev/docs/ui/components .
