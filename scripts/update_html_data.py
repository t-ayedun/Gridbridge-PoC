import os
import json

BASE_DIR = r"C:\Users\Smarterise PC\Projects\PoC"
DATA_DIR = os.path.join(BASE_DIR, "data", "processed")
INDEX_HTML_PATH = os.path.join(BASE_DIR, "index.html")

print("Reading generated JSON data...")

# 1. Load VPP Data (from Open-Meteo & Load Model)
vpp_file = os.path.join(DATA_DIR, "vpp_daily_profile.json")
with open(vpp_file, "r") as f:
    vpp_data = json.load(f)

# Extract 24-hr arrays
pv_curve = [item["PV_Generation_kW"] for item in vpp_data]
load_curve = [item["Local_Demand_kW"] for item in vpp_data]
soc_curve = [item["Battery_SOC_%"] for item in vpp_data]
grid_curve = [item["Grid_Exchange_kW"] for item in vpp_data]

# 2. Load Investment Data
invest_file = os.path.join(DATA_DIR, "investment_register.json")
with open(invest_file, "r") as f:
    invest_data = json.load(f)

formatted_projects = []
for p in invest_data:
    formatted_projects.append({
        "id": p["Project_ID"],
        "constraint": p["Constraint"],
        "action": p["Intervention"],
        "capex": p["CAPEX_USD"], # USD base for formatting in HTML
        "priority": p["Priority_Score"],
        "loadRed": p["Load_Relief_pct"],
        "lossRed": p["Expected_Loss_Reduction_kW"],
        "cust": p["Customers_Benefited"]
    })

# 3. Load Constraints Data
constraint_file = os.path.join(DATA_DIR, "constraint_register.json")
with open(constraint_file, "r") as f:
    constraint_data = json.load(f)

print("Formatting JS DATA object...")

# Build updated DATA JS string
new_data_js = f"""var DATA = {{
  substations: [{{ id:'SUB-01', name:'Garki 33/11kV Substation', rating_mva:20 }}],
  feeders: [
    {{ id:'F-01', name:'Garki Feeder 1', voltage_kv:11, length_km:12.4 }},
    {{ id:'F-02', name:'Wuse Feeder 2',  voltage_kv:11, length_km:9.8  }}
  ],
  transformers: [], // Populated dynamically by script
  projects: {json.dumps(formatted_projects, indent=4)},
  minigrid: {{ pv_kw:{pv_curve[14]}, soc:{soc_curve[14]}, batt_kw:-45, grid_import:0, grid_export:{grid_curve[15]}, demand:{load_curve[14]}, mode:'Islanded', freq:50.02, volt_pu:1.01 }},
  daily: {json.dumps(pv_curve)}
}};\n"""

print("\nInjecting updated DATA object into index.html...")

with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
    html_content = f.read()

# Find and replace var DATA block inside index.html
start_marker = "var DATA = {"
end_marker = "};"

start_idx = html_content.find(start_marker)
if start_idx != -1:
    end_idx = html_content.find(end_marker, start_idx) + 2
    updated_html = html_content[:start_idx] + new_data_js + html_content[end_idx:]

    with open(INDEX_HTML_PATH, "w", encoding="utf-8") as f:
        f.write(updated_html)
    print("[+] index.html successfully updated with real Python pipeline data!")
else:
    print("[-] Could not locate 'var DATA = {' block in index.html.")