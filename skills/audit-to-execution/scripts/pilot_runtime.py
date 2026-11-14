#!/usr/bin/env python3
"""Strict optional per-task metadata and bounded pilot state helpers.

Never imports/executes project code, runs commands, or marks a task complete.
"""
from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
import re
from typing import Any

FIELDS = {
    "dependsOn", "files", "environment", "priority", "effort", "impact", "critical", "parallelSafe"
}
TASK_ID = re.compile(r"[A-Z]{2,6}-\d{3}\.\d+")
CAPABILITY = re.compile(r"[a-z0-9][a-z0-9_-]*")


def _metadata_path(root: Path) -> Path:
    root = root.resolve()
    target = root / "docs" / "EXECUTION-METADATA.json"
    for part in (target, target.parent):
        if part.is_symlink() or not part.resolve(strict=False).is_relative_to(root):
            raise ValueError(f"Unsafe metadata path: {part}")
    return target


def load_metadata(root: Path, task_ids: set[str]) -> dict[str, dict]:
    """Load a sidecar mapping; absence preserves legacy inline TODO metadata."""
    path = _metadata_path(root)
    if not path.is_file():
        return {}
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"Invalid execution metadata: {exc}") from exc
    if not isinstance(raw, dict) or set(raw) != {"schemaVersion", "tasks"} or raw["schemaVersion"] != 1 or not isinstance(raw["tasks"], dict):
        raise ValueError("Execution metadata requires schemaVersion: 1 and tasks object")
    unknown = set(raw["tasks"]) - task_ids
    if unknown:
        raise ValueError(f"Metadata references unknown TODO IDs: {', '.join(sorted(unknown))}")
    for ident, entry in raw["tasks"].items():
        if not isinstance(entry, dict):
            raise ValueError(f"{ident}: metadata must be an object")
        extra = set(entry) - FIELDS
        if extra:
            raise ValueError(f"{ident}: unknown metadata fields: {', '.join(sorted(extra))}")
        for field, value in entry.items():
            if field in {"dependsOn", "files", "environment"}:
                if not isinstance(value, list) or any(not isinstance(v, str) or not v.strip() for v in value) or len(value) != len(set(value)):
                    raise ValueError(f"{ident}.{field}: unique nonempty string array required")
                if field == "dependsOn" and any(not TASK_ID.fullmatch(v) for v in value):
                    raise ValueError(f"{ident}.dependsOn: invalid task ID")
                if field == "environment" and any(not CAPABILITY.fullmatch(v) for v in value):
                    raise ValueError(f"{ident}.environment: invalid capability name")
                if field == "files" and any(v.startswith(("/", "~", "\\")) or ".." in v.replace("\\", "/").split("/") or re.match(r"^[A-Za-z]:", v) for v in value):
                    raise ValueError(f"{ident}.files: relative project paths only")
            elif field == "priority" and value not in {"P0", "P1", "P2", "P3"}:
                raise ValueError(f"{ident}.priority: P0..P3 required")
            elif field in {"effort", "impact"} and (type(value) is not int or not 1 <= value <= 5):
                raise ValueError(f"{ident}.{field}: integer 1..5 required")
            elif field in {"critical", "parallelSafe"} and type(value) is not bool:
                raise ValueError(f"{ident}.{field}: boolean required")
    return raw["tasks"]


def apply_metadata(root: Path, tasks: dict[str, Any], inline_fields: dict[str, set[str]]) -> set[str]:
    mapping = load_metadata(root, set(tasks))
    attr = {
        "dependsOn": "dependencies", "files": "files", "environment": "environment",
        "priority": "priority", "effort": "effort", "impact": "impact",
        "critical": "critical", "parallelSafe": "parallel_safe",
    }
    aliases = {
        "dependsOn": {"depends on", "dependencies", "dépendances"},
        "files": {"files", "owned files", "file ownership", "fichiers"},
        "environment": {"environment", "requires environment", "environnement"},
        "priority": {"priority", "priorité"},
        "effort": {"effort", "effort relatif"},
        "impact": {"impact", "valeur"},
        "critical": {"critical", "critique"},
        "parallelSafe": {"parallel safe", "parallèle sûr"},
    }
    for ident, fields in mapping.items():
        task = tasks[ident]
        for key, value in fields.items():
            candidate = set(value) if key in {"dependsOn", "files", "environment"} else int(value[1]) if key == "priority" else value
            fieldname = attr[key]
            if inline_fields[ident] & aliases[key] and getattr(task, fieldname) != candidate:
                raise ValueError(f"{ident}.{key}: conflicting inline and sidecar metadata")
            setattr(task, fieldname, candidate)
    return set(mapping)


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def pilot_scope(state: dict[str, Any], tasks: dict[str, Any]) -> dict[str, Any] | None:
    pilot = state.get("pilot")
    if pilot is None:
        return None
    if (not isinstance(pilot, dict) or pilot.get("status") not in {"active", "closed"}
            or not isinstance(pilot.get("selectedIds"), list)
            or not pilot["selectedIds"]
            or not all(isinstance(x, str) and x in tasks for x in pilot["selectedIds"])
            or len(set(pilot["selectedIds"])) != len(pilot["selectedIds"])
            or type(pilot.get("maxTasks")) is not int or not 1 <= pilot["maxTasks"] <= 20
            or len(pilot["selectedIds"]) > pilot["maxTasks"]):
        raise ValueError("Malformed pilot scope; refusing unbounded execution")
    return pilot


def create_pilot(tasks: dict[str, Any], state: dict, selected: list[str], max_tasks: int) -> dict:
    if type(max_tasks) is not int or not 1 <= max_tasks <= 20:
        raise ValueError("Pilot max-tasks must be 1..20")
    if not selected or len(selected) > max_tasks or len(set(selected)) != len(selected):
        raise ValueError("Pilot needs explicit, unique selected IDs within max-tasks")
    unknown = sorted(set(selected) - set(tasks))
    if unknown:
        raise ValueError(f"Pilot references unknown IDs: {', '.join(unknown)}")
    if pilot_scope(state, tasks) and state["pilot"]["status"] == "active":
        raise ValueError("A pilot is already active; close it explicitly first")
    busy = {ident for ident, entry in state.get("tasks", {}).items() if isinstance(entry, dict) and entry.get("status") == "in_progress" and (ident not in tasks or not tasks[ident].done)}
    if busy - set(selected):
        raise ValueError("Pilot cannot begin while other tasks have active workers; reconcile/close their checkpoints first")
    for ident in selected:
        if tasks[ident].done:
            raise ValueError(f"{ident}: checked task cannot be selected for pilot")
        unresolved = tasks[ident].dependencies - set(selected) - {x for x, t in tasks.items() if t.done}
        if unresolved:
            raise ValueError(f"{ident}: unselected open dependency {', '.join(sorted(unresolved))}; choose it explicitly within the cap")
    return {"status": "active", "selectedIds": selected, "maxTasks": max_tasks,
            "createdAt": utcnow(), "closedAt": None,
            "stopConditions": ["all-selected-verified", "all-selected-unavailable", "critical-safety-or-permission-blocker", "retry-or-budget-cap"]}
