export interface User {
  username: string;
  full_name: string;
  role: string;
  division: string;
}

export interface KPISummaryData {
  totalCrimes2024: number;
  totalCrimes2023: number;
  totalArrests2024: number;
  convictionRate: number;
  cybercrimeSurge: number;
  hotspotCount: number;
  activeGangs: number;
  pendingCases: number;
  crimeResolutionRate: number;
  avgResponseTime: number;
}

export interface DistrictData {
  id: number;
  code: string;
  name: string;
  division: string;
  lat: number;
  lng: number;
  population: number;
  urbanization: number;
  poverty: number;
  gdp_per_capita: number;
  literacy: number;
  unemployment: number;
  gini: number;
}

export interface HotspotData {
  id: number;
  lat: number;
  lng: number;
  intensity: number;
  label: string;
  crime_type: string;
}

export interface NetworkNodeData {
  id: number;
  node_id: string;
  node_type: "suspect" | "victim" | "location";
  label: string;
  gang?: string;
  risk?: number;
  offenses: number;
  mo?: string;
  district_code?: string;
}

export interface NetworkLinkData {
  id: number;
  source_id: string;
  target_id: string;
  weight: number;
  label: string;
}

export interface OffenderData {
  id: number;
  offender_id: string;
  name: string;
  age: number;
  district_code: string;
  arrests: number;
  convictions: number;
  risk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  mo: string;
  gang?: string;
  status: "In Custody" | "Bail" | "Absconding";
}

export interface PredictiveRiskData {
  id: number;
  district_code: string;
  overall: number;
  cyber: number;
  violent: number;
  property: number;
  drug: number;
  trend: "up" | "flat" | "down";
}

export interface AnomalyData {
  id: number;
  date: string;
  district_code: string;
  crime_type: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  resolved: boolean;
}

export interface MonthlyCrimeData {
  labels: string[];
  datasets: Record<string, number[]>;
}

export interface YoYCrimeData {
  years: number[];
  types: string[];
  data: Record<string, Record<string, number>>;
}
