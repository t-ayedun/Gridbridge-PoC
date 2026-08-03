import os
import json
import struct
from config.constants import DATA_RAW_DIR, DATA_PROCESSED_DIR

def run_osm_ingestion():
    print("=== INGESTING OPENSTREETMAP POWER GRID DATA ===")
    osm_raw = os.path.join(DATA_RAW_DIR, "osm")
    gis_proc = os.path.join(DATA_PROCESSED_DIR, "gis")
    os.makedirs(gis_proc, exist_ok=True)

    def read_dbf_recs(dbf_p):
        try:
            with open(dbf_p, "rb") as f:
                return struct.unpack("<I", f.read(8)[4:8])[0]
        except Exception:
            return 0

    layers_info = {}
    total_features = 0

    if os.path.exists(osm_raw):
        for f in os.listdir(osm_raw):
            if f.endswith(".dbf"):
                recs = read_dbf_recs(os.path.join(osm_raw, f))
                layers_info[f.replace(".dbf", "")] = recs
                total_features += recs

    summary = {
        "dataset": "OSM Power Infrastructure",
        "total_layers": len(layers_info),
        "total_features": total_features,
        "layers": layers_info
    }

    out_p = os.path.join(gis_proc, "osm_summary.json")
    with open(out_p, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=4)
    print(f"   [+] Processed {total_features:,} features across {len(layers_info)} OSM layers -> {out_p}")

if __name__ == "__main__":
    run_osm_ingestion()
