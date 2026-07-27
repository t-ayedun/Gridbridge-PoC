import { TRANSFORMERS, LOAD_PROFILES } from '../data/syntheticData.js';

export function initLoadAnalysis() {
  const container = document.getElementById('view-load');
  
  container.innerHTML = `
    <div class="card" style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div class="card-title" style="margin: 0;">Aggregate Load Profile</div>
        <div style="display: flex; gap: 8px;">
          <button class="badge" style="border: 1px solid var(--col-border); background: var(--col-surface); cursor: pointer; color: var(--col-primary);">Daily</button>
          <button class="badge" style="border: 1px solid var(--col-border); background: var(--col-bg); cursor: pointer;">Weekly</button>
          <button class="badge" style="border: 1px solid var(--col-border); background: var(--col-bg); cursor: pointer;">Monthly</button>
        </div>
      </div>
      <div id="chart-load-profile" style="width: 100%; height: 350px;"></div>
    </div>
    
    <div class="grid-2">
      <div class="card">
        <div class="card-title">Top 5 Highest Loaded Transformers</div>
        <table class="table">
          <thead>
            <tr><th>Asset ID</th><th>Feeder</th><th>Loading</th></tr>
          </thead>
          <tbody>
            ${[...TRANSFORMERS].sort((a,b) => b.loading_pct - a.loading_pct).slice(0,5).map(t => `
              <tr>
                <td style="font-family: var(--font-mono);">${t.id}</td>
                <td>${t.feeder}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; background: var(--col-bg); height: 6px; border-radius: 3px; overflow: hidden;">
                      <div style="background: ${t.loading_pct > 100 ? 'var(--col-critical)' : 'var(--col-warning)'}; height: 100%; width: ${Math.min(t.loading_pct, 100)}%;"></div>
                    </div>
                    <span style="font-weight: 600; width: 40px; text-align: right;">${t.loading_pct}%</span>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="card-title">Load Heatmap (Hour vs Day)</div>
        <div id="chart-heatmap" style="width: 100%; height: 250px;"></div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const profileChart = echarts.init(document.getElementById('chart-load-profile'));
    profileChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: Array.from({length: 24}, (_,i) => \`\${i}:00\`) },
      yAxis: { type: 'value', name: 'Load (MW)' },
      series: [{
        data: LOAD_PROFILES.daily,
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.1 },
        itemStyle: { color: '#1565c0' },
        showSymbol: false
      }],
      grid: { left: '5%', right: '2%', bottom: '10%', top: '15%' }
    });
    
    const heatmapChart = echarts.init(document.getElementById('chart-heatmap'));
    // Generate some fake heatmap data
    const hours = Array.from({length: 24}, (_,i) => i);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [];
    for(let i=0; i<7; i++) {
      for(let j=0; j<24; j++) {
        const val = LOAD_PROFILES.daily[j] * (0.8 + Math.random() * 0.4);
        data.push([j, i, val]);
      }
    }
    
    heatmapChart.setOption({
      tooltip: { position: 'top' },
      grid: { left: '15%', right: '5%', bottom: '15%', top: '5%' },
      xAxis: { type: 'category', data: hours },
      yAxis: { type: 'category', data: days },
      visualMap: {
        min: 5, max: 25,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        inRange: { color: ['#e8f5e9', '#fff3e0', '#ffebee', '#b71c1c'] },
        show: false
      },
      series: [{
        type: 'heatmap',
        data: data,
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
      }]
    });

    window.addEventListener('resize', () => {
      profileChart.resize();
      heatmapChart.resize();
    });
  }, 100);
}
