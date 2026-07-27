const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// ==========================================
// 1. UPDATE SIDEBAR NAV & REMOVE ORPHAN LABELS
// ==========================================
// Let's verify sidebar is clean and professional.
html = html.replace('v1.0.0 &mdash; PoC Build', 'v1.0.0 &mdash; Control Room Build');

// ==========================================
// 2. ADD SIMULATION CLOCK TO GLOBAL TOPNAV
// ==========================================
if (!html.includes('id="sim-clock-display"')) {
  html = html.replace(
    '<div class="topnav-clock" id="clock">--:--:--</div>',
    '<div class="topnav-stat" style="font-weight:600;color:var(--col-accent);margin-right:12px;"><span class="dot green"></span>SIM CLOCK: <span id="sim-clock-display" style="font-family:var(--font-mono);">08:00</span></div>\n      <div class="topnav-clock" id="clock">--:--:--</div>'
  );
}

// ==========================================
// 3. DEFINE CLEAN 12 UNIQUE PROJECTS IN DATA
// ==========================================
const projectsStart = html.indexOf('projects: [');
const projectsEnd = html.indexOf('],', projectsStart) + 2;
const cleanProjects = `projects: [
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
  ]`;

if (projectsStart !== -1) {
  html = html.substring(0, projectsStart) + cleanProjects + html.substring(projectsEnd);
}

// ==========================================
// 4. UPDATE INVESTMENT BUDGET SLIDER RANGE
// ==========================================
// Total budget is $410k USD, slider max should be 450000 USD (NGN 616.5m).
html = html.replace(
  'min="0" max="300000" step="5000" value="150000"',
  'min="0" max="450000" step="5000" value="300000"'
);
html = html.replace(
  '<span>NGN 0</span><span>NGN 102.8m</span><span>NGN 205.5m</span><span>NGN 308.3m</span><span>NGN 411.0m</span>',
  '<span>NGN 0</span><span>NGN 154.1m</span><span>NGN 308.3m</span><span>NGN 462.4m</span><span>NGN 616.5m</span>'
);

// ==========================================
// 5. UPDATE INVESTMENT PLANNING TOOLTIPS
// ==========================================
const tableHeadOld = `<thead><tr><th>#</th><th>Project ID</th><th>Intervention</th><th>Constraint</th><th>CAPEX (NGN)</th><th>Annual OPEX</th><th>10-Yr TCO</th><th>Load Red.</th><th>Loss Red.</th><th>Customers</th><th>Priority</th><th>Status</th></tr></thead>`;
const tableHeadNew = `<thead><tr>
              <th>#</th>
              <th>Project ID</th>
              <th>Intervention</th>
              <th>Constraint</th>
              <th>CAPEX (NGN) <span class="metric-help" title="Initial capital expenditure required for asset upgrade">?</span></th>
              <th>Annual OPEX <span class="metric-help" title="Estimated yearly operating &amp; maintenance cost">?</span></th>
              <th>10-Yr TCO <span class="metric-help" title="Total estimated ownership cost over 10 years (CAPEX + OPEX)">?</span></th>
              <th>Load Red. <span class="metric-help" title="Estimated reduction in peak loading percentage">?</span></th>
              <th>Loss Red. <span class="metric-help" title="Estimated reduction in technical losses in kW">?</span></th>
              <th>Customers <span class="metric-help" title="Customers expected to benefit from upgrade">?</span></th>
              <th>Priority <span class="metric-help" title="Overall engineering priority score based on risk index">?</span></th>
              <th>Status</th>
            </tr></thead>`;
html = html.replace(tableHeadOld, tableHeadNew);

fs.writeFileSync('index.html', html);
console.log('Base parameters & structures updated.');
