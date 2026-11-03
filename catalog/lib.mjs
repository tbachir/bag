/**
 * BAG catalog reader, validator, and safe local-file equip planner.
 * No network, package installation, external execution, or dependencies.
 */
import { readFile, readdir, lstat, realpath, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { constants, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function findBagRoot() {
  const currentFile = fileURLToPath(import.meta.url);
  // Check if running within monorepo checkout (3 levels up from packages/cli/src or 1 level up from catalog)
  const candidateMonorepo = path.resolve(path.dirname(currentFile), '../../..');
  if (existsSync(path.join(candidateMonorepo, '.git')) && existsSync(path.join(candidateMonorepo, 'catalog/items'))) {
    return candidateMonorepo;
  }
  const candidateDirect = path.resolve(path.dirname(currentFile), '..');
  if (existsSync(path.join(candidateDirect, '.git')) && existsSync(path.join(candidateDirect, 'catalog/items'))) {
    return candidateDirect;
  }
  return candidateDirect;
}

export const ROOT = findBagRoot();
const ZONES = new Set(['inventory', 'equipment', 'skill-tree', 'spellbook', 'maps-and-guides', 'loot', 'skills', 'mcp', 'recipes', 'templates', 'packs', 'guides']);
const KINDS = new Set(['library', 'repository', 'resource', 'tool', 'config', 'skill', 'agent', 'plugin', 'mcp', 'script', 'guide', 'pack', 'recipe', 'template']);
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
export async function checkTarget(root) {
  const st = await statOrNull(root);
  check(st && st.isDirectory() && !st.isSymbolicLink(), `Target must be an existing, real directory: ${root}`);
  return await realpath(root);
}
export async function checkDestination(root, rel) {
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

export function resolveAgentSkillPath(skillId, agent = 'agents') {
  switch (agent) {
    case 'gemini': return `.gemini/skills/${skillId}/SKILL.md`;
    case 'cursor': return `.cursor/skills/${skillId}/SKILL.md`;
    case 'claude':
    case 'claude-code': return `.claude/skills/${skillId}/SKILL.md`;
    case 'root': return `skills/${skillId}/SKILL.md`;
    case 'agents':
    default:
      return `.agents/skills/${skillId}/SKILL.md`;
  }
}

export async function planItem(catalog, id, target, root = ROOT, options = {}) {
  check(nonempty(target), 'Pass --target <existing project directory>');
  const destRoot = await checkTarget(path.resolve(target));
  const item = catalog.items.get(id);
  check(item, `Unknown item: ${id}`);
  const actions = [];
  if (item.kind === 'skill') {
    const destRel = resolveAgentSkillPath(item.id, options.agent);
    const dest = await checkDestination(destRoot, destRel);
    actions.push({
      item: item.id,
      mode: 'skill',
      source: item.source.path,
      destination: destRel,
      status: dest.exists ? 'exists-skip' : 'create'
    });

    // Plan supporting files in subdirectories of the skill folder (e.g. references/, scripts/)
    const skillSourceDir = path.posix.dirname(item.source.path);
    const skillDestDir = path.posix.dirname(destRel);
    const skillDirFull = path.join(root, ...skillSourceDir.split('/'));

    async function collectSkillSupportingFiles(dirRel) {
      const fullDir = path.join(root, ...dirRel.split('/'));
      let entries = [];
      try {
        entries = await readdir(fullDir, { withFileTypes: true });
      } catch (e) {
        if (e.code === 'ENOENT') return;
        throw e;
      }
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const entryRel = `${dirRel}/${entry.name}`;
        if (entry.isDirectory()) {
          await collectSkillSupportingFiles(entryRel);
        } else if (entry.isFile()) {
          const subRel = entryRel.slice(skillSourceDir.length + 1);
          const targetRel = `${skillDestDir}/${subRel}`;
          const fileDest = await checkDestination(destRoot, targetRel);
          actions.push({
            item: item.id,
            mode: 'skill',
            source: entryRel,
            destination: targetRel,
            status: fileDest.exists ? 'exists-skip' : 'create'
          });
        }
      }
    }

    try {
      const rootEntries = await readdir(skillDirFull, { withFileTypes: true });
      for (const entry of rootEntries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await collectSkillSupportingFiles(`${skillSourceDir}/${entry.name}`);
        }
      }
    } catch {}
  } else if (item.mode === 'copy') {
    for (const mapping of item.files || []) {
      const dest = await checkDestination(destRoot, mapping.to);
      actions.push({
        item: item.id,
        mode: 'copy',
        source: mapping.from,
        destination: mapping.to,
        status: dest.exists ? 'exists-skip' : 'create'
      });
    }
  } else {
    actions.push({
      item: item.id,
      mode: 'reference',
      source: item.source.path,
      status: 'reference-only'
    });
  }
  return { item: id, target: destRoot, dryRun: true, actions };
}

export async function installSkill(catalog, id, target, options = {}, root = ROOT) {
  const item = catalog.items.get(id);
  check(item, `Unknown item: ${id}`);
  check(item.kind === 'skill', `Item "${id}" is not a skill (kind: ${item.kind})`);
  const plan = await planItem(catalog, id, target, root, options);
  if (!options.apply) return plan;

  // Validate lockfile destination before copying ANY installation files
  if (options.lockfile !== false) {
    await checkDestination(plan.target, 'skills-lock.json');
  }

  const actions = [];
  let installedHash = null;
  let installedPath = null;

  for (const action of plan.actions) {
    if (action.status !== 'create') {
      actions.push(action);
      continue;
    }
    const from = await safeSource(root, action.source);
    const dest = await checkDestination(plan.target, action.destination);
    if (dest.exists) {
      actions.push({ ...action, status: 'exists-skip' });
      continue;
    }
    await mkdir(path.dirname(dest.full), { recursive: true });
    await checkDestination(plan.target, action.destination);
    try {
      await copyFile(from, dest.full, constants.COPYFILE_EXCL);
      actions.push({ ...action, status: 'created' });
      if (action.source === item.source.path) {
        const content = await readFile(from);
        installedHash = createHash('sha256').update(content).digest('hex');
        installedPath = action.source;
      }
    } catch (error) {
      if (error.code === 'EEXIST') actions.push({ ...action, status: 'exists-skip' });
      else throw error;
    }
  }

  if (!installedHash && plan.actions.length > 0) {
    const mainAction = plan.actions.find(a => a.source === item.source.path) || plan.actions[0];
    const from = await safeSource(root, mainAction.source);
    const content = await readFile(from);
    installedHash = createHash('sha256').update(content).digest('hex');
    installedPath = mainAction.source;
  }

  let lockfileUpdated = false;
  if (installedHash && options.lockfile !== false) {
    await checkDestination(plan.target, 'skills-lock.json');
    const lockPath = path.join(plan.target, 'skills-lock.json');
    let lockData = { version: 1, skills: {} };
    try {
      const raw = await readFile(lockPath, 'utf8');
      lockData = JSON.parse(raw);
      if (!lockData.skills) lockData.skills = {};
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    lockData.skills[id] = {
      source: 'tbachir/bag',
      sourceType: 'github',
      skillPath: installedPath,
      computedHash: installedHash
    };
    const sortedSkills = {};
    for (const k of Object.keys(lockData.skills).sort()) {
      sortedSkills[k] = lockData.skills[k];
    }
    lockData.skills = sortedSkills;
    await writeFile(lockPath, JSON.stringify(lockData, null, 2) + '\n', 'utf8');
    lockfileUpdated = true;
  }

  return { ...plan, dryRun: false, actions, lockfileUpdated };
}

export const FUNCTION_REGISTRY = new Map([
  ['clean-code', {
    script: 'spellbook/scripts/clean-code.mjs',
    description: 'Audit code hygiene, style, and code smells, with optional fix mode'
  }],
  ['ui-studio', {
    script: 'spellbook/scripts/ui-studio.mjs',
    description: 'Generate interactive HTML prototype and route/component audit'
  }],
  ['skill-audit', {
    script: 'spellbook/scripts/check-skill-freshness.mjs',
    description: 'Audit skill freshness policy and review statuses'
  }],
  ['validate', {
    script: 'spellbook/scripts/validate.mjs',
    description: 'Validate repository structure, zones, and local links'
  }]
]);

export function listFunctions() {
  return [...FUNCTION_REGISTRY.entries()].map(([name, meta]) => ({
    name,
    script: meta.script,
    description: meta.description
  }));
}

export async function executeFunction(name, args = [], options = {}, root = ROOT) {
  const fn = FUNCTION_REGISTRY.get(name);
  check(fn, `Unknown or unauthorized function: "${name}". Allowed: ${[...FUNCTION_REGISTRY.keys()].join(', ')}`);
  const scriptPath = inRoot(root, fn.script);
  check((await lstat(scriptPath)).isFile(), `Script file missing: ${fn.script}`);

  let cwd = root;
  const finalArgs = [...args];

  if (options.target) {
    const fullTarget = path.resolve(options.target);
    const st = await statOrNull(fullTarget);
    if (!st || st.isSymbolicLink()) fail(`Target must be an existing, real directory or file: ${options.target}`);
    if (st.isDirectory()) {
      cwd = await realpath(fullTarget);
    } else {
      cwd = path.dirname(await realpath(fullTarget));
    }
    if (!finalArgs.includes('--target')) {
      finalArgs.push('--target', fullTarget);
    }
  }

  return new Promise((resolve) => {
    execFile(process.execPath, [scriptPath, ...finalArgs], {
      cwd,
      env: process.env,
      maxBuffer: 10 * 1024 * 1024
    }, (error, stdout, stderr) => {
      resolve({
        function: name,
        exitCode: error ? (typeof error.code === 'number' ? error.code : 1) : 0,
        success: !error,
        stdout: stdout || '',
        stderr: stderr || '',
        error: error ? error.message : null
      });
    });
  });
}
