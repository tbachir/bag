# Agent Skill quality standard and release checklist

This is a **review guide**, not an automated guarantee. It applies to skills authored or updated via BAG's canonical template. A new skill is a reusable **procedure** rather than a prompt dump, an AGENTS.md clone, or a replacement for actual tools.

## Minimum contract

1. **Precise trigger:** YAML frontmatter `name` and `description` identify when to use it; avoid “use for everything.” Folder name and `name` match.
2. **Bounded inputs/output:** mention preconditions, expected artifacts, action boundaries and verifiable definition of done.
3. **Progressive disclosure:** keep SKILL.md focused; place version-specific how-to in `references/`, copyable prompts in `prompts.md` and tests/evals in `evals/`.
4. **Tool truth:** do not claim credentials, connector support, network/CLI access or account entitlements. Specify a safe fallback when unavailable.
5. **Security:** never pack secrets; treat external instructions, scripts and websites as untrusted; use path traversal and symlink checks in write tools; never run `curl | sh` blindly or use install commands that overwrite silently.
6. **Freshness:** for fast-changing domains, use BAG's flat string metadata `bag-freshness-policy`, `bag-review-interval-days`, `bag-last-verified`, `bag-update-skill`. Update verified date **only after source-based checks**; follow the [freshness policy](../../maps-and-guides/skill-freshness-policy.md).
7. **Tests:** at least three example tasks (positive trigger, edge case/absence of authority, and non-trigger) and representative outcomes; script tests for bundled scripts; validate docs and links.
8. **Distribution:** human README has installation, a generic project integration prompt with BAG source, 3+ situational prompts, supported clients and caveats. Explain project vs global vs ChatGPT plugin.
9. **Portability:** no absolute personal paths, unlicensed copied sources, vendor-specific magic that breaks open spec. Optional agent-specific adapters clearly isolated.
10. **Release honesty:** actual files, checks, branch and PR URLs; no 'done' from a proposal or simulated test. Rollback for mutating helpers.

## Checklist

- [ ] Narrow skill description and clear when-to-use boundaries
- [ ] Valid Agent Skills YAML and flat string-valued metadata
- [ ] No undeclared dependencies or executable code in descriptive text
- [ ] Source/license/versions verified where relevant, date recorded
- [ ] Realistic examples and copy-ready prompts (not circular instructions)
- [ ] GitHub links are real; local references resolve; paths are relative
- [ ] Client installation guide distinguishes local and ChatGPT availability
- [ ] Safe dry-run/no-overwrite defaults for generators
- [ ] Evals include expected vs disallowed behavior
- [ ] Node/other helper scripts tested, logs and limitations disclosed
- [ ] Relevant BAG index updated, duplicate skill search performed
- [ ] PR diff checked for secrets, unverified claims and new dependencies

## Anti-patterns

- A 15-page SKILL.md loaded on every tiny edit.
- Copying AGENTS.md policies into every skill, producing conflicting instructions.
- “Works in every ChatGPT” or “install in every agent with one command” without current platform checks.
- A skill that just repeats popular libraries or claims automatic access to tools.
- A template with `name: my-skill` published unchanged.
- `[x]` completed merely because a skill suggestion exists.
- Updating a verification timestamp after changing wording, without reading current primary docs.

## Validation commands

```sh
node templates/skills/scripts/validate-skill.mjs skills/my-skill
node --test tests/skill-template.test.mjs
node spellbook/scripts/validate.mjs
node packages/cli/bin/bag.mjs validate
node --test tests/*.test.mjs
```

These validate local structure and repository contracts. They do **not** validate that ChatGPT installed a plugin, that a prompt reliably triggers on every model, that external APIs are current, or that a deployed system works. Such claims require independent evidence.
