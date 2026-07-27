import { PROJECTS } from '../data/syntheticData.js';

export function initInvestmentPlanning() {
  const container = document.getElementById('view-investment');
  
  // Create mutable state
  const state = {
    budget: 150000
  };

  function render() {
    // Sort projects by priority score
    const sorted = [...PROJECTS].sort((a,b) => b.priority_score - a.priority_score);
    
    let cumCost = 0;
    const items = sorted.map(p => {
      cumCost += p.capex_usd;
      const included = cumCost <= state.budget;
      return { ...p, included, cumulativeCost: cumCost };
    });
    
    container.innerHTML = `
      <div class="card" style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div class="card-title" style="margin: 0;">Capital Allocation Budget</div>
          <div class="kpi-value" style="font-size: 24px;">$${(state.budget / 1000).toFixed(0)}k</div>
        </div>
        <input type="range" id="budget-slider" min="0" max="300000" step="5000" value="${state.budget}" style="width: 100%; margin-bottom: 12px; cursor: pointer;">
        <div style="display: flex; justify-content: space-between; color: var(--col-text-secondary); font-size: 12px;">
          <span>$0</span>
          <span>$150k</span>
          <span>$300k</span>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title">Investment Projects Ranking</div>
        <table class="table">
          <thead>
            <tr><th>Rank</th><th>Project ID</th><th>Intervention</th><th>CAPEX</th><th>Priority Score</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${items.map((p, i) => `
              <tr style="opacity: ${p.included ? '1' : '0.5'}; background-color: ${p.included ? 'transparent' : 'var(--col-surface-raised)'}">
                <td>${i + 1}</td>
                <td style="font-family: var(--font-mono);">${p.id}</td>
                <td><strong>${p.intervention}</strong><br><span style="font-size: 11px; color: var(--col-text-secondary);">Resolves: ${p.constraint}</span></td>
                <td style="font-family: var(--font-mono);">$${p.capex_usd.toLocaleString()}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 60px; background: var(--col-bg); height: 6px; border-radius: 3px; overflow: hidden;">
                      <div style="background: var(--col-primary); height: 100%; width: ${p.priority_score}%;"></div>
                    </div>
                    <span style="font-weight: 600;">${p.priority_score}</span>
                  </div>
                </td>
                <td>
                  ${p.included ? '<span class="badge healthy">Included</span>' : '<span class="badge deferred">Deferred</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Rebind listener
    document.getElementById('budget-slider').addEventListener('input', (e) => {
      state.budget = parseInt(e.target.value);
      render();
    });
  }
  
  render();
}
