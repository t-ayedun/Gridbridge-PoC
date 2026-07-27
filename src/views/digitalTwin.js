import { SUBSTATIONS, MV_FEEDERS, TRANSFORMERS } from '../data/syntheticData.js';

export function initDigitalTwin() {
  const container = document.getElementById('view-digital-twin');
  
  container.innerHTML = `
    <div class="layout-split">
      <div class="card split-main" style="position: relative; overflow: hidden; display: flex; flex-direction: column;">
        <div class="card-title">Distribution Network Topology</div>
        <div id="svg-container" style="flex: 1; background: #fff; border: 1px solid var(--col-border); border-radius: 4px; overflow: hidden; position: relative;">
          <svg id="network-svg" width="100%" height="100%" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
            <defs>
              <style>
                .link { stroke: #b0bec5; stroke-width: 2; fill: none; }
                .link.animated { stroke-dasharray: 5,5; animation: dash 20s linear infinite; }
                @keyframes dash { to { stroke-dashoffset: -1000; } }
                .node { cursor: pointer; transition: all 0.2s; }
                .node:hover circle { filter: brightness(0.9); }
                .node.selected circle { stroke: var(--col-accent); stroke-width: 3; }
                .text-label { font-family: var(--font-mono); font-size: 10px; fill: var(--col-text-secondary); pointer-events: none; }
              </style>
            </defs>
            <g id="network-layer"></g>
          </svg>
        </div>
      </div>
      <div class="card split-side" style="display: flex; flex-direction: column;">
        <div class="card-title">Asset Details</div>
        <div id="asset-panel" style="flex: 1; overflow-y: auto;">
          <div style="color: var(--col-text-tertiary); text-align: center; margin-top: 40px;">Select an asset to view details</div>
        </div>
      </div>
    </div>
  `;

  renderNetwork();
}

function renderNetwork() {
  const svg = document.getElementById('network-layer');
  if (!svg) return;
  
  let html = '';
  const subX = 500;
  const subY = 100;

  // Substation
  html += `
    <rect class="node" data-id="${SUBSTATIONS[0].id}" x="${subX - 40}" y="${subY - 30}" width="80" height="60" fill="#0d2d4e" rx="4"></rect>
    <text class="text-label" x="${subX}" y="${subY - 40}" text-anchor="middle">${SUBSTATIONS[0].name}</text>
  `;

  // Draw feeders (horizontal buses)
  const f1Y = 300;
  const f2Y = 600;
  
  html += `<line class="link animated" x1="${subX}" y1="${subY+30}" x2="${subX}" y2="${f1Y}" />`;
  html += `<line class="link animated" x1="${subX}" y1="${f1Y}" x2="${subX}" y2="${f2Y}" />`;
  
  html += `<line class="link" x1="100" y1="${f1Y}" x2="900" y2="${f1Y}" stroke-width="4" stroke="#455a64" />`;
  html += `<text class="text-label" x="100" y="${f1Y - 10}">${MV_FEEDERS[0].name}</text>`;
  
  html += `<line class="link" x1="100" y1="${f2Y}" x2="900" y2="${f2Y}" stroke-width="4" stroke="#455a64" />`;
  html += `<text class="text-label" x="100" y="${f2Y - 10}">${MV_FEEDERS[1].name}</text>`;

  // Transformers
  const t1 = TRANSFORMERS.filter(t => t.feeder === 'F-01');
  const t2 = TRANSFORMERS.filter(t => t.feeder === 'F-02');
  
  const drawTx = (tx, index, total, yBase) => {
    const spacing = 800 / (total + 1);
    const x = 100 + spacing * (index + 1);
    const y = yBase + 50;
    
    let color = 'var(--col-healthy)';
    if (tx.status === 'warning') color = 'var(--col-warning)';
    if (tx.status === 'critical') color = 'var(--col-critical)';
    
    html += `<line class="link" x1="${x}" y1="${yBase}" x2="${x}" y2="${y}" />`;
    html += `<circle class="node tx-node" data-id="${tx.id}" cx="${x}" cy="${y}" r="12" fill="${color}" stroke="#fff" stroke-width="2"></circle>`;
    html += `<text class="text-label" x="${x}" y="${y + 25}" text-anchor="middle">${tx.id}</text>`;
    
    // Draw LV dummy branch
    html += `<line class="link" x1="${x}" y1="${y+12}" x2="${x-20}" y2="${y+40}" />`;
    html += `<line class="link" x1="${x}" y1="${y+12}" x2="${x+20}" y2="${y+40}" />`;
    html += `<circle cx="${x-20}" cy="${y+40}" r="3" fill="#90a4ae" />`;
    html += `<circle cx="${x+20}" cy="${y+40}" r="3" fill="#90a4ae" />`;
  };

  t1.forEach((t, i) => drawTx(t, i, t1.length, f1Y));
  t2.forEach((t, i) => drawTx(t, i, t2.length, f2Y));

  svg.innerHTML = html;

  // Add click listeners
  setTimeout(() => {
    document.querySelectorAll('.tx-node').forEach(node => {
      node.addEventListener('click', (e) => {
        document.querySelectorAll('.node').forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');
        
        const id = node.getAttribute('data-id');
        const tx = TRANSFORMERS.find(t => t.id === id);
        if (tx) showAssetDetails(tx);
      });
    });
  }, 100);
}

function showAssetDetails(tx) {
  const panel = document.getElementById('asset-panel');
  let statusBadge = `<span class="badge healthy">Healthy</span>`;
  if (tx.status === 'warning') statusBadge = `<span class="badge warning">Warning</span>`;
  if (tx.status === 'critical') statusBadge = `<span class="badge critical">Critical</span>`;
  
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--col-border); padding-bottom: 10px;">
      <h3 style="font-family: var(--font-headers);">${tx.id}</h3>
      ${statusBadge}
    </div>
    
    <table class="table" style="margin-bottom: 20px;">
      <tbody>
        <tr><td><strong>Feeder</strong></td><td>${tx.feeder}</td></tr>
        <tr><td><strong>Rating</strong></td><td>${tx.rating_kva} kVA</td></tr>
        <tr><td><strong>Loading</strong></td><td><span style="font-weight: 600; color: ${tx.loading_pct > 100 ? 'var(--col-critical)' : 'inherit'}">${tx.loading_pct}%</span></td></tr>
        <tr><td><strong>Voltage (p.u)</strong></td><td><span style="font-weight: 600; color: ${tx.voltage_pu < 0.95 ? 'var(--col-warning)' : 'inherit'}">${tx.voltage_pu}</span></td></tr>
        <tr><td><strong>Customers</strong></td><td>${tx.customers}</td></tr>
        <tr><td><strong>Tech Losses</strong></td><td>${tx.losses_kw} kW</td></tr>
        <tr><td><strong>Installed</strong></td><td>${tx.installation_year}</td></tr>
      </tbody>
    </table>
    
    <div class="card-title">Health Score</div>
    <div style="background: var(--col-bg); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
      <div style="background: ${tx.health_score > 80 ? 'var(--col-healthy)' : tx.health_score > 60 ? 'var(--col-warning)' : 'var(--col-critical)'}; height: 100%; width: ${tx.health_score}%;"></div>
    </div>
    <div style="text-align: right; font-size: 12px; color: var(--col-text-secondary); margin-bottom: 24px;">${tx.health_score} / 100</div>
    
    <button style="width: 100%; padding: 10px; background: var(--col-surface); border: 1px solid var(--col-border); border-radius: 4px; cursor: pointer; font-family: var(--font-ui); font-weight: 500;">View load profile</button>
  `;
}
