# GridBridge PoC - AEDC Distribution Network Analytics Platform

> **Lead Architect Note**: This repository is structured as a production-quality research workspace supporting rapid experimentation with public distribution network datasets (EPRI, KEDCO, SE4ALL, DRE Atlas) ahead of proprietary AEDC data integration.

---

## 📌 Project Overview
**GridBridge PoC** is an advanced distribution network planning, digital twin modeling, power flow analysis, and Virtual Power Plant (VPP) telemetry dashboard engineered for the **Abuja Electricity Distribution Company (AEDC)** network and Nigerian DisCos.

It combines:
- **OpenDSS Power Flow Simulation** for automated low-voltage constraint detection.
- **CAPEX Investment Optimization** for transformer and feeder upgrade prioritization.
- **VPP Telemetry & Weather Integration** with live Open-Meteo solar forecasting.
- **Decarbonization & ESG Analytics** for tracking grid carbon intensity and diesel generator displacement.

---

## 🏗️ Architecture & Data Pipeline

The platform uses a decoupled, three-stage pipeline architecture:

```
Public Datasets (EPRI, KEDCO, SE4ALL, DRE, Open-Meteo)
       │
       ▼
1. INGESTION STAGE (`scripts/ingestion/`)
   ├── import_kedco.py   --> Ingests KEDCO transformers & line topology
   ├── import_osm.py     --> Parses OpenStreetMap power infrastructure
   ├── import_se4all.py  --> Imports commercial market clusters & DisCo boundaries
   └── import_dre.py     --> Analyzes 154k+ settlement energy demand profiles
       │
       ▼
2. PROCESSING & SIMULATION STAGE (`scripts/processing/`)
   ├── build_constraint_register.py --> Runs OpenDSS power flow stress tests
   ├── build_investment_register.py --> Computes CAPEX priorities & NGN values
   ├── build_vpp_profiles.py        --> Simulates 24-hr PV generation & battery SOC
   └── build_carbon_metrics.py       --> Calculates gCO2/kWh intensity & offsets
       │
       ▼
3. EXPORT & DASHBOARD SYNC STAGE (`scripts/export/`)
   └── inject_dashboard_data.py --> Injects processed JSON into `index.html`
       │
       ▼
4. FRONTEND DASHBOARD (`index.html`)
   └── Standalone, 100% offline-capable web application (10 modules)
```

---

## 📁 Repository Structure

```
GridBridge-PoC/
├── README.md                           # Master project documentation
├── requirements.txt                    # Python environment dependencies
├── index.html                          # Primary frontend web app (v2 with ESG Carbon Tracking)
├── index_v1_backup.html                # Legacy single-page frontend backup
│
├── assets/                             # Frontend UI assets
│   ├── css/                            # Custom stylesheets
│   ├── js/                             # Modular JavaScript logic
│   └── icons/                          # UI branding & icons
│
├── config/                             # Global configuration & constants
│   ├── settings.json                   # Path, FX rate, and OpenDSS settings
│   └── constants.py                    # Python configuration exports
│
├── data/                               # Data storage hierarchy
│   ├── raw/                            # Immutable input datasets
│   │   ├── epri/                       # EPRI J1 & K1 feeder test circuits
│   │   ├── kedco/                      # KEDCO GIS shapefiles & transformer CSVs
│   │   ├── nigeria_mv/                 # National MV grid raster density
│   │   ├── nigeria_dre/                # World Bank DRE Atlas settlements
│   │   ├── nigeria_se4all/             # SE4ALL markets & DisCo shapefiles
│   │   ├── osm/                        # OpenStreetMap power infrastructure
│   │   ├── solar/                      # Solar PV yield profiles
│   │   └── load_profiles/              # Diurnal load curve samples
│   └── processed/                      # Clean pipeline output JSONs
│       ├── constraints/                # OpenDSS voltage violation registers
│       ├── gis/                        # GIS summaries & boundary GeoJSONs
│       ├── investment/                 # Prioritized CAPEX intervention registers
│       ├── minigrid/                   # Candidate off-grid settlement clusters
│       ├── vpp/                        # 24-hr VPP PV & battery dispatch profiles
│       ├── weather/                    # Open-Meteo irradiance forecasts
│       └── carbon/                     # ESG metrics & gCO2/kWh intensities
│
├── scripts/                            # Pipeline execution scripts
│   ├── build_poc_data.py               # Master end-to-end pipeline runner
│   ├── ingestion/                      # Raw dataset ingestion modules
│   │   ├── import_kedco.py
│   │   ├── import_osm.py
│   │   ├── import_se4all.py
│   │   └── import_dre.py
│   ├── processing/                     # Analytical & simulation engines
│   │   ├── build_constraint_register.py
│   │   ├── build_investment_register.py
│   │   ├── build_vpp_profiles.py
│   │   └── build_carbon_metrics.py
│   └── export/                         # Frontend dashboard synchronization
│       └── inject_dashboard_data.py
│
├── notebooks/                          # Research & experimentation notebooks
│   ├── 01_epri_validation.ipynb
│   ├── 02_kedco_analysis.ipynb
│   ├── 03_osm_processing.ipynb
│   ├── 04_se4all_analysis.ipynb
│   ├── 05_dre_analysis.ipynb
│   ├── 06_minigrid_simulation.ipynb
│   └── 07_vpp_simulation.ipynb
│
└── docs/                               # Comprehensive project documentation
    ├── dataset_inventory.md            # Master inventory table of public datasets
    ├── architecture/                   # Pipeline & simulation architecture
    │   ├── pipeline_architecture.md
    │   └── simulation_models.md
    ├── datasets/                       # Detailed markdown doc per dataset
    │   ├── epri_j1.md
    │   ├── kedco.md
    │   ├── nigeria_mv.md
    │   ├── nigeria_dre.md
    │   ├── nigeria_se4all.md
    │   └── osm.md
    ├── assumptions/                    # Financial, grid, and carbon assumptions
    │   └── financial_and_grid_assumptions.md
    └── decisions/                      # Architectural Decision Records (ADRs)
        ├── adr_001_offline_bundling.md
        └── adr_002_public_data_surrogates.md
```

