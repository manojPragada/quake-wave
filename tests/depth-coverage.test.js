import {test} from 'node:test';import assert from 'node:assert/strict';import {depthCoverage} from '../src/model.js';
test('depth coverage reports usable non-negative values',()=>{assert.deepEqual(depthCoverage([{depth:10},{depth:null},{depth:-2},{depth:0}]),{usable:2,total:4,percent:50});assert.deepEqual(depthCoverage([]),{usable:0,total:0,percent:0});});
