// ============================================================
// KSP Crime Intelligence Platform — Dashboard Module
// ============================================================

function initDashboard() {
  renderKPIs();
  renderCrimeTrendChart();
  renderDistrictBarChart();
  renderCrimeCompositionDonut();
  renderYoYChart();
  renderTimeOfDayChart();
  renderTopDistrictsTable();
}

/* ── KPI Cards ─────────────────────────────────────────── */
function renderKPIs() {
  const kpis = KSP_DATA.kpis;
  const pct = ((kpis.totalCrimes2024 - kpis.totalCrimes2023) / kpis.totalCrimes2023 * 100).toFixed(1);
  const items = [
    { label:"Total Crimes (2024)", value: kpis.totalCrimes2024.toLocaleString(), icon:"🔴", change:`+${pct}% vs 2023`, dir:"up",   color:"#ef4444" },
    { label:"Arrests Made",        value: kpis.totalArrests2024.toLocaleString(), icon:"👮", change:`71.6% resolution`, dir:"flat", color:"#10b981" },
    { label:"Conviction Rate",     value: `${kpis.convictionRate}%`, icon:"⚖️", change:`Steady`,          dir:"flat", color:"#3b82f6" },
    { label:"Cybercrime Surge",    value: `+${kpis.cybercrimeSurge}%`, icon:"💻", change:`YoY Growth`,    dir:"up",   color:"#06b6d4" },
    { label:"Active Hotspots",     value: kpis.hotspotCount,        icon:"🔥", change:`Across Karnataka`, dir:"flat", color:"#f59e0b" },
    { label:"Known Gangs",         value: kpis.activeGangs,          icon:"🕵️", change:`Under surveillance`, dir:"flat", color:"#8b5cf6" },
    { label:"Pending Cases",       value: kpis.pendingCases.toLocaleString(), icon:"📁", change:`Requires action`, dir:"up", color:"#f97316" },
    { label:"Avg Response Time",   value: `${kpis.avgResponseTime}m`, icon:"⚡", change:`Improved 8%`,   dir:"down", color:"#10b981" },
  ];

  const container = document.getElementById("kpi-cards");
  if (!container) return;
  container.innerHTML = items.map(k => `
    <div class="kpi-card fade-in-up" style="--kpi-color:${k.color}">
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-change ${k.dir}">
        ${k.dir === "up" ? "▲" : k.dir === "down" ? "▼" : "—"} ${k.change}
      </div>
    </div>
  `).join('');
}

/* ── Crime Trend Line Chart ─────────────────────────────── */
function renderCrimeTrendChart() {
  const ctx = document.getElementById("crimeTrendChart");
  if (!ctx) return;
  const td = KSP_DATA.monthlyTrends;
  const toShow = ["CYBER","THEFT","ASSAULT","ROBBERY","DRUG"];
  const datasets = toShow.map(type => ({
    label: KSP_DATA.crimeTypes.find(x=>x.id===type)?.label || type,
    data: td.datasets[type],
    borderColor: KSP_DATA.getCrimeColor(type),
    backgroundColor: KSP_DATA.getCrimeColor(type) + "15",
    borderWidth: 2,
    pointRadius: 0,
    pointHoverRadius: 5,
    tension: 0.4,
    fill: false,
  }));

  new Chart(ctx, {
    type: "line",
    data: { labels: td.labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1000 },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "top", labels: { color: "#374151", font: { size: 11 }, boxWidth: 12, usePointStyle: true } },
        tooltip: darkTooltip(),
      },
      scales: {
        x: { ...darkAxes(), ticks: { maxTicksLimit: 12, color: "#6b7280", font: { size: 10 } } },
        y: { ...darkAxes(), ticks: { color: "#6b7280", font: { size: 10 } } },
      },
    },
  });
}

/* ── District Bar Chart ─────────────────────────────────── */
function renderDistrictBarChart() {
  const ctx = document.getElementById("districtBarChart");
  if (!ctx) return;
  const districts = KSP_DATA.districts.slice(0, 10);
  const labels = districts.map(d => d.name.split(" ")[0]);
  const totals = districts.map(d => KSP_DATA.getTotalForDistrict(d.id));
  const colors = totals.map(v => {
    if (v > 10000) return "#ef4444";
    if (v > 5000)  return "#f59e0b";
    if (v > 2000)  return "#06b6d4";
    return "#10b981";
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Total Crimes",
        data: totals,
        backgroundColor: colors,
        borderRadius: 3,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 800 },
      plugins: {
        legend: { display: false },
        tooltip: darkTooltip(),
      },
      scales: {
        x: { ...darkAxes(), ticks: { color: "#6b7280", font: { size: 10 } } },
        y: { ...darkAxes(), ticks: { color: "#6b7280", font: { size: 10 } } },
      },
    },
  });
}

/* ── Crime Composition Donut ───────────────────────────── */
function renderCrimeCompositionDonut() {
  const ctx = document.getElementById("crimeDonutChart");
  if (!ctx) return;
  const types = KSP_DATA.crimeTypes;
  const yoy = KSP_DATA.yoyComparison[2024];
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: types.map(t => t.label),
      datasets: [{
        data: types.map(t => yoy[t.id] || 0),
        backgroundColor: types.map(t => t.color + "cc"),
        borderColor: types.map(t => t.color),
        borderWidth: 1.5,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: "68%",
      animation: { duration: 1000 },
      plugins: {
        legend: { position: "right", labels: { color: "#374151", font: { size: 11 }, boxWidth: 12, padding: 10, usePointStyle: true } },
        tooltip: darkTooltip(),
      },
    },
  });
}

