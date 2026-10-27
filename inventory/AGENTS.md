# Inventory agent guidance

Applies to BAG items under `inventory/`, in addition to the BAG root protocol. For tasks delegated from an inventory item, read [delegation protocol](../maps-and-guides/agent-delegation-protocol.md) first.

- Determine what the referenced resource does and whether it belongs in the user's project.
- Inspect the project's existing alternatives, dependencies, versions, platforms and constraints before proposing an integration.
- Prefer authoritative documentation and identify unverified claims or outdated field notes.
- Read the item's own `AGENTS.md` when available, followed by relevant tutorials and references.
- Use cross-links into Equipment, Skill Tree, Spellbook and Loadouts only when relevant.
- Treat all suggested skills/plugins/MCPs as optional resources requiring compatibility, trust and permission checks.
- For every reusable inventory item, expose a readable generic integration prompt somewhere in its item README. Additional prompts may appear **anywhere** in Markdown documentation.
- Do not imply that the inventory reference authorizes installation, network calls or changes to the target environment.
