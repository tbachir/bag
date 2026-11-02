import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listFunctions, executeFunction } from '../catalog/lib.mjs';

test('listFunctions: exposes allowlisted functions', () => {
  const fns = listFunctions();
  const names = fns.map(f => f.name);
  assert.ok(names.includes('clean-code'));
  assert.ok(names.includes('ui-studio'));
  assert.ok(names.includes('skill-audit'));
  assert.ok(names.includes('validate'));
});

test('executeFunction: successfully calls validate with exitCode 0', async () => {
  const res = await executeFunction('validate');
  assert.equal(res.success, true);
  assert.equal(res.exitCode, 0);
  assert.ok(res.stdout.includes('BAG validation passed'));
});

test('executeFunction: runs clean-code scanner and emits output', async () => {
  const res = await executeFunction('clean-code', ['--target', 'spellbook/scripts/clean-code.mjs', '--json']);
  assert.equal(res.success, true);
  assert.equal(res.exitCode, 0);
  const parsed = JSON.parse(res.stdout);
  assert.equal(typeof parsed.scannedFiles, 'number');
  assert.ok(parsed.scannedFiles >= 1);
});

test('executeFunction: rejects unauthorized function names safely', async () => {
  await assert.rejects(
    async () => await executeFunction('arbitrary-command'),
    /Unknown or unauthorized function/
  );
});
