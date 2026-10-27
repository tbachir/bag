# French translation workspace

This directory is reserved for optional, human-reviewed French translations of the BAG documentation.

English source files remain in their original repository locations. Do not move or copy canonical items, and do not translate executable snippets, commands, filenames, API identifiers, or agent contracts.

Future French translations mirror the source path, for example:

```text
maps-and-guides/getting-started.md
apps/docs/translations/fr/maps-and-guides/getting-started.md
apps/docs/translations/fr/maps-and-guides/getting-started.md.source-sha256
```

The sidecar file records the SHA-256 of the English source bytes when the translation was last reviewed. Run `node apps/docs/scripts/check-translations.mjs` to find stale translations. Missing translations are intentional and must fall back to English when locale routing is enabled.

**Current limitation:** this is the translation tracking foundation, not published French routes or a language selector. Until those are implemented, the site remains English-only at `/docs/`. Do not advertise `/fr/` routes yet.

See [localization plan](../I18N.md).
