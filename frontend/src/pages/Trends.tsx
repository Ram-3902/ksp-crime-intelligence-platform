import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { api } from "../api/endpoints";
import type { OffenderData, YoYCrimeData } from "../types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Trends: React.FC = () => {
  const [yoyData, setYoyData] = useState<YoYCrimeData | null>(null);
  const [offenders, setOffenders] = useState<OffenderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yRes, oRes] = await Promise.all([api.getYoYCrimes(), api.getOffenders()]);
        setYoyData(yRes);
        setOffenders(oRes);
      } catch (err) {
        console.error("Trends fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 7 days x 24 hours mock density matrix
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getHeatColor = (dayIdx: number, hour: number) => {
    // Peak hours: Fri/Sat night (21:00 - 03:00) and Wed afternoon
    let intensity = Math.floor(Math.sin((hour / 24) * Math.PI) * 5) + (dayIdx >= 4 ? 3 : 1);
    if (dayIdx >= 4 && (hour >= 21 || hour <= 3)) intensity += 4;
    intensity = Math.min(10, Math.max(1, intensity));

    if (intensity >= 8) return "#c0392b"; // Red (Critical)
    if (intensity >= 6) return "#b45309"; // Amber (High)
    if (intensity >= 4) return "#1d5cbe"; // Blue (Medium)
    return "#e2e8f0";                     // Soft Grey (Low)
  };

  // YoY growth rates calculation
  const growthLabels = ["THEFT", "CYBER", "FRAUD", "ASSAULT", "DRUG"];
  const growth2223 = growthLabels.map((t) => {
    const v22 = yoyData?.data[2022]?.[t] || 1;
    const v23 = yoyData?.data[2023]?.[t] || 1;
    return (((v23 - v22) / v22) * 100).toFixed(1);
  });

  const growth2324 = growthLabels.map((t) => {
    const v23 = yoyData?.data[2023]?.[t] || 1;
    const v24 = yoyData?.data[2024]?.[t] || 1;
    return (((v24 - v23) / v23) * 100).toFixed(1);
  });

  const growthChartData = {
    labels: growthLabels,
    datasets: [
      {
        label: "Growth 2022 → 2023 (%)",
        data: growth2223.map(Number),
        backgroundColor: "#1d5cbe88",
        borderColor: "#1d5cbe",
        borderWidth: 1,
      },
      {
        label: "Growth 2023 → 2024 (%)",
        data: growth2324.map(Number),
        backgroundColor: "#c0392b88",
        borderColor: "#c0392b",
        borderWidth: 1,
      },
    ],
  };

  // MO Frequency Chart
  const moLabels = [
    "SIM Swap Phishing",
    "NH Highway Dacoity",
    "Mining Extortion",
    "Coastal MDMA Trafficking",
    "ATM Cash Skimming",
  ];
  const moChartData = {
    labels: moLabels,
    datasets: [
      {
        label: "Incidents",
        data: [1420, 850, 620, 510, 480],
        backgroundColor: ["#c0392b99", "#b4530999", "#5b21b699", "#0e749099", "#1d5cbe99"],
        borderColor: ["#c0392b", "#b45309", "#5b21b6", "#0e7490", "#1d5cbe"],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <Layout
        title="Pattern & Trend Discovery"
        subtitle="Spatiotemporal crime clustering, modus operandi analysis, and year-over-year evolution"
      >
        <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
          Loading trend discovery analytics...
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Pattern & Trend Discovery"
      subtitle="Spatiotemporal crime clustering, modus operandi analysis, and year-over-year evolution"
    >
      {/* Heatmap Card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h4>🟥 Day × Hour Crime Density Heatmap</h4>
          <span className="card-badge badge-red">Spatiotemporal Matrix</span>
        </div>
        <div className="card-body" style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 700 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 4, marginLeft: 45 }}>
              {hours.map((h) => (
                <div
                  key={h}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: "0.6rem",
                    color: "#6b7280",
                    fontFamily: "monospace",
                  }}
                >
                  {h < 10 ? `0${h}` : h}
                </div>
              ))}
            </div>

            {days.map((day, dayIdx) => (
              <div key={day} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                <div style={{ width: 40, fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>
                  {day}
                </div>
                {hours.map((h) => {
                  const color = getHeatColor(dayIdx, h);
                  return (
                    <div
                      key={h}
                      title={`${day} ${h}:00 — Density Score`}
                      style={{
                        flex: 1,
                        height: 22,
                        background: color,
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="legend" style={{ marginTop: 12, display: "flex", gap: 16 }}>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#e2e8f0" }}></span> Low (1-3)
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#1d5cbe" }}></span> Moderate (4-5)
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#b45309" }}></span> High (6-7)
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#c0392b" }}></span> Critical Peak (8-10)
            </div>
          </div>
        </div>
      </div>

      {/* Grid: YoY Evolution + MO Analysis */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h4>📊 Crime Type Growth Rates YoY</h4>
            <span className="card-badge badge-cyan">2022 → 2024</span>
          </div>
          <div className="card-body">
            <div className="chart-wrap chart-h300">
              <Bar
                data={growthChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>🎯 Modus Operandi Frequency Analysis</h4>
            <span className="card-badge badge-purple">Top Crime MOs</span>
          </div>
          <div className="card-body">
            <div className="chart-wrap chart-h300">
              <Bar
                data={moChartData}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Offender Priority Table */}
      <div className="card">
        <div className="card-header">
          <h4>⚠️ Repeat Offender Analysis — Risk Ranked</h4>
          <span className="card-badge badge-red">High Priority</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>District</th>
                <th>Arrests</th>
                <th>Convictions</th>
                <th>Risk</th>
                <th>Modus Operandi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {offenders.map((o) => (
                <tr key={o.offender_id}>
                  <td>
                    <code style={{ color: "#1d5cbe", fontWeight: 700 }}>{o.offender_id}</code>
                  </td>
                  <td>
                    <strong>{o.name}</strong>
                  </td>
                  <td>{o.age}</td>
                  <td>{o.district_code}</td>
                  <td>{o.arrests}</td>
                  <td>{o.convictions}</td>
                  <td>
                    <span className={`risk-badge risk-${o.risk}`}>{o.risk}</span>
                  </td>
                  <td>{o.mo}</td>
                  <td>
                    <span className={`status-badge status-${o.status.replace(" ", "-")}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
