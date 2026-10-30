# 🗺️ Maps & Guides — Find your way

Instructional documentation, practical workflows, architectural notes, and canonical references structured around the **Diátaxis framework**.

BAG separates technical documentation by reader intent across four complementary quadrants:

```text
                  PRACTICAL (Action-oriented)
                             │
         TUTORIALS           │         HOW-TO GUIDES
     (Learning-oriented)     │      (Task / Problem-oriented)
     • Getting Started       │      • Authoring Items & Skills
     • Learning Tracks       │      • Catalog & Loadouts CLI
                             │      • Agent Delegation Protocol
                             │      • Inline Prompts Conventions
                             │      • Task Composer & Missions
─────────────────────────────┼─────────────────────────────
                             │
         EXPLANATION         │          REFERENCE
    (Understanding-oriented) │    (Information / Lookup-oriented)
     • Vision & Specification│      • Reference Index & Standards
     • Best Practices        │      • Skill Freshness Policy
     • Fumadocs Architecture │      • Resource Exposure Contract
                             │      • UI Components & Templates
                             │
                THEORETICAL (Knowledge-oriented)
```

---

## Tutorials

Lessons designed to take newcomers from their first look to their first practical success in BAG.

| Tutorial | Purpose | Target Audience |
| :--- | :--- | :--- |
| [Getting started](getting-started.md) | Step-by-step quests: discover resources, record loot, promote items, and equip loadouts | New developers & contributors |
| [Tutorial tracks](tutorials/README.md) | Guided onboarding journeys for developers, curators, and AI agents | Developers, curators, agent integrators |

---

## How-To Guides

Goal-driven recipes and procedures to solve specific real-world tasks.

| Guide | Goal | Key Workflow |
| :--- | :--- | :--- |
| [Authoring items & skills](bag-authoring-skills.md) | Create, structure, and document new BAG items, libraries, and skills | Reference authoring skills |
| [Intelligent catalog & loadouts](catalog-and-loadouts.md) | Query JSON manifests, preview safe file plans, and equip loadouts | `bag search`, `plan`, `equip` |
| [Agent delegation protocol](agent-delegation-protocol.md) | Delegate target-project missions to AI coding agents via BAG references | Root-to-item `AGENTS.md` reading |
| [Writing inline prompts](inline-prompts.md) | Compose bounded, reproducible delegation prompts directly in item cards | Standard prompt template & conventions |
| [Task Composer & missions](task-composer.md) | Structure multi-step missions with nested task index manifests | Composite task orchestration |

---

## Reference

Authoritative specifications, policies, contracts, and schema definitions.

| Reference | Scope | Contract / Authority |
| :--- | :--- | :--- |
| [Reference index](references/README.md) | Central registry of BAG specifications, schemas, and upstream standards | Master technical lookup |
| [Skill freshness & evidence policy](skill-freshness-policy.md) | Evidence requirements, review intervals (30-day default), and refresh protocol | Fast-changing skills lifecycle |
| [Resource exposure specification](resource-exposure.md) | Multi-consumer single-source contract for skills, plugins, and web docs | Single-source asset exposure |
| [UI component library & templates](ui/README.md) | Fumadocs UI Workbench primitives, cards, and template schemas | UI components & item templates |

---

## Explanation

Architectural context, design philosophy, invariants, and trade-offs.

| Explanation | Focus | Highlights |
| :--- | :--- | :--- |
| [Best practices & invariants](best-practices/README.md) | Core architectural principles: single home, dry-run first, static publishing | Design rules & trade-offs |
| [Fumadocs inventory explorer](fumadocs-inventory-explorer.md) | Architecture of the static Fumadocs engine, Drop Bag, and deterministic compiler | Static-first documentation engine |
| [Vision, pitch & specification](vision/README.md) | 3-minute executive pitch and comprehensive technical specification (French) | Architectural targets & roadmap |

---

## Contribution & Authoring Invariants

1. **Diátaxis clarity:** Identify whether your document is a **Tutorial** (learning), a **How-To** (solving a task), a **Reference** (factual lookup), or an **Explanation** (clarifying concepts).
2. **Reproducibility:** Code examples must be strictly reproducible, include valid language tags, and specify required environment prerequisites.
3. **Explicit authorization:** Guidance in BAG is reference material. Never execute commands or install dependencies without explicit user confirmation.
