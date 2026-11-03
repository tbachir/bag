import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { handleRequest, executeTool } from '../spellbook/scripts/bag-mcp.mjs';

test('MCP initialize handshake returns protocol version and server info', async () => {
  const req = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      clientInfo: { name: 'test-client', version: '1.0' }
    }
  };
  const res = await handleRequest(req);
  assert.equal(res.id, 1);
  assert.equal(res.result.protocolVersion, '2024-11-05');
  assert.equal(res.result.serverInfo.name, 'bag-mcp');
  assert.equal(res.result.capabilities.tools.listChanged, false);
  assert.equal(res.result.capabilities.resources.subscribe, false);
  assert.equal(res.result.capabilities.prompts.listChanged, false);
});

test('MCP ping and notifications (both initialized and notifications/initialized)', async () => {
  const pingRes = await handleRequest({ jsonrpc: '2.0', id: 2, method: 'ping' });
  assert.deepEqual(pingRes, { jsonrpc: '2.0', id: 2, result: {} });

  const notifyRes1 = await handleRequest({ jsonrpc: '2.0', method: 'notifications/initialized' });
  assert.equal(notifyRes1, null);

  const notifyRes2 = await handleRequest({ jsonrpc: '2.0', method: 'initialized' });
  assert.equal(notifyRes2, null);
});

test('MCP tools/list exposes all BAG tools with valid JSON schemas', async () => {
  const res = await handleRequest({ jsonrpc: '2.0', id: 3, method: 'tools/list' });
  assert.equal(res.id, 3);
  const toolNames = res.result.tools.map(t => t.name);
  assert.ok(toolNames.includes('bag_search'));
  assert.ok(toolNames.includes('bag_list_items'));
  assert.ok(toolNames.includes('bag_get_item'));
  assert.ok(toolNames.includes('bag_list_loadouts'));
  assert.ok(toolNames.includes('bag_get_loadout'));
  assert.ok(toolNames.includes('bag_read_document'));
  assert.ok(toolNames.includes('bag_plan_loadout'));
  assert.ok(toolNames.includes('bag_install_skill'));
  assert.ok(toolNames.includes('bag_list_functions'));
  assert.ok(toolNames.includes('bag_call_function'));
  assert.ok(toolNames.includes('bag_clean_code'));

  for (const tool of res.result.tools) {
    assert.equal(tool.inputSchema.type, 'object');
    assert.equal(tool.inputSchema.additionalProperties, false);
  }
});

test('MCP tools/call: bag_search returns matching catalog entries with isError: false', async () => {
  const res = await handleRequest({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'bag_search',
      arguments: { query: 'skill' }
    }
  });
  assert.equal(res.id, 4);
  assert.equal(res.result.isError, false);
  const parsed = JSON.parse(res.result.content[0].text);
  assert.ok(parsed.resultsCount > 0);
  assert.ok(Array.isArray(parsed.items));
});

test('MCP tools/call: bag_list_items filters by zone and kind', async () => {
  const res = await handleRequest({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'bag_list_items',
      arguments: { zone: 'skill-tree', kind: 'skill' }
    }
  });
  assert.equal(res.result.isError, false);
  const parsed = JSON.parse(res.result.content[0].text);
  assert.ok(parsed.total > 0);
  for (const item of parsed.items) {
    assert.equal(item.zone, 'skill-tree');
    assert.equal(item.kind, 'skill');
  }
});

test('MCP tools/call: bag_get_item returns item and source content', async () => {
  const res = await handleRequest({
    jsonrpc: '2.0',
    id: 6,
    method: 'tools/call',
    params: {
      name: 'bag_get_item',
      arguments: { id: 'clean-code' }
    }
  });
  assert.equal(res.result.isError, false);
  const parsed = JSON.parse(res.result.content[0].text);
  assert.equal(parsed.item.id, 'clean-code');
  assert.ok(parsed.sourceContent.includes('Clean Code'));
});

test('MCP tools/call: bag_read_document allows safe reading and rejects traversal with isError: true', async () => {
  const okRes = await handleRequest({
    jsonrpc: '2.0',
    id: 7,
    method: 'tools/call',
    params: {
      name: 'bag_read_document',
      arguments: { path: 'README.md' }
    }
  });
  assert.equal(okRes.result.isError, false);
  const okParsed = JSON.parse(okRes.result.content[0].text);
  assert.ok(okParsed.content.includes('BAG'));

  const badRes = await handleRequest({
    jsonrpc: '2.0',
    id: 8,
    method: 'tools/call',
    params: {
      name: 'bag_read_document',
      arguments: { path: '../outside.txt' }
    }
  });
  assert.equal(badRes.result.isError, true);
  assert.ok(badRes.result.content[0].text.includes('Unsafe'));
});

