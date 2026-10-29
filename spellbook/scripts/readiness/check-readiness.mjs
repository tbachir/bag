#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
export function auditReadiness(input) {
 const issues=[];
 if(!input || !Array.isArray(input.tasks)) return [{code:'INPUT.INVALID',severity:'BLOCKER',message:'Expected tasks array'}];
 const tasks=new Map();
 for(const [i,t] of input.tasks.entries()) {
  if(!t || typeof t.id!=='string' || !t.id.trim()){issues.push({code:'ID.MISSING',severity:'BLOCKER',task:i});continue;}
  if(tasks.has(t.id)) issues.push({code:'ID.DUPLICATE',severity:'BLOCKER',task:t.id});
  else tasks.set(t.id,t);
  if(typeof t.owner!=='string'||!t.owner.trim()) issues.push({code:'TASK.NO_OWNER',severity:'ERROR',task:t.id});
  if(!Array.isArray(t.acceptance)||!t.acceptance.some(v=>typeof v==='string'&&v.trim())) issues.push({code:'TASK.NO_ACCEPTANCE',severity:'BLOCKER',task:t.id});
  if(t.dependsOn!==undefined&&(!Array.isArray(t.dependsOn)||t.dependsOn.some(v=>typeof v!=='string'||!v.trim()))) issues.push({code:'TASK.INVALID_DEPENDENCIES',severity:'BLOCKER',task:t.id});
 }
 const edges=new Map();
 for(const [id,t] of tasks) {
  const refs=Array.isArray(t.dependsOn)?t.dependsOn.filter(v=>typeof v==='string'):[];
  edges.set(id,refs.filter(v=>tasks.has(v)&&v!==id));
  for(const ref of refs) {
   if(ref===id) issues.push({code:'GRAPH.SELF_DEPENDENCY',severity:'BLOCKER',task:id});
   else if(!tasks.has(ref)) issues.push({code:'GRAPH.UNKNOWN_REFERENCE',severity:'BLOCKER',task:id,reference:ref});
  }
 }
 const done=new Set(),active=new Set(),cycles=new Set();
 const visit=(id,stack)=>{
  if(active.has(id)){
   const sequence=stack.slice(stack.indexOf(id)).concat(id);
   const key=[...new Set(sequence)].sort().join('|');
   if(!cycles.has(key)){cycles.add(key);issues.push({code:'GRAPH.DEPENDENCY_CYCLE',severity:'BLOCKER',task:id,cycle:sequence});}
   return;
  }
  if(done.has(id))return;
  active.add(id);
  for(const ref of edges.get(id)||[])visit(ref,stack.concat(ref));
  active.delete(id);done.add(id);
 };
 for(const id of tasks.keys())visit(id,[id]);
 return issues;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(!process.argv[2]){console.error('Usage: node check-readiness.mjs tasks.json');process.exitCode=2;}
 else try{
  const issues=auditReadiness(JSON.parse(await readFile(process.argv[2],'utf8')));
  const valid=!issues.some(i=>i.severity==='BLOCKER'||i.severity==='ERROR');
  console.log(JSON.stringify({valid,issues},null,2));
  if(!valid)process.exitCode=1;
 }catch(e){console.error(e.message);process.exitCode=2;}
}
