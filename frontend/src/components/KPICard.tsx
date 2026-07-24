import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  icon: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "flat";
  color?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  icon,
  label,
  value,
  change,
  changeType = "flat",
  color = "#1a3a6e",
}) => {
  return (
    <div className="kpi-card" style={{ "--kpi-color": color } as React.CSSProperties}>
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {change && (
        <div className={`kpi-change ${changeType}`}>
          {changeType === "up" && <TrendingUp className="w-3 h-3 inline" />}
          {changeType === "down" && <TrendingDown className="w-3 h-3 inline" />}
          {changeType === "flat" && <Minus className="w-3 h-3 inline" />}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
};
