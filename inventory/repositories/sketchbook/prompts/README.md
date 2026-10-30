# Sketchbook-inspired implementation prompts

Use these briefs for *original* work, not extraction or redistribution. Read [the item](../README.md) and [technique notes](../techniques/README.md) before using. Checked 2026-10-30.

## Prompt A — book-style gallery

> In my project, build an original, responsive book-style gallery where turning pages appear curved instead of hinging as flat panels. Read BAG root and applicable nested AGENTS.md through https://github.com/tbachir/bag/tree/main/inventory/repositories/sketchbook, plus its techniques. Audit the existing stack, animation libraries and accessibility patterns; prefer existing utilities. Define the page state machine (idle/dragging/settling), pointer capture/cancel behavior, velocity threshold and front/back stacking. Use my own copy and licensed assets. Provide accessible previous/next controls, keyboard navigation, touch input and reduced-motion behavior. Validate reversibility, resize and low-end performance. Do not copy MengTo/sketchbook code or art absent a license.

## Prompt B — accessible reading magnifier

> Design a draggable reading magnifier for my existing content, using https://github.com/tbachir/bag/tree/main/inventory/repositories/sketchbook as a conceptual reference. First read the BAG AGENTS.md chain, reference documentation and my local project instructions. Keep lens position independent of scene transforms; align enlarged content with the underlying sample point, mask overflow and handle edges. Offer a zoom alternative for keyboard and touch users, and respect reduced-motion settings. Use original implementation and assets; test zoom alignment under resize, scroll and pointer cancellation.

## Prompt C — tactile editorial interactions

> Review the original interaction ideas documented at https://github.com/tbachir/bag/tree/main/inventory/repositories/sketchbook after reading its root-to-item AGENTS.md chain. In my project, propose a restrained motion language using depth, shading, paper texture and an optional entrance animation. Prioritize existing design tokens, performance, accessibility, and interaction clarity. Implement only approved effects; use original or properly licensed artwork. Test mobile, keyboard, reduced-motion and static fallbacks.

## Recommended handoff

Ask the agent to deliver a small technical design, implementation plan, acceptance tests, license decisions, and rollback notes before any install or write operation. No prompt grants permission to modify the target project automatically.
