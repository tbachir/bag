# Safe reusable-project extraction checklist

**Purpose:** extract useful ideas from one application into another without importing hidden assumptions, proprietary source, credentials or operational hazards.

**Source provenance:** adapted as a general checklist after examining [SpecOS readiness rules](https://github.com/tbachir/specos/blob/main/rules/readiness.yaml) and the [mobile boilerplate customization runbook](https://github.com/tbachir/sb-mobile-app-boilerplate/blob/main/docs/runbooks/customization.md) on 2026-10-29. This is a newly authored checklist, **not a copy of either source**. Verify license and commit before reusing their actual code.

## Before selecting an asset

- [ ] Define the target task and desired benefit; search the target project and BAG for an existing equivalent.
- [ ] Identify upstream repository, exact commit, source paths, authorship and license/notice obligations.
- [ ] Identify dependencies, supported OS/runtime, secrets, external services and files modified.
- [ ] Choose a canonical home: BAG Inventory for a source reference, Equipment for configuration, Skill Tree for agent workflows, Spellbook for scripts, Maps & Guides for methodology, or Loadouts for links to proven items.
- [ ] Reject or retain as a reference if license, portability, security or actual usefulness remains unverified.

## Before changing the target project

- [ ] Define an explicit **plan/dry-run**, showing every file and side effect; avoid destructive defaults and overwrite.
- [ ] Separate *local configuration* from *remote provisioning* (credentials, billing, deployment and resource creation require separate approval).
- [ ] Assign owner, scope and acceptance criteria; resolve hard dependencies and blocking design questions.
- [ ] Check that generated artifacts do not become the canonical source and that all references point to existing artifacts.
- [ ] Preserve existing project conventions rather than forcing source-project frameworks or enterprise gates.

## Verification evidence

- [ ] Run installation/build/type checks when applicable and permitted.
- [ ] Test positive and negative paths, missing values, pre-existing files, invalid input and repeated runs.
- [ ] Document platform-specific behavior, including PowerShell/Windows when relevant.
- [ ] Run security and secrets scans, document limitations, and include attribution where required.
- [ ] Record tests **actually performed**, results, sources, review date, rollback and unresolved risks.

## Outcome labels

- **ready** — source, legal considerations, compatibility and required checks independently confirmed.
- **evaluating** — promising but missing evidence or tests.
- **reference-only** — useful knowledge, not safe/appropriate to copy.
- **rejected** — duplication, unacceptable risk, unclear rights or poor fit.

## Delegate

```text
Audit the candidate for reuse in my project using BAG's extraction checklist.
BAG item: https://github.com/tbachir/bag/tree/main/maps-and-guides/best-practices/safe-repository-extraction
Read BAG's root AGENTS.md and scoped rules, check skill freshness, inspect target project, source ref and permissions, compare existing solutions, then produce a reversible integration plan. Only apply explicitly authorized changes and report test evidence.
```

## Further primary references

- [GitHub: Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
- [OpenSSF Best Practices](https://www.bestpractices.dev/)
- [OWASP Software Component Verification Standard](https://owasp.org/www-project-software-component-verification-standard/)
