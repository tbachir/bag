# Mobile Boilerplate — Selectable workflows

This directory is a nested BAG item and documents a task composition for the canonical [Mobile App Boilerplate](../README.md). It is **not** a mandatory `tasks/` directory; the parent opts in via `bag.item.json.taskManifest = "workflows/index.json"`.

Tasks have independent source files. Selecting one in Drop Bag includes prerequisites transitively, and it never implies permission to run provisioning or release operations.

| Workflow | Why it matters |
| --- | --- |
| [Architecture audit](audit.md) | Decide what is reusable in the target project |
| [Contracts](contracts.md) | Confirm API and DB boundaries |
| [Branding](branding.md) | Reuse the customization CLI responsibly |
| [Authentication](auth.md) | Check sessions, roles, authorization and RLS |
| [Device tests](device-tests.md) | Verify real mobile flows, not only web demos |
| [Release](release.md) | Collect evidence before a rollout |
