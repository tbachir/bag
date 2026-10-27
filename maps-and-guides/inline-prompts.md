# Writing reusable, inline delegation prompts

BAG prompts are content, not a website feature or an interview module. Any Markdown item, tutorial, troubleshooting note or reference can contain **multiple copyable prompts** exactly where the reader needs them.

## Design rules

1. **One mandatory generic prompt per reusable item** in its README: “Integrate/use this item in my current project.”
2. **Unlimited specialized prompts** anywhere in item docs, including between tutorial steps.
3. Every independently copyable prompt contains its own BAG item URL and instruction to read the root-to-item `AGENTS.md` chain; do not make users copy an earlier preamble.
4. Describe the outcome, not the entire runbook. Keep detailed rules in hierarchical `AGENTS.md` and linked docs.
5. Use standard Markdown headings and fenced `text` blocks so GitHub is first-class; a documentation website may add copy affordances.
6. An agent starts from the user's local target project, treats BAG as an external reference, and may need an explicit clone/fetch if no GitHub access is configured.
7. Don't embed secrets or claim that a third-party skill/plugin is safe or installed.

## Inline example within a tutorial

### Step 2 — Review the current authentication

Before migrating, ask your agent to map the existing auth flow.

#### Copy prompt — Audit first

```text
Audit my current authentication flow without editing code.

BAG item: https://github.com/tbachir/bag/tree/main/inventory/supabase/auth

Read BAG's root AGENTS.md and all applicable nested AGENTS.md down to the item. Use the item guides, identify existing dependencies and flag migration risks.
```

Then continue the tutorial's ordinary Markdown explanation.

#### Copy prompt — Implement the selected migration

```text
Implement the selected authentication migration with tests and rollback notes.

BAG item: https://github.com/tbachir/bag/tree/main/inventory/supabase/auth

Read BAG's root AGENTS.md and applicable nested AGENTS.md files, and use the item references. Preserve the target project's security and conventions.
```

> Example paths above illustrate the **future item layout**; check whether the item exists before distributing a prompt as production-ready.
