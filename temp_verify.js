
var tip = document.getElementById('tip');
  function showTip(html, x, y){
    if (!tip) return;
    tip.innerHTML = html; tip.style.display = 'block';
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let left = x + 14, top = y - h - 10;
    if (left + w > innerWidth - 8) left = x - w - 14;
    if (top < 8) top = y + 16;
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  function hideTip(){ if(tip) tip.style.display = 'none'; }

// =============================================
// DATA ENGINE
// =============================================
var DATA = {
  substations: [{ id:'SUB-01', name:'Garki 33/11kV Substation', rating_mva:20 }],
  feeders: [
    { id:'F-01', name:'Garki Feeder 1', voltage_kv:11, length_km:12.4 },
    { id:'F-02', name:'Wuse Feeder 2',  voltage_kv:11, length_km:9.8  }
  ],
  transformers: [
    { id:'TX-01', feeder:'F-01', rating_kva:500, loading:65,  volt:0.98, cust:68,  status:'healthy',  health:92, losses:4.2,  year:2015 },
    { id:'TX-02', feeder:'F-01', rating_kva:315, loading:88,  volt:0.94, cust:112, status:'warning',  health:72, losses:12.4, year:2009 },
    { id:'TX-03', feeder:'F-01', rating_kva:500, loading:105, volt:0.91, cust:145, status:'critical', health:45, losses:21.0, year:2004 },
    { id:'TX-04', feeder:'F-01', rating_kva:200, loading:45,  volt:0.99, cust:30,  status:'healthy',  health:95, losses:1.1,  year:2018 },
    { id:'TX-05', feeder:'F-01', rating_kva:500, loading:75,  volt:0.96, cust:85,  status:'healthy',  health:85, losses:6.5,  year:2012 },
    { id:'TX-06', feeder:'F-01', rating_kva:315, loading:92,  volt:0.93, cust:120, status:'warning',  health:68, losses:14.2, year:2007 },
    { id:'TX-07', feeder:'F-01', rating_kva:500, loading:112, volt:0.89, cust:160, status:'critical', health:38, losses:25.5, year:2002 },
    { id:'TX-08', feeder:'F-01', rating_kva:200, loading:30,  volt:1.00, cust:25,  status:'healthy',  health:98, losses:0.5,  year:2020 },
    { id:'TX-09', feeder:'F-02', rating_kva:500, loading:70,  volt:0.97, cust:75,  status:'healthy',  health:90, losses:5.0,  year:2016 },
    { id:'TX-10', feeder:'F-02', rating_kva:315, loading:82,  volt:0.95, cust:95,  status:'warning',  health:75, losses:10.5, year:2011 },
    { id:'TX-11', feeder:'F-02', rating_kva:500, loading:60,  volt:0.98, cust:60,  status:'healthy',  health:93, losses:3.8,  year:2017 },
    { id:'TX-12', feeder:'F-02', rating_kva:200, loading:55,  volt:0.99, cust:40,  status:'healthy',  health:94, losses:1.8,  year:2019 },
    { id:'TX-13', feeder:'F-02', rating_kva:500, loading:95,  volt:0.92, cust:130, status:'warning',  health:65, losses:16.0, year:2008 },
    { id:'TX-14', feeder:'F-02', rating_kva:315, loading:40,  volt:1.00, cust:35,  status:'healthy',  health:96, losses:1.2,  year:2021 },
    { id:'TX-15', feeder:'F-02', rating_kva:500, loading:85,  volt:0.94, cust:105, status:'warning',  health:70, losses:11.8, year:2010 }
  ],
  projects: [
    { id:'INV-01', constraint:'TX-07 overloaded', action:'Upgrade to 800kVA transformer', capex:45000, opex:1800, priority:98, loadRed:42, lossRed:15.5, cust:160, rationale:'Karu market spur load growth exceeds 500kVA rating (112% peak)' },
    { id:'INV-02', constraint:'TX-03 overloaded', action:'Upgrade to 800kVA transformer', capex:45000, opex:1800, priority:95, loadRed:35, lossRed:12.0, cust:145, rationale:'2004 asset age + residential densification causing severe thermal degradation' },
    { id:'INV-03', constraint:'TX-13 warning',    action:'Upgrade to 800kVA transformer', capex:45000, opex:1800, priority:88, loadRed:28, lossRed:9.0,  cust:130, rationale:'New commercial connections pushing transformer to 95% threshold' },
    { id:'INV-04', constraint:'TX-06 overloaded', action:'Upgrade to 500kVA transformer', capex:28000, opex:1100, priority:85, loadRed:25, lossRed:6.8,  cust:120, rationale:'Residential cluster expansion requiring 315kVA to 500kVA uprating' },
    { id:'INV-05', constraint:'F-01 voltage drop',action:'Install 2MVAr capacitor bank', capex:35000, opex:1400, priority:82, loadRed:5,  lossRed:8.4,  cust:450, rationale:'Long feeder impedance drop causing 0.89 p.u. voltage at midpoint' },
    { id:'INV-06', constraint:'TX-02 overloaded', action:'Split LV feeder to TX-04',      capex:15000, opex:600,  priority:78, loadRed:20, lossRed:4.2,  cust:45,  rationale:'Phase A unbalanced load causing 88% loading; LV split redistributes demand' },
    { id:'INV-07', constraint:'F-01 conductor',   action:'Reconductor 2km AAC→ACSR',      capex:60000, opex:2400, priority:75, loadRed:15, lossRed:14.5, cust:500, rationale:'High feeder line impedance causes 14.5kW technical losses along backbone' },
    { id:'INV-08', constraint:'TX-15 imbalance',  action:'Phase balancing A-B-C',         capex:5000,  opex:200,  priority:65, loadRed:10, lossRed:2.5,  cust:105, rationale:'Neutral current surge from unmanaged single-phase customer distribution' },
    { id:'INV-09', constraint:'TX-10 warning',    action:'Install 150kVAr Cap Bank',      capex:12000, opex:480,  priority:70, loadRed:8,  lossRed:3.2,  cust:95,  rationale:'Inductive load profiling indicates low power factor (0.84 lagging) on F-02' },
    { id:'INV-10', constraint:'TX-12 high load',  action:'Upgrade to 315kVA transformer', capex:22000, opex:880,  priority:74, loadRed:18, lossRed:5.0,  cust:40,  rationale:'Small residential unit showing load profiling growth of 12% annually' },
    { id:'INV-11', constraint:'TX-05 low volt',   action:'Tap changer optimization',      capex:4000,  opex:160,  priority:68, loadRed:2,  lossRed:1.1,  cust:85,  rationale:'Voltage drop compensation by adjusting off-circuit tap positions manually' },
    { id:'INV-12', constraint:'TX-09 warning',    action:'Replace LV lateral fuses',      capex:3000,  opex:120,  priority:62, loadRed:4,  lossRed:0.8,  cust:75,  rationale:'Corroded dropouts causing phase imbalances and sporadic thermal warnings' }
  ],
  minigrid: { pv_kw:185, soc:68, batt_kw:-45, grid_import:0, grid_export:22, demand:162, mode:'Islanded', freq:50.02, volt_pu:1.01 },
  // 24-hr daily load profile (kW aggregate)
  daily: [8.1,7.2,6.8,6.5,6.8,7.8,9.6,12.4,14.8,15.2,15.6,15.9,15.3,14.8,14.2,14.0,14.6,16.2,17.8,17.1,15.4,13.2,11.0,9.2]
};

var FX_NGN_PER_USD = 1370;
var PLANNING_FEEDER = 'F-01';
var DER_FEEDER = 'F-02';

function usdToNaira(usd) {
  return Math.round((usd * FX_NGN_PER_USD) / 100000) * 100000;
}

function formatNairaFromUsd(usd) {
  var ngn = usdToNaira(usd);
  if (ngn >= 1000000000) return 'NGN ' + (ngn / 1000000000).toFixed(1) + 'bn';
  if (ngn >= 1000000) return 'NGN ' + (ngn / 1000000).toFixed(1) + 'm';
  return 'NGN ' + ngn.toLocaleString('en-NG');
}

function riskScore(tx) {
  var loadRisk = Math.max(0, tx.loading - 80) * 2.2;
  var voltRisk = Math.max(0, 0.95 - tx.volt) * 420;
  var ageRisk = Math.max(0, 2026 - tx.year - 12) * 1.2;
  var healthRisk = Math.max(0, 75 - (tx.health || 100)) * 1.8;
  return loadRisk + voltRisk + ageRisk + healthRisk + tx.losses * 0.7;
}

function deriveTransformerStatus(tx) {
  if (tx.loading > 100 || tx.volt < 0.92 || tx.health < 50) return 'critical';
  if (tx.loading >= 88 || tx.volt < 0.95 || tx.health < 70) return 'warning';
  return 'healthy';
}

function getPlanningTransformers() {
  return DATA.transformers.filter(function(t) { return t.feeder === PLANNING_FEEDER; });
}

function getCriticalTwinTransformers(limit) {
  return getPlanningTransformers()
    .filter(function(t) { return t.status !== 'healthy'; })
    .slice()
    .sort(function(a, b) { return riskScore(b) - riskScore(a); })
    .slice(0, limit || 15)
    .sort(function(a, b) { return parseInt(a.id.slice(3), 10) - parseInt(b.id.slice(3), 10); });
}

function getConstraintRegister() {
  var txConstraints = getPlanningTransformers()
    .filter(function(t) { return t.loading >= 88 || t.volt < 0.95; })
    .map(function(t) {
      var overloaded = t.loading > 100;
      var lowVoltage = t.volt < 0.95;
      return {
        sev: overloaded || t.volt < 0.92 ? 'critical' : 'warning',
        asset: t.id,
        problem: overloaded ? 'Loading at ' + t.loading + '% of rating' : (lowVoltage ? 'Voltage at ' + t.volt.toFixed(2) + ' p.u.' : 'Loading at ' + t.loading + '% - near limit'),
        cause: t.customers + ' connected consumers on ' + (t.segment || 'LV spur') + '; asset installed ' + t.year,
        action: overloaded ? 'Upgrade transformer or split LV load' : (lowVoltage ? 'Capacitor support or LV conductor uprating' : 'Phase balancing and demand watchlist'),
        priority: Math.round(Math.min(99, 55 + riskScore(t)))
      };
    })
    .sort(function(a, b) { return b.priority - a.priority; });

  txConstraints.push({
    sev: 'warning',
    asset: PLANNING_FEEDER,
    problem: 'Mid-feeder voltage drop on the market spur',
    cause: 'Long radial section plus evening commercial demand',
    action: 'Install 2MVAr capacitor bank at validated midpoint',
    priority: 82
  });
  return txConstraints.sort(function(a, b) { return b.priority - a.priority; });
}

(function injectOperationalDataset() {
  var base = DATA.transformers.map(function(t) {
    return Object.assign({}, t, {
      feeder: PLANNING_FEEDER,
      customers: t.cust,
      segment: t.id === 'TX-07' ? 'Karu market spur' : (t.id === 'TX-03' ? 'Old Garki residential spur' : 'Garki radial section')
    });
  });
  var ratings = [200, 315, 500, 750];
  var segments = ['Old Garki residential', 'Karu market', 'Area 11 commercial', 'Kado extension', 'Apo road spur', 'Feeder tail'];
  for (var i = base.length + 1; i <= 86; i++) {
    var rating = ratings[(i * 7) % ratings.length];
    var wave = Math.sin(i * 1.71) * 14 + Math.cos(i * 0.43) * 8;
    var loading = Math.round(62 + wave + (i % 9 === 0 ? 28 : 0) + (i % 17 === 0 ? 18 : 0));
    loading = Math.max(32, Math.min(124, loading));
    var volt = +(1.01 - Math.max(0, loading - 65) * 0.0018 - (i % 13 === 0 ? 0.025 : 0)).toFixed(2);
    var customers = Math.round(rating * (0.16 + ((i * 11) % 15) / 100) + (i % 6) * 9);
    var year = 2001 + ((i * 5) % 23);
    var status = loading > 100 || volt < 0.92 ? 'critical' : (loading >= 88 || volt < 0.95 ? 'warning' : 'healthy');
    base.push({
      id: 'TX-' + String(i).padStart(2, '0'),
      feeder: PLANNING_FEEDER,
      rating_kva: rating,
      loading: loading,
      volt: volt,
      cust: customers,
      customers: customers,
      status: status,
      health: Math.max(28, Math.round(104 - loading * 0.45 - Math.max(0, 2016 - year) * 1.5)),
      losses: +(rating * loading / 1000 * 0.038).toFixed(1),
      year: year,
      segment: segments[i % segments.length]
    });
  }
  DATA.transformers = base;
  DATA.feeders[0].role = 'Planning feeder - 86 MV/LV transformers';
  DATA.feeders[1].role = 'Mini-grid and DER integration intertie';
})();

// =============================================
// ROUTER
// =============================================
function navigate(viewId, title) {
  document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });
  var el = document.getElementById(viewId);
  if (el) { el.classList.add('active'); }
  document.getElementById('page-title').textContent = title;
  
  // Mark nav item
  document.querySelectorAll('.nav-item').forEach(function(n){
    if (n.getAttribute('data-view') === viewId) n.classList.add('active');
  });
  
  // Trigger ECharts resize explicitly
  setTimeout(function(){
    if (viewId === 'view-exec') {
      if (window.execInvestChart) window.execInvestChart.resize();
      if (window.execLoadChart) window.execLoadChart.resize();
    } else if (viewId === 'view-load') {
      if (window.loadChart) window.loadChart.resize();
      if (window.heatmapChart) window.heatmapChart.resize();
    } else if (viewId === 'view-invest') {
      if (window.investCharts && window.investCharts.wf) window.investCharts.wf.resize();
      if (window.investCharts && window.investCharts.cu) window.investCharts.cu.resize();
    } else if (viewId === 'view-scenario') {
      if (window.scenarioChart) window.scenarioChart.resize();
    } else if (viewId === 'view-recommendations') {
      renderRecommendations();
    } else if (viewId === 'view-vpp') {
      if (window.vppFcChart) window.vppFcChart.resize();
      if (window.vppScChart) window.vppScChart.resize();
      if (window.vppSkChart) window.vppSkChart.resize();
    } else if (viewId === 'view-data') {
      if (window.dqChart) window.dqChart.resize();
    }
    window.dispatchEvent(new Event('resize'));
  }, 100);
}

