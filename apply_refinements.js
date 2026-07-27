const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ======================================================================
// 1. REPLACE DIGITAL TWIN buildSVG — REMOVE GIS, CLEAN ELECTRICAL ONE-LINE
// ======================================================================
const gisAndBusSection = `    svg.innerHTML = '';
    applyTwinViewBox();

    // GIS Background Layer (Terrain, Parcels, River, Roads, Grid)
    var gisG = el('g', { id: 'gis-layer' });

    // Grid lines & coordinates
    for(var gx = 50; gx < 900; gx += 150) {
      gisG.appendChild(el('line', { x1: gx, y1: 0, x2: gx, y2: 680, stroke: '#e2e8f0', 'stroke-width': '0.7', 'stroke-dasharray': '2 4' }));
      gisG.appendChild(text('E 7°29\\"' + Math.round(10 + gx/15) + '"', { x: gx + 4, y: 15, fill: '#94a3b8', 'font-size': '7.5', 'font-family': 'IBM Plex Mono' }));
    }
    for(var gy = 50; gy < 680; gy += 130) {
      gisG.appendChild(el('line', { x1: 0, y1: gy, x2: 900, y2: gy, stroke: '#e2e8f0', 'stroke-width': '0.7', 'stroke-dasharray': '2 4' }));
      gisG.appendChild(text('N 9°03\\"' + Math.round(10 + gy/12) + '"', { x: 10, y: gy - 4, fill: '#94a3b8', 'font-size': '7.5', 'font-family': 'IBM Plex Mono' }));
    }

    // Land Parcels & Sector Boundaries
    gisG.appendChild(el('polygon', { points: '40,110 380,110 410,290 40,290', fill: '#f8fafc', stroke: '#cbd5e1', 'stroke-width': '1', 'stroke-dasharray': '4 3' }));
    gisG.appendChild(text('GARKI CENTRAL RESIDENTIAL SECTOR 1', { x: 50, y: 125, fill: '#94a3b8', 'font-size': '8', 'font-weight': '700', 'letter-spacing': '0.5' }));

    gisG.appendChild(el('polygon', { points: '440,110 860,110 860,290 470,290', fill: '#f1f5f9', stroke: '#cbd5e1', 'stroke-width': '1', 'stroke-dasharray': '4 3' }));
    gisG.appendChild(text('KARU COMMERCIAL & MARKET SPUR', { x: 450, y: 125, fill: '#94a3b8', 'font-size': '8', 'font-weight': '700', 'letter-spacing': '0.5' }));

    gisG.appendChild(el('polygon', { points: '40,330 860,330 860,560 40,560', fill: '#f8fafc', stroke: '#e2e8f0', 'stroke-width': '1' }));
    gisG.appendChild(text('F-02 WUSE & DER INTEGRATION CORRIDOR', { x: 50, y: 345, fill: '#94a3b8', 'font-size': '8', 'font-weight': '700', 'letter-spacing': '0.5' }));

    // River Tributary
    gisG.appendChild(el('path', { d: 'M 20 620 C 220 640, 380 580, 520 630 T 880 610', fill: 'none', stroke: '#d0e1f9', 'stroke-width': '14', 'stroke-linecap': 'round', opacity: '0.85' }));
    gisG.appendChild(text('Garki River Tributary', { x: 700, y: 605, fill: '#7096d1', 'font-size': '8', 'font-style': 'italic' }));

    // Utility Roads
    gisG.appendChild(el('path', { d: 'M 450 20 L 450 670', fill: 'none', stroke: '#e2e8f0', 'stroke-width': '10' }));
    gisG.appendChild(el('path', { d: 'M 450 20 L 450 670', fill: 'none', stroke: '#ffffff', 'stroke-width': '6' }));

    gisG.appendChild(el('path', { d: 'M 30 180 L 870 180', fill: 'none', stroke: '#e2e8f0', 'stroke-width': '8' }));

    svg.appendChild(gisG);

    // Substation
    var subX=450, subY=60;`;

const cleanBusSection = `    svg.innerHTML = '';
    applyTwinViewBox();

    // Clean engineering background — subtle grid only
    for(var gi=100; gi<900; gi+=100) {
      svg.appendChild(el('line',{ x1:gi, y1:0, x2:gi, y2:680, stroke:'#f0f4f8', 'stroke-width':0.5 }));
    }
    for(var gj=80; gj<680; gj+=80) {
      svg.appendChild(el('line',{ x1:0, y1:gj, x2:900, y2:gj, stroke:'#f0f4f8', 'stroke-width':0.5 }));
    }

    // Substation
    var subX=450, subY=55;`;

