import{describe,expect,it}from'vitest';import{nextPlaybackWindow}from'./playback'
describe('catalog playback windows',()=>{it('advances through bounded snapshots',()=>{expect(nextPlaybackWindow(1)).toBe(3);expect(nextPlaybackWindow(7)).toBe(12)});it('wraps after the loaded 24-hour catalog',()=>expect(nextPlaybackWindow(24)).toBe(1))})
