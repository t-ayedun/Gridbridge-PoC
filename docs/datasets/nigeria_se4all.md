# Nigeria SE4ALL Power Sector & Market GIS Dataset

## Purpose
Official open-data power sector layers from the Federal Ministry of Power (FMoP) and Rural Electrification Agency (REA).

## Source
Nigeria SE4ALL Web Portal (GIZ / NESP / FMoP).

## License
Government Open Data / Public Domain.

## File Format
CSV (`Markets_in_Nigeria.csv`) and ESRI Shapefiles (`.shp`, `.dbf`, `.prj`).

## Geographic Coverage
Nationwide (36 States + FCT Abuja).

## Important Fields
- `market_name`: Commercial trade center name.
- `lga`, `state`: Administrative division.
- `distribution_line_all`: 46,198 MV distribution line segments.
- `cluster_offgrid_simple`: 17,532 prioritized off-grid community clusters.

## What it contributes to the PoC
Provides commercial demand center locations (productive use of energy) and official DisCo franchise boundaries.

## Which dashboard modules use it
- **Digital Twin GIS** (`view-twin`)
- **Mini-Grid Telemetry** (`view-minigrid`)
- **Carbon & Decarbonization** (`view-carbon`)

## Which simulation scripts consume it
- `scripts/ingestion/import_se4all.py`

## Current Validation Status
✅ **Validated**: Ingested 11,129 commercial markets, 46k MV line features, and 17.5k off-grid clusters.
