
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
    { id:'INV-01', constraint:'TX-07 overloaded', action:'Upgrade to 800kVA transformer', capex:45000, priority:98, loadRed:42, lossRed:15.5, cust:160 },
    { id:'INV-02', constraint:'TX-03 overloaded', action:'Upgrade to 800kVA transformer', capex:45000, priority:95, loadRed:35, lossRed:12.0, cust:145 },
    { id:'INV-03', constraint:'TX-13 warning',    action:'Upgrade to 800kVA transformer', capex:45000, priority:88, loadRed:28, lossRed:9.0,  cust:130 },
    { id:'INV-04', constraint:'TX-06 overloaded', action:'Upgrade to 500kVA transformer', capex:28000, priority:85, loadRed:25, lossRed:6.8,  cust:120 },
    { id:'INV-05', constraint:'F-01 voltage drop',action:'Install 2MVAr capacitor bank', capex:35000, priority:82, loadRed:5,  lossRed:8.4,  cust:450 },
    { id:'INV-06', constraint:'TX-02 overloaded', action:'Split LV feeder to TX-04',      capex:15000, priority:78, loadRed:20, lossRed:4.2,  cust:45  },
    { id:'INV-07', constraint:'F-01 conductor',   action:'Reconductor 2km AAC→ACSR',      capex:60000, priority:75, loadRed:15, lossRed:14.5, cust:500 },
    { id:'INV-08', constraint:'TX-15 imbalance',  action:'Phase balancing A-B-C',         capex:5000,  priority:65, loadRed:10, lossRed:2.5,  cust:105 }
  ],
  minigrid: { pv_kw:185, soc:68, batt_kw:-45, grid_import:0, grid_export:22, demand:162, mode:'Islanded', freq:50.02, volt_pu:1.01 },
  // 24-hr daily load profile (kW aggregate)
  daily: [8.1,7.2,6.8,6.5,6.8,7.8,9.6,12.4,14.8,15.2,15.6,15.9,15.3,14.8,14.2,14.0,14.6,16.2,17.8,17.1,15.4,13.2,11.0,9.2]
};

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
      if (window.rankingChart) window.rankingChart.resize();
    } else if (viewId === 'view-invest') {
      if (window.investCharts && window.investCharts.wf) window.investCharts.wf.resize();
      if (window.investCharts && window.investCharts.cu) window.investCharts.cu.resize();
    } else if (viewId === 'view-scenario') {
      if (window.scenarioChart) window.scenarioChart.resize();
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
}

