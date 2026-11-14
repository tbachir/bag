#!/usr/bin/env python3
"""Dependency-wave forecasts, explicit bounded pilots and safe checkpoint updates.

Does NOT implement tasks, run arbitrary commands, merge PRs or certify acceptance.
The coding agent follows SKILL.md and reports changes; this script decides which
independent tasks are ready, what belongs to a limited pilot, and which blockers can be deferred.
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

from pilot_runtime import apply_metadata, create_pilot, pilot_scope, utcnow

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
    metadata_source: str = "todo_or_defaults"


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
    inline_fields: dict[str, set[str]] = {}
    for i, match in enumerate(found):
        ident = match.group("id")
        if ident in tasks:
            raise ValueError(f"Duplicate task ID: {ident}")
        stop = found[i + 1].start() if i + 1 < len(found) else len(contents)
        # Avoid consuming unrelated new headings or parent list rows.
        part = contents[match.end():stop].split("\n## ", 1)[0]
        meta = {m.group("key").strip().lower(): m.group("value").strip() for m in META_RE.finditer(part)}
        inline_fields[ident] = set(meta)
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
    mapped_ids = apply_metadata(root, tasks, inline_fields)
    for ident in mapped_ids:
        tasks[ident].metadata_source = "sidecar"
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
    pilot = pilot_scope(state, tasks)
    if pilot:
        if pilot["status"] != "active":
            raise ValueError("Pilot is closed: no further work until an explicit new pilot")
        if ident not in pilot["selectedIds"]:
            raise ValueError(f"{ident} is outside the active pilot scope")
        if all(tasks[x].done for x in pilot["selectedIds"]):
            raise ValueError("Pilot tasks are verified complete; stop before continuing")
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
    normalized = pattern.replace('\\', '/')
    wildcard = re.search(r'[?*\[]', normalized)
    if wildcard is None:
        return normalized.rstrip('/')
    # Wildcard inside a filename segment (src/foo*.py) cannot prove
    # independence from another file in that same directory.
    before = normalized[:wildcard.start()]
    return (before.rstrip('/') if before.endswith('/') else before.rsplit('/', 1)[0])


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
    pilot = pilot_scope(state, tasks)
    selected = set(pilot["selectedIds"]) if pilot else set(tasks)
    remaining &= selected
    if pilot and pilot["status"] == "closed":
        remaining = set()
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
    active = [tasks[ident] for ident in in_progress]
    active_owned = set().union(*(task.files for task in active)) if active else set()
    # When an active worker lacks explicit safe ownership, serialize until it
    # finishes. Max_parallel is the total number of workers, not just new ones.
    active_parallel_safe = all(task.parallel_safe and task.files for task in active)
    available_slots = max_parallel - len(active)
    while future and (max_waves == 0 or len(waves) < max_waves):
        ready = [tasks[tid] for tid in future if tasks[tid].dependencies <= simulated]
        if active:
            ready = [task for task in ready if active_parallel_safe and available_slots > 0 and
                     task.parallel_safe and task.files and not _owned_conflict(active_owned, task.files)]
        if not ready or available_slots <= 0:
            break
        ready.sort(key=lambda t: _rank(t, depth))
        first = ready[0]
        selected: list[Task] = [first]
        owned = set(first.files)
        if first.parallel_safe and first.files and available_slots > 1:
            for candidate in ready[1:]:
                if len(selected) >= available_slots:
                    break
                if candidate.parallel_safe and candidate.files and not _owned_conflict(owned, candidate.files):
                    selected.append(candidate)
                    owned |= candidate.files
        waves.append([{ "id": t.id, "title": t.title, "priority": f"P{t.priority}", "criticalPathWeight": depth[t.id],
                        "files": sorted(t.files), "parallelSafe": t.parallel_safe, "dependsOn": sorted(t.dependencies)} for t in selected])
        future.difference_update(t.id for t in selected)
        simulated.update(t.id for t in selected)
    waiting: list[dict] = []
    waiting_active: list[dict] = []
    next_wave: list[str] = []
    for ident in sorted(future, key=lambda tid: _rank(tasks[tid], depth)):
        task = tasks[ident]
        dep = sorted(task.dependencies - simulated)
        if dep:
            waiting.append({"id": ident, "waitingFor": dep})
        elif active and (available_slots <= 0 or not active_parallel_safe or not task.parallel_safe or
                         not task.files or _owned_conflict(active_owned, task.files)):
            waiting_active.append({"id": ident, "activeWorkers": in_progress})
        else:
            next_wave.append(ident)
    return {
        "schemaVersion": SCHEMA_VERSION,
        "mode": "forecast_only_not_execution",
        "summary": {"total": len(tasks), "checked": len(completed), "open": len(remaining),
                    "forecastWaves": len(waves), "deferred": len(deferred), "criticalBlockers": len(critical_blockers),
                    "inProgress": len(in_progress), "waiting": len(waiting) + len(waiting_active) + len(next_wave)},
        "waves": waves, "deferredNoncritical": deferred, "criticalBlockers": critical_blockers,
        "inProgress": in_progress, "waitingForDependencies": waiting,
        "waitingForActiveWorkers": waiting_active, "nextUnscheduledWave": next_wave,
        "pilot": ({"status": pilot["status"], "selectedIds": pilot["selectedIds"],
                   "maxTasks": pilot["maxTasks"], "verifiedCount": sum(tasks[x].done for x in pilot["selectedIds"]),
                   "stopNow": pilot["status"] == "closed" or (not waves and not in_progress and not next_wave and not waiting_active),
                   "stopReason": ("closed" if pilot["status"] == "closed" else
                                  "all-selected-verified" if all(tasks[x].done for x in pilot["selectedIds"]) else
                                  "no-independent-feasible-work" if not waves and not in_progress and not next_wave and not waiting_active else
                                  "continue-bounded-pilot")}
                  if pilot else None),
        "metadataCoverage": {"sidecarTasks": sum(x.metadata_source == "sidecar" for x in tasks.values()),
                             "withoutFileOwnership": [x.id for x in tasks.values() if not x.done and not x.files]},
        "next": ("STOP AT PILOT SCOPE — do not select other TODO tasks." if pilot else
                 "Perform first executable wave, verify, update TODO evidence and checkpoint, then rerun planner. Retry deferred items after all independent work.")
    }


def pilot_action(root: Path, action: str, selected: list[str] | None = None,
                 max_tasks: int = 4, write: bool = False) -> dict:
    """Preview/start/close a bounded pilot; never execute implementation tasks."""
    tasks = read_tasks(root)
    state = read_state(root)
    current = pilot_scope(state, tasks)
    if action == "status":
        return {"pilot": current, "forecast": plan(root) if current else None}
    if action == "start":
        candidate = create_pilot(tasks, state, selected or [], max_tasks)
        if write:
            state["pilot"] = candidate
            _save_state(root, state)
        return {"pilot": candidate, "written": write,
                "note": "Only explicit task IDs are permitted; no implementation performed"}
    if action == "stop":
        if not current or current["status"] != "active":
            raise ValueError("No active pilot to close")
        if not write:
            return {"pilot": current, "written": False, "note": "Dry run: add --write to close"}
        current["status"] = "closed"
        current["closedAt"] = utcnow()
        _save_state(root, state)
        return {"pilot": current, "written": True}
    raise ValueError("Unknown pilot action")


def metadata_skeleton(root: Path) -> dict:
    """Read-only skeleton: empty objects deliberately avoid inventing dependencies."""
    return {"schemaVersion": 1, "tasks": {ident: {} for ident, task in read_tasks(root).items() if not task.done}}


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
    pilot_parser = sub.add_parser("pilot", help="Preview/start/close an explicit bounded pilot")
    pilot_parser.add_argument("phase", choices=["start", "status", "stop"])
    pilot_parser.add_argument("--task", action="append", default=[], help="Explicit permitted task ID; repeatable")
    pilot_parser.add_argument("--max-tasks", type=int, default=4, help="Upper bound, 1..20 (default 4)")
    pilot_parser.add_argument("--write", action="store_true", help="Explicitly write the pilot checkpoint")
    pilot_parser.add_argument("--json", action="store_true")
    metadata_parser = sub.add_parser("metadata", help="Output an optional sidecar metadata skeleton; never writes")
    metadata_parser.add_argument("--json", action="store_true")
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
        elif args.action == "pilot":
            print(json.dumps(pilot_action(root, args.phase, args.task, args.max_tasks, args.write), indent=2, ensure_ascii=False))
        elif args.action == "metadata":
            print(json.dumps(metadata_skeleton(root), indent=2, ensure_ascii=False))
        else:
            print(json.dumps(record(root, args.task, args.status, args.reason, args.category, args.ref, args.max_attempts), indent=2, ensure_ascii=False))
        return 0
    except (ValueError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
