import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cliRoot = path.join(root, 'packages/cli');

const DIRS_TO_SYNC = ['catalog', 'skills', 'mcp', 'recipes', 'templates', 'packs'];

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await copyDir(srcPath, destPath);
      }
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function sync() {
  for (const dir of DIRS_TO_SYNC) {
    const src = path.join(root, dir);
    const dest = path.join(cliRoot, dir);
    await fs.rm(dest, { recursive: true, force: true });
    await copyDir(src, dest);
  }
  console.log('Synchronized CLI inventory and resources.');
}

sync().catch(err => {
  console.error(err);
  process.exit(1);
});
