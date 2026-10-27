#!/usr/bin/env node
/**
 * Read-only Markdown finder for BAG. Usage: node spellbook/scripts/find.mjs "search term"
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const query = process.argv.slice(2).join(' ').trim().toLowerCase();
const excluded = new Set(['.git', '.next', '.cache', '.turbo', 'node_modules', 'dist', 'build', 'coverage']);

if (!query) {
  console.error('Usage: node spellbook/scripts/find.mjs "search term"');
  process.exitCode = 2;
} else {
  let shown = 0;
  const limit = 40;
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (shown >= limit) return;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && !excluded.has(entry.name) && !entry.name.startsWith('.')) {
        await walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const lines = (await readFile(full, 'utf8')).split(/\r?\n/);
        for (let i = 0; i < lines.length && shown < limit; i++) {
          if (lines[i].toLowerCase().includes(query)) {
            const rel = path.relative(root, full).replaceAll(path.sep, '/');
            console.log(`${rel}:${i + 1}: ${lines[i].trim().slice(0, 180)}`);
            shown++;
          }
        }
      }
    }
  }
  await walk(root);
  if (!shown) console.log(`No Markdown results for "${query}".`);
  else if (shown >= limit) console.log(`Showing the first ${limit} matches.`);
}
