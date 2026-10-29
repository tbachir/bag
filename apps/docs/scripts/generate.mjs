import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir, rm, lstat, copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Slugger from 'github-slugger';
import { stringify as yaml } from 'yaml';
import { parseMarkdown, visit, plainText, serialize } from './markdown.mjs';
import { normalizeItemMetadata, folderNavigation } from './item-metadata.mjs';
import { writeSkillsArchives } from './zip-skills.mjs';

export const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const repoRoot = path.resolve(appDir, '../..');
const zones = ['inventory', 'equipment', 'skill-tree', 'spellbook', 'maps-and-guides', 'loot', 'loadouts'];
const scopes = [...zones, 'catalog', 'templates', 'demo'];
export function inScope(file) {
  return scopes.some((scope) => file.startsWith(`${scope}/`)) || (!file.includes('/') && file.endsWith('.md'));
}
export function pagePath(source) {
  const name = source.replace(/\.(md|mdx)$/i, '').toLowerCase();
  return /(^|\/)readme$/.test(name) ? name.replace(/readme$/, 'index') : name;
}
export function slugsFor(generatedPath) {
  return generatedPath.replace(/\.(md|mdx)$/, '').split('/').filter((part, index, parts) => part !== 'index' || index !== parts.length - 1);
}
function urlFor(slugs) { return `/docs/${slugs.length ? `${slugs.join('/')}/` : ''}`; }
function encodePath(file) { return file.split('/').map(encodeURIComponent).join('/'); }
async function write(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, value);
}
export async function generate({ root = repoRoot, app = appDir, files } = {}) {
  const tracked = files ?? execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  files = tracked;
  files = [...new Set(files.filter(inScope))].sort();
  const entries = [];
  const assets = [];
  const folderConfigs = new Map();
  for (const file of files) {
    if (!/(^|\/)bag\.item\.json$/.test(file)) continue;
    const config = JSON.parse(await readFile(path.join(root, file), 'utf8'));
    folderConfigs.set(path.posix.dirname(file), normalizeItemMetadata(config));
  }
  const outputs = new Map();
  const sourceMap = new Map();
  const contents = new Map();
  for (const file of files) {
    if (file.split('/').some((part) => part === '..') || path.isAbsolute(file)) throw new Error(`Unsafe source path: ${file}`);
    if ((await lstat(path.join(root, file))).isSymbolicLink()) throw new Error(`Symlink source is not allowed: ${file}`);
    const name = path.posix.basename(file);
    const privateEnv = /^\.env(?:\.|$)/i.test(name) && !/^\.env\.(example|sample|template)$/i.test(name);
    if (privateEnv || /\.(pem|key|p12|pfx|secret)$/i.test(name)) throw new Error(`Secret-like source is not publishable: ${file}`);
    if (!/\.(md|mdx)$/i.test(file)) {
      assets.push({ sourcePath: file, url: `/files/${encodePath(file)}` });
      continue;
    }
    const generatedPath = `${pagePath(file)}.md`;
    const slugs = slugsFor(generatedPath);
    const url = urlFor(slugs);
    if (outputs.has(url)) throw new Error(`Route collision: ${file} and ${outputs.get(url)} -> ${url}`);
    outputs.set(url, file);
    const original = await readFile(path.join(root, file), 'utf8');
    const { tree, frontmatter } = parseMarkdown(original);
    const heading = tree.children.find((node) => node.type === 'heading' && node.depth === 1);
    const title = String(frontmatter.title ?? (heading ? plainText(heading) : path.basename(file)));
    const paragraph = tree.children.find((node) => node.type === 'paragraph');
    const description = String(frontmatter.description ?? (paragraph ? plainText(paragraph).slice(0, 180) : `BAG reference: ${file}`));
    if (heading && plainText(heading) === title) tree.children.splice(tree.children.indexOf(heading), 1);
    const slugger = new Slugger();
    const headingIds = new Map();
    visit(tree, (node) => {
      if (node.type !== 'heading') return;
      const headingText = plainText(node);
      const custom = headingText.match(/\s*\{#([^}]+)\}$/);
      const id = custom?.[1] ?? slugger.slug(headingText);
      headingIds.set(id.replace(/[\uFE0E\uFE0F]/g, ''), id);
    });
    const folder = path.posix.dirname(file);
    const item = folderConfigs.get(folder) ?? {};
    const entry = { sourcePath: file, generatedPath, slugs, url, title, description,
      type: item.type ?? (slugs[0] === 'skill-tree' ? 'skill' : slugs[0] ?? 'reference'),
      tags: item.tags ?? [], technologies: item.technologies ?? [], useCases: item.useCases ?? [],
      contexts: item.contexts ?? [], recommendation: item.recommendation ?? null, template: item.template ?? null, prompts: item.prompts ?? [] };
    entries.push(entry);
    sourceMap.set(file, entry);
    contents.set(file, { tree, frontmatter, headingIds });
  }
  const assetMap = new Map(assets.map((asset) => [asset.sourcePath, asset]));
  function resolveLink(source, original) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(original)) return original;
    const fragment = (target, suffix) => {
      const hash = suffix.indexOf('#');
      if (hash < 0) return suffix;
      const id = decodeURIComponent(suffix.slice(hash + 1));
      const canonical = contents.get(target)?.headingIds.get(id.replace(/[\uFE0E\uFE0F]/g, ''));
      return canonical ? `${suffix.slice(0, hash)}#${encodeURIComponent(canonical)}` : suffix;
    };
    const match = original.match(/^([^?#]*)(.*)$/);
    if (!match[1]) return fragment(source, original);
    let target;
    try { target = decodeURIComponent(match[1]); } catch { throw new Error(`Invalid URL in ${source}: ${original}`); }
    // Already-authored site URLs are resolved against the generated route table.
    if (target.startsWith('/docs/')) {
      const clean = `${target.replace(/\/$/, '')}/`;
      if (!outputs.has(clean) && clean !== '/docs/zones/') throw new Error(`Missing page in ${source}: ${original}`);
      return clean + match[2];
    }
    if (target.startsWith('/')) target = target.slice(1);
    else target = path.posix.normalize(path.posix.join(path.posix.dirname(source), target));
    if (target === '..' || target.startsWith('../')) throw new Error(`Link escapes BAG in ${source}: ${original}`);
    const page = sourceMap.get(target) ?? sourceMap.get(`${target}/README.md`);
    if (page) return page.url + fragment(page.sourcePath, match[2]);
    const asset = assetMap.get(target);
    if (asset) return asset.url + match[2];
    // Files outside the publication scope remain linked to their repository source.
    if (files.includes(target)) throw new Error(`Unmapped source in ${source}: ${original}`);
    if (trackedFiles.has(target)) return `https://github.com/tbachir/bag/blob/main/${encodePath(target)}${match[2]}`;
    throw new Error(`Missing local link in ${source}: ${original}`);
  }
  const trackedFiles = new Set(tracked);
  const rendered = new Map();
  for (const entry of entries) {
    const { tree, frontmatter } = contents.get(entry.sourcePath);
    visit(tree, (node) => {
      if (['link', 'image', 'definition'].includes(node.type)) node.url = resolveLink(entry.sourcePath, node.url);
      if (node.type === 'html') node.type = 'text';
    });
    rendered.set(entry.generatedPath, `---\n${yaml({ ...frontmatter, title: entry.title, description: entry.description })}---\n\n${serialize(tree)}`);
  }
  // Optional French translations live outside the canonical inventory.
  // Only publish translations reviewed against the current English source revision.
  for (const entry of entries) {
    if (!entry.sourcePath) continue;
    if (/(^|\/)(AGENTS|SKILL)\.md$/i.test(entry.sourcePath)) continue;
    const translatedPath = `apps/docs/translations/fr/${entry.sourcePath}`;
    const stampPath = `${translatedPath}.source-sha256`;
    if (!trackedFiles.has(translatedPath) || !trackedFiles.has(stampPath)) continue;
    const canonical = await readFile(path.join(root, entry.sourcePath));
    const digest = createHash('sha256').update(canonical).digest('hex');
    const recorded = (await readFile(path.join(root, stampPath), 'utf8')).trim();
    if (digest !== recorded) continue; // stale translation: use English fallback
    const translation = await readFile(path.join(root, translatedPath), 'utf8');
    const { tree, frontmatter } = parseMarkdown(translation);
    const heading = tree.children.find((node) => node.type === 'heading' && node.depth === 1);
    const title = String(frontmatter.title ?? (heading ? plainText(heading) : entry.title));
    const paragraph = tree.children.find((node) => node.type === 'paragraph');
    const description = String(frontmatter.description ?? (paragraph ? plainText(paragraph).slice(0, 180) : entry.description));
    if (heading && plainText(heading) === title) tree.children.splice(tree.children.indexOf(heading), 1);
    visit(tree, (node) => {
      if (['link', 'image', 'definition'].includes(node.type)) {
        const resolved = resolveLink(entry.sourcePath, node.url);
        node.url = resolved.startsWith('/docs/') ? `/fr${resolved}` : resolved;
      }
      if (node.type === 'html') node.type = 'text';
    });
    const filename = entry.generatedPath.replace(/\.md$/, '.fr.md');
    rendered.set(filename, `---\n${yaml({ ...frontmatter, title, description })}---\n\n${serialize(tree)}`);
  }
  // Small authored navigation page, with source links resolved like repository pages.
  const zonesFile = 'apps/docs/content/docs/zones.mdx';
  const zoneText = await readFile(path.join(app, 'content/docs/zones.mdx'), 'utf8');
  const { tree: zoneTree, frontmatter: zoneMeta } = parseMarkdown(zoneText);
  visit(zoneTree, (node) => {
    if (node.type === 'link' && node.url.startsWith('https://github.com/tbachir/bag/blob/main/')) {
      const target = node.url.slice('https://github.com/tbachir/bag/blob/main/'.length);
      node.url = sourceMap.get(target)?.url ?? node.url;
    }
  });
  if (outputs.has('/docs/zones/')) throw new Error('Reserved route collision: /docs/zones/');
  const zoneEntry = { sourcePath: zonesFile, generatedPath: 'zones.md', slugs: ['zones'], url: '/docs/zones/', title: zoneMeta.title, description: zoneMeta.description };
  entries.push(zoneEntry);
  rendered.set('zones.md', `---\n${yaml(zoneMeta)}---\n\n${serialize(zoneTree)}`);
  // All technical resources are discoverable even when no source page links to them.
  const downloads = 'downloads.md';
  if (outputs.has('/docs/downloads/')) throw new Error('Reserved route collision: /docs/downloads/');
  rendered.set(downloads, `---\ntitle: Source files and downloads\ndescription: Scripts, manifests, templates, and demos from BAG.\n---\n\n${assets.map((asset) => `- [${asset.sourcePath}](${asset.url})`).join('\n')}\n`);
  entries.push({ sourcePath: null, generatedPath: downloads, slugs: ['downloads'], url: '/docs/downloads/', title: 'Source files and downloads', description: 'Scripts, manifests, templates, and demos from BAG.' });
  const generated = path.join(app, '.generated');
  // Only this dedicated directory is owned by the generator. Validate before replacing it.
  await rm(generated, { recursive: true, force: true });
  for (const [file, text] of rendered) await write(path.join(generated, 'content', file), text);
  const directories = new Set(['']);
  for (const entry of entries) {
    let dir = path.posix.dirname(entry.generatedPath);
    while (dir !== '.') { directories.add(dir); dir = path.posix.dirname(dir); }
  }
  for (const dir of [...directories].sort()) {
    const disk = path.join(generated, 'content', dir);
    const children = await readdir(disk, { withFileTypes: true });
    const names = children.map((child) => child.isDirectory() ? child.name : child.name.replace(/\.md$/, '')).sort();
    const order = dir ? ['index'] : ['index', 'zones', ...zones, 'catalog', 'templates', 'demo', 'downloads'];
    const configured = folderConfigs.get(dir);
    await write(path.join(disk, 'meta.json'), `${JSON.stringify(folderNavigation(configured, names, order), null, 2)}\n`);
  }
  // Resolve featured loadouts using canonical catalog manifests; the UI never owns a second registry.
  const catalogItems = new Map();
  for (const file of files.filter(f => /^catalog\/items\/[a-z0-9-]+\.json$/.test(f))) {
    const value = JSON.parse(await readFile(path.join(root, file), 'utf8'));
    catalogItems.set(value.id, value);
  }
  const loadouts = [];
  for (const file of files.filter(f => /^catalog\/loadouts\/[a-z0-9-]+\.json$/.test(f))) {
    const value = JSON.parse(await readFile(path.join(root, file), 'utf8'));
    const sourcePaths = [...new Set(value.items.map(({id}) => catalogItems.get(id)?.source?.path).filter(Boolean))];
    loadouts.push({ id:value.id, title:value.title, summary:value.summary, sourcePaths,
      unresolved: value.items.filter(({id}) => !catalogItems.has(id)).map(({id}) => id) });
  }
  const manifest = { version: 2, pages: entries, assets, loadouts };
  await write(path.join(generated, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  // Keep downloads in the same generated namespace; Next serves the explicit public subtree.
  await rm(path.join(app, 'public/files'), { recursive: true, force: true });
  for (const asset of assets) {
    const dest = path.join(app, 'public/files', asset.sourcePath);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(path.join(root, asset.sourcePath), dest);
  }
  const archivedSkills = await writeSkillsArchives({root, files, output:path.join(app,'public/files/skills')});
  console.log(`Generated ${entries.length} pages, ${assets.length} resources and ${archivedSkills.length} skill ZIPs.`);
  return manifest;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generate();
