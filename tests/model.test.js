import {test} from 'node:test';import assert from 'node:assert/strict';import {visibleEvents} from '../src/model.js';
test('magnitude and time filters intersect',()=>{assert.equal(visibleEvents(5,24).length,2);assert.equal(visibleEvents(5,4).length,1);assert.equal(visibleEvents(0,0).length,0);});
test('thresholds include exact values',()=>assert.equal(visibleEvents(6.2,3)[0].id,'q1'));
