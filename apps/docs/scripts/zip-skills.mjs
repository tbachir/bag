import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Minimal deterministic ZIP (stored entries; no dependencies or executable code).
const crcTable=Array.from({length:256},(_,n)=>{for(let j=0;j<8;j++) n=(n&1)?(0xedb88320^(n>>>1)):(n>>>1);return n>>>0;});
function crc32(bytes){let crc=0xffffffff;for(const b of bytes) crc=(crc>>>8)^crcTable[(crc^b)&255];return (crc^0xffffffff)>>>0;}
export function buildZip(entries) {
  const parts=[],central=[];let offset=0;
  for(const entry of entries) {
    const filename=Buffer.from(entry.name,'utf8'),body=Buffer.from(entry.data);
    if(!entry.name||entry.name.startsWith('/')||entry.name.split('/').includes('..')) throw new Error('Unsafe ZIP member');
    const hash=crc32(body),local=Buffer.alloc(30),index=Buffer.alloc(46);
    local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6);local.writeUInt32LE(hash,14);local.writeUInt32LE(body.length,18);local.writeUInt32LE(body.length,22);local.writeUInt16LE(filename.length,26);
    index.writeUInt32LE(0x02014b50,0);index.writeUInt16LE(20,4);index.writeUInt16LE(20,6);index.writeUInt16LE(0x800,8);index.writeUInt32LE(hash,16);index.writeUInt32LE(body.length,20);index.writeUInt32LE(body.length,24);index.writeUInt16LE(filename.length,28);index.writeUInt32LE(offset,42);
    parts.push(local,filename,body);central.push(index,filename);offset+=local.length+filename.length+body.length;
  }
  const centralSize=central.reduce((sum,b)=>sum+b.length,0),end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(centralSize,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...parts,...central,end]);
}
export async function writeSkillsArchives({root,output,files}) {
  const slugs=[...new Set(files.map(f=>f.match(/^skill-tree\/skills\/([a-z0-9-]+)\/SKILL\.md$/)?.[1]).filter(Boolean))];
  await mkdir(output,{recursive:true});
  for(const slug of slugs) {
    const prefix=`skill-tree/skills/${slug}/`;
    const source=files.filter(f=>f.startsWith(prefix) && !f.endsWith('/')).sort();
    const members=await Promise.all(source.map(async f=>({name:`${slug}/${f.slice(prefix.length)}`,data:await readFile(path.join(root,f))})));
    await writeFile(path.join(output,`${slug}.zip`),buildZip(members));
  }
  return slugs;
}
