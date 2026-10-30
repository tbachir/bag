# Animate Expo (Emil Kowalski)

**External skill reference** · reviewed 2026-10-30 · not installed or vendored.

- **Upstream source:** https://www.ui-skills.com/skills/emilkowalski/animate-expo
- **Repository:** https://github.com/emilkowalski/skills
- **Author:** Emil Kowalski
- **License:** MIT
- **Target stack:** React Native, Expo, React Native Reanimated, React Native Gesture Handler, Expo Router, `expo-haptics`
- **What it offers:** A disciplined decision framework for mobile motion engineering:
  1. **Affordance without hover:** Replaces hover assumptions with intentional press feedback, position, or passive states.
  2. **Two runtimes / thread isolation:** Directs animations onto the UI thread via Reanimated worklets, keeping the JavaScript thread unblocked.
  3. **Gesture handoff & physics:** Natural spring decay and physics-driven velocity preservation on drag/swipe releases.
  4. **Degradation & accessibility:** Respects system-level reduced-motion settings and ensures interactions remain robust under device constraints.
- **Caveats:** Requires compatible Expo / React Native native dependencies (`react-native-reanimated`, `react-native-gesture-handler`). Reference only; verify peer dependencies before adding packages.

## Delegate — evaluate and use

```text
Inspect the external skill reference for animate-expo (Emil Kowalski):
https://www.ui-skills.com/skills/emilkowalski/animate-expo

Follow my repository's AGENTS.md and inspect our existing Expo/React Native setup. Use its thread isolation rules (Reanimated worklets, UI thread execution) and gesture physics to design smooth mobile animations. Do not install new dependencies or modify native configuration without explicit approval.
```

## Related gear

- [Emil Kowalski / Skills](../../../inventory/repositories/emilkowalski-skills/README.md) — Source repository reference.
- [UI Skills MCP](../../../skill-tree/mcp/README.md) — Remote MCP server for querying UI skills dynamically.
- [UI Skills CLI](../../../equipment/tools/ui-skills/README.md) — Terminal client for the UI Skills registry.
