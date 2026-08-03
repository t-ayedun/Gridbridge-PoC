# ADR 001: Standalone Single-File Frontend with Offline Library Bundling

## Status
Accepted

## Context
Utility executives, field engineers, and DisCo stakeholders in Nigeria frequently operate in field environments with intermittent or restricted internet access. Depending on CDN URLs for charting libraries (ECharts, Leaflet) introduced latency and rendering failures during offline demonstrations.

## Decision
Bundle all essential JavaScript visualization libraries (ECharts 5.5.0) directly inline within `index.html` (1.17 MB total size) to ensure 100% offline functionality without external network requests.

## Consequences
- **Pros**: 100% offline execution, zero external dependency failures, instant load times in field environments.
- **Cons**: Larger file size for `index.html` (~1.17 MB vs 125 KB).
