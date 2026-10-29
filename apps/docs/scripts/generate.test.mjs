import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, symlink } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { generate, pagePath } from './generate.mjs';
import { publicMarkdown, rewriteMarkdown } from './markdown.mjs';
import { normalizeBasePath } from './config.mjs';
import { finalize } from './finalize.mjs';
import { checkExport } from './check-export.mjs';

async function fixture(t, sources) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'bag-compiler-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const app = path.join(root, 'apps/docs');
  await mkdir(path.join(app, 'content/docs'), { recursive: true });
  await writeFile(path.join(app, 'content/docs/zones.mdx'), '---\ntitle: Seven zones\ndescription: Directory\n---\n');
  for (const [name, text] of Object.entries(sources)) {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true });
    await writeFile(path.join(root, name), text);
  }
  return { root, app, files: Object.keys(sources) };
}
async function snapshot(dir) {
  const result = {};
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) for (const [name, content] of Object.entries(await snapshot(path.join(dir, entry.name)))) result[`${entry.name}/${name}`] = content;
    else result[entry.name] = await readFile(path.join(dir, entry.name), 'utf8');
  }
  return result;
}

test('compiles Markdown, rewrites reference links and preserves executable examples as text', async (t) => {
  const options = await fixture(t, {
    'README.md': '# BAG\n\n[guide][g]\n\n[g]: inventory/README.md#details\n',
    'inventory/README.md': '# Inventory\n\n## Details\n\n[skill](../skill-tree/SKILL.md)\n\n[file](../spellbook/tool.py)\n',
    'skill-tree/SKILL.md': '---\nname: skill\n---\n# Skill\n\n<Component />\n\n{process.exit()}\n\n```js\nconst x = "<literal>{value}";\n```\n',
    'spellbook/tool.py': 'print("download only")\n',
  });
  const manifest = await generate(options);
  assert.equal(manifest.pages.find((page) => page.sourcePath === 'skill-tree/SKILL.md').url, '/docs/skill-tree/skill/');
  const root = await readFile(path.join(options.app, '.generated/content/index.md'), 'utf8');
  assert.match(root, /\/docs\/inventory\/#details/);
  const skill = await readFile(path.join(options.app, '.generated/content/skill-tree/skill.md'), 'utf8');
  assert.match(skill, /\\<Component/);
  assert.match(skill, /\{process.exit\(\)\}/);
  assert.match(skill, /const x = "<literal>\{value\}";/);
  const inventory = await readFile(path.join(options.app, '.generated/content/inventory/index.md'), 'utf8');
  assert.match(inventory, /\/files\/spellbook\/tool.py/);
  assert.equal(await readFile(path.join(options.app, 'public/files/spellbook/tool.py'), 'utf8'), 'print("download only")\n');
});

test('is deterministic, removes deleted outputs, and leaves authored files untouched', async (t) => {
  const options = await fixture(t, { 'README.md': '# BAG', 'inventory/old.md': '# Old', 'spellbook/old.py': 'print(1)'  });
  await generate(options);
  const first = await snapshot(path.join(options.app, '.generated'));
  await generate(options);
  assert.deepEqual(await snapshot(path.join(options.app, '.generated')), first);
  await generate({ ...options, files: ['README.md'] });
  await assert.rejects(readFile(path.join(options.app, '.generated/content/inventory/old.md')), { code: 'ENOENT' });
  assert.equal(await readFile(path.join(options.root, 'inventory/old.md'), 'utf8'), '# Old');
  await assert.rejects(readFile(path.join(options.app, 'public/files/spellbook/old.py')), { code: 'ENOENT' });
});

test('rejects route collisions before replacing a working generation', async (t) => {
  const options = await fixture(t, { 'README.md': '# BAG', 'inventory/README.md': '# Inventory', 'inventory/index.md': '# Collision' });
  await generate({ ...options, files: ['README.md', 'inventory/README.md'] });
  const previous = await snapshot(path.join(options.app, '.generated'));
  await assert.rejects(generate(options), /Route collision/);
  assert.deepEqual(await snapshot(path.join(options.app, '.generated')), previous);
  assert.equal(pagePath('skill-tree/SKILL.md'), 'skill-tree/skill');
});

test('rejects missing links and traversal', async (t) => {
  for (const target of ['missing.md', '../../outside.md']) {
    const options = await fixture(t, { 'README.md': `# BAG\n\n[bad](${target})` });
    await assert.rejects(generate(options), /Missing local link|Link escapes BAG/);
  }
});

test('rejects symlinks and secret-like resources', async (t) => {
  const options = await fixture(t, { 'README.md': '# BAG', 'equipment/.env': 'PRIVATE' });
  await assert.rejects(generate(options), /Secret-like/);
  await writeFile(path.join(options.root, 'equipment/.env.example'), 'PUBLIC_PLACEHOLDER=example');
  const safe = await generate({ ...options, files: ['README.md', 'equipment/.env.example'] });
  assert.equal(safe.assets[0].sourcePath, 'equipment/.env.example');
  await symlink(path.join(options.root, 'README.md'), path.join(options.root, 'equipment/link.md'));
  await assert.rejects(generate({ ...options, files: ['equipment/link.md'] }), /Symlink/);
});

test('rewrites Markdown URLs without changing external links, code, or fragments', () => {
  const text = '[local](/docs/a/#heading) [external](https://example.com) [anchor](#heading)\n\n```md\n[example](/docs/a/)\n```';
  const result = publicMarkdown(text, '/bag');
  assert.match(result, /\]\(\/bag\/docs\/a\/#heading\)/);
  assert.match(result, /\]\(https:\/\/example.com\)/);
  assert.match(result, /\]\(#heading\)/);
  assert.match(result, /\[example\]\(\/docs\/a\/\)/);
  assert.match(rewriteMarkdown('[x](a.md)', (value) => value.replace('.md', '/')), /\]\(a\/\)/);
});

test('exports real Markdown aliases and audits both root and project-prefix links', async (t) => {
  const options = await fixture(t, { 'README.md': '# BAG\n\n[zone](inventory/README.md)', 'inventory/README.md': '# Inventory' });
  const manifest = await generate(options);
  for (const page of manifest.pages) {
    const file = path.join(options.app, 'out', page.url, 'index.html');
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, '<h1 id="title">Title</h1>');
    const french = path.join(options.app, 'out', 'fr', page.url, 'index.html');
    await mkdir(path.dirname(french), { recursive: true });
    await writeFile(french, '<h1 id="title">Title</h1>');
  }
  await finalize(options.app, '/bag');
  assert.match(await readFile(path.join(options.app, 'out/docs.md'), 'utf8'), /\/bag\/docs\/inventory\//);
  await checkExport(options.app, '/bag');
  const html = path.join(options.app, 'out/docs/index.html');
  await writeFile(html, '<a href="/bag/docs/inventory/#title">Inventory</a>');
  await checkExport(options.app, '/bag');
  await writeFile(html, '<a href="/docs/inventory/">Missing prefix</a>');
  await assert.rejects(checkExport(options.app, '/bag'), /Missing base path/);
  await checkExport(options.app, '');
  await writeFile(html, '<a href="/docs/inventory/#absent">Missing anchor</a>');
  await assert.rejects(checkExport(options.app, ''), /Missing anchor/);
});


test('normalizes an emoji heading fragment to the actual generated heading ID', async (t) => {
  const options = await fixture(t, {
    'README.md': '# BAG\n\n## 🗺️ Choose your destination\n',
    'maps-and-guides/start.md': '# Start\n\n[zone](../README.md#-choose-your-destination)\n',
  });
  await generate(options);
  const output = await readFile(path.join(options.app, '.generated/content/maps-and-guides/start.md'), 'utf8');
  assert.match(output, /#%EF%B8%8F-choose-your-destination/);
});


test('normalizes a deployment prefix and rejects origins or parent traversal', () => {
  assert.equal(normalizeBasePath('/bag/'), '/bag');
  assert.equal(normalizeBasePath('/'), '');
  assert.equal(normalizeBasePath(''), '');
  for (const value of ['https://example.com', '/bag/../private', '/bag?query', '//bag']) {
    assert.throws(() => normalizeBasePath(value), /DOCS_BASE_PATH/);
  }
});


test('uses English fallback when French is missing or stale and preserves canonical English', async (t) => {
  const { createHash } = await import('node:crypto');
  const original = '# English guide\\n\\nEnglish content\\n';
  const french = '# Guide français\\n\\nContenu français\\n';
  const translated = 'apps/docs/translations/fr/inventory/README.md';
  const stamp = `${translated}.source-sha256`;
  const options = await fixture(t, {
    'README.md': '# BAG',
    'inventory/README.md': original,
    [translated]: french,
    [stamp]: createHash('sha256').update(original).digest('hex'),
  });
  const files = ['README.md', 'inventory/README.md', translated, stamp];
  await generate({ ...options, files });
  const english = await readFile(path.join(options.app, '.generated/content/inventory/index.md'), 'utf8');
  const localized = await readFile(path.join(options.app, '.generated/content/inventory/index.fr.md'), 'utf8');
  assert.match(english, /English content/);
  assert.doesNotMatch(english, /Contenu français/);
  assert.match(localized, /Contenu français/);

  await writeFile(path.join(options.root, stamp), 'stale-hash');
  await generate({ ...options, files });
  assert.match(await readFile(path.join(options.app, '.generated/content/inventory/index.md'), 'utf8'), /English content/);
  await assert.rejects(readFile(path.join(options.app, '.generated/content/inventory/index.fr.md')), { code: 'ENOENT' });
  await generate({ ...options, files: ['README.md', 'inventory/README.md'] });
  await assert.rejects(readFile(path.join(options.app, '.generated/content/inventory/index.fr.md')), { code: 'ENOENT' });
});

test('attaches a task manifest to a canonical item with a custom nested workflow folder', async (t) => {
  const owner='inventory/camera';
  const options=await fixture(t,{
    'README.md':'# BAG',
    [owner+'/README.md']:'# Camera',
    [owner+'/bag.item.json']:JSON.stringify({type:'resource',taskManifest:'workflows/index.json'}),
    [owner+'/workflows/README.md']:'# Workflows',
    [owner+'/workflows/audit.md']:'# Audit',
    [owner+'/workflows/index.json']:JSON.stringify({version:1,item:owner,tasks:{audit:{title:'Audit',file:'audit.md',default:true}}}),
  });
  const manifest=await generate(options);
  const page=manifest.pages.find(p=>p.sourcePath===owner+'/README.md');
  assert.equal(page.taskManifest.tasks.audit.file,owner+'/workflows/audit.md');
  assert.equal(page.taskManifest.tasks.audit.default,true);
});
