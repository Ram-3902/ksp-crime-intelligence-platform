import React, { useState, useEffect } from "react";
import { Download, AlertCircle } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title, subtitle }) => {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString("en-IN", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <span
          style={{
            fontSize: "0.75rem",
            color: "#475569",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            marginRight: 8,
          }}
        >
          {timeStr} IST
        </span>

        <button className="topbar-btn" onClick={() => window.print()}>
          <Download className="w-3.5 h-3.5 inline mr-1" /> Export
        </button>

        <button className="topbar-btn primary">
          <span className="topbar-alert-dot"></span>
          <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
          3 Live Alerts
        </button>
      </div>
    </header>
  );
};
