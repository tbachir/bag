#!/usr/bin/env node
/**
 * Zero-dependency Markdown navigation validator. External links are not checked.
 * Usage: node spellbook/scripts/validate.mjs
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const zones = ['inventory', 'equipment', 'skill-tree', 'spellbook', 'maps-and-guides', 'loot', 'loadouts'];
const excluded = new Set(['.git', '.next', '.cache', '.turbo', 'node_modules', 'dist', 'build', 'coverage']);
const failures = [];
let checked = 0;

async function exists(file) {
  try { await stat(file); return true; } catch { return false; }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory() && !excluded.has(entry.name) && !entry.name.startsWith('.')) await walk(file);
    else if (entry.isFile() && entry.name.endsWith('.md')) {
      const text = await readFile(file, 'utf8');
      const links = text.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g);
      for (const [, original] of links) {
        const raw = original.trim().replace(/^<|>$/g, '').split(/\s+["']/)[0];
        if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(raw)) continue;
        const target = raw.split(/[?#]/)[0];
        if (!target) continue;
        let decoded;
        try { decoded = decodeURIComponent(target); }
        catch { failures.push(`Bad URL encoding: ${path.relative(root, file)} -> ${raw}`); continue; }
        const destination = path.resolve(path.dirname(file), decoded);
        const relative = path.relative(root, destination);
        if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
          failures.push(`Link escapes repository: ${path.relative(root, file)} -> ${raw}`);
        } else if (!await exists(destination)) {
          failures.push(`Missing local link: ${path.relative(root, file)} -> ${raw}`);
        }
        checked++;
      }
    }
  }
}

for (const zone of zones) {
  if (!await exists(path.join(root, zone, 'README.md'))) failures.push(`Missing zone README: ${zone}/README.md`);
}
await walk(root);

if (failures.length) {
  console.error(`❌ BAG validation failed (${failures.length} issues):\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`✅ BAG validation passed: ${zones.length} zones and ${checked} local links checked.`);
}
