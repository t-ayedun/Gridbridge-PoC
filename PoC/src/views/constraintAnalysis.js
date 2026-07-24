import { TRANSFORMERS, MV_FEEDERS, PROJECTS } from '../data/syntheticData.js';

export function initConstraintAnalysis() {
  const container = document.getElementById('view-constraint');
  
  const overloaded = TRANSFORMERS.filter(t => t.loading_pct > 100);
  const violations = TRANSFORMERS.filter(t => t.voltage_pu < 0.95 || t.voltage_pu > 1.05);
  
  container.innerHTML = `
    <div class="grid-4" style="margin-bottom: 24px;">
      <div class="card">
        <div class="card-title">Overloaded Transformers</div>
        <div class="kpi-value" style="color: var(--col-critical)">${overloaded.length}</div>
      </div>
      <div class="card">
        <div class="card-title">Voltage Violations</div>
        <div class="kpi-value" style="color: var(--col-warning)">${violations.length}</div>
      </div>
      <div class="card">
        <div class="card-title">Feeder Bottlenecks</div>
        <div class="kpi-value" style="color: var(--col-warning)">1</div>
      </div>
      <div class="card">
        <div class="card-title">Available Capacity</div>
        <div class="kpi-value" style="color: var(--col-healthy)">3.2 MW</div>
      </div>
    </div>
    
    <div class="grid-2">
      <div class="card" style="grid-column: span 2;">
        <div class="card-title">Detected Constraints</div>
        <table class="table">
          <thead>
            <tr><th>Severity</th><th>Asset</th><th>Problem</th><th>Cause</th><th>Recommended Action</th></tr>
          </thead>
          <tbody>
            ${PROJECTS.map(p => {
              const isCrit = p.priority_score > 90;
              const badge = isCrit ? '<span class="badge critical">Critical</span>' : (p.priority_score > 75 ? '<span class="badge warning">High</span>' : '<span class="badge healthy">Medium</span>');
              return `
                <tr>
                  <td>${badge}</td>
                  <td style="font-family: var(--font-mono);">${p.constraint.split(' ')[0]}</td>
                  <td>${p.constraint.substring(p.constraint.indexOf(' ')+1)}</td>
                  <td style="color: var(--col-text-secondary);">Load growth exceeds rating</td>
                  <td style="font-weight: 500; color: var(--col-accent);">${p.intervention}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
