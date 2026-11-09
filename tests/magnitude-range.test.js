import {test} from 'node:test';import assert from 'node:assert/strict';import {magnitudeRange} from '../src/model.js';
test('magnitude range describes only finite visible values',()=>{assert.equal(magnitudeRange([]),null);assert.deepEqual(magnitudeRange([{magnitude:3.8},{magnitude:6.2},{magnitude:null}]),{minimum:3.8,maximum:6.2,spread:2.4000000000000004});});
