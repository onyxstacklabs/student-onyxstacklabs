# Architecture Decisions - Phase 10

## Decision 10.1: Mobility Domain Typing Standard
- **Context:** Decoupling geospatial mapping, EV telemetry, and emergency safety modules requires strong centralized domain interfaces.
- **Decision:** Implemented `src/types/mobility.ts` with explicit type unions (`LocationCategory`, `TransportMode`, `TripStatus`, `ChargerType`, `SafetyAlertLevel`) for end-to-end type safety.
# Architecture Decisions - Phase 10

## Decision 10.1: Mobility Domain Typing Standard
- **Context:** Decoupling geospatial mapping, EV telemetry, and emergency safety modules requires strong centralized domain interfaces.
- **Decision:** Implemented `src/types/mobility.ts` with explicit type unions (`LocationCategory`, `TransportMode`, `TripStatus`, `ChargerType`, `SafetyAlertLevel`) for end-to-end type safety.

## Decision 10.2: Leaflet Dynamic SSR Hydration
- **Context:** Leaflet relies on browser DOM globals (`window`, `document`) which cause Node server errors if required during SSR.
- **Decision:** Encapsulated Leaflet initialization within dynamic `import('leaflet')` calls inside client React `useEffect` hooks in `src/components/mobility/CampusMap.tsx`. Added `leaflet` and `@types/leaflet` to `package.json`.
