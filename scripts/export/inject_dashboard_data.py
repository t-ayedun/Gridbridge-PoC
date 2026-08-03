import os
import sys
import json

# Ensure project root in python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from config.constants import DATA_PROCESSED_DIR, INDEX_HTML_PATH

def run_dashboard_data_injection():
    print("=== EXPORT: INJECTING FULL GIS MAP DATASETS (KEDCO, SE4ALL, DRE, AEDC) INTO INDEX.HTML ===")

    vpp_file = os.path.join(DATA_PROCESSED_DIR, "vpp", "vpp_daily_profile.json")
    invest_file = os.path.join(DATA_PROCESSED_DIR, "investment", "investment_register.json")
    kedco_file = os.path.join(DATA_PROCESSED_DIR, "gis", "kedco_summary.json")
    se4all_file = os.path.join(DATA_PROCESSED_DIR, "gis", "se4all_summary.json")
    dre_file = os.path.join(DATA_PROCESSED_DIR, "minigrid", "dre_settlements.json")

    pv_curve, load_curve, soc_curve, grid_curve = [], [], [], []
    if os.path.exists(vpp_file):
        with open(vpp_file, "r", encoding="utf-8") as f:
            vpp_data = json.load(f)
        pv_curve = [item["PV_Generation_kW"] for item in vpp_data]
        load_curve = [item["Local_Demand_kW"] for item in vpp_data]
        soc_curve = [item["Battery_SOC_%"] for item in vpp_data]
        grid_curve = [item["Grid_Exchange_kW"] for item in vpp_data]

    formatted_projects = []
    if os.path.exists(invest_file):
        with open(invest_file, "r", encoding="utf-8") as f:
            invest_data = json.load(f)
        for p in invest_data:
            formatted_projects.append({
                "id": p["Project_ID"],
                "constraint": p["Constraint"],
                "action": p["Intervention"],
                "capex": p["CAPEX_USD"],
                "priority": p["Priority_Score"],
                "loadRed": p["Load_Relief_pct"],
                "lossRed": p["Expected_Loss_Reduction_kW"],
                "cust": p["Customers_Benefited"]
            })

    kedco_info = {}
    if os.path.exists(kedco_file):
        with open(kedco_file, "r", encoding="utf-8") as f:
            kedco_info = json.load(f)

    se4all_info = {}
    if os.path.exists(se4all_file):
        with open(se4all_file, "r", encoding="utf-8") as f:
            se4all_info = json.load(f)

    dre_info = {}
    if os.path.exists(dre_file):
        with open(dre_file, "r", encoding="utf-8") as f:
            dre_info = json.load(f)

    # Multi-DisCo Substations & Feeders
    substations = [
        {"id": "SUB-AEDC-01", "name": "Garki 33/11kV Substation (AEDC)", "region": "Abuja FCT", "rating_mva": 20},
        {"id": "SUB-KEDCO-01", "name": "Kano Main 330/132/33kV Substation (KEDCO)", "region": "Kano State", "rating_mva": 150},
        {"id": "SUB-KEDCO-02", "name": "Katsina Transmission Station (KEDCO)", "region": "Katsina State", "rating_mva": 60},
        {"id": "SUB-KEDCO-03", "name": "Dutse 132/33kV Substation (KEDCO)", "region": "Jigwa State", "rating_mva": 40}
    ]

    feeders = [
        {"id": "F-AEDC-01", "name": "Garki Feeder 1", "disco": "AEDC", "voltage_kv": 11, "length_km": 12.4},
        {"id": "F-AEDC-02", "name": "Wuse Feeder 2", "disco": "AEDC", "voltage_kv": 11, "length_km": 9.8},
        {"id": "F-KEDCO-01", "name": "Bagauda 33kV Feeder", "disco": "KEDCO", "voltage_kv": 33, "length_km": 125.1},
        {"id": "F-KEDCO-02", "name": "Kazaure 33kV Feeder", "disco": "KEDCO", "voltage_kv": 33, "length_km": 98.5},
        {"id": "F-KEDCO-03", "name": "Hadejia 33kV Feeder", "disco": "KEDCO", "voltage_kv": 33, "length_km": 89.1},
        {"id": "F-KEDCO-04", "name": "Dambatta 11kV Feeder", "disco": "KEDCO", "voltage_kv": 11, "length_km": 76.3}
    ]

    transformers = [
        {"id": "TX-01", "name": "TX-01 (Area 1 Res)", "disco": "AEDC", "rating_kva": 315, "loading": 78, "volt": 0.98, "cust": 180, "status": "healthy"},
        {"id": "TX-02", "name": "TX-02 (Area 2 Res)", "disco": "AEDC", "rating_kva": 500, "loading": 92, "volt": 0.94, "cust": 240, "status": "warning"},
        {"id": "TX-03", "name": "TX-03 (Old Garki Spur)", "disco": "AEDC", "rating_kva": 500, "loading": 105, "volt": 0.91, "cust": 310, "status": "critical"},
        {"id": "TX-07", "name": "TX-07 (Karu Market Spur)", "disco": "AEDC", "rating_kva": 500, "loading": 112, "volt": 0.89, "cust": 160, "status": "critical"},
        {"id": "TX-KEDCO-01", "name": "TX-Bagauda Industrial", "disco": "KEDCO", "rating_kva": 800, "loading": 105, "volt": 0.91, "cust": 280, "status": "critical"},
        {"id": "TX-KEDCO-02", "name": "TX-Katsina TS Spur", "disco": "KEDCO", "rating_kva": 500, "loading": 94, "volt": 0.93, "cust": 195, "status": "warning"}
    ]

    # GIS Map Points for Leaflet Renderer
    gis_map_points = [
        {"id": "KEDCO-SUB-01", "name": "Kano Main 330/132/33kV Substation", "type": "substation", "disco": "KEDCO", "state": "Kano", "lat": 12.0022, "lon": 8.5920, "rating": "150 MVA", "status": "healthy"},
        {"id": "KEDCO-SUB-02", "name": "Katsina Transmission Station", "type": "substation", "disco": "KEDCO", "state": "Katsina", "lat": 12.9889, "lon": 7.6008, "rating": "60 MVA", "status": "healthy"},
        {"id": "KEDCO-SUB-03", "name": "Dutse 132/33kV Substation", "type": "substation", "disco": "KEDCO", "state": "Jigwa", "lat": 11.7594, "lon": 9.3392, "rating": "40 MVA", "status": "healthy"},
        {"id": "KEDCO-TX-01", "name": "TX-Bagauda Industrial Transformer", "type": "transformer", "disco": "KEDCO", "state": "Kano", "lat": 11.8340, "lon": 8.5420, "rating": "800 kVA", "loading": 105, "status": "critical"},
        {"id": "KEDCO-TX-02", "name": "TX-Kazaure Commercial Transformer", "type": "transformer", "disco": "KEDCO", "state": "Jigwa", "lat": 12.6480, "lon": 8.4120, "rating": "500 kVA", "loading": 94, "status": "warning"},
        {"id": "KEDCO-TX-03", "name": "TX-BUK Campus Kano", "type": "transformer", "disco": "KEDCO", "state": "Kano", "lat": 11.9790, "lon": 8.4230, "rating": "1000 kVA", "loading": 86, "status": "warning"},
        {"id": "SE4ALL-MKT-01", "name": "Kano Kurmi Market Cluster", "type": "market", "disco": "KEDCO", "state": "Kano", "lat": 12.0005, "lon": 8.5160, "shops": 1250, "pue_kw": 450},
        {"id": "SE4ALL-MKT-02", "name": "Ebonyi Abakaliki Rice Mill Market", "type": "market", "disco": "EEDC", "state": "Ebonyi", "lat": 6.3249, "lon": 8.1137, "shops": 1686, "pue_kw": 620},
        {"id": "DRE-SET-01", "name": "Rimi Rural Settlement", "type": "dre_minigrid", "state": "Katsina", "lat": 12.8520, "lon": 7.7120, "pop": 4210, "buildings": 380, "demand_kwh": 850, "pv_yield": 1680.5},
        {"id": "DRE-SET-02", "name": "Gwaram Off-Grid Community", "type": "dre_minigrid", "state": "Jigwa", "lat": 11.2780, "lon": 9.8820, "pop": 5890, "buildings": 510, "demand_kwh": 1240, "pv_yield": 1620.2},
        {"id": "AEDC-SUB-01", "name": "Garki 33/11kV Substation", "type": "substation", "disco": "AEDC", "state": "Abuja FCT", "lat": 9.0340, "lon": 7.4890, "rating": "20 MVA", "status": "healthy"},
        {"id": "AEDC-TX-01", "name": "TX-07 (Karu Market Spur)", "type": "transformer", "disco": "AEDC", "state": "Abuja FCT", "lat": 9.0120, "lon": 7.5610, "rating": "500 kVA", "loading": 112, "status": "critical"}
    ]

    pv_14 = pv_curve[14] if len(pv_curve) > 14 else 246.8
    soc_14 = soc_curve[14] if len(soc_curve) > 14 else 63.4
    grid_15 = grid_curve[15] if len(grid_curve) > 15 else 220.0
    load_14 = load_curve[14] if len(load_curve) > 14 else 145.2

    new_data_js = f"""var DATA = {{
  substations: {json.dumps(substations, indent=2)},
  feeders: {json.dumps(feeders, indent=2)},
  transformers: {json.dumps(transformers, indent=2)},
  gis_points: {json.dumps(gis_map_points, indent=2)},
  projects: {json.dumps(formatted_projects, indent=2)},
  minigrid: {{ pv_kw:{pv_14}, soc:{soc_14}, batt_kw:-45, grid_import:0, grid_export:{grid_15}, demand:{load_14}, mode:'Islanded', freq:50.02, volt_pu:1.01 }},
  daily: {json.dumps(pv_curve)},
  kedco: {json.dumps(kedco_info, indent=2)},
  se4all: {json.dumps(se4all_info, indent=2)},
  dre: {json.dumps(dre_info, indent=2)}
}};\n"""

    if not os.path.exists(INDEX_HTML_PATH):
        print(f"   [-] Error: index.html not found at {INDEX_HTML_PATH}")
        return

    with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
        html_content = f.read()

    start_marker = "var DATA = {"
    end_marker = "};"

    start_idx = html_content.find(start_marker)
    if start_idx != -1:
        end_idx = html_content.find(end_marker, start_idx) + 2
        updated_html = html_content[:start_idx] + new_data_js + html_content[end_idx:]

        with open(INDEX_HTML_PATH, "w", encoding="utf-8") as f:
            f.write(updated_html)
        print(f"   [+] Successfully injected full state (transformers, feeders, substations, GIS points) into index.html!")
    else:
        print("   [-] Could not locate 'var DATA = {' block in index.html")

if __name__ == "__main__":
    run_dashboard_data_injection()
