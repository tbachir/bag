import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'packages/cli/bin/bag.mjs');

test('CLI: --help displays usage and primitives', async () => {
  const { stdout } = await exec(process.execPath, [CLI, '--help']);
  assert.ok(stdout.includes('Usage:'));
  assert.ok(stdout.includes('Primitives:'));
  assert.ok(stdout.includes('bag skill'));
  assert.ok(stdout.includes('bag mcp'));
  assert.ok(stdout.includes('bag recipe'));
  assert.ok(stdout.includes('bag template'));
  assert.ok(stdout.includes('bag pack'));
});

test('CLI: skill list and show', async () => {
  const { stdout: listOut } = await exec(process.execPath, [CLI, 'skill', 'list', '--json']);
  const list = JSON.parse(listOut);
  assert.ok(Array.isArray(list));
  assert.ok(list.length >= 25);
  assert.ok(list.some(s => s.id === 'clean-code'));

  const { stdout: showOut } = await exec(process.execPath, [CLI, 'skill', 'show', 'clean-code', '--json']);
  const show = JSON.parse(showOut);
  assert.equal(show.id, 'clean-code');
  assert.ok(show.content.includes('name: clean-code'));
});

test('CLI: mcp list and add with dry-run and apply', async () => {
  const { stdout: listOut } = await exec(process.execPath, [CLI, 'mcp', 'list', '--json']);
  const list = JSON.parse(listOut);
  assert.ok(Array.isArray(list));
  assert.ok(list.some(s => s.server === 'supabase'));

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bag-cli-mcp-'));
  try {
    // Dry-run
    const { stdout: dryOut } = await exec(process.execPath, [
      CLI, 'mcp', 'add', 'supabase', '-a', 'cursor', '--target', tmpDir, '--json'
    ]);
    const dry = JSON.parse(dryOut);
    assert.equal(dry.status, 'dry-run');
    assert.equal(dry.server, 'supabase');

    // Apply
    const { stdout: applyOut } = await exec(process.execPath, [
      CLI, 'mcp', 'add', 'supabase', '-a', 'cursor', '--target', tmpDir, '--apply', '--json'
    ]);
    const applied = JSON.parse(applyOut);
    assert.equal(applied.status, 'installed');

    // Verify written file
    const configFile = path.join(tmpDir, '.cursor/mcp.json');
    const content = JSON.parse(await fs.readFile(configFile, 'utf8'));
    assert.ok(content.mcpServers.supabase);
    assert.equal(content.mcpServers.supabase.command, 'npx');
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('CLI: recipe list and show', async () => {
  const { stdout: listOut } = await exec(process.execPath, [CLI, 'recipe', 'list', '--json']);
  const list = JSON.parse(listOut);
  assert.ok(Array.isArray(list));
  assert.ok(list.some(r => r.recipe === 'auth'));

  const { stdout: showOut } = await exec(process.execPath, [CLI, 'recipe', 'show', 'auth', '--json']);
  const show = JSON.parse(showOut);
  assert.equal(show.recipe, 'auth');
  assert.ok(show.description.includes('Supabase Auth'));
});

test('CLI: template list and apply (no overwrite)', async () => {
  const { stdout: listOut } = await exec(process.execPath, [CLI, 'template', 'list', '--json']);
  const list = JSON.parse(listOut);
  assert.ok(Array.isArray(list));
  assert.ok(list.some(t => t.id === 'configs/editorconfig'));

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bag-cli-tmpl-'));
  try {
    // Apply template
    const { stdout: applyOut } = await exec(process.execPath, [
      CLI, 'template', 'apply', 'configs/editorconfig', '--target', tmpDir, '--apply', '--json'
    ]);
    const res = JSON.parse(applyOut);
    assert.equal(res.status, 'applied');

    const destFile = path.join(tmpDir, '.editorconfig');
    const content = await fs.readFile(destFile, 'utf8');
    assert.ok(content.includes('root = true'));

    // Attempt overwrite -> should fail
    await assert.rejects(
      exec(process.execPath, [
        CLI, 'template', 'apply', 'configs/editorconfig', '--target', tmpDir, '--apply'
      ]),
      /Destination already exists/
    );
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('CLI: validate passes', async () => {
  const { stdout } = await exec(process.execPath, [CLI, 'validate', '--json']);
  const res = JSON.parse(stdout);
  assert.equal(res.valid, true);
  assert.ok(res.items >= 30);
  assert.ok(res.loadouts >= 5);
});
