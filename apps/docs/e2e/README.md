# Browser checks

Run `pnpm build` and `pnpm test:e2e` from the docs app. Playwright starts a static
file server, checks desktop and mobile Chromium with one worker, and stops the
server when done. Keep port 3000 free. Tests cover the compiled inventory,
agent reference pages, original-source links, browser search, downloads,
Markdown shortcuts, LLM content, Open Graph images, and missing pages.

For a prefix build, pass the same `DOCS_BASE_PATH` to both commands. CI checks
both the empty prefix and `/bag`. The preview server only serves files from
`out/`, including normal directory indexes; it provides no SPA fallback.
