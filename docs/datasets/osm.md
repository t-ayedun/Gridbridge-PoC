# OpenStreetMap (OSM) Power Infrastructure Reference

## Purpose
Serves as an open reference schema for electrical infrastructure elements (substations, lines, towers, generators).

## Source
OpenStreetMap / Geofabrik Power Infrastructure Export.

## License
Open Data Commons Open Database License (ODbL).

## File Format
ESRI Shapefiles (`gis_osm_power_a_free_1.shp`, `gis_osm_power_free_1.shp`).

## Geographic Coverage
Reference area export (Münster / Steinfurt region benchmark).

## Important Fields
- `fclass`: Element class (`substation`, `line`, `generator`, `tower`).
- `voltage`: Operating voltage.
- `power`: Generator fuel type or substation type.

## What it contributes to the PoC
Provides benchmark GIS attribute schemas for network feature extraction.

## Which dashboard modules use it
- **Digital Twin GIS** (`view-twin`)

## Which simulation scripts consume it
- `scripts/ingestion/import_osm.py`

## Current Validation Status
✅ **Validated**: Extracted 16,649 features across 15 OSM spatial layers.
