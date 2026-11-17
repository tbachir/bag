# Vercel deployment hygiene for multi-app repositories

> **Status:** reference guide, not automatically installed · **Last checked:** 2026-11-17

**Goal:** avoid deploying every app in a monorepo for every commit, without weakening production, previews, or required tests.

## First inspect the repository

1. Map Vercel project → Git repository → root directory → app/package → production domain.
2. Identify canonical, preview, legacy/reference, and unknown projects. An old name is **not** evidence that a project can be deleted.
3. Check the root workspace definition, unique package names, lockfile, and explicit local dependencies.
4. Look for extra build dependencies: generated documentation from root `docs/`, embedded sibling apps, external scripts, assets and database migrations.
5. Record the current setting before changing it and leave a rollback path.

## Recommended Vercel settings

For GitHub-linked **npm/yarn/pnpm/Bun workspace monorepos**, use
**Project → Settings → Build and Deployment → Root Directory → Skip deployments for unaffected projects**.

Vercel evaluates workspace source changes, declared internal dependencies and lockfile impacts. As of 2026-10-21, its automatically skipped deployments do **not** count against deployment-rate limits.

**Do not blindly enable** if: there is no root workspace, packages lack declared dependencies, generated Fumadocs source lives outside the app/workspace, or an app embeds another app's build without a dependency edge. Vercel may treat outside-workspace files as global changes, while missing dependency edges can lead to stale releases.

Avoid using `Ignored Build Step` as the main quota mitigation: canceled builds still consume rate/concurrent limits. Consider disabling automatic previews **only** for confirmed legacy references or projects with an explicit manual-preview policy. Do not disable or delete production deployments, active domains, databases, or mandatory CI gates just to reduce quota.

## Developer/agent workflow

- Keep frequent commits **local** inside a worktree.
- Run targeted typechecks/tests before the first push.
- Push one coherent reviewable change instead of each micro-fix.
- Review with Codex or equivalent and batch corrections.
- Request preview builds only for changes that need browser/integration validation, when the project policy allows this.
- Merge into the protected canonical branch after tests/reviews, then verify actual production deployment.

## Verification matrix

| Change | Expected |
|---|---|
| App A alone | Only A deploys |
| Shared package used by A and B | A and B deploy |
| Lockfile dependency relevant to A | A deploys |
| Generated docs or root assets | All **required** consumers deploy |
| Only docs unrelated to an app | App may be skipped if source graph proves it |
| Disabled/expired member access or revoked secrets | Existing deployment remains secure |

Record the result of at least one positive and negative skip test. If a required app is skipped, **disable the setting for that app immediately** and fix its dependency graph before trying again.

## Reusable AGENTS.md fragment

```md
### Deployment hygiene
- Prefer Vercel's native unaffected-project skipping over custom ignored-build scripts.
- Validate dependency graphs, generated docs, embedded apps, and root assets.
- Do not push micro-commits purely to trigger Vercel; work locally then submit coherent PRs.
- Preserve security tests, previews needed for review, and production release gates.
- Do not delete or disable active projects without an explicit impact review.
- Log reversible Vercel setting changes and check the next deployment's result.
```

## Sources (checked 2026-11-17)

- [Vercel monorepo setup and limitations](https://vercel.com/docs/monorepos)
- [Build settings](https://vercel.com/docs/builds/configure-a-build)
- [Skipped monorepo deployments no longer count against limits](https://vercel.com/changelog/skipped-monorepo-deployments-no-longer-count-against-limits)

This BAG item is a reusable reference. It does **not** modify the settings of repositories that link to it.
