import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const cli = path.resolve('equipment/fumadocs-starter/create.mjs');

test('fumadocs starter previews a new app without modifying disk or contacting npm', () => {
  const base = mkdtempSync(path.join(tmpdir(), 'bag-fumadocs-'));
  const target = path.join(base, 'new-documentation-app');
  try {
    const plan = JSON.parse(execFileSync(process.execPath, [cli, '--target', target], { encoding: 'utf8' }));
    assert.equal(plan.dryRun, true);
    assert.equal(plan.target, target);
    assert.ok(plan.generator.arguments.includes('+next+fuma-docs-mdx+static'));
    assert.ok(plan.overlay.includes('content/docs/docs-architecture/meta.json'));
    assert.ok(plan.overlay.includes('.agents/skills/docs-architect/SKILL.md'));
    assert.equal(existsSync(target), false);
  } finally { rmSync(base, { recursive: true, force: true }); }
});
