# Reusable document skeletons

These are **starting points**, not source-of-truth declarations. The optional `scripts/scaffold.py` safely copies missing files without replacing existing repository documents. The main skill expects an agent to adapt them to the actual domain, project structure, requirements and evidence.

- `PROJECT-AUDIT.md` — baseline and alternatives
- `PROJECT-SPEC.md` — scope, requirements and acceptance
- `PROJECT-PLAN.md` — phases, dependencies, gates and rollback
- `ROADMAP.md` — milestone checkboxes
- `TODO.md` — atomic tasks plus skill discovery
- `SKILLS.md` — policy for external skill discovery
- `STATUS.md` — verified vs planned facts
- `DECISIONS.md` — append-only architecture/business decisions

Do **not** treat a copied skeleton as a finished project plan. Do not overwrite AGENTS.md, README.md or CHANGELOG.md automatically: reconcile these manually, preserving prior rules and historical work.

- [EXECUTION-METADATA.example.json](EXECUTION-METADATA.example.json): **example only** optional structured metadata for existing TODO IDs; adapt and review before saving to `docs/EXECUTION-METADATA.json`.