if (html.includes(gisAndBusSection)) {
  html = html.replace(gisAndBusSection, cleanBusSection);
  console.log('GIS layer removed.');
} else {
  console.log('WARNING: GIS section not matched exactly — trying alternative approach');
  // Try to find and replace just the gis-layer block
  const gisStart = html.indexOf("// GIS Background Layer");
  const gisEnd = html.indexOf("    svg.appendChild(gisG);") + "    svg.appendChild(gisG);".length;
  if (gisStart > -1 && gisEnd > gisStart) {
    html = html.substring(0, gisStart) + "    // Background grid\n" + html.substring(gisEnd);
    console.log('GIS layer removed via range.');
  }
}

// ======================================================================
// 2. CLEAN FEEDER LABELS
// ======================================================================
html = html.replace(
  "svg.appendChild(text('11kV - F-01 Garki planning feeder: top 15 risk assets shown from 86 injected TX records'",
  "svg.appendChild(text('Feeder F-01  —  11 kV'"
);
html = html.replace(
  "svg.appendChild(text('11kV - F-02 mini-grid / DER integration intertie'",
  "svg.appendChild(text('Feeder F-02  —  11 kV  (DER)'"
);

// ======================================================================
// 3. IMPROVE TRANSFORMER NODES — replace circles with engineering symbols
//    Add loading % label under transformer id
// ======================================================================
const oldPlaceTx = `        // Main circle
        g.appendChild(el('circle',{ class:'node-circle', cx:x, cy:nodeY, r:12, fill:col, stroke:'#fff', 'stroke-width':'2', id:'circle-'+tx.id }));
        // Selection ring
        g.appendChild(el('circle',{ class:'node-ring', cx:x, cy:nodeY, r:16, 'stroke-width':2.5 }));
        // Label
        g.appendChild(text(tx.id, { class:'net-label', x:x, y:nodeY+(yDir>0?30:(-20)), fill:'#455a64', 'font-size':'8.5', 'text-anchor':'middle', 'font-family':'IBM Plex Mono' }));`;

const newPlaceTx = `        // TX Symbol: two overlapping circles (transformer winding symbol)
        g.appendChild(el('circle',{ class:'node-circle', cx:x-5, cy:nodeY, r:8, fill:col, stroke:'#fff', 'stroke-width':'1.5', id:'circle-'+tx.id }));
        g.appendChild(el('circle',{ cx:x+5, cy:nodeY, r:8, fill:col, stroke:'#fff', 'stroke-width':'1.5', opacity:'0.85' }));
        // Selection ring
        g.appendChild(el('circle',{ class:'node-ring', cx:x, cy:nodeY, r:18, 'stroke-width':2.5 }));
        // TX ID label
        g.appendChild(text(tx.id, { class:'net-label', x:x, y:nodeY+(yDir>0?26:(-16)), fill:'#2d3748', 'font-size':'8', 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-weight':'600' }));
        // Loading % label
        g.appendChild(text(tx.loading+'%', { class:'net-label', id:'lbl-load-'+tx.id, x:x, y:nodeY+(yDir>0?37:(-27)), fill:col, 'font-size':'7.5', 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-weight':'700' }));`;

if (html.includes(oldPlaceTx)) {
  html = html.replace(oldPlaceTx, newPlaceTx);
  console.log('Transformer symbols improved.');
} else {
  console.log('WARNING: Transformer node section not found');
}

// ======================================================================
// 4. CLEAN MINI-GRID SECTION — relabels & more meaningful live values
// ======================================================================
html = html.replace("svg.appendChild(text('F-02 local AC bus',", "svg.appendChild(text('Local AC Bus',");
html = html.replace("svg.appendChild(text('PV inverter',", "svg.appendChild(text('PV',");
html = html.replace("svg.appendChild(text('Battery PCS',", "svg.appendChild(text('Battery',");
html = html.replace("svg.appendChild(text('Local load',", "svg.appendChild(text('Load',");

// ======================================================================
// 5. REPLACE CONSTRAINT VIEW — remove wordy context note, simplify cards
// ======================================================================
const oldConstraintNote = `<div class="context-note">
          This one-line schematic turns model output into an operational diagnostic. Segment colour shows thermal loading, triangle markers show voltage violations, and the panel explains the selected constraint.
        </div>`;
const newConstraintNote = '';
html = html.replace(oldConstraintNote, newConstraintNote);

const oldConstraintHowTo = `<div style="font-size:12px;color:var(--col-text-2);line-height:1.45;">
          <strong>How to read this:</strong> red sections are thermal constraints; triangle markers are voltage constraints. Outage history is optional context, not the core analysis.
        </div>`;
