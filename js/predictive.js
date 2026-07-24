// ============================================================
// KSP Crime Intelligence Platform — Predictive Analytics Module
// ============================================================

function initPredictive() {
  renderRiskScoreTable();
  renderRiskRadarChart();
  renderAnomalyList();
  renderSocioCorrelationChart();
  renderPredictiveTimelineChart();
}

/* ── Risk Score Table with bars ──────────────────────────── */
function renderRiskScoreTable() {
  const tbody = document.getElementById("risk-table-tbody");
  if (!tbody) return;
  const sorted = [...KSP_DATA.predictiveRisk].sort((a,b) => b.overall - a.overall);
  tbody.innerHTML = sorted.map(r => {
    const name  = KSP_DATA.getDistrictName(r.district);
    const color = KSP_DATA.getRiskColor(r.overall);
    const tIcon = r.trend === "up" ? `<span style="color:#ef4444">▲ Rising</span>`
                : r.trend === "down" ? `<span style="color:#10b981">▼ Falling</span>`
                : `<span style="color:#475569">→ Stable</span>`;
    return `
      <tr>
        <td><strong style="color:#e2e8f0">${name}</strong></td>
        <td>
          <div class="risk-bar-wrap">
            <div class="risk-bar-bg"><div class="risk-bar-fill" style="width:${r.overall}%;background:${color}"></div></div>
            <span class="risk-score-val" style="color:${color}">${r.overall}</span>
          </div>
        </td>
        <td>${renderMiniBar(r.cyber,    "#06b6d4")}</td>
        <td>${renderMiniBar(r.violent,  "#ef4444")}</td>
        <td>${renderMiniBar(r.property, "#f59e0b")}</td>
        <td>${renderMiniBar(r.drug,     "#8b5cf6")}</td>
        <td>${tIcon}</td>
      </tr>
    `;
  }).join('');
}

function renderMiniBar(val, color) {
  return `<div style="display:flex;align-items:center;gap:6px">
    <div style="flex:1;height:5px;background:rgba(255,255,255,0.05);border-radius:3px;overflow:hidden">
      <div style="width:${val}%;height:100%;background:${color};border-radius:3px"></div>
    </div>
    <span style="font-size:0.68rem;color:#94a3b8;width:22px;text-align:right">${val}</span>
  </div>`;
}

/* ── Risk Radar Chart (top 5 districts) ─────────────────── */
function renderRiskRadarChart() {
  const ctx = document.getElementById("riskRadarChart");
  if (!ctx) return;
  const top5 = [...KSP_DATA.predictiveRisk].sort((a,b)=>b.overall-a.overall).slice(0,5);
  const radarColors = ["#ef4444","#f59e0b","#06b6d4","#8b5cf6","#10b981"];
  const datasets = top5.map((r,i) => ({
    label: KSP_DATA.getDistrictName(r.district).split(" ")[0],
    data: [r.overall, r.cyber, r.violent, r.property, r.drug],
    borderColor: radarColors[i],
    backgroundColor: radarColors[i] + "18",
    borderWidth: 2,
    pointRadius: 4,
    pointBackgroundColor: radarColors[i],
  }));
  new Chart(ctx, {
    type: "radar",
    data: { labels: ["Overall","Cyber","Violent","Property","Drug"], datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1000 },
      scales: {
        r: {
          min: 0, max: 100,
          grid: { color: "#eef1f6" },
          angleLines: { color: "#dde3ec" },
          ticks: { display: false },
          pointLabels: { color: "#374151", font: { size: 11 } },
        }
      },
      plugins: {
        legend: { position: "bottom", labels: { color: "#374151", font: { size: 11 }, boxWidth: 12, usePointStyle: true } },
        tooltip: darkTooltipPred(),
      },
    },
  });
}

/* ── Anomaly List ───────────────────────────────────────── */
function renderAnomalyList() {
  const container = document.getElementById("anomaly-list");
  if (!container) return;
  const icons = { MURDER:"🔴", CYBER:"💻", ROBBERY:"🔫", DRUG:"💊", ASSAULT:"⚡", KIDNAP:"🚨", FRAUD:"💰", ARSON:"🔥" };
  container.innerHTML = KSP_DATA.anomalies.map(a => {
    const icon = icons[a.type] || "⚠️";
    const district = KSP_DATA.getDistrictName(a.district);
    return `
      <div class="anomaly-item anomaly-${a.severity}">
        <div class="anomaly-icon">${icon}</div>
        <div class="anomaly-body">
          <div class="anomaly-title">${district} — ${a.type}</div>
          <div class="anomaly-desc">${a.description}</div>
          <div class="anomaly-meta">
            <span>📅 ${a.date}</span>
            <span>⚡ ${a.severity}</span>
          </div>
        </div>
        ${a.resolved
          ? `<div class="anomaly-resolved">✓ Resolved</div>`
          : `<div class="anomaly-active"><span style="width:6px;height:6px;border-radius:50%;background:#ef4444;display:inline-block;animation:pulse-red 1.2s infinite"></span>Active</div>`
        }
      </div>
    `;
  }).join('');
}

