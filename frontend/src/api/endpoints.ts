import { apiClient } from "./client";
import type {
  KPISummaryData,
  DistrictData,
  HotspotData,
  NetworkNodeData,
  NetworkLinkData,
  OffenderData,
  PredictiveRiskData,
  AnomalyData,
  MonthlyCrimeData,
  YoYCrimeData,
} from "../types";

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const res = await apiClient.post("/auth/login", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // KPIs
  getKPIs: async (): Promise<KPISummaryData> => {
    const res = await apiClient.get("/kpis");
    return res.data;
  },

  // Crimes
  getMonthlyCrimes: async (): Promise<MonthlyCrimeData> => {
    const res = await apiClient.get("/crimes/monthly");
    return res.data;
  },
  getYoYCrimes: async (): Promise<YoYCrimeData> => {
    const res = await apiClient.get("/crimes/yoy");
    return res.data;
  },
  getDistrictsSummary: async () => {
    const res = await apiClient.get("/crimes/districts-summary");
    return res.data;
  },

  // Districts
  getDistricts: async (): Promise<DistrictData[]> => {
    const res = await apiClient.get("/districts");
    return res.data;
  },

  // Hotspots
  getHotspots: async (): Promise<HotspotData[]> => {
    const res = await apiClient.get("/hotspots");
    return res.data;
  },

  // Network Graph
  getNetworkNodes: async (): Promise<NetworkNodeData[]> => {
    const res = await apiClient.get("/network/nodes");
    return res.data;
  },
  getNetworkLinks: async (): Promise<NetworkLinkData[]> => {
    const res = await apiClient.get("/network/links");
    return res.data;
  },
  getNetworkGraph: async () => {
    const res = await apiClient.get("/network/graph");
    return res.data;
  },

  // Offenders
  getOffenders: async (risk?: string, status?: string): Promise<OffenderData[]> => {
    const params: Record<string, string> = {};
    if (risk) params.risk = risk;
    if (status) params.status = status;
    const res = await apiClient.get("/offenders", { params });
    return res.data;
  },

  // Predictive
  getPredictiveRisk: async (): Promise<PredictiveRiskData[]> => {
    const res = await apiClient.get("/predictive/risk");
    return res.data;
  },
  getAnomalies: async (): Promise<AnomalyData[]> => {
    const res = await apiClient.get("/predictive/anomalies");
    return res.data;
  },
};
