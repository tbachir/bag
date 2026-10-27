# BAG documentation site

Standalone Next.js and Fumadocs app, generated with the official
[Create Fumadocs](https://fumadocs.dev/docs/cli/create-fumadocs-app) scaffolder
and its `+next+fuma-docs-mdx+static` template. The default build is fully static:
no Node.js server, database, API keys, or Vercel account is needed to host it.
The rest of BAG keeps its dependency-free CLI and existing Markdown sources.

## Develop

Requirements: Node.js 22+ and pnpm 10. From this directory:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000/docs. Stop the server with Ctrl+C.

## Build and preview

```bash
pnpm build
pnpm start --listen 3000
```

`pnpm build` exports the site to `out/`. `pnpm start` only serves those static
files. Static generation and browser tests use one worker to limit memory usage.

## Author content

- Add `.mdx` pages to `content/docs`; every page needs a frontmatter `title` and
  should have a `description`.
- Edit `content/docs/meta.json` to order pages in the sidebar.
- Configure navigation in `lib/layout.shared.tsx`, and site name, GitHub details,
  and source directory in `lib/shared.ts`.
- Collections use the current template's macro API in `lib/source.ts`; `.source/`
  is generated and must not be edited.
- Keep existing BAG items at their primary repository homes. The initial docs
  pages link to them; this setup does not migrate the full inventory.

See [page conventions](https://fumadocs.dev/docs/page-conventions) and
[Markdown syntax](https://fumadocs.dev/docs/markdown). Preserve content when
migrating documents; adjust frontmatter and links to match their new locations.

## Static features

| URL | Purpose |
| --- | --- |
| `/docs/` | Documentation entrypoint |
| `/api/search` | Prebuilt search index, searched locally in the browser |
| `/llms.txt` | Documentation index for agents |
| `/llms-full.txt` | Combined documentation text |
| `/llms.mdx/docs/content.md` | Introduction as Markdown |
| `/llms.mdx/docs/zones/content.md` | Zone directory as Markdown |
| `/og/docs/image.png` | Prebuilt introduction Open Graph image |

All files are generated during the build. Use the explicit Markdown URLs or
the page's Copy Markdown control: static hosting does not provide request-time
content negotiation or `.md` suffix rewrites.

## Browser checks

Playwright is a permanent dev dependency. Install Chromium once:

```bash
pnpm exec playwright install chromium
# Linux/WSL: install missing OS libraries, if needed (requires sudo):
pnpm exec playwright install-deps chromium
pnpm build
pnpm test:e2e
```

Tests launch a static file server on port 3000, verify desktop and mobile reading,
navigation, client search, LLM text, images, and 404s, then stop the server.
Keep port 3000 free. Failure traces and screenshots are ignored by Git.
Use `pnpm types:check` for a separate TypeScript check.

On Linux without sudo, libraries can instead be installed under the user's own
account. If installed at `~/.local/share/playwright-deps`, run tests with:

```bash
LD_LIBRARY_PATH="$HOME/.local/share/playwright-deps/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}" pnpm test:e2e
```

## Host anywhere

1. Optionally copy `.env.example` to `.env.local` and set `DOCS_SITE_URL` to the
   docs site's public origin, or set it in the hosting build environment. This
   makes absolute Open Graph URLs use your domain. The local default is
   `http://localhost:3000`.
2. Run `pnpm install --frozen-lockfile` and `pnpm build` from `apps/docs`.
3. Upload the **contents** of `apps/docs/out/` to any static host (shared hosting,
   object storage/CDN, Nginx, or another static hosting service).
4. Serve directory `index.html` files and preserve the generated paths. No SPA
   fallback is required; unknown paths should return a 404, optionally using
   `404.html`. Extensionless `/api/search` must serve the exported search file.

`trailingSlash: true` emits directory indexes so `/docs/` and nested pages work
with ordinary static servers. Keep docs at `/docs`; use a subdomain such as
`docs.example.com` or route `/docs/*` from a main site to this separate deployment.
When proxying a main domain, also route the generated `/_next/*` assets,
`/api/search`, `/llms*`, and `/og/docs/*` paths to this app.

### Optional Vercel hosting

If you choose Vercel, import this repository as a **separate project**, set its
Root Directory to `apps/docs`, use `pnpm build` as the Build Command and `out` as
the Output Directory, and set `DOCS_SITE_URL` to that project's public origin.
The app remains a static export on Vercel as well. No deployment is performed by
setup or testing.

References: [Fumadocs static builds](https://fumadocs.dev/docs/deploying/static)
and [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).

## Canonical BAG resource registry

Skills, CI examples, reusable configurations and source Markdown remain outside `apps/docs`; do not duplicate them as handwritten MDX. See [resource exposure guide](../../maps-and-guides/resource-exposure.md) and the [o2switch descriptor](../../catalog/exposures/o2switch-cloud.json). The current website links to canonical sources; a future build-time adapter may index them without changing their ownership. Registered consumers are descriptive and opt-in, not runtime activation.
