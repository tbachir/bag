# TODO — {{PROJECT}}

**Date:** {{DATE}} · **Not yet implemented.**

Roadmap: `ROADMAP.md` · Spec: `docs/PROJECT-SPEC.md` · Plan: `docs/PROJECT-PLAN.md` · Skills: `docs/SKILLS.md`

## {{PREFIX}}-001 — Feasibility

- [ ] **{{PREFIX}}-001.1** Inventory existing assets, constraints and source-of-truth records; acceptance: dated baseline with evidence.
  - **Priority:** P0
  - **Effort:** 2
  - **Impact:** 5
  - **Critical:** yes
  - **Parallel safe:** no
  - **Skills recommended:** Review available repository-audit and planning skills; select only after checking current source.
  - **Discovery:** `npx skills find "repository audit architecture alternatives"`.
  - **Proof when done:** replace with actual commit/document/verification link.
- [ ] **{{PREFIX}}-001.2** Compare approaches and run a targeted spike; acceptance: reproduced go/no-go decision.
  - **Depends on:** {{PREFIX}}-001.1
  - **Priority:** P0
  - **Effort:** 2
  - **Impact:** 5
  - **Critical:** yes
  - **Parallel safe:** no
  - **Skills recommended:** Review current architecture and testing skills; candidates are not presumed installed.
  - **Discovery:** `npx skills find "architecture decision spike integration testing"`.
  - **Proof when done:** replace with actual evidence.

## {{PREFIX}}-002 — Vertical slice

- [ ] **{{PREFIX}}-002.1** Implement one representative complete workflow; acceptance: tested and reversible.
  - **Depends on:** {{PREFIX}}-001.2
  - **Priority:** P1
  - **Effort:** 3
  - **Impact:** 5
  - **Critical:** no
  - **Parallel safe:** no
  - **Skills recommended:** Search for domain-specific implementation and verification skills.
  - **Discovery:** `npx skills find "end to end implementation verification"`.
  - **Proof when done:** replace with actual test/PR evidence.
