# BAG documentation site

BAG is compiled into a standalone, fully static Fumadocs and Next.js website.
The Markdown in the seven zones, catalog, templates, demo, and repository root
remains the source of truth. Agent instructions are reference content on the
website; reading them does not install or execute anything.

## Develop and build

Requirements: a Git checkout, Node.js 22+ and pnpm 10. From this directory:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000/docs/. Source generation runs before development,
builds, and type checks. Only tracked files are included; use `git add` for new
content. Restart development or run `pnpm content:generate` after source edits.

```bash
pnpm build
pnpm start --listen 3000
```

Builds generate all pages, browser search, LLM text, OG images, downloads, and
Markdown shortcuts in `out/`. Hosting requires only static files. No database,
API key, runtime Node.js server, or Vercel account is required. Static generation
and Playwright use one worker for compatibility with limited-memory machines.
Development and builds use Next.js’ supported Webpack option to avoid a large
Turbopack loader process pool when compiling the complete inventory.

## Content compilation

- Edit original BAG documents, including `SKILL.md` and `AGENTS.md`, at their
  existing locations. All tracked root Markdown and content in the seven zones,
  catalog, templates, and demo are published.
- README files become folder entrypoints; other document names become lowercase
  page paths. Navigation is generated with the seven zones first.
- Titles come from frontmatter, the first H1, or the filename. Descriptions use
  frontmatter or an introductory paragraph. The title is shown by the page layout.
- Relative links and reference definitions are rewritten, with queries and
  anchors preserved. Links outside the publication scope point to GitHub.
- Technical files are served unchanged under `/files/` and listed in the
  generated download directory. Scripts and manifests are never executed.
- Ordinary Markdown is compiled as Markdown; HTML is escaped as reference text.
  JSX-looking examples and braces are not executed as MDX.
- The small hand-authored zone directory is in `content/docs/zones.mdx`.
  Layout/navigation settings remain in `lib/layout.shared.tsx` and
  `lib/shared.ts`. GitHub links point to the original source, not generated files.

`.generated/`, `public/files/`, `.source/`, and `out/` are generated and ignored by
Git. The compiler owns the first two directories and replaces their contents.
Do not author files there. See [compiler details](scripts/README.md).

## Static URLs

| URL | Purpose |
| --- | --- |
| `/docs/` | Complete BAG documentation |
| `/docs/zones/` | Seven-zone directory |
| `/docs/downloads/` | Technical files and downloads |
| `/api/search` | Prebuilt index searched in the browser |
| `/llms.txt` | Documentation index for agents |
| `/llms-full.txt` | Combined documentation text |
| `/llms.mdx/docs/content.md` | Introduction as Markdown |
| `/docs.md` | Direct introduction Markdown shortcut |
| `/docs/inventory.md` | Example direct zone Markdown shortcut |
| `/og/docs/image.png` | Generated introduction OG image |

Every page has a Markdown shortcut: `/docs/<page-path>.md`. These are real files,
not rewrites. Static hosts need no request-time content negotiation. The Copy
Markdown control and existing `/llms.mdx/` routes remain available.

## Checks

```bash
pnpm test:unit
pnpm build
pnpm types:check
pnpm exec playwright install chromium
# Linux/WSL, if OS libraries are missing (requires sudo):
pnpm exec playwright install-deps chromium
pnpm test:e2e
```

Playwright is a permanent dev dependency. Tests serve the static export on port
3000, cover desktop and mobile, and stop their server when done. Keep that port
free. Traces/screenshots are retained on failure and ignored by Git.

The build audits every generated page, download, Markdown shortcut, and local
HTML link (including anchors). `pnpm content:check` reruns that audit. Unit tests
cover generation, collisions, invalid links, preservation of examples, cleanup,
symlinks, secret-like filenames, and deployment prefixes.

On a Linux account with browser libraries already installed at
`~/.local/share/playwright-deps`, tests can run without sudo:

```bash
LD_LIBRARY_PATH="$HOME/.local/share/playwright-deps/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}" pnpm test:e2e
```

The pnpm override to Lightning CSS 1.33 adds support for Fumadocs' search
`::highlight()` selectors while retaining their styling.

## Host anywhere

Set `DOCS_SITE_URL` to the public **origin**, without a path, at build time. Set
`DOCS_BASE_PATH` only when publishing under a path prefix; leave it empty for a
dedicated domain or subdomain. Both values must match the deployment.

```bash
# Dedicated static host
DOCS_SITE_URL=https://docs.example.com pnpm build

# GitHub Pages project site
DOCS_SITE_URL=https://tbachir.github.io DOCS_BASE_PATH=/bag pnpm build
DOCS_BASE_PATH=/bag pnpm test:e2e
```

Upload the **contents** of `out/` to the configured mount point. Directory
`index.html` files must be served normally, with real 404 responses for unknown
paths. Serve extensionless `/api/search` as its generated static file. No SPA
fallback is required. `.nojekyll` preserves generated `_next` assets on Pages.

Build-time prefixes apply to assets, search, links, Markdown, downloads, and OG
images. Rebuild when changing the public origin or path prefix. See
`.env.example` for local configuration. For local prefixed preview use
`DOCS_BASE_PATH=/bag node scripts/preview.mjs` after the corresponding build.

### Optional GitHub Pages publication

The **Build and publish BAG docs** workflow validates both root and `/bag`
exports for PRs and main. It also saves downloadable static artifacts. Publishing
runs automatically after a push to `main`, including merged PRs, once both
configurations pass. PR builds never publish. Manual runs on `main` can also
republish the validated site:

1. Use **Settings → Pages → Source → GitHub Actions** as the publishing source.
2. Merge a PR into `main`; the workflow validates and publishes the `/bag` export.
3. To republish without a new commit, use **Actions → Build and publish BAG docs → Run workflow** on `main`.

The default public URL is `https://tbachir.github.io/bag/`; no custom domain is
configured. Publishing uses the `github-pages` environment and narrowly scoped
permissions. A failed validation prevents publishing the new version.

### Optional Vercel publication

Import the repository as a separate project with Root Directory `apps/docs`,
Build Command `pnpm build`, and Output Directory `out`. Set `DOCS_SITE_URL` to the
public origin and leave `DOCS_BASE_PATH` empty for a dedicated domain. The app
remains a static export on Vercel.

References: [Fumadocs static builds](https://fumadocs.dev/docs/deploying/static),
[Next.js static exports](https://nextjs.org/docs/app/guides/static-exports), and
[GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Canonical BAG resource registry

Skills, CI examples, reusable configurations and source Markdown remain outside `apps/docs`; do not duplicate them as handwritten MDX. See [resource exposure guide](../../maps-and-guides/resource-exposure.md) and the [o2switch descriptor](../../catalog/exposures/o2switch-cloud.json). The current website links to canonical sources; the build-time compiler indexes them without changing their ownership. Registered consumers are descriptive and opt-in, not runtime activation.
