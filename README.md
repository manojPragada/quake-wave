# Quake Wave
A responsive earthquake-catalog visualization with animated epicenters, magnitude filters and a time window.

**Status:** working demo plus an optional user-initiated public-feed adapter. Synthetic fixtures load first unless a bounded recent successful USGS catalog is restored locally; “Load latest USGS” requests the official USGS all-earthquakes past-day GeoJSON summary. This is not an alert, warning or safety system and there is no hosted demo.

## Run and verify
Requires Node.js 22+ and npm 11+.
```bash
npm install
npm run dev
npm run check
npm run build
```
`check` runs strict TypeScript and parser tests. No linter is configured.

## Data source and attribution
Live mode uses `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`. USGS documents GeoJSON as a programmatic interface and recommends its real-time feeds for display applications. Event records can be revised by contributing networks. See the [USGS GeoJSON summary format](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) and [feed lifecycle policy](https://earthquake.usgs.gov/earthquakes/feed/policy.php). The app makes no background request; the visitor must choose to load or refresh.

## Architecture
`src/feed.ts` owns the typed trust boundary, rejects invalid collections and skips malformed features. `src/main.ts` owns provenance, loading/error/empty states, filtering and rendering. The dependency-light SVG map ships without tiles or geographic claims beyond approximate catalog placement.

After a successful user-initiated request, up to 500 normalized USGS events are cached in browser `localStorage` with their retrieval timestamp. A valid cache is restored for at most 48 hours and is always labelled cached with its age; malformed, synthetic, future-dated or older entries are ignored. Failed refreshes retain the current catalog. No background refresh occurs.

## Structure
```text
src/feed.ts       USGS adapter contract, parser and synthetic fixtures
src/feedCache.ts  bounded last-success cache and freshness validation
src/main.ts       filters, state and accessible event selection
src/styles.css    responsive map and reduced-motion ripples
src/feed.test.ts  malformed/valid feed coverage
ROADMAP.md        continuity and next work
```

## Configuration, deployment and privacy
No key or environment variable is needed; `.env.example` records this. `npm run build` creates static `dist/`. No deployment has been performed. Loading USGS sends a normal browser request to `earthquake.usgs.gov`; no analytics or user location is collected.

## Accessibility and limitations
All events remain selectable in a conventional list, filters are labeled, feed status is textual and reduced motion disables ripple animation. The simple projection is not a scientific map, historical playback is a filter rather than an archived simulation, and catalog absence is not proof that no earthquake occurred.

## Troubleshooting and contribution
- Feed error: synthetic data remains available; retry later and check the official feed directly.
- No matches: lower minimum magnitude or expand the time window.
- Build error: use Node.js 22+, install, then run `npm run check`.

All interface assets and demo fixtures are original. Preserve USGS attribution, the safety disclaimer and parser tests in contributions. No license has been selected.
