# Rangeen — palette previews on interfaces

Rangeen is a browser-based color exploration project for visualizing palettes on website examples and shadcn components. Its README describes palette generation using Material Design utilities.

- **Category:** Design resource / repository reference
- **Status:** evaluating — upstream description reviewed; interactive behavior and exports not tested
- **Official demo:** [Rangeen color picker](https://navnote.github.io/rangeen/)
- **Source and documentation:** [navnote/rangeen](https://github.com/navnote/rangeen)
- **License:** Unconfirmed; GitHub repository metadata reports no recognized license. Public source availability does not establish permission to reuse code or assets.
- **Last reviewed:** 2026-10-29
- **Compatibility:** Browser-based exploration; upstream references Material Design, Tailwind CSS and shadcn. No compatibility with current framework versions or native apps was validated.

## Why keep it?

Seeing colors in interface context can reveal a weak background, accent or text relationship sooner than looking at isolated swatches. Rangeen is useful when exploring a new palette or comparing an accent against an existing product direction.

## Practical use

1. Open the demo and compare candidate palettes on the available interface previews.
2. Record the chosen values and intended semantic roles in a separate project design note; an export format is not assumed here.
3. Check text contrast, focus visibility, states and light/dark behavior with the target project's own tools and representative screens.
4. Map the approved palette to existing tokens rather than treating a preview as a finished design system.

## Limitations and reuse boundary

The upstream README describes a weekend project. Repository metadata shows its last push in March 2024 at review time; current maintenance and dependency compatibility are unverified. The demo URL was reachable to the text retrieval tool but exposed no readable page content, so this review does not confirm that its controls work.

Use this card as a reference to evaluate the hosted tool. Clarify the upstream license before copying, distributing or integrating source code or assets. No Rangeen code is bundled in BAG, and no local installation recipe is endorsed here. Interface previews do not establish accessibility compliance.

## Sources and related resources

- [Upstream README](https://github.com/navnote/rangeen#readme) — stated purpose and component previews.
- [GitHub repository metadata](https://api.github.com/repos/navnote/rangeen) — license field and last-push information checked on the review date.
- [Identity Forge](../identity-forge/README.md) — explore broader visual systems including typography and component guidance.
- [DESIGN.md](../design-md/README.md) — document palette decisions and semantic roles.

## Delegate — evaluate a palette

```text
Use https://github.com/tbachir/bag/tree/main/inventory/resources/rangeen as a reference. Read BAG's root-to-item AGENTS.md chain and the item README, then inspect my project's current palette and token conventions. Evaluate whether Rangeen's hosted previews help compare candidate colors, record any unverified behavior, and propose semantic token mappings and contrast checks. Clarify licensing before reusing upstream code; do not install dependencies or overwrite styling without project authorization.
```

[Resource shelf](../README.md).
