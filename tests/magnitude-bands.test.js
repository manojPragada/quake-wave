import test from 'node:test';import assert from 'node:assert/strict';import {magnitudeBands} from '../src/model.js';
test('magnitude bands are descriptive counts only',()=>{assert.deepEqual(magnitudeBands([{magnitude:3.9},{magnitude:4},{magnitude:5.9},{magnitude:6},{}]),{below4:1,from4to6:2,atLeast6:1,unknown:1});});