/* ── YoY Comparison Grouped Bar ─────────────────────────── */
function renderYoYChart() {
  const ctx = document.getElementById("yoyChart");
  if (!ctx) return;
  const types = KSP_DATA.crimeTypes;
  const years = [2022, 2023, 2024];
  const yearColors = { 2022: "#475569", 2023: "#06b6d4", 2024: "#3b82f6" };
  const datasets = years.map(yr => ({
    label: String(yr),
    data: types.map(t => KSP_DATA.yoyComparison[yr][t.id] || 0),
    backgroundColor: yearColors[yr] + "cc",
    borderColor: yearColors[yr],
    borderWidth: 1,
    borderRadius: 3,
  }));
  new Chart(ctx, {
    type: "bar",
    data: { labels: types.map(t => t.label.split(" ")[0]), datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: { labels: { color: "#374151", font: { size: 11 }, usePointStyle: true } },
        tooltip: darkTooltip(),
      },
      scales: {
        x: { ...darkAxes(), ticks: { color: "#6b7280", font: { size: 10 } } },
        y: { ...darkAxes(), ticks: { color: "#6b7280", font: { size: 10 } } },
      },
    },
  });
}

/* ── Time of Day Radar ─────────────────────────────────── */
function renderTimeOfDayChart() {
  const ctx = document.getElementById("timeOfDayChart");
  if (!ctx) return;
  const tod = KSP_DATA.timeOfDay;
  const toShow = ["THEFT","ASSAULT","MURDER","ROBBERY","CYBER","DRUG"];
  const datasets = toShow.map(type => ({
    label: KSP_DATA.crimeTypes.find(x=>x.id===type)?.label?.split(" ")[0] || type,
    data: tod[type],
    borderColor: KSP_DATA.getCrimeColor(type),
    backgroundColor: KSP_DATA.getCrimeColor(type) + "18",
    borderWidth: 2,
    pointRadius: 2,
    tension: 0.4,
    fill: false,
  }));
  new Chart(ctx, {
    type: "line",
    data: { labels: tod.hours, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 900 },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "top", labels: { color: "#374151", font: { size: 10 }, boxWidth: 10, usePointStyle: true } },
        tooltip: darkTooltip(),
      },
      scales: {
        x: { ...darkAxes(), ticks: { maxTicksLimit: 12, color: "#6b7280", font: { size: 9 } } },
        y: { ...darkAxes(), ticks: { color: "#6b7280", font: { size: 10 } } },
      },
    },
  });
}

/* ── Top Districts Table ────────────────────────────────── */
function renderTopDistrictsTable() {
  const tbody = document.getElementById("top-districts-tbody");
  if (!tbody) return;
  const sorted = KSP_DATA.districts
    .map(d => ({ ...d, total: KSP_DATA.getTotalForDistrict(d.id), risk: KSP_DATA.predictiveRisk.find(r=>r.district===d.id) }))
    .sort((a,b) => b.total - a.total)
    .slice(0, 8);

  tbody.innerHTML = sorted.map((d, i) => {
    const riskScore = d.risk?.overall || 0;
    const riskColor = KSP_DATA.getRiskColor(riskScore);
    const trend = d.risk?.trend;
    const trendIcon = trend === "up" ? `<span class="trend-up">▲ Rising</span>` : trend === "down" ? `<span class="trend-down">▼ Falling</span>` : `<span class="trend-flat">→ Stable</span>`;
    return `
      <tr>
        <td><strong style="color:#e2e8f0">#${i+1}</strong></td>
        <td><strong style="color:#e2e8f0">${d.name}</strong></td>
        <td style="font-family:'JetBrains Mono',monospace">${d.total.toLocaleString()}</td>
        <td>
          <div class="risk-bar-wrap">
            <div class="risk-bar-bg"><div class="risk-bar-fill" style="width:${riskScore}%;background:${riskColor}"></div></div>
            <span class="risk-score-val" style="color:${riskColor}">${riskScore}</span>
          </div>
        </td>
        <td>${trendIcon}</td>
        <td><span class="zone-alert ${riskScore>=75?'zone-red':riskScore>=55?'zone-orange':riskScore>=35?'zone-yellow':'zone-green'}">${riskScore>=75?'🔴 Critical':riskScore>=55?'🟠 High':'🟡 Moderate'}</span></td>
      </tr>
    `;
  }).join('');
}

/* ── Chart Helpers (Light Theme) ──────────────────────── */
function darkTooltip() {
  return {
    backgroundColor: "#ffffff",
    titleColor: "#1a2332",
    bodyColor: "#374151",
    borderColor: "#dde3ec",
    borderWidth: 1,
    padding: 10,
    cornerRadius: 4,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };
}
function darkAxes() {
  return {
    grid: { color: "#eef1f6" },
    border: { color: "#dde3ec" },
  };
}
