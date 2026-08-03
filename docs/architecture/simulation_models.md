# GridBridge PoC - Simulation Models & Dataset Roles

## Dataset Roles in Simulation

| Dataset | Primary Role | Output Artifacts | Consuming Scripts | Target Dashboard View |
| :--- | :--- | :--- | :--- | :--- |
| **EPRI J1 Feeder** | Electrical Power Flow Simulation | Voltage violations, transformer overloads | `build_constraint_register.py` | Constraint Dashboard (`view-constraint`), Investment (`view-invest`) |
| **KEDCO GIS** | Real Nigerian Distribution Topology | MV lines GeoJSON, transformer spatial registry | `import_kedco.py` | Digital Twin GIS (`view-twin`), Data Exporter (`view-data`) |
| **Nigeria SE4ALL** | Productive Use Commercial Clusters | Mapped market coordinates, DisCo franchise boundaries | `import_se4all.py` | Digital Twin (`view-twin`), Carbon (`view-carbon`) |
| **Nigeria DRE Atlas** | Settlement Demand & Mini-Grid Candidates | Settlement demand metrics, mini-grid candidate list | `import_dre.py` | Mini-Grid Dashboard (`view-minigrid`) |
| **Open-Meteo API** | Solar Irradiance & Telemetry Forecasting | 24-hr PV output, hourly battery SOC | `build_vpp_profiles.py` | VPP Aggregator (`view-vpp`), Mini-Grid (`view-minigrid`) |
| **Grid Carbon Factors** | ESG & Decarbonization Modeling | gCO2/kWh grid intensity, diesel offset kg | `build_carbon_metrics.py` | Carbon Dashboard (`view-carbon`) |
