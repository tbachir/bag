# BAG Task Composer — from resource collection to targeted missions

> **Diátaxis Role:** How-To Guide · Recipe for declaring and composing composite missions using task manifests.

Drop Bag supports **item-level** selection and **sub-task-level** selection, with strict references and no automatic execution. Every BAG folder remains an item: `tasks/` is **not a reserved directory**. A folder may declare its own task manifest at any safe relative location via optional `bag.item.json` metadata.

## Choose a task manifest for any item

Add `taskManifest` to `bag.item.json` alongside existing metadata fields. For legacy items, a conventional `tasks/index.json` is still autodiscovered; no migration is necessary.

```text
inventory/my-tool/
  README.md
  bag.item.json
  workflows/
    README.md
    index.json
    audit.md
    migrate.md
    validate.md
```

```json
{"type":"repository","taskManifest":"workflows/index.json"}
```

```json
{
  "version":1,
  "item":"inventory/my-tool",
  "groups":[
    {"id":"audit","title":"Analyse","tasks":["inspect"],"groups":[
      {"id":"implementation","title":"Implement","tasks":["migrate","validate"]}
    ]}
  ],
  "tasks":{
    "inspect":{"title":"Inspect existing project","file":"audit.md","default":true},
    "migrate":{"title":"Integrate safely","file":"migrate.md","requires":["inspect"]},
    "validate":{"title":"Validate behavior","file":"validate.md","requires":["migrate"]}
  }
}
```

Task IDs are stable and unique **within an item**. Each file path is relative to the manifest file and must be a tracked Markdown document inside the same item. Groups may be nested to eight levels; every task may appear in only one group. Missing documents, path traversal, unknown IDs, cyclic `requires` chains or duplicate task assignments fail the docs build.

## What the user selects

- Selecting a resource normally means its full documented scope.
- Selecting one or more checkboxes changes that resource to a **custom task scope**.
- A checked task automatically includes every transitive `requires` prerequisite; optional `suggests` tasks only generate advisory notices.
- Conflicting tasks and incompatible resources are explicitly flagged, never silently substituted.
- The saved bag stores explicit IDs, **not** every derived prerequisite. After a manifest update, dependencies are recalculated against the current canonical manifest.
- Removing an item also clears its saved task choices. Clicking *Entire item* restores the full-item default.

The resulting prompt references the BAG item and **each selected task's canonical Markdown file**, and tells the external agent to inspect its target repository and applicable AGENTS.md before proceeding. This is neither an installer nor permission to change production environments.

## Intelligent resource relationships

Optional `relations` in an item's `bag.item.json` describes cross-item references using canonical **Markdown file paths**, not copied metadata:

```json
{
  "type":"library",
  "relations":{
    "requires":["inventory/libraries/shadcn-ui/README.md"],
    "alternatives":[],
    "conflicts":[],
    "complements":[]
  }
}
```

| Relation | Planner behavior |
| --- | --- |
| `requires` | Warns if the referenced resource is not in the bag; a user may add it |
| `alternatives` | Warns when two competing choices are selected |
| `conflicts` | Flags a hard incompatibility and instructs the agent to stop pending resolution |
| `complements` | Offers an optional related resource |

**Important:** These are editorial hints, **not proven compatibility checks**. Project-specific versions, operating systems, licenses, existing dependencies and existing implementations must still be audited by the target agent. Do not infer hard conflicts solely from shared tags or folder paths.

## Demonstrated examples

- [Supabase Auth task manifest](../inventory/supabase/auth/tasks/index.json) — legacy autodiscovery: setup, sessions, password, magic links, OAuth, RLS and account isolation
- [Mobile Boilerplate workflows](../inventory/repositories/sb-mobile-app-boilerplate/workflows/README.md) — opt-in non-reserved directory with nested task groups and release checks
- [Drop Bag Explorer](https://tbachir.github.io/bag/explore/) — persistent item/task selection, warnings and generated combined prompt

## Validation

The compiler and metadata validator reject invalid manifests and dangling resource relations during build. Tests in `apps/docs/scripts/task-manifest.test.mjs` and `generate.test.mjs` cover nested groups, prerequisites, cycles, traversal, and optional manifest paths. Playwright covers OAuth prerequisite closure, browser persistence and a missing resource dependency.

```bash
node spellbook/scripts/validate.mjs
node spellbook/scripts/bag.mjs validate
cd apps/docs
pnpm test:unit
pnpm build
pnpm types:check
pnpm test:e2e
```

PR-specific checks are defined in `.github/workflows/docs-preview.yml` and never publish Pages. The existing `docs.yml` publishes **only from main** after successful root and `/bag` static export checks.