// Clock
function tickClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2,'0');
  var m = String(now.getMinutes()).padStart(2,'0');
  var s = String(now.getSeconds()).padStart(2,'0');
  document.getElementById('clock').textContent = h+':'+m+':'+s;
}
setInterval(tickClock, 1000);
tickClock();

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
    var h = document.getElementById('exec-health');
    if (h) animateCounter(h, 87, '%');
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
      xAxis:{ type:'value', axisLabel:{ formatter:function(v){ return '₦'+Math.round(v/1000)+'k'; } } },
      yAxis:{ type:'category', data:sorted.map(function(p){ return p.id; }), axisLabel:{ fontFamily:'IBM Plex Mono', fontSize:11 } },
      series:[{
        type:'bar', barMaxWidth:18,
        data:sorted.map(function(p){ return { value:p.capex, itemStyle:{ color: p.priority>=90?'#b91c1c':p.priority>=80?'#e65100':'#1565c0' } }; }),
        label:{ show:true, position:'right', formatter:function(p){ return '₦'+Math.round(p.value/1000)+'k'; }, fontSize:11 }
      }]
    });

    window.execLoadChart = echarts.init(c2);
    var txSorted = DATA.transformers.slice().sort(function(a,b){ return b.loading - a.loading; });
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

    // Substation
    var subX=450, subY=60;
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
    svg.appendChild(text('11kV — Garki Feeder 1', { x:f1x1, y:f1y-12, 'font-family':'IBM Plex Sans', 'font-size':'10', fill:'#455a64', 'font-weight':'600' }));
    svg.appendChild(text('11kV — Wuse Feeder 2',  { x:f2x1, y:f2y-12, 'font-family':'IBM Plex Sans', 'font-size':'10', fill:'#455a64', 'font-weight':'600' }));

    // Place transformers
    var f1tx = DATA.transformers.filter(function(t){ return t.feeder==='F-01'; });
    var f2tx = DATA.transformers.filter(function(t){ return t.feeder==='F-02'; });

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
        // Main circle
        g.appendChild(el('circle',{ class:'node-circle', cx:x, cy:nodeY, r:12, fill:col, stroke:'#fff', 'stroke-width':'2', id:'circle-'+tx.id }));
        // Selection ring
        g.appendChild(el('circle',{ class:'node-ring', cx:x, cy:nodeY, r:16, 'stroke-width':2.5 }));
        // Label
        g.appendChild(text(tx.id, { class:'net-label', x:x, y:nodeY+(yDir>0?30:(-20)), fill:'#455a64', 'font-size':'8.5', 'text-anchor':'middle', 'font-family':'IBM Plex Mono' }));
        // Loading label
        g.appendChild(text(tx.loading+'%', { x:x, y:nodeY+(yDir>0?40:-30), 'font-size':'8', 'text-anchor':'middle', fill:col, 'font-weight':'600', 'font-family':'IBM Plex Mono' }));

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
        row('Feeders', '2 (F-01, F-02)'),
        row('Customers', '1,085'),
        row('Status', 'Energised'),
      ].join('');
    } else {
      var tx = DATA.transformers.find(function(t){ return t.id===id; });
      if (!tx) return;
      var loadColor = tx.loading>100?'var(--col-critical)':tx.loading>85?'var(--col-warning)':'var(--col-healthy)';
      var voltColor = tx.volt_pu<0.95?'var(--col-warning)':'inherit';
      panelBody.innerHTML = [
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--col-border);">',
          '<div><div style="font-family:var(--font-hd);font-size:15px;font-weight:700;">'+tx.id+'</div>',
          '<div style="font-size:12px;color:var(--col-text-2);">'+tx.feeder+' — Distribution Transformer</div></div>',
          statusBadge(tx.status),
        '</div>',
        row('Rating', tx.rating_kva+' kVA'),
        '<div class="asset-row"><span class="asset-row-lbl">Loading</span><span class="asset-row-val" style="color:'+loadColor+'">'+tx.loading+'%</span></div>',
        '<div class="asset-row"><span class="asset-row-lbl">Voltage (p.u.)</span><span class="asset-row-val" style="color:'+voltColor+'">'+tx.volt_pu+'</span></div>',
        row('Customers', tx.cust),
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
var loadChart, heatmapChart, rankingChart;
(function initLoad() {
  setTimeout(function(){
    var c1 = document.getElementById('chart-load-profile');
    var c2 = document.getElementById('chart-heatmap');
    var c3 = document.getElementById('chart-load-ranking');
    if (!c1 || !c2 || !c3 || typeof echarts==='undefined') return;

    window.loadChart = echarts.init(c1);
    window.heatmapChart = echarts.init(c2);
    window.rankingChart = echarts.init(c3);

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
      tooltip:{ formatter:function(p){ return p.data[0]+':00 '+days[p.data[1]]+' — '+p.data[2]+' MW'; } },
      xAxis:{ type:'category', data:Array.from({length:24},function(_,i){ return i+':00'; }), axisLabel:{fontSize:10, interval:1} },
      yAxis:{ type:'category', data:days, axisLabel:{fontSize:11} },
      visualMap:{ min:5, max:20, calculable:false, show:false, inRange:{ color:['#e8f5e9','#fffde7','#fff3e0','#fce4ec','#b71c1c'] } },
      series:[{ type:'heatmap', data:heatData, itemStyle:{borderColor:'#fff',borderWidth:1} }]
    });

    // Ranking chart
    var sorted = DATA.transformers.slice().sort(function(a,b){ return a.loading-b.loading; });
    rankingChart.setOption({
      grid:{ left:'2%', right:'6%', bottom:'4%', top:'8%', containLabel:true },
      tooltip:{ trigger:'axis', axisPointer:{type:'shadow'} },
      xAxis:{ type:'value', max:130, axisLabel:{ formatter:'{value}%' } },
      yAxis:{ type:'category', data:sorted.map(function(t){ return t.id; }), axisLabel:{ fontFamily:'IBM Plex Mono', fontSize:11 } },
      series:[{
        type:'bar', barMaxWidth:14,
        data:sorted.map(function(t){ return { value:t.loading, itemStyle:{ color:statusColor(t.status) } }; }),
        label:{ show:true, position:'right', formatter:'{c}%', fontSize:10 },
        markLine:{ silent:true, symbol:'none', lineStyle:{color:'#b91c1c',type:'dashed',width:2}, data:[{xAxis:100, label:{formatter:'Rating Limit'}}] }
      }]
    });

    // Top 5 table
    var top5 = DATA.transformers.slice().sort(function(a,b){ return b.loading-a.loading; }).slice(0,5);
    var tbody = document.getElementById('tbl-load-top');
    if (tbody) tbody.innerHTML = top5.map(function(t){
      var col = statusColor(t.status);
      return '<tr><td class="tbl-mono">'+t.id+'</td><td>'+t.feeder+'</td><td class="tbl-mono">'+t.rating_kva+'</td><td><div style="display:flex;align-items:center;gap:8px;"><div class="prog-bar" style="width:80px;"><div class="prog-fill" style="width:'+Math.min(t.loading,100)+'%;background:'+col+';"></div></div><span style="font-family:var(--font-mono);font-size:12px;font-weight:600;color:'+col+';">'+t.loading+'%</span></div></td></tr>';
    }).join('');

    window.addEventListener('resize', function(){ if(window.loadChart) window.loadChart.resize(); if(window.heatmapChart) window.heatmapChart.resize(); if(window.rankingChart) window.rankingChart.resize(); });
  }, 200);
})();