test('MCP tools/call: bag_plan_loadout produces dry-run plan', async () => {
  const res = await handleRequest({
    jsonrpc: '2.0',
    id: 9,
    method: 'tools/call',
    params: {
      name: 'bag_plan_loadout',
      arguments: { loadoutId: 'ai-coding', targetDirectory: '.' }
    }
  });
  assert.equal(res.result.isError, false);
  const parsed = JSON.parse(res.result.content[0].text);
  assert.equal(parsed.loadout, 'ai-coding');
  assert.equal(parsed.dryRun, true);
  assert.ok(Array.isArray(parsed.actions));
});

test('MCP tools/call: bag_install_skill dry-run and apply', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bag-mcp-install-'));
  try {
    const dryRes = await handleRequest({
      jsonrpc: '2.0',
      id: 20,
      method: 'tools/call',
      params: {
        name: 'bag_install_skill',
        arguments: { skillId: 'clean-code', targetDirectory: tmpDir, apply: false }
      }
    });
    assert.equal(dryRes.result.isError, false);
    const dryParsed = JSON.parse(dryRes.result.content[0].text);
    assert.equal(dryParsed.dryRun, true);

    const applyRes = await handleRequest({
      jsonrpc: '2.0',
      id: 21,
      method: 'tools/call',
      params: {
        name: 'bag_install_skill',
        arguments: { skillId: 'clean-code', targetDirectory: tmpDir, apply: true }
      }
    });
    assert.equal(applyRes.result.isError, false);
    const applyParsed = JSON.parse(applyRes.result.content[0].text);
    assert.equal(applyParsed.dryRun, false);
    assert.equal(applyParsed.actions[0].status, 'created');
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('MCP tools/call: bag_list_functions and bag_call_function', async () => {
  const listRes = await handleRequest({
    jsonrpc: '2.0',
    id: 22,
    method: 'tools/call',
    params: {
      name: 'bag_list_functions',
      arguments: {}
    }
  });
  assert.equal(listRes.result.isError, false);
  const listParsed = JSON.parse(listRes.result.content[0].text);
  assert.ok(Array.isArray(listParsed.functions));
  assert.ok(listParsed.functions.some(f => f.name === 'validate'));

  const callRes = await handleRequest({
    jsonrpc: '2.0',
    id: 23,
    method: 'tools/call',
    params: {
      name: 'bag_call_function',
      arguments: { functionName: 'validate' }
    }
  });
  assert.equal(callRes.result.isError, false);
  const callParsed = JSON.parse(callRes.result.content[0].text);
  assert.equal(callParsed.success, true);
  assert.equal(callParsed.exitCode, 0);
});

test('MCP tools/call: bag_clean_code runs hygiene audit', async () => {
  const res = await handleRequest({
    jsonrpc: '2.0',
    id: 24,
    method: 'tools/call',
    params: {
      name: 'bag_clean_code',
      arguments: { targetDirectory: fileURLToPath(new URL('../spellbook/scripts/clean-code.mjs', import.meta.url)) }
    }
  });
  assert.equal(res.result.isError, false);
  const parsed = JSON.parse(res.result.content[0].text);
  assert.equal(parsed.scannedFiles, 1);
});

test('MCP resources and prompts list and read', async () => {
  const rList = await handleRequest({ jsonrpc: '2.0', id: 10, method: 'resources/list' });
  assert.ok(rList.result.resources.length >= 3);

  const rRead = await handleRequest({
    jsonrpc: '2.0',
    id: 11,
    method: 'resources/read',
    params: { uri: 'bag://catalog/items' }
  });
  const items = JSON.parse(rRead.result.contents[0].text);
  assert.ok(Array.isArray(items));
  assert.ok(items.length > 0);

  const pList = await handleRequest({ jsonrpc: '2.0', id: 12, method: 'prompts/list' });
  assert.ok(pList.result.prompts.length >= 2);

  const pGetOk = await handleRequest({
    jsonrpc: '2.0',
    id: 13,
    method: 'prompts/get',
    params: { name: 'recommend-loadout', arguments: { projectType: 'fullstack' } }
  });
  assert.ok(pGetOk.result.messages[0].content.text.includes('fullstack'));

  const pGetMissing = await handleRequest({
    jsonrpc: '2.0',
    id: 14,
    method: 'prompts/get',
    params: { name: 'recommend-loadout' }
  });
  assert.equal(pGetMissing.error.code, -32602);
});

test('MCP error handling for unknown method and invalid request', async () => {
  const unknownRes = await handleRequest({ jsonrpc: '2.0', id: 99, method: 'unknown_method' });
  assert.equal(unknownRes.id, 99);
  assert.equal(unknownRes.error.code, -32601);

  const invalidReq = await handleRequest(null);
  assert.equal(invalidReq.error.code, -32600);
});
