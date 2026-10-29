# Fumadocs Starter · Ready-to-use documentation app

**Status:** opt-in scaffold generator plus reviewed local overlays; this is not a fork of Fumadocs and does not modify BAG's own docs app.

This package creates a **new** Next.js + Fumadocs static documentation app using the official `create-fumadocs-app` CLI, then adds a runnable documentation playbook, task-based page examples, optional native `meta.json` navigation, and an opt-in `docs-architect` agent skill. No hand-maintained dependency list or duplicated framework bootstrap.

## Requirements

Node.js 22+, pnpm, internet access **only when applying**, and a target path which does not yet exist. The official scaffold's CLI options and supported templates should be rechecked before executing.

## Preview first (no writes, no network)

```bash
node equipment/fumadocs-starter/create.mjs --target ../my-docs
```

## Explicitly create, install, and launch

```bash
node equipment/fumadocs-starter/create.mjs --target ../my-docs --apply
cd ../my-docs
pnpm dev
# For a static deployment:
pnpm build
```

The preview shows the exact generator command and overlay destinations; `--apply` calls the **official** CLI with `+next+fuma-docs-mdx+static`, `--no-git`, `--install`, and pnpm. Running the generator executes third-party code and installs packages **only after explicit user invocation**. Review its current documentation and lockfile before production use.

## What is included

- Official upstream Fumadocs app, CLI-generated with modern dependencies and local search defaults.
- `content/docs/docs-architecture/`: index, a tutorial, a how-to, reference, explanation and component showcase (Cards, Tabs, Steps, Callout).
- Native `meta.json` with optional page order; the installer adds the section to the root navigation only if the root config enumerates pages.
- `.agents/skills/docs-architect/SKILL.md`: copied from BAG's canonical skill with no automatic activation.
- `AGENTS.md` guidance for preserving user documentation and reviewing changes.

The generator refuses to touch a pre-existing target. Overlays are copied without overwriting existing scaffold files. A partial upstream failure is left in place for review, never silently removed.

## Integration and constraints

This kit is a **new-app starter**, not an in-place migration of a Fumadocs site. For an existing app, use [Docs Architect](../../skill-tree/skills/docs-architect/SKILL.md) with [Fumadocs Engineer](../../skill-tree/skills/fumadocs-engineer/SKILL.md) and create a migration plan instead. On GitHub Pages, configure any project `basePath` and static search per the [official static-export guide](https://www.fumadocs.dev/docs/deploying/static). No server-only search route or database is required for the default starter.

## Delegate

```text
Use https://github.com/tbachir/bag/tree/main/equipment/fumadocs-starter. Read BAG's AGENTS.md chain, this README, and docs-architect. Verify the target directory is new and inspect current create-fumadocs-app options. Show a dry-run plan and obtain approval before --apply. Initialize a static Fumadocs app, integrate the native templates, validate its typecheck/build/navigation and record any unverified checks.
```
