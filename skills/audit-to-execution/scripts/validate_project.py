#!/usr/bin/env python3
"""Check roadmap/TODO identifiers, checkbox coverage and skills guidance.

Static cross-document validation only. This does NOT run project tests, confirm
URLs, audit candidate skills, or certify human approvals.
"""
from __future__ import annotations

import argparse
from pathlib import Path
import re
import sys


def validate(root: Path, prefix: str = "PRJ") -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    if not re.fullmatch(r"[A-Z]{2,6}", prefix):
        return ["Prefix must be 2–6 uppercase letters"], warnings
    todo_path = root / "TODO.md"
    roadmap_path = root / "ROADMAP.md"
    if not todo_path.is_file() or not roadmap_path.is_file():
        missing = [str(p.relative_to(root)) for p in (todo_path, roadmap_path) if not p.is_file()]
        return ["Missing required file(s): " + ", ".join(missing)], warnings
    todo = todo_path.read_text(encoding="utf-8")
    roadmap = roadmap_path.read_text(encoding="utf-8")
    plan_path = root / "docs" / "PROJECT-PLAN.md"
    plan = plan_path.read_text(encoding="utf-8") if plan_path.is_file() else ""
    if not plan:
        warnings.append("No docs/PROJECT-PLAN.md found (check whether the repo uses another plan name).")

    task_pattern = re.compile(r"^\s*- \[(?P<state>[ xX])\]\s+\*\*(?P<id>" + re.escape(prefix) + r"-\d{3}\.\d+)\*\*", re.M)
    milestones_pattern = re.compile(r"^\s*- \[(?P<state>[ xX])\]\s+\*\*(?P<id>" + re.escape(prefix) + r"-\d{3})\*\*", re.M)
    tasks = list(task_pattern.finditer(todo))
    milestones = list(milestones_pattern.finditer(roadmap))
    if not tasks:
        errors.append("No atomic checkbox tasks found in TODO.md (expected: - [ ] **PRJ-001.1** ...).")
    if not milestones:
        errors.append("No milestone checkbox IDs found in ROADMAP.md.")
    ids = [match.group("id") for match in tasks]
    for id_ in sorted(set(ids)):
        if ids.count(id_) > 1:
            errors.append(f"Duplicate TODO task ID: {id_}")
    m_ids = [match.group("id") for match in milestones]
    for id_ in sorted(set(m_ids)):
        if m_ids.count(id_) > 1:
            errors.append(f"Duplicate ROADMAP package ID: {id_}")

    for index, match in enumerate(tasks):
        stop = tasks[index + 1].start() if index + 1 < len(tasks) else len(todo)
        chunk = todo[match.start():stop]
        task_id = match.group("id")
        parent_id = task_id.split(".")[0]
        if parent_id not in m_ids:
            errors.append(f"{task_id}: missing parent milestone {parent_id} in ROADMAP.md")
        if not re.search(r"\*\*(?:Skills recommended|Skills recommandés)\s*:\*\*", chunk, re.I):
            errors.append(f"{task_id}: missing skills recommendation (or explicit none)")
        if not re.search(r"\*\*(?:Discovery|Découverte)\s*:\*\*", chunk, re.I):
            errors.append(f"{task_id}: missing task-specific discovery query")
        if not re.search(r"npx skills find\s+", chunk):
            warnings.append(f"{task_id}: discovery entry has no 'npx skills find' query")
        if match.group("state").lower() == "x":
            # An external SKILL link is NOT a completion reference. Look only in
            # an explicit proof field (or on the task line, excluding skill rows).
            proof_match = re.search(
                r"(?:\*\*)?(?:Proof when done|Evidence|Preuve(?: une fois terminée)?)\s*:(?:\*\*)?\s*([^\n]+)",
                chunk,
                re.I,
            )
            task_line = chunk.splitlines()[0]
            evidence = proof_match.group(1) if proof_match else task_line
            placeholder = re.search(r"\b(?:replace|pending|todo|to be provided|à fournir|à venir)\b", evidence, re.I)
            has_reference = re.search(r"https?://\S+|\b[0-9a-f]{7,40}\b", evidence, re.I)
            if placeholder or not has_reference:
                errors.append(f"{task_id}: checked task needs an explicit, non-placeholder evidence URL or commit hash")
        if plan and parent_id not in plan:
            warnings.append(f"{task_id}: parent milestone {parent_id} not mentioned in implementation plan")

    if plan:
        for id_ in m_ids:
            if id_ not in plan:
                warnings.append(f"ROADMAP milestone {id_} absent from implementation plan")
    for match in milestones:
        if match.group("state").lower() == "x":
            row = roadmap[match.start():roadmap.find("\n", match.start()) if "\n" in roadmap[match.start():] else len(roadmap)]
            if not re.search(r"https?://\S+|\b[0-9a-f]{7,40}\b", row, re.I):
                warnings.append(f"{match.group('id')}: milestone checked without an inline evidence reference")
    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--prefix", default="PRJ")
    args = parser.parse_args()
    root = args.root.expanduser().resolve()
    errors, warnings = validate(root, args.prefix)
    for item in warnings:
        print("WARN:", item)
    for item in errors:
        print("FAIL:", item, file=sys.stderr)
    if errors:
        print(f"Validation failed: {len(errors)} error(s), {len(warnings)} warning(s)", file=sys.stderr)
        return 1
    print(f"Structure OK: {len(warnings)} warning(s). This is not functional or human-review validation.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
