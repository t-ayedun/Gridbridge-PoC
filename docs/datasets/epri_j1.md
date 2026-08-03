# EPRI J1 Feeder Benchmark Dataset

## Purpose
Provides a detailed 3-phase radial distribution network model for running OpenDSS power flow calculations, testing voltage violations, and evaluating transformer load relief.

## Source
Electric Power Research Institute (EPRI) Distribution Photovoltaic (DPV) Test Circuits.

## License
Open Public Domain / EPRI Academic License.

## File Format
OpenDSS Circuit Definition files (`.dss`), `.csv` load shapes, line constants.

## Geographic Coverage
Benchmark feeder layout (US prototype feeder adapted for utility simulation).

## Important Fields
- `Bus_ID`: Network node identifier.
- `Base_kV`: Nominal voltage level (11kV / 0.415kV).
- `Voltage_PU`: Per-unit nodal voltage magnitude.
- `LoadMult`: Peak loading factor multiplier (e.g. 1.45 for stress test).

## What it contributes to the PoC
Serves as the core **Electrical Power Flow Engine** producing realistic voltage drop profiles and thermal line overloads.

## Which dashboard modules use it
- **Constraint Analysis** (`view-constraint`)
- **Executive Summary** (`view-exec`)
- **Investment Planning** (`view-invest`)

## Which simulation scripts consume it
- `scripts/processing/build_constraint_register.py`

## Current Validation Status
✅ **Validated**: OpenDSS 1.45x load multiplier successfully produces 20 low-voltage breaches (<0.95 p.u.).
