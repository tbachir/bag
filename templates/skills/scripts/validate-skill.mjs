#!/usr/bin/env node
/** Dependency-free structural validator; not a substitute for factual/behavioral review. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const help='Usage: node templates/skills/scripts/validate-skill.mjs <skill-directory> [--json]';
const args=process.argv.slice(2);
if (args.includes('--help')||args.includes('-h')) {console.log(help);process.exit(0);}
const paths=args.filter(x=>x!=='--json');
if(paths.length!==1){console.error(help);process.exit(2);}
const dir=path.resolve(paths[0]);const errors=[];const warnings=[];const addError=m=>errors.push(m);
const skipNames=new Set(['node_modules','.git','__pycache__']);
function walk(current){for(const entry of fs.readdirSync(current,{withFileTypes:true})){
  const p=path.join(current,entry.name);
  if (entry.isSymbolicLink()) {addError(`Symlink forbidden: ${p}`); continue;}
  if(entry.isDirectory()){if(!skipNames.has(entry.name))walk(p);continue;}
  if(!entry.isFile()){addError(`Unsupported entry: ${p}`);continue;}
  const content=fs.readFileSync(p,'utf8');
  if(/__(?:SKILL_NAME|SKILL_DESCRIPTION|SPECIFIC_TRIGGER|EXPECTED_ARTIFACT|ACCEPTANCE_TEST|ACTION_ONE|ACTION_TWO|VERIFICATION|INPUTS|NON_TRIGGER)__/g.test(content))addError(`Unfilled placeholders: ${path.relative(dir,p)}`);
  if(/(?:OPENAI_API_KEY|GITHUB_TOKEN|VERCEL_TOKEN)\s*[:=]\s*['"]?[A-Za-z0-9_-]{16,}/.test(content))addError(`Possible committed credential: ${path.relative(dir,p)}`);
  if(p.endsWith('.json')){try{JSON.parse(content);}catch(e){addError(`Invalid JSON ${path.relative(dir,p)}: ${e.message}`);}}
}}
try {
 if(!fs.existsSync(dir)||!fs.statSync(dir).isDirectory())throw Error('Skill directory is missing');
 walk(dir);
 const filename=path.join(dir,'SKILL.md');
 if(!fs.existsSync(filename))addError('Missing SKILL.md');
 else {
   const content=fs.readFileSync(filename,'utf8');
   const m=content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
   if(!m)addError('SKILL.md must start with YAML frontmatter');
   else {
     const fm=m[1];
     const name=fm.match(/^name:\s*(.+)\s*$/m)?.[1]?.replace(/^['"]|['"]$/g,'').trim();
     const description=fm.match(/^description:\s*(.+)\s*$/m)?.[1]?.trim();
     if(!name||! /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name))addError('Frontmatter name must be kebab-case');
     else if(name!==path.basename(dir))addError(`Skill name ${name} differs from folder ${path.basename(dir)}`);
     if(!description||description.length<20)addError('Description must clearly define specific use/trigger');
     if(description?.includes('__'))addError('Description contains placeholders');
     if(!/\bWhen to use\b/i.test(content))warnings.push('Consider adding a clear "When to use" section');
   }
 }
 if(!fs.existsSync(path.join(dir,'README.md')))warnings.push('Human-facing README.md is recommended');
 const result={dir,passed:errors.length===0,errors,warnings};
 console.log(args.includes('--json')?JSON.stringify(result,null,2):`${result.passed?'PASS':'FAIL'} ${dir}\n${errors.map(x=>'ERROR '+x).concat(warnings.map(x=>'WARN '+x)).join('\n')}`);
 process.exit(result.passed?0:1);
}catch(e){console.error(`ERROR: ${e.message}`);process.exit(1);}
