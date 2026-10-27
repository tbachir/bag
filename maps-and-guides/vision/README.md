# 🔭 Vision — Pitch & specification

Why BAG exists, how to convince an audience in three minutes, and the technical specification detailed enough to rebuild BAG's target design. Both documents are written in French.

| Document | Audience | Content |
| --- | --- | --- |
| [Pitch (3 min)](pitch.md) | Any audience | Timed speaking script, preparation sheet, live demo and answers to likely objections |
| [Technical specification](specification.md) | Engineers, architects, agent integrators | Design invariants, data contracts, CLI, delegation, task composition, resource exposure, publication, threat model, current-vs-target gaps, rebuild plan and acceptance criteria |

The specification marks every requirement as **[Existant]** (implemented and verified on the stated date) or **[Cible]** (target behaviour, with its source or flagged as a proposal). When it disagrees with the JSON schemas, code or tests, those win; update the specification in the same change.

### 🇫🇷 En bref

Le **pitch** donne envie, la **spécification** permet de construire. Ensemble, ils décrivent le résultat final de BAG : un inventaire curé, lisible par les humains et les agents, délégable et équipable sous autorisation explicite.
