import os
import json
import pandas as pd
from config.constants import DATA_RAW_DIR, DATA_PROCESSED_DIR

def run_dre_ingestion():
    print("=== INGESTING NIGERIA DRE ATLAS SETTLEMENTS DATASET ===")
    dre_raw = os.path.join(DATA_RAW_DIR, "nigeria_dre")
    minigrid_proc = os.path.join(DATA_PROCESSED_DIR, "minigrid")
    os.makedirs(minigrid_proc, exist_ok=True)

    csv_path = os.path.join(dre_raw, "nigeria_dre_atlas_settlements.csv")

    summary = {
        "dataset": "World Bank Nigeria DRE Atlas",
        "total_settlements": 0,
        "total_population": 0,
        "total_buildings": 0,
        "total_daily_demand_mwh": 0.0,
        "minigrid_candidate_sites": 0
    }

    if os.path.exists(csv_path):
        cols = ['village_name', 'population', 'num_buildings', 'demand', 'security_risk', 'has_nightlight']
        df_dre = pd.read_csv(csv_path, usecols=cols)
        summary["total_settlements"] = len(df_dre)
        summary["total_population"] = int(df_dre['population'].sum())
        summary["total_buildings"] = int(df_dre['num_buildings'].sum())
        summary["total_daily_demand_mwh"] = round(df_dre['demand'].sum() / 1000, 2)
        
        # High potential minigrid candidates: off-grid (no nightlight) & > 100 buildings
        candidates = df_dre[(df_dre['has_nightlight'] == False) & (df_dre['num_buildings'] >= 100)]
        summary["minigrid_candidate_sites"] = len(candidates)
        print(f"   [+] Analyzed {len(df_dre):,} settlements (Identified {len(candidates):,} prime mini-grid candidate sites)")

    out_p = os.path.join(minigrid_proc, "dre_settlements.json")
    with open(out_p, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=4)
    print(f"   [+] Saved summary -> {out_p}")

if __name__ == "__main__":
    run_dre_ingestion()
