import { DATA_QUALITY } from '../data/syntheticData.js';

export function initDataQuality() {
  const container = document.getElementById('view-data');
  
  container.innerHTML = `
    <div style="display: flex; gap: 24px; margin-bottom: 24px;">
      <div style="flex: 2;">
        <div class="grid-3" style="gap: 16px;">
          <div class="card">
            <div class="card-title">Completeness</div>
            <div class="kpi-value">${DATA_QUALITY.completeness}%</div>
          </div>
          <div class="card">
            <div class="card-title">Missing Assets</div>
            <div class="kpi-value" style="color: var(--col-warning)">${DATA_QUALITY.missing_assets}</div>
          </div>
          <div class="card">
            <div class="card-title">Topology Errors</div>
            <div class="kpi-value" style="color: var(--col-critical)">${DATA_QUALITY.topology_errors}</div>
          </div>
          <div class="card">
            <div class="card-title">Duplicate Assets</div>
            <div class="kpi-value" style="color: var(--col-warning)">${DATA_QUALITY.duplicate_assets}</div>
          </div>
          <div class="card">
            <div class="card-title">Unknown Connections</div>
            <div class="kpi-value" style="color: var(--col-warning)">${DATA_QUALITY.unknown_connections}</div>
          </div>
          <div class="card">
            <div class="card-title">Records Received (24h)</div>
            <div class="kpi-value" style="color: var(--col-primary)">284,510</div>
          </div>
        </div>
      </div>
      
      <div class="card" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div class="card-title" style="align-self: flex-start; width: 100%;">Data Readiness Score</div>
        <div style="position: relative; width: 200px; height: 120px; display: flex; align-items: flex-end; justify-content: center; margin-top: 20px;">
          <svg viewBox="0 0 100 50" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--col-bg)" stroke-width="12" stroke-linecap="round" />
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--col-healthy)" stroke-width="12" stroke-linecap="round" stroke-dasharray="125.6" stroke-dashoffset="${125.6 * (1 - DATA_QUALITY.score/100)}" style="transition: stroke-dashoffset 1s ease-out;" />
          </svg>
          <div style="font-family: var(--font-metric); font-size: 42px; font-weight: 600; color: var(--col-primary); line-height: 1;">${DATA_QUALITY.score}%</div>
        </div>
        <div class="badge healthy" style="margin-top: 16px; font-size: 13px; padding: 6px 12px;">Ready for Planning</div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">Active Data Quality Issues</div>
      <table class="table">
        <thead>
          <tr><th>Severity</th><th>Asset Class</th><th>Issue Description</th><th>Impact</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="badge critical">Critical</span></td>
            <td>Substation</td>
            <td>Missing incoming 33kV connection to Garki SUB-01</td>
            <td>Cannot perform load flow analysis upstream</td>
            <td><span class="badge warning">Investigating</span></td>
          </tr>
          <tr>
            <td><span class="badge warning">Warning</span></td>
            <td>Transformer</td>
            <td>Missing rating capacity (kVA) for TX-04</td>
            <td>Loading % cannot be calculated</td>
            <td><span class="badge warning">Investigating</span></td>
          </tr>
          <tr>
            <td><span class="badge warning">Warning</span></td>
            <td>Customer</td>
            <td>Orphaned customer cluster (Coordinates out of bounds)</td>
            <td>Network demand underestimated by ~45kW</td>
            <td><span class="badge healthy">Resolved (Pending Sync)</span></td>
          </tr>
          <tr>
            <td><span class="badge critical">Critical</span></td>
            <td>Feeder</td>
            <td>Circular dependency detected on F-02 laterals</td>
            <td>Topology processor failed to build tree</td>
            <td><span class="badge warning">Investigating</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}
