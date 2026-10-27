# Supabase Auth delegation guidance

In addition to the BAG root, inventory and Supabase instructions:

- First map existing login/session design, supported platforms, identity providers, server/client boundaries and authorization model.
- Distinguish Supabase Auth identity from app-specific user profile, organization and authorization records.
- For native apps, examine secure session storage and deep-link redirects; for web apps, check cookie/session and SSR patterns in the actual stack.
- Verify token handling, refresh/logout, cross-account isolation and the application's RLS strategy when applicable.
- Avoid creating a second auth system unless the user's architecture requires it.
- Consult the item's README and current upstream references, then document any version-dependent uncertainties.
