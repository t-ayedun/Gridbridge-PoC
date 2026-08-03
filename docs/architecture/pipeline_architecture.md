# GridBridge PoC - Pipeline Architecture

## Data Flow Architecture

The GridBridge PoC repository follows a strict decoupled multi-stage data architecture:

```
Public Datasets (EPRI, KEDCO, SE4ALL, DRE, Open-Meteo)
       │
       ▼
1. INGESTION STAGE (`scripts/ingestion/`)
   ├── import_kedco.py   --> Extracts KEDCO assets & line lengths
   ├── import_osm.py     --> Parses OpenStreetMap power elements
   ├── import_se4all.py  --> Ingests commercial market clusters
   └── import_dre.py     --> Analyzes 154k settlement demand profiles
       │
       ▼
2. PROCESSING & SIMULATION STAGE (`scripts/processing/`)
   ├── build_constraint_register.py --> OpenDSS load flow stress test (<0.95 p.u.)
   ├── build_investment_register.py --> Multi-attribute CAPEX priority scoring
   ├── build_vpp_profiles.py        --> 24-hr PV generation & battery dispatch
   └── build_carbon_metrics.py       --> Grid carbon intensity & diesel offsets
       │
       ▼
3. EXPORT & DASHBOARD SYNC (`scripts/export/`)
   └── inject_dashboard_data.py --> Injects processed JSON data into `index.html`
       │
       ▼
4. FRONTEND DASHBOARD (`index.html`)
   └── Standalone, offline HTML/JS web dashboard rendering 10 modules
```

## AEDC Data Integration Flow

When AEDC utility datasets (OpenDSS feeder files, GIS asset shapefiles, smart meter readings) arrive:
1. Place raw AEDC files under `data/raw/aedc/`.
2. Add an ingestion script `scripts/ingestion/import_aedc.py`.
3. Update `config/settings.json` to reference the AEDC OpenDSS master circuit file.
4. Run `python scripts/build_poc_data.py` to regenerate all processed JSONs and sync `index.html` automatically.
