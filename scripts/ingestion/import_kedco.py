import os
import json
import pandas as pd
from config.constants import DATA_RAW_DIR, DATA_PROCESSED_DIR

def run_kedco_ingestion():
    print("=== INGESTING KEDCO DATASET ===")
    kedco_raw = os.path.join(DATA_RAW_DIR, "kedco")
    gis_proc = os.path.join(DATA_PROCESSED_DIR, "gis")
    os.makedirs(gis_proc, exist_ok=True)

    csv_path = os.path.join(kedco_raw, "kedcotransformer-and-substationlocations.csv")
    geojson_path = os.path.join(kedco_raw, "kanoelectricmvlinedata.geojson")

    summary = {
        "dataset": "KEDCO Network Data",
        "transformers_count": 0,
        "substations_count": 0,
        "mv_lines_count": 0,
        "total_mv_length_km": 0.0
    }

    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        summary["transformers_count"] = int((df['structure_type'] == 'transformer').sum()) if 'structure_type' in df.columns else 0
        summary["substations_count"] = int((df['structure_type'] == 'substation').sum()) if 'structure_type' in df.columns else 0
        print(f"   [+] Processed {len(df):,} KEDCO assets (Transformers: {summary['transformers_count']}, Substations: {summary['substations_count']})")

    if os.path.exists(geojson_path):
        with open(geojson_path, "r", encoding="utf-8") as f:
            geojson = json.load(f)
        feats = geojson.get("features", [])
        summary["mv_lines_count"] = len(feats)
        print(f"   [+] Processed {len(feats):,} KEDCO MV line segments")

    out_p = os.path.join(gis_proc, "kedco_summary.json")
    with open(out_p, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=4)
    print(f"   [+] Saved summary -> {out_p}")

if __name__ == "__main__":
    run_kedco_ingestion()
