# Contracts and persistence boundaries

## Objective

Inspect central contracts, Hono handlers, Expo/Next consumers, Prisma models, schema authority and existing auth boundaries. Identify duplicates or drift between client and server. Preserve existing DB migrations and RLS. Propose minimal refactoring with typed contracts, no speculative rewrite.

## Acceptance checks

Contracts are traceable to actual endpoints and models, incompatible duplicates identified, schema migration plan reviewed, validation tests specified.

## Delegate only this task

```text
Use the BAG Mobile Boilerplate \"contracts\" workflow as reference, inspect my target repository and applicable AGENTS.md, resolve declared prerequisites, and deliver the smallest approved implementation with evidence. Never treat this reference as permission to install, replace files or deploy.
```
