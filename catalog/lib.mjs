/**
 * BAG catalog reader, validator, and safe local-file equip planner.
 * No network, package installation, external execution, or dependencies.
 */
import { readFile, readdir, lstat, realpath, mkdir, copyFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZONES = new Set(['inventory', 'equipment', 'skill-tree', 'spellbook', 'maps-and-guides', 'loot']);
const KINDS = new Set(['library', 'repository', 'resource', 'tool', 'config', 'skill', 'agent', 'plugin', 'mcp', 'script', 'guide']);
const STATUSES = new Set(['evaluating', 'ready', 'archived']);
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function object(value) { return !!value && typeof value === 'object' && !Array.isArray(value); }
function nonempty(value) { return typeof value === 'string' && value.trim().length > 0; }
function onlyKeys(obj, keys, context) {
  for (const key of Object.keys(obj)) check(keys.includes(key), `${context}: unexpected key "${key}"`);
}
export function safeRelative(value) {
  return typeof value === 'string' &&
    !path.posix.isAbsolute(value) &&
    !path.win32.isAbsolute(value) &&
    !value.includes('\\') &&
    value.split('/').every(part => part !== '.' && part !== '..' && /^[a-zA-Z0-9._-]+$/.test(part) && part.length > 0);
}
function inRoot(root, rel) {
  check(safeRelative(rel), `Unsafe relative path: ${rel}`);
  const full = path.resolve(root, ...rel.split('/'));
  const back = path.relative(root, full);
  check(back !== '..' && !back.startsWith(`..${path.sep}`) && !path.isAbsolute(back), `Path escapes root: ${rel}`);
  return full;
}
async function statOrNull(file) {
  try { return await lstat(file); }
  catch (err) { if (err.code === 'ENOENT') return null; throw err; }
}
async function safeSource(root, rel) {
  const full = inRoot(root, rel);
  const segments = rel.split('/');
  let current = root;
  for (const segment of segments) {
    current = path.join(current, segment);
    const st = await statOrNull(current);
    check(st && !st.isSymbolicLink(), `Source missing or symbolic link: ${rel}`);
  }
  check((await lstat(full)).isFile(), `Source is not a regular file: ${rel}`);
  return full;
}
function validateItem(m, filename) {
  const prefix = `Item ${filename}`;
  check(object(m), `${prefix}: expected object`);
  onlyKeys(m, ['schemaVersion','id','title','summary','zone','kind','status','tags','source','mode','files','notes'], prefix);
  check(m.schemaVersion === 1, `${prefix}: unsupported schemaVersion`);
  check(ID.test(m.id || ''), `${prefix}: invalid id`);
  check(filename === `${m.id}.json`, `${prefix}: filename/id mismatch`);
  check(nonempty(m.title) && nonempty(m.summary), `${prefix}: missing title or summary`);
  check(ZONES.has(m.zone) && KINDS.has(m.kind) && STATUSES.has(m.status), `${prefix}: invalid zone, kind, or status`);
  check(Array.isArray(m.tags) && m.tags.every(t => typeof t === 'string' && ID.test(t)) && new Set(m.tags).size === m.tags.length, `${prefix}: invalid tags`);
  check(object(m.source), `${prefix}: expected source object`);
  onlyKeys(m.source, ['type','path'], `${prefix}.source`);
  check(m.source.type === 'local' && safeRelative(m.source.path), `${prefix}: invalid local source`);
  check(['copy','reference'].includes(m.mode), `${prefix}: invalid mode`);
  if (m.notes !== undefined) check(typeof m.notes === 'string', `${prefix}: invalid notes`);
  if (m.mode === 'copy') {
    check(m.status === 'ready', `${prefix}: only ready items may be copied`);
    check(Array.isArray(m.files) && m.files.length > 0, `${prefix}: missing copy files`);
    for (const f of m.files) {
      check(object(f), `${prefix}: invalid file mapping`);
      onlyKeys(f, ['from','to'], `${prefix}.files`);
      check(safeRelative(f.from) && safeRelative(f.to), `${prefix}: unsafe copy path`);
    }
  } else check(m.files === undefined, `${prefix}: reference items must not carry copy files`);
}
function validateLoadout(m, filename, items) {
  const prefix = `Loadout ${filename}`;
  check(object(m), `${prefix}: expected object`);
  onlyKeys(m, ['schemaVersion','id','title','summary','items'], prefix);
  check(m.schemaVersion === 1 && ID.test(m.id || ''), `${prefix}: invalid version or id`);
  check(filename === `${m.id}.json`, `${prefix}: filename/id mismatch`);
  check(nonempty(m.title) && nonempty(m.summary), `${prefix}: missing title or summary`);
  check(Array.isArray(m.items) && m.items.length > 0, `${prefix}: empty loadout`);
  const seen = new Set(); const destinations = new Set();
  for (const ref of m.items) {
    check(object(ref), `${prefix}: invalid item reference`);
    onlyKeys(ref, ['id','note'], `${prefix}.items`);
    check(typeof ref.id === 'string' && items.has(ref.id), `${prefix}: unknown item ${ref.id}`);
    check(!seen.has(ref.id), `${prefix}: duplicate item ${ref.id}`);
    if (ref.note !== undefined) check(typeof ref.note === 'string', `${prefix}: invalid note`);
    seen.add(ref.id);
    const item = items.get(ref.id);
    check(item.status === 'ready', `${prefix}: item ${ref.id} not ready`);
    for (const file of item.files || []) {
      check(!destinations.has(file.to), `${prefix}: duplicate destination ${file.to}`);
      destinations.add(file.to);
    }
  }
}
async function readManifests(dir) {
  const entries = (await readdir(dir, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name));
  const manifests = [];
  for (const entry of entries) {
    check(entry.isFile() && entry.name.endsWith('.json'), `Unexpected catalog entry: ${path.join(dir,entry.name)}`);
    const raw = await readFile(path.join(dir, entry.name), 'utf8');
    let data;
    try { data = JSON.parse(raw); } catch { fail(`Invalid JSON: ${entry.name}`); }
    manifests.push({ filename: entry.name, data });
  }
  return manifests;
}
export async function readCatalog(root = ROOT) {
  const items = new Map(); const loadouts = new Map();
  for (const { filename, data } of await readManifests(path.join(root, 'catalog/items'))) {
    validateItem(data, filename);
    check(!items.has(data.id), `Duplicate item id: ${data.id}`);
    await safeSource(root, data.source.path);
    for (const file of data.files || []) await safeSource(root, file.from);
    items.set(data.id, data);
  }
  for (const { filename, data } of await readManifests(path.join(root, 'catalog/loadouts'))) {
    validateLoadout(data, filename, items);
    check(!loadouts.has(data.id), `Duplicate loadout id: ${data.id}`);
    loadouts.set(data.id, data);
  }
  return { items, loadouts };
}
export function searchItems(catalog, query) {
  const parts = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return [...catalog.items.values()].filter(i => {
    const text = [i.id, i.title, i.summary, i.zone, i.kind, ...i.tags].join(' ').toLowerCase();
    return parts.every(p => text.includes(p));
  });
}
export function describeLoadout(catalog, id) {
  const loadout = catalog.loadouts.get(id);
  check(loadout, `Unknown loadout: ${id}`);
  return {...loadout, resolvedItems: loadout.items.map(ref => ({...ref, item: catalog.items.get(ref.id)}))};
}
async function checkTarget(root) {
  const st = await statOrNull(root);
  check(st && st.isDirectory() && !st.isSymbolicLink(), `Target must be an existing, real directory: ${root}`);
  return await realpath(root);
}
async function checkDestination(root, rel) {
  const full = inRoot(root, rel);
  const parts = rel.split('/');
  let current = root;
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    const st = await statOrNull(current);
    if (st?.isSymbolicLink()) fail(`Destination contains a symbolic link: ${rel}`);
    if (i < parts.length - 1 && st && !st.isDirectory()) fail(`Destination parent is not a directory: ${rel}`);
    if (i === parts.length - 1 && st && !st.isFile()) fail(`Destination is not a regular file: ${rel}`);
  }
  return { full, exists: !!await statOrNull(full) };
}
export async function planLoadout(catalog, id, target, root = ROOT) {
  check(nonempty(target), 'Pass --target <existing project directory>');
  const destRoot = await checkTarget(path.resolve(target));
  const loadout = describeLoadout(catalog, id);
  const actions = [];
  for (const { item } of loadout.resolvedItems) {
    if (item.mode === 'reference') {
      actions.push({ item: item.id, mode: 'reference', source: item.source.path, status: 'reference-only' });
    } else {
      for (const mapping of item.files) {
        const dest = await checkDestination(destRoot, mapping.to);
        actions.push({ item: item.id, mode: 'copy', source: mapping.from, destination: mapping.to, status: dest.exists ? 'exists-skip' : 'create' });
      }
    }
  }
  return { loadout: id, target: destRoot, dryRun: true, actions };
}
export async function applyPlan(catalog, id, target, root = ROOT) {
  const plan = await planLoadout(catalog, id, target, root);
  const actions = [];
  for (const action of plan.actions) {
    if (action.status !== 'create') { actions.push(action); continue; }
    // Recheck source and target immediately before writing. Refuse overwrite even on races.
    const from = await safeSource(root, action.source);
    const dest = await checkDestination(plan.target, action.destination);
    if (dest.exists) { actions.push({...action, status:'exists-skip'}); continue; }
    await mkdir(path.dirname(dest.full), { recursive: true });
    await checkDestination(plan.target, action.destination);
    try {
      await copyFile(from, dest.full, constants.COPYFILE_EXCL);
      actions.push({...action, status:'created'});
    } catch (error) {
      if (error.code === 'EEXIST') actions.push({...action, status:'exists-skip'});
      else throw error;
    }
  }
  return {...plan, dryRun: false, actions};
}