/* ── Socio-Economic Correlation (Bubble Chart) ─────────── */
function renderSocioCorrelationChart() {
  const ctx = document.getElementById("socioChart");
  if (!ctx) return;
  const data = KSP_DATA.districts.map(d => {
    const se = KSP_DATA.socioEconomic[d.id];
    if (!se) return null;
    const total = KSP_DATA.getTotalForDistrict(d.id);
    return {
      label: d.name.split(" ")[0],
      x: se.unemployment,
      y: total / (d.population / 100000), // crime rate per 100k
      r: Math.sqrt(d.population / 1000000) * 8 + 5,
    };
  }).filter(Boolean);

  new Chart(ctx, {
    type: "bubble",
    data: {
      datasets: [{
        label: "Districts",
        data,
        backgroundColor: data.map(d => {
          if (d.y > 150) return "#ef444466";
          if (d.y > 80)  return "#f59e0b66";
          return "#10b98166";
        }),
        borderColor: data.map(d => {
          if (d.y > 150) return "#ef4444";
          if (d.y > 80)  return "#f59e0b";
          return "#10b981";
        }),
        borderWidth: 1.5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1000 },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...darkTooltipPred(),
          callbacks: {
            label: ctx => {
              const d = ctx.raw;
              return [`📍 ${d.label}`, `Unemployment: ${d.x}%`, `Crime rate: ${d.y.toFixed(0)}/100k`];
            }
          }
        }
      },
      scales: {
        x: {
          ...darkAxesPred(),
          title: { display: true, text: "Unemployment Rate (%)", color: "#475569", font: { size: 11 } },
          ticks: { color: "#475569", font: { size: 10 } },
        },
        y: {
          ...darkAxesPred(),
          title: { display: true, text: "Crime Rate / 100k Population", color: "#475569", font: { size: 11 } },
          ticks: { color: "#475569", font: { size: 10 } },
        },
      },
    },
  });
}

/* ── Predictive Timeline Chart ──────────────────────────── */
function renderPredictiveTimelineChart() {
  const ctx = document.getElementById("predictiveTimeline");
  if (!ctx) return;

  // Simulate 6-month forecast based on trend
  const months = ["Jan'25","Feb'25","Mar'25","Apr'25","May'25","Jun'25"];
  const last6  = KSP_DATA.monthlyTrends.datasets.CYBER.slice(-6);
  const growth = 1.042;
  const forecast = months.map((_, i) => Math.round(last6[5] * Math.pow(growth, i+1)));
  const actual    = KSP_DATA.monthlyTrends.datasets.CYBER.slice(-6);
  const actualLabels = KSP_DATA.monthlyTrends.labels.slice(-6);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: [...actualLabels, ...months],
      datasets: [
        {
          label: "Actual Cybercrime",
          data: [...actual, ...Array(6).fill(null)],
          borderColor: "#06b6d4",
          backgroundColor: "#06b6d418",
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 4,
        },
        {
          label: "AI Forecast",
          data: [...Array(6).fill(null), forecast[0]-20, ...forecast.slice(1)],
          borderColor: "#8b5cf6",
          backgroundColor: "#8b5cf620",
          borderWidth: 2,
          borderDash: [6,4],
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointStyle: "triangle",
        },
        {
          label: "Confidence Band (Upper)",
          data: [...Array(6).fill(null), ...forecast.map(v => Math.round(v * 1.08))],
          borderColor: "#8b5cf640",
          backgroundColor: "transparent",
          borderWidth: 1,
          borderDash: [3,3],
          fill: "+1",
          pointRadius: 0,
        },
        {
          label: "Confidence Band (Lower)",
          data: [...Array(6).fill(null), ...forecast.map(v => Math.round(v * 0.92))],
          borderColor: "#8b5cf640",
          backgroundColor: "#8b5cf610",
          borderWidth: 1,
          borderDash: [3,3],
          pointRadius: 0,
        },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1200 },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "top", labels: { color: "#94a3b8", font: { size: 11 }, usePointStyle: true } },
        tooltip: darkTooltipPred(),
        annotation: {},
      },
      scales: {
        x: { ...darkAxesPred(), ticks: { color: "#475569", font: { size: 10 } } },
        y: { ...darkAxesPred(), ticks: { color: "#475569", font: { size: 10 } } },
      },
    },
  });
}

/* ── Chart Helpers (Light Theme) ──────────────────────── */
function darkTooltipPred() {
  return {
    backgroundColor: "#ffffff",
    titleColor: "#1a2332",
    bodyColor: "#374151",
    borderColor: "#dde3ec",
    borderWidth: 1,
    padding: 10,
    cornerRadius: 4,
  };
}
function darkAxesPred() {
  return {
    grid: { color: "#eef1f6" },
    border: { color: "#dde3ec" },
  };
}
