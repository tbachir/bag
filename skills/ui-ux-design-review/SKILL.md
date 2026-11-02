---
name: ui-ux-design-review
description: Evaluate and improve interfaces, design systems, responsive behavior and accessibility using measurable UX criteria instead of subjective polish.
license: MIT
metadata:
  language: en
  reviewed_at: "2026-10-29"
  bag-freshness-policy: fast-changing
  bag-review-interval-days: "30"
  bag-last-verified: "2026-11-01"
  bag-update-skill: skill-maintainer
---

# UI/UX Design Review

Use for UI audits, design-system setup, page redesigns and component consistency work.

## Inspect first
Map users, tasks, screen sizes, existing tokens, components, themes, loading/error/empty states and the currently installed UI libraries. Take the existing product visual identity as a constraint unless the user requests a rebrand.

## Workflow
1. Trace core journeys and find friction: hierarchy, actions, navigation, feedback, information density, legibility, learnability and error recovery.
2. Define a lightweight system: color roles, type scale, spacing, radii, elevations, icon sizes, breakpoints, motion and component states. Prefer semantic tokens; avoid hard-coded one-off colors.
3. Check consistency between forms, tables, dialogs, menus, search, cards and bulk actions. Reuse existing primitives before adding dependencies.
4. Design responsive layouts and keyboard/touch flows, including long labels, no-data states, errors, and dark/light mode.
5. Apply WCAG 2.2 AA as an evaluation target where appropriate: keyboard operability, visible focus, contrast, labels, error identification, target size and reduced-motion preference. Never claim certification from inspection alone.
6. Define acceptance criteria and verify with screenshots at meaningful widths plus interaction tests when tools exist.
7. Distinguish design recommendations from code actually implemented. If implementation requested, keep changes scoped and report regressions/tests.

## Evidence and accessibility checks (reviewed 2026-11-01)

- Separate a heuristic observation from a verified usability defect: [Nielsen's heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) are diagnostic principles, not proof that a particular user journey fails. Prioritize findings by actual task impact and corroborate with users or interaction evidence where possible.
- For [WCAG 2.2](https://www.w3.org/TR/WCAG22/), map each accessibility finding to a specific applicable success criterion, level and test method. Include keyboard-only, zoom/reflow, focus visibility/obscuring, touch targets, error recovery and reduced-motion checks where relevant.
- Automated accessibility checks, screenshots and color contrast calculations are useful but insufficient for conformance claims. Record browser, viewport, assistive technology and manual checks actually used; mark untested behavior explicitly.

## Output
Prioritized findings with severity, user impact, evidence, proposed change, affected components and verification plan. Provide before/after examples only when grounded in real screens/code.

## References
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/WCAG22/quickref/
- https://www.nngroup.com/articles/ten-usability-heuristics/

