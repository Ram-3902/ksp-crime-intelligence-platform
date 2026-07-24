# 🛡️ Karnataka State Police — Crime Intelligence & Analytical Platform (KSP-CIAP)
## Executive Prototype Brief & Project Summary

---

## 📌 1. Project Title & Overview
- **Project Title:** KSP Crime Intelligence & Analytical Platform (CIAP)
- **Target Organization:** State Crime Records Bureau (SCRB), Karnataka State Police
- **Platform Type:** Production-Ready Full-Stack Web Application (React + Python FastAPI + SQLite)
- **Design System:** Government White UI Theme (NIC / India.gov.in standard)

---

## 🎯 2. Problem Statement Addressed

1. **Data Silos & Manual Processes:** Crime records across 15 Karnataka divisions were traditionally managed in independent spreadsheets, delaying state-wide synthesis.
2. **Lack of Advanced Relational Analytics:** Absence of network link analysis left hidden criminal syndicates, suspect-victim associations, and MO patterns undiscovered.
3. **Fragmented Reporting:** Limited real-time visibility for the State Crime Records Bureau (SCRB) into emerging hotspots.
4. **Reactive vs. Proactive Policing:** Lack of predictive forecasting forced law enforcement to remain reactive rather than preventing crimes based on spatiotemporal risk indicators.

---

## 💡 3. Proposed Solution

The **KSP Crime Intelligence Platform (KSP-CIAP)** unifies fragmented crime data into an automated, interactive intelligence portal featuring 6 specialized modules:

1. **Command & Control Dashboard:** 8 real-time KPI metrics, 24-month crime trend lines, district crime distribution bars, and year-over-year growth comparisons.
2. **Geospatial Hotspot Map:** Interactive Leaflet map visualizing 15 district risk circles, 19 intensity hotspots, and 8 crime-type filter overlays.
3. **Criminal Network & Link Analysis:** D3 force-directed relationship graph mapping 20 nodes (suspects, victims, crime scenes, gangs) with association detection insights.
4. **AI-Driven Predictive Analytics:** District composite risk scoring (0–100), 5-axis multi-dimensional risk radar, socio-economic correlation matrix, and live anomaly detection alerts.
5. **Pattern & Trend Discovery:** 7-day × 24-hour crime density heatmap matrix (168 time-slots), modus operandi (MO) frequency analysis, and YoY growth rate tracking.
6. **Offender Intelligence Profiles:** Risk-ranked repeat offender database with cross-jurisdictional MO tracking, gang affiliation summary, and custody status badges.

---

## 🏗️ 4. Technical Architecture

```
[Browser Client] ── React 18 + Vite + TypeScript (Government White UI)
                        │
                        ▼ (Axios REST + JWT Authorization Bearer)
[API Server]      ── Python 3.13 + FastAPI + SQLModel ORM + Bcrypt Hashing
                        │
                        ▼ (SQL Queries)
[Database]        ── SQLite Relational Engine (ksp_ciap.db)
```

- **Frontend Tech:** React 18, Vite, TypeScript, Chart.js, React-Leaflet, D3.js, Lucide Icons.
- **Backend Tech:** Python FastAPI, SQLModel ORM, Uvicorn, Python-Jose (JWT), Bcrypt.
- **Database:** SQLite relational schema (`User`, `District`, `MonthlyCrime`, `Hotspot`, `NetworkNode`, `NetworkLink`, `Offender`, `PredictiveRisk`, `Anomaly`).
- **Security:** Role-Based Access Control (Admin, Analyst, Viewer) with 8-hour JWT token sessions.

---

## 🌟 5. Key Innovations & Impact

- **360° Syndicate Visibility:** Exposes hidden cross-district gang links (e.g. Cyber Gang Alpha, Road Wolves, Coastal Cartel) via D3 force-directed graphs.
- **Spatiotemporal Heatmapping:** Identifies high-risk crime windows (e.g. Friday/Saturday 22:00–02:00 peak hours) for strategic patrol deployment.
- **Socio-Economic Correlation:** Correlates district unemployment rates and GDP per capita against crime density per 100k population.
- **Proactive Anomaly Alerts:** Automated detection triggers for sudden crime spikes (e.g. SIM-swap surges in Bengaluru, highway robbery clusters on NH-44).

---

## 🔑 6. Demo Access Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Crime Analyst** | `analyst` | `Analyst@123` | Full Intelligence & Analytics Access |
| **Administrator** | `admin` | `Admin@123` | Full System Administration |
| **District Officer** | `viewer` | `Viewer@123` | Read-Only District Reporting |
