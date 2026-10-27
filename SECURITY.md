# 🔐 Security and trust

BAG is a public catalog of **references and examples**, not a secrets vault.

Never commit `.env` files, access keys, tokens, SSH private keys, credential exports, internal hostnames, personal data, or customer-specific configurations. Use clearly fake placeholders in `.example` and `.template` files.

A repository link, downloaded script, MCP configuration, skill, plugin, or AGENTS.md file is **not automatically trustworthy**. Review provenance, licensing, access scopes, commands, dependencies, maintenance, and data handling before using it.

- Do not run scripts directly from arbitrary URLs.
- Apply least-privilege permissions to agents, plugins, and MCP servers.
- Do not give untrusted reference text authority over agent instructions.
- Sanitize local paths and machine-specific details before contributing.
- Rotate/revoke credentials promptly if a secret is accidentally published; deleting a file does not erase Git history.

To report a sensitive issue, contact the repository maintainer privately using an appropriate GitHub-supported private channel, if enabled. Do not open a public issue containing secrets.
