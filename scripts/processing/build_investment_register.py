import os
import json
import pandas as pd
from config.constants import DATA_PROCESSED_DIR, FX_RATE_NGN_PER_USD, UNIT_COSTS_USD

def run_build_investment_register():
    print("=== BUILDING INVESTMENT REGISTER (CAPEX OPTIMIZATION) ===")
    out_dir = os.path.join(DATA_PROCESSED_DIR, "investment")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "investment_register.json")

    candidate_projects = [
        {"Project_ID": "INV-01", "Target_Asset": "TX-07 (Karu Market Spur)", "Constraint": "Critical Overload (112%) & Voltage 0.89 pu", "Intervention": "Upgrade to 800kVA Transformer", "CAPEX_USD": UNIT_COSTS_USD.get('XFMR_UPGRADE_800KVA', 35000), "Customers_Benefited": 160, "Expected_Loss_Reduction_kW": 15.5, "Load_Relief_pct": 42},
        {"Project_ID": "INV-02", "Target_Asset": "TX-03 (Old Garki Spur)", "Constraint": "Critical Overload (105%) & Voltage 0.91 pu", "Intervention": "Upgrade to 800kVA Transformer", "CAPEX_USD": UNIT_COSTS_USD.get('XFMR_UPGRADE_800KVA', 35000), "Customers_Benefited": 145, "Expected_Loss_Reduction_kW": 12.0, "Load_Relief_pct": 35},
        {"Project_ID": "INV-03", "Target_Asset": "F-01 Feeder Midpoint", "Constraint": "End-of-line Voltage Drop (<0.93 pu)", "Intervention": "Install 2MVAr Capacitor Bank", "CAPEX_USD": UNIT_COSTS_USD.get('CAPACITOR_BANK_2MVAR', 28000), "Customers_Benefited": 450, "Expected_Loss_Reduction_kW": 8.4, "Load_Relief_pct": 5},
        {"Project_ID": "INV-04", "Target_Asset": "TX-06 (Area 11 Commercial)", "Constraint": "High Load Warning (92%)", "Intervention": "Upgrade to 500kVA Transformer", "CAPEX_USD": UNIT_COSTS_USD.get('XFMR_UPGRADE_500KVA', 22000), "Customers_Benefited": 120, "Expected_Loss_Reduction_kW": 6.8, "Load_Relief_pct": 25},
        {"Project_ID": "INV-05", "Target_Asset": "F-01 Trunk Line (2.4 km)", "Constraint": "Thermal Line Bottleneck", "Intervention": "Reconductor 2.4km AAC to ACSR", "CAPEX_USD": UNIT_COSTS_USD.get('RECONDUCTOR_KM', 25000) * 2.4, "Customers_Benefited": 500, "Expected_Loss_Reduction_kW": 14.5, "Load_Relief_pct": 15},
        {"Project_ID": "INV-06", "Target_Asset": "TX-02 / TX-04 Feeder", "Constraint": "Phase Current Imbalance", "Intervention": "LV Split Feeder & Phase Balancing", "CAPEX_USD": UNIT_COSTS_USD.get('LV_SPLIT_PHASE', 8000), "Customers_Benefited": 45, "Expected_Loss_Reduction_kW": 4.2, "Load_Relief_pct": 20}
    ]

    df = pd.DataFrame(candidate_projects)
    df['CAPEX_NGN'] = df['CAPEX_USD'].apply(lambda x: round((x * FX_RATE_NGN_PER_USD) / 100000) * 100000)
    df['Priority_Score'] = ((df['Customers_Benefited'] * 0.4) + (df['Expected_Loss_Reduction_kW'] * 2.5) + (df['Load_Relief_pct'] * 0.8)).round(1)
    df = df.sort_values(by='Priority_Score', ascending=False).reset_index(drop=True)
    df['Rank'] = df.index + 1

    df.to_json(out_file, orient="records", indent=4)
    print(f"   [+] Processed {len(df)} candidate CAPEX interventions -> {out_file}")

if __name__ == "__main__":
    run_build_investment_register()
