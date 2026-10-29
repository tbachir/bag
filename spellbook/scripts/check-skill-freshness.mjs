#!/usr/bin/env node
/**
 * Read-only freshness audit for BAG skills.
 * Usage: node spellbook/scripts/check-skill-freshness.mjs [--json] [--strict] [--date YYYY-MM-DD]
 * No dependencies, network calls, writes, or implicit verification.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const base = path.join(root, 'skill-tree', 'skills');
const flags = new Set(process.argv.slice(2));
const dateArg = process.argv.find((_, i, a) => a[i-1] === '--date');
const now = dateArg ? new Date(dateArg + 'T00:00:00Z') : new Date();
if (Number.isNaN(now.getTime())) { console.error('Invalid --date'); process.exit(2); }
const entries = await readdir(base, { withFileTypes: true });
const results = [];
for (const entry of entries) {
  if (!entry.isDirectory() || entry.name.startsWith('_')) continue;
  const name = entry.name;
  let source;
  try { source = await readFile(path.join(base,name,'SKILL.md'),'utf8'); } catch { continue; }
  const fm = source.match(/^---\s*\n([\s\S]*?)\n---(?:\n|$)/)?.[1] ?? '';
  // Interpret only the exact metadata fields we own; do not execute YAML.
  const fast = /^\s*policy:\s*fast-changing\s*$/m.test(fm);
  if (!fast) continue;
  const interval = Number(fm.match(/^\s*review_interval_days:\s*(\d+)\s*$/m)?.[1] ?? 30);
  const verified = fm.match(/^\s*last_verified:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)?.[1] ?? null;
  const parsed = verified ? new Date(verified + 'T00:00:00Z') : null;
  const valid = parsed && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === verified && parsed <= now;
  const days = valid ? Math.floor((now-parsed)/86400000) : null;
  const stale = !valid || !Number.isInteger(interval) || interval < 1 || days > interval;
  results.push({skill:name,last_verified:verified,age_days:days,review_interval_days:interval,status:stale?'STALE':'CURRENT'});
}
results.sort((a,b)=>a.skill.localeCompare(b.skill));
if (flags.has('--json')) console.log(JSON.stringify({as_of:now.toISOString().slice(0,10),skills:results},null,2));
else {
  console.log('Skill freshness as of '+now.toISOString().slice(0,10));
  for (const r of results) console.log(r.status.padEnd(8)+' '+r.skill+' (last verified '+(r.last_verified??'missing')+', age '+(r.age_days??'?')+'d, interval '+r.review_interval_days+'d)');
  console.log('Reminder: CURRENT is based on metadata only; this script does not verify upstream facts.');
}
if (flags.has('--strict') && results.some(x=>x.status==='STALE')) process.exitCode=1;
