# Nigeria Distribution Grid Density Raster

## Purpose
Provides high-resolution spatial grid presence raster data across Nigeria to estimate distance-to-grid metrics for un-electrified areas.

## Source
World Bank / ESMAP High-Resolution Electricity Access Mapping.

## License
Creative Commons Attribution 4.0 International (CC BY 4.0).

## File Format
CSV Grid Points (`electrical_grid_nigeria_15.csv`, 15 arc-second cell resolution).

## Geographic Coverage
Entire Federal Republic of Nigeria (Lat 4.2°N - 13.9°N, Lon 2.7°E - 14.6°E).

## Important Fields
- `lat`, `lon`: Coordinates of grid raster cell center.
- `grid_distance_km`: Estimated distance to nearest medium-voltage line.

## What it contributes to the PoC
Enables national-scale spatial proximity analysis for grid extension planning.

## Which dashboard modules use it
- **Digital Twin GIS** (`view-twin`)
- **Scenario Simulator** (`view-scenario`)

## Which simulation scripts consume it
- Custom GIS raster analysis scripts.

## Current Validation Status
✅ **Validated**: Ingested 56,128 national grid cell centroids across all 36 States + FCT.
