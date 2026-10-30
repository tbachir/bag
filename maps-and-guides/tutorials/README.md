# 🥾 Tutorials — Guided learning journeys

> **Diátaxis Role:** Tutorial · Learning-oriented, step-by-step journeys designed to help newcomers acquire confidence and achieve their first successes in BAG.

Tutorials are practical, hands-on learning experiences. Unlike [How-To guides](../README.md#how-to-guides) which solve specific problems for experienced users, tutorials teach fundamental skills by guiding you through concrete, repeatable actions from start to finish.

---

## Flagship Tutorial

Start here if you are new to the repository:

- **[🧭 Field Guide — Getting started with BAG](../getting-started.md)**  
  A hands-on quest taking you through finding resources, capturing raw loot, promoting an item into the seven zones, and equipping a curated loadout.

---

## Learning Tracks

### Track 1: Discover & Explore
Learn how BAG organizes developer resources and how to navigate without network dependencies.
1. **Understand the 7 RPG zones:** Read the [repository overview](../../README.md) to learn how tools, skills, scripts, and guides are segregated by purpose.
2. **Search locally:** Run local text searches via `node spellbook/scripts/find.mjs "<query>"` without sending queries over the network.
3. **Inspect catalog items:** Query machine manifests via `node spellbook/scripts/bag.mjs list --json` and `show <id> --json`.

### Track 2: Author Your First Item
Learn how to contribute a curated item card following BAG standards.
1. **Inbox an idea:** Document raw discoveries in [loot/inbox.md](../../loot/inbox.md) with origin URL and initial assessment.
2. **Scaffold an item card:** Copy the baseline template [templates/item.md](../../templates/item.md) into your target zone.
3. **Validate local links:** Run `node spellbook/scripts/validate.mjs` to ensure zero broken relative links.

### Track 3: Safe Loadout Exploration
Learn how to inspect and preview complex stacks without risk to your workspace.
1. **Explore loadout manifests:** Inspect curated loadout compositions with `node spellbook/scripts/bag.mjs loadouts --json`.
2. **Dry-run a file plan:** Generate a dry-run preview with `node spellbook/scripts/bag.mjs plan <id> --target <dir> --json` to verify changes before touching disk.
3. **Understand authorization boundaries:** Learn why BAG requires explicit user confirmation before applying any configuration.

---

## Next Steps

Once you have completed these learning journeys and understand the repository conventions, consult:
- **[How-To Guides](../README.md#how-to-guides):** Solve specific tasks such as authoring agent skills, writing inline prompts, or configuring task manifests.
- **[References](../references/README.md):** Look up schema definitions, evidence policies, and component APIs.
