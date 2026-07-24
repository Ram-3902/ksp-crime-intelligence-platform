// ============================================================
// KSP Crime Intelligence Platform — Trends & Pattern Discovery
// ============================================================

function initTrends() {
  renderPatternHeatmap();
  renderCrimeTypeEvolution();
  renderMoAnalysisChart();
  renderTopOffenderTable();
}

/* ── Pattern Heatmap (Day x Hour) ──────────────────────── */
function renderPatternHeatmap() {
  const container = document.getElementById("pattern-heatmap");
  if (!container || container.dataset.rendered) return;
  container.dataset.rendered = "1";

  const days  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const hours = Array.from({length:24}, (_,i) => `${String(i).padStart(2,"0")}h`);

  // Synthetic day+hour crime density
  const seedMatrix = (base) => days.map((d, di) =>
    hours.map((h, hi) => {
      const weekend = di >= 5 ? 1.3 : 1;
      const night   = (hi >= 20 || hi <= 4) ? 1.4 : 1;
      const peak    = (hi >= 10 && hi <= 14) ? 1.2 : 1;
      return Math.round(base * weekend * night * peak * (0.7 + Math.random() * 0.7));
    })
  );
  const matrix = seedMatrix(15);

  const maxVal = Math.max(...matrix.flat());
  const cellW  = 20, cellH = 20;
  const padL   = 36, padT = 28;

  const svg = d3.select("#pattern-heatmap")
    .append("svg")
    .attr("width", padL + hours.length * cellW + 60)
    .attr("height", padT + days.length * cellH + 20);

  // Color scale
  const colorScale = d3.scaleSequential(d3.interpolateRgb("#0a1428","#ef4444")).domain([0, maxVal]);

  // Cells
  days.forEach((day, di) => {
    hours.forEach((hour, hi) => {
      const val = matrix[di][hi];
      svg.append("rect")
        .attr("x", padL + hi * cellW)
        .attr("y", padT + di * cellH)
        .attr("width", cellW - 2)
        .attr("height", cellH - 2)
        .attr("rx", 2)
        .attr("fill", colorScale(val))
        .attr("opacity", 0.9)
        .on("mouseover", function(event) {
          d3.select("#pattern-hm-tooltip")
            .style("display","block")
            .html(`<strong>${day} ${hour}</strong><br>Incidents: <strong style="color:#ef4444">${val}</strong>`)
            .style("left", (event.pageX+12)+"px")
            .style("top", (event.pageY-10)+"px");
        })
        .on("mousemove", function(event) {
          d3.select("#pattern-hm-tooltip")
            .style("left",(event.pageX+12)+"px")
            .style("top",(event.pageY-10)+"px");
        })
        .on("mouseout", function() {
          d3.select("#pattern-hm-tooltip").style("display","none");
        });
    });
  });

  // Day labels
  days.forEach((day, di) => {
    svg.append("text")
      .attr("x", padL - 6)
      .attr("y", padT + di * cellH + cellH * 0.65)
      .attr("text-anchor","end")
      .attr("font-size", 9)
      .attr("fill","#475569")
      .text(day);
  });

  // Hour labels (every 4)
  hours.forEach((hour, hi) => {
    if (hi % 4 === 0) {
      svg.append("text")
        .attr("x", padL + hi * cellW + cellW/2)
        .attr("y", padT - 6)
        .attr("text-anchor","middle")
        .attr("font-size", 9)
        .attr("fill","#475569")
        .text(hour);
    }
  });

  // Color legend bar
  const lgW = 100, lgH = 8;
  const lgX  = padL + hours.length * cellW + 10;
  const lgGrad = svg.append("defs").append("linearGradient")
    .attr("id","hm-grad").attr("x1","0%").attr("x2","100%");
  lgGrad.append("stop").attr("offset","0%").attr("stop-color","#0a1428");
  lgGrad.append("stop").attr("offset","100%").attr("stop-color","#ef4444");
  svg.append("rect").attr("x",lgX).attr("y",padT).attr("width",8).attr("height",days.length*cellH)
     .attr("rx",2).attr("fill","url(#hm-grad)");
  svg.append("text").attr("x",lgX+10).attr("y",padT+8).attr("font-size",8).attr("fill","#475569").text("Low");
  svg.append("text").attr("x",lgX+10).attr("y",padT+days.length*cellH).attr("font-size",8).attr("fill","#475569").text("High");
}

/* ── Crime Type Evolution Chart ─────────────────────────── */
function renderCrimeTypeEvolution() {
  const ctx = document.getElementById("crimeEvolutionChart");
  if (!ctx) return;
  const yoy = KSP_DATA.yoyComparison;
  const types = KSP_DATA.crimeTypes;

  // Compute growth rates
  const growthData = types.map(t => ({
    label: t.label.split(" ")[0],
    g2223: ((yoy[2023][t.id] - yoy[2022][t.id]) / yoy[2022][t.id] * 100).toFixed(1),
    g2324: ((yoy[2024][t.id] - yoy[2023][t.id]) / yoy[2023][t.id] * 100).toFixed(1),
    color: t.color,
  }));

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: growthData.map(d => d.label),
      datasets: [
        {
          label: "Growth 2022→2023 (%)",
          data: growthData.map(d => parseFloat(d.g2223)),
          backgroundColor: "#1d5cbe55",
          borderColor: "#1d5cbe",
          borderWidth: 1,
          borderRadius: 3,
        },
        {
          label: "Growth 2023→2024 (%)",
          data: growthData.map(d => parseFloat(d.g2324)),
          backgroundColor: "#c0392b55",
          borderColor: "#c0392b",
          borderWidth: 1,
          borderRadius: 3,
        },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: { position:"top", labels: { color:"#374151", font:{size:11}, usePointStyle:true } },
        tooltip: { ...darkTooltipTr(), callbacks: { label: c => `${c.dataset.label}: ${c.raw > 0 ? "+" : ""}${c.raw}%` } },
      },
      scales: {
        x: { ...darkAxesTr(), ticks: { color:"#6b7280", font:{size:10} } },
        y: {
          ...darkAxesTr(), ticks: { color:"#6b7280", font:{size:10}, callback: v => `${v>0?"+":""}${v}%` },
          title: { display:true, text:"YoY Growth (%)", color:"#6b7280", font:{size:10} },
        },
      },
    },
  });
}

