import { configuredBasePath } from './config.mjs';
// Mount a static export at its build-time prefix without an SPA fallback.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { appDir } from './generate.mjs';

const prefix = configuredBasePath();
const root = path.join(appDir, 'out');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (prefix && !pathname.startsWith(`${prefix}/`) && pathname !== prefix) { res.writeHead(404).end(); return; }
    pathname = pathname.slice(prefix.length);
    let file = path.resolve(root, `.${pathname || '/'}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) { res.writeHead(404).end(); return; }
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(308, { Location: `${prefix}${pathname}/` }).end(); return; }
      file = path.join(file, 'index.html');
    }
    const buffer = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
    res.end(buffer);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(await readFile(path.join(root, '404.html')).catch(() => 'Not found'));
  }
});
server.listen(3000, '127.0.0.1');
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
