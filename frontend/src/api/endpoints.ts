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

// ── Static Fallback Data for Standalone Deployments ──────────────────────────
const FALLBACK_KPIS: KPISummaryData = {
  totalCrimes2024: 72840,
  totalCrimes2023: 68420,
  totalArrests2024: 52180,
  convictionRate: 68.4,
  cybercrimeSurge: 44.5,
  hotspotCount: 19,
  activeGangs: 24,
  pendingCases: 18450,
  crimeResolutionRate: 71.6,
  avgResponseTime: 12.4,
};

const FALLBACK_MONTHLY: MonthlyCrimeData = {
  labels: [
    "Jan'23","Feb'23","Mar'23","Apr'23","May'23","Jun'23",
    "Jul'23","Aug'23","Sep'23","Oct'23","Nov'23","Dec'23",
    "Jan'24","Feb'24","Mar'24","Apr'24","May'24","Jun'24",
    "Jul'24","Aug'24","Sep'24","Oct'24","Nov'24","Dec'24"
  ],
  datasets: {
    THEFT:   [420,390,410,455,478,502,530,521,498,511,490,467,445,418,432,470,495,520,548,539,516,528,507,483],
    ASSAULT: [180,172,185,195,210,225,240,235,218,229,215,195,195,185,198,210,228,245,262,256,238,248,233,212],
    CYBER:   [320,345,368,412,456,498,542,535,520,567,598,625,660,695,730,785,825,872,915,902,888,935,968,1010],
  },
};

const FALLBACK_YOY: YoYCrimeData = {
  years: [2022, 2023, 2024],
  types: ["THEFT", "CYBER", "FRAUD", "ASSAULT", "DRUG"],
  data: {
    "2022": { THEFT: 18200, CYBER: 8500, FRAUD: 7200, ASSAULT: 7800, DRUG: 5600 },
    "2023": { THEFT: 19500, CYBER: 12800, FRAUD: 7800, ASSAULT: 8100, DRUG: 6100 },
    "2024": { THEFT: 20800, CYBER: 18500, FRAUD: 8200, ASSAULT: 8500, DRUG: 6500 },
  },
};

const FALLBACK_DISTRICTS: DistrictData[] = [
  { id:1, code:"BLR_U", name:"Bengaluru Urban", division:"Bengaluru", lat:12.9716, lng:77.5946, population:9621551, urbanization:98, poverty:12, gdp_per_capita:425000, literacy:89, unemployment:8, gini:0.42 },
  { id:2, code:"MYS",   name:"Mysuru",          division:"Mysuru",    lat:12.2958, lng:76.6394, population:3001127, urbanization:55, poverty:18, gdp_per_capita:215000, literacy:81, unemployment:12, gini:0.38 },
  { id:3, code:"MAN",   name:"Mangaluru",       division:"Coastal",   lat:12.8698, lng:74.8425, population:2089649, urbanization:62, poverty:15, gdp_per_capita:220000, literacy:83, unemployment:11, gini:0.37 },
  { id:4, code:"HUB",   name:"Hubballi",        division:"Dharwad",   lat:15.3647, lng:75.1240, population:2143582, urbanization:65, poverty:20, gdp_per_capita:195000, literacy:78, unemployment:14, gini:0.39 },
  { id:5, code:"KAL",   name:"Kalaburagi",      division:"Gulbarga",  lat:17.3297, lng:76.8343, population:2564892, urbanization:35, poverty:35, gdp_per_capita:125000, literacy:68, unemployment:22, gini:0.38 },
];

const FALLBACK_HOTSPOTS: HotspotData[] = [
  { id:1, lat:12.9352, lng:77.6245, intensity:9, label:"Whitefield, BLR", crime_type:"CYBER" },
  { id:2, lat:12.9698, lng:77.5952, intensity:8, label:"MG Road, BLR", crime_type:"THEFT" },
  { id:3, lat:12.9010, lng:77.4990, intensity:9, label:"Kengeri, BLR", crime_type:"DRUG" },
  { id:4, lat:17.3297, lng:76.8343, intensity:8, label:"Kalaburagi City", crime_type:"MURDER" },
  { id:5, lat:15.1394, lng:76.9214, intensity:7, label:"Ballari Mining Belt", crime_type:"ROBBERY" },
];

const FALLBACK_OFFENDERS: OffenderData[] = [
  { id:1, offender_id:"S001", name:"Rajan Arumugam", age:34, district_code:"BLR_U", arrests:8, convictions:3, risk:"CRITICAL", mo:"Phishing & Banking Fraud via SIM Swap", gang:"Cyber Gang Alpha", status:"Absconding" },
  { id:2, offender_id:"S008", name:"Naveen Hegde", age:29, district_code:"HUB", arrests:10, convictions:5, risk:"CRITICAL", mo:"Targeted robbery with violence", gang:"NH Syndicate", status:"In Custody" },
  { id:3, offender_id:"S004", name:"Suresh Doddappa", age:41, district_code:"BAL", arrests:7, convictions:4, risk:"HIGH", mo:"Highway robbery, Dacoity", gang:"Road Wolves", status:"Bail" },
  { id:4, offender_id:"S002", name:"Vikram Babu", age:31, district_code:"BLR_U", arrests:6, convictions:2, risk:"HIGH", mo:"Online fraud & credential theft", gang:"Cyber Gang Alpha", status:"Bail" },
  { id:5, offender_id:"S006", name:"Deepak Fonseca", age:27, district_code:"MYS", arrests:5, convictions:2, risk:"MEDIUM", mo:"Drug courier — inter-district", gang:"Coastal Cartel", status:"In Custody" },
];

