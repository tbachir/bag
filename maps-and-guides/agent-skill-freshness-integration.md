# Codex & Claude Code: pre-use freshness gate

BAG distinguishes a **repository instruction** (an agent is asked to check) from an **enforced runtime hook** (a host blocks a tool call). This implementation supplies the former with a read-only checker; it does not claim universal execution enforcement.

## Codex

Codex reads repo-root `AGENTS.md` on startup. BAG's root rules require the 30-day check and Skill Maintainer. The skills in `skill-tree/skills` are curated references; Codex discovers native repository skills from `.agents/skills`, which BAG intentionally does not fill with duplicate skill bodies. To use a BAG skill in another project, install/copy an approved skill in that project's compatible directory after reviewing its provenance, or reference its URL explicitly. Preserve the freshness header and maintenance instructions.

Official: https://developers.openai.com/codex/guides/agents-md and https://developers.openai.com/codex/skills

## Claude Code

Claude Code reads project `CLAUDE.md`; BAG ships a short root shim linking to canonical `AGENTS.md`, freshness policy and Skill Maintainer. Avoid two competing rulebooks. Claude native skills and hooks are independent configuration mechanisms; a new skill in BAG does **not** automatically become a Claude skill or execute a hook.

Official: https://code.claude.com/docs/en/memory , https://code.claude.com/docs/en/skills and https://code.claude.com/docs/en/hooks

## Pre-use walkthrough

1. Identify the exact skill folder and read its SKILL.md metadata.
2. Run the read-only checker: `node spellbook/scripts/check-skill-freshness.mjs --json` (or examine the YAML manually).
3. If `policy: fast-changing` and older than the declared interval, follow `skill-tree/skills/skill-maintainer/SKILL.md` first. Verify official upstream sources and log a genuine review in the skill's CHANGELOG.md. If blocked, label advice unverified.
4. Resume the original skill only with up-to-date or explicitly qualified guidance; capture tests run and unverified assumptions.

## Non-goals and security

No client-global hook, remote code execution, permission escalation or automatic self-modification is installed. A hook that merely reads file age cannot establish that a recommendation is true. The authoritative enforcement for high-impact changes is independent tooling, tests and human approval. Implement host-specific runtime guards only after verifying event semantics, portability, threat model and tests on the actual client.

## Smoke checks

```powershell
node spellbook/scripts/check-skill-freshness.mjs --json
node spellbook/scripts/check-skill-freshness.mjs --strict
node spellbook/scripts/validate.mjs
```

The second command reports a nonzero exit if any tracked skill has expired; do not treat a stale *unrelated* skill as a prohibition on all work.
