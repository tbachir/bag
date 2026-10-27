# Task: setup

**Outcome:** Establish the minimum Supabase Auth configuration appropriate for the existing application's runtime.

## Preconditions
- Inspect existing auth provider, SDK versions and environment convention.
- Confirm who controls the Supabase project and what credentials are available.

## Guidance
- Use [official Supabase Auth docs](https://supabase.com/docs/guides/auth).
- Do not embed private credentials in the client or duplicate existing auth systems without agreement.

## Acceptance
- Configuration validation is demonstrable.
- No secrets committed and build/type checks run where possible.
