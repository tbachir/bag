"""Offline unit tests for portable planning helpers."""
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from scaffold import run  # noqa: E402
from validate_project import validate  # noqa: E402
from validate_skill import validate_skill  # noqa: E402


class SkillTests(unittest.TestCase):
    def test_skill_structure(self):
        self.assertEqual(validate_skill(ROOT), [])

    def test_dry_run_creates_nothing(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            planned, skipped = run(root, "Example", "PRJ", False)
            self.assertEqual((planned, skipped), (8, 0))
            self.assertEqual(list(root.iterdir()), [])

    def test_scaffold_and_validate(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            created, skipped = run(root, "Example", "PRJ", True)
            self.assertEqual((created, skipped), (8, 0))
            errors, warnings = validate(root, "PRJ")
            self.assertEqual(errors, [])
            # Repeated application is non-destructive.
            previous = (root / "TODO.md").read_bytes()
            created2, skipped2 = run(root, "Example Changed", "PRJ", True)
            self.assertEqual((created2, skipped2), (0, 8))
            self.assertEqual((root / "TODO.md").read_bytes(), previous)

    def test_duplicate_and_missing_skill_detected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            run(root, "Example", "PRJ", True)
            task = root / "TODO.md"
            content = task.read_text(encoding="utf-8")
            content = content.replace("**Skills recommended:**", "**Unspecified:**", 1)
            task.write_text(content, encoding="utf-8")
            errors, _ = validate(root, "PRJ")
            self.assertTrue(any("missing skills" in e for e in errors))

    def test_candidate_skill_link_is_not_completion_proof(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            run(root, "Example", "PRJ", True)
            task = root / "TODO.md"
            content = task.read_text(encoding="utf-8")
            content = content.replace("- [ ] **PRJ-001.1**", "- [x] **PRJ-001.1**")
            content = content.replace(
                "**Skills recommended:** Review available repository-audit",
                "**Skills recommended:** https://skills.sh/some/repo repository-audit",
            )
            task.write_text(content, encoding="utf-8")
            errors, _ = validate(root, "PRJ")
            self.assertTrue(any("checked task needs" in e for e in errors))

    def test_checked_task_needs_proof(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            run(root, "Example", "PRJ", True)
            task = root / "TODO.md"
            content = task.read_text(encoding="utf-8")
            task.write_text(content.replace("- [ ] **PRJ-001.1**", "- [x] **PRJ-001.1**"), encoding="utf-8")
            errors, _ = validate(root, "PRJ")
            self.assertTrue(any("checked task needs" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
