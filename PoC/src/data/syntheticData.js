// ----------------------------------------------------
// GridBridge PoC - Synthetic Data Engine
// ----------------------------------------------------

export const SUBSTATIONS = [
  { id: 'SUB-01', name: 'Garki 33/11kV', rating_mva: 20, status: 'healthy' }
];

export const MV_FEEDERS = [
  { id: 'F-01', name: 'Garki Feeder 1', substation: 'SUB-01', voltage_kv: 11, length_km: 12.4, status: 'warning' },
  { id: 'F-02', name: 'Wuse Feeder 2',  substation: 'SUB-01', voltage_kv: 11, length_km: 9.8, status: 'healthy' }
];

export const TRANSFORMERS = [
  { id: 'TX-01', feeder: 'F-01', rating_kva: 500, loading_pct: 65, voltage_pu: 0.98, customers: 68, status: 'healthy', health_score: 92, losses_kw: 4.2, installation_year: 2015 },
  { id: 'TX-02', feeder: 'F-01', rating_kva: 315, loading_pct: 88, voltage_pu: 0.94, customers: 112, status: 'warning', health_score: 72, losses_kw: 12.4, installation_year: 2009 },
  { id: 'TX-03', feeder: 'F-01', rating_kva: 500, loading_pct: 105, voltage_pu: 0.91, customers: 145, status: 'critical', health_score: 45, losses_kw: 21.0, installation_year: 2004 },
  { id: 'TX-04', feeder: 'F-01', rating_kva: 200, loading_pct: 45, voltage_pu: 0.99, customers: 30, status: 'healthy', health_score: 95, losses_kw: 1.1, installation_year: 2018 },
  { id: 'TX-05', feeder: 'F-01', rating_kva: 500, loading_pct: 75, voltage_pu: 0.96, customers: 85, status: 'healthy', health_score: 85, losses_kw: 6.5, installation_year: 2012 },
  { id: 'TX-06', feeder: 'F-01', rating_kva: 315, loading_pct: 92, voltage_pu: 0.93, customers: 120, status: 'warning', health_score: 68, losses_kw: 14.2, installation_year: 2007 },
  { id: 'TX-07', feeder: 'F-01', rating_kva: 500, loading_pct: 112, voltage_pu: 0.89, customers: 160, status: 'critical', health_score: 38, losses_kw: 25.5, installation_year: 2002 },
  { id: 'TX-08', feeder: 'F-01', rating_kva: 200, loading_pct: 30, voltage_pu: 1.0, customers: 25, status: 'healthy', health_score: 98, losses_kw: 0.5, installation_year: 2020 },
  
  { id: 'TX-09', feeder: 'F-02', rating_kva: 500, loading_pct: 70, voltage_pu: 0.97, customers: 75, status: 'healthy', health_score: 90, losses_kw: 5.0, installation_year: 2016 },
  { id: 'TX-10', feeder: 'F-02', rating_kva: 315, loading_pct: 82, voltage_pu: 0.95, customers: 95, status: 'warning', health_score: 75, losses_kw: 10.5, installation_year: 2011 },
  { id: 'TX-11', feeder: 'F-02', rating_kva: 500, loading_pct: 60, voltage_pu: 0.98, customers: 60, status: 'healthy', health_score: 93, losses_kw: 3.8, installation_year: 2017 },
  { id: 'TX-12', feeder: 'F-02', rating_kva: 200, loading_pct: 55, voltage_pu: 0.99, customers: 40, status: 'healthy', health_score: 94, losses_kw: 1.8, installation_year: 2019 },
  { id: 'TX-13', feeder: 'F-02', rating_kva: 500, loading_pct: 95, voltage_pu: 0.92, customers: 130, status: 'warning', health_score: 65, losses_kw: 16.0, installation_year: 2008 },
  { id: 'TX-14', feeder: 'F-02', rating_kva: 315, loading_pct: 40, voltage_pu: 1.0, customers: 35, status: 'healthy', health_score: 96, losses_kw: 1.2, installation_year: 2021 },
  { id: 'TX-15', feeder: 'F-02', rating_kva: 500, loading_pct: 85, voltage_pu: 0.94, customers: 105, status: 'warning', health_score: 70, losses_kw: 11.8, installation_year: 2010 }
];

export const PROJECTS = [
  { id: 'INV-01', constraint: 'TX-03 overload', intervention: 'Upgrade to 800kVA', capex_usd: 45000, priority_score: 95, loading_reduction_pct: 35, loss_reduction_kw: 12.0, customers_benefited: 145, status: 'included' },
  { id: 'INV-02', constraint: 'TX-07 overload', intervention: 'Upgrade to 800kVA', capex_usd: 45000, priority_score: 98, loading_reduction_pct: 42, loss_reduction_kw: 15.5, customers_benefited: 160, status: 'included' },
  { id: 'INV-03', constraint: 'F-01 voltage drop', intervention: 'Install 2MVAr Capacitor', capex_usd: 35000, priority_score: 82, loading_reduction_pct: 5, loss_reduction_kw: 8.4, customers_benefited: 450, status: 'included' },
  { id: 'INV-04', constraint: 'TX-02 overload', intervention: 'Split LV feeder to TX-04', capex_usd: 15000, priority_score: 78, loading_reduction_pct: 20, loss_reduction_kw: 4.2, customers_benefited: 45, status: 'included' },
  { id: 'INV-05', constraint: 'TX-06 overload', intervention: 'Upgrade to 500kVA', capex_usd: 28000, priority_score: 85, loading_reduction_pct: 25, loss_reduction_kw: 6.8, customers_benefited: 120, status: 'included' },
  { id: 'INV-06', constraint: 'TX-13 overload', intervention: 'Upgrade to 800kVA', capex_usd: 45000, priority_score: 88, loading_reduction_pct: 28, loss_reduction_kw: 9.0, customers_benefited: 130, status: 'included' },
  { id: 'INV-07', constraint: 'F-01 conductor limit', intervention: 'Reconductor 2km AAC to ACSR', capex_usd: 60000, priority_score: 75, loading_reduction_pct: 15, loss_reduction_kw: 14.5, customers_benefited: 500, status: 'included' },
  { id: 'INV-08', constraint: 'TX-15 warning', intervention: 'Load balancing phase A-B-C', capex_usd: 5000, priority_score: 65, loading_reduction_pct: 10, loss_reduction_kw: 2.5, customers_benefited: 105, status: 'included' }
];

export const MINIGRID = {
  pv_kw: 185, 
  battery_soc_pct: 68, 
  battery_kw: -45,
  grid_import_kw: 0, 
  grid_export_kw: 22, 
  local_demand_kw: 162,
  mode: 'islanded', 
  frequency_hz: 50.02, 
  voltage_pu: 1.01
};

export const DATA_QUALITY = {
  score: 91,
  completeness: 94,
  missing_assets: 12,
  topology_errors: 4,
  duplicate_assets: 7,
  unknown_connections: 3
};

// Generate some hourly load profiles (24 hours) for the whole network
export const LOAD_PROFILES = {
  daily: Array.from({length: 24}, (_, i) => {
    // Base load curve shape
    const base = 10 + 5 * Math.sin((i - 6) * Math.PI / 12) + 8 * Math.exp(-0.1 * Math.pow(i - 20, 2));
    return parseFloat(base.toFixed(2));
  })
};
