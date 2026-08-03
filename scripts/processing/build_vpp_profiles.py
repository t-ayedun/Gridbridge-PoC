import os
import json
import requests
import pandas as pd
from config.constants import DATA_PROCESSED_DIR, WEATHER_CFG

def run_build_vpp_profiles():
    print("=== BUILDING VPP & FEEDED DIURNAL DEMAND PROFILES ===")
    out_dir = os.path.join(DATA_PROCESSED_DIR, "vpp")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "vpp_daily_profile.json")

    lat = WEATHER_CFG.get("latitude", 9.07)
    lon = WEATHER_CFG.get("longitude", 7.39)

    # 1. Fetch Open-Meteo Shortwave Radiation (Solar GHI kW)
    pv_kw = []
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=shortwave_radiation&timezone=Africa/Lagos&forecast_days=1"
        res = requests.get(url, timeout=10)
        wdata = res.json()
        raw_rad = wdata['hourly']['shortwave_radiation']
        pv_kw = [round((rad / 1000) * 850 * 0.8, 1) for rad in raw_rad]
        print(f"   [+] Fetched live solar irradiance from Open-Meteo for Abuja ({lat}°N, {lon}°E)")
    except Exception as e:
        print(f"   [-] Open-Meteo API unreachable ({e}). Using solar irradiance fallback model.")
        pv_kw = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.4, 59.8, 51.7, 223.0, 148.9, 167.3, 491.0, 246.8, 479.4, 365.8, 310.1, 155.0, 24.5, 0.0, 0.0, 0.0, 0.0]

    # 2. Engineering-grade Class-Based Diurnal Load Profile (Residential + Commercial Mix)
    # Reflects Nigerian DisCo urban/suburban feeder load shape (Morning peak ~08:00, Evening peak ~20:00)
    class_based_feeder_load = [
        110.0, 102.0,  95.0,  90.0,  92.0, 115.0,  # 00:00 - 05:00 Night baseline
        155.0, 210.0, 245.0, 230.0, 215.0, 205.0,  # 06:00 - 11:00 Morning peak & Commercial load
        195.0, 190.0, 195.0, 205.0, 225.0, 260.0,  # 12:00 - 17:00 Afternoon transition
        310.0, 345.0, 320.0, 265.0, 190.0, 140.0   # 18:00 - 23:00 Evening lighting & cooling peak
    ]

    # 3. Physics-based Battery Dispatch Model (1,200 kWh, 80% DOD, Max Charge/Discharge 300 kW)
    battery_capacity_kwh = 1200.0
    min_soc_kwh = battery_capacity_kwh * 0.20  # 20% reserve
    max_soc_kwh = battery_capacity_kwh * 0.95
    current_soc_kwh = battery_capacity_kwh * 0.40  # Initial 40% SOC

    soc_percentages, grid_exchange, battery_dispatch = [], [], []

    for hour in range(24):
        net_power = pv_kw[hour] - class_based_feeder_load[hour]
        if net_power > 0:
            # Excess solar -> charge battery
            charge_possible = min(net_power, max_soc_kwh - current_soc_kwh, 300.0)
            current_soc_kwh += charge_possible
            battery_dispatch.append(round(-charge_possible, 1))
            grid_export = net_power - charge_possible
        else:
            # Deficit -> discharge battery
            discharge_needed = abs(net_power)
            available_discharge = max(0.0, current_soc_kwh - min_soc_kwh)
            discharge_possible = min(discharge_needed, available_discharge, 300.0)
            current_soc_kwh -= discharge_possible
            battery_dispatch.append(round(discharge_possible, 1))
            grid_export = -(discharge_needed - discharge_possible)

        soc_percentages.append(round((current_soc_kwh / battery_capacity_kwh) * 100, 1))
        grid_exchange.append(round(grid_export, 1))

    df_vpp = pd.DataFrame({
        'Time': [f"{str(h).zfill(2)}:00" for h in range(24)],
        'PV_Generation_kW': pv_kw,
        'Local_Demand_kW': class_based_feeder_load,
        'Battery_Dispatch_kW': battery_dispatch,
        'Battery_SOC_%': soc_percentages,
        'Grid_Exchange_kW': grid_exchange
    })

    df_vpp.to_json(out_file, orient="records", indent=4)
    print(f"   [+] Processed 24-hr class-based feeder & VPP profile -> {out_file}")

if __name__ == "__main__":
    run_build_vpp_profiles()
