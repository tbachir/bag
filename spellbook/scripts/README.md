# 🪄 Scripts

Small, reviewed helpers runnable from the BAG root.

## Search the bag

```bash
node spellbook/scripts/find.mjs "skill"
node spellbook/scripts/find.mjs "agent"
```

Case-insensitive text search across `.md` files. Displays up to 40 matching lines with relative file paths. It skips common hidden/dependency directories and does not search secrets.

## Validate documentation

```bash
node spellbook/scripts/validate.mjs
```

Checks required RPG zones and local Markdown link targets. The check is lightweight and dependency-free; it does **not** validate external URLs or guarantee the correctness of docs, code, or security.

Requirements: Node.js 20+; runs on Windows, macOS, and Linux. Both scripts are read-only.
