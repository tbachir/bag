#!/usr/bin/env python3
"""Read-only dependency scheduler plus explicit, safe execution checkpoint updates.

Does NOT implement tasks, run arbitrary commands, merge PRs or certify acceptance.
The coding agent follows SKILL.md and reports changes; this script decides which
independent tasks are ready and which environment blockers can be deferred.
"""
from __future__ import annotations

import argparse
from dataclasses import dataclass, field
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import sys
import tempfile

SCHEMA_VERSION = 1
TASK_RE = re.compile(r'^\s*- \[(?P<done>[ xX])\]\s+\*\*(?P<id>[A-Z]{2,6}-\d{3}\.\d+)\*\*(?P<title>[^\n]*)$', re.M)
META_RE = re.compile(r'^\s*(?:-\s*)?\*\*(?P<key>[^*]+):\*\*\s*(?P<value>.*)$', re.M)
ID_RE = re.compile(r'\b[A-Z]{2,6}-\d{3}\.\d+\b')


@dataclass
class Task:
    id: str
    title: str
    done: bool
    order: int
    dependencies: set[str] = field(default_factory=set)
    files: set[str] = field(default_factory=set)
    environment: set[str] = field(default_factory=set)
    priority: int = 2
    effort: int = 1
    impact: int = 3
    critical: bool = False
    parallel_safe: bool = False


def _field(meta: dict[str, str], *names: str) -> str:
    for name in names:
        if name in meta:
            return meta[name]
    return ""


def _tokens(value: str) -> set[str]:
    if not value.strip() or value.strip().lower() in {"none", "aucun", "n/a", "-"}:
        return set()
    return {x.strip().strip('`') for x in re.split(r'[,;]', value) if x.strip()}


def _integer(value: str, minimum: int, maximum: int, default: int) -> int:
    if not value:
        return default
    try:
        n = int(value)
    except ValueError as exc:
        raise ValueError(f"Invalid integer metadata {value!r}") from exc
    if not minimum <= n <= maximum:
        raise ValueError(f"Metadata {n} outside [{minimum}, {maximum}]")
    return n


def read_tasks(root: Path) -> dict[str, Task]:
    path = root / "TODO.md"
    if not path.is_file():
        raise ValueError(f"Missing task source: {path}")
    contents = path.read_text(encoding="utf-8")
    found = list(TASK_RE.finditer(contents))
    if not found:
        raise ValueError("No actionable checkbox task IDs in TODO.md")
    tasks: dict[str, Task] = {}
    for i, match in enumerate(found):
        ident = match.group("id")
        if ident in tasks:
            raise ValueError(f"Duplicate task ID: {ident}")
        stop = found[i + 1].start() if i + 1 < len(found) else len(contents)
        # Avoid consuming unrelated new headings or parent list rows.
        part = contents[match.end():stop].split("\n## ", 1)[0]
        meta = {m.group("key").strip().lower(): m.group("value").strip() for m in META_RE.finditer(part)}
        dep = _field(meta, "depends on", "dependencies", "dépendances")
        files = _field(meta, "files", "owned files", "file ownership", "fichiers")
        env = _field(meta, "environment", "requires environment", "environnement")
        priority = _field(meta, "priority", "priorité").upper()
        if priority and priority not in {"P0", "P1", "P2", "P3"}:
            raise ValueError(f"{ident}: priority must be P0/P1/P2/P3")
        parallel = _field(meta, "parallel safe", "parallèle sûr").lower()
        if parallel and parallel not in {"yes", "no", "true", "false", "oui", "non"}:
            raise ValueError(f"{ident}: parallel safe must be yes/no")
        critical = _field(meta, "critical", "critique").lower()
        if critical and critical not in {"yes", "no", "true", "false", "oui", "non"}:
            raise ValueError(f"{ident}: critical must be yes/no")
        tasks[ident] = Task(
            id=ident, title=match.group("title").strip(), done=match.group("done").lower() == "x", order=i,
            dependencies=set(ID_RE.findall(dep)), files=_tokens(files), environment=_tokens(env),
            priority=int(priority[1]) if priority else 2,
            effort=_integer(_field(meta, "effort", "effort relatif"), 1, 5, 1),
            impact=_integer(_field(meta, "impact", "valeur"), 1, 5, 3),
            critical=critical in {"yes", "true", "oui"},
            parallel_safe=parallel in {"yes", "true", "oui"},
        )
    for task in tasks.values():
        for dependency in task.dependencies:
            if dependency not in tasks:
                raise ValueError(f"{task.id}: unknown prerequisite {dependency}")
            if dependency == task.id:
                raise ValueError(f"{task.id}: self dependency")
    # Detect cycles even when unrelated to the immediate wave.
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(ident: str) -> None:
        if ident in visiting:
            raise ValueError(f"Dependency cycle involving {ident}")
        if ident in visited:
            return
        visiting.add(ident)
        for dep in tasks[ident].dependencies:
            visit(dep)
        visiting.remove(ident)
        visited.add(ident)

    for ident in tasks:
        visit(ident)
    return tasks