document.querySelectorAll('.nav-item').forEach(function(item){
  item.addEventListener('click', function(){
    navigate(item.getAttribute('data-view'), item.getAttribute('data-title'));
  });
});

// Sidebar toggle
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.body.classList.toggle('collapsed');
}

// Real-time wall clock
function tickClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2,'0');
  var m = String(now.getMinutes()).padStart(2,'0');
  var s = String(now.getSeconds()).padStart(2,'0');
  document.getElementById('clock').textContent = h+':'+m+':'+s;
}
setInterval(tickClock, 1000);
tickClock();

// =============================================
// SIMULATION CLOCK — starts at 08:00, advances
// =============================================
var SIM_START_H = 8; // 08:00
var SIM_SPEED_SEC_PER_REAL_SEC = 2; // 2 sim-minutes per real second
var simMinutes = SIM_START_H * 60; // total sim minutes from midnight
var simTelemetryHistory = [];

function getSimHours() { return (simMinutes / 60) % 24; }
function getSimHH() { return String(Math.floor(getSimHours())).padStart(2,'0'); }
function getSimMM() { return String(Math.floor(simMinutes % 60)).padStart(2,'0'); }
function getSimTimeStr() { return getSimHH() + ':' + getSimMM(); }
function getSimTimeDecimal() { return getSimHours(); } // 0-24
function simTimeLabel(t) {
  var h = Math.floor(t) % 24;
  var m = Math.round((t - Math.floor(t)) * 60);
  if (m === 60) { h = (h + 1) % 24; m = 0; }
  return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
}
function getSimPvKw(t) {
  if (t < 6 || t > 18.5) return 0;
  var x = (t - 12.25) / 6.25;
  var pv = Math.max(0, 720 * Math.cos(x * Math.PI / 2));
  if (t >= 13 && t <= 14.5) pv *= 0.55;
  return Math.round(pv);
}
function getSimDemandKw(t) {
  var v = 190 + 60*Math.exp(-Math.pow((t-9)/2.4,2)) + 250*Math.exp(-Math.pow((t-19.7)/2.2,2));
  return Math.round(v);
}
function isSimIslanded(t) { return t >= 19 && t <= 20.5; }
function getSimBatteryKw(t) {
  var pv = getSimPvKw(t);
  var demand = getSimDemandKw(t);
  if (isSimIslanded(t)) return -(demand - pv);
  var surplus = pv - demand;
  if (surplus > 120) return Math.min(300, Math.round(surplus - 60));
  if (t >= 17.5 && t < 23) return -140;
  return 0;
}
function getSimSocPct(t) {
  var s = 38;
  for (var h = 0; h <= t; h += 0.5) {
    s += getSimBatteryKw(h) * 0.5 / 1200 * 100;
    s = Math.min(96, Math.max(30, s));
  }
  return Math.round(s);
}
function getSimSnapshot(t) {
  var pv = getSimPvKw(t);
  var demand = getSimDemandKw(t);
  var batt = getSimBatteryKw(t);
  var islanded = isSimIslanded(t);
  var pcc = islanded ? 0 : Math.round(pv - demand - batt);
  var freqBase = islanded ? 49.97 : 50.01;
  return {
    t: t,
    label: simTimeLabel(t),
    pv_kw: pv,
    demand: demand,
    batt_kw: batt,
    soc: getSimSocPct(t),
    pcc_kw: pcc,
    grid_import: Math.max(0, -pcc),
    grid_export: Math.max(0, pcc),
    mode: islanded ? 'Islanded' : 'Grid-tied',
    freq: +(freqBase + Math.sin(t * 3.1) * 0.025).toFixed(2),
    volt_pu: +(1.0 + Math.sin(t * 1.7) * 0.01 - (islanded ? 0.01 : 0)).toFixed(2)
  };
}
function buildHourlySeries(fn) {
  return Array.from({length: 24}, function(_, i) { return fn(i); });
}
function updateMiniGridKpis(snap) {
  DATA.minigrid.pv_kw = snap.pv_kw;
  DATA.minigrid.demand = snap.demand;
  DATA.minigrid.batt_kw = snap.batt_kw;
  DATA.minigrid.soc = snap.soc;
  DATA.minigrid.grid_import = snap.grid_import;
  DATA.minigrid.grid_export = snap.grid_export;
  DATA.minigrid.mode = snap.mode;
  DATA.minigrid.freq = snap.freq;
  DATA.minigrid.volt_pu = snap.volt_pu;

  var elMode = document.getElementById('mg-mode');
  var elFreq = document.getElementById('mg-freq');
  var elPV = document.getElementById('mg-pv');
  var elDem = document.getElementById('mg-demand');
  if (elMode) elMode.textContent = snap.mode;
  if (elFreq) elFreq.textContent = snap.freq + ' Hz';
  if (elPV) elPV.textContent = snap.pv_kw + ' kW';
  if (elDem) elDem.textContent = snap.demand + ' kW';

  var socEl = document.getElementById('socNow');
  var socLabelEl = document.getElementById('socNowLabel');
  var meterEl = document.getElementById('socMeter');
  if (socEl) socEl.textContent = snap.soc + '%';
  if (socLabelEl) socLabelEl.textContent = 'Now ' + snap.label;
  if (meterEl) meterEl.style.width = snap.soc + '%';

  var pvPeak = 718;
  var pvHeadroom = Math.max(0, pvPeak - snap.pv_kw);
  var batAvailableKwh = Math.max(0, Math.round(1200 * (snap.soc - 30) / 100));
  var totalDispatchKw = pvHeadroom + Math.max(0, -snap.batt_kw);
  var reserveMarginPct = Math.round((totalDispatchKw / Math.max(1, snap.demand)) * 100);
  var fpv = document.getElementById('flex-pv-headroom');
  var fps = document.getElementById('flex-pv-sub');
  var fbe = document.getElementById('flex-bat-energy');
  var ftd = document.getElementById('flex-total-dispatch');
  var frm = document.getElementById('flex-reserve-margin');
  var frs = document.getElementById('flex-reserve-sub');
  if (fpv) fpv.textContent = pvHeadroom + ' kW';
  if (fps) fps.textContent = pvPeak + ' kW peak - ' + snap.pv_kw + ' kW active';
  if (fbe) fbe.textContent = batAvailableKwh + ' kWh';
  if (ftd) ftd.textContent = totalDispatchKw + ' kW';
  if (frm) frm.textContent = reserveMarginPct + '%';
  if (frs) frs.textContent = 'Above ' + snap.demand + ' kW local demand';

  document.querySelectorAll('.mini-grid-flow').forEach(function(fl) {
    fl.style.stroke = snap.pcc_kw >= 0 ? '#0ca30c' : '#1565c0';
    fl.style.animationDirection = snap.pcc_kw >= 0 ? 'normal' : 'reverse';
  });
}

function advanceSimClock() {
  simMinutes = (simMinutes + SIM_SPEED_SEC_PER_REAL_SEC) % (24*60);
  var ts = getSimTimeStr();
  var el1 = document.getElementById('sim-clock-display');
  var el2 = document.getElementById('mg-sim-time');
  if (el1) el1.textContent = ts;
  if (el2) el2.textContent = ts;
  updateSimAwareCharts();
}
setInterval(advanceSimClock, 1000);

function updateSimAwareCharts() {
  var t = getSimTimeDecimal(); // 0-24
  var idx = Math.min(23, Math.max(0, Math.floor(t))); // 0-based hour index
  var snap = getSimSnapshot(t);
  updateMiniGridKpis(snap);
  simTelemetryHistory.push(snap);
  if (simTelemetryHistory.length > 240) simTelemetryHistory.shift();

  // ---- VPP Forecast chart: actual up to now, forecast beyond ----
  if (window.vppFcChart) {
    var actual24 = DATA.daily.map(function(v, i){ return +(v * (0.97 + Math.sin((i + 1) * 0.7) * 0.035)).toFixed(2); });
    var forecast24 = DATA.daily.map(function(v, i){ return +(v * (1.02 + Math.cos((i + 2) * 0.45) * 0.055)).toFixed(2); });
    var actualSeries = actual24.map(function(v, i){ return i <= idx ? v : null; });
    var forecastSeries = forecast24.map(function(v, i){ return i >= idx ? v : null; });
    var upperBand = forecast24.map(function(v, i){ return i >= idx ? +(v*1.10).toFixed(2) : null; });
    var lowerBand = forecast24.map(function(v, i){ return i >= idx ? +(v*0.90).toFixed(2) : null; });

    window.vppFcChart.setOption({
      series: [
        { name:'Uncertainty Upper', data: upperBand },
        { name:'Uncertainty Band', data: upperBand.map(function(v,i){ return v !== null ? upperBand[i]-lowerBand[i] : null; }) },
        { name:'Forecast', data: forecastSeries },
        { name:'Actual', data: actualSeries,
          markLine: { silent:true, symbol:'none', label:{formatter:'Now ' + snap.label}, lineStyle:{color:'#e65100',type:'dashed',width:2}, data:[{xAxis: idx + ':00'}] } }
      ]
    });
  }

  if (window.vppScChart) {
    window.vppScChart.setOption({
      series: [
        { name:'PV', data: buildHourlySeries(getSimPvKw) },
        { name:'Battery Discharge', data: buildHourlySeries(function(h){ return Math.max(0, -getSimBatteryKw(h)); }) },
        { name:'Grid Import', data: buildHourlySeries(function(h){ return getSimSnapshot(h).grid_import; }) },
        { name:'Demand', data: buildHourlySeries(getSimDemandKw),
          markLine: { silent:true, symbol:'none', label:{formatter:'Now ' + snap.label}, lineStyle:{color:'#e65100',type:'dashed',width:2}, data:[{xAxis: idx + ':00'}] } }
      ]
    });
  }
  if (window.vppSkChart) {
    var charge = Math.max(0, snap.batt_kw);
    var discharge = Math.max(0, -snap.batt_kw);
    window.vppSkChart.setOption({
      series: [{ links: [
        { source: 'PV Array', target: 'Aggregator VPP', value: Math.max(1, snap.pv_kw) },
        { source: 'Grid', target: 'Aggregator VPP', value: Math.max(1, snap.grid_import) },
        { source: 'Battery Discharge', target: 'Aggregator VPP', value: Math.max(1, discharge) },
        { source: 'Aggregator VPP', target: 'Local Load', value: Math.max(1, snap.demand) },
        { source: 'Aggregator VPP', target: 'Battery Charging', value: Math.max(1, charge) },
        { source: 'Aggregator VPP', target: 'Grid Export', value: Math.max(1, snap.grid_export) }
      ] }]
    });
  }
  if (window.loadChart) {
    renderProfile(window.currentLoadProfileMode || 'daily');
  }
  if (window.miniGridCharts && window.miniGridCharts.updateMarker) {
    window.miniGridCharts.updateMarker(snap);
  }
}
updateSimAwareCharts();

