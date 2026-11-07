import {test} from 'node:test';import assert from 'node:assert/strict';import {medianMagnitude} from '../src/model.js';
test('median magnitude handles odd, even and empty visible sets',()=>{assert.equal(medianMagnitude([{magnitude:6},{magnitude:2},{magnitude:4}]),4);assert.equal(medianMagnitude([{magnitude:5},{magnitude:3}]),4);assert.equal(medianMagnitude([{magnitude:null}]),null);});
