import os
import json
from config.constants import DATA_PROCESSED_DIR, CARBON_CFG

def run_build_carbon_metrics():
    print("=== BUILDING CARBON & DECARBONIZATION METRICS ===")
    out_dir = os.path.join(DATA_PROCESSED_DIR, "carbon")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "carbon_metrics.json")

    baseline_grid = CARBON_CFG.get("baseline_grid_intensity_gco2_kwh", 485)
    diesel_gen = CARBON_CFG.get("diesel_gen_intensity_gco2_kwh", 780)
    pv_clean = CARBON_CFG.get("pv_intensity_gco2_kwh", 42)

    # Calculate offset metrics
    daily_pv_kwh = 2460.0  # Approx daily generation
    co2_saved_kg_per_day = round((daily_pv_kwh * (diesel_gen - pv_clean)) / 1000, 2)
    annual_co2_saved_tons = round((co2_saved_kg_per_day * 365) / 1000, 1)

    carbon_data = {
        "baseline_grid_intensity_gco2_kwh": baseline_grid,
        "diesel_displacement_intensity_gco2_kwh": diesel_gen,
        "solar_pv_intensity_gco2_kwh": pv_clean,
        "daily_solar_generation_kwh": daily_pv_kwh,
        "daily_co2_offset_kg": co2_saved_kg_per_day,
        "annual_co2_offset_tons": annual_co2_saved_tons,
        "target_2030_grid_intensity_gco2_kwh": 250
    }

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(carbon_data, f, indent=4)
    print(f"   [+] Processed carbon & ESG metrics -> {out_file}")

if __name__ == "__main__":
    run_build_carbon_metrics()
