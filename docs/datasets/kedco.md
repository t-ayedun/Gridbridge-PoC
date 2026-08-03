# Kano Electricity Distribution Company (KEDCO) GIS Dataset

## Purpose
Provides real-world Nigerian utility spatial distribution topology (medium-voltage lines, substations, and transformers) for Kano, Katsina, and Jigwa states.

## Source
KEDCO GIS & Asset Register mapping dumps.

## License
Proprietary Utility Data / Research Internal.

## File Format
GeoJSON (`kanoelectricmvlinedata.geojson`) and CSV (`kedcotransformer-and-substationlocations.csv`).

## Geographic Coverage
North-Western Nigeria (Kano, Katsina, Jigwa States: Lat 11.2°N - 13.0°N, Lon 7.5°E - 10.5°E).

## Important Fields
- `name`: Feeder line or substation asset name.
- `voltage`: Operating voltage (11kV / 33kV).
- `structure_type`: Asset classification (`transformer` vs `substation`).
- `X`, `Y`: Geographic coordinates (Longitude/Latitude).

## What it contributes to the PoC
Provides real-world spatial distribution network context and real transformer asset density profiles for Nigerian DisCos.

## Which dashboard modules use it
- **Digital Twin GIS** (`view-twin`)
- **Data & GIS Exporter** (`view-data`)

## Which simulation scripts consume it
- `scripts/ingestion/import_kedco.py`

## Current Validation Status
✅ **Validated**: Ingested 7,191 registered assets (7,147 transformers, 44 substations) and 5,022 MV line segments (6,864 km).
