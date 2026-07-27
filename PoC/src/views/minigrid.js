import { MINIGRID } from '../data/syntheticData.js';

export function initMinigrid() {
  const container = document.getElementById('view-minigrid');
  
  container.innerHTML = `
    <div class="grid-2" style="height: 100%;">
      <div class="card" style="display: flex; flex-direction: column;">
        <div class="card-title">Mini-grid Schematic</div>
        <div style="flex: 1; background: #fff; border: 1px solid var(--col-border); border-radius: 4px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <svg width="400" height="500" viewBox="0 0 400 500">
            <defs>
              <style>
                .mg-line { stroke: #455a64; stroke-width: 3; fill: none; }
                .mg-flow { stroke: var(--col-accent); stroke-width: 3; stroke-dasharray: 8,8; fill: none; animation: flowAnim 1s linear infinite; }
                @keyframes flowAnim { to { stroke-dashoffset: -16; } }
                .mg-box { fill: #fff; stroke: #0d2d4e; stroke-width: 2; rx: 4; }
                .mg-text { font-family: var(--font-ui); font-size: 12px; font-weight: 600; text-anchor: middle; fill: #0d2d4e; }
              </style>
            </defs>
            
            <!-- Grid -->
            <rect class="mg-box" x="150" y="20" width="100" height="40" />
            <text class="mg-text" x="200" y="45">Main Grid</text>
            
            <!-- PCC / Breaker -->
            <line class="mg-line" x1="200" y1="60" x2="200" y2="100" />
            <circle cx="200" cy="100" r="10" fill="#fff" stroke="#0d2d4e" stroke-width="2" />
            <text class="mg-text" x="240" y="105">PCC</text>
            
            <!-- Microgrid Controller -->
            <line class="mg-line" x1="200" y1="110" x2="200" y2="160" />
            <rect class="mg-box" fill="#f0f2f5" x="120" y="160" width="160" height="50" />
            <text class="mg-text" x="200" y="190">Microgrid Controller</text>
            
            <!-- Main Bus -->
            <line class="mg-flow" x1="200" y1="210" x2="200" y2="250" />
            <line class="mg-line" x1="50" y1="250" x2="350" y2="250" stroke-width="6" />
            
            <!-- PV -->
            <line class="mg-flow" x1="80" y1="330" x2="80" y2="250" />
            <rect class="mg-box" x="40" y="330" width="80" height="40" />
            <text class="mg-text" x="80" y="355">PV Array</text>
            
            <!-- Battery -->
            <line class="mg-flow" x1="200" y1="250" x2="200" y2="330" />
            <rect class="mg-box" x="160" y="330" width="80" height="40" />
            <text class="mg-text" x="200" y="355">Battery</text>
            
            <!-- Local Load -->
            <line class="mg-flow" x1="320" y1="250" x2="320" y2="330" />
            <rect class="mg-box" x="280" y="330" width="80" height="40" />
            <text class="mg-text" x="320" y="355">Local Load</text>
          </svg>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="card">
          <div class="card-title">Real-time Metrics</div>
          <div class="grid-2">
            <div>
              <div class="kpi-label">Mode</div>
              <div class="kpi-value" style="font-size: 20px; color: var(--col-healthy); text-transform: capitalize;">${MINIGRID.mode}</div>
            </div>
            <div>
              <div class="kpi-label">Frequency</div>
              <div class="kpi-value" style="font-size: 20px;">${MINIGRID.frequency_hz} Hz</div>
            </div>
            <div>
              <div class="kpi-label">PV Generation</div>
              <div class="kpi-value" style="font-size: 20px; color: #2e7d32;">${MINIGRID.pv_kw} kW</div>
            </div>
            <div>
              <div class="kpi-label">Local Demand</div>
              <div class="kpi-value" style="font-size: 20px; color: #b71c1c;">${MINIGRID.local_demand_kw} kW</div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-title">Battery Status</div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div class="kpi-label">State of Charge (SOC)</div>
            <div style="font-weight: 600;">${MINIGRID.battery_soc_pct}%</div>
          </div>
          <div style="width: 100%; background: var(--col-bg); height: 20px; border-radius: 10px; overflow: hidden; border: 1px solid var(--col-border);">
            <div style="background: ${MINIGRID.battery_soc_pct > 20 ? 'var(--col-healthy)' : 'var(--col-critical)'}; height: 100%; width: ${MINIGRID.battery_soc_pct}%;"></div>
          </div>
          <div style="margin-top: 16px;">
            <div class="kpi-label">Current Power</div>
            <div class="kpi-value" style="font-size: 20px;">${MINIGRID.battery_kw} kW <span style="font-size: 14px; color: var(--col-text-secondary); font-weight: normal;">(Charging)</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
}
