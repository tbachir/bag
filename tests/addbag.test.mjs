import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(pathFromRoot)=>readFileSync(path.join(root,pathFromRoot),'utf8').replace(/\r\n/g,'\n');
const base='skill-tree/skills/addbag/';

test('addbag has a valid portable skill frontmatter and discoverable catalog entry',()=>{
  const skill=read(base+'SKILL.md');
  assert.match(skill,/^---\nname: addbag\ndescription: .+/);
  assert.match(skill,/\n## 3\. STOP and propose one approval-ready plan/);
  assert.match(skill,/\n## 4\. After explicit plan approval/);
  const meta=JSON.parse(read(base+'bag.item.json'));
  assert.equal(meta.template,'skill');
  assert.equal(meta.prompts.length,2);
  const catalog=JSON.parse(read('catalog/items/addbag.json'));
  assert.equal(catalog.source.path,base+'SKILL.md');
  assert.equal(catalog.mode,'reference');
});

test('session capture protects sensitive context and respects merge safeguards',()=>{
  const skill=read(base+'SKILL.md');
  assert.match(skill,/Never.*private chat transcripts|Do not copy conversation transcripts/);
  assert.match(skill,/No approval \/ unclear approval/);
  assert.match(skill,/Failed\/pending checks, branch protections/);
  assert.match(skill,/No GitHub write\/merge capability/);
});
