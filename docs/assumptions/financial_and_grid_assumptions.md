# Financial, CAPEX, and Grid Modeling Assumptions

## Financial & Currency Assumptions
- **Foreign Exchange Rate**: 1,370 NGN / 1 USD (configured in `config/settings.json`).
- **Unit Costs (USD)**:
  - 800 kVA Transformer Upgrade: $35,000 USD (~47,950,000 NGN)
  - 500 kVA Transformer Upgrade: $22,000 USD (~30,140,000 NGN)
  - 2 MVAr Capacitor Bank: $28,000 USD (~38,360,000 NGN)
  - Reconductoring (per km): $25,000 USD (~34,250,000 NGN/km)
  - LV Split Phase & Balancing: $8,000 USD (~10,960,000 NGN)

## OpenDSS Stress Testing Assumptions
- **Base Grid Voltage**: 11 kV L-L / 0.415 kV L-L.
- **Stress Multiplier**: 1.45 (145% peak evening load scenario).
- **Low Voltage Violation Threshold**: < 0.95 p.u. (415V nominal drops below 394V).

## Carbon & Decarbonization Assumptions
- **Baseline Nigerian Grid Intensity**: 485 gCO2e / kWh.
- **Off-Grid Diesel Generator Intensity**: 780 gCO2e / kWh.
- **Solar PV Lifecycle Intensity**: 42 gCO2e / kWh.
- **2030 Decarbonization Target**: 250 gCO2e / kWh.
