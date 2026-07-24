// ============================================================
// KSP Crime Intelligence Platform — Network Analysis Module
// ============================================================

let networkSim = null;

function initNetworkGraph() {
  const container = document.getElementById("network-svg");
  if (!container || container.dataset.rendered) return;
  container.dataset.rendered = "1";

  const W = container.clientWidth  || 800;
  const H = container.clientHeight || 540;

  const svg = d3.select("#network-svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .style("background", "#f7f9fc")
    .call(d3.zoom().scaleExtent([0.4, 2.5]).on("zoom", e => g.attr("transform", e.transform)));

  const g = svg.append("g");

  // Defs: arrow markers & glow filter
  const defs = svg.append("defs");
  ["co-accused","associate","victim","crime-scene","linked"].forEach(type => {
    defs.append("marker")
      .attr("id", `arrow-${type}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 22).attr("refY", 0)
      .attr("markerWidth", 5).attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", linkColor(type));
  });

  const glow = defs.append("filter").attr("id","glow");
  glow.append("feGaussianBlur").attr("stdDeviation","3").attr("result","coloredBlur");
  const feMerge = glow.append("feMerge");
  feMerge.append("feMergeNode").attr("in","coloredBlur");
  feMerge.append("feMergeNode").attr("in","SourceGraphic");

  // Deep copy nodes & links for simulation
  const nodes = KSP_DATA.networkNodes.map(n => ({ ...n }));
  const links = KSP_DATA.networkLinks.map(l => ({ ...l }));

  // Force simulation
  networkSim = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(d => 120 - d.weight * 20))
    .force("charge", d3.forceManyBody().strength(-280))
    .force("center", d3.forceCenter(W / 2, H / 2))
    .force("collision", d3.forceCollide(28));

  // Links
  const link = g.append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", d => linkColor(d.label.toLowerCase().replace(/ /g,"-")))
    .attr("stroke-width", d => 0.8 + d.weight * 0.5)
    .attr("stroke-opacity", 0.6)
    .attr("marker-end", d => `url(#arrow-${d.label.toLowerCase().replace(/ /g,"-")})`);

  // Link labels
  const linkLabel = g.append("g")
    .selectAll("text")
    .data(links)
    .join("text")
    .attr("font-size", 8)
    .attr("fill", "#475569")
    .attr("text-anchor", "middle")
    .text(d => d.label);

  // Nodes
  const nodeG = g.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", "network-node")
    .style("cursor", "pointer")
    .call(d3.drag()
      .on("start", dragStart)
      .on("drag",  dragged)
      .on("end",   dragEnd)
    );

  // Node circles
  nodeG.append("circle")
    .attr("r", d => nodeRadius(d))
    .attr("fill", d => nodeFill(d))
    .attr("stroke", d => nodeStroke(d))
    .attr("stroke-width", 1.5)
    .attr("filter", d => d.type === "suspect" && d.risk >= 8 ? "url(#glow)" : null);

  // Node icons
  nodeG.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("font-size", d => nodeRadius(d) * 0.9)
    .text(d => nodeIcon(d));

  // Node labels
  nodeG.append("text")
    .attr("text-anchor", "middle")
    .attr("y", d => nodeRadius(d) + 12)
    .attr("font-size", 9)
    .attr("fill", "#94a3b8")
    .attr("font-weight", "500")
    .text(d => d.label);

  // Tooltip
  const tooltip = d3.select("#network-tooltip");
  nodeG
    .on("mouseover", (event, d) => {
      tooltip.style("display","block")
        .html(nodeTooltipHTML(d))
        .style("left", (event.pageX + 12) + "px")
        .style("top",  (event.pageY - 10) + "px");
    })
    .on("mousemove", (event) => {
      tooltip.style("left", (event.pageX + 12) + "px")
             .style("top",  (event.pageY - 10) + "px");
    })
    .on("mouseout", () => { tooltip.style("display","none"); });

  // Click to highlight connected nodes
  nodeG.on("click", (event, d) => {
    event.stopPropagation();
    highlightConnected(d, nodeG, link);
  });
  svg.on("click", () => resetHighlight(nodeG, link));

  networkSim.on("tick", () => {
    link
      .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
    linkLabel
      .attr("x", d => (d.source.x + d.target.x) / 2)
      .attr("y", d => (d.source.y + d.target.y) / 2);
    nodeG.attr("transform", d => `translate(${d.x},${d.y})`);
  });

  // Gang legend
  renderNetworkLegend();
}

// ── Helpers ──────────────────────────────────────────────
function nodeRadius(d) {
  if (d.type === "suspect")  return 10 + (d.risk || 5) * 1.5;
  if (d.type === "victim")   return 12;
  if (d.type === "location") return 10 + (d.offenses || 5) * 0.5;
  return 12;
}
function nodeFill(d) {
  if (d.type === "suspect")  return d.risk >= 8 ? "#fee2e2" : d.risk >= 6 ? "#fef3e2" : "#dbeafe";
  if (d.type === "victim")   return "#d1fae5";
  if (d.type === "location") return "#ede9fe";
  return "#f3f4f6";
}
function nodeStroke(d) {
  if (d.type === "suspect")  return d.risk >= 8 ? "#c0392b" : d.risk >= 6 ? "#b45309" : "#1d5cbe";
  if (d.type === "victim")   return "#1a7a4a";
  if (d.type === "location") return "#5b21b6";
  return "#6b7280";
}
function nodeIcon(d) {
  if (d.type === "suspect")  return "⚠";
  if (d.type === "victim")   return "👤";
  if (d.type === "location") return "📍";
  return "●";
}
function linkColor(type) {
  const map = { "co-accused":"#ef4444", "associate":"#f59e0b", "victim":"#10b981", "crime-scene":"#8b5cf6", "linked":"#475569" };
  return map[type] || "#475569";
}
function nodeTooltipHTML(d) {
  if (d.type === "suspect") return `
    <strong style="color:#b91c1c">${d.label}</strong><br>
    ID: <code style="color:#1d5cbe;font-family:monospace">${d.id}</code><br>
    Gang: <span style="color:#b45309">${d.gang}</span><br>
    Risk: <strong style="color:#1a2332">${d.risk}/10</strong><br>
    MO: ${d.mo}<br>
    District: ${KSP_DATA.getDistrictName(d.district)}
  `;
  if (d.type === "victim") return `
    <strong style="color:#1a7a4a">${d.label}</strong><br>
    ID: <code style="color:#1d5cbe;font-family:monospace">${d.id}</code><br>
    Incidents: ${d.offenses}<br>
    District: ${KSP_DATA.getDistrictName(d.district)}
  `;
  return `
    <strong style="color:#5b21b6">${d.label}</strong><br>
    ID: <code style="color:#1d5cbe;font-family:monospace">${d.id}</code><br>
    Incident Count: ${d.offenses}<br>
    District: ${KSP_DATA.getDistrictName(d.district)}
  `;
}

function highlightConnected(d, nodeG, link) {
  const connected = new Set([d.id]);
  KSP_DATA.networkLinks.forEach(l => {
    if (l.source === d.id || (l.source && l.source.id === d.id)) connected.add(typeof l.target === "object" ? l.target.id : l.target);
    if (l.target === d.id || (l.target && l.target.id === d.id)) connected.add(typeof l.source === "object" ? l.source.id : l.source);
  });
  nodeG.style("opacity", n => connected.has(n.id) ? 1 : 0.1);
  link.style("opacity", l => {
    const sid = typeof l.source === "object" ? l.source.id : l.source;
    const tid = typeof l.target === "object" ? l.target.id : l.target;
    return connected.has(sid) && connected.has(tid) ? 1 : 0.05;
  });
}
function resetHighlight(nodeG, link) {
  nodeG.style("opacity", 1);
  link.style("opacity", 0.6);
}

function dragStart(event, d) { if (!event.active) networkSim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
function dragged(event, d)    { d.fx = event.x; d.fy = event.y; }
function dragEnd(event, d)    { if (!event.active) networkSim.alphaTarget(0); d.fx = null; d.fy = null; }

function renderNetworkLegend() {
  const container = document.getElementById("network-legend");
  if (!container) return;
  container.innerHTML = `
    <div class="legend">
      <div class="legend-item"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#fee2e2;border:2px solid #c0392b;margin-right:4px"></span>Critical Suspect</div>
      <div class="legend-item"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#fef3e2;border:2px solid #b45309;margin-right:4px"></span>High Risk Suspect</div>
      <div class="legend-item"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#dbeafe;border:2px solid #1d5cbe;margin-right:4px"></span>Moderate Suspect</div>
      <div class="legend-item"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#d1fae5;border:2px solid #1a7a4a;margin-right:4px"></span>Victim</div>
      <div class="legend-item"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ede9fe;border:2px solid #5b21b6;margin-right:4px"></span>Location</div>
    </div>
    <div class="legend" style="margin-top:8px">
      <div class="legend-item"><div class="legend-line" style="background:#c0392b"></div>Co-accused</div>
      <div class="legend-item"><div class="legend-line" style="background:#b45309"></div>Associate</div>
      <div class="legend-item"><div class="legend-line" style="background:#1a7a4a"></div>Victim link</div>
      <div class="legend-item"><div class="legend-line" style="background:#5b21b6"></div>Crime Scene</div>
    </div>
  `;
}