/* ── MO Analysis Bar Chart ──────────────────────────────── */
function renderMoAnalysisChart() {
  const ctx = document.getElementById("moAnalysisChart");
  if (!ctx) return;
  const mos = [
    { mo:"Online Phishing",        count:1420, type:"CYBER"   },
    { mo:"SIM Swap Fraud",         count:980,  type:"CYBER"   },
    { mo:"Highway Robbery",        count:860,  type:"ROBBERY" },
    { mo:"Drug Courier Network",   count:740,  type:"DRUG"    },
    { mo:"ATM Card Skimming",      count:620,  type:"THEFT"   },
    { mo:"Vehicle Theft Gang",     count:580,  type:"THEFT"   },
    { mo:"Investment Fraud",       count:540,  type:"FRAUD"   },
    { mo:"Gang Assault/Extortion", count:495,  type:"ASSAULT" },
    { mo:"Dacoity (Armed Gang)",   count:380,  type:"ROBBERY" },
    { mo:"Child Trafficking",      count:110,  type:"KIDNAP"  },
  ];
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: mos.map(m => m.mo),
      datasets: [{
        label: "Incidents",
        data: mos.map(m => m.count),
        backgroundColor: mos.map(m => KSP_DATA.getCrimeColor(m.type) + "99"),
        borderColor: mos.map(m => KSP_DATA.getCrimeColor(m.type)),
        borderWidth: 1,
        borderRadius: 3,
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: { display:false },
        tooltip: darkTooltipTr(),
      },
      scales: {
        x: { ...darkAxesTr(), ticks: { color:"#6b7280", font:{size:10} } },
        y: { ...darkAxesTr(), ticks: { color:"#374151", font:{size:10} } },
      },
    },
  });
}

/* ── Top Offenders Table ────────────────────────────────── */
function renderTopOffenderTable() {
  const tbody = document.getElementById("offenders-tbody");
  if (!tbody) return;
  tbody.innerHTML = KSP_DATA.offenders.map(o => {
    const distName = KSP_DATA.getDistrictName(o.district);
    const statusKey = (o.status || "").replace(/ /g,"-");
    return `
      <tr>
        <td><code style="color:#06b6d4;font-family:'JetBrains Mono',monospace">${o.id}</code></td>
        <td><strong style="color:#e2e8f0">${o.name}</strong></td>
        <td>${o.age}</td>
        <td>${distName}</td>
        <td style="font-variant-numeric:tabular-nums">${o.arrests}</td>
        <td style="font-variant-numeric:tabular-nums">${o.convictions}</td>
        <td><span class="risk-badge risk-${o.risk}">${o.risk}</span></td>
        <td style="max-width:200px;font-size:0.72rem;color:#94a3b8">${o.mo}</td>
        <td><span class="status-badge status-${statusKey}">${o.status}</span></td>
      </tr>
    `;
  }).join('');
}

/* ── Offender Profile Cards ─────────────────────────────── */
function renderOffenderCards() {
  const container = document.getElementById("offender-cards");
  if (!container) return;
  container.innerHTML = KSP_DATA.offenders.map(o => {
    const initials = o.name.split(" ").map(w=>w[0]).join("").slice(0,2);
    const distName = KSP_DATA.getDistrictName(o.district);
    return `
      <div class="offender-card fade-in-up">
        <div class="offender-header">
          <div style="display:flex;align-items:flex-start;gap:10px">
            <div class="offender-avatar">${initials}</div>
            <div>
              <div class="offender-name">${o.name}</div>
              <div class="offender-id">${o.id}</div>
            </div>
          </div>
          <span class="risk-badge risk-${o.risk}">${o.risk}</span>
        </div>
        <div class="offender-stat">👮 District: <strong>${distName}</strong></div>
        <div class="offender-stat">🔒 Arrests: <strong>${o.arrests}</strong> &nbsp;|&nbsp; Convictions: <strong>${o.convictions}</strong></div>
        <div class="offender-stat">📋 Status: <span class="status-badge status-${(o.status||'').replace(/ /g,'-')}">${o.status}</span></div>
        <div class="offender-mo">🎯 MO: ${o.mo}</div>
        <div class="offender-gang">🕵️ ${o.gang || "Independent"}</div>
      </div>
    `;
  }).join('');
}

/* ── Helpers (Light Theme) ──────────────────────────── */
function darkTooltipTr() {
  return {
    backgroundColor: "#ffffff",
    titleColor: "#1a2332",
    bodyColor: "#374151",
    borderColor: "#dde3ec",
    borderWidth: 1,
    padding: 10, cornerRadius: 4,
  };
}
function darkAxesTr() {
  return {
    grid: { color: "#eef1f6" },
    border: { color: "#dde3ec" },
  };
}