def _state_path(root: Path) -> Path:
    root = root.resolve()
    target = root / "docs" / "EXECUTION-STATE.json"
    for part in (target, target.parent):
        if part.is_symlink() or not part.resolve(strict=False).is_relative_to(root):
            raise ValueError(f"Unsafe state path: {part}")
    return target


def read_state(root: Path) -> dict:
    path = _state_path(root)
    if not path.exists():
        return {"schemaVersion": SCHEMA_VERSION, "tasks": {}, "history": []}
    try:
        state = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"Invalid execution state {path}: {exc}") from exc
    if not isinstance(state, dict) or state.get("schemaVersion") != SCHEMA_VERSION or not isinstance(state.get("tasks"), dict):
        raise ValueError("Unsupported/malformed execution state; do not overwrite")
    return state


def _save_state(root: Path, state: dict) -> None:
    path = _state_path(root)
    path.parent.mkdir(parents=True, exist_ok=True)
    # Atomic replacement with no symlinked parent; if another process can rename
    # a parent concurrently, use OS/sandbox isolation and a repo lock.
    fd, temp = tempfile.mkstemp(prefix=".execution-", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as stream:
            json.dump(state, stream, indent=2, ensure_ascii=False, sort_keys=True)
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        _state_path(root)
        os.replace(temp, path)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def record(root: Path, ident: str, status: str, reason: str = "", category: str = "", ref: str = "", max_attempts: int = 2) -> dict:
    if not 1 <= max_attempts <= 20:
        raise ValueError("max_attempts must be 1..20")
    tasks = read_tasks(root)
    if ident not in tasks:
        raise ValueError(f"Unknown task {ident}")
    if status not in {"in_progress", "deferred", "blocked", "failed", "ready"}:
        raise ValueError("Only progress statuses allowed; mark verified done in TODO.md with evidence")
    if status in {"deferred", "blocked", "failed"} and not reason.strip():
        raise ValueError("A reason is required when deferring, blocking or failing a task")
    if status == "deferred" and category not in {"environment", "external-access", "tooling", "noncritical", "dependency"}:
        raise ValueError("Deferred task needs category environment/external-access/tooling/noncritical/dependency")
    if tasks[ident].done and status != "ready":
        raise ValueError(f"{ident} is checked complete in TODO; do not mark in-progress/deferred")
    state = read_state(root)
    timestamp = datetime.now(timezone.utc).isoformat()
    prior = state["tasks"].get(ident, {})
    attempts = int(prior.get("attempts", 0))
    if status == "in_progress":
        if attempts >= max_attempts:
            raise ValueError(f"{ident}: retry cap ({max_attempts}) reached; record defer/block and continue other work")
        attempts += 1
    item = {"status": status, "category": category, "reason": reason.strip(), "evidenceRef": ref, "updatedAt": timestamp, "attempts": attempts}
    state["tasks"][ident] = item
    history = state.setdefault("history", [])
    if not isinstance(history, list):
        raise ValueError("Invalid state history")
    history.append({"id": ident, "status": status, "time": timestamp, "category": category, "reason": reason.strip()})
    # Keep compact history without inventing completion events.
    if len(history) > 500:
        del history[:-500]
    _save_state(root, state)
    return item


def _longest_remaining(tasks: dict[str, Task]) -> dict[str, int]:
    descendants: dict[str, list[str]] = {k: [] for k in tasks}
    for task in tasks.values():
        for dep in task.dependencies:
            descendants[dep].append(task.id)
    cache: dict[str, int] = {}

    def depth(ident: str) -> int:
        if ident not in cache:
            t = tasks[ident]
            cache[ident] = (0 if t.done else t.effort) + max((depth(x) for x in descendants[ident]), default=0)
        return cache[ident]

    return {ident: depth(ident) for ident in tasks}


def _scope_root(pattern: str) -> str:
    """Conservative overlap approximation, never treats overlapping wildcards as independent."""
    return pattern.replace('\\', '/').split('*', 1)[0].rstrip('/')


def _scope_overlap(a: str, b: str) -> bool:
    left, right = _scope_root(a), _scope_root(b)
    if not left or not right:
        return True  # Wildcard at root: cannot prove file independence.
    return left == right or left.startswith(right + '/') or right.startswith(left + '/')


def _owned_conflict(existing: set[str], proposed: set[str]) -> bool:
    return any(_scope_overlap(a, b) for a in existing for b in proposed)


def _rank(t: Task, depth: dict[str, int]) -> tuple:
    return (t.priority, -int(t.critical), -depth[t.id], -(t.impact / t.effort), t.order)


def plan(root: Path, unavailable: set[str] | None = None, max_parallel: int = 1, retry_deferred: bool = False,
         max_waves: int = 0) -> dict:
    if max_parallel < 1 or max_parallel > 16:
        raise ValueError("max_parallel must be 1..16")
    if max_waves < 0:
        raise ValueError("max_waves must be nonnegative")
    tasks = read_tasks(root)
    state = read_state(root)
    unavailable = unavailable or set()
    depth = _longest_remaining(tasks)
    remaining = {tid for tid, task in tasks.items() if not task.done}
    completed = {tid for tid, task in tasks.items() if task.done}
    deferred: list[dict] = []
    critical_blockers: list[dict] = []
    in_progress: list[str] = []
    excluded: set[str] = set()
    for ident in sorted(remaining):
        task = tasks[ident]
        saved = state["tasks"].get(ident, {})
        status = saved.get("status", "")
        missing = sorted(task.environment.intersection(unavailable))
        if missing:
            item = {"id": ident, "category": "environment", "reason": "Unavailable: " + ", ".join(missing), "critical": task.critical}
            (critical_blockers if task.critical else deferred).append(item)
            excluded.add(ident)
        elif status in {"deferred", "blocked", "failed"} and not retry_deferred:
            item = {"id": ident, "category": saved.get("category", "noncritical"), "reason": saved.get("reason", "Recorded issue"), "critical": task.critical}
            (critical_blockers if task.critical or status == "blocked" else deferred).append(item)
            excluded.add(ident)
        elif status == "in_progress":
            in_progress.append(ident)
            excluded.add(ident)
    waves: list[list[dict]] = []
    simulated = set(completed)
    future = remaining - excluded
    while future and (max_waves == 0 or len(waves) < max_waves):
        ready = [tasks[tid] for tid in future if tasks[tid].dependencies <= simulated]
        if not ready:
            break
        ready.sort(key=lambda t: _rank(t, depth))
        first = ready[0]
        selected: list[Task] = [first]
        owned = set(first.files)
        if first.parallel_safe and first.files and max_parallel > 1:
            for candidate in ready[1:]:
                if len(selected) >= max_parallel:
                    break
                if candidate.parallel_safe and candidate.files and not _owned_conflict(owned, candidate.files):
                    selected.append(candidate)
                    owned |= candidate.files
        waves.append([{ "id": t.id, "title": t.title, "priority": f"P{t.priority}", "criticalPathWeight": depth[t.id],
                        "files": sorted(t.files), "parallelSafe": t.parallel_safe, "dependsOn": sorted(t.dependencies)} for t in selected])
        future.difference_update(t.id for t in selected)
        simulated.update(t.id for t in selected)
    waiting: list[dict] = []
    for ident in sorted(future, key=lambda tid: _rank(tasks[tid], depth)):
        dep = sorted(tasks[ident].dependencies - simulated)
        waiting.append({"id": ident, "waitingFor": dep})
    return {
        "schemaVersion": SCHEMA_VERSION,
        "mode": "forecast_only_not_execution",
        "summary": {"total": len(tasks), "checked": len(completed), "open": len(remaining),
                    "forecastWaves": len(waves), "deferred": len(deferred), "criticalBlockers": len(critical_blockers),
                    "inProgress": len(in_progress), "waiting": len(waiting)},
        "waves": waves, "deferredNoncritical": deferred, "criticalBlockers": critical_blockers,
        "inProgress": in_progress, "waitingForDependencies": waiting,
        "next": "Perform first executable wave, verify, update TODO evidence and checkpoint, then rerun planner. Retry deferred items after all independent work."
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    sub = parser.add_subparsers(dest="action", required=True)
    sched = sub.add_parser("plan", help="Preview dependency-safe waves. Does not execute tasks.")
    sched.add_argument("--unavailable", action="append", default=[], help="Unavailable capability, repeatable or comma-separated")
    sched.add_argument("--max-parallel", type=int, default=1)
    sched.add_argument("--retry-deferred", action="store_true")
    sched.add_argument("--max-waves", type=int, default=0, help="0 previews all possible waves")
    sched.add_argument("--json", action="store_true")
    rec = sub.add_parser("record", help="Atomically store progress/deferred issue only; never completion")
    rec.add_argument("--task", required=True)
    rec.add_argument("--status", required=True, choices=["in_progress", "deferred", "blocked", "failed", "ready"])
    rec.add_argument("--reason", default="")
    rec.add_argument("--category", default="")
    rec.add_argument("--ref", default="")
    rec.add_argument("--max-attempts", type=int, default=2, help="Maximum recorded attempts; default 2")
    try:
        args = parser.parse_args()
        root = args.root.expanduser().resolve()
        if args.action == "plan":
            unavailable = set().union(*(_tokens(x) for x in args.unavailable)) if args.unavailable else set()
            result = plan(root, unavailable, args.max_parallel, args.retry_deferred, args.max_waves)
            if args.json:
                print(json.dumps(result, indent=2, ensure_ascii=False))
            else:
                print("FORECAST ONLY — tasks are not executed by this scheduler")
                print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(json.dumps(record(root, args.task, args.status, args.reason, args.category, args.ref, args.max_attempts), indent=2, ensure_ascii=False))
        return 0
    except (ValueError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
