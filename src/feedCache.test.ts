import { describe, expect, it } from 'vitest'
import { createFeedCache, maxFeedCacheAgeMs, restoreFeedCache } from './feedCache'
import type { Quake } from './feed'

const event: Quake = { id: 'us-1', mag: 4.2, place: 'Catalog place', time: 100, lat: 1, lon: 2, depth: 3, url: 'https://earthquake.usgs.gov/x', source: 'usgs' }

describe('last successful feed cache', () => {
  it('round-trips bounded USGS events with retrieval time', () => {
    const cache = createFeedCache([event], 1_000)
    expect(restoreFeedCache(JSON.stringify(cache), 2_000)).toEqual(cache)
  })
  it('rejects stale, future, malformed and synthetic cache entries', () => {
    expect(restoreFeedCache(JSON.stringify(createFeedCache([event], 1_000)), 1_000 + maxFeedCacheAgeMs + 1)).toBeNull()
    expect(restoreFeedCache(JSON.stringify(createFeedCache([event], 10_000_000)), 1_000)).toBeNull()
    expect(restoreFeedCache('{broken', 1_000)).toBeNull()
    expect(() => createFeedCache([{ ...event, source: 'demo' }], 1_000)).toThrow('USGS')
  })
})
