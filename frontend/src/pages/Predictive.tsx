import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { api } from "../api/endpoints";
import type { PredictiveRiskData, AnomalyData } from "../types";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const Predictive: React.FC = () => {
  const [risks, setRisks] = useState<PredictiveRiskData[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, aRes] = await Promise.all([api.getPredictiveRisk(), api.getAnomalies()]);
        setRisks(rRes);
        setAnomalies(aRes);
      } catch (err) {
        console.error("Predictive fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout
        title="AI-Driven Predictive Risk & Anomaly Detection"
        subtitle="Machine learning risk scoring, multi-dimensional radar, and outlier detection"
      >
        <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
          Loading predictive analytics data...
        </div>
      </Layout>
    );
  }

  const topRisks = [...risks].sort((a, b) => b.overall - a.overall).slice(0, 5);

  const radarData = {
    labels: ["Overall", "Cyber", "Violent", "Property", "Drug"],
    datasets: topRisks.map((d, idx) => {
      const colors = ["#c0392b", "#b45309", "#1d5cbe", "#5b21b6", "#0e7490"];
      const propVal = (d as any).property_ ?? d.property ?? 50;
      return {
        label: d.district_code,
        data: [d.overall, d.cyber, d.violent, propVal, d.drug],
        backgroundColor: colors[idx % colors.length] + "22",
        borderColor: colors[idx % colors.length],
        borderWidth: 2,
      };
    }),
  };

  return (
    <Layout
      title="AI-Driven Predictive Risk & Anomaly Detection"
      subtitle="Machine learning risk scoring, multi-dimensional radar, and outlier detection"
    >
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h4>📡 Multi-Dimensional Risk Radar</h4>
            <span className="card-badge badge-purple">Top 5 Districts</span>
          </div>
          <div className="card-body">
            <div className="chart-wrap chart-h340">
              <Radar
                data={radarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      min: 0,
                      max: 100,
                      ticks: { stepSize: 20 },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>⚠️ Anomaly Detection Alerts</h4>
            <span className="card-badge badge-red">Live Alerts</span>
          </div>
          <div className="card-body">
            <div className="anomaly-list">
              {anomalies.map((a) => (
                <div key={a.id} className={`anomaly-item anomaly-${a.severity}`}>
                  <div className="anomaly-body">
                    <div className="anomaly-title">{a.crime_type} — {a.district_code}</div>
                    <div className="anomaly-desc">{a.description}</div>
                    <div className="anomaly-meta">
                      <span>Date: {a.date}</span>
                      <span>Severity: {a.severity}</span>
                    </div>
                  </div>
                  {a.resolved ? (
                    <span className="anomaly-resolved">✓ Resolved</span>
                  ) : (
                    <span className="anomaly-active">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
