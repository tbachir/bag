# Sketchbook — immersive page-turn reference

- **Category:** inventory / repository / interactive UI inspiration
- **Status:** evaluating (source reviewed; code and asset reuse rights unverified)
- **Upstream:** https://github.com/MengTo/sketchbook
- **Live demonstration:** https://mengto.com
- **License:** No license declaration confirmed in upstream repository; assume **all rights reserved** for code and artwork pending explicit permission.
- **Last reviewed:** 2026-10-30
- **Compatibility:** Modern browser; static HTML/CSS/JavaScript; no build step or runtime package dependencies.

## Why keep it?

A compact reference for tactile, book-like web experiences: a bending page-turn mechanism, movable magnifier, depth/parallax, opening riffle and touch/reduced-motion fallbacks. It demonstrates how a highly detailed interaction can be delivered without a framework.

## What is implemented upstream?

The source README describes nine watercolor spreads of Singapore, an index, drag and velocity-based page turning, nested strips with two faces and gradient lighting, a draggable magnifier rendering a scaled copy of the book, pointer parallax, and an opening animation. Its layout, styles and interactions are in `index.html`; local artwork and fonts live in `sketchbook/`. Do not interpret this summary as a tested or reusable library API.

## Explore

- [Interaction techniques](techniques/README.md) — implementation concepts and verification questions
- [Adaptation prompts](prompts/README.md) — independent clean-room briefs for agents
- [Upstream README](https://github.com/MengTo/sketchbook/blob/main/README.md)
- [Upstream implementation](https://github.com/MengTo/sketchbook/blob/main/index.html)

## Appropriate uses

Inspiration for editorial websites, learning experiences, interactive portfolios, galleries and storytelling. Design a new interaction with equivalent behavior and original assets, rather than copying upstream implementation without a confirmed license.

## Trade-offs and safety

The custom geometry and magnifier increase rendering complexity, input edge cases and accessibility requirements. Validate touch, keyboard alternative navigation, readable text, performance on low-end devices and `prefers-reduced-motion`. The upstream says fonts and generated artwork are bundled; **do not redistribute them** based on repository visibility alone. No files are vendored into BAG.

## Delegate

> Use the Sketchbook reference at https://github.com/tbachir/bag/tree/main/inventory/repositories/sketchbook in my project. First read BAG root AGENTS.md and applicable nested AGENTS.md through this item, then read the item, technique and prompt documentation. Inspect my project's stack and existing motion/accessibility solutions, propose a clean-room implementation using original assets, verify licensing and ask before installing dependencies or changing files. Do not copy upstream source or assets unless reuse rights are established.
