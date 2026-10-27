import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const BASE = join(ROOT, 'skill-tree/skills/o2switch-cloud');
const readJson = async (path) => JSON.parse(await readFile(join(BASE, path), 'utf8'));

test('o2switch Cloud skill has 11 cPanel sections and 65 official tool pages', async () => {
  const catalog = await readJson('references/cpanel-catalog.json');
  assert.equal(catalog.sections.length, 11);
  const tools = catalog.sections.flatMap(section => section.tools);
  assert.equal(tools.length, 65);
  for (const tool of tools) {
    assert.match(tool.url, /^https:\/\/faq\.o2switch\.fr\/cpanel\/[a-z0-9/-]+\/$/);
    assert.equal(tool.account_activation, 'not_verified');
  }
  assert.ok(tools.some(t => t.name === 'Redis' && t.url.endsWith('/o2switch/redis/')));
});

test('o2switch Cloud capability decisions preserve uncertainty', async () => {
  const catalog = await readJson('references/capabilities.json');
  assert.equal(catalog.capabilities.length, 31);
  const byId = new Map(catalog.capabilities.map(c => [c.id, c]));
  assert.equal(byId.get('redis').status, 'documented');
  assert.equal(byId.get('postgresql').status, 'conditional');
  for (const id of ['docker','postgis','pgvector','websockets','sse','workers']) {
    assert.equal(byId.get(id).status, 'verify', id);
  }
  assert.equal(byId.get('redis_queue').status, 'not_suitable');
  assert.ok(catalog.capabilities.every(c => c.official_sources.length && c.account_verification));
});

test('o2switch Cloud appears in BAG discovery as a reference-only skill', async () => {
  const { readCatalog, searchItems } = await import('../catalog/lib.mjs');
  const catalog = await readCatalog();
  const skill = catalog.items.get('o2switch-cloud');
  assert.equal(skill.zone,'skill-tree');
  assert.equal(skill.mode,'reference');
  assert.ok(searchItems(catalog, 'o2switch').some(item => item.id === 'o2switch-cloud'));
});
