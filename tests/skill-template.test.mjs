import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const creator=path.join(root,'templates/skills/scripts/create-skill.mjs');
const validator=path.join(root,'templates/skills/scripts/validate-skill.mjs');
const run=(file,args)=>spawnSync(process.execPath,[file,...args],{encoding:'utf8'});
const makeTemp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'bag-skill-test-'));

test('dry-run never writes files',t=>{
  const tmp=makeTemp();t.after(()=>fs.rmSync(tmp,{recursive:true,force:true}));
  const r=run(creator,['--name','demo-flow','--description','Use when a specific workflow needs a repeatable procedure','--target',tmp]);
  assert.equal(r.status,0,r.stderr);assert.equal(fs.existsSync(path.join(tmp,'demo-flow')),false);
});

test('generator creates validated structure and rejects overwrites',t=>{
  const tmp=makeTemp();t.after(()=>fs.rmSync(tmp,{recursive:true,force:true}));
  const args=['--name','demo-flow','--description','Use when a specific workflow needs a repeatable procedure','--target',tmp,'--write'];
  const a=run(creator,args);assert.equal(a.status,0,a.stderr);
  const skill=path.join(tmp,'demo-flow');assert.ok(fs.existsSync(path.join(skill,'evals','evals.json')));
  const check=run(validator,[skill]);assert.equal(check.status,1,'Expected placeholders to remain until author fills them');
  assert.match(check.stdout,/Unfilled placeholders/);
  const repeated=run(creator,args);assert.notEqual(repeated.status,0);assert.match(repeated.stderr,/Refusing to overwrite/);
});

test('validator passes a completed tiny skill',t=>{
  const tmp=makeTemp();t.after(()=>fs.rmSync(tmp,{recursive:true,force:true}));
  const dir=path.join(tmp,'tiny-flow');fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir,'SKILL.md'),'---\nname: tiny-flow\ndescription: Use when reviewing changes to a small file in a repository\n---\n# Tiny Flow\n\n## When to use\nReview a specific file and report verification.\n');
  const v=run(validator,[dir,'--json']);assert.equal(v.status,0,v.stderr);assert.equal(JSON.parse(v.stdout).passed,true);
});

test('validator rejects credentials and malformed JSON',t=>{
  const tmp=makeTemp();t.after(()=>fs.rmSync(tmp,{recursive:true,force:true}));
  const dir=path.join(tmp,'tiny-flow');fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir,'SKILL.md'),'---\nname: tiny-flow\ndescription: Use when reviewing changes to a small file in a repository\n---\n# Tiny Flow\n');
  fs.writeFileSync(path.join(dir,'invalid.json'),'{');
  fs.writeFileSync(path.join(dir,'config.txt'),'GITHUB_TOKEN=abc123xyz456abc123xyz456');
  const v=run(validator,[dir]);assert.equal(v.status,1);assert.match(v.stdout,/Invalid JSON/);assert.match(v.stdout,/Possible committed credential/);
});

test('generator rejects invalid names and symlinked targets',t=>{
  const tmp=makeTemp();t.after(()=>fs.rmSync(tmp,{recursive:true,force:true}));
  const base=['--description','Use when a specific workflow needs a repeatable procedure','--target',tmp,'--write'];
  assert.notEqual(run(creator,['--name','../bad',...base]).status,0);
  if(process.platform!=='win32'){
    const symlink=path.join(tmp,'link');fs.symlinkSync(tmp,symlink,'dir');
    assert.notEqual(run(creator,['--name','demo-flow','--target',symlink,'--description','Use when a specific workflow needs a repeatable procedure','--write']).status,0);
  }
});
