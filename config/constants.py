import os
import json

CONFIG_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(CONFIG_DIR)
SETTINGS_PATH = os.path.join(CONFIG_DIR, "settings.json")

with open(SETTINGS_PATH, "r", encoding="utf-8") as f:
    SETTINGS = json.load(f)

# Paths
DATA_RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
DATA_PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
INDEX_HTML_PATH = os.path.join(BASE_DIR, "index.html")

# Constants
FX_RATE_NGN_PER_USD = SETTINGS.get("fx_rate_ngn_per_usd", 1370)
UNIT_COSTS_USD = SETTINGS.get("unit_costs_usd", {})
WEATHER_CFG = SETTINGS.get("weather", {})
OPENDSS_CFG = SETTINGS.get("opendss", {})
CARBON_CFG = SETTINGS.get("carbon", {})
