# Roadmap
## Completed
- [x] Build an offline synthetic earthquake map and timeline
- [x] Add magnitude and playback-window filters
- [x] Add a user-initiated USGS past-day GeoJSON adapter
- [x] Add loading, feed-error and empty states
- [x] Label the visualization as non-alerting and non-safety-critical
- [x] Add wrapping arrow-key navigation between catalog events
## Next
- [ ] Add bounded historical playback snapshots without excessive API requests
- [ ] Persist the last successful feed only with freshness metadata
- [ ] Add plate-boundary layers with verified public attribution
## Continuity
2026-11-09: Added Arrow-key event navigation with wrapping selection, focus retention and unit-tested index behavior. Next: add bounded historical playback snapshots without multiplying feed requests.

2026-11-09: Established the first working Quake Wave map with synthetic fallback data, magnitude/time filtering and a user-initiated official USGS past-day GeoJSON loader. The parser drops malformed features, surfaces request errors and never presents the interface as an alert system.
