#!/usr/bin/env node
/**
 * Explicit Fumadocs scaffold: preview by default. Only --apply starts the official
 * create-fumadocs-app CLI, which downloads and executes third-party packages.
 */
import { existsSync, readdirSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const value = (key) => {
  const i = args.indexOf(key);
  if (i === -1 || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(key + ' requires a path');
  return args[i + 1];
};
function walk(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? walk(path.join(dir, entry.name), relative) : [relative];
  });
}
function fail(message) { console.error('Fumadocs Starter: ' + message); process.exit(1); }

try {
  const unexpected = args.filter((x, i) => x !== '--apply' && x !== '--target' && !(i > 0 && args[i - 1] === '--target'));
  if (unexpected.length) throw new Error('Unknown arguments: ' + unexpected.join(', '));
  const target = path.resolve(value('--target'));
  if (existsSync(target)) throw new Error('Target already exists; choose a new directory to avoid overwrites: ' + target);
  const overlayRoot = path.join(root, 'overlay');
  const relativeFiles = walk(overlayRoot);
  const skillSource = path.resolve(root, '../../skill-tree/skills/docs-architect/SKILL.md');
  if (!existsSync(skillSource)) throw new Error('Canonical docs-architect skill is missing from BAG checkout');
  const command = ['create-fumadocs-app@latest', target, '--template', '+next+fuma-docs-mdx+static', '--no-git', '--install', '--pm', 'pnpm', '--yes'];
  const plan = {
    dryRun: !args.includes('--apply'),
    target,
    generator: { executable: 'npx', arguments: command },
    overlay: [...relativeFiles, '.agents/skills/docs-architect/SKILL.md'],
    changes: ['Create a new Fumadocs application', 'Add sample documentation section', 'Register it in root meta.json when needed'],
    warning: 'Applying downloads and executes the official CLI and installs dependencies. Nothing runs during preview.'
  };
  console.log(JSON.stringify(plan, null, 2));
  if (!args.includes('--apply')) process.exit(0);

  const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(executable, command, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('Official scaffold failed (exit ' + result.status + '). Inspect the target; it is not deleted.');
  for (const relative of relativeFiles) {
    const source = path.join(overlayRoot, relative);
    const destination = path.join(target, relative);
    if (existsSync(destination)) throw new Error('Refusing to overwrite generated file: ' + relative);
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(source, destination);
  }
  const skillDestination = path.join(target, '.agents/skills/docs-architect/SKILL.md');
  mkdirSync(path.dirname(skillDestination), { recursive: true });
  if (existsSync(skillDestination)) throw new Error('Refusing to overwrite docs-architect skill');
  copyFileSync(skillSource, skillDestination);

  const navigation = path.join(target, 'content/docs/meta.json');
  if (existsSync(navigation)) {
    const meta = JSON.parse(readFileSync(navigation, 'utf8'));
    if (Array.isArray(meta.pages) && !meta.pages.includes('docs-architecture') && !meta.pages.includes('...')) {
      meta.pages.push('docs-architecture');
      writeFileSync(navigation, JSON.stringify(meta, null, 2) + '\n');
    }
  }
  console.log('Fumadocs starter created at ' + target + '. Run pnpm dev or pnpm build inside it.');
} catch (err) { fail(err.message); }
