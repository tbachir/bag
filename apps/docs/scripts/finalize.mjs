import { configuredBasePath } from './config.mjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appDir } from './generate.mjs';
import { publicMarkdown } from './markdown.mjs';

export async function finalize(app = appDir, basePath = configuredBasePath()) {
  const manifest = JSON.parse(await readFile(path.join(app, '.generated/manifest.json'), 'utf8'));
  for (const page of manifest.pages) {
    const source = await readFile(path.join(app, '.generated/content', page.generatedPath), 'utf8');
    const file = path.join(app, 'out', `${['docs', ...page.slugs].join('/')}.md`);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, publicMarkdown(`# ${page.title}\n\n${source.replace(/^---\n[\s\S]*?\n---\n/, '')}`, basePath));
  }
  // French Markdown shortcuts mirror the generated French pages, falling back to English.
  for (const page of manifest.pages) {
    const localized = page.generatedPath.replace(/\\.md$/, '.fr.md');
    let text;
    try { text = await readFile(path.join(app, '.generated/content', localized), 'utf8'); }
    catch { text = await readFile(path.join(app, '.generated/content', page.generatedPath), 'utf8'); }
    const file = path.join(app, 'out', 'fr', `${['docs', ...page.slugs].join('/')}.md`);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, publicMarkdown(`# ${page.title}\\n\\n${text.replace(/^---\\n[\\s\\S]*?\\n---\\n/, '')}`, basePath));
  }
  await writeFile(path.join(app, 'out/.nojekyll'), '');
  console.log(`Exported ${manifest.pages.length} Markdown shortcuts.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await finalize();
