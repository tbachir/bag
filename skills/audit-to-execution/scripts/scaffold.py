#!/usr/bin/env python3
"""Create missing project-planning documents from bundled templates.

Safe defaults: dry run, no overwrites, no remote actions or dependencies.
"""
from __future__ import annotations

import argparse
from datetime import date
import os
from pathlib import Path
import re
import sys

SKILL_ROOT = Path(__file__).resolve().parent.parent
TEMPLATES = {
    "PROJECT-AUDIT.md": "docs/PROJECT-AUDIT.md",
    "PROJECT-SPEC.md": "docs/PROJECT-SPEC.md",
    "PROJECT-PLAN.md": "docs/PROJECT-PLAN.md",
    "ROADMAP.md": "ROADMAP.md",
    "TODO.md": "TODO.md",
    "SKILLS.md": "docs/SKILLS.md",
    "STATUS.md": "docs/STATUS.md",
    "DECISIONS.md": "docs/DECISIONS.md",
}


def run(root: Path, project: str, prefix: str, write: bool) -> tuple[int, int]:
    if not root.is_dir():
        raise ValueError(f"Target must be an existing directory: {root}")
    if not project.strip():
        raise ValueError("Project name must not be blank")
    if not re.fullmatch(r"[A-Z]{2,6}", prefix):
        raise ValueError("Prefix must contain 2–6 uppercase ASCII letters (e.g., PRJ)")
    # Preflight *all* output paths before writing anything. Exclusive file creation
    # alone does not stop a docs/ symlink from escaping the intended project.
    root = root.resolve()
    for relative_path in TEMPLATES.values():
        destination = root / relative_path
        if not destination.is_relative_to(root):
            raise ValueError(f"Destination outside project: {destination}")
        current = destination
        while current != root:
            if current.is_symlink():
                raise ValueError(f"Symlink destination ancestor rejected: {current}")
            current = current.parent
        if not destination.resolve(strict=False).is_relative_to(root):
            raise ValueError(f"Destination resolves outside project: {destination}")
    created = 0
    skipped = 0
    values = {"{{PROJECT}}": project, "{{PREFIX}}": prefix, "{{DATE}}": date.today().isoformat()}
    for template_name, relative_path in TEMPLATES.items():
        source = SKILL_ROOT / "assets" / template_name
        destination = root / relative_path
        if destination.exists():
            print(f"SKIP existing: {destination}")
            skipped += 1
            continue
        text = source.read_text(encoding="utf-8")
        for token, value in values.items():
            text = text.replace(token, value)
        if write:
            destination.parent.mkdir(parents=True, exist_ok=True)
            try:
                flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
                # Protect the final component against symlink substitution when
                # supported. A hostile concurrent parent rename still needs
                # sandbox/permissions isolation at the operating-system level.
                flags |= getattr(os, "O_NOFOLLOW", 0)
                fd = os.open(destination, flags, 0o644)
                with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as stream:
                    stream.write(text)
            except FileExistsError:
                print(f"SKIP race: {destination}")
                skipped += 1
                continue
            print(f"CREATED: {destination}")
        else:
            print(f"WOULD CREATE: {destination}")
        created += 1
    print(f"{'Created' if write else 'Would create'}: {created}; untouched existing: {skipped}")
    if write:
        print("Next: inspect current repo and replace placeholders with project-specific evidence.")
    else:
        print("Dry run only. Use --write after reviewing the planned paths.")
    return created, skipped


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="Existing project directory")
    parser.add_argument("--project", type=str, help="Project display name, defaults to root directory name")
    parser.add_argument("--prefix", type=str, default="PRJ", help="Uppercase task prefix, e.g. PRJ")
    parser.add_argument("--write", action="store_true", help="Create missing files, never overwrite")
    args = parser.parse_args()
    root = args.root.expanduser().resolve()
    try:
        run(root, args.project or root.name, args.prefix, args.write)
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
