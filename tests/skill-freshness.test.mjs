import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checker = path.join(root, 'spellbook/scripts/check-skill-freshness.mjs');
const audited = [
  'repository-auditor', 'reusable-component-extractor', 'api-documentation-quality',
  'prompt-quality-reviewer', 'skill-maintainer', 'docs-architect',
  'fumadocs-engineer', 'ui-ux-design-review', 'agent-ready-documentation',
];
function run(...args) {
  return spawnSync(process.execPath, [checker, ...args], {cwd:root, encoding:'utf8'});
}

test('reviewed fast-changing skills are visible and current on the audit date', () => {
  const r = run('--json','--date','2026-11-01','--strict');
  assert.equal(r.status, 0, r.stderr || r.stdout);
  const parsed = JSON.parse(r.stdout);
  for (const name of audited) {
    const item = parsed.skills.find(s=>s.skill===name);
    assert.ok(item, name+' missing from checker');
    assert.equal(item.status, 'CURRENT', name);
  }
});

test('untracked skills remain visible with --all, not silently classified as verified', () => {
  const r = run('--all','--json','--date','2026-11-01');
  assert.equal(r.status, 0, r.stderr);
  const skills = JSON.parse(r.stdout).skills;
  for (const name of ['addbag','o2switch-cloud']) {
    assert.equal(skills.find(s=>s.skill===name)?.status, 'UNTRACKED');
  }
});

test('strict gate fails on genuinely stale metadata without resetting dates', () => {
  const r = run('--strict','--date','2027-01-01');
  assert.equal(r.status, 1, r.stdout+r.stderr);
  assert.match(r.stdout,/STALE/);
});

test('audited skills use flat string freshness metadata (Agent Skills compatible)', () => {
  for (const name of audited) {
    const text = readFileSync(path.join(root,'skill-tree/skills',name,'SKILL.md'),'utf8');
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    assert.match(frontmatter,/^  bag-freshness-policy: fast-changing$/m,name);
    assert.match(frontmatter,/^  bag-review-interval-days: "30"$/m,name);
    assert.match(frontmatter,/^  bag-last-verified: "2026-\d\d-\d\d"$/m,name);
    assert.doesNotMatch(frontmatter,/^  freshness:/m,name);
  }
});
