# Implementation plan — {{PROJECT}}

**Date:** {{DATE}} · **Status:** planning only, no implementation proof.

## Preparation and constraints

- Confirm project rules, interfaces, current branch/commit and available tools.
- Verify official documents when versions/prices/regulation matter.

## Phases

### Phase 1 — Audit and proof of feasibility ({{PREFIX}}-001)

**Deliverable:** verified baseline and experiment for the main uncertainty.

**Exit criterion:** evidence and documented architectural decision.

### Phase 2 — Minimal end-to-end workflow ({{PREFIX}}-002)

**Deliverable:** one functional vertical slice, preserving baseline behavior.

**Exit criterion:** acceptance test executed and rollback possible.

## Dependencies and parallel work

`{{PREFIX}}-001 → {{PREFIX}}-002`. Split sub-work only after interfaces are stable.

## Verification and risk management

State automatic checks, human review, negative tests, provenance and failure/rollback.

## Next executable task

`{{PREFIX}}-001.1` — inventory evidence and produce a versioned audit.


## Execution strategy (when authorized to implement)

- **Mode:** planning only / execute / run-all (select based on user request).
- **Wave selection:** honor dependency DAG and explicit non-overlap before delegation.
- **Continuous:** in run-all mode do not stop between ordinary waves; integrate, test, checkpoint, repeat until no safe feasible work remains.
- **Blocker policy:** defer noncritical environment/device/permission items to a final pass while continuing independent work; never skip required critical verification or permissions.
- **Checkpoint:** TODO checked + proof is completion; optional `docs/EXECUTION-STATE.json` tracks transient progress; update STATUS after tested checkpoints.
- **Optional Spec Kit:** reuse installed integration only when useful, with one canonical task ledger.
- **Final report:** actual deliverables, PASS/FAIL/NOT RUN and a small deferred tail with exact next actions.
