#!/usr/bin/env python3
"""No-shell, allowlisted quick checks before the expensive full CI pipeline.

Dry-run by default. Never installs dependencies or changes repository files.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import subprocess
import sys
import time

ALLOWED_CHECKS = ("typecheck", "lint", "format:check", "test")
ALLOWED_MANAGERS = {"pnpm", "npm", "yarn", "bun"}


def _read_package(root: Path) -> dict:
    path = root / "package.json"
    if path.is_symlink() or not path.is_file() or not path.resolve().is_relative_to(root.resolve()):
        raise ValueError("Preflight requires a regular package.json inside the project")
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not isinstance(data.get("scripts", {}), dict):
        raise ValueError("package.json scripts must be an object")
    return data


def _manager(package: dict, choice: str) -> str:
    if choice != "auto":
        if choice not in ALLOWED_MANAGERS:
            raise ValueError("Unsupported package manager")
        return choice
    configured = str(package.get("packageManager", "")).split("@", 1)[0]
    if configured not in ALLOWED_MANAGERS:
        raise ValueError("Unsupported/missing packageManager: choose --manager explicitly")
    return configured


def select_checks(package: dict, raw: str) -> list[str]:
    names = [name.strip() for name in raw.split(",")]
    if not names or any(x not in ALLOWED_CHECKS for x in names) or len(names) != len(set(names)):
        raise ValueError("Only unique typecheck,lint,format:check,test checks are allowed")
    scripts = package.get("scripts", {})
    return [name for name in names if name in scripts]


def preflight(root: Path, checks: str = ",".join(ALLOWED_CHECKS), manager: str = "auto",
              run: bool = False, max_seconds: int = 180, runner=None) -> dict:
    root = root.resolve()
    if type(max_seconds) is not int or not 1 <= max_seconds <= 1800:
        raise ValueError("max-seconds must be 1..1800")
    package = _read_package(root)
    resolved = _manager(package, manager)
    chosen = select_checks(package, checks)
    if not chosen:
        raise ValueError("No selected scripts exist in package.json; no false PASS")
    result: dict = {"mode": "run" if run else "preview_only", "manager": resolved,
                    "checks": chosen, "skippedAbsent": [x for x in checks.split(",") if x not in chosen],
                    "results": [], "passed": None, "elapsedSeconds": 0.0}
    if not run:
        return result
    runner = runner or subprocess.run
    started = time.monotonic()
    for name in chosen:
        remaining = max_seconds - (time.monotonic() - started)
        if remaining <= 0:
            result["results"].append({"check": name, "status": "budget-exhausted"})
            break
        argv = [resolved, "run", name] if resolved == "npm" else [resolved, name]
        try:
            cp = runner(argv, cwd=root, capture_output=True, text=True,
                        timeout=max(0.001, remaining), check=False)
            result["results"].append({"check": name, "status": "passed" if cp.returncode == 0 else "failed",
                                      "exitCode": cp.returncode,
                                      "outputTail": (cp.stdout + "\n" + cp.stderr)[-1600:] if cp.returncode else ""})
            if cp.returncode != 0:
                break
        except subprocess.TimeoutExpired:
            result["results"].append({"check": name, "status": "timeout"})
            break
        except FileNotFoundError as exc:
            result["results"].append({"check": name, "status": "tool-unavailable", "reason": str(exc)})
            break
    result["elapsedSeconds"] = round(time.monotonic() - started, 3)
    result["passed"] = (not result["skippedAbsent"] and len(result["results"]) == len(chosen)
                        and all(x["status"] == "passed" for x in result["results"]))
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--manager", choices=["auto", *sorted(ALLOWED_MANAGERS)], default="auto")
    parser.add_argument("--checks", default=",".join(ALLOWED_CHECKS))
    parser.add_argument("--max-seconds", type=int, default=180)
    parser.add_argument("--run", action="store_true", help="Explicitly execute allowlisted commands")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        outcome = preflight(args.root, args.checks, args.manager, args.run, args.max_seconds)
        print(json.dumps(outcome, indent=2, ensure_ascii=False))
        return 0 if outcome["passed"] is not False else 1
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
