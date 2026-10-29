# Expo · Production Foundations

A real, reviewable BAG loadout. The machine-readable composition is in [catalog/loadouts/expo-mobile-production.json](../../catalog/loadouts/expo-mobile-production.json), not duplicated here.

**Best for:** Expo/React Native + Next.js + Hono stacks, including the existing [mobile boilerplate](../../inventory/repositories/sb-mobile-app-boilerplate/README.md).

1. Audit the monorepo and current app functionality with Repository Auditor.
2. Reuse the boilerplate's proven patterns only where they match project reality.
3. Validate onboarding, accessibility, device behavior and offline/error UX.
4. Assess Supabase authentication only if the app needs it; keep migrations and RLS authoritative.
5. Review the composed prompt and run unit, device and E2E checks.

**Acceptance criteria:** No demo-only screens posing as live features; tested auth/session boundaries; stable build; clear rollback notes. **Limitations:** No automatic provisioning or deployment.

## Delegate — use this loadout

```text
Plan an integration of BAG loadout \"expo-mobile-production\" for my existing project. First inspect my actual repo, its AGENTS.md and the BAG loadout and included item sources. Resolve dependencies, conflicts and compatibility; produce a phased plan and then implement only explicitly authorized changes with evidence-based validation. Never copy or install unrelated resources just because they are listed.
```

[All loadouts](../README.md).
