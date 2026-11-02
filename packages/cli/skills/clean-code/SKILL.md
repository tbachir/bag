---
name: clean-code
description: Apply Robert C. Martin's Clean Code principles, SOLID refactoring, small functions, clear naming, and behavior-preserving simplification to eliminate code smells and technical debt.
license: MIT
metadata:
  language: en
  bag-freshness-policy: standard
  bag-review-interval-days: "90"
  bag-last-verified: "2026-11-02"
---

# Clean Code & Refactoring

## Activate
Use when reviewing code, refactoring messy functions, eliminating code smells, pruning dead abstractions, simplifying control flow, or polishing code for production maintainability.

## Core Invariant: Strictly Behavior-Preserving
Refactoring transforms the internal structure of software without altering its external behavior.
- **Test Backstop:** Always run the project's automated test suite before and after any refactoring. If tests do not exist for the target module, write characterization tests before changing logic.
- **Incremental Steps:** Perform refactorings in small, discrete steps rather than wholesale rewrites.

---

## The Clean Code Rules

### 1. Meaningful Names
- **Intention-Revealing:** A variable, function, or class name should answer why it exists, what it does, and how it is used.
- **Avoid Disinformation:** Avoid names that conflict with technical types (e.g., `accountList` when it is a `Set` or `Map`).
- **Make Meaningful Distinctions:** Do not use noise words (`accountData`, `accountInfo`, `theAccount`). Distinguish by domain semantics.
- **Searchable & Pronounceable:** Avoid single-letter variables except for standard short loop counters (`i`, `j`). Avoid cryptic abbreviations (`genCustSub` → `generateCustomerSubscription`).
- **Parts of Speech:**
  - Classes, types, and variables: nouns or noun phrases (`Customer`, `OrderRepository`, `isActive`).
  - Functions and methods: verbs or verb phrases (`calculateTotal`, `sendInvoice`, `hasPermission`).

### 2. Small, Focused Functions
- **Do One Thing:** A function should do one thing, do it well, and do it only. If a function contains sections that can be extracted with meaningful names, extract them.
- **Length:** Strive for functions under 20 lines. Long functions almost always mix multiple levels of abstraction.
- **One Level of Abstraction per Function:** Keep statements in a function at the same conceptual level (e.g. high-level business orchestration vs. low-level string manipulation).
- **Function Arguments:**
  - Ideal: 0 (niladic) or 1 (monadic).
  - Acceptable: 2 (dyadic).
  - 3 or more (triadic/polyadic): group related parameters into an explicit options object, value object, or configuration struct.
  - Avoid flag arguments (boolean arguments that cause the function to do two different things). Split into two separate functions instead.
- **Command-Query Separation (CQS):** Functions should either do something (modify state) or answer something (return data), but never both.

### 3. Clean Control Flow & Guard Clauses
- **Guard Clauses & Early Returns:** Eliminate nested `if / else` ladders by handling preconditions, edge cases, and errors early with immediate returns or thrown errors.
- **Max Indentation Depth:** Aim for a maximum indentation level of 1 or 2. Deep nesting signals hidden complexity.
- **Avoid Nested Ternaries:** Never nest ternary operators; use `switch`, lookup tables, or separate helper functions.

### 4. Robust Error Handling
- **Prefer Exceptions over Error Codes:** Use structured, typed exceptions rather than returning sentinel values (`-1`, `false`, `null`).
- **Do Not Return or Pass `null`:** Avoid returning `null` where an empty collection, null-object pattern, or `Optional`/`Maybe` pattern can be used. Do not pass `null` into methods unless explicitly required by an external API contract.
- **Isolate `try/catch` Blocks:** Error handling is "one thing". Extract the body of a `try` block into a standalone function if it contains substantial logic.

### 5. Comment Discipline
- **Don't Comment Bad Code — Rewrite It:** Clear code is its own best documentation. Comments should not reiterate what the code obviously expresses.
- **Good Comments:** Explain *why* an unusual decision was made, link to external specifications, or provide legal disclaimers.
- **Delete Dead Code Immediately:** Never leave commented-out code blocks or obsolete debug logs (`console.log`, `print`) in production source files. Rely on version control (Git) for history.

---

## Systematic Refactoring Workflow

1. **Assess & Baseline:** Run the build and test suite. Confirm all existing tests pass before touching code.
2. **Identify Code Smells:** Locate long methods, large classes, duplicate logic (DRY violations), primitive obsession, shotgun surgery, or feature envy.
3. **Extract & Simplify:**
   - Extract small helper functions for sub-tasks.
   - Replace complex boolean conditions with explanatory variables or boolean functions.
   - Replace magic numbers and strings with named constants or enums.
   - Apply guard clauses to flatten nesting.
4. **Prune Dead Code:** Safely remove unreferenced variables, dead imports, and unused parameters.
5. **Re-verify:** Re-run the test suite and linters to verify zero regression and clean formatting.

---

## Target Project Integration Prompt
```markdown
Please review and refactor the specified module following the BAG Clean Code skill:
1. Verify that all existing unit tests pass before making changes.
2. Flatten deeply nested control flow using guard clauses and early returns.
3. Extract oversized functions into small, single-responsibility functions (< 20 lines).
4. Improve naming to be intention-revealing, removing noise words and cryptic abbreviations.
5. Eliminate dead code, commented-out code, and stray debug logs.
6. Re-run tests to verify strict behavior preservation and show a clear summary of changes.
```

## Definition of Done
- All modified functions are concise, readable, and have a single clear responsibility.
- No dead code, obsolete comments, or unneeded nesting levels remain.
- All pre-existing and new tests pass without regressions.

## References
- Robert C. Martin, *Clean Code: A Handbook of Agile Software Craftsmanship*, Prentice Hall.
- Martin Fowler, *Refactoring: Improving the Design of Existing Code*, Addison-Wesley.
