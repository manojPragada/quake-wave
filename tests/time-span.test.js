import test from 'node:test';import assert from 'node:assert/strict';import {loadedTimeSpan} from '../src/model.js';
test('loadedTimeSpan reports bounds without a freshness claim',()=>{assert.deepEqual(loadedTimeSpan([{hour:9},{hour:3},{hour:14}]),{earliest:3,latest:14});assert.equal(loadedTimeSpan([]),null);});
