import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, symlink, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { readCatalog, searchItems, describeLoadout, planLoadout, applyPlan, safeRelative, ROOT } from '../catalog/lib.mjs';
import { execFileSync } from 'node:child_process';

test('catalog is valid, discoverable and consistent', async () => {
  const c=await readCatalog();
  assert.ok(c.items.size >= 8);
  assert.ok(c.loadouts.size >= 2);
  assert.ok(searchItems(c,'agent').some(i=>i.id==='agent-rules'));
  assert.equal(searchItems(c,'somethingthatdoesnotexist').length,0);
  assert.equal(describeLoadout(c,'node-project').resolvedItems.length,2);
  assert.throws(()=>describeLoadout(c,'missing'), /Unknown loadout/);
});
test('all required local paths are safe', () => {
  for (const good of ['AGENTS.md','.gitignore','x/y/config.json']) assert.ok(safeRelative(good));
  for (const bad of ['../escape','x/../escape','/absolute','C:\\private','x\\evil','.','', 'x//y','x/./y']) assert.equal(safeRelative(bad), false, bad);
});
test('plan is read-only and apply only creates missing reviewed files', async () => {
  const target=await mkdtemp(path.join(tmpdir(),'bag-catalog-'));
  try {
    const catalog=await readCatalog();
    let plan=await planLoadout(catalog,'ai-coding',target);
    assert.equal(plan.dryRun,true);
    assert.equal(plan.actions.filter(a=>a.status==='create').length,3);
    assert.equal(plan.actions.filter(a=>a.status==='reference-only').length,3);
    assert.deepEqual(await readdir(target),[]);
    const applied=await applyPlan(catalog,'ai-coding',target);
    assert.equal(applied.dryRun,false);
    assert.equal(applied.actions.filter(a=>a.status==='created').length,3);
    const agent=await readFile(path.join(target,'AGENTS.md'),'utf8');
    assert.match(agent,/Project-specific example/);
    await writeFile(path.join(target,'AGENTS.md'),'custom content');
    const again=await applyPlan(catalog,'ai-coding',target);
    assert.equal(again.actions.filter(a=>a.status==='exists-skip').length,3);
    assert.equal(await readFile(path.join(target,'AGENTS.md'),'utf8'),'custom content');
  } finally { await rm(target,{recursive:true,force:true}); }
});
test('symlink destination cannot escape project', async (t) => {
  const target=await mkdtemp(path.join(tmpdir(),'bag-target-'));
  const outside=await mkdtemp(path.join(tmpdir(),'bag-outside-'));
  try {
    await symlink(path.join(outside,'outside-file'),path.join(target,'AGENTS.md'));
    await assert.rejects(planLoadout(await readCatalog(),'ai-coding',target), /symbolic link/);
    assert.deepEqual(await readdir(outside),[]);
  } finally { await rm(target,{recursive:true,force:true}); await rm(outside,{recursive:true,force:true}); }
});
test('malformed manifest and unsafe paths are rejected', async () => {
  const root=await mkdtemp(path.join(tmpdir(),'bag-invalid-'));
  try {
    await mkdir(path.join(root,'catalog/items'),{recursive:true});
    await mkdir(path.join(root,'catalog/loadouts'),{recursive:true});
    await writeFile(path.join(root,'catalog/items/bad.json'),JSON.stringify({schemaVersion:1,id:'bad',title:'Bad',summary:'Bad',zone:'equipment',kind:'config',status:'ready',tags:[],source:{type:'local',path:'../secret'},mode:'reference'}));
    await assert.rejects(readCatalog(root), /invalid local source/);
  } finally { await rm(root,{recursive:true,force:true}); }
});
test('CLI emits JSON for machine consumers', () => {
  const output=execFileSync(process.execPath,[path.join(ROOT,'spellbook/scripts/bag.mjs'),'search','config','--json'],{cwd:ROOT,encoding:'utf8'});
  const found=JSON.parse(output);
  assert.ok(found.some(item=>item.id==='editorconfig'));
});

test('published JSON schema rejects unsafe relative paths', async () => {
  const raw=await readFile(path.join(ROOT,'catalog/schemas/item.schema.json'),'utf8');
  const schema=JSON.parse(raw);
  const regex=new RegExp(schema.$defs.relativePath.pattern);
  for (const valid of ['AGENTS.md','.gitignore','x/y/config.json']) assert.ok(regex.test(valid),valid);
  for (const invalid of ['../escape','x/../escape','/absolute','C:\\private','x\\evil','.','', 'x//y','x/./y']) assert.equal(regex.test(invalid),false,invalid);
});
