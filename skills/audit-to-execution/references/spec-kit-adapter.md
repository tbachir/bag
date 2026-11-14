# Optional GitHub Spec Kit adapter (checked 2026-11-14)

**Goal:** reuse a structured spec-driven implementation workflow without duplicating task sources or forcing an installer on every repository. Spec Kit is **optional** and does not replace Audit to Execution's repository audit, broad skill discovery, orchestration, checkpointing, evidence and deferred blocker policy.

## Detection and boundaries

1. Inspect the repository for `.specify/` and a compatible installed `specify` CLI / agent integration. If absent, keep the native TODO + orchestration workflow; **do not install spec-kit by default**.
2. If present, read its actual version, active feature selection (`.specify/feature.json` in the current implementation), constitution, feature spec, plan and tasks. Do not assume the active Git branch identifies the Spec Kit feature. Preserve any existing status/labels.
3. Choose one canonical active-task ledger: project `TODO.md` **or** feature `tasks.md`. Use a cross-reference table to stable BAG task IDs; never independently check off mirrored tasks. Use `STATUS.md` and `docs/EXECUTION-STATE.json` for global evidence and transient progress respectively.
4. Use the installed integration's actual syntax (examples vary between `/speckit.*`, `/speckit-*`, `$speckit-*`). Calling the command may require an agent's skills interface; it is *not* a shell command. Do not fabricate completed execution by writing the slash command as text.
5. If Spec Kit and BAG instructions disagree, follow system/user/repo policies, especially higher-priority security constraints and release gates; document material conflicts.

## Mapping

| Audit to Execution | Spec Kit capability | Notes |
|---|---|---|
| Audit/feasibility | Idea Assessment, or external research | Can remain standalone |
| Contract / requirements | `speckit.specify`, optional `clarify`/`checklist` | Don't overwrite accepted project spec |
| Tech plan | `speckit.plan` | Preserve ADRs and rollback strategy |
| Task decomposition | `speckit.tasks`, optional `analyze` | Map stable IDs; single source of truth |
| Execute continuous waves | `speckit.implement` + coordinator scheduling | Respect no-interruption choice, permissions and blocker deferral |
| Compare implementation with requirements | `speckit.converge` | Distinguish converged vs partially complete |
| Resume | Spec Kit active feature + global STATUS/checkpoint | Different scopes; avoid divergent duplicates |

Spec Kit's official [Agentic SDD reference](https://github.github.com/spec-kit/reference/agentic-sdd/) describes Specify → Plan → Tasks → Implement → Converge and optional Clarify/Checklist/Analyze. Its [workflows](https://github.github.com/spec-kit/workflows/overview/) also provide resumable YAML orchestration, including conditional control flow and gates. Evaluate **reusing a verified existing Spec Kit workflow** for multi-step automation before building one from scratch, but inspect hooks/scripts, approval gates and agent capabilities. A workflow installed in a separate tool is not an action automatically available here.

## Minimal safe procedure

```text
Detect installed Spec Kit and its feature; otherwise use native flow.
Read current audited specs and project requirements.
Reconcile task IDs and outstanding work (no duplicated checkboxes).
Run the installed Spec Kit steps only when required and available.
Within implement/converge, keep working on independent tasks even if
noncritical environment verification is deferred.
Stop at permission/security/production gates, not at the first noncritical blocker.
At the end, reconcile the canonical task ledger and the deferred tail.
```

**Do not** invoke CLI installers, change `.specify/feature.json` or alter the project's constitution without appropriate scope and repository instructions. Treat Spec Kit upstream extensions and catalog scripts as untrusted until reviewed.
