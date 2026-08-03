import sys
import os

# Ensure project root is in python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from scripts.ingestion import import_kedco, import_osm, import_se4all, import_dre
from scripts.processing import build_constraint_register, build_investment_register, build_vpp_profiles, build_carbon_metrics
from scripts.export import inject_dashboard_data

def run_full_pipeline():
    print("==================================================")
    print("   GRIDBRIDGE PoC - MASTER DATA PIPELINE         ")
    print("==================================================\n")

    print("[STAGE 1] INGESTION")
    import_kedco.run_kedco_ingestion()
    import_osm.run_osm_ingestion()
    import_se4all.run_se4all_ingestion()
    import_dre.run_dre_ingestion()

    print("\n[STAGE 2] PROCESSING & SIMULATION")
    build_constraint_register.run_build_constraint_register()
    build_investment_register.run_build_investment_register()
    build_vpp_profiles.run_build_vpp_profiles()
    build_carbon_metrics.run_build_carbon_metrics()

    print("\n[STAGE 3] EXPORT & DASHBOARD SYNC")
    inject_dashboard_data.run_dashboard_data_injection()

    print("\n==================================================")
    print("   PIPELINE COMPLETE: ALL DATA READY & SYNCED!    ")
    print("==================================================")

if __name__ == "__main__":
    run_full_pipeline()