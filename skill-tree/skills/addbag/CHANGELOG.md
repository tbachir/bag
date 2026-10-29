# Add to BAG — change history

## 2026-10-29 — Initial release

- Introduced a portable `addbag` skill with natural language trigger and client-specific invocation guidance.
- Required a one-shot proposal/approval boundary before any repository edits; enabled autonomous branch, PR, self-review and merge **only after** that approval and successful repository checks.
- Added a scored capture rubric, provenance and privacy filters, plan/final-report templates and clear fallback behavior when history or GitHub permissions are unavailable.
- Reference checks: [Agent Skills specification](https://agentskills.io/specification), [Skills CLI documentation](https://skills.sh/docs/cli), [OpenAI skill guidance](https://learn.chatgpt.com/docs/build-skills), [Claude Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview).
- Validation of this release: subject to repository PR checks; adding documentation to BAG does not by itself install the skill into any external agent.
