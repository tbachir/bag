# 📦 How to Publish the BAG CLI to npm

This guide describes how `@tbachir/bag` is packaged, validated, and published to the npm registry automatically via GitHub Actions or locally.

---

## 1. Automated Publication via GitHub Actions (Recommended)

The GitHub Actions workflow [`.github/workflows/publish-cli.yml`](../../.github/workflows/publish-cli.yml) automates testing, bundling, and publishing with npm provenance.

### Prerequisites (One-time setup)

1. Generate a **Classic Automation Token** on [npmjs.com](https://www.npmjs.com/):
   - Go to **Access Tokens** in your npm account settings (`https://www.npmjs.com/settings/<username>/tokens`).
   - Click **Generate New Token** → **Classic Token**.
   - Select the type: **Automation** (⚠️ **Important:** Do *not* select "Publish" or standard token; only "Automation" tokens bypass the 2FA one-time password prompt in headless CI).
2. Add the token to your GitHub repository secrets:
   - Go to your repository on GitHub: **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `NPM_TOKEN`
   - Secret: `<your-npm-automation-token>`

### Triggering a Release

You can trigger a release in any of three ways:

#### A. Git Tag (Standard Release)
Bump the version in `packages/cli/package.json`, commit, and push a git tag:
```bash
git tag v1.0.0
git push origin v1.0.0
```

#### B. GitHub Release
Create and publish a new Release from the GitHub web UI (e.g. `v1.0.0`). The workflow triggers on `release: published`.

#### C. Manual Trigger with Dry Run
1. Go to the **Actions** tab on GitHub.
2. Select **Publish BAG CLI to npm**.
3. Click **Run workflow**. You can check the `dry_run` option to simulate packaging without publishing.

---

## 2. Local Packaging & Dry Run

You can verify the entire packaging process locally before pushing:

```bash
# Dry run: verifies all 62 tests, link integrity, and simulates npm pack
node spellbook/scripts/publish-cli.mjs

# Manual direct publish (requires npm login)
node spellbook/scripts/publish-cli.mjs --apply
```

---

## 3. Package Invariants & Safety

- **Bundled Resources**: The CLI uses `spellbook/scripts/sync-cli.mjs` on `prepack` to bundle the canonical `catalog/`, `skills/`, `mcp/`, `recipes/`, `templates/`, and `packs/` directories directly into the npm tarball.
- **Zero Runtime Dependencies**: The package relies purely on standard Node.js APIs (`node:fs`, `node:path`, `node:child_process`).
- **Provenance**: Publications via GitHub Actions include cryptographic build provenance (`--provenance`) signed via OpenID Connect (OIDC).
