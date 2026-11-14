#!/usr/bin/env node
/** Safe, dependency-free Agent Skill scaffold. Dry-run default, no overwrite. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'starter');
const help = `Usage: node templates/skills/scripts/create-skill.mjs --name <kebab-case> --description <specific trigger> --target <existing-parent-dir> [--write] [--json]
Dry run by default; --write creates only absent files. Does not install, execute or push anything.`;
function parse(argv) {
  const o = { write: false, json: false };
  for (let i=0; i<argv.length; i++) {
    const token = argv[i];
    if (token === '--help' || token === '-h') { o.help = true; continue; }
    if (token === '--write' || token === '--json') { o[token.slice(2)] = true; continue; }
    if (!['--name','--description','--target'].includes(token) || !argv[i+1] || argv[i+1].startsWith('--')) throw Error(`Invalid argument: ${token}\n${help}`);
    o[token.slice(2)] = argv[++i];
  }
  return o;
}
function rejectSymlinkAncestors(p) {
  let cursor = path.resolve(p);
  for (;;) {
    if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) throw Error(`Symlink target path rejected: ${cursor}`);
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
}
function filesUnder(dir, prefix='') {
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry => {
    const rel = path.join(prefix, entry.name);
    if (entry.isSymbolicLink()) throw Error(`Template symlink rejected: ${rel}`);
    if (entry.isDirectory()) return filesUnder(path.join(dir,entry.name),rel);
    if (!entry.isFile()) throw Error(`Unexpected template entry: ${rel}`);
    return [rel];
  }).sort();
}
try {
  const a = parse(process.argv.slice(2));
  if (a.help) { console.log(help); process.exit(0); }
  if (!a.name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.name) || a.name.length > 64) throw Error('--name must be kebab-case, <=64 characters');
  if (!a.description || a.description.trim().length < 20 || /[\r\n]/.test(a.description)) throw Error('--description needs a specific single-line trigger of at least 20 characters');
  if (!a.target) throw Error('--target is required; no implicit current-directory modifications');
  const parent = path.resolve(a.target);
  rejectSymlinkAncestors(parent);
  if (!fs.existsSync(parent) || !fs.statSync(parent).isDirectory()) throw Error(`Target parent must already exist: ${parent}`);
  const dest = path.join(parent, a.name);
  if (fs.existsSync(dest)) throw Error(`Refusing to overwrite an existing skill: ${dest}`);
  const names = filesUnder(base);
  const today = new Date().toISOString().slice(0,10);
  const title = a.name.split('-').map(v=>v[0].toUpperCase()+v.slice(1)).join(' ');
  const values = {__SKILL_NAME__:a.name,__SKILL_TITLE__:title,__SKILL_DESCRIPTION__:a.description.trim(),__CREATION_DATE__:today};
  const out = names.map(rel=>({path:path.join(dest,rel),rel}));
  if (a.write) {
    fs.mkdirSync(dest,{recursive:false});
    for (const item of out) {
      const source = fs.readFileSync(path.join(base,item.rel),'utf8');
      let transformed = source;
      for (const [needle,val] of Object.entries(values)) {
        const replacement = needle === "__SKILL_DESCRIPTION__" && item.rel === "SKILL.md" ? val.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"") : val;
        transformed = transformed.split(needle).join(replacement);
      }
      fs.mkdirSync(path.dirname(item.path),{recursive:true});
      fs.writeFileSync(item.path,transformed,{flag:'wx',encoding:'utf8'});
    }
  }
  const report={mode:a.write?'written':'dry-run',dest,files:out.map(x=>x.rel),notes:'Replace remaining placeholders and verify using validate-skill.mjs before publishing.'};
  console.log(a.json?JSON.stringify(report,null,2):`${report.mode}: ${dest}\n${out.map(x=>' - '+x.rel).join('\n')}\n${report.notes}`);
} catch(error) { console.error(`ERROR: ${error.message}`); process.exit(1); }