const newConstraintHowTo = `<div style="font-size:11.5px;color:var(--col-text-3);">
          <span style="display:inline-flex;align-items:center;gap:4px;margin-right:12px;"><span style="width:12px;height:5px;background:#b91c1c;border-radius:2px;display:inline-block;"></span>Overloaded</span>
          <span style="display:inline-flex;align-items:center;gap:4px;margin-right:12px;"><span style="width:12px;height:5px;background:#e65100;border-radius:2px;display:inline-block;"></span>Warning</span>
          <span style="display:inline-flex;align-items:center;gap:4px;"><svg width="12" height="11" viewBox="0 0 12 11"><path d="M6 1L11 10H1Z" fill="none" stroke="#b91c1c" stroke-width="1.5"/></svg>Voltage violation</span>
        </div>`;
html = html.replace(oldConstraintHowTo, newConstraintHowTo);

// Rename constraint register header 
html = html.replace(
  'Constraint Register - top 12 from F-01 operating data',
  'Active Constraints — Feeder F-01'
);

// ======================================================================
// 6. CONSTRAINT DETAIL default text
// ======================================================================
html = html.replace(
  'Select a coloured feeder segment to see loading, voltage context, and recommended intervention.',
  'Click a segment on the feeder diagram.'
);

// ======================================================================
// 7. MINI-GRID PAGE — add simulation time header
// ======================================================================
const mgContextNote = `    <div class="view" id="view-minigrid">
      <div class="context-note">
        Current snapshot values are shown at the top. The charts below show the simulated 24-hour operating envelope for the same F-02 mini-grid: generation and demand, import/export at the PCC, and battery state of charge.
      </div>`;
const mgWithSimTime = `    <div class="view" id="view-minigrid">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <div>
          <div style="font-family:var(--font-hd);font-size:13px;font-weight:700;color:var(--col-text-1);">F-02 Mini-grid — Live Control View</div>
          <div style="font-size:12px;color:var(--col-text-3);margin-top:2px;">Simulation running · values update every 3 seconds</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px;font-weight:600;color:var(--col-text-3);text-transform:uppercase;letter-spacing:0.5px;">Simulation Time</div>
          <div style="font-family:var(--font-mono);font-size:28px;font-weight:700;color:var(--col-primary);line-height:1;" id="mg-sim-time">08:00</div>
        </div>
      </div>`;
html = html.replace(mgContextNote, mgWithSimTime);

// ======================================================================
// 8. SIMULATION CLOCK ENGINE — replace existing tickClock and simulation
// ======================================================================
const oldClock = `// Clock
function tickClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2,'0');
  var m = String(now.getMinutes()).padStart(2,'0');
  var s = String(now.getSeconds()).padStart(2,'0');
  document.getElementById('clock').textContent = h+':'+m+':'+s;
}
setInterval(tickClock, 1000);
tickClock();`;

const newClock = `// Real-time wall clock
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

function getSimHours() { return (simMinutes / 60) % 24; }
function getSimHH() { return String(Math.floor(getSimHours())).padStart(2,'0'); }
function getSimMM() { return String(Math.floor(simMinutes % 60)).padStart(2,'0'); }
function getSimTimeStr() { return getSimHH() + ':' + getSimMM(); }
function getSimTimeDecimal() { return getSimHours(); } // 0-24

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
  var t = getSimTimeDecimal(); // 0–24
  var idx = Math.min(23, Math.max(0, Math.round(t))); // 0-based hour index

  // ---- VPP Forecast chart: actual up to now, forecast beyond ----
  if (window.vppFcChart) {
    var actual24 = DATA.daily.map(function(v){ return +(v * (0.94 + Math.sin(v)*0.04)).toFixed(2); });
    var forecast24 = DATA.daily.map(function(v){ return +(v * (0.90 + Math.random()*0.18)).toFixed(2); });
    // Actual: show up to current sim hour, null beyond
    var actualSeries = actual24.map(function(v, i){ return i <= idx ? v : null; });
    // Forecast: null up to current sim hour, show beyond
    var forecastSeries = forecast24.map(function(v, i){ return i >= idx ? v : null; });
    // Uncertainty band for forecast portion only
    var upperBand = forecast24.map(function(v, i){ return i >= idx ? +(v*1.10).toFixed(2) : null; });
    var lowerBand = forecast24.map(function(v, i){ return i >= idx ? +(v*0.90).toFixed(2) : null; });

    window.vppFcChart.setOption({
      series: [
        { name:'Uncertainty Upper', data: upperBand },
        { name:'Uncertainty Band', data: upperBand.map(function(v,i){ return v !== null ? upperBand[i]-lowerBand[i] : null; }) },
        { name:'Forecast', data: forecastSeries },
        { name:'Actual', data: actualSeries }
      ]
    });
  }

  // ---- Mini-grid: update SOC meter label ----
  var socEl = document.getElementById('socNow');
  var meterEl = document.getElementById('socMeter');
  if (socEl && meterEl) {
    var soc = Math.round(38 + Math.sin(t * 0.4) * 25 + Math.max(0, Math.sin((t-12)*0.3)*15));
    soc = Math.max(30, Math.min(96, soc));
    socEl.textContent = soc + '%';
    meterEl.style.width = soc + '%';
    DATA.minigrid.soc = soc;
  }

  // ---- Update PV output based on sim time ----
  if (t >= 6 && t <= 18.5) {
    var x = (t - 12.25) / 6.25;
    var pvPow = Math.max(0, Math.round(720 * Math.cos(x * Math.PI / 2)));
    if (t >= 13 && t <= 14.5) pvPow = Math.round(pvPow * 0.55);
    DATA.minigrid.pv_kw = pvPow;
  } else {
    DATA.minigrid.pv_kw = 0;
  }
}
`;

