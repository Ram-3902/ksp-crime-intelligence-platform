// ============================================================
// KSP Crime Intelligence Platform — Crime Map Module
// ============================================================

let mapInstance = null;
let heatLayer = null;
let markerLayer = null;
let activeFilter = "ALL";

function initCrimeMap() {
  if (mapInstance) return; // already initialized

  mapInstance = L.map("crime-map", {
    center: [14.5, 75.8],
    zoom: 7,
    zoomControl: false,
    attributionControl: false,
  });

  // Dark tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    className: "dark-tiles",
  }).addTo(mapInstance);

  L.control.zoom({ position: "bottomright" }).addTo(mapInstance);

  // Custom attribution
  L.control.attribution({ position: "bottomleft", prefix: false })
    .addTo(mapInstance)
    .setPrefix('<span style="color:#475569;font-size:10px">© KSP SCRB | Map: OpenStreetMap</span>');

  // Add district polygons (simplified bounding circles)
  KSP_DATA.districts.forEach(d => {
    const total  = KSP_DATA.getTotalForDistrict(d.id);
    const risk   = KSP_DATA.predictiveRisk.find(r => r.district === d.id);
    const rScore = risk?.overall || 30;
    const rColor = KSP_DATA.getRiskColor(rScore);

    L.circle([d.lat, d.lng], {
      radius: Math.sqrt(total) * 220,
      color: rColor,
      fillColor: rColor,
      fillOpacity: 0.08,
      weight: 1,
      opacity: 0.5,
    }).addTo(mapInstance)
      .bindPopup(districtPopup(d, total, rScore), { className: "ksp-popup" });

    // District label
    L.marker([d.lat, d.lng], {
      icon: L.divIcon({
        className: "",
        html: `<div class="map-district-label">${d.name.split(" ")[0]}</div>`,
        iconAnchor: [0, 0],
      })
    }).addTo(mapInstance);
  });

  renderHotspots("ALL");
  bindMapFilters();
}

function districtPopup(d, total, rScore) {
  const dc = KSP_DATA.districtCrimes[d.id] || {};
  return `
    <div style="font-family:Inter,sans-serif;min-width:220px">
      <div style="font-weight:800;font-size:0.95rem;color:#1a2332;margin-bottom:8px;border-bottom:1px solid #dde3ec;padding-bottom:6px">
        📍 ${d.name}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.73rem;color:#6b7280">
        <span>Total Crimes</span><strong style="color:#1a2332">${total.toLocaleString()}</strong>
        <span>Risk Score</span><strong style="color:${KSP_DATA.getRiskColor(rScore)}">${rScore}/100</strong>
        <span>Population</span><strong style="color:#1a2332">${(d.population/1000000).toFixed(1)}M</strong>
        <span>Urbanization</span><strong style="color:#1a2332">${d.urbanization}%</strong>
      </div>
      <div style="margin-top:8px;font-size:0.68rem;color:#6b7280">
        Top crimes: <strong style="color:#1d5cbe">${topCrimes(dc, 3)}</strong>
      </div>
    </div>
  `;
}

function topCrimes(dc, n) {
  return Object.entries(dc).sort((a,b)=>b[1]-a[1]).slice(0,n)
    .map(([k]) => k).join(", ");
}

function renderHotspots(filter) {
  activeFilter = filter;
  if (markerLayer) markerLayer.clearLayers();
  markerLayer = L.layerGroup().addTo(mapInstance);

  const spots = filter === "ALL"
    ? KSP_DATA.hotspots
    : KSP_DATA.hotspots.filter(h => h.type === filter);

  spots.forEach(h => {
    const color = KSP_DATA.getCrimeColor(h.type);
    const r     = 14 + h.intensity * 4;

    L.circleMarker([h.lat, h.lng], {
      radius: r,
      color,
      fillColor: color,
      fillOpacity: 0.35 + h.intensity * 0.04,
      weight: 1.5,
      opacity: 0.8,
    }).addTo(markerLayer)
      .bindPopup(hotspotPopup(h), { className: "ksp-popup" });

    // Pulsing ring for high intensity
    if (h.intensity >= 7) {
      L.circleMarker([h.lat, h.lng], {
        radius: r + 8,
        color,
        fillColor: "transparent",
        weight: 1,
        opacity: 0.4,
        className: "pulse-ring",
      }).addTo(markerLayer);
    }
  });
}

function hotspotPopup(h) {
  const ct = KSP_DATA.crimeTypes.find(x => x.id === h.type);
  return `
    <div style="font-family:Inter,sans-serif">
      <div style="font-weight:800;font-size:0.88rem;color:#1a2332;margin-bottom:6px">🔥 ${h.label}</div>
      <div style="font-size:0.73rem;color:#6b7280">
        Crime Type: <strong style="color:${ct?.color || '#1a2332'}">${ct?.label || h.type}</strong><br>
        Intensity: <strong style="color:#1a2332">${h.intensity}/10</strong>
      </div>
    </div>
  `;
}

function bindMapFilters() {
  document.querySelectorAll(".map-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".map-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderHotspots(btn.dataset.type);
    });
  });
}
