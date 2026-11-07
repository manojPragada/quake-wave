import {test} from 'node:test';import assert from 'node:assert/strict';import {depthSummary} from '../src/model.js';
test('depth summary counts records without changing them',()=>{const input=[{depth:10},{depth:100},{depth:400},{depth:null}];assert.deepEqual(depthSummary(input),{Shallow:1,Intermediate:1,Deep:1,Unknown:1});assert.equal(input.length,4);});
