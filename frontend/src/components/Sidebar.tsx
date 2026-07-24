import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Share2,
  BrainCircuit,
  TrendingUp,
  Users,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: "/", label: "Overview Dashboard", icon: LayoutDashboard, section: "Intelligence" },
    { to: "/map", label: "Crime Heatmap", icon: MapPin, section: "Intelligence" },
    { to: "/network", label: "Network Analysis", icon: Share2, section: "Intelligence" },
    { to: "/predictive", label: "Predictive Analytics", icon: BrainCircuit, section: "AI/ML Analytics", badge: "NEW" },
    { to: "/trends", label: "Trend Discovery", icon: TrendingUp, section: "AI/ML Analytics" },
    { to: "/offenders", label: "Offender Profiles", icon: Users, section: "Intelligence Records" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1>KSP CIAP</h1>
          <div className="subtitle">Crime Intelligence Platform</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {["Intelligence", "AI/ML Analytics", "Intelligence Records"].map((section) => (
          <React.Fragment key={section}>
            <div className="nav-section-label">{section}</div>
            {navItems
              .filter((item) => item.section === section)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                  >
                    <Icon className="nav-icon text-white/80" />
                    <span>{item.label}</span>
                    {item.badge && <span className="badge">{item.badge}</span>}
                  </NavLink>
                );
              })}
          </React.Fragment>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : "SP"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.full_name || "Police Analyst"}
            </div>
            <div className="user-role">{user?.division || "SCRB HQ"}</div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
