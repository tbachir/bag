import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(app, '../..');
const config = JSON.parse(await readFile(path.join(app, 'i18n.config.json'), 'utf8'));
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const excluded = /(^|\/)(AGENTS|SKILL)\.md$/i;
const scope = /^(inventory|equipment|skill-tree|spellbook|maps-and-guides|loot|loadouts|catalog|templates|demo)\//;
const sources = tracked.filter((file) => (scope.test(file) || !file.includes('/')) && /\.mdx?$/i.test(file) && !excluded.test(file));
const sourcesSet = new Set(sources);
const translations = tracked.filter((file) => file.startsWith('apps/docs/translations/fr/') && /\.mdx?$/i.test(file));
let stale = 0, orphaned = 0;
for (const file of translations) {
  const source = file.slice('apps/docs/translations/fr/'.length);
  if (!sourcesSet.has(source)) { console.error('ORPHAN', file); orphaned++; continue; }
  const meta = file + '.source-sha256';
  if (!tracked.includes(meta)) { console.error('UNTRACKED SOURCE REVISION', file, '(missing .source-sha256)'); stale++; continue; }
  const current = createHash('sha256').update(await readFile(path.join(root, source))).digest('hex');
  const recorded = (await readFile(path.join(root, meta), 'utf8')).trim();
  if (current !== recorded) { console.error('STALE', file); stale++; }
}
console.log(JSON.stringify({ defaultLocale: config.defaultLocale, fallbackLocale: config.fallbackLocale, sourcePages: sources.length, frenchTranslations: translations.length, missingTranslations: sources.length - translations.length, stale, orphaned }, null, 2));
if (stale || orphaned) process.exitCode = 1;
