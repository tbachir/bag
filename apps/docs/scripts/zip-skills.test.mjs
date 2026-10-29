import { test } from 'node:test';
import assert from 'node:assert/strict';
import {buildZip} from './zip-skills.mjs';
test('ZIP has local, central and final records, and rejects traversal',()=>{
 const zip=buildZip([{name:'my-skill/SKILL.md',data:Buffer.from('---\nname: my-skill\n---\n')}]);
 assert.equal(zip.readUInt32LE(0),0x04034b50);
 assert.equal(zip.readUInt32LE(zip.length-22),0x06054b50);
 assert.ok(zip.includes(Buffer.from('my-skill/SKILL.md')));
 assert.throws(()=>buildZip([{name:'../outside',data:Buffer.from('no')}]));
});