function switchProfile(mode, btn) {
  document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  renderProfile(mode);
}

function renderProfile(mode) {
  if (!window.loadChart) return;
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
  
  // Set current time mark for daily view (e.g. 14:00)
  var markLine = mode === 'daily' ? {
    symbol: 'none',
    label: { show: true, position: 'middle', formatter: 'Current Time (14:00)' },
    lineStyle: { color: '#e65100', type: 'dashed', width: 2 },
    data: [{ xIndex: 14 }]
  } : undefined;

  window.loadChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    grid: { left: '4%', right: '2%', bottom: '14%', top: '8%', containLabel: true },
    xAxis: { type: 'category', data: o.xData, boundaryGap: mode !== 'daily' && mode !== 'monthly', axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', name: 'MW', nameTextStyle: { fontSize: 11 } },
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
    var constraints = [
      { sev:'critical', asset:'TX-07', problem:'Loading at 112% of rating', cause:'Load growth exceeds nameplate capacity', action:'Upgrade to 800kVA transformer' },
      { sev:'critical', asset:'TX-03', problem:'Loading at 105% of rating', cause:'Load growth — installed 2004, end of life', action:'Upgrade to 800kVA transformer' },
      { sev:'warning',  asset:'TX-06', problem:'Loading at 92% — near limit', cause:'Residential densification on LV network', action:'Upgrade to 500kVA or split feeder' },
      { sev:'warning',  asset:'TX-13', problem:'Loading at 95% — near limit', cause:'New commercial connections', action:'Upgrade to 800kVA transformer' },
      { sev:'warning',  asset:'TX-02', problem:'Loading at 88% — near limit', cause:'High unbalanced loading on Phase A', action:'Phase balancing, consider feeder split' },
      { sev:'warning',  asset:'F-01',  problem:'Voltage 0.89pu at TX-07 busbar', cause:'Long feeder + high loading = high impedance drop', action:'Install 2MVAr capacitor bank at midpoint' },
      { sev:'warning',  asset:'TX-15', problem:'Voltage 0.94pu — below 0.95 limit', cause:'End-of-feeder location, high loading', action:'LV cable uprating or capacitor' },
    ];
    tbody.innerHTML = constraints.map(function(c, i){
      return '<tr><td>'+statusBadge(c.sev)+'</td><td class="tbl-mono">'+c.asset+'</td><td>'+c.problem+'</td><td style="color:var(--col-text-2);font-size:12px;">'+c.cause+'</td><td style="color:var(--col-accent);font-weight:500;">'+c.action+'</td><td><span style="font-family:var(--font-num);font-weight:700;">'+(98-i*4)+'</span></td></tr>';
    }).join('');

    
    // Constraint map segment hover tooltips
    document.querySelectorAll('#feederMap .seg').forEach(function(s) {
      s.addEventListener('pointermove', function(e) {
        showTip('<b>' + s.dataset.n + '</b><br>' + s.dataset.v, e.clientX, e.clientY);
      });
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
      tooltip:{ trigger:'axis', formatter:function(p){ return p[0].name+'<br>Cumulative CAPEX: ₦'+Math.round(p[0].value/1000)+'k<br>Cumulative Loss Reduction: '+p[1].value+' kW'; } },
      legend:{ bottom:0, textStyle:{fontSize:11} },
      grid:{ left:'10%', right:'10%', bottom:'20%', top:'12%', containLabel:true },
      xAxis:{ type:'category', data:sorted.map(function(p){ return p.id; }), axisLabel:{fontSize:11} },
      yAxis:[
        { type:'value', name:'Cum. CAPEX (₦)', axisLabel:{ formatter:function(v){ return '₦'+Math.round(v/1000)+'k'; }, fontSize:10 } },
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
  document.getElementById('budget-display').textContent = '₦'+val.toLocaleString();
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
    return '<tr style="'+rowStyle+'"><td>'+(i+1)+'</td><td class="tbl-mono">'+p.id+'</td><td style="font-weight:500;">'+p.action+'</td><td style="color:var(--col-text-2);font-size:12px;">'+p.constraint+'</td><td class="tbl-mono">₦'+p.capex.toLocaleString()+'</td><td class="tbl-mono">'+p.loadRed+'%</td><td class="tbl-mono">'+p.lossRed+' kW</td><td class="tbl-mono">'+p.cust+'</td><td><span style="font-family:var(--font-num);font-weight:700;">'+p.priority+'</span></td><td>'+status+'</td></tr>';
  });
  var tbody = document.getElementById('tbl-invest');
  if (tbody) tbody.innerHTML = rows.join('');
  var ic = document.getElementById('budget-included-count');
  var icc = document.getElementById('budget-included-cost');
  if (ic) ic.textContent = includedCount + ' of '+sorted.length+' projects included';
  if (icc) icc.textContent = '₦'+includedCost.toLocaleString()+' committed';
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
    return '<tr style="'+rowStyle+'"><td>'+(i+1)+'</td><td class="tbl-mono">'+p.id+'</td><td style="font-weight:500;">'+p.action+'</td><td style="color:var(--col-text-2);font-size:12px;">'+p.constraint+'</td><td class="tbl-mono">₦'+p.capex.toLocaleString()+'</td><td class="tbl-mono">'+p.loadRed+'%</td><td class="tbl-mono">'+p.lossRed+' kW</td><td class="tbl-mono">'+p.cust+'</td><td><span style="font-family:var(--font-num);font-weight:700;">'+p.priority+'</span></td><td>'+status+'</td></tr>';
  }).join('');
  var tbody = document.getElementById('tbl-invest');
  if (tbody) tbody.innerHTML = rows;
  var ic = document.getElementById('budget-included-count');
  var icc = document.getElementById('budget-included-cost');
  if (ic) ic.textContent = includedCount + ' of '+sorted.length+' projects included';
  if (icc) icc.textContent = '₦'+includedCost.toLocaleString()+' committed';
};
renderInvestTable(150000);

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
  var base = { load:12.5, violations:3, losses:4.2, overloaded:2, capacity:3.2 };
  var sim = {
    load: +(base.load*(1+g) - base.load*d*0.6 + nc*0.008).toFixed(2),
    violations: Math.max(0, Math.round(base.violations + g*25 - d*8)),
    losses: +(base.losses*(1+g*0.5)).toFixed(2),
    overloaded: Math.min(15, Math.round(base.overloaded + g*8 - d*2)),
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
  scenarioChart.setOption({
    tooltip:{ trigger:'axis', axisPointer:{type:'shadow'} },
    legend:{ bottom:0, textStyle:{fontSize:11} },
    grid:{ left:'2%', right:'4%', bottom:'12%', top:'10%', containLabel:true },
    xAxis:{ type:'category', data:DATA.transformers.map(function(t){ return t.id; }), axisLabel:{fontSize:10, rotate:35, fontFamily:'IBM Plex Mono'} },
    yAxis:{ type:'value', name:'Loading %', axisLabel:{formatter:'{value}%'} },
    series:[
      { name:'Baseline', type:'bar', barGap:0, barMaxWidth:18, data:DATA.transformers.map(function(t){ return t.loading; }), itemStyle:{color:'rgba(84,110,122,0.5)'} },
      { name:'Simulated', type:'bar', barMaxWidth:18, data:DATA.transformers.map(function(t){ return Math.min(Math.round(t.loading*factor),150); }), itemStyle:{color:'rgba(21,101,192,0.75)'} }
    ]
  });
}
renderScenario();

