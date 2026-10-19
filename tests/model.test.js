import {test} from 'node:test';import assert from 'node:assert/strict';import {visibleEvents,parseGeoJSON} from '../src/model.js';
test('magnitude and time filters intersect',()=>{assert.equal(visibleEvents(5,24).length,2);assert.equal(visibleEvents(5,4).length,1);assert.equal(visibleEvents(0,0).length,0);});
test('thresholds include exact values',()=>assert.equal(visibleEvents(6.2,3)[0].id,'q1'));


function fixture(){return {type:'FeatureCollection',metadata:{generated:1000},features:[{type:'Feature',id:'source-id',properties:{mag:4.5,time:1000,place:'Example'},geometry:{type:'Point',coordinates:[10,20,30]}}]};}
test('saved GeoJSON retains coordinates and timestamps',()=>{const result=parseGeoJSON(fixture());assert.equal(result.events[0].lon,10);assert.equal(result.events[0].depth,30);assert.equal(result.events[0].time,1000);assert.equal(result.skipped,0);assert.equal(result.generated,1000);});
test('invalid feature values are skipped without numeric coercion',()=>{const value=fixture();value.features.push({...value.features[0],properties:{mag:null,time:1000}});assert.equal(parseGeoJSON(value).skipped,1);assert.equal(parseGeoJSON(value).events.length,1);});
test('malformed and empty imports are rejected',()=>{for(const input of [null,{}, {type:'FeatureCollection',features:[]}, {type:'FeatureCollection',features:Array(5001).fill(null)}])assert.throws(()=>parseGeoJSON(input));});
test('imported timestamp filtering and sorting are deterministic',()=>{const dataset=[{id:'a',magnitude:4,time:100},{id:'b',magnitude:5,time:200}];assert.equal(visibleEvents(0,150,dataset)[0].id,'a');assert.equal(visibleEvents(0,300,dataset)[0].id,'b');assert.equal(visibleEvents(6,300,dataset).length,0);});
