import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parseDesignMd, autoDiscoverProject, generateUIStudioHtml } from '../spellbook/scripts/ui-studio-engine.mjs';
import { runUiStudio } from '../spellbook/scripts/ui-studio.mjs';
import { handleRequest } from '../spellbook/scripts/bag-mcp.mjs';

test('UI Studio: parses DESIGN.md frontmatter tokens and markdown', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bag-ui-test-'));
  const designFile = path.join(tmpDir, 'DESIGN.md');
  fs.writeFileSync(designFile, `---
version: alpha
name: TestApp
colors:
  background: "#ffffff"
  foreground: "#000000"
  accent: "#ff0055"
typography:
  display-hero:
    fontFamily: "Test Serif"
rounded:
  md: 12px
---

# Test Guidelines
Some test design rules.
`, 'utf8');

  const parsed = parseDesignMd(designFile);
  assert.equal(parsed.name, 'TestApp');
  assert.equal(parsed.colors.accent, '#ff0055');
  assert.equal(parsed.rounded.md, '12px');
  assert.ok(parsed.body.includes('Test Guidelines'));

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('UI Studio: auto-discovers routes and components in target directory', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bag-ui-discover-'));
  const appDir = path.join(tmpDir, 'app');
  fs.mkdirSync(appDir, { recursive: true });
  fs.writeFileSync(path.join(appDir, 'index.tsx'), 'export default function Home() {}', 'utf8');
  fs.writeFileSync(path.join(appDir, 'about.tsx'), 'export default function About() {}', 'utf8');
  fs.writeFileSync(path.join(appDir, 'modal.tsx'), 'export default function Modal() {}', 'utf8');

  const discovered = autoDiscoverProject(tmpDir);
  assert.ok(discovered.routes.length >= 2);
  assert.ok(discovered.routes.some(r => r.path === '/' || r.path === '/index'));
  assert.ok(discovered.routes.some(r => r.path === '/about'));
  assert.ok(discovered.audit.some(a => a.component.includes('modal')));

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('UI Studio: generates valid HTML studio with V8 script validation', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bag-ui-generate-'));
  const outFile = path.join(tmpDir, 'ui-studio.html');

  const generated = await runUiStudio(['--target', tmpDir, '--out', outFile]);
  assert.equal(generated, outFile);
  assert.ok(fs.existsSync(outFile));

  const content = fs.readFileSync(outFile, 'utf8');
  assert.ok(content.includes('<!DOCTYPE html>'));
  assert.ok(content.includes('studio-header'));
  assert.ok(content.includes('iphone-device'));
  assert.ok(content.includes('Storybook Kit'));
  assert.ok(content.includes('Dead Features'));

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('BAG MCP: bag_ui_studio tool is exposed and callable', async () => {
  const listRes = await handleRequest({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list'
  });
  const tools = listRes.result.tools;
  const studioTool = tools.find(t => t.name === 'bag_ui_studio');
  assert.ok(studioTool, 'bag_ui_studio tool must be listed in MCP tools');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bag-mcp-studio-'));
  const callRes = await handleRequest({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'bag_ui_studio',
      arguments: {
        targetDirectory: tmpDir,
        outputPath: path.join(tmpDir, 'custom-studio.html')
      }
    }
  });

  assert.ok(callRes.result);
  const data = JSON.parse(callRes.result.content[0].text);
  assert.equal(data.success, true);
  assert.ok(fs.existsSync(path.join(tmpDir, 'custom-studio.html')));

  fs.rmSync(tmpDir, { recursive: true, force: true });
});
