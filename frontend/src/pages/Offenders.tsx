import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { api } from "../api/endpoints";
import type { OffenderData } from "../types";

export const Offenders: React.FC = () => {
  const [offenders, setOffenders] = useState<OffenderData[]>([]);
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getOffenders(riskFilter !== "ALL" ? riskFilter : undefined);
        setOffenders(data);
      } catch (err) {
        console.error("Offenders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [riskFilter]);

  return (
    <Layout
      title="Offender Intelligence Profiles"
      subtitle="Repeat offender tracking with MO linkage across districts and jurisdictions"
    >
      <div className="filter-bar">
        {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((filter) => (
          <button
            key={filter}
            className={`filter-chip ${riskFilter === filter ? "active" : ""}`}
            onClick={() => setRiskFilter(filter)}
          >
            {filter === "ALL" ? "All Offenders" : `${filter} Risk`}
          </button>
        ))}
      </div>

      {!loading && (
        <div className="offender-grid">
          {offenders.map((o) => (
            <div key={o.offender_id} className="offender-card">
              <div className="offender-header">
                <div className="offender-avatar">
                  {o.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="offender-name">{o.name}</div>
                  <div className="offender-id">{o.offender_id} — Age {o.age}</div>
                </div>
                <span className={`risk-badge risk-${o.risk}`}>{o.risk}</span>
              </div>

              <div className="offender-stat">
                <span>District:</span> <strong>{o.district_code}</strong>
              </div>
              <div className="offender-stat">
                <span>Arrests / Convictions:</span> <strong>{o.arrests} / {o.convictions}</strong>
              </div>
              <div className="offender-stat">
                <span>Status:</span> <span className={`status-badge status-${o.status.replace(" ", "-")}`}>{o.status}</span>
              </div>

              <div className="offender-mo">
                <strong>MO:</strong> {o.mo}
              </div>

              {o.gang && <div className="offender-gang">👥 {o.gang}</div>}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};
