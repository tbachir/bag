#!/usr/bin/env node
import { readdir, readFile, lstat, realpath } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const exposures = resolve(root, 'catalog/exposures');
const catalog = resolve(root, 'catalog/items');
const strategies = new Set(['reference','symlink','copy','generate','native-reuse']);
const kinds = new Set(['agent-skill','config','ci-workflow','script','asset','documentation']);
const statuses = new Set(['documented','opt-in','active']);
let failures = 0;
function assert(value,message) { if (!value) { failures++; console.error('FAIL '+message); } }
function safePath(s) { return typeof s==='string' && s.length>0 && !s.startsWith('/') && !s.includes('\\') && !s.split('/').some(x=>x==='..'||x==='.'||!x); }
async function checkPath(s,ctx) {
  assert(safePath(s),ctx+': invalid relative path'); if(!safePath(s))return;
  const target=resolve(root,s), rel=relative(root,target);
  assert(rel!==''&&!rel.startsWith('..'+sep)&&rel!=='..',ctx+': outside root');
  if(rel==='..'||rel.startsWith('..'+sep))return;
  try {
    const st=await lstat(target); assert(!st.isSymbolicLink(),ctx+': symlink source');
    const resolved=await realpath(target); assert(resolved===target,ctx+': resolves outside canonical path');
  } catch(e) {assert(false,ctx+': missing or inaccessible '+s);}
}
const docs=await readdir(exposures);
for(const file of docs.filter(f=>f.endsWith('.json'))) {
  const label='catalog/exposures/'+file; let v;
  try {v=JSON.parse(await readFile(resolve(exposures,file),'utf8'));}catch(e){assert(false,label+': invalid JSON');continue;}
  assert(v.schemaVersion===1,label+': schemaVersion must be 1');
  assert(typeof v.item==='string' && file===v.item+'.json',label+': item ID must match filename');
  try {await readFile(resolve(catalog,v.item+'.json'));}catch(e){assert(false,label+': no matching catalog item');}
  await checkPath(v.canonical,label+'.canonical');
  assert(Array.isArray(v.docs),label+': docs must be an array');
  if(Array.isArray(v.docs)) for(const d of v.docs) await checkPath(d,label+'.docs');
  assert(Array.isArray(v.consumers),label+': consumers must be an array');
  const ids=new Set();
  if(Array.isArray(v.consumers)) for(const c of v.consumers){
    assert(c&&typeof c.id==='string'&&c.id.length>0&&!ids.has(c.id),label+': duplicate/invalid consumer id');
    if(c&&typeof c.id==='string')ids.add(c.id);
    assert(c&&kinds.has(c.kind),label+': unknown consumer kind');
    assert(c&&strategies.has(c.strategy),label+': unknown consumer strategy');
    assert(c&&statuses.has(c.status),label+': unknown consumer status');
    assert(c&&typeof c.target==='string'&&c.target.length>0,label+': missing target');
  }
  console.log('CHECK '+label);
}
if(failures){console.error(failures+' exposure validation error(s)');process.exitCode=1;}
else console.log('PASS '+docs.filter(f=>f.endsWith('.json')).length+' resource exposure descriptor(s)');
