# Sketchbook interaction techniques

These notes describe general engineering ideas reported in [MengTo/sketchbook](https://github.com/MengTo/sketchbook), not copied implementation code. **Status: conceptual reference; not independently benchmarked.** Reviewed 2026-10-30.

## 1. Curved page turning

Rather than rotate one flat plane around a hinge, model a turning leaf as a sequence of narrow segments that follow a changing arc. Each segment can expose front/back faces and angle-responsive shading. Track pointer location, drag progress and release velocity; decide on release whether the page completes or springs back. Consider direction, clipping, z-order and hit testing across both halves.

**Acceptance checks:** multiple consecutive turns in both directions; rapid flick versus slow release; correct face visibility, shadows, stacking and clipping; no stuck intermediate state after pointer cancellation.

## 2. Independent magnifier

A circular lens can display an enlarged duplicate of content aligned to the sample point beneath the lens. Separate lens coordinates from transformations applied to the primary book so background parallax does not shift the lens. Mask enlarged content to the lens, and fade gracefully if it leaves the book. Handle overlap with a turning sheet.

**Acceptance checks:** aligned content at edges, under scrolling/resize and during parallax; no accidental page turn while dragging lens; no magnifier trap for touch or keyboard users.

## 3. Depth, opening motion and material feel

Combine subtle pointer-dependent parallax, textured surfaces, angle-dependent shading and a short initial leaf-riffle. Avoid unconditional animation loops. Ensure each effect supports the content rather than obscuring it.

**Acceptance checks:** responsive layout; no unintended layout shifts; smooth interaction on representative devices; no animation when reduced motion is requested.

## 4. Progressive interaction and accessibility

The upstream describes tap-to-turn on touch devices and omission of the pointer magnifier there, alongside a reduced-motion mode. For a new implementation, also provide clearly labeled previous/next buttons, visible focus, readable alt text/captions, an accessible index, and a safe fallback if transforms or pointer events are unavailable.

**Acceptance checks:** keyboard-only navigation, assistive-tech labels, screen rotation, mobile taps, reduced motion, and non-pointer fallback.

## Further reading

- [Upstream technical overview](https://github.com/MengTo/sketchbook#how-it-is-made)
- [Adaptation prompts](../prompts/README.md)
- [Repository summary](../README.md)

**Rights:** Inspiration and observation do not grant permission to copy code, images or bundled font files.