---

## 💻 How to Run the Pipeline

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Execute Master Pipeline
Runs ingestion, OpenDSS power flow, VPP weather forecasting, CAPEX optimization, and syncs `index.html`:
```bash
python scripts/build_poc_data.py
```

### 3. Open Frontend Dashboard
Double-click or serve `index.html` in any modern web browser. It operates **100% offline**.

---

## 🔄 How to Add a New Dataset

1. Place raw files under `data/raw/<dataset_name>/`.
2. Create an ingestion script `scripts/ingestion/import_<dataset_name>.py`.
3. Create a dataset documentation file in `docs/datasets/<dataset_name>.md`.
4. Register the dataset in `docs/dataset_inventory.md`.
5. Import and call your ingestion module inside `scripts/build_poc_data.py`.

---

## 🔌 How to Replace Public Data with AEDC Data

When proprietary AEDC utility data arrives:

1. **OpenDSS Feeder Circuit Files (`.dss`)**:
   - Place AEDC feeder files in `data/raw/aedc/dss/`.
   - Update `default_master_file` in `config/settings.json` to point to the AEDC master `.dss` file.
2. **GIS Network & Asset Shapefiles**:
   - Place AEDC GIS shapefiles in `data/raw/aedc/gis/`.
   - Update `scripts/ingestion/import_kedco.py` or add `import_aedc.py` to extract AEDC transformer and line geometries into `data/processed/gis/`.
3. **Smart Meter / Telemetry CSVs**:
   - Place meter load curves in `data/raw/aedc/telemetry/`.
   - Update `scripts/processing/build_vpp_profiles.py` to read AEDC hourly load profiles.
4. **Re-run Pipeline**:
   - Execute `python scripts/build_poc_data.py` to automatically update all dashboard modules with real AEDC data.

---

## 📦 Missing Large Datasets (Git LFS / Ignored Files)

Due to GitHub file size limits, the following massive spatial datasets are **ignored by Git** and must be downloaded separately to run the full ingestion pipeline:

1. **Nigeria GPKG GIS Database (`nigeria-260728-free.gpkg`)**: 
   - **Size**: ~4.8 GB
   - **Download Source**: Geofabrik OpenStreetMap Data Extracts (or project shared drive).
   - **Placement**: Place the unzipped `nigeria-260728-free.gpkg` folder at the repository root.

2. **World Bank DRE Atlas (`nigeria_dre_atlas_settlements.csv` / `.geojson`)**:
   - **Size**: ~300 MB
   - **Download Source**: World Bank Energy Data portal.
   - **Placement**: Place inside `data/raw/nigeria_dre/`.

*Note: The frontend dashboard (`index.html`) operates perfectly without these files. They are only required if you are executing the Python data processing pipeline from scratch.*
