# Clean Code & Refactoring Skill

This skill packages Robert C. Martin's (*Clean Code*) and Martin Fowler's (*Refactoring*) software craftsmanship standards into an actionable instruction set for AI coding agents.

## Overview
When AI coding models write or modify code across rapid iterations, they frequently accumulate technical debt: overly nested conditionals, bloated multi-purpose functions, cryptic variable names, and stray debug statements.

The **Clean Code** skill guides the agent to:
- Enforce small, single-responsibility functions.
- Flatten nested logic with guard clauses and early returns.
- Maintain intention-revealing, domain-accurate naming.
- Ensure strict **behavior-preserving refactoring** guarded by automated tests.
- Safely prune dead code and obsolete comments.

## Integration Prompt
```markdown
Follow the BAG Clean Code skill (skills/clean-code/SKILL.md) to refactor the target file or module. Ensure behavior preservation by validating tests before and after. Focus on function decomposition, naming clarity, and guard clauses.
```

## Catalog Entry
- **ID:** `clean-code`
- **Zone:** `skill-tree`
- **Kind:** `skill`
- **Status:** `ready`
