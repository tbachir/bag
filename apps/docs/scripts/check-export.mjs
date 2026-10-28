import { configuredBasePath } from './config.mjs';
import { readFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appDir } from './generate.mjs';

async function fileExists(file) { try { return (await stat(file)).isFile(); } catch { return false; } }
async function htmlFiles(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) result.push(...await htmlFiles(path.join(dir, entry.name)));
    else if (entry.name.endsWith('.html')) result.push(path.join(dir, entry.name));
  }
  return result;
}
export async function checkExport(app = appDir, basePath = configuredBasePath()) {
  const output = path.join(app, 'out');
  const manifest = JSON.parse(await readFile(path.join(app, '.generated/manifest.json'), 'utf8'));
  const errors = [];
  for (const page of manifest.pages) {
    const html = path.join(output, page.url, 'index.html');
    const markdown = path.join(output, `${['docs', ...page.slugs].join('/')}.md`);
    if (!await fileExists(html)) errors.push(`Missing page: ${page.sourcePath ?? page.url}`);
    if (!await fileExists(path.join(output, 'fr', page.url, 'index.html'))) errors.push(`Missing French page: ${page.url}`);
    if (!await fileExists(path.join(output, 'fr', `${['docs', ...page.slugs].join('/')}.md`))) errors.push(`Missing French Markdown shortcut: ${page.url}`);
    if (!await fileExists(markdown)) errors.push(`Missing Markdown shortcut: ${page.url}`);
  }
  for (const asset of manifest.assets) {
    if (!await fileExists(path.join(output, 'files', asset.sourcePath))) errors.push(`Missing resource: ${asset.sourcePath}`);
  }
  let checked = 0;
  for (const file of await htmlFiles(output)) {
    const html = await readFile(file, 'utf8');
    const relative = path.relative(output, file).split(path.sep).join('/');
    const address = `${basePath}/${relative.replace(/index\.html$/, '')}`;
    const tags = [...html.matchAll(/<(?:a|link|script|img|source)\b[^>]*>/g)].map(([tag]) => tag).join('\n');
    for (const [, original] of tags.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
      const value = original.replaceAll('&amp;', '&');
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) continue;
      const url = new URL(value, `http://static.test${address}`);
      let pathname = decodeURIComponent(url.pathname);
      if (basePath && pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
        errors.push(`Missing base path: ${relative} -> ${value}`); continue;
      }
      pathname = pathname.slice(basePath.length);
      if (pathname.split('/').includes('..')) { errors.push(`Unsafe path: ${value}`); continue; }
      let target = path.join(output, pathname);
      if (!await fileExists(target)) target = path.join(target, 'index.html');
      if (!await fileExists(target)) { errors.push(`Missing link: ${relative} -> ${value}`); continue; }
      if (url.hash && target.endsWith('.html')) {
        const id = decodeURIComponent(url.hash.slice(1));
        const targetHtml = target === file ? html : await readFile(target, 'utf8');
        if (!targetHtml.includes(`id="${id.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`)) errors.push(`Missing anchor: ${relative} -> ${value}`);
      }
      checked++;
    }
  }
  if (errors.length) throw new Error(`Static export audit failed:\n${[...new Set(errors)].join('\n')}`);
  console.log(`Static audit passed: ${manifest.pages.length} pages, ${manifest.assets.length} resources, ${checked} links.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await checkExport();
