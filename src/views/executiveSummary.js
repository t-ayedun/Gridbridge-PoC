import { TRANSFORMERS, PROJECTS, DATA_QUALITY } from '../data/syntheticData.js';

export function initExecutiveSummary() {
  const container = document.getElementById('view-executive');
  
  // Calculate some aggregate metrics
  const totalTransformers = TRANSFORMERS.length;
  const criticalCount = TRANSFORMERS.filter(t => t.status === 'critical').length;
  const totalCapex = PROJECTS.reduce((sum, p) => sum + p.capex_usd, 0);
  const maxLoaded = TRANSFORMERS.reduce((max, t) => t.loading_pct > max.loading_pct ? t : max, TRANSFORMERS[0]);
  
  container.innerHTML = `
    <div class="grid-4" style="margin-bottom: 24px;">
      <div class="card">
        <div class="card-title">Network Health</div>
        <div class="kpi-value">${Math.round((totalTransformers - criticalCount) / totalTransformers * 100)}%</div>
        <div class="kpi-label">Assets operating normally</div>
      </div>
      <div class="card">
        <div class="card-title">Top Risks</div>
        <div class="kpi-value" style="color: var(--col-critical)">${criticalCount}</div>
        <div class="kpi-label">Critically overloaded transformers</div>
      </div>
      <div class="card">
        <div class="card-title">Highest Loaded Asset</div>
        <div class="kpi-value" style="color: var(--col-critical)">${maxLoaded.loading_pct}%</div>
        <div class="kpi-label">${maxLoaded.id} on ${maxLoaded.feeder}</div>
      </div>
      <div class="card">
        <div class="card-title">Data Readiness</div>
        <div class="kpi-value" style="color: var(--col-healthy)">${DATA_QUALITY.score}%</div>
        <div class="kpi-label">Suitable for planning</div>
      </div>
    </div>
    
    <div class="grid-2">
      <div class="card" style="height: 400px;">
        <div class="card-title">Investment Required (CAPEX)</div>
        <div class="kpi-value">$${(totalCapex / 1000).toFixed(0)}k</div>
        <div class="kpi-label">To resolve all current constraints</div>
        <div id="chart-exec-capex" style="width: 100%; height: 300px; margin-top: 16px;"></div>
      </div>
      <div class="card" style="height: 400px;">
        <div class="card-title">Expected Benefits</div>
        <div class="kpi-value">${PROJECTS.reduce((s, p) => s + p.customers_benefited, 0)}</div>
        <div class="kpi-label">Customers with improved reliability</div>
        <div id="chart-exec-benefits" style="width: 100%; height: 300px; margin-top: 16px;"></div>
      </div>
    </div>
  `;

  // Render Charts
  setTimeout(() => {
    const capexChart = echarts.init(document.getElementById('chart-exec-capex'));
    capexChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: PROJECTS.map(p => p.id), axisLabel: { interval: 0, rotate: 45 } },
      yAxis: { type: 'value', name: 'USD ($)' },
      series: [{
        data: PROJECTS.map(p => p.capex_usd),
        type: 'bar',
        itemStyle: { color: '#0d2d4e' }
      }],
      grid: { left: '15%', right: '5%', bottom: '25%', top: '15%' }
    });

    const benefitsChart = echarts.init(document.getElementById('chart-exec-benefits'));
    benefitsChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'value', name: 'Loss Reduction (kW)' },
      yAxis: { type: 'category', data: PROJECTS.map(p => p.id) },
      series: [{
        data: PROJECTS.map(p => p.loss_reduction_kw),
        type: 'bar',
        itemStyle: { color: '#2e7d32' }
      }],
      grid: { left: '20%', right: '15%', bottom: '15%', top: '10%' }
    });
    
    // Register resize
    window.addEventListener('resize', () => {
      capexChart.resize();
      benefitsChart.resize();
    });
  }, 100);
}