// Animated counter
function animateCounter(el, target, suffix, duration) {
  suffix = suffix || '';
  duration = duration || 800;
  var start = 0, startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    var prog = Math.min((ts - startTime) / duration, 1);
    var ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// =============================================
// STATUS HELPERS
// =============================================
function statusColor(status) {
  return { healthy:'#0ca30c', warning:'#e65100', critical:'#b91c1c' }[status] || '#90a4ae';
}
function statusBadge(status) {
  var map = { healthy:'healthy', warning:'warning', critical:'critical' };
  var lbl = { healthy:'Healthy', warning:'Warning', critical:'Critical' };
  return '<span class="badge '+(map[status]||'neutral')+'">'+(lbl[status]||status)+'</span>';
}

// =============================================
// 1. EXECUTIVE SUMMARY
// =============================================
(function initExec() {
  // Animate KPIs on load
  setTimeout(function(){
    var planningTx = getPlanningTransformers();
    var constraints = getConstraintRegister();
    var critical = planningTx.filter(function(t) { return t.status === 'critical'; });
    var normal = planningTx.length - critical.length;
    var totalCapex = DATA.projects.reduce(function(sum, p) { return sum + p.capex; }, 0);
    var customers = planningTx.reduce(function(sum, t) { return sum + t.customers; }, 0);
    var highest = planningTx.slice().sort(function(a, b) { return b.loading - a.loading; })[0];
    var h = document.getElementById('exec-health');
    if (h) animateCounter(h, Math.round(normal / planningTx.length * 100), '%');
    var hs = document.getElementById('exec-health-sub');
    if (hs) hs.textContent = normal + ' of ' + planningTx.length + ' transformers operating normally';
    var cc = document.getElementById('exec-critical');
    if (cc) cc.textContent = critical.length;
    var cs = document.getElementById('exec-critical-sub');
    if (cs) cs.textContent = critical.length + ' require urgent intervention';
    var inv = document.getElementById('exec-invest-total');
    if (inv) inv.textContent = formatNairaFromUsd(totalCapex);
    var hl = document.getElementById('exec-highest-loading');
    if (hl) hl.textContent = highest.loading + '%';
    var ha = document.getElementById('exec-highest-asset');
    if (ha) ha.textContent = highest.id + ' - Garki Feeder 1';
    var cust = document.getElementById('exec-customers');
    if (cust) cust.textContent = customers.toLocaleString('en-NG');
    var assetSub = document.getElementById('exec-assets-sub');
    if (assetSub) assetSub.textContent = 'Across ' + planningTx.length + ' F-01 MV/LV transformers';
  }, 300);

  // Priority Investment chart
  setTimeout(function(){
    var c1 = document.getElementById('chart-exec-invest');
    var c2 = document.getElementById('chart-exec-loading');
    if (!c1 || !c2 || typeof echarts === 'undefined') return;

    window.execInvestChart = echarts.init(c1);
    var sorted = DATA.projects.slice().sort(function(a,b){ return b.priority - a.priority; });
    window.execInvestChart.setOption({
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'} },
      grid:{ left:'2%', right:'6%', bottom:'4%', top:'8%', containLabel:true },
      xAxis:{ type:'value', axisLabel:{ formatter:function(v){ return formatNairaFromUsd(v); } } },
      yAxis:{ type:'category', data:sorted.map(function(p){ return p.id; }), axisLabel:{ fontFamily:'IBM Plex Mono', fontSize:11 } },
      series:[{
        type:'bar', barMaxWidth:18,
        data:sorted.map(function(p){ return { value:p.capex, itemStyle:{ color: p.priority>=90?'#b91c1c':p.priority>=80?'#e65100':'#1565c0' } }; }),
        label:{ show:true, position:'right', formatter:function(p){ return formatNairaFromUsd(p.value); }, fontSize:11 }
      }]
    });

    window.execLoadChart = echarts.init(c2);
    var txSorted = getPlanningTransformers().slice().sort(function(a,b){ return b.loading - a.loading; }).slice(0, 20);
    window.execLoadChart.setOption({
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'} },
      grid:{ left:'2%', right:'6%', bottom:'4%', top:'8%', containLabel:true },
      xAxis:{ type:'value', max:130, axisLabel:{ formatter:'{value}%' } },
      yAxis:{ type:'category', data:txSorted.map(function(t){ return t.id; }), axisLabel:{ fontFamily:'IBM Plex Mono', fontSize:11 } },
      series:[{
        type:'bar', barMaxWidth:14,
        data:txSorted.map(function(t){ return { value:t.loading, itemStyle:{ color:statusColor(t.status) } }; }),
        markLine:{ silent:true, symbol:'none', lineStyle:{color:'#b91c1c',type:'dashed'}, data:[{xAxis:100}] }
      }]
    });

    window.addEventListener('resize', function(){ window.execInvestChart.resize(); window.execLoadChart.resize(); });
  }, 200);
})();

// =============================================
// 2. DIGITAL TWIN
// =============================================
var twinViewBox = { x: 0, y: 0, w: 900, h: 680 };
function applyTwinViewBox() {
  var svg = document.getElementById('twin-svg');
  if (svg) svg.setAttribute('viewBox', [twinViewBox.x, twinViewBox.y, twinViewBox.w, twinViewBox.h].join(' '));
}
function zoomTwin(factor) {
  var cx = twinViewBox.x + twinViewBox.w / 2;
  var cy = twinViewBox.y + twinViewBox.h / 2;
  var nextW = Math.max(360, Math.min(1100, twinViewBox.w / factor));
  var nextH = Math.max(272, Math.min(832, twinViewBox.h / factor));
  twinViewBox = { x: cx - nextW / 2, y: cy - nextH / 2, w: nextW, h: nextH };
  applyTwinViewBox();
}
function resetTwinZoom() {
  twinViewBox = { x: 0, y: 0, w: 900, h: 680 };
  applyTwinViewBox();
}
(function initDigitalTwin() {
  var selectedId = null;

  function buildSVG() {
    var svg = document.getElementById('twin-svg');
    if (!svg) return;
    var ns = 'http://www.w3.org/2000/svg';

    function el(tag, attrs, children) {
      var e = document.createElementNS(ns, tag);
      Object.keys(attrs||{}).forEach(function(k){ e.setAttribute(k,attrs[k]); });
      (children||[]).forEach(function(c){ e.appendChild(c); });
      return e;
    }
    function text(str, attrs) {
      var t = document.createElementNS(ns, 'text');
      Object.keys(attrs||{}).forEach(function(k){ t.setAttribute(k,attrs[k]); });
      t.textContent = str;
      return t;
    }

    svg.innerHTML = '';
    applyTwinViewBox();

    // Clean engineering background — subtle grid only
    for(var gi=100; gi<900; gi+=100) {
      svg.appendChild(el('line',{ x1:gi, y1:0, x2:gi, y2:680, stroke:'#f0f4f8', 'stroke-width':0.5 }));
    }
    for(var gj=80; gj<680; gj+=80) {
      svg.appendChild(el('line',{ x1:0, y1:gj, x2:900, y2:gj, stroke:'#f0f4f8', 'stroke-width':0.5 }));
    }

    // Substation
    var subX=450, subY=55;
    var subG = el('g',{ class:'net-node', id:'node-SUB-01', 'data-id':'SUB-01', 'data-type':'substation', cursor:'pointer' });
    subG.appendChild(el('rect',{ x:subX-52, y:subY-22, width:104, height:44, rx:4, fill:'#0d2d4e', stroke:'#fff', 'stroke-width':'2' }));
    subG.appendChild(el('rect',{ class:'node-ring', x:subX-56, y:subY-26, width:112, height:52, rx:6 }));
    subG.appendChild(text('SUB-01', { class:'net-sub-label', x:subX, y:subY-4, fill:'#fff', 'font-size':'9', 'font-family':'IBM Plex Mono' }));
    subG.appendChild(text('Garki 33/11kV', { class:'net-sub-label', x:subX, y:subY+10, fill:'rgba(255,255,255,0.75)', 'font-size':'8', 'font-family':'IBM Plex Sans' }));
    subG.addEventListener('click', function(){ selectAsset('SUB-01','substation'); });
    svg.appendChild(subG);

    // Feeder buses Y positions
    var f1y=220, f2y=440;
    var f1x1=80, f1x2=820;
    var f2x1=80, f2x2=820;

    // Vertical drop from sub to bus junction
    svg.appendChild(el('line',{ class:'net-conn active', x1:subX, y1:subY+22, x2:subX, y2:f1y }));
    svg.appendChild(el('line',{ class:'net-conn active', x1:subX, y1:f1y, x2:subX, y2:f2y }));

    // MV Buses
    svg.appendChild(el('line',{ class:'net-bus', x1:f1x1, y1:f1y, x2:f1x2, y2:f1y }));
    svg.appendChild(el('line',{ class:'net-bus', x1:f2x1, y1:f2y, x2:f2x2, y2:f2y }));

    // Feeder labels
    svg.appendChild(text('Feeder F-01  —  11 kV', { x:f1x1, y:f1y-12, 'font-family':'IBM Plex Sans', 'font-size':'10', fill:'#455a64', 'font-weight':'600' }));
    svg.appendChild(text('Feeder F-02  —  11 kV  (DER)',  { x:f2x1, y:f2y-12, 'font-family':'IBM Plex Sans', 'font-size':'10', fill:'#455a64', 'font-weight':'600' }));

    // Place transformers
    var f1tx = getCriticalTwinTransformers(15);
    var hiddenCount = getPlanningTransformers().length - f1tx.length;
    var f2tx = [];

    function placeTx(list, busY, yDir) {
      var n = list.length;
      list.forEach(function(tx, i) {
        var x = f1x1 + (f1x2 - f1x1) * (i+1) / (n+1);
        var nodeY = busY + yDir * 70;
        var col = statusColor(tx.status);

        // Vertical drop line
        svg.appendChild(el('line',{ class:'net-conn', x1:x, y1:busY, x2:x, y2:nodeY-(yDir>0?14:0), 'stroke-dasharray':yDir>0?'3 3':'3 3' }));

        // Node group
        var g = el('g',{ class:'net-node', id:'node-'+tx.id, 'data-id':tx.id, 'data-type':'transformer', cursor:'pointer' });

        // Pulse ring for warning/critical
        if (tx.status==='critical'||tx.status==='warning') {
          var pr = el('circle',{ class:'pulse-ring '+(tx.status), cx:x, cy:nodeY, r:12, 'stroke-width':2 });
          g.appendChild(pr);
        }
        // TX Symbol: two overlapping circles (transformer winding symbol)
        g.appendChild(el('circle',{ class:'node-circle', cx:x-5, cy:nodeY, r:8, fill:col, stroke:'#fff', 'stroke-width':'1.5', id:'circle-'+tx.id }));
        g.appendChild(el('circle',{ cx:x+5, cy:nodeY, r:8, fill:col, stroke:'#fff', 'stroke-width':'1.5', opacity:'0.85' }));
        // Selection ring
        g.appendChild(el('circle',{ class:'node-ring', cx:x, cy:nodeY, r:18, 'stroke-width':2.5 }));
        // TX ID label
        g.appendChild(text(tx.id, { class:'net-label', x:x, y:nodeY+(yDir>0?26:(-16)), fill:'#2d3748', 'font-size':'8', 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-weight':'600' }));
        // Loading % label
        g.appendChild(text(tx.loading+'%', { class:'net-label', id:'lbl-load-'+tx.id, x:x, y:nodeY+(yDir>0?37:(-27)), fill:col, 'font-size':'7.5', 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-weight':'700' }));
        // LV branches (small)
        var lvY1 = nodeY + yDir*18;
        svg.appendChild(el('line',{ x1:x, y1:nodeY+yDir*12, x2:x-18, y2:lvY1+yDir*14, class:'net-conn', 'stroke-dasharray':'2 4' }));
        svg.appendChild(el('line',{ x1:x, y1:nodeY+yDir*12, x2:x+18, y2:lvY1+yDir*14, class:'net-conn', 'stroke-dasharray':'2 4' }));
        svg.appendChild(el('circle',{ cx:x-18, cy:lvY1+yDir*18, r:4, fill:'#cfd8dc', stroke:'#90a4ae', 'stroke-width':'1.5' }));
        svg.appendChild(el('circle',{ cx:x+18, cy:lvY1+yDir*18, r:4, fill:'#cfd8dc', stroke:'#90a4ae', 'stroke-width':'1.5' }));

        g.addEventListener('click', function(){ selectAsset(tx.id,'transformer'); });
        svg.appendChild(g);
      });
    }

    placeTx(f1tx, f1y, 1);
    placeTx(f2tx, f2y, 1);

    // Mini-grid schematic on F-02: PCC, islanding switch, PV, battery, and local load bus.
    var pccX = 220, pccY = f2y + 74;
    svg.appendChild(el('line',{ class:'mini-grid-line', x1:pccX, y1:f2y, x2:pccX, y2:pccY-18, 'stroke-dasharray':'4 4' }));
    svg.appendChild(el('circle',{ cx:pccX, cy:pccY, r:13, fill:'#fff', stroke:'#1565c0', 'stroke-width':'2' }));
    svg.appendChild(text('PCC', { x:pccX, y:pccY+4, class:'schem-label', 'font-size':'8' }));
    svg.appendChild(el('line',{ class:'mini-grid-line', x1:pccX+13, y1:pccY, x2:pccX+88, y2:pccY }));
    svg.appendChild(el('rect',{ x:pccX+42, y:pccY-15, width:22, height:30, rx:3, fill:'#fff7ed', stroke:'#e65100', 'stroke-width':'1.3' }));
    svg.appendChild(text('ISO', { x:pccX+53, y:pccY+4, class:'schem-label', 'font-size':'8' }));
    svg.appendChild(el('line',{ class:'mini-grid-line', x1:pccX+88, y1:pccY, x2:pccX+265, y2:pccY }));
    svg.appendChild(text('Local AC Bus', { x:pccX+178, y:pccY-14, class:'schem-sub' }));

    var pvX = pccX+142, batX = pccX+232, loadX = pccX+322;
    svg.appendChild(el('line',{ class:'mini-grid-flow', x1:pvX, y1:pccY-54, x2:pvX, y2:pccY }));
    svg.appendChild(el('rect',{ class:'mini-grid-node', x:pvX-38, y:pccY-102, width:76, height:42 }));
    svg.appendChild(text('PV', { x:pvX, y:pccY-80, class:'schem-label' }));
    svg.appendChild(text('185 kW now', { x:pvX, y:pccY-64, class:'schem-sub' }));

    svg.appendChild(el('line',{ class:'mini-grid-flow', x1:batX, y1:pccY+54, x2:batX, y2:pccY }));
    svg.appendChild(el('rect',{ class:'mini-grid-node', x:batX-38, y:pccY+64, width:76, height:42 }));
    svg.appendChild(text('Battery', { x:batX, y:pccY+86, class:'schem-label' }));
    svg.appendChild(text('SOC 68%', { x:batX, y:pccY+102, class:'schem-sub' }));

    svg.appendChild(el('line',{ class:'mini-grid-line', x1:loadX-32, y1:pccY, x2:loadX-8, y2:pccY }));
    svg.appendChild(el('rect',{ class:'mini-grid-node', x:loadX-6, y:pccY-22, width:86, height:44 }));
    svg.appendChild(text('Load', { x:loadX+37, y:pccY-1, class:'schem-label' }));
    svg.appendChild(text('162 kW', { x:loadX+37, y:pccY+15, class:'schem-sub' }));
  }

  function selectAsset(id, type) {
    // Clear all selections
    document.querySelectorAll('.net-node .node-ring').forEach(function(r){ r.style.opacity='0'; });
    var ring = document.querySelector('#node-'+id+' .node-ring');
    if (ring) ring.style.opacity='1';
    selectedId = id;

    var panelBody = document.getElementById('asset-panel-body');
    if (!panelBody) return;

    if (type === 'substation') {
      var sub = DATA.substations[0];
      panelBody.innerHTML = [
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--col-border);">',
          '<div><div style="font-family:var(--font-hd);font-size:15px;font-weight:700;">'+sub.id+'</div>',
          '<div style="font-size:12px;color:var(--col-text-2);">33/11kV Grid Substation</div></div>',
          statusBadge('healthy'),
        '</div>',
        row('Name', sub.name),
        row('Rating', sub.rating_mva+' MVA'),
        row('Voltage', '33/11 kV'),
        row('Feeders', 'F-01 planning feeder + F-02 DER intertie'),
        row('Customers', getPlanningTransformers().reduce(function(sum, t){ return sum + t.customers; }, 0).toLocaleString('en-NG')),
        row('Model Scope', getPlanningTransformers().length + ' F-01 transformers; top risk subset rendered'),
        row('Status', 'Energised'),
      ].join('');
    } else {
      var tx = DATA.transformers.find(function(t){ return t.id===id; });
      if (!tx) return;
      var loadColor = tx.loading>100?'var(--col-critical)':tx.loading>85?'var(--col-warning)':'var(--col-healthy)';
      var voltColor = tx.volt<0.95?'var(--col-warning)':'inherit';
      panelBody.innerHTML = [
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--col-border);">',
          '<div><div style="font-family:var(--font-hd);font-size:15px;font-weight:700;">'+tx.id+'</div>',
          '<div style="font-size:12px;color:var(--col-text-2);">'+tx.feeder+' - Distribution Transformer</div></div>',
          statusBadge(tx.status),
        '</div>',
        row('Rating', tx.rating_kva+' kVA'),
        '<div class="asset-row"><span class="asset-row-lbl">Loading</span><span class="asset-row-val" style="color:'+loadColor+'">'+tx.loading+'%</span></div>',
        '<div class="asset-row"><span class="asset-row-lbl">Voltage (p.u.)</span><span class="asset-row-val" style="color:'+voltColor+'">'+tx.volt.toFixed(2)+'</span></div>',
        row('Customers', tx.customers),
        row('Segment', tx.segment || 'Garki radial section'),
        row('Tech Losses', tx.losses+' kW'),
        row('Installed', tx.year),
        '<div style="margin-top:16px;"><div style="font-size:11px;font-weight:600;color:var(--col-text-3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Health Score</div>',
        '<div class="prog-bar" style="height:8px;"><div class="prog-fill" style="width:'+tx.health+'%;background:'+statusColor(tx.status)+';"></div></div>',
        '<div style="text-align:right;font-size:12px;font-family:var(--font-mono);margin-top:4px;">'+tx.health+' / 100</div></div>',
      ].join('');
    }
  }

  function row(label, value) {
    return '<div class="asset-row"><span class="asset-row-lbl">'+label+'</span><span class="asset-row-val">'+value+'</span></div>';
  }

  buildSVG();
})();

// =============================================
// 3. LOAD ANALYSIS
// =============================================
var loadChart, heatmapChart;
(function initLoad() {
  setTimeout(function(){
    var c1 = document.getElementById('chart-load-profile');
    var c2 = document.getElementById('chart-heatmap');
    if (!c1 || !c2 || typeof echarts==='undefined') return;

    window.loadChart = echarts.init(c1);
    window.heatmapChart = echarts.init(c2);

    renderProfile('daily');

    // Heatmap
    var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    var heatData = [];
    for (var d=0;d<7;d++) {
      for (var h=0;h<24;h++) {
        var factor = (d<5)?1.0:0.75;
        heatData.push([h, d, +(DATA.daily[h]*factor*(0.9+Math.random()*0.2)).toFixed(1)]);
      }
    }
    heatmapChart.setOption({
      grid:{ left:'8%', right:'3%', bottom:'16%', top:'8%' },
      tooltip:{ formatter:function(p){ return p.data[0]+':00 '+days[p.data[1]]+' - '+p.data[2]+' MW'; } },
      xAxis:{ type:'category', data:Array.from({length:24},function(_,i){ return i+':00'; }), axisLabel:{fontSize:10, interval:1} },
      yAxis:{ type:'category', data:days, axisLabel:{fontSize:11} },
      visualMap:{ min:5, max:20, calculable:false, show:false, inRange:{ color:['#e8f5e9','#fffde7','#fff3e0','#fce4ec','#b71c1c'] } },
      series:[{ type:'heatmap', data:heatData, itemStyle:{borderColor:'#fff',borderWidth:1} }]
    });

    // Top 5 table
    var top5 = getPlanningTransformers().slice().sort(function(a,b){ return b.loading-a.loading; }).slice(0,5);
    var tbody = document.getElementById('tbl-load-top');
    if (tbody) tbody.innerHTML = top5.map(function(t){
      var col = statusColor(t.status);
      return '<tr><td class="tbl-mono">'+t.id+'</td><td>'+t.feeder+'</td><td class="tbl-mono">'+t.rating_kva+'</td><td><div style="display:flex;align-items:center;gap:8px;"><div class="prog-bar" style="width:80px;"><div class="prog-fill" style="width:'+Math.min(t.loading,100)+'%;background:'+col+';"></div></div><span style="font-family:var(--font-mono);font-size:12px;font-weight:600;color:'+col+';">'+t.loading+'%</span></div></td></tr>';
    }).join('');
    renderLoadExtremes();

    window.addEventListener('resize', function(){ if(window.loadChart) window.loadChart.resize(); if(window.heatmapChart) window.heatmapChart.resize(); });
  }, 200);
})();

function loadingRow(t) {
  var col = statusColor(t.status);
  return '<tr><td class="tbl-mono">'+t.id+'</td><td style="color:var(--col-text-2);font-size:12px;">'+(t.segment || 'F-01 section')+'</td><td class="tbl-mono">'+t.customers+'</td><td><div style="display:flex;align-items:center;gap:8px;"><div class="prog-bar" style="width:76px;"><div class="prog-fill" style="width:'+Math.min(t.loading,100)+'%;background:'+col+';"></div></div><span style="font-family:var(--font-mono);font-size:12px;font-weight:650;color:'+col+';">'+t.loading+'%</span></div></td></tr>';
}

function renderLoadExtremes() {
  var sortedDesc = getPlanningTransformers().slice().sort(function(a,b){ return b.loading-a.loading; });
  var high = document.getElementById('tbl-load-high');
  var low = document.getElementById('tbl-load-low');
  if (high) high.innerHTML = sortedDesc.slice(0, 10).map(loadingRow).join('');
  if (low) low.innerHTML = sortedDesc.slice().reverse().slice(0, 10).map(loadingRow).join('');
}

function switchProfile(mode, btn) {
  window.currentLoadProfileMode = mode;
  document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  renderProfile(mode);
}

function renderProfile(mode) {
  if (!window.loadChart) return;
  window.currentLoadProfileMode = mode;
  var opts = {
    daily: {
      xData: Array.from({length: 24}, function(_, i) { return i + ':00'; }),
      series: [
        { name: 'Feeder F-01 Load', data: DATA.daily.map(v => +(v * 0.6).toFixed(1)), type: 'line', smooth: true, areaStyle: { opacity: 0.08, color: '#1565c0' }, lineStyle: { color: '#1565c0', width: 2.5 }, showSymbol: false },
        { name: 'Feeder F-02 Load', data: DATA.daily.map(v => +(v * 0.4).toFixed(1)), type: 'line', smooth: true, areaStyle: { opacity: 0.05, color: '#64b5f6' }, lineStyle: { color: '#64b5f6', width: 1.5 }, showSymbol: false }
      ]
    },
    weekly: {
      xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [
        { name: 'Feeder F-01 Load', data: [12.4, 13.1, 12.8, 13.5, 13.2, 9.8, 8.5], type: 'bar', barGap: 0, itemStyle: { color: '#1565c0' } },
        { name: 'Feeder F-02 Load', data: [8.8, 9.2, 9.0, 9.6, 9.3, 7.2, 6.1], type: 'bar', itemStyle: { color: '#64b5f6' } }
      ]
    },
    monthly: {
      xData: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        { name: 'Feeder F-01 Load', data: [8.5, 8.2, 8.7, 9.0, 9.5, 9.7, 10.2, 10.6, 9.9, 9.1, 8.4, 8.7], type: 'line', smooth: true, lineStyle: { color: '#1565c0', width: 2 }, showSymbol: false },
        { name: 'Feeder F-02 Load', data: [5.7, 5.6, 5.8, 6.1, 6.3, 6.5, 6.9, 7.2, 6.6, 6.2, 5.7, 5.9], type: 'line', smooth: true, lineStyle: { color: '#64b5f6', width: 1.5 }, showSymbol: false }
      ]
    },
    annual: {
      xData: ['Q1', 'Q2', 'Q3', 'Q4'],
      series: [
        { name: 'Feeder F-01 Load', data: [8.5, 9.4, 10.3, 8.8], type: 'bar', itemStyle: { color: '#1565c0' } },
        { name: 'Feeder F-02 Load', data: [5.7, 6.3, 6.9, 5.9], type: 'bar', itemStyle: { color: '#64b5f6' } }
      ]
    }
  };
  var o = opts[mode];
  
  var simHour = Math.min(23, Math.max(0, Math.floor(getSimTimeDecimal ? getSimTimeDecimal() : 14)));
  var simLabel = getSimTimeStr ? getSimTimeStr() : '08:00';

  // Set current time mark for daily view
  var markLine = mode === 'daily' ? {
    symbol: 'none',
    label: { show: true, position: 'middle', formatter: 'Now ' + simLabel },
    lineStyle: { color: '#e65100', type: 'dashed', width: 2 },
    data: [{ xAxis: simHour + ':00' }]
  } : undefined;

  window.loadChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    grid: { left: 58, right: 28, bottom: 48, top: 28, containLabel: true },
    xAxis: { type: 'category', data: o.xData, boundaryGap: mode !== 'daily' && mode !== 'monthly', axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', name: 'MW', nameLocation: 'middle', nameGap: 42, nameTextStyle: { fontSize: 11, fontWeight: 600 } },
    series: o.series.map(s => {
      if (markLine && s.name === 'Feeder F-01 Load') {
        s.markLine = markLine;
      }
      return s;
    })
  }, true);
}

// =============================================
// 4. CONSTRAINT ANALYSIS
// =============================================
(function initConstraint() {
  // Constraint table
  setTimeout(function(){
    var tbody = document.getElementById('tbl-constraints');
    if (!tbody) return;
    var constraints = getConstraintRegister();
    var overloaded = getPlanningTransformers().filter(function(t){ return t.loading > 100; }).length;
    var voltage = getPlanningTransformers().filter(function(t){ return t.volt < 0.95; }).length;
    var availableCapacity = getPlanningTransformers().reduce(function(sum, t){
      return sum + Math.max(0, t.rating_kva * (1 - t.loading / 100));
    }, 0) / 1000;
    var co = document.getElementById('constraint-overloaded');
    var cv = document.getElementById('constraint-voltage');
    var cap = document.getElementById('constraint-capacity');
    if (co) co.textContent = overloaded;
    if (cv) cv.textContent = voltage;
    if (cap) cap.textContent = availableCapacity.toFixed(1) + ' MW';
    tbody.innerHTML = constraints.slice(0, 12).map(function(c){
      return '<tr><td>'+statusBadge(c.sev)+'</td><td class="tbl-mono">'+c.asset+'</td><td>'+c.problem+'</td><td style="color:var(--col-text-2);font-size:12px;">'+c.cause+'</td><td style="color:var(--col-accent);font-weight:500;">'+c.action+'</td><td><span style="font-family:var(--font-num);font-weight:700;">'+c.priority+'</span></td></tr>';
    }).join('');

    
    var segmentActions = {
      'S4': 'Priority action: reconductor the overloaded spur head and transfer part of the evening market load.',
      'market': 'Priority action: split LV load and rebalance phases feeding the market cluster transformers.',
      'B3': 'Voltage support issue: add capacitor support or investigate undersized downstream laterals.',
      'B4': 'Voltage issue despite low loading: check conductor impedance and transformer tap position.',
      'S1': 'Watchlist: verify phase-current readings before accepting major new load.',
      'Injection': 'No immediate action: upstream injection section is stable.'
    };
    function explainSegment(s) {
      var name = s.dataset.n || 'Feeder segment';
      var value = s.dataset.v || 'No model value available';
      var action = 'No immediate reinforcement. Continue monitoring.';
      Object.keys(segmentActions).forEach(function(key) {
        if (name.indexOf(key) !== -1) action = segmentActions[key];
      });
      var detail = document.getElementById('constraint-detail');
      if (detail) {
        detail.innerHTML = '<div style="font-family:var(--font-mono);font-weight:700;color:var(--col-text-1);font-size:13px;margin-bottom:10px;">'+name+'</div>'
          + '<div style="font-size:12px;color:var(--col-critical);font-weight:600;margin-bottom:6px;">⬡ '+value+'</div>'
          + '<div style="font-size:12px;color:var(--col-accent);font-weight:600;">↳ '+action+'</div>';
      }
    }
    // Constraint map segment hover/click tooltips
    document.querySelectorAll('#feederMap .seg').forEach(function(s) {
      s.addEventListener('pointermove', function(e) {
        showTip('<b>' + s.dataset.n + '</b><br>' + s.dataset.v, e.clientX, e.clientY);
        explainSegment(s);
      });
      s.addEventListener('click', function(){ explainSegment(s); });
      s.addEventListener('pointerleave', hideTip);
    });

    const overlayBtn = document.getElementById('overlayBtn');
    if (overlayBtn) {
      overlayBtn.addEventListener('click', function() {
        const on = overlayBtn.getAttribute('aria-pressed') !== 'true';
        overlayBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
        overlayBtn.textContent = on ? 'Hide outage history' : 'Overlay outage history';
        document.getElementById('outageLayer').style.display = on ? '' : 'none';
        document.getElementById('lg-outage').style.display = on ? '' : 'none';
        
        // Show validation callout
        const callout = document.getElementById('mapCallout');
        if (callout) {
          callout.style.borderColor = on ? 'var(--col-healthy-mid)' : 'var(--col-accent)';
        }
      });
    }

  }, 100);
})();

// =============================================
// 5. INVESTMENT PLANNING
// =============================================
var investCharts = {};
(function initInvest() {
  renderInvestTable(150000);
  setTimeout(function(){
    var c1 = document.getElementById('chart-invest-waterfall');
    var c2 = document.getElementById('chart-invest-customers');
    if (!c1 || !c2 || typeof echarts==='undefined') return;

    var sorted = DATA.projects.slice().sort(function(a,b){ return b.priority-a.priority; });
    var cumCost=0, cumLoss=0;
    var wfData = sorted.map(function(p){ cumCost+=p.capex; cumLoss+=p.lossRed; return { cost:cumCost, loss:+cumLoss.toFixed(1) }; });

    investCharts.wf = echarts.init(c1);
    investCharts.wf.setOption({
      tooltip:{ trigger:'axis', formatter:function(p){ return p[0].name+'<br>Cumulative CAPEX: '+formatNairaFromUsd(p[0].value)+'<br>Cumulative Loss Reduction: '+p[1].value+' kW'; } },
      legend:{ bottom:0, textStyle:{fontSize:11} },
      grid:{ left:'10%', right:'10%', bottom:'20%', top:'12%', containLabel:true },
      xAxis:{ type:'category', data:sorted.map(function(p){ return p.id; }), axisLabel:{fontSize:11} },
      yAxis:[
        { type:'value', name:'Cum. CAPEX (NGN)', axisLabel:{ formatter:function(v){ return formatNairaFromUsd(v); }, fontSize:10 } },
        { type:'value', name:'Loss Reduction (kW)', axisLabel:{fontSize:10} }
      ],
      series:[
        { name:'Cumulative CAPEX', type:'bar', barMaxWidth:24, data:wfData.map(function(d){ return d.cost; }), itemStyle:{color:'rgba(21,101,192,0.2)',borderColor:'#1565c0',borderWidth:1.5} },
        { name:'Cum. Loss Reduction', type:'line', yAxisIndex:1, data:wfData.map(function(d){ return d.loss; }), smooth:true, lineStyle:{color:'#0ca30c',width:2.5}, symbol:'circle', symbolSize:6, itemStyle:{color:'#0ca30c'} }
      ]
    });

    investCharts.cu = echarts.init(c2);
    investCharts.cu.setOption({
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'} },
      grid:{ left:'8%', right:'8%', bottom:'12%', top:'12%', containLabel:true },
      xAxis:{ type:'value', name:'Customers Benefited' },
      yAxis:{ type:'category', data:sorted.map(function(p){ return p.id; }), axisLabel:{ fontFamily:'IBM Plex Mono', fontSize:11 } },
      series:[{ type:'bar', barMaxWidth:16, data:sorted.map(function(p){ return p.cust; }), itemStyle:{color:'#1565c0'}, label:{show:true,position:'right',fontSize:11} }]
    });

    window.addEventListener('resize', function(){ if(investCharts.wf) investCharts.wf.resize(); if(investCharts.cu) investCharts.cu.resize(); });
  }, 200);
})();

function updateBudget(val) {
  val = parseInt(val);
  document.getElementById('budget-display').textContent = formatNairaFromUsd(val);
  renderInvestTable(val);
}

function renderInvestTable(budget) {
  var sorted = DATA.projects.slice().sort(function(a,b){ return b.priority-a.priority; });
  var cumCost = 0, includedCount = 0, includedCost = 0;
  var rows = sorted.map(function(p, i){
    cumCost += p.capex;
    var included = cumCost <= budget;
    if (included) { includedCount++; includedCost += p.capex; }
    var status = included ? '<span class="badge healthy">Included</span>' : '<span class="badge neutral">Deferred</span>';
    var rowStyle = included ? '' : 'opacity:0.45;';
    var opex = p.opex || Math.round(p.capex * 0.04);
    var tco = p.capex + opex * 10;
    return '<tr style="'+rowStyle+'"><td>'+(i+1)+'</td><td class="tbl-mono">'+p.id+'</td><td style="font-weight:500;">'+p.action+'</td><td style="color:var(--col-text-2);font-size:12px;">'+p.constraint+'</td><td class="tbl-mono">'+formatNairaFromUsd(p.capex)+'</td><td class="tbl-mono">'+formatNairaFromUsd(opex)+'/yr</td><td class="tbl-mono" style="font-weight:600;color:var(--col-primary);">'+formatNairaFromUsd(tco)+'</td><td class="tbl-mono">'+p.loadRed+'%</td><td class="tbl-mono">'+p.lossRed+' kW</td><td class="tbl-mono">'+p.cust+'</td><td><span style="font-family:var(--font-num);font-weight:700;">'+p.priority+'</span></td><td>'+status+'</td></tr>';
  });
  var tbody = document.getElementById('tbl-invest');
  if (tbody) tbody.innerHTML = rows.join('');
  var ic = document.getElementById('budget-included-count');
  var icc = document.getElementById('budget-included-cost');
  if (ic) ic.textContent = includedCount + ' of '+sorted.length+' projects included';
  if (icc) icc.textContent = formatNairaFromUsd(includedCost)+' committed';
}

// Fix syntax issue in renderInvestTable
var _renderInvestTable = renderInvestTable;
renderInvestTable = function(budget) {
  var sorted = DATA.projects.slice().sort(function(a,b){ return b.priority-a.priority; });
  var cumCost = 0, includedCount = 0, includedCost = 0;
  var rows = sorted.map(function(p, i){
    cumCost += p.capex;
    var included = cumCost <= budget;
    if (included) { includedCount++; includedCost += p.capex; }
    var status = included ? '<span class="badge healthy">Included</span>' : '<span class="badge neutral">Deferred</span>';
    var rowStyle = included ? '' : 'opacity:0.45;';
    var opex = p.opex || Math.round(p.capex * 0.04);
    var tco = p.capex + opex * 10;
    return '<tr style="'+rowStyle+'"><td>'+(i+1)+'</td><td class="tbl-mono">'+p.id+'</td><td style="font-weight:500;">'+p.action+'</td><td style="color:var(--col-text-2);font-size:12px;">'+p.constraint+'</td><td class="tbl-mono">'+formatNairaFromUsd(p.capex)+'</td><td class="tbl-mono">'+formatNairaFromUsd(opex)+'/yr</td><td class="tbl-mono" style="font-weight:600;color:var(--col-primary);">'+formatNairaFromUsd(tco)+'</td><td class="tbl-mono">'+p.loadRed+'%</td><td class="tbl-mono">'+p.lossRed+' kW</td><td class="tbl-mono">'+p.cust+'</td><td><span style="font-family:var(--font-num);font-weight:700;">'+p.priority+'</span></td><td>'+status+'</td></tr>';
  }).join('');
  var tbody = document.getElementById('tbl-invest');
  if (tbody) tbody.innerHTML = rows;
  var ic = document.getElementById('budget-included-count');
  var icc = document.getElementById('budget-included-cost');
  if (ic) ic.textContent = includedCount + ' of '+sorted.length+' projects included';
  if (icc) icc.textContent = formatNairaFromUsd(includedCost)+' committed';
};
renderInvestTable(150000);

function renderRecommendations() {
  var tbody = document.getElementById('tbl-recommendations-body');
  if (!tbody) return;
  var sorted = DATA.projects.slice().sort(function(a,b){ return b.priority - a.priority; });
  var totalCapex = 0, totalOpex = 0;
  var rows = sorted.map(function(p, i){
    var opex = p.opex || Math.round(p.capex * 0.04);
    totalCapex += p.capex;
    totalOpex += opex;
    var outcome = p.priority >= 90 ? '<span class="badge critical">Critical Relief</span>' : (p.priority >= 80 ? '<span class="badge warning">Capacity Uprate</span>' : '<span class="badge healthy">Grid Efficiency</span>');
    return '<tr>'
      + '<td><span style="font-family:var(--font-num);font-weight:700;color:var(--col-primary);">' + p.priority + '</span></td>'
      + '<td class="tbl-mono">' + p.id + '</td>'
      + '<td style="color:var(--col-text-2);font-size:12px;">' + p.constraint + '</td>'
      + '<td style="font-weight:600;">' + p.action + '</td>'
      + '<td style="font-size:11.5px;color:var(--col-text-2);">' + (p.rationale || 'High loading & voltage drop mitigation') + '</td>'
      + '<td><span class="tbl-mono">' + p.loadRed + '% load / ' + p.lossRed + ' kW saved</span></td>'
      + '<td class="tbl-mono">' + formatNairaFromUsd(p.capex) + '</td>'
      + '<td class="tbl-mono">' + formatNairaFromUsd(opex) + '/yr</td>'
      + '<td>' + outcome + '</td>'
      + '</tr>';
  });
  tbody.innerHTML = rows.join('');
  
  var rc = document.getElementById('rec-total-capex');
  var ro = document.getElementById('rec-total-opex');
  var rt = document.getElementById('rec-total-tco');
  if (rc) rc.textContent = formatNairaFromUsd(totalCapex);
  if (ro) ro.textContent = formatNairaFromUsd(totalOpex) + '/yr';
  if (rt) rt.textContent = formatNairaFromUsd(totalCapex + totalOpex * 10);
}
setTimeout(renderRecommendations, 250);

// =============================================
// 6. SCENARIO SIMULATION
// =============================================
var scenarioParams = { growth:10, der:5, cust:50 };
var scenarioChart;

function updateScenario(key, val) {
  scenarioParams[key] = parseInt(val);
  document.getElementById('lbl-growth').textContent = scenarioParams.growth+'%';
  document.getElementById('lbl-der').textContent = scenarioParams.der+'%';
  document.getElementById('lbl-cust').textContent = scenarioParams.cust;
  renderScenario();
}

function renderScenario() {
  var g = scenarioParams.growth/100, d = scenarioParams.der/100, nc = scenarioParams.cust;
  var base = {
    load:12.5,
    violations:getPlanningTransformers().filter(function(t){ return t.volt < 0.95; }).length,
    losses:4.2,
    overloaded:getPlanningTransformers().filter(function(t){ return t.loading > 100; }).length,
    capacity:3.2
  };
  var sim = {
    load: +(base.load*(1+g) - base.load*d*0.6 + nc*0.008).toFixed(2),
    violations: Math.max(0, Math.round(base.violations + g*25 - d*8)),
    losses: +(base.losses*(1+g*0.5)).toFixed(2),
    overloaded: Math.min(getPlanningTransformers().length, Math.round(base.overloaded + g*8 - d*2)),
    capacity: +(base.capacity - base.load*g + base.load*d*0.4).toFixed(2)
  };

  function metricRow(lbl, before, after, unit, invert) {
    var diff = after-before;
    var pct = Math.abs(diff/before*100).toFixed(1);
    var bad = invert ? diff<0 : diff>0;
    var arrow = diff>0?'▲':'▼';
    var col = bad?'var(--col-critical)':'var(--col-healthy)';
    return '<div class="asset-row"><span class="asset-row-lbl">'+lbl+'</span><span class="asset-row-val">'+before+unit+'</span></div>'+
           '<div class="asset-row" style="background:#f7f8fa;"><span class="asset-row-lbl">'+lbl+'</span><span class="asset-row-val"><span style="color:'+col+';font-size:11px;margin-right:4px;">'+arrow+' '+pct+'%</span>'+after+unit+'</span></div>';
  }

  var bHtml = '<div class="asset-row"><span class="asset-row-lbl">Peak Load</span><span class="asset-row-val">'+base.load+' MW</span></div><div class="asset-row"><span class="asset-row-lbl">Voltage Violations</span><span class="asset-row-val">'+base.violations+'</span></div><div class="asset-row"><span class="asset-row-lbl">Technical Losses</span><span class="asset-row-val">'+base.losses+'%</span></div><div class="asset-row"><span class="asset-row-lbl">Overloaded TX</span><span class="asset-row-val critical">'+base.overloaded+'</span></div><div class="asset-row"><span class="asset-row-lbl">Available Capacity</span><span class="asset-row-val healthy">'+base.capacity+' MW</span></div>';
  var aHtml = '<div class="asset-row"><span class="asset-row-lbl">Peak Load</span><span class="asset-row-val" style="color:'+(sim.load>base.load?'var(--col-critical)':'var(--col-healthy)')+'">'+sim.load+' MW</span></div><div class="asset-row"><span class="asset-row-lbl">Voltage Violations</span><span class="asset-row-val" style="color:'+(sim.violations>base.violations?'var(--col-critical)':'var(--col-healthy)')+'">'+sim.violations+'</span></div><div class="asset-row"><span class="asset-row-lbl">Technical Losses</span><span class="asset-row-val" style="color:'+(sim.losses>base.losses?'var(--col-warning)':'var(--col-healthy)')+'">'+sim.losses+'%</span></div><div class="asset-row"><span class="asset-row-lbl">Overloaded TX</span><span class="asset-row-val" style="color:'+(sim.overloaded>base.overloaded?'var(--col-critical)':'var(--col-healthy)')+'">'+sim.overloaded+'</span></div><div class="asset-row"><span class="asset-row-lbl">Available Capacity</span><span class="asset-row-val" style="color:'+(sim.capacity<base.capacity?'var(--col-warning)':'var(--col-healthy)')+'">'+sim.capacity+' MW</span></div>';

  var bEl = document.getElementById('scenario-before');
  var aEl = document.getElementById('scenario-after');
  if (bEl) bEl.innerHTML = bHtml;
  if (aEl) aEl.innerHTML = aHtml;

  // Compare chart
  if (!scenarioChart) {
    var c = document.getElementById('chart-scenario-compare');
    if (!c || typeof echarts==='undefined') return;
    scenarioChart = echarts.init(c);
    window.addEventListener('resize', function(){ if(scenarioChart) scenarioChart.resize(); });
  }
  var factor = 1+g-d*0.6+nc*0.0005;
  var scenarioTx = getPlanningTransformers().slice().sort(function(a,b){ return b.loading - a.loading; }).slice(0, 24);
  scenarioChart.setOption({
    tooltip:{ trigger:'axis', axisPointer:{type:'shadow'} },
    legend:{ bottom:0, textStyle:{fontSize:11} },
    grid:{ left:'2%', right:'4%', bottom:'12%', top:'10%', containLabel:true },
    xAxis:{ type:'category', data:scenarioTx.map(function(t){ return t.id; }), axisLabel:{fontSize:10, rotate:35, fontFamily:'IBM Plex Mono'} },
    yAxis:{ type:'value', name:'Loading %', axisLabel:{formatter:'{value}%'} },
    series:[
      { name:'Baseline', type:'bar', barGap:0, barMaxWidth:18, data:scenarioTx.map(function(t){ return t.loading; }), itemStyle:{color:'rgba(84,110,122,0.5)'} },
      { name:'Simulated', type:'bar', barMaxWidth:18, data:scenarioTx.map(function(t){ return Math.min(Math.round(t.loading*factor),150); }), itemStyle:{color:'rgba(21,101,192,0.75)'} }
    ]
  });
}
renderScenario();

// =============================================
// 7. MINI-GRID SCHEMATIC
// =============================================
(function initMinigrid() {
  const H = [...Array(49)].map((_,i)=> i/2); // 0..24
  const pv = H.map(getSimPvKw);
  const demand = H.map(getSimDemandKw);
  const island = isSimIslanded;
  const batt = H.map(getSimBatteryKw);
  const pcc = H.map(t => getSimSnapshot(t).pcc_kw);
  const soc = H.map(getSimSocPct);

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n,a) => { const e = document.createElementNS(NS,n); for (const k in a) e.setAttribute(k,a[k]); return e; };
  const hhmm = t => String(Math.floor(t)).padStart(2,'0') + ':' + (t%1 ? '30' : '00');
  window.miniGridCharts = { markers: {}, updateMarker: function(){} };

  function frame(svg, M, W, Hh, ymax, yticks, yfmt){
    const iw = W - M.l - M.r, ih = Hh - M.t - M.b;
    const X = t => M.l + t/24 * iw;
    const Y = v => M.t + (1 - v/ymax) * ih;
    yticks.forEach(v => {
      svg.appendChild(el('line',{x1:M.l, x2:W-M.r, y1:Y(v), y2:Y(v), stroke:'var(--col-border)','stroke-width':1}));
      const tx = el('text',{x:M.l-8, y:Y(v)+3.5, 'text-anchor':'end', class:'axis-t', style:'font-variant-numeric:tabular-nums; fill:var(--col-text-3); font-size:10px;'});
      tx.textContent = yfmt(v); svg.appendChild(tx);
    });
    [0,6,12,18,24].forEach(t => {
      const tx = el('text',{x:X(t), y:Hh-M.b+16, 'text-anchor': t===24?'end':(t===0?'start':'middle'), class:'axis-t', style:'fill:var(--col-text-3); font-size:10px;'});
      tx.textContent = hhmm(t); svg.appendChild(tx);
    });
    svg.appendChild(el('line',{x1:M.l, x2:W-M.r, y1:Y(0), y2:Y(0), stroke:'var(--col-border)','stroke-width':1}));
    return {X, Y};
  }
  const pathOf = (xs, ys) => xs.map((x,i)=>(i?'L':'M')+x.toFixed(1)+' '+ys[i].toFixed(1)).join(' ');

  /* Chart A: generation & demand */
  (function(){
    const svg = document.getElementById('chartGen');
    if (!svg) return;
    const W=620, Hh=260, M={l:46,r:14,t:14,b:30};
    const {X,Y} = frame(svg, M, W, Hh, 800, [0,200,400,600,800], v=>v);
    svg.appendChild(el('rect',{x:X(19), y:M.t, width:X(20.5)-X(19), height:Hh-M.t-M.b, fill:'var(--col-border)', opacity:.35}));
    const bt = el('text',{x:X(19.75), y:M.t+12, 'text-anchor':'middle', class:'axis-t', style:'fill:var(--col-text-3); font-size:10px;'}); bt.textContent='islanded'; svg.appendChild(bt);
    const xs = H.map(X);
    svg.appendChild(el('path',{d: pathOf(xs, pv.map(Y)) + ' L'+X(24)+' '+Y(0)+' L'+X(0)+' '+Y(0)+' Z', fill:'#1565c0', opacity:.1}));
    svg.appendChild(el('path',{d: pathOf(xs, pv.map(Y)), fill:'none', stroke:'#1565c0','stroke-width':2,'stroke-linejoin':'round','stroke-linecap':'round'}));
    svg.appendChild(el('path',{d: pathOf(xs, demand.map(Y)), fill:'none', stroke:'#0ca30c','stroke-width':2,'stroke-linejoin':'round','stroke-linecap':'round'}));
    const l1 = el('text',{x:X(12.5), y:Y(pv[25])-10, 'text-anchor':'middle', class:'lbl-t', style:'fill:var(--col-text-1); font-size:11px; font-weight:600;'}); l1.textContent='PV peak 718 kW'; svg.appendChild(l1);
    const l2 = el('text',{x:X(20.2), y:Y(demand[40])-12, 'text-anchor':'middle', class:'lbl-t', style:'fill:var(--col-text-1); font-size:11px; font-weight:600;'}); l2.textContent='evening peak'; svg.appendChild(l2);

    const cross = el('line',{y1:M.t, y2:Hh-M.b, stroke:'var(--col-border)','stroke-width':1, opacity:0});
    const d1 = el('circle',{r:4.5, fill:'#1565c0', stroke:'var(--col-surface)','stroke-width':2, opacity:0});
    const d2 = el('circle',{r:4.5, fill:'#0ca30c', stroke:'var(--col-surface)','stroke-width':2, opacity:0});
    svg.appendChild(cross); svg.appendChild(d1); svg.appendChild(d2);
    const nowLine = el('line',{y1:M.t, y2:Hh-M.b, stroke:'#e65100','stroke-width':2,'stroke-dasharray':'4 4', opacity:.9});
    const nowPv = el('circle',{r:5, fill:'#1565c0', stroke:'var(--col-surface)','stroke-width':2});
    const nowDemand = el('circle',{r:5, fill:'#0ca30c', stroke:'var(--col-surface)','stroke-width':2});
    const nowText = el('text',{y:M.t+12, 'text-anchor':'middle', class:'axis-t', style:'fill:#e65100; font-size:10px; font-weight:700;'});
    svg.appendChild(nowLine); svg.appendChild(nowPv); svg.appendChild(nowDemand); svg.appendChild(nowText);
    window.miniGridCharts.markers.gen = { X:X, Y:Y, line:nowLine, pv:nowPv, demand:nowDemand, text:nowText };
    const hit = el('rect',{x:M.l, y:M.t, width:W-M.l-M.r, height:Hh-M.t-M.b, fill:'transparent'});
    svg.appendChild(hit);
    hit.addEventListener('pointermove', e => {
      const r = svg.getBoundingClientRect(), sx = W / r.width;
      const t = Math.min(24, Math.max(0, ((e.clientX - r.left)*sx - M.l) / (W-M.l-M.r) * 24));
      const i = Math.round(t*2); const x = X(H[i]);
      cross.setAttribute('x1',x); cross.setAttribute('x2',x); cross.setAttribute('opacity',1);
      d1.setAttribute('cx',x); d1.setAttribute('cy',Y(pv[i])); d1.setAttribute('opacity',1);
      d2.setAttribute('cx',x); d2.setAttribute('cy',Y(demand[i])); d2.setAttribute('opacity',1);
      showTip('<b>'+hhmm(H[i])+(island(H[i])?' · islanded':'')+'</b>'
        +'<div class="tt-row"><span class="swatch" style="background:#1565c0"></span>PV '+pv[i]+' kW</div>'
        +'<div class="tt-row"><span class="swatch" style="background:#0ca30c"></span>Demand '+demand[i]+' kW</div>', e.clientX, e.clientY);
    });
    hit.addEventListener('pointerleave', () => { hideTip(); [cross,d1,d2].forEach(o=>o.setAttribute('opacity',0)); });
  })();

  /* Chart B: PCC diverging bars */
  (function(){
    const svg = document.getElementById('chartPcc');
    if (!svg) return;
    const W=620, Hh=190, M={l:46,r:14,t:12,b:28};
    const iw = W-M.l-M.r, ih = Hh-M.t-M.b, ymax = 400;
    const X = t => M.l + t/24*iw;
    const Y = v => M.t + (1 - (v+ymax)/(2*ymax)) * ih;
    [-400,-200,0,200,400].forEach(v => {
      svg.appendChild(el('line',{x1:M.l,x2:W-M.r,y1:Y(v),y2:Y(v),stroke: v===0?'var(--col-border)':'var(--col-border)','stroke-width':1}));
      const tx = el('text',{x:M.l-8,y:Y(v)+3.5,'text-anchor':'end',class:'axis-t',style:'font-variant-numeric:tabular-nums; fill:var(--col-text-3); font-size:10px;'});
      tx.textContent = v; svg.appendChild(tx);
    });
    [0,6,12,18,24].forEach(t => { const tx = el('text',{x:X(t),y:Hh-M.b+16,'text-anchor': t===24?'end':(t===0?'start':'middle'),class:'axis-t', style:'fill:var(--col-text-3); font-size:10px;'}); tx.textContent=hhmm(t); svg.appendChild(tx); });
    const bw = iw/49 - 2;
    H.forEach((t,i) => {
      const v = Math.max(-ymax, Math.min(ymax, pcc[i]));
      if (v === 0 && !island(t)) return;
      const y0 = Y(0), y1 = Y(v);
      const b = el('rect',{ x: X(t)-bw/2, y: Math.min(y0,y1), width: Math.max(1.5,bw), height: Math.max(1.5, Math.abs(y1-y0)),
        fill: island(t) ? 'var(--col-border)' : (v>0 ? '#1565c0' : '#b91c1c'), rx: 1.5 });
      b.addEventListener('pointermove', e => showTip('<b>'+hhmm(t)+'</b><br>'
        + (island(t) ? 'Islanded · PCC open, 0 kW' : (pcc[i]>0 ? 'Exporting '+pcc[i]+' kW to grid' : 'Importing '+(-pcc[i])+' kW')), e.clientX, e.clientY));
      b.addEventListener('pointerleave', hideTip);
      svg.appendChild(b);
    });
    const lt = el('text',{x:X(19.75), y:M.t+11, 'text-anchor':'middle', class:'axis-t', style:'fill:var(--col-text-3); font-size:10px;'}); lt.textContent='islanded'; svg.appendChild(lt);
    const nowLine = el('line',{y1:M.t, y2:Hh-M.b, stroke:'#e65100','stroke-width':2,'stroke-dasharray':'4 4', opacity:.9});
    const nowDot = el('circle',{r:5, fill:'#e65100', stroke:'var(--col-surface)','stroke-width':2});
    const nowText = el('text',{y:M.t+11, 'text-anchor':'middle', class:'axis-t', style:'fill:#e65100; font-size:10px; font-weight:700;'});
    svg.appendChild(nowLine); svg.appendChild(nowDot); svg.appendChild(nowText);
    window.miniGridCharts.markers.pcc = { X:X, Y:Y, line:nowLine, dot:nowDot, text:nowText };
  })();

  /* Chart C: SoC */
  (function(){
    const svg = document.getElementById('chartSoc');
    if (!svg) return;
    const W=620, Hh=150, M={l:46,r:14,t:12,b:26};
    const {X,Y} = frame(svg, M, W, Hh, 100, [0,50,100], v=>v+'%');
    svg.appendChild(el('line',{x1:M.l,x2:W-M.r,y1:Y(30),y2:Y(30),stroke:'#e65100','stroke-width':1,'stroke-dasharray':'1 3'}));
    const rl = el('text',{x:W-M.r, y:Y(30)+13, 'text-anchor':'end', class:'axis-t', style:'fill:#e65100; font-size:9px;'}); rl.textContent='30% islanding reserve'; svg.appendChild(rl);
    svg.appendChild(el('rect',{x:X(19), y:M.t, width:X(20.5)-X(19), height:Hh-M.t-M.b, fill:'var(--col-border)', opacity:.35}));
    const xs = H.map(X);
    svg.appendChild(el('path',{d: pathOf(xs, soc.map(Y)), fill:'none', stroke:'#1565c0','stroke-width':2,'stroke-linejoin':'round','stroke-linecap':'round'}));
    const iN = 16; // initial 08:00 before the live simulation tick
    const dot = el('circle',{cx:X(H[iN]), cy:Y(soc[iN]), r:4.5, fill:'#1565c0', stroke:'var(--col-surface)','stroke-width':2});
    svg.appendChild(dot);
    const nowLine = el('line',{y1:M.t, y2:Hh-M.b, stroke:'#e65100','stroke-width':2,'stroke-dasharray':'4 4', opacity:.9});
    const nowDot = el('circle',{r:5, fill:'#1565c0', stroke:'var(--col-surface)','stroke-width':2});
    const nowText = el('text',{y:M.t+11, 'text-anchor':'middle', class:'axis-t', style:'fill:#e65100; font-size:10px; font-weight:700;'});
    svg.appendChild(nowLine); svg.appendChild(nowDot); svg.appendChild(nowText);
    window.miniGridCharts.markers.soc = { X:X, Y:Y, line:nowLine, dot:nowDot, text:nowText };
    const hit = el('rect',{x:M.l, y:M.t, width:W-M.l-M.r, height:Hh-M.t-M.b, fill:'transparent'});
    svg.appendChild(hit);
    hit.addEventListener('pointermove', e => {
      const r = svg.getBoundingClientRect(), sx = W / r.width;
      const t = Math.min(24, Math.max(0, ((e.clientX-r.left)*sx - M.l) / (W-M.l-M.r) * 24));
      const i = Math.round(t*2);
      showTip('<b>'+hhmm(H[i])+'</b><br>State of charge '+soc[i]+'%', e.clientX, e.clientY);
    });
    hit.addEventListener('pointerleave', hideTip);
    
    const socNow = document.getElementById('socNow');
    const socMeter = document.getElementById('socMeter');
    if (socNow) socNow.textContent = soc[iN] + '%';
    if (socMeter) socMeter.style.width = soc[iN] + '%';
  })();

  window.miniGridCharts.updateMarker = function(snap) {
    const t = Math.max(0, Math.min(24, snap.t));
    const gen = window.miniGridCharts.markers.gen;
    if (gen) {
      const x = gen.X(t);
      gen.line.setAttribute('x1', x); gen.line.setAttribute('x2', x);
      gen.pv.setAttribute('cx', x); gen.pv.setAttribute('cy', gen.Y(snap.pv_kw));
      gen.demand.setAttribute('cx', x); gen.demand.setAttribute('cy', gen.Y(snap.demand));
      gen.text.setAttribute('x', x); gen.text.textContent = snap.label;
    }
    const pccM = window.miniGridCharts.markers.pcc;
    if (pccM) {
      const x = pccM.X(t);
      pccM.line.setAttribute('x1', x); pccM.line.setAttribute('x2', x);
      pccM.dot.setAttribute('cx', x); pccM.dot.setAttribute('cy', pccM.Y(snap.pcc_kw));
      pccM.text.setAttribute('x', x); pccM.text.textContent = snap.pcc_kw >= 0 ? 'export ' + snap.pcc_kw + ' kW' : 'import ' + Math.abs(snap.pcc_kw) + ' kW';
    }
    const socM = window.miniGridCharts.markers.soc;
    if (socM) {
      const x = socM.X(t);
      socM.line.setAttribute('x1', x); socM.line.setAttribute('x2', x);
      socM.dot.setAttribute('cx', x); socM.dot.setAttribute('cy', socM.Y(snap.soc));
      socM.text.setAttribute('x', x); socM.text.textContent = snap.soc + '%';
    }
  };
  updateMiniGridKpis(getSimSnapshot(getSimTimeDecimal()));
  window.miniGridCharts.updateMarker(getSimSnapshot(getSimTimeDecimal()));
})();

// =============================================
// 8. VPP
// =============================================
(function initVPP() {
  setTimeout(function(){
    var c1 = document.getElementById('chart-vpp-forecast');
    var c2 = document.getElementById('chart-vpp-stack');
    var c3 = document.getElementById('chart-vpp-sankey');
    if (!c1 || !c2 || !c3 || typeof echarts === 'undefined') return;

    var hours = Array.from({length: 24}, function(_, i) { return i + ':00'; });
    var simIdx = Math.min(23, Math.max(0, Math.floor(getSimTimeDecimal())));
    var actual = DATA.daily.map(function(v, i){ return i <= simIdx ? +(v * (0.97 + Math.sin((i + 1) * 0.7) * 0.035)).toFixed(2) : null; });
    var forecast = DATA.daily.map(function(v, i) { return +(v * (1.02 + Math.cos((i + 2) * 0.45) * 0.055)).toFixed(2); });
    var upper = forecast.map(function(v) { return +(v * 1.12).toFixed(2); });
    var lower = forecast.map(function(v) { return +(v * 0.88).toFixed(2); });

    window.vppFcChart = echarts.init(c1);
    window.vppFcChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { bottom: 0, textStyle: { fontSize: 11 } },
      grid: { left: '4%', right: '4%', bottom: '14%', top: '8%', containLabel: true },
      xAxis: { type: 'category', data: hours, boundaryGap: false, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', name: 'MW', nameTextStyle: { fontSize: 11 } },
      series: [
        { name: 'Uncertainty Upper', type: 'line', data: upper, lineStyle: { opacity: 0 }, stack: 'band', symbol: 'none', tooltip: { show: false } },
        { name: 'Uncertainty Band', type: 'line', data: lower.map(function(v, i) { return upper[i] - v; }), areaStyle: { color: '#eceff1', opacity: 0.6 }, stack: 'band', lineStyle: { opacity: 0 }, symbol: 'none', tooltip: { show: false } },
        { name: 'Forecast', type: 'line', data: forecast.map(function(v, i){ return i >= simIdx ? v : null; }), smooth: true, lineStyle: { color: '#1565c0', type: 'dashed', width: 2 }, showSymbol: false },
        { name: 'Actual', type: 'line', data: actual, smooth: true, lineStyle: { color: '#e65100', width: 2.5 }, symbol: 'circle', symbolSize: 5, itemStyle: { color: '#e65100' } }
      ]
    });

    window.vppScChart = echarts.init(c2);
    window.vppScChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { bottom: 0, textStyle: { fontSize: 11 } },
      grid: { left: '4%', right: '4%', bottom: '14%', top: '8%', containLabel: true },
      xAxis: { type: 'category', data: hours, axisLabel: { fontSize: 10, interval: 1 } },
      yAxis: { type: 'value', name: 'kW' },
      series: [
        { name: 'PV', type: 'bar', stack: 'gen', barMaxWidth: 12, data: buildHourlySeries(getSimPvKw), itemStyle: { color: '#0ca30c' } },
        { name: 'Battery Discharge', type: 'bar', stack: 'gen', data: buildHourlySeries(function(h){ return Math.max(0, -getSimBatteryKw(h)); }), itemStyle: { color: '#1565c0' } },
        { name: 'Grid Import', type: 'bar', stack: 'gen', data: buildHourlySeries(function(h){ return getSimSnapshot(h).grid_import; }), itemStyle: { color: '#546e7a' } },
        { name: 'Demand', type: 'line', data: buildHourlySeries(getSimDemandKw), smooth: true, lineStyle: { color: '#b91c1c', width: 2 }, showSymbol: false }
      ]
    });

    window.vppSkChart = echarts.init(c3);
    window.vppSkChart.setOption({
      series: [{
        type: 'sankey',
        layout: 'none',
        emphasis: { focus: 'adjacency' },
        nodeAlign: 'left',
        data: [
          { name: 'Grid', itemStyle: { color: '#546e7a' } },
          { name: 'PV Array', itemStyle: { color: '#0ca30c' } },
          { name: 'Battery Discharge', itemStyle: { color: '#1565c0' } },
          { name: 'Battery Charging', itemStyle: { color: '#8e24aa' } },
          { name: 'Aggregator VPP', itemStyle: { color: '#7b1fa2' } },
          { name: 'Local Load', itemStyle: { color: '#b91c1c' } },
          { name: 'Grid Export', itemStyle: { color: '#43a047' } }
        ],
        links: [
          { source: 'PV Array', target: 'Aggregator VPP', value: 185 },
          { source: 'Grid', target: 'Aggregator VPP', value: 0 },
          { source: 'Battery Discharge', target: 'Aggregator VPP', value: 45 },
          { source: 'Aggregator VPP', target: 'Local Load', value: 162 },
          { source: 'Aggregator VPP', target: 'Battery Charging', value: 45 },
          { source: 'Aggregator VPP', target: 'Grid Export', value: 22}
        ],
        label: { color: '#1a2332', fontFamily: 'Inter', fontSize: 12 },
        lineStyle: { color: 'source', opacity: 0.35 }
      }]
    });

    window.addEventListener('resize', function(){ 
      if (window.vppFcChart) window.vppFcChart.resize(); 
      if (window.vppScChart) window.vppScChart.resize(); 
      if (window.vppSkChart) window.vppSkChart.resize(); 
    });
    updateSimAwareCharts();
  }, 200);
})();

