import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Lock, User, AlertCircle } from "lucide-react";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("analyst");
  const [password, setPassword] = useState("Analyst@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a3a6e 0%, #0f2447 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          width: "100%",
          maxWidth: 420,
          padding: 36,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#1a3a6e",
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2332", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Karnataka State Police
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 4 }}>
            State Crime Records Bureau — Intelligence Platform
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fde8e8",
              border: "1px solid #f5b8b8",
              color: "#c0392b",
              padding: "10px 14px",
              borderRadius: 4,
              fontSize: "0.78rem",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase" }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <User style={{ position: "absolute", left: 12, top: 11, width: 16, height: 16, color: "#9ca3af" }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter official username"
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 38px",
                  borderRadius: 4,
                  border: "1px solid #b0bbcb",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: 12, top: 11, width: 16, height: 16, color: "#9ca3af" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 38px",
                  borderRadius: 4,
                  border: "1px solid #b0bbcb",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px",
              background: "#1a3a6e",
              color: "#ffffff",
              border: "none",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: loading ? "wait" : "pointer",
              transition: "all 0.18s ease",
            }}
          >
            {loading ? "Authenticating..." : "Officer Login"}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #eef1f6", textAlign: "center", fontSize: "0.7rem", color: "#6b7280" }}>
          <div><strong>Demo Accounts:</strong></div>
          <div style={{ fontFamily: "monospace", marginTop: 4 }}>
            admin / Admin@123 | analyst / Analyst@123
          </div>
        </div>
      </div>
    </div>
  );
};
