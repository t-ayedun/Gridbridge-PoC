export function initScenarioSimulation() {
  const container = document.getElementById('view-scenario');
  
  const state = {
    loadGrowth: 10, // %
    derPenetration: 5, // %
    newCustomers: 50
  };

  function render() {
    // Base metrics
    const baseLoad = 12.5; // MW
    const baseViolations = 3;
    const baseLosses = 4.2; // %
    
    // Simulated metrics
    const simLoad = baseLoad * (1 + state.loadGrowth/100) - (baseLoad * state.derPenetration/100);
    const simViolations = state.loadGrowth > 15 ? 8 : (state.loadGrowth > 5 ? 5 : baseViolations);
    const simLosses = baseLosses * (1 + state.loadGrowth/200);

    container.innerHTML = `
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-title">Simulation Parameters</div>
        <div class="grid-3">
          <div>
            <label style="font-size: 12px; color: var(--col-text-secondary); display: block; margin-bottom: 8px;">Load Growth (${state.loadGrowth}%)</label>
            <input type="range" id="sim-growth" min="0" max="30" step="1" value="${state.loadGrowth}" style="width: 100%;">
          </div>
          <div>
            <label style="font-size: 12px; color: var(--col-text-secondary); display: block; margin-bottom: 8px;">DER Penetration (${state.derPenetration}%)</label>
            <input type="range" id="sim-der" min="0" max="25" step="1" value="${state.derPenetration}" style="width: 100%;">
          </div>
          <div>
            <label style="font-size: 12px; color: var(--col-text-secondary); display: block; margin-bottom: 8px;">New Customers (${state.newCustomers})</label>
            <input type="range" id="sim-cust" min="0" max="500" step="10" value="${state.newCustomers}" style="width: 100%;">
          </div>
        </div>
      </div>
      
      <div class="grid-2">
        <!-- Before -->
        <div class="card">
          <div class="card-title" style="border-bottom: 1px solid var(--col-border); padding-bottom: 12px; margin-bottom: 16px;">Current State (Before)</div>
          
          <div style="margin-bottom: 16px;">
            <div class="kpi-label">Peak Network Loading</div>
            <div class="kpi-value">${baseLoad.toFixed(2)} MW</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div class="kpi-label">Voltage Violations</div>
            <div class="kpi-value">${baseViolations}</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div class="kpi-label">Technical Losses</div>
            <div class="kpi-value">${baseLosses.toFixed(2)}%</div>
          </div>
        </div>
        
        <!-- After -->
        <div class="card" style="background: var(--col-surface-raised);">
          <div class="card-title" style="border-bottom: 1px solid var(--col-border); padding-bottom: 12px; margin-bottom: 16px;">Simulated State (After)</div>
          
          <div style="margin-bottom: 16px;">
            <div class="kpi-label">Peak Network Loading</div>
            <div class="kpi-value" style="color: ${simLoad > baseLoad ? 'var(--col-warning)' : 'var(--col-healthy)'}">${simLoad.toFixed(2)} MW</div>
            <div style="font-size: 12px; color: var(--col-text-secondary);">${simLoad > baseLoad ? '▲' : '▼'} ${Math.abs(simLoad - baseLoad).toFixed(2)} MW from base</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div class="kpi-label">Voltage Violations</div>
            <div class="kpi-value" style="color: ${simViolations > baseViolations ? 'var(--col-critical)' : 'inherit'}">${simViolations}</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div class="kpi-label">Technical Losses</div>
            <div class="kpi-value" style="color: ${simLosses > baseLosses ? 'var(--col-warning)' : 'inherit'}">${simLosses.toFixed(2)}%</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('sim-growth').addEventListener('input', (e) => { state.loadGrowth = parseInt(e.target.value); render(); });
    document.getElementById('sim-der').addEventListener('input', (e) => { state.derPenetration = parseInt(e.target.value); render(); });
    document.getElementById('sim-cust').addEventListener('input', (e) => { state.newCustomers = parseInt(e.target.value); render(); });
  }

  render();
}
