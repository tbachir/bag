"""Offline regression tests for wave planning, non-critical deferrals and checkpoints."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
from execution import read_tasks, plan, read_state, record  # noqa: E402

FIXTURE = '''# TODO — Demo

## DEM-001 — Contracts
- [ ] **DEM-001.1** Define schema
  - **Priority:** P0
  - **Critical:** yes
  - **Impact:** 5
  - **Effort:** 2
  - **Files:** packages/schema/**
  - **Parallel safe:** yes
  - **Skills recommended:** none needed
  - **Discovery:** `npx skills find "schema modeling"`
- [ ] **DEM-001.2** Create UI component
  - **Priority:** P1
  - **Files:** apps/web/ui/**
  - **Parallel safe:** yes
  - **Skills recommended:** frontend
  - **Discovery:** `npx skills find "react components"`
- [ ] **DEM-001.3** Create backend service
  - **Priority:** P1
  - **Files:** apps/api/**
  - **Parallel safe:** yes
  - **Skills recommended:** backend
  - **Discovery:** `npx skills find "api"`
- [ ] **DEM-001.4** Validate native app on signed device
  - **Priority:** P1
  - **Depends on:** DEM-001.2
  - **Environment:** ios-device, macos
  - **Critical:** no
  - **Skills recommended:** native
  - **Discovery:** `npx skills find "ios real device"`
- [ ] **DEM-001.5** Integrate UI with backend
  - **Priority:** P0
  - **Depends on:** DEM-001.1, DEM-001.2, DEM-001.3
  - **Files:** apps/web/, apps/api/
  - **Parallel safe:** no
  - **Skills recommended:** integration
  - **Discovery:** `npx skills find "integration tests"`
'''


class ExecutionTests(unittest.TestCase):
    def project(self):
        temp = tempfile.TemporaryDirectory()
        root = Path(temp.name)
        (root / 'TODO.md').write_text(FIXTURE, encoding='utf-8')
        self.addCleanup(temp.cleanup)
        return root

    def test_no_implicit_writes_and_all_at_once_forecast(self):
        root = self.project()
        result = plan(root, unavailable={'ios-device', 'macos'}, max_parallel=3)
        self.assertEqual(result['summary']['open'], 5)
        self.assertEqual(result['mode'], 'forecast_only_not_execution')
        self.assertGreaterEqual(len(result['waves']), 2)
        ids = [x['id'] for wave in result['waves'] for x in wave]
        self.assertEqual(set(ids), {'DEM-001.1', 'DEM-001.2', 'DEM-001.3', 'DEM-001.5'})
        self.assertEqual([x['id'] for x in result['deferredNoncritical']], ['DEM-001.4'])
        self.assertFalse((root / 'docs').exists(), 'planning should not write state')

    def test_parallel_requires_explicit_safe_and_nonoverlap(self):
        root = self.project()
        p = plan(root, max_parallel=3)
        self.assertEqual(set(x['id'] for x in p['waves'][0]), {'DEM-001.1', 'DEM-001.2', 'DEM-001.3'})
        self.assertEqual(p['waves'][1][0]['id'], 'DEM-001.5')
        # Not safe to mix without explicit ownership or parallel flag.
        contents = (root / 'TODO.md').read_text(encoding='utf-8').replace('**Files:** apps/api/**', '**Files:** apps/web/ui/**')
        (root / 'TODO.md').write_text(contents, encoding='utf-8')
        p2 = plan(root, max_parallel=3)
        self.assertEqual(len(p2['waves'][0]), 2)
        nested = contents.replace('**Files:** apps/web/ui/**', '**Files:** apps/web/**', 1)
        (root / 'TODO.md').write_text(nested, encoding='utf-8')
        p3 = plan(root, max_parallel=3)
        self.assertEqual(len(p3['waves'][0]), 2, 'parent wildcard must overlap nested file scope')

    def test_filename_prefix_glob_conflicts(self):
        root = self.project()
        source = (root / 'TODO.md').read_text(encoding='utf-8')
        source = source.replace('**Files:** packages/schema/**', '**Files:** src/foo*.py')
        source = source.replace('**Files:** apps/web/ui/**', '**Files:** src/foobar.py')
        (root / 'TODO.md').write_text(source, encoding='utf-8')
        p = plan(root, max_parallel=3)
        first = {item['id'] for item in p['waves'][0]}
        self.assertFalse({'DEM-001.1', 'DEM-001.2'} <= first)

    def test_active_worker_reserves_file_and_parallel_slot(self):
        root = self.project()
        source = (root / 'TODO.md').read_text(encoding='utf-8')
        source = source.replace('**Files:** packages/schema/**', '**Files:** src/shared.py')
        source = source.replace('**Files:** apps/web/ui/**', '**Files:** src/shared.py')
        (root / 'TODO.md').write_text(source, encoding='utf-8')
        record(root, 'DEM-001.1', 'in_progress')
        # With one worker capacity there is no space for another task.
        serial = plan(root, max_parallel=1)
        self.assertEqual(serial['waves'], [])
        self.assertTrue(serial['waitingForActiveWorkers'])
        parallel = plan(root, max_parallel=2)
        ids = [x['id'] for wave in parallel['waves'] for x in wave]
        self.assertNotIn('DEM-001.2', ids, 'same file is held by active worker')
        self.assertIn('DEM-001.3', ids, 'disjoint independent work can proceed')
        self.assertIn('DEM-001.2', [x['id'] for x in parallel['waitingForActiveWorkers']])

    def test_active_task_with_unknown_file_scope_serializes(self):
        root = self.project()
        source = (root / 'TODO.md').read_text(encoding='utf-8')
        source = source.replace('**Files:** packages/schema/**', '**Files:** none')
        (root / 'TODO.md').write_text(source, encoding='utf-8')
        record(root, 'DEM-001.1', 'in_progress')
        self.assertEqual(plan(root, max_parallel=4)['waves'], [])

    def test_defer_and_revisit_at_tail(self):
        root = self.project()
        saved = record(root, 'DEM-001.4', 'deferred', 'No signed device', 'environment')
        self.assertEqual(saved['status'], 'deferred')
        s = read_state(root)
        self.assertEqual(s['tasks']['DEM-001.4']['reason'], 'No signed device')
        p = plan(root, max_parallel=2)
        self.assertIn('DEM-001.4', {x['id'] for x in p['deferredNoncritical']})
        q = plan(root, max_parallel=2, retry_deferred=True)
        self.assertIn('DEM-001.4', {x['id'] for wave in q['waves'] for x in wave})
        self.assertEqual(record(root, 'DEM-001.4', 'ready')['status'], 'ready')

    def test_critical_environment_problem_not_misclassified(self):
        root = self.project()
        contents = (root / 'TODO.md').read_text(encoding='utf-8').replace('**Files:** packages/schema/**','**Environment:** macos\n  - **Files:** packages/schema/**')
        (root / 'TODO.md').write_text(contents, encoding='utf-8')
        r = plan(root, unavailable={'macos'})
        self.assertEqual([x['id'] for x in r['criticalBlockers']], ['DEM-001.1'])
        self.assertNotIn('DEM-001.1', {x['id'] for wave in r['waves'] for x in wave})
        # Independent UI and API work should still be possible.
        self.assertIn('DEM-001.2', {x['id'] for wave in r['waves'] for x in wave})

    def test_no_silent_done_and_no_unreasoned_defer(self):
        root = self.project()
        with self.assertRaisesRegex(ValueError, 'Only progress'):
            record(root, 'DEM-001.2', 'done')
        with self.assertRaisesRegex(ValueError, 'reason is required'):
            record(root, 'DEM-001.2', 'deferred', category='environment')
        self.assertFalse((root / 'docs').exists())

    def test_cycle_and_missing_dependencies_fail(self):
        root = self.project()
        text = (root / 'TODO.md').read_text(encoding='utf-8')
        (root / 'TODO.md').write_text(text.replace('**Impact:** 5', '**Depends on:** DEM-001.5\n  - **Impact:** 5'), encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'cycle'):
            read_tasks(root)
        (root / 'TODO.md').write_text(text.replace('**Impact:** 5', '**Depends on:** DEM-999.1\n  - **Impact:** 5'), encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'unknown prerequisite'):
            read_tasks(root)

    def test_checked_tasks_are_not_replanned(self):
        root = self.project()
        text = (root / 'TODO.md').read_text(encoding='utf-8').replace('- [ ] **DEM-001.1**', '- [x] **DEM-001.1**')
        (root / 'TODO.md').write_text(text, encoding='utf-8')
        p = plan(root)
        self.assertEqual(p['summary']['checked'], 1)
        self.assertNotIn('DEM-001.1', {x['id'] for wave in p['waves'] for x in wave})

    def test_symlink_and_invalid_state_are_rejected(self):
        root = self.project()
        outside = self.project()
        try:
            (root / 'docs').symlink_to(outside, target_is_directory=True)
        except (OSError, NotImplementedError):
            self.skipTest('No symlinks')
        with self.assertRaisesRegex(ValueError, 'Unsafe state path'):
            record(root, 'DEM-001.2', 'deferred', 'missing emulator', 'environment')
        self.assertFalse((outside / 'EXECUTION-STATE.json').exists())

    def test_retry_cap_protects_against_stalling(self):
        root = self.project()
        record(root, 'DEM-001.2', 'in_progress')
        record(root, 'DEM-001.2', 'failed', 'temporary test failure')
        record(root, 'DEM-001.2', 'in_progress')
        with self.assertRaisesRegex(ValueError, 'retry cap'):
            record(root, 'DEM-001.2', 'in_progress')
        record(root, 'DEM-001.2', 'deferred', 'needs investigation', 'noncritical')
        self.assertEqual(read_state(root)['tasks']['DEM-001.2']['status'], 'deferred')

    def test_state_is_json_parseable_after_updates(self):
        root = self.project()
        record(root, 'DEM-001.2', 'in_progress')
        record(root, 'DEM-001.2', 'failed', 'test failed', 'tooling', ref='CI-123')
        state = json.loads((root / 'docs' / 'EXECUTION-STATE.json').read_text())
        self.assertEqual(state['tasks']['DEM-001.2']['attempts'], 1)
        self.assertEqual(state['tasks']['DEM-001.2']['evidenceRef'], 'CI-123')
        self.assertEqual(len(state['history']), 2)


if __name__ == '__main__':
    unittest.main()
