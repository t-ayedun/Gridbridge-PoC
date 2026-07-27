import { MINIGRID, LOAD_PROFILES } from '../data/syntheticData.js';

export function initVPP() {
  const container = document.getElementById('view-vpp');
  
  container.innerHTML = `
    <div class="card" style="margin-bottom: 24px;">
      <div class="card-title">Forecast vs Actual Demand (24h)</div>
      <div id="chart-vpp-forecast" style="width: 100%; height: 350px;"></div>
    </div>
    
    <div class="grid-2">
      <div class="card">
        <div class="card-title">Aggregated Resource Summary</div>
        <div id="chart-vpp-resources" style="width: 100%; height: 250px;"></div>
      </div>
      <div class="card">
        <div class="card-title">Flexibility Margins</div>
        <table class="table" style="margin-top: 20px;">
          <tbody>
            <tr>
              <td><div class="status-dot" style="background: var(--col-healthy);"></div> Available Upward Flexibility</td>
              <td style="text-align: right; font-weight: 600;">145 kW</td>
            </tr>
            <tr>
              <td><div class="status-dot" style="background: var(--col-warning);"></div> Available Downward Flexibility</td>
              <td style="text-align: right; font-weight: 600;">32 kW</td>
            </tr>
            <tr>
              <td><div class="status-dot" style="background: var(--col-accent);"></div> Current Operating Margin</td>
              <td style="text-align: right; font-weight: 600;">18%</td>
            </tr>
            <tr>
              <td><div class="status-dot" style="background: #90a4ae;"></div> Minimum Required Reserve</td>
              <td style="text-align: right; font-weight: 600;">10%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    // Forecast chart
    const forecastChart = echarts.init(document.getElementById('chart-vpp-forecast'));
    
    // Generate actual and forecast data
    const actual = LOAD_PROFILES.daily;
    const forecast = actual.map(v => v * (1 + (Math.random() - 0.5) * 0.1));
    const upperBand = forecast.map(v => v * 1.15);
    const lowerBand = forecast.map(v => v * 0.85);
    const hours = Array.from({length: 24}, (_,i) => \`\${i}:00\`);

    forecastChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['Actual Demand', 'Forecast Demand', 'Uncertainty Band'], bottom: 0 },
      xAxis: { type: 'category', data: hours, boundaryGap: false },
      yAxis: { type: 'value', name: 'MW' },
      series: [
        {
          name: 'Uncertainty Band',
          type: 'line',
          data: upperBand,
          lineStyle: { opacity: 0 },
          stack: 'confidence-band',
          symbol: 'none'
        },
        {
          name: 'Uncertainty Band',
          type: 'line',
          data: lowerBand,
          lineStyle: { opacity: 0 },
          areaStyle: { color: '#eceff1', opacity: 0.5 },
          stack: 'confidence-band',
          symbol: 'none'
        },
        {
          name: 'Forecast Demand',
          type: 'line',
          data: forecast,
          lineStyle: { type: 'dashed', color: '#1a4a72' },
          symbol: 'none'
        },
        {
          name: 'Actual Demand',
          type: 'line',
          data: actual.slice(0, 16), // Only show up to current hour (synthetic 16:00)
          lineStyle: { color: '#e65100', width: 3 },
          symbol: 'circle'
        }
      ],
      grid: { left: '5%', right: '5%', bottom: '15%', top: '10%' }
    });

    // Resources stacked bar
    const resourceChart = echarts.init(document.getElementById('chart-vpp-resources'));
    resourceChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { bottom: 0 },
      grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: ['Current Snapshot'] },
      series: [
        { name: 'PV Generation', type: 'bar', stack: 'total', itemStyle: { color: '#2e7d32' }, data: [MINIGRID.pv_kw] },
        { name: 'Battery Discharging', type: 'bar', stack: 'total', itemStyle: { color: '#1565c0' }, data: [MINIGRID.battery_kw > 0 ? MINIGRID.battery_kw : 0] },
        { name: 'Grid Import', type: 'bar', stack: 'total', itemStyle: { color: '#455a64' }, data: [MINIGRID.grid_import_kw] },
        { name: 'Local Demand', type: 'bar', stack: 'demand', itemStyle: { color: '#b71c1c' }, data: [-MINIGRID.local_demand_kw] },
        { name: 'Battery Charging', type: 'bar', stack: 'demand', itemStyle: { color: '#8e24aa' }, data: [MINIGRID.battery_kw < 0 ? MINIGRID.battery_kw : 0] }
      ]
    });

    window.addEventListener('resize', () => {
      forecastChart.resize();
      resourceChart.resize();
    });
  }, 100);
}
