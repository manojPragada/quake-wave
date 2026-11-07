import {test} from 'node:test';import assert from 'node:assert/strict';import {medianDepth} from '../src/model.js';
test('median depth ignores invalid and negative values',()=>{assert.equal(medianDepth([{depth:30},{depth:10},{depth:20}]),20);assert.equal(medianDepth([{depth:10},{depth:30}]),20);assert.equal(medianDepth([{depth:-1},{depth:null}]),null);});
