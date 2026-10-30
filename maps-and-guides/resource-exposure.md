# One source, many consumers — Resource exposure (v1)

> **Diátaxis Role:** Reference / Contract Specification · Technical specification for single-source multi-consumer resource exposure.

The BAG repository is both a knowledge base and a curated source of reusable assets. A skill, configuration, GitHub Actions workflow, script, or template can be:

- **Canonical**: one authoritative file or directory, maintained where it belongs.
- **Documented**: the docs site and BAG Markdown link to that source.
- **Consumed**: a project or agent uses it at a path its runtime actually recognizes.

These are separate relationships. An item appearing in BAG or Fumadocs is **not** automatically installed, activated, trusted, or synchronized to other projects.

## Resource descriptors

Use optional JSON descriptors in `catalog/exposures/<item-id>.json` when an item has more than one consumer or requires explicit exposure guidance. See [exposure schema](../catalog/schemas/exposure.schema.json) and [o2switch example](../catalog/exposures/o2switch-cloud.json).

`canonical` points to an existing tracked BAG resource. `docs` is a list of original files that should be linked/rendered, not copied. Consumers declare `kind`, `strategy`, `target`, `status`, and a human-readable caveat.

**This registry is declarative documentation only.** It is not an installer. BAG's existing catalog remains the authoritative `reference` versus `copy` install policy, and only its reviewed, explicitly mapped `copy` files may be equipped via the existing CLI with approval. Do not silently interpret `symlink`, `generate` or `native-reuse` entries as executable instructions.

## Strategies

| Strategy | Meaning | Caveat |
| --- | --- | --- |
| `reference` | Provide link to original | No runtime activation |
| `symlink` | Local consumer path references original folder/file | Agent tooling, OS and checkout support varies; not portable across machines |
| `copy` | Explicit, curated template installation | Diverges after copying; no silent overwrite; prefer existing `bag plan/equip` CLI |
| `generate` | Build an output from source | Only after a separately reviewed generator and clear ownership rules |
| `native-reuse` | Use upstream native reusable workflow / shared configuration features | Depends on the platform |

### Skills

Keep the **entire** skill package in `skill-tree/skills/<slug>/`: `SKILL.md`, references, scripts and assets. Use the path recognized by the relevant agent (e.g., `.agents/skills/<slug>` for supported tooling) and decide whether a symlink is appropriate. Do not assume all agents discover or trust symlinked skills, and do not confuse BAG's reference knowledge with the target project's active instructions.

Local PowerShell example, from BAG's root, **only for a developer who opts in**:

```powershell
New-Item -ItemType Directory -Force .agents/skills | Out-Null
$source = (Resolve-Path 'skill-tree/skills/o2switch-cloud').Path
$destination = Join-Path (Resolve-Path '.agents/skills').Path 'o2switch-cloud'
if (Test-Path $destination) { throw "Destination already exists: $destination" }
New-Item -ItemType SymbolicLink -Path $destination -Target $source
```

This creates a local link, not a portable Git dependency. On Windows it may require Developer Mode or elevated permissions. Verify the specific agent supports the path and follows symlinks; otherwise prefer documented manual install/copy.

### CI and configuration

A workflow under `.github/workflows/` is active for **this** repository; a workflow stored under `spellbook/` is merely a template unless explicitly referenced from the active location. GitHub Actions reusable workflows (`workflow_call`) are appropriate when GitHub-native reuse fits the use case. Never rely on filesystem symlinks for GitHub workflow discovery.

For Biome, editor configuration and similar resources, keep one curated reusable template, then opt into an explicitly declared target path and review project-specific values. Do not overwrite existing project settings. Distinguish *the configuration BAG uses itself* from *a template BAG offers others*.

### Fumadocs

The Fumadocs site is **a read view of BAG**, not a second authoring location. Initially link to canonical GitHub paths. Later a static build-time content adapter may read original `README.md`, `SKILL.md`, tutorials and other sources to render navigation/search. If transformation is required, outputs belong in generated/ignored directories, with their provenance preserved. Do not move original files to `apps/docs/content/docs` or maintain duplicates there.

### Verification

A good resource exposure change checks:
1. Every descriptor's `item` exists in `catalog/items`.
2. Every `canonical` and local `docs` path exists inside BAG and has no traversal or symlink ambiguity.
3. Consumer IDs are unique, all strategies and statuses are supported.
4. Active usage is evidenced in the consumer's actual runtime path; `documented` and `opt-in` do **not** claim runtime activation.
5. Existing BAG catalog validation and relevant tests still pass.

Run `node spellbook/scripts/validate-exposures.mjs` for the first three checks. The schema is descriptive; the script provides a dependency-free repository validator.
