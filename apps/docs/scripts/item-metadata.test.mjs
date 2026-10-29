import { test } from 'node:test';
import assert from 'node:assert/strict';
import {normalizeItemMetadata,folderNavigation} from './item-metadata.mjs';
test('optional item metadata: preserve recursive children and safe attributes',()=>{
 const x=normalizeItemMetadata({type:'library',tags:['auth','auth'],technologies:['nextjs'],navigation:{title:'Auth',pages:['index','setup']}});
 assert.deepEqual(x.tags,['auth']);
 assert.deepEqual(folderNavigation(x,['index','nested','setup']),{title:'Auth',pages:['index','setup','nested']});
});
test('reject unsupported metadata, unsafe navigation and malformed filters',()=>{
 assert.throws(()=>normalizeItemMetadata({unknown:true}));
 assert.throws(()=>normalizeItemMetadata({navigation:{pages:['../../outside']}}));
 assert.throws(()=>normalizeItemMetadata({tags:'auth'}));
});

test('recommendation is contextual and template hints are opt-in',()=>{
 const item=normalizeItemMetadata({type:'skill',template:'skill',recommendation:'mandatory',contexts:['expo','react','expo']});
 assert.deepEqual(item.contexts,['expo','react']);
 assert.equal(item.template,'skill');
 assert.throws(()=>normalizeItemMetadata({recommendation:'required'}));
 assert.throws(()=>normalizeItemMetadata({template:'<script>'}));
});
