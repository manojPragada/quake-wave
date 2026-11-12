import type { Quake } from './feed'

export const feedCacheKey = 'quake-wave:usgs-day-cache:v1'
export const maxFeedCacheAgeMs = 48 * 60 * 60 * 1000
const maxCachedEvents = 500

export type FeedCache = { version: 1; retrievedAt: number; events: Quake[] }

const validEvent = (event: unknown, retrievedAt: number): event is Quake => {
  if (!event || typeof event !== 'object') return false
  const item = event as Record<string, unknown>
  return item.source === 'usgs' && typeof item.id === 'string' && typeof item.place === 'string' && typeof item.url === 'string'
    && ['mag', 'time', 'lat', 'lon', 'depth'].every(key => typeof item[key] === 'number' && Number.isFinite(item[key]))
    && (item.lat as number) >= -90 && (item.lat as number) <= 90
    && (item.lon as number) >= -180 && (item.lon as number) <= 180
    && (item.time as number) <= retrievedAt + 5 * 60 * 1000
}

export function restoreFeedCache(raw: string | null, now = Date.now()): FeedCache | null {
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return null
    const cache = value as Partial<FeedCache>
    if (cache.version !== 1 || typeof cache.retrievedAt !== 'number' || !Number.isFinite(cache.retrievedAt)) return null
    if (cache.retrievedAt > now + 5 * 60 * 1000 || now - cache.retrievedAt > maxFeedCacheAgeMs) return null
    if (!Array.isArray(cache.events) || !cache.events.length || cache.events.length > maxCachedEvents || !cache.events.every(event => validEvent(event, cache.retrievedAt!))) return null
    return { version: 1, retrievedAt: cache.retrievedAt, events: cache.events }
  } catch { return null }
}

export function createFeedCache(events: readonly Quake[], retrievedAt = Date.now()): FeedCache {
  if (!Number.isFinite(retrievedAt) || !events.length || events.length > maxCachedEvents || !events.every(event => validEvent(event, retrievedAt))) throw new Error('Only bounded USGS events can be cached')
  return { version: 1, retrievedAt, events: [...events] }
}
