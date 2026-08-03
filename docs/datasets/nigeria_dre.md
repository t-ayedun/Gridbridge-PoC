# World Bank Nigeria Distributed Renewable Energy (DRE) Atlas

## Purpose
Provides comprehensive settlement-level socio-economic, population, energy demand, and solar potential data for rural electrification modeling.

## Source
World Bank Nigeria Distributed Renewable Energy Atlas / REA.

## License
Open Data / World Bank License.

## File Format
CSV (`nigeria_dre_atlas_settlements.csv`).

## Geographic Coverage
National coverage across 154,319 mapped Nigerian rural & peri-urban settlements.

## Important Fields
- `village_name`: Settlement name.
- `population`: Estimated resident population.
- `num_buildings`: Building footprint count.
- `demand`: Estimated daily electricity demand (kWh/day).
- `has_nightlight`: Satellite nightlight detection boolean.
- `pv_value`: Solar yield potential (kWh/kWp/year).

## What it contributes to the PoC
Supplies real village demand profiles and identifies off-grid candidate clusters for mini-grid site selection.

## Which dashboard modules use it
- **Mini-Grid Telemetry** (`view-minigrid`)
- **Executive Summary** (`view-exec`)

## Which simulation scripts consume it
- `scripts/ingestion/import_dre.py`

## Current Validation Status
✅ **Validated**: Processed 154,319 settlements (72M inhabitants, 40,301 prime mini-grid candidate sites).