// =============================================
// 9. DATA QUALITY
// =============================================
(function initDataQuality() {
  setTimeout(function(){
    var c = document.getElementById('chart-dq-calendar');
    if (!c || typeof echarts==='undefined') return;
    var ch = echarts.init(c);
    var days30 = Array.from({length:30},function(_,i){ return 'Day '+(i+1); });
    var streams = ['SCADA','GIS','AMI','GHI (Solar)','Load Meter'];
    var data = [];
    streams.forEach(function(s,si){
      days30.forEach(function(d,di){
        var gap = Math.random()<0.08?1:0;
        data.push([di,si,gap]);
      });
    });
    ch.setOption({
      grid:{left:'12%',right:'2%',bottom:'20%',top:'8%'},
      tooltip:{formatter:function(p){ return streams[p.data[1]]+' — '+days30[p.data[0]]+(p.data[2]?': <span style="color:#b91c1c">Gap detected</span>':': OK'); }},
      xAxis:{type:'category',data:days30,axisLabel:{fontSize:9,interval:2}},
      yAxis:{type:'category',data:streams,axisLabel:{fontSize:11}},
      visualMap:{min:0,max:1,show:false,inRange:{color:['#e8f5e9','#b71c1c']}},
      series:[{type:'heatmap',data:data,itemStyle:{borderColor:'#fff',borderWidth:1.5}}]
    });
    window.addEventListener('resize', function(){ ch.resize(); });
  }, 200);
})();
// =============================================
// 10. LIVE SIMULATION
// =============================================
(function initSimulation() {
  setInterval(function() {
    // Mini-grid telemetry is driven by updateSimAwareCharts() every second.
    updateMiniGridKpis(getSimSnapshot(getSimTimeDecimal()));

    // Jitter Digital Twin loading and update SVG text & colors
    var planningLiveTx = getPlanningTransformers();
    var txToJitter = planningLiveTx[Math.floor(Math.random() * planningLiveTx.length)];
    var change = Math.round((Math.random() - 0.5) * 6);
    txToJitter.loading = Math.max(20, Math.min(130, txToJitter.loading + change));
    
    // Update status based on loading
    if (txToJitter.loading > 100) {
      txToJitter.status = 'critical';
    } else if (txToJitter.loading > 85) {
      txToJitter.status = 'warning';
    } else {
      txToJitter.status = 'healthy';
    }
    
    // Update SVG elements for this transformer
    var nodeCircle = document.getElementById('circle-' + txToJitter.id);
    if (nodeCircle) {
      nodeCircle.setAttribute('fill', statusColor(txToJitter.status));
      // Trigger temporary pulse ring visual highlight if warning/critical
      var nodeGroup = document.getElementById('node-' + txToJitter.id);
      if (nodeGroup) {
        var existingPulse = nodeGroup.querySelector('.pulse-ring');
        if (existingPulse) existingPulse.remove();
        
        if (txToJitter.status === 'critical' || txToJitter.status === 'warning') {
          var cx = parseFloat(nodeCircle.getAttribute('cx'));
          var cy = parseFloat(nodeCircle.getAttribute('cy'));
          var ns = 'http://www.w3.org/2000/svg';
          var pr = document.createElementNS(ns, 'circle');
          pr.setAttribute('class', 'pulse-ring ' + txToJitter.status);
          pr.setAttribute('cx', cx);
          pr.setAttribute('cy', cy);
          pr.setAttribute('r', 12);
          pr.setAttribute('stroke-width', 2);
          nodeGroup.insertBefore(pr, nodeCircle);
        }
      }
    }
    
    // Update loading % label on Digital Twin (uses id lbl-load-TXID)
    var loadLbl = document.getElementById('lbl-load-' + txToJitter.id);
    if (loadLbl) {
      loadLbl.textContent = txToJitter.loading + '%';
      loadLbl.setAttribute('fill', statusColor(txToJitter.status));
    }

    // If this transformer is currently selected in the details panel, update the details panel
    var activePanelBody = document.getElementById('asset-panel-body');
    if (activePanelBody && activePanelBody.innerHTML.indexOf(txToJitter.id) !== -1) {
      // Re-trigger click selection to update details view
      var ring = document.querySelector('#node-' + txToJitter.id + ' .node-ring');
      if (ring) {
        var event = new Event('click');
        nodeGroup.dispatchEvent(event);
      }
    }

    // Periodically update the Top 5 load table if it's visible
    var tbl = document.getElementById('tbl-load-top');
    if (tbl && document.getElementById('view-load').classList.contains('active')) {
      var top5 = getPlanningTransformers().slice().sort(function(a,b){ return b.loading-a.loading; }).slice(0,5);
      tbl.innerHTML = top5.map(function(t){
        var col = statusColor(t.status);
        return '<tr><td class="tbl-mono">' + t.id + '</td><td>' + t.feeder + '</td><td class="tbl-mono">' + t.rating_kva + '</td><td><div style="display:flex;align-items:center;gap:8px;"><div class="prog-bar" style="width:80px;"><div class="prog-fill" style="width:'+Math.min(t.loading,100)+'%;background:'+col+';"></div></div><span style="font-family:var(--font-mono);font-size:12px;font-weight:600;color:'+col+';">'+t.loading+'%</span></div></td></tr>';
      }).join('');
      renderLoadExtremes();
    }
    if (window.execLoadChart) {
      var liveTxSorted = getPlanningTransformers().slice().sort(function(a,b){ return b.loading - a.loading; }).slice(0, 20);
      window.execLoadChart.setOption({
        yAxis: { data: liveTxSorted.map(function(t){ return t.id; }) },
        series: [{ data: liveTxSorted.map(function(t){ return { value:t.loading, itemStyle:{ color:statusColor(t.status) } }; }) }]
      });
    }
  }, 3000); // Update every 3 seconds
})();
