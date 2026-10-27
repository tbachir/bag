# Supabase inventory guidance

This scope adds Supabase-specific reading guidance to the BAG root and `inventory/AGENTS.md`.

- Confirm which Supabase products are actually needed: Auth, Postgres, RLS, Storage, Realtime or Edge Functions. Avoid assuming one implies the others.
- Inspect the existing auth provider, database policies, native/web session storage, server boundaries and migration constraints.
- Do not assume that an SDK choice or recommended architecture is correct for every target.
- Consult current official Supabase docs for security-sensitive or version-dependent statements.
- Never place service-role credentials in a public client. Evaluate authorization at the data layer, not merely in a UI.
- Treat migrations, destructive actions, privileged account configuration and remote database changes as explicitly governed operations.
- Read more-specific child instructions, when present.