// =============================================
// 7. MINI-GRID SCHEMATIC
// =============================================
(function initMinigrid() {
  const H = [...Array(49)].map((_,i)=> i/2); // 0..24
  const pv = H.map(t => {
    if (t < 6 || t > 18.5) return 0;
    const x = (t - 12.25) / 6.25;
    let v = Math.max(0, 720 * Math.cos(x * Math.PI / 2));
    if (t >= 13 && t <= 14.5) v *= 0.55;            // cloud passage
    return Math.round(v);
  });
  const demand = H.map(t => {
    let v = 190 + 60*Math.exp(-Math.pow((t-9)/2.4,2)) + 250*Math.exp(-Math.pow((t-19.7)/2.2,2));
    return Math.round(v);
  });
  const island = t => t >= 19 && t <= 20.5;
  const batt = H.map((t,i) => {
    if (island(t)) return -(demand[i] - pv[i]);      // battery serves islanded load
    const surplus = pv[i] - demand[i];
    if (surplus > 120) return Math.min(300, surplus - 60);
    if (t >= 17.5 && t < 23 && !island(t)) return -140;
    return 0;
  });
  const pcc = H.map((t,i) => island(t) ? 0 : Math.round(pv[i] - demand[i] - batt[i]));
  const soc = []; let s = 38;
  H.forEach((t,i) => { s += batt[i] * 0.5 / 1200 * 100; s = Math.min(96, Math.max(30, s)); soc.push(Math.round(s)); });

  const NS = 'http://www.w3.org/2000/svg';
  const el = (n,a) => { const e = document.createElementNS(NS,n); for (const k in a) e.setAttribute(k,a[k]); return e; };
  const hhmm = t => String(Math.floor(t)).padStart(2,'0') + ':' + (t%1 ? '30' : '00');

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
    const iN = 28; // 14:00
    const dot = el('circle',{cx:X(H[iN]), cy:Y(soc[iN]), r:4.5, fill:'#1565c0', stroke:'var(--col-surface)','stroke-width':2});
    svg.appendChild(dot);
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
    var actual = DATA.daily.slice(0, 17); // up to 17:00
    var forecast = DATA.daily.map(function(v) { return +(v * (0.92 + Math.random() * 0.16)).toFixed(2); });
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
        { name: 'Forecast', type: 'line', data: forecast, smooth: true, lineStyle: { color: '#1565c0', type: 'dashed', width: 2 }, showSymbol: false },
        { name: 'Actual', type: 'line', data: actual.concat(new Array(7).fill(null)), smooth: true, lineStyle: { color: '#e65100', width: 2.5 }, symbol: 'circle', symbolSize: 5, itemStyle: { color: '#e65100' } }
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
        { name: 'PV', type: 'bar', stack: 'gen', barMaxWidth: 12, data: hours.map(function(_, i) { return i > 5 && i < 20 ? Math.round(DATA.daily[i] * 12 * (Math.sin((i - 6) * Math.PI / 14) + 0.05)) : 0; }), itemStyle: { color: '#0ca30c' } },
        { name: 'Battery Discharge', type: 'bar', stack: 'gen', data: hours.map(function(_, i) { return i > 18 || i < 6 ? 25 : 0; }), itemStyle: { color: '#1565c0' } },
        { name: 'Grid Import', type: 'bar', stack: 'gen', data: hours.map(function(_, i) { return i > 6 && i < 20 ? 0 : 15; }), itemStyle: { color: '#546e7a' } },
        { name: 'Demand', type: 'line', data: DATA.daily.map(function(v) { return Math.round(v * 9); }), smooth: true, lineStyle: { color: '#b91c1c', width: 2 }, showSymbol: false }
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
          { name: 'Battery', itemStyle: { color: '#1565c0' } },
          { name: 'Aggregator VPP', itemStyle: { color: '#7b1fa2' } },
          { name: 'Local Load', itemStyle: { color: '#b91c1c' } },
          { name: 'Grid Export', itemStyle: { color: '#43a047' } }
        ],
        links: [
          { source: 'PV Array', target: 'Aggregator VPP', value: 185 },
          { source: 'Grid', target: 'Aggregator VPP', value: 0 },
          { source: 'Battery', target: 'Aggregator VPP', value: 45 },
          { source: 'Aggregator VPP', target: 'Local Load', value: 162 },
          { source: 'Aggregator VPP', target: 'Battery', value: 45 },
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
    // Jitter Mini-grid values
    var fJitter = (Math.random() - 0.5) * 0.04;
    var pvJitter = (Math.random() - 0.5) * 5;
    var demJitter = (Math.random() - 0.5) * 3;
    
    DATA.minigrid.freq = +(50 + fJitter).toFixed(2);
    DATA.minigrid.pv_kw = Math.max(0, +(185 + pvJitter).toFixed(1));
    DATA.minigrid.demand = Math.max(0, +(162 + demJitter).toFixed(1));
    
    var elFreq = document.getElementById('mg-freq');
    var elPV = document.getElementById('mg-pv');
    var elDem = document.getElementById('mg-demand');
    
    if (elFreq) elFreq.textContent = DATA.minigrid.freq + ' Hz';
    if (elPV) elPV.textContent = DATA.minigrid.pv_kw + ' kW';
    if (elDem) elDem.textContent = DATA.minigrid.demand + ' kW';
    
    // Jitter Digital Twin loading and update SVG text & colors
    var txToJitter = DATA.transformers[Math.floor(Math.random() * DATA.transformers.length)];
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
    
    // Update loading text value inside Digital Twin SVG if it's there
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
      var top5 = DATA.transformers.slice().sort(function(a,b){ return b.loading-a.loading; }).slice(0,5);
      tbl.innerHTML = top5.map(function(t){
        var col = statusColor(t.status);
        return '<tr><td class="tbl-mono">' + t.id + '</td><td>' + t.feeder + '</td><td class="tbl-mono">' + t.rating_kva + '</td><td><div style="display:flex;align-items:center;gap:8px;"><div class="prog-bar" style="width:80px;"><div class="prog-fill" style="width:'+Math.min(t.loading,100)+'%;background:'+col+';"></div></div><span style="font-family:var(--font-mono);font-size:12px;font-weight:600;color:'+col+';">'+t.loading+'%</span></div></td></tr>';
      }).join('');
    }
  }, 3000); // Update every 3 seconds
})();
