"""Bounded run-all pilot, sidecar metadata and preflight regression tests."""
from __future__ import annotations

import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import Mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
from execution import metadata_skeleton, pilot_action, plan, read_state, read_tasks, record  # noqa: E402
from preflight import preflight, select_checks  # noqa: E402
from test_execution import FIXTURE  # noqa: E402


class PilotTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)
        (self.root / 'TODO.md').write_text(FIXTURE, encoding='utf-8')

    def metadata(self, tasks):
        (self.root / 'docs').mkdir(exist_ok=True)
        (self.root / 'docs/EXECUTION-METADATA.json').write_text(
            json.dumps({'schemaVersion': 1, 'tasks': tasks}), encoding='utf-8')

    def test_optional_sidecar_adds_task_ownership_and_preserves_original_todo(self):
        before = (self.root / 'TODO.md').read_text()
        self.metadata({'DEM-001.4': {'environment': ['ios-device', 'macos'], 'files': ['apps/native/**'],
                                      'parallelSafe': False, 'dependsOn': ['DEM-001.2'], 'priority': 'P1'}})
        tasks = read_tasks(self.root)
        self.assertEqual(tasks['DEM-001.4'].metadata_source, 'sidecar')
        self.assertEqual(tasks['DEM-001.4'].files, {'apps/native/**'})
        self.assertEqual((self.root / 'TODO.md').read_text(), before)
        self.assertEqual(plan(self.root, unavailable={'ios-device'})['metadataCoverage']['sidecarTasks'], 1)

    def test_conflicting_and_unknown_metadata_rejected(self):
        self.metadata({'DEM-001.1': {'files': ['other/**']}})
        with self.assertRaisesRegex(ValueError, 'conflicting inline'):
            read_tasks(self.root)
        self.metadata({'DEM-999.1': {'files': ['x/**']}})
        with self.assertRaisesRegex(ValueError, 'unknown TODO'):
            read_tasks(self.root)
        self.metadata({'DEM-001.4': {'files': ['/absolute']}})
        with self.assertRaisesRegex(ValueError, 'relative project'):
            read_tasks(self.root)
        self.metadata({'DEM-001.4': {'parallelSafe': 'yes'}})
        with self.assertRaisesRegex(ValueError, 'boolean'):
            read_tasks(self.root)

    def test_sidecar_cycle_and_unknown_dependency_fail_closed(self):
        self.metadata({'DEM-001.1': {'dependsOn': ['DEM-001.5']}})
        with self.assertRaisesRegex(ValueError, 'cycle'):
            read_tasks(self.root)
        self.metadata({'DEM-001.1': {'dependsOn': ['DEM-999.1']}})
        with self.assertRaisesRegex(ValueError, 'unknown prerequisite'):
            read_tasks(self.root)

    def test_metadata_skeleton_is_read_only_and_no_guessed_deps(self):
        skeleton = metadata_skeleton(self.root)
        self.assertEqual(skeleton['schemaVersion'], 1)
        self.assertEqual(skeleton['tasks']['DEM-001.2'], {})
        self.assertFalse((self.root / 'docs').exists())

    def test_pilot_preview_requires_explicit_tasks_with_limit_and_dependencies(self):
        with self.assertRaisesRegex(ValueError, 'explicit'):
            pilot_action(self.root, 'start', [], 4)
        with self.assertRaisesRegex(ValueError, 'within max-tasks'):
            pilot_action(self.root, 'start', ['DEM-001.1', 'DEM-001.2'], 1)
        with self.assertRaisesRegex(ValueError, 'unselected open dependency'):
            pilot_action(self.root, 'start', ['DEM-001.5'], 4)
        item = pilot_action(self.root, 'start', ['DEM-001.1', 'DEM-001.2'], 2)
        self.assertFalse(item['written'])
        self.assertFalse((self.root / 'docs').exists())

    def test_active_pilot_hard_caps_planning_and_checkpoint_changes(self):
        pilot_action(self.root, 'start', ['DEM-001.1', 'DEM-001.2'], 2, write=True)
        p = plan(self.root, max_parallel=3)
        self.assertEqual({x['id'] for w in p['waves'] for x in w}, {'DEM-001.1', 'DEM-001.2'})
        self.assertFalse(p['pilot']['stopNow'])
        self.assertEqual(p['pilot']['selectedIds'], ['DEM-001.1', 'DEM-001.2'])
        with self.assertRaisesRegex(ValueError, 'outside the active pilot'):
            record(self.root, 'DEM-001.3', 'in_progress')
        self.assertEqual(record(self.root, 'DEM-001.1', 'in_progress')['attempts'], 1)
        with self.assertRaisesRegex(ValueError, 'already active'):
            pilot_action(self.root, 'start', ['DEM-001.2'], 2, write=True)

    def test_pilot_stops_when_scoped_tasks_are_verified_not_entire_backlog(self):
        pilot_action(self.root, 'start', ['DEM-001.2'], 1, write=True)
        todo = (self.root / 'TODO.md').read_text()
        (self.root / 'TODO.md').write_text(todo.replace('- [ ] **DEM-001.2**', '- [x] **DEM-001.2**'))
        state = plan(self.root)
        self.assertTrue(state['pilot']['stopNow'])
        self.assertEqual(state['pilot']['stopReason'], 'all-selected-verified')
        self.assertGreater(state['summary']['total'], 1)
        self.assertFalse(state['waves'])
        self.assertEqual(state['pilot']['verifiedCount'], 1)
        with self.assertRaisesRegex(ValueError, 'Pilot tasks are verified'):
            record(self.root, 'DEM-001.2', 'ready')
        closing = pilot_action(self.root, 'stop', write=True)
        self.assertEqual(closing['pilot']['status'], 'closed')
        closed_forecast = plan(self.root)
        self.assertEqual(closed_forecast['waves'], [])
        self.assertEqual(closed_forecast['summary']['open'], 4, 'closing the pilot must not erase unchecked backlog')
        self.assertEqual(closed_forecast['summary']['pilotOpen'], 0)
        self.assertEqual(closed_forecast['summary']['scheduledOpen'], 0)
        with self.assertRaisesRegex(ValueError, 'Pilot is closed'):
            record(self.root, 'DEM-001.2', 'ready')

    def test_new_pilot_rejects_unscoped_active_worker(self):
        record(self.root, 'DEM-001.3', 'in_progress')
        with self.assertRaisesRegex(ValueError, 'other tasks have active workers'):
            pilot_action(self.root, 'start', ['DEM-001.2'], 1, write=True)

    def test_finished_pilot_does_not_block_another_from_stale_worker_checkpoint(self):
        pilot_action(self.root, 'start', ['DEM-001.1'], 1, write=True)
        record(self.root, 'DEM-001.1', 'in_progress')
        todo = (self.root / 'TODO.md').read_text()
        (self.root / 'TODO.md').write_text(todo.replace('- [ ] **DEM-001.1**', '- [x] **DEM-001.1**'))
        pilot_action(self.root, 'stop', write=True)
        new = pilot_action(self.root, 'start', ['DEM-001.2'], 1, write=True)
        self.assertEqual(new['pilot']['selectedIds'], ['DEM-001.2'])
        self.assertFalse(plan(self.root)['pilot']['stopNow'])

    def test_pilot_deferral_is_nonfatal_and_exhausted_pilot_stops(self):
        text = (self.root / 'TODO.md').read_text().replace('- [ ] **DEM-001.2**', '- [x] **DEM-001.2**')
        (self.root / 'TODO.md').write_text(text)
        pilot_action(self.root, 'start', ['DEM-001.4'], 1, write=True)
        record(self.root, 'DEM-001.4', 'deferred', 'requires macOS', 'environment')
        p = plan(self.root, unavailable={'macos'})
        self.assertEqual(p['pilot']['stopReason'], 'no-independent-feasible-work')
        self.assertTrue(p['pilot']['stopNow'])
        self.assertEqual([x['id'] for x in p['deferredNoncritical']], ['DEM-001.4'])


class PreflightTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)
        (self.root / 'package.json').write_text(json.dumps({
            'packageManager': 'pnpm@10.34.5',
            'scripts': {'typecheck': 'tsc --noEmit', 'lint': 'biome lint .',
                        'format:check': 'biome format .', 'test': 'vitest run'}
        }))

    def test_read_only_default_and_allowlist(self):
        result = preflight(self.root)
        self.assertEqual(result['mode'], 'preview_only')
        self.assertIsNone(result['passed'])
        self.assertEqual(len(result['checks']), 4)
        with self.assertRaisesRegex(ValueError, 'Only unique'):
            preflight(self.root, 'typecheck,; rm -rf .')
        with self.assertRaisesRegex(ValueError, 'Only unique'):
            select_checks({'scripts': {}}, 'lint,lint')

    def test_run_uses_argv_no_shell_and_stops_at_first_failure(self):
        fake = Mock(side_effect=[Mock(returncode=0, stdout='ok', stderr=''),
                                 Mock(returncode=1, stdout='', stderr='lint error')])
        result = preflight(self.root, run=True, runner=fake)
        self.assertFalse(result['passed'])
        self.assertEqual([x['status'] for x in result['results']], ['passed', 'failed'])
        self.assertEqual(fake.call_count, 2)
        self.assertEqual(fake.call_args_list[0].args[0], ['pnpm', 'typecheck'])
        self.assertEqual(fake.call_args_list[1].args[0], ['pnpm', 'lint'])
        self.assertFalse(fake.call_args_list[0].kwargs.get('shell', False))

    def test_missing_scripts_do_not_get_false_pass(self):
        (self.root / 'package.json').write_text(json.dumps({'packageManager':'pnpm@10.34.5','scripts':{}}))
        with self.assertRaisesRegex(ValueError, 'No selected scripts'):
            preflight(self.root, run=True, runner=Mock())

    def test_missing_one_requested_check_is_visible_and_not_full_pass(self):
        (self.root / 'package.json').write_text(json.dumps({
            'packageManager': 'pnpm@10.34.5', 'scripts': {'typecheck': 'tsc --noEmit'}
        }))
        out = preflight(self.root, run=True, runner=Mock(return_value=Mock(returncode=0, stdout='', stderr='')))
        self.assertFalse(out['passed'])
        self.assertIn('lint', out['skippedAbsent'])
        self.assertEqual(out['results'][0]['status'], 'passed')

    def test_bun_uses_the_inspected_package_script_not_built_in_test(self):
        (self.root / 'package.json').write_text(json.dumps({
            'packageManager': 'bun@1.2.14', 'scripts': {'test': 'exit 42'}
        }))
        fake = Mock(return_value=Mock(returncode=42, stdout='', stderr='configured script failed'))
        out = preflight(self.root, checks='test', run=True, runner=fake)
        self.assertFalse(out['passed'])
        self.assertEqual(fake.call_args.args[0], ['bun', 'run', 'test'])

    def test_timeout_kills_posix_process_group_including_child(self):
        import os
        import subprocess
        import sys
        import time
        from preflight import _run_grouped
        if os.name == 'nt':
            self.skipTest('Windows process-tree termination is platform-specific')
        marker = self.root / 'orphan-marker'
        child = 'import pathlib,time;time.sleep(0.9);pathlib.Path(' + repr(str(marker)) + ').write_text("orphan")'
        parent = 'import subprocess,sys,time;subprocess.Popen([sys.executable,"-c",' + repr(child) + ']);time.sleep(3)'
        with self.assertRaises(subprocess.TimeoutExpired):
            _run_grouped([sys.executable, '-c', parent], cwd=self.root,
                         capture_output=True, text=True, timeout=0.2, check=False)
        time.sleep(1.1)
        self.assertFalse(marker.exists(), 'child process escaped preflight timeout')

    def test_timeout_and_missing_tool_are_reported_without_pass(self):
        from subprocess import TimeoutExpired
        fake = Mock(side_effect=TimeoutExpired('pnpm', 2))
        result = preflight(self.root, run=True, runner=fake)
        self.assertFalse(result['passed'])
        self.assertEqual(result['results'][0]['status'], 'timeout')
        missing = preflight(self.root, run=True, runner=Mock(side_effect=FileNotFoundError('no pnpm')))
        self.assertFalse(missing['passed'])
        self.assertEqual(missing['results'][0]['status'], 'tool-unavailable')


if __name__ == '__main__':
    unittest.main()
