import{describe,expect,it}from'vitest';import{nextEventIndex}from'./navigation'
describe('event navigation',()=>{it('wraps in either direction',()=>{expect(nextEventIndex(2,3,1)).toBe(0);expect(nextEventIndex(0,3,-1)).toBe(2)});it('handles an empty catalog',()=>expect(nextEventIndex(0,0,1)).toBe(-1))})
