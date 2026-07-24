import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { KPICard } from "../components/KPICard";
import { api } from "../api/endpoints";
import type { KPISummaryData, MonthlyCrimeData, YoYCrimeData } from "../types";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPISummaryData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyCrimeData | null>(null);
  const [yoy, setYoy] = useState<YoYCrimeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, monthlyRes, yoyRes] = await Promise.all([
          api.getKPIs(),
          api.getMonthlyCrimes(),
          api.getYoYCrimes(),
        ]);
        setKpis(kpiRes);
        setMonthly(monthlyRes);
        setYoy(yoyRes);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !kpis) {
    return (
      <Layout title="Command & Control Dashboard" subtitle="Loading intelligence data...">
        <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>Loading dashboard analytics...</div>
      </Layout>
    );
  }

  // Monthly trend dataset
  const trendLineData = monthly
    ? {
        labels: monthly.labels,
        datasets: [
          {
            label: "Theft",
            data: monthly.datasets["THEFT"] || [],
            borderColor: "#1d5cbe",
            backgroundColor: "#1d5cbe22",
            tension: 0.3,
            fill: true,
          },
          {
            label: "Cybercrime",
            data: monthly.datasets["CYBER"] || [],
            borderColor: "#c0392b",
            backgroundColor: "#c0392b22",
            tension: 0.3,
            fill: true,
          },
          {
            label: "Assault",
            data: monthly.datasets["ASSAULT"] || [],
            borderColor: "#b45309",
            backgroundColor: "#b4530922",
            tension: 0.3,
          },
        ],
      }
    : { labels: [], datasets: [] };

  // YoY dataset
  const yoyChartData = yoy
    ? {
        labels: ["THEFT", "CYBER", "FRAUD", "ASSAULT", "DRUG"],
        datasets: yoy.years.map((year, idx) => {
          const colors = ["#1d5cbe", "#b45309", "#c0392b"];
          return {
            label: `${year}`,
            data: ["THEFT", "CYBER", "FRAUD", "ASSAULT", "DRUG"].map(
              (t) => yoy.data[year]?.[t] || 0
            ),
            backgroundColor: colors[idx % colors.length],
          };
        }),
      }
    : { labels: [], datasets: [] };

  return (
    <Layout
      title="Command & Control Dashboard"
      subtitle="Real-time crime intelligence overview — Karnataka 2024"
    >
      {/* KPI Grid */}
      <div className="kpi-grid">
        <KPICard icon="📊" label="Total Crimes 2024" value={kpis.totalCrimes2024.toLocaleString()} change="+6.4% YoY" changeType="up" color="#1d5cbe" />
        <KPICard icon="👮" label="Total Arrests" value={kpis.totalArrests2024.toLocaleString()} change="71.6% Rate" changeType="down" color="#1a7a4a" />
        <KPICard icon="💻" label="Cybercrime Surge" value={`+${kpis.cybercrimeSurge}%`} change="Critical" changeType="up" color="#c0392b" />
        <KPICard icon="⚖️" label="Conviction Rate" value={`${kpis.convictionRate}%`} change="+2.1% YoY" changeType="down" color="#5b21b6" />
        <KPICard icon="🔥" label="Active Hotspots" value={kpis.hotspotCount} change="19 Identified" changeType="flat" color="#b45309" />
        <KPICard icon="🕵️" label="Active Gangs" value={kpis.activeGangs} change="4 Priority" changeType="flat" color="#0e7490" />
      </div>

      {/* Grid: Line trend + Donut */}
      <div className="grid-13">
        <div className="card">
          <div className="card-header">
            <h4>📈 Crime Trend Analysis</h4>
            <span className="card-badge badge-blue">Live API</span>
          </div>
          <div className="card-body">
            <div className="chart-wrap chart-h300">
              <Line
                data={trendLineData}
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
            <h4>📅 Year-over-Year Comparison</h4>
            <span className="card-badge badge-purple">2022–2024</span>
          </div>
          <div className="card-body">
            <div className="chart-wrap chart-h300">
              <Bar
                data={yoyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