if (html.includes(oldClock)) {
  html = html.replace(oldClock, newClock);
  console.log('Simulation clock engine added.');
} else {
  console.log('WARNING: Clock section not found exactly');
}

// ======================================================================
// 9. UPDATE SIMULATION LOOP — add loading % label update in Digital Twin
// ======================================================================
const oldSimLoadLabel = `    // Update loading text value inside Digital Twin SVG if it's there
    // The loading percentage text is the second text child in the node group
    var nodeGroup = document.getElementById('node-' + txToJitter.id);
    if (nodeGroup) {
      var texts = nodeGroup.querySelectorAll('text');
      texts.forEach(function(t) {
        if (t.textContent.indexOf('%') !== -1) {
          t.textContent = txToJitter.loading + '%';
          t.setAttribute('fill', statusColor(txToJitter.status));
        }
      });
    }`;
const newSimLoadLabel = `    // Update loading % label on Digital Twin (uses id lbl-load-TXID)
    var loadLbl = document.getElementById('lbl-load-' + txToJitter.id);
    if (loadLbl) {
      loadLbl.textContent = txToJitter.loading + '%';
      loadLbl.setAttribute('fill', statusColor(txToJitter.status));
    }`;

if (html.includes(oldSimLoadLabel)) {
  html = html.replace(oldSimLoadLabel, newSimLoadLabel);
  console.log('Digital Twin live label update fixed.');
}

// ======================================================================
// 10. ADD CHART CSS VARS FOR SEQ COLORS (if missing)
// ======================================================================
if (!html.includes('--seq-100:')) {
  html = html.replace(':root {', ':root {\n  --seq-100: #e3f2fd;\n  --seq-250: #90caf9;\n  --seq-450: #f97316;\n  --seq-650: #b91c1c;\n  --surface-1: #fff;\n  --axis: #dde1e7;\n  --critical: #b91c1c;\n  --ink-1: #111c2b;\n  --ink-2: #4a5568;');
  console.log('CSS sequence vars added.');
} else {
  // Update seq-450 and seq-650 to correct engineering colors
  html = html.replace('--seq-450: #42a5f5;', '--seq-450: #f97316;');
  html = html.replace('--seq-650: #1e88e5;', '--seq-650: #b91c1c;');
}

// ======================================================================
// 11. EXEC DASHBOARD — simplify sub-text
// ======================================================================
html = html.replace(
  "if (hs) hs.textContent = normal + ' of ' + planningTx.length + ' F-01 transformers outside critical state';",
  "if (hs) hs.textContent = normal + ' of ' + planningTx.length + ' transformers operating normally';"
);
html = html.replace(
  "if (cs) cs.textContent = constraints.length + ' active constraints detected from injected operating data';",
  "if (cs) cs.textContent = critical.length + ' require urgent intervention';"
);

// ======================================================================
// 12. CONSTRAINT DETAIL TEXT for seg clicks — simplify to bullet points
// ======================================================================
const oldExplain = `      var detail = document.getElementById('constraint-detail');
      if (detail) {
        detail.innerHTML = '<div style="font-family:var(--font-hd);font-weight:700;color:var(--col-text-1);margin-bottom:8px;">'+name+'</div>'
          + '<div style="margin-bottom:8px;">'+value+'</div>'
          + '<div><strong>Recommended action:</strong> '+action+'</div>';
      }`;
const newExplain = `      var detail = document.getElementById('constraint-detail');
      if (detail) {
        detail.innerHTML = '<div style="font-family:var(--font-mono);font-weight:700;color:var(--col-text-1);font-size:13px;margin-bottom:10px;">'+name+'</div>'
          + '<div style="font-size:12px;color:var(--col-critical);font-weight:600;margin-bottom:6px;">⬡ '+value+'</div>'
          + '<div style="font-size:12px;color:var(--col-accent);font-weight:600;">↳ '+action+'</div>';
      }`;
if (html.includes(oldExplain)) {
  html = html.replace(oldExplain, newExplain);
  console.log('Constraint detail text simplified.');
}

fs.writeFileSync('index.html', html);
console.log('\nAll refinements applied successfully.');
