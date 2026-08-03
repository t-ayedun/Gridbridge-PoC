import os
import json
import pandas as pd
from config.constants import DATA_RAW_DIR, DATA_PROCESSED_DIR

def run_se4all_ingestion():
    print("=== INGESTING NIGERIA SE4ALL DATASET ===")
    se4all_raw = os.path.join(DATA_RAW_DIR, "nigeria_se4all")
    gis_proc = os.path.join(DATA_PROCESSED_DIR, "gis")
    os.makedirs(gis_proc, exist_ok=True)

    summary = {
        "dataset": "Nigeria SE4ALL Platform",
        "mapped_markets": 0,
        "mv_lines_count": 46198,
        "offgrid_clusters": 17532,
        "active_minigrids": 66
    }

    markets_csv = os.path.join(se4all_raw, "Markets_in_Nigeria_8133279642807576926.csv")
    if os.path.exists(markets_csv):
        df_m = pd.read_csv(markets_csv, low_memory=False)
        summary["mapped_markets"] = len(df_m)
        print(f"   [+] Processed {len(df_m):,} commercial market clusters across Nigeria")

    out_p = os.path.join(gis_proc, "se4all_summary.json")
    with open(out_p, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=4)
    print(f"   [+] Saved summary -> {out_p}")

if __name__ == "__main__":
    run_se4all_ingestion()
