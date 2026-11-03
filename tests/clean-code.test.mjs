import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { analyzeFile } from '../spellbook/scripts/clean-code.mjs';

test('clean-code: preserves trailing whitespace in Markdown hard breaks', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'clean-code-md-'));
  const mdFile = path.join(tmpDir, 'test.md');
  const initialContent = '# Title\nFirst line with hard break  \nSecond line\n';
  await fs.writeFile(mdFile, initialContent, 'utf8');

  try {
    const report = await analyzeFile(mdFile, true);
    assert.equal(report.fixed, false, 'Markdown file should not be modified by auto-fix');
    const after = await fs.readFile(mdFile, 'utf8');
    assert.equal(after, initialContent, 'Trailing whitespace in Markdown must be preserved');
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('clean-code: preserves trailing whitespace inside Python multiline strings', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'clean-code-py-'));
  const pyFile = path.join(tmpDir, 'test.py');
  const initialContent = 'x = 10  \nmsg = """\nfirst  \nsecond\n"""\ny = 20  \n';
  await fs.writeFile(pyFile, initialContent, 'utf8');

  try {
    const report = await analyzeFile(pyFile, true);
    assert.equal(report.fixed, true, 'Regular code lines with trailing whitespace should be fixed');
    const after = await fs.readFile(pyFile, 'utf8');
    // x = 10 and y = 20 should have trailing spaces removed, but "first  " inside """ must remain
    assert.ok(after.includes('first  \n'), 'Python triple-quoted string trailing whitespace must be preserved');
    assert.ok(after.includes('x = 10\n'), 'Outside multiline string trailing whitespace should be removed');
    assert.ok(after.includes('y = 20\n'), 'Outside multiline string trailing whitespace should be removed');
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('clean-code: preserves trailing whitespace inside JS template literals', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'clean-code-js-'));
  const jsFile = path.join(tmpDir, 'test.js');
  const initialContent = 'const a = 1;  \nconst text = `\nline1  \nline2\n`;\nconst b = 2;  \n';
  await fs.writeFile(jsFile, initialContent, 'utf8');

  try {
    const report = await analyzeFile(jsFile, true);
    assert.equal(report.fixed, true);
    const after = await fs.readFile(jsFile, 'utf8');
    assert.ok(after.includes('line1  \n'), 'Template literal trailing whitespace must be preserved');
    assert.ok(after.includes('const a = 1;\n'), 'Code trailing whitespace should be removed');
    assert.ok(after.includes('const b = 2;\n'), 'Code trailing whitespace should be removed');
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});
