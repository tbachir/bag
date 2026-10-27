# BAG Task Composer

Each item may expose a `tasks/index.json` declaring stable task IDs, categories and relationships such as `requires`, `suggests`, and `conflicts`. Task bodies are independent Markdown files and remain readable directly from GitHub.

A prompt includes only the BAG item URL, task identifiers, and a reminder to read applicable AGENTS.md files. The external agent reads task documentation, evaluates prerequisites and implements the requested scope in the target project.

The [standalone prototype](../demo/task-composer.html) demonstrates checking tasks and copying the prompt. It is not an execution engine.

## Rules

- Generic full-item prompts remain available.
- Additional prompts can appear anywhere within tutorials.
- Required task dependencies are selected transitively.
- Suggested tasks are optional; incompatible combinations must be flagged.
- Stable IDs should not be renamed without migration guidance.
- Task documentation should specify intended result, prerequisites, references and acceptance checks.
- An agent must not treat the task manifest as permission to install tools or modify systems without authorization.
