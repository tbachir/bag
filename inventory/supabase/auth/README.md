# Supabase Auth

> A starting point for evaluating and integrating Supabase Auth into an existing application.

**Status:** documentation scaffold — this entry is **not** a claim of a verified, production-ready setup.

- Official source: https://supabase.com/auth
- Official documentation: https://supabase.com/docs/guides/auth
- Scope: authentication and session handling; authorization decisions also depend on your application and database architecture.

## Delegate — integrate into my project

Copy the following prompt from the workspace of your target project:

```text
Integrate Supabase Auth into my project using its existing architecture and security conventions.

BAG item: https://github.com/tbachir/bag/tree/main/inventory/supabase/auth

Read BAG's root AGENTS.md and the nested AGENTS.md files down to this item. Use its documentation and official references, inspect my project, ask only for missing decisions, implement the appropriate changes, and verify them.
```

## Before integrating

Review the existing identity provider, platform (native, web or server), session persistence, redirect URLs, user/account separation, RLS policies and deployment environment. Do not introduce duplicate auth layers without a justified need.

## Quickstart

Start with the [official guide](https://supabase.com/docs/guides/auth). Its details depend on the target runtime and SDK versions; inspect the real project before selecting setup steps.

## Recommended verification

Test sign-in/out, session refresh, account isolation, protected operations and appropriate failure conditions. For sensitive operations, verify server-side and database enforcement rather than only client navigation.

## Tutorial: a safe introduction

**Step 1.** Have an agent audit the current app before choosing an integration path.

### Copy prompt — audit the current app

```text
Audit my current authentication architecture and assess Supabase Auth compatibility. Do not change files.

BAG item: https://github.com/tbachir/bag/tree/main/inventory/supabase/auth

Read BAG's root and applicable nested AGENTS.md files and consult the item references. Report prerequisites, alternatives and risks.
```

**Step 2.** Once the requirements and approach are clear, return to the generic integration prompt above.

## Related resources

- [Inventory guidance](../../AGENTS.md)
- [BAG delegation protocol](../../../maps-and-guides/agent-delegation-protocol.md)
- [Inline prompts convention](../../../maps-and-guides/inline-prompts.md)
