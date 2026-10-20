# Roadmap

## Completed

- [x] Working static prototype and separated model/UI files
- [x] Behavioral tests and verified setup commands
- [x] Responsive styles, visible focus and reduced-motion support

## Next

- [ ] Add attributed public earthquake feed with timestamps and cache
- [ ] Add historical event playback and richer detail panels
- [ ] Add depth-based globe view and data freshness indicator

## Continuity

2026-10-20: Added repeatable Playwright regression checks and a public-repository-only CI workflow. Desktop, mobile and motion-enabled scenarios passed locally using Chromium 153; model tests and syntax checks passed. Screenshots generated locally for inspection. Earlier browser-unavailable notes below are historical. No deployment or live-provider validation performed. Next: expand browser coverage and review the existing PR before merging.

Initial prototype created 2026-10-17. Re-read repository contents and latest commits before continuing. No hosted deployment. No live data integrations.

## Verification

- 2 model tests passed with Node.js 24.
- JavaScript syntax checks passed.
- Local HTTP document/module/style serving and HTML anchor/ID integrity checked.
- Browser rendering and interaction QA **not completed**: no installed Chromium; browser download failed. No screenshot is claimed.
- Implementation is proposed on `feat/initial-experience` for review; inspect open PRs before starting the next change. Prioritize desktop/mobile and keyboard browser review next.


2026-10-18: Added bounded, session-only USGS-shaped GeoJSON import with timestamp filtering, generation metadata, explicit unverified/non-live labels, invalid-record counts and reset-to-demo. Six model tests pass. Browser file-input review remains pending; no live fetch/caching integration is claimed.

