// Core modules
import { initExecutiveSummary } from './views/executiveSummary.js';
import { initDigitalTwin } from './views/digitalTwin.js';
import { initLoadAnalysis } from './views/loadAnalysis.js';
import { initConstraintAnalysis } from './views/constraintAnalysis.js';
import { initInvestmentPlanning } from './views/investmentPlanning.js';
import { initScenarioSimulation } from './views/scenarioSimulation.js';
import { initMinigrid } from './views/minigrid.js';
import { initVPP } from './views/vpp.js';
import { initDataQuality } from './views/dataQuality.js';

// Application State
const state = {
  activeView: 'view-executive'
};

// Router Logic
function setupRouter() {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view-content');
  const titleEl = document.getElementById('workspace-title');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Update nav state
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Update title
      titleEl.textContent = item.textContent.trim();

      // Update view state
      const targetId = item.getAttribute('data-target');
      views.forEach(view => {
        if (view.id === targetId) {
          view.classList.add('active');
          // Trigger resize for ECharts when a view becomes active
          window.dispatchEvent(new Event('resize'));
        } else {
          view.classList.remove('active');
        }
      });
      
      state.activeView = targetId;
    });
  });
}

// System Clock
function startClock() {
  const clockEl = document.getElementById('sys-clock');
  setInterval(() => {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-GB'); // 24-hour format
  }, 1000);
}

// Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  setupRouter();
  startClock();

  // Initialize Views
  initExecutiveSummary();
  initDigitalTwin();
  initLoadAnalysis();
  initConstraintAnalysis();
  initInvestmentPlanning();
  initScenarioSimulation();
  initMinigrid();
  initVPP();
  initDataQuality();
  
  // Handle Window Resize for all ECharts instances
  window.addEventListener('resize', () => {
    // ECharts instances will hook into this or we can manage globally
  });
});
