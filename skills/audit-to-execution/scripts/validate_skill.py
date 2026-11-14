#!/usr/bin/env python3
"""Validate this portable Agent Skill without third-party dependencies."""
from __future__ import annotations

import re
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent


def validate_skill(root: Path = ROOT) -> list[str]:
    errors: list[str] = []
    path = root / "SKILL.md"
    if not path.exists():
        return ["SKILL.md missing"]
    content = path.read_text(encoding="utf-8")
    parts = content.split("---", 2)
    if len(parts) < 3 or parts[0].strip():
        return ["Expected YAML frontmatter between leading --- markers"]
    metadata = parts[1]
    name = re.search(r"^name:\s*(\S+)\s*$", metadata, re.M)
    description = re.search(r"^description:\s*(.+)\s*$", metadata, re.M)
    if not name or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name.group(1)) or len(name.group(1)) > 64:
        errors.append("Invalid lowercase kebab-case name (max 64 characters)")
    if not description or len(description.group(1)) > 1024:
        errors.append("Missing or too long description (max 1024 characters)")
    for match in re.finditer(r"\]\((\.?\.?/[\w./-]+(?:\.md)?)\)", parts[2]):
        relative = match.group(1)
        if not (root / relative).is_file():
            errors.append(f"Broken local link in SKILL.md: {relative}")
    expected = ["references", "assets", "examples", "scripts", "evals"]
    for name_ in expected:
        if not (root / name_).is_dir():
            errors.append(f"Missing directory: {name_}")
    return errors


if __name__ == "__main__":
    errors = validate_skill()
    if errors:
        for error in errors:
            print("FAIL:", error, file=sys.stderr)
        raise SystemExit(1)
    print("Skill package structure and local references: OK (lightweight validation)")
