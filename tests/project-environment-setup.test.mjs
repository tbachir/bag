import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SKILL_DIR = join(ROOT, 'skills/project-environment-setup');

test('project-environment-setup: SKILL.md exists and contains golden rules', async () => {
  const content = await readFile(join(SKILL_DIR, 'SKILL.md'), 'utf8');
  assert.ok(content.includes('name: project-environment-setup'));
  assert.ok(content.includes('Recherche Amont Systématique'));
  assert.ok(content.includes('Minimisation Stricte du Code Custom'));
  assert.ok(content.includes('Gouvernance du Dépôt Dès le Jour 0'));
});

test('project-environment-setup: bag.item.json has prompts and valid schema', async () => {
  const item = JSON.parse(await readFile(join(SKILL_DIR, 'bag.item.json'), 'utf8'));
  assert.equal(item.type, 'skill');
  assert.ok(Array.isArray(item.prompts) && item.prompts.length >= 2);
  assert.ok(item.tags.includes('bootstrap'));
  assert.ok(item.tags.includes('governance'));
});

test('project-environment-setup: governance templates are present in references', async () => {
  await assert.doesNotReject(() => access(join(SKILL_DIR, 'references/AGENTS.md.template')));
  await assert.doesNotReject(() => access(join(SKILL_DIR, 'references/design.md.template')));
  await assert.doesNotReject(() => access(join(SKILL_DIR, 'references/CONTEXT.md.template')));

  const agentsTemplate = await readFile(join(SKILL_DIR, 'references/AGENTS.md.template'), 'utf8');
  assert.ok(agentsTemplate.includes('Commandes de Validation Obligatoires'));

  const designTemplate = await readFile(join(SKILL_DIR, 'references/design.md.template'), 'utf8');
  assert.ok(designTemplate.includes('Tokens de Couleurs'));

  const contextTemplate = await readFile(join(SKILL_DIR, 'references/CONTEXT.md.template'), 'utf8');
  assert.ok(contextTemplate.includes('Décisions d\'Architecture Actées'));
});

test('project-environment-setup: appears in BAG catalog discovery', async () => {
  const { readCatalog, searchItems } = await import('../catalog/lib.mjs');
  const catalog = await readCatalog();
  const skill = catalog.items.get('project-environment-setup');
  assert.ok(skill, 'skill is registered in catalog');
  assert.equal(skill.zone, 'skills');
  assert.equal(skill.kind, 'skill');
  assert.equal(skill.status, 'ready');

  const searchResults = searchItems(catalog, 'bootstrap');
  assert.ok(
    searchResults.some(item => item.id === 'project-environment-setup'),
    'found by keyword search "bootstrap"'
  );
});
