import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { readCatalog, planItem, installSkill } from '../catalog/lib.mjs';

test('planItem: generates dry-run plan for a skill without writing files', async () => {
  const catalog = await readCatalog();
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bag-plan-test-'));
  try {
    const plan = await planItem(catalog, 'clean-code', tmpDir);
    assert.equal(plan.item, 'clean-code');
    assert.equal(plan.dryRun, true);
    assert.equal(plan.actions.length, 1);
    assert.equal(plan.actions[0].status, 'create');
    assert.equal(plan.actions[0].destination, '.agents/skills/clean-code/SKILL.md');

    // Verify nothing written on dryRun
    const destFile = path.join(tmpDir, '.agents/skills/clean-code/SKILL.md');
    let exists = true;
    try { await fs.stat(destFile); } catch { exists = false; }
    assert.equal(exists, false);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('installSkill: installs skill with --apply and updates skills-lock.json', async () => {
  const catalog = await readCatalog();
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bag-install-test-'));
  try {
    const res = await installSkill(catalog, 'clean-code', tmpDir, { apply: true, agent: 'agents' });
    assert.equal(res.dryRun, false);
    assert.equal(res.actions[0].status, 'created');
    assert.equal(res.lockfileUpdated, true);

    // Verify file exists and has valid content
    const destFile = path.join(tmpDir, '.agents/skills/clean-code/SKILL.md');
    const content = await fs.readFile(destFile, 'utf8');
    assert.ok(content.includes('name: clean-code'));
    assert.ok(content.includes('Clean Code & Refactoring'));

    // Verify skills-lock.json
    const lockPath = path.join(tmpDir, 'skills-lock.json');
    const lockRaw = await fs.readFile(lockPath, 'utf8');
    const lockData = JSON.parse(lockRaw);
    assert.equal(lockData.version, 1);
    assert.ok(lockData.skills['clean-code']);
    assert.equal(lockData.skills['clean-code'].source, 'tbachir/bag');
    assert.equal(typeof lockData.skills['clean-code'].computedHash, 'string');
    assert.equal(lockData.skills['clean-code'].computedHash.length, 64);

    // Second install must skip overwrite (exists-skip)
    const secondRes = await installSkill(catalog, 'clean-code', tmpDir, { apply: true });
    assert.equal(secondRes.actions[0].status, 'exists-skip');
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('installSkill: supports client directory styles (gemini, cursor, claude)', async () => {
  const catalog = await readCatalog();
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bag-client-test-'));
  try {
    const geminiPlan = await planItem(catalog, 'clean-code', tmpDir, undefined, { agent: 'gemini' });
    assert.equal(geminiPlan.actions[0].destination, '.gemini/skills/clean-code/SKILL.md');

    const cursorPlan = await planItem(catalog, 'clean-code', tmpDir, undefined, { agent: 'cursor' });
    assert.equal(cursorPlan.actions[0].destination, '.cursor/skills/clean-code/SKILL.md');

    const claudePlan = await planItem(catalog, 'clean-code', tmpDir, undefined, { agent: 'claude' });
    assert.equal(claudePlan.actions[0].destination, '.claude/skills/clean-code/SKILL.md');
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('installSkill: rejects non-existent item or non-skill item', async () => {
  const catalog = await readCatalog();
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bag-reject-test-'));
  try {
    await assert.rejects(
      async () => await installSkill(catalog, 'non-existent-skill', tmpDir),
      /Unknown item/
    );

    await assert.rejects(
      async () => await installSkill(catalog, 'editorconfig', tmpDir),
      /not a skill/
    );
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('installSkill: plans and installs skill supporting directory files (references, scripts)', async () => {
  const catalog = await readCatalog();
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bag-support-files-test-'));
  try {
    const plan = await planItem(catalog, 'o2switch-cloud', tmpDir);
    assert.equal(plan.item, 'o2switch-cloud');
    assert.ok(plan.actions.length >= 5, 'Must plan SKILL.md and supporting files');
    assert.ok(plan.actions.some(a => a.destination.includes('00-plan-cpanel.md')));
    assert.ok(plan.actions.some(a => a.destination.includes('capabilities.json')));
    assert.ok(plan.actions.some(a => a.destination.includes('query.py')));

    const res = await installSkill(catalog, 'o2switch-cloud', tmpDir, { apply: true });
    assert.equal(res.dryRun, false);

    const cpanelPlan = path.join(tmpDir, '.agents/skills/o2switch-cloud/references/00-plan-cpanel.md');
    const capabilities = path.join(tmpDir, '.agents/skills/o2switch-cloud/references/capabilities.json');
    const queryScript = path.join(tmpDir, '.agents/skills/o2switch-cloud/scripts/query.py');

    assert.ok((await fs.stat(cpanelPlan)).isFile());
    assert.ok((await fs.stat(capabilities)).isFile());
    assert.ok((await fs.stat(queryScript)).isFile());
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('installSkill: rejects symbolic links at lockfile destination', async () => {
  const catalog = await readCatalog();
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bag-lock-symlink-test-'));
  const outsideDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bag-outside-'));
  const outsideLock = path.join(outsideDir, 'external-lock.json');
  await fs.writeFile(outsideLock, '{"version": 1, "skills": {}}\n', 'utf8');

  try {
    const targetLockLink = path.join(tmpDir, 'skills-lock.json');
    await fs.symlink(outsideLock, targetLockLink, 'file');

    await assert.rejects(
      async () => await installSkill(catalog, 'clean-code', tmpDir, { apply: true }),
      /symbolic link/
    );

    const externalContent = await fs.readFile(outsideLock, 'utf8');
    assert.equal(externalContent, '{"version": 1, "skills": {}}\n');

    let skillInstalled = true;
    try {
      await fs.stat(path.join(tmpDir, '.agents/skills/clean-code'));
    } catch {
      skillInstalled = false;
    }
    assert.equal(skillInstalled, false, 'No skill files should be installed when lockfile destination is unsafe');
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
    await fs.rm(outsideDir, { recursive: true, force: true });
  }
});
