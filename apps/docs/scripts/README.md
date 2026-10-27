# Documentation compilation

From the docs app, run `pnpm content:generate` to compile the tracked BAG Markdown
and technical files into `.generated/` and `public/files/`. Both paths are reserved
generated outputs, ignored by Git, and replaced on regeneration. Author the source
files in their original repository locations. No source or resource is executed.

`pnpm dev`, `pnpm build`, and `pnpm types:check` generate first. Restart the dev
server (or rerun `pnpm content:generate`) after editing BAG source files; no
background watcher or service is installed. Generation requires a Git checkout.

`pnpm build` also runs `finalize.mjs` to add plain Markdown shortcuts and
`.nojekyll` to `out/`. `pnpm test:unit` checks the compiler and static export audit.
`pnpm content:check` audits the current export's page coverage and local links.

Only tracked root Markdown and files in the seven zones, catalog, templates, and
demo are published. Untracked discoveries require `git add` before they appear.
Page mappings and resource URLs are recorded in `.generated/manifest.json`.
Generation fails on missing local links, route collisions, symlinks, and
secret-like paths. Paths outside the publication scope link to GitHub.
