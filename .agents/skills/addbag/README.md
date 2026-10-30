# Add to BAG — capitalize a session with one command

Use **`add to bag`**, **`ajoute à BAG`**, **`capitalise cette conversation`**, or invoke **`addbag`** through a compatible installed skill client.

The [skill definition](SKILL.md) turns an accessible discussion into a *proposal* to update [BAG](https://github.com/tbachir/bag). It selects reusable knowledge and may recommend a library entry, component reference, practical guide, reusable prompt, skill, template, artifact reference or composed loadout. It searches for duplicates first and never republishes chat history wholesale.

## One approval, then autonomous publication

1. **Call it:** "add to bag". The agent reads the **accessible** conversation and available evidence and proposes a small, ranked set of changes with destination paths.
2. **Approve once:** reply "validé" or approve selected items. This permits the approved BAG edits, a feature branch, a PR, self-review, quality checks, and merge without a second manual review.
3. **Get the result:** the agent supplies the merged PR link and item links. If required CI/review/permissions block it, the PR stays open with a precise status.

The first invocation is **read-only**. "No manual review" means no second discretionary approval; it **never** overrides required GitHub checks, branch protections, or unresolved blocking feedback.

## Installation and invocation

An item merely present in BAG is **not automatically loaded** by another assistant.

| Client | Installation | Invocation |
| --- | --- | --- |
| [Skills CLI](https://skills.sh/docs/cli) | `npx skills add tbachir/bag --skill addbag` | Agent-specific |
| Claude Code | Use Skills CLI targeting Claude Code, or copy this folder to `.claude/skills/addbag/` or `~/.claude/skills/addbag/` | `/addbag` or phrase "add to bag" |
| Codex CLI / IDE | Use Skills CLI targeting Codex, or copy this folder to `.agents/skills/addbag/` or `~/.agents/skills/addbag/` | `$addbag`, or natural-language request |
| ChatGPT with custom skills | Import [generated skill ZIP](https://tbachir.github.io/bag/files/skills/addbag.zip) **if your client supports it**, or use the content as reference | Select `@addbag` where available, or ask naturally |

A project-scoped skill works only in that project; for calling it in **any** repository, install in the user's global skills directory when supported. Do not duplicate files between BAG and the consumer after setting up a preferred installation workflow.

To write or merge the result, the agent must actually have GitHub permissions for **tbachir/bag**. Chat history APIs, memory and cross-chat access vary by client; if earlier messages cannot be read, provide a conversation export or short summary. The skill must not pretend to have reconstructed inaccessible material.

## What it chooses

- Enrich an existing BAG item before creating a duplicate.
- Add an upstream link and compatibility caveats for a useful component/library.
- Add a reusable skill for an agent method, task instructions for a repeatable implementation, or a loadout for a coherent multi-resource setup.
- Keep unverified discoveries in Loot; leave sensitive/private or low-reuse content out.

## Example prompts

**Summarize and propose:**

```text
add to bag. Review the available history of this session, extract only reusable development decisions, tested recipes, worthwhile tools and patterns, and propose a short curation plan. Don't change BAG until I approve it.
```

**Authorize the plan once:**

```text
Validé pour les éléments proposés. Exécute le plan approuvé dans tbachir/bag, vérifie tes changements, corrige les retours de revue et fusionne la PR une fois les contrôles obligatoires réussis. Pas besoin de me demander une seconde revue.
```

See [the capture rubric](references/curation-rubric.md) and [the approval plan template](references/plan-template.md).

## Safety and caveats

Never store private chat transcripts, secrets, credentials, confidential project details, private deployment URLs or sensitive personal data. Treat other agents' past claims as unverified until corroborated. Missing repository write access, required human approval, failed CI, unavailable history, or license restrictions can prevent autonomous completion; report blockers without bypassing them.

**Delegate:** Read [BAG's root AGENTS.md](../../../AGENTS.md) and this skill's [SKILL.md](SKILL.md); inspect actual accessible conversation material, propose the capture plan, and wait for explicit approval before any BAG writes.
