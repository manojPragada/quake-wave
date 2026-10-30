# Roadmap

## Completed

- [x] Working static prototype and separated model/UI files
- [x] Behavioral tests and verified setup commands
- [x] Responsive styles, visible focus and reduced-motion support

## Next

- [ ] Add attributed public earthquake feed with timestamps and cache
- [x] Add historical playback for the loaded static dataset, with reduced-motion fallback
- [x] Add richer detail panels
- [ ] Add depth-based globe view (import freshness indicator complete)

## Continuity

2026-10-29: Added filter-aware descriptive magnitude-band counts without hazard or alert interpretation. Next: attributed cached-feed adapter with stale/error states.

2026-10-28: Added the visible loaded-data time span for demo and imported records without implying freshness. Next: attributed cached-feed adapter with stale/error states.

2026-10-27: Added filter-aware largest and average magnitude summaries with an explicit empty state and no hazard interpretation. Next: attributed cached-feed adapter with stale/error states.

2026-10-26: Added a filter-aware depth-band summary for visible demo or imported events without turning descriptive depth into hazard guidance. Next: attributed cached-feed adapter with explicit stale/error states.

2026-10-25: Added readable shallow/intermediate/deep depth bands to event details without presenting them as hazard or safety classifications. Next: attributed cached-feed adapter with explicit stale/error states.

2026-10-24: Added explicit age labels from optional imported generation metadata, including unknown and potentially stale states. The timestamp remains user-supplied and unverified; the app still performs no live refresh. Next: an attributed cached-feed adapter with failure states.

2026-10-23: Added deterministic time, magnitude and depth ordering for the currently visible event set, including imported records. Ordering operates only on loaded data and makes no freshness claim. Next: attributed, cached feed adapter with explicit stale/error states.

2026-10-22: Expanded event details with exact magnitude, depth, coordinates and time plus optional imported source record IDs. Imported provenance remains explicitly unverified. Next: an attributed, cached public-feed adapter with clear freshness and failure states.

2026-10-21: Added a maximum-depth filter that composes with magnitude and time for demo/imported records, plus browser coverage. Imported depth remains user-supplied and unverified.

2026-10-22: Added a pauseable historical-playback control for the currently loaded static dataset, with explicit non-live status and a reduced-motion manual-scrub fallback. Next: richer event details before any live-feed adapter.

2026-10-20: Added repeatable Playwright regression checks and a public-repository-only CI workflow. Desktop, mobile and motion-enabled scenarios passed locally using Chromium 153; model tests and syntax checks passed. Screenshots generated locally for inspection. Earlier browser-unavailable notes below are historical. No deployment or live-provider validation performed. Next: expand browser coverage and review the existing PR before merging.

Initial prototype created 2026-10-17. Re-read repository contents and latest commits before continuing. No hosted deployment. No live data integrations.

## Verification

- 2 model tests passed with Node.js 24.
- JavaScript syntax checks passed.
- Local HTTP document/module/style serving and HTML anchor/ID integrity checked.
- Browser rendering and interaction QA **not completed**: no installed Chromium; browser download failed. No screenshot is claimed.
- Implementation is proposed on `feat/initial-experience` for review; inspect open PRs before starting the next change. Prioritize desktop/mobile and keyboard browser review next.


2026-10-18: Added bounded, session-only USGS-shaped GeoJSON import with timestamp filtering, generation metadata, explicit unverified/non-live labels, invalid-record counts and reset-to-demo. Six model tests pass. Browser file-input review remains pending; no live fetch/caching integration is claimed.