const FALLBACK_RISKS: PredictiveRiskData[] = [
  { id:1, district_code:"BLR_U", overall:82, cyber:95, violent:65, property:78, drug:58, trend:"up" },
  { id:2, district_code:"KAL",   overall:76, cyber:42, violent:88, property:65, drug:72, trend:"up" },
  { id:3, district_code:"BAL",   overall:72, cyber:38, violent:80, property:60, drug:68, trend:"flat" },
  { id:4, district_code:"BEL",   overall:70, cyber:35, violent:78, property:62, drug:65, trend:"up" },
  { id:5, district_code:"HUB",   overall:68, cyber:58, violent:72, property:64, drug:62, trend:"flat" },
];

const FALLBACK_ANOMALIES: AnomalyData[] = [
  { id:1, date:"2024-11-03", district_code:"KAL", crime_type:"MURDER", description:"3 homicides in 48hrs on NH-44 — possible gang war resurgence", severity:"CRITICAL", resolved:false },
  { id:2, date:"2024-10-18", district_code:"BLR_U", crime_type:"CYBER", description:"Coordinated SIM-swap attacks targeting 80+ bank accounts", severity:"HIGH", resolved:true },
  { id:3, date:"2024-09-22", district_code:"BAL", crime_type:"ROBBERY", description:"6 armed robberies in mining belt — same MO, unknown gang", severity:"HIGH", resolved:false },
];

const FALLBACK_GRAPH = {
  nodes: [
    { id:1, node_id:"S001", node_type:"suspect", label:"Rajan A.", gang:"G1", risk:9, offenses:8, mo:"Cybercrime", district_code:"BLR_U" },
    { id:2, node_id:"S002", node_type:"suspect", label:"Vikram B.", gang:"G1", risk:8, offenses:6, mo:"Cyber+Fraud", district_code:"BLR_U" },
    { id:3, node_id:"V001", node_type:"victim", label:"Anita K.", offenses:2, district_code:"BLR_U" },
    { id:4, node_id:"L001", node_type:"location", label:"ATM Cluster WF", offenses:12, district_code:"BLR_U" },
  ],
  links: [
    { id:1, source_id:"S001", target_id:"S002", source:"S001", target:"S002", weight:3, label:"Co-accused" },
    { id:2, source_id:"S001", target_id:"V001", source:"S001", target:"V001", weight:1, label:"Victim" },
    { id:3, source_id:"S001", target_id:"L001", source:"S001", target:"L001", weight:3, label:"Crime scene" },
  ],
};

export const api = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const res = await apiClient.post("/auth/login", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getKPIs: async (): Promise<KPISummaryData> => {
    try {
      const res = await apiClient.get("/kpis");
      return res.data;
    } catch {
      return FALLBACK_KPIS;
    }
  },

  getMonthlyCrimes: async (): Promise<MonthlyCrimeData> => {
    try {
      const res = await apiClient.get("/crimes/monthly");
      return res.data;
    } catch {
      return FALLBACK_MONTHLY;
    }
  },

  getYoYCrimes: async (): Promise<YoYCrimeData> => {
    try {
      const res = await apiClient.get("/crimes/yoy");
      return res.data;
    } catch {
      return FALLBACK_YOY;
    }
  },

  getDistrictsSummary: async () => {
    try {
      const res = await apiClient.get("/crimes/districts-summary");
      return res.data;
    } catch {
      return { totals: {}, by_type: {} };
    }
  },

  getDistricts: async (): Promise<DistrictData[]> => {
    try {
      const res = await apiClient.get("/districts");
      return res.data;
    } catch {
      return FALLBACK_DISTRICTS;
    }
  },

  getHotspots: async (): Promise<HotspotData[]> => {
    try {
      const res = await apiClient.get("/hotspots");
      return res.data;
    } catch {
      return FALLBACK_HOTSPOTS;
    }
  },

  getNetworkNodes: async (): Promise<NetworkNodeData[]> => {
    try {
      const res = await apiClient.get("/network/nodes");
      return res.data;
    } catch {
      return FALLBACK_GRAPH.nodes as any;
    }
  },

  getNetworkLinks: async (): Promise<NetworkLinkData[]> => {
    try {
      const res = await apiClient.get("/network/links");
      return res.data;
    } catch {
      return FALLBACK_GRAPH.links as any;
    }
  },

  getNetworkGraph: async () => {
    try {
      const res = await apiClient.get("/network/graph");
      return res.data;
    } catch {
      return FALLBACK_GRAPH;
    }
  },

  getOffenders: async (risk?: string, status?: string): Promise<OffenderData[]> => {
    try {
      const params: Record<string, string> = {};
      if (risk) params.risk = risk;
      if (status) params.status = status;
      const res = await apiClient.get("/offenders", { params });
      return res.data;
    } catch {
      let filtered = FALLBACK_OFFENDERS;
      if (risk && risk !== "ALL") filtered = filtered.filter((o) => o.risk === risk);
      if (status && status !== "ALL") filtered = filtered.filter((o) => o.status === status);
      return filtered;
    }
  },

  getPredictiveRisk: async (): Promise<PredictiveRiskData[]> => {
    try {
      const res = await apiClient.get("/predictive/risk");
      return res.data;
    } catch {
      return FALLBACK_RISKS;
    }
  },

  getAnomalies: async (): Promise<AnomalyData[]> => {
    try {
      const res = await apiClient.get("/predictive/anomalies");
      return res.data;
    } catch {
      return FALLBACK_ANOMALIES;
    }
  },
};
