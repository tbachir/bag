# Add to BAG — approval proposal

Use this compact outline in the **chat**, not as a form. Keep it readable on mobile; no large interview.

## Session synthesis

Two to four sentences: what the conversation established, decisions, constraints and reusable value. Say explicitly which earlier messages or files could not be accessed.

## Proposed capture

| Priority | Action | Candidate / BAG path | Why it belongs | Evidence / confidence |
| --- | --- | --- | --- | --- |
| P0 | Enrich | Existing item | Fills a real gap | Confirmed / source |
| P1 | Add skill | skill-tree/skills/example/ | Repeatable trigger and procedure | High / link |
| P2 | Reference | inventory/libraries/example/ | Optional tool | Requires upstream verification |

Typical selection: **3–7 substantive changes**, not exhaustive extraction. Any candidate that may contain sensitive info should be excluded rather than listed with details.

State separately:
- **Not captured:** duplicates, private/session-only information, unverified or low-value ideas.
- **Validation and merge:** which checks/PR gates must pass; whether the agent has GitHub write and merge permissions.
- **Out of scope:** external project edits, package installations and deployments unless explicitly part of the approved plan.

End with an unambiguous, one-line decision prompt:

**"Approve this capture plan (all items, selected items, or changes)?"**

Once approved, the user does **not** need to review the final PR. The agent is responsible for the diff, compatibility, CI, review comments and merge; if required approvals/permissions cannot be met, it reports the open PR as blocked rather than misrepresenting completion.

## Final completion report (after approval)

Include: PR link and merge SHA or precise blocker, canonical changed paths, source verification and checks actually run, items intentionally omitted, and a short example of how to reuse the new artifacts. No copied transcript.
