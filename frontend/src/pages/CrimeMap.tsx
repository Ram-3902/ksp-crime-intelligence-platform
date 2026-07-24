import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { api } from "../api/endpoints";
import type { DistrictData, HotspotData } from "../types";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const CrimeMap: React.FC = () => {
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [hotspots, setHotspots] = useState<HotspotData[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dRes, hRes] = await Promise.all([api.getDistricts(), api.getHotspots()]);
        setDistricts(dRes);
        setHotspots(hRes);
      } catch (err) {
        console.error("Map fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredHotspots =
    filter === "ALL" ? hotspots : hotspots.filter((h) => h.crime_type === filter);

  return (
    <Layout
      title="Geospatial Crime Intelligence Map"
      subtitle="Interactive district-level crime hotspot visualization with spatiotemporal clusters"
    >
      <div className="card map-card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h4>🔥 Crime Hotspot Overlay — Filter by Type</h4>
          <span className="card-badge badge-blue">Live API Data</span>
        </div>

        <div className="map-toolbar">
          {["ALL", "THEFT", "ASSAULT", "MURDER", "ROBBERY", "CYBER", "DRUG", "FRAUD"].map((type) => (
            <button
              key={type}
              className={`map-filter-btn ${filter === type ? "active" : ""}`}
              onClick={() => setFilter(type)}
            >
              {type === "ALL" ? "All Crimes" : type}
            </button>
          ))}
        </div>

        <div style={{ height: 520, width: "100%" }}>
          {!loading && (
            <MapContainer
              center={[14.5, 75.8]}
              zoom={7}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              {/* District Markers */}
              {districts.map((d) => (
                <CircleMarker
                  key={`dist-${d.code}`}
                  center={[d.lat, d.lng]}
                  radius={12}
                  pathOptions={{
                    color: "#1d5cbe",
                    fillColor: "#1d5cbe",
                    fillOpacity: 0.3,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div>
                      <strong>📍 {d.name}</strong>
                      <br />
                      Division: {d.division}
                      <br />
                      Pop: {(d.population / 1000000).toFixed(1)}M | Urban: {d.urbanization}%
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Hotspot Markers */}
              {filteredHotspots.map((h) => (
                <CircleMarker
                  key={`hs-${h.id}`}
                  center={[h.lat, h.lng]}
                  radius={h.intensity * 2 + 4}
                  pathOptions={{
                    color: h.intensity >= 8 ? "#c0392b" : "#b45309",
                    fillColor: h.intensity >= 8 ? "#c0392b" : "#f59e0b",
                    fillOpacity: 0.6,
                    weight: 1.5,
                  }}
                >
                  <Popup>
                    <div>
                      <strong>🔥 {h.label}</strong>
                      <br />
                      Type: {h.crime_type}
                      <br />
                      Intensity: {h.intensity}/10
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </Layout>
  );
};
