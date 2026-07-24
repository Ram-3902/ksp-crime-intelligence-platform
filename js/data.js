
// ============================================================
// KSP Crime Intelligence Platform — Synthetic Data Module
// ============================================================

const KSP_DATA = {

  // ── Districts ────────────────────────────────────────────
  districts: [
    { id: "BLR_U", name: "Bengaluru Urban",    lat: 12.9716, lng: 77.5946, division: "Bengaluru",  population: 9621551, urbanization: 98, poverty: 12 },
    { id: "BLR_R", name: "Bengaluru Rural",    lat: 13.1500, lng: 77.5200, division: "Bengaluru",  population: 990923,  urbanization: 28, poverty: 22 },
    { id: "MYS",   name: "Mysuru",             lat: 12.2958, lng: 76.6394, division: "Mysuru",     population: 3001127, urbanization: 55, poverty: 18 },
    { id: "MAN",   name: "Mangaluru",          lat: 12.8698, lng: 74.8425, division: "Coastal",    population: 2089649, urbanization: 62, poverty: 15 },
    { id: "HUB",   name: "Hubballi-Dharwad",   lat: 15.3647, lng: 75.1240, division: "Dharwad",    population: 2143582, urbanization: 65, poverty: 20 },
    { id: "BEL",   name: "Belagavi",           lat: 15.8497, lng: 74.4977, division: "Belgaum",    population: 4814803, urbanization: 30, poverty: 28 },
    { id: "KAL",   name: "Kalaburagi",         lat: 17.3297, lng: 76.8343, division: "Gulbarga",   population: 2564892, urbanization: 35, poverty: 35 },
    { id: "BAL",   name: "Ballari",            lat: 15.1394, lng: 76.9214, division: "Bellary",    population: 2531592, urbanization: 40, poverty: 30 },
    { id: "SHI",   name: "Shivamogga",         lat: 13.9299, lng: 75.5681, division: "Shivamogga", population: 1755512, urbanization: 45, poverty: 22 },
    { id: "DAV",   name: "Davangere",          lat: 14.4644, lng: 75.9218, division: "Davangere",  population: 1977550, urbanization: 48, poverty: 25 },
    { id: "TUM",   name: "Tumakuru",           lat: 13.3409, lng: 77.1010, division: "Bengaluru",  population: 2678980, urbanization: 32, poverty: 23 },
    { id: "VIJ",   name: "Vijayapura",         lat: 16.8302, lng: 75.7100, division: "Gulbarga",   population: 2175102, urbanization: 33, poverty: 32 },
    { id: "UDU",   name: "Udupi",              lat: 13.3409, lng: 74.7421, division: "Coastal",    population: 1177361, urbanization: 50, poverty: 14 },
    { id: "CHI",   name: "Chikkamagaluru",     lat: 13.3153, lng: 75.7754, division: "Shivamogga", population: 1137961, urbanization: 28, poverty: 20 },
    { id: "KOD",   name: "Kodagu",             lat: 12.3375, lng: 75.8069, division: "Mysuru",     population: 554762,  urbanization: 22, poverty: 16 },
  ],

  // ── Crime Types ──────────────────────────────────────────
  crimeTypes: [
    { id: "THEFT",   label: "Theft & Burglary",   color: "#f59e0b", severity: 2 },
    { id: "ASSAULT", label: "Assault & Battery",  color: "#ef4444", severity: 3 },
    { id: "MURDER",  label: "Murder & Attempt",   color: "#7c3aed", severity: 5 },
    { id: "ROBBERY", label: "Robbery & Dacoity",  color: "#dc2626", severity: 4 },
    { id: "CYBER",   label: "Cybercrime",         color: "#06b6d4", severity: 3 },
    { id: "FRAUD",   label: "Fraud & Cheating",   color: "#10b981", severity: 2 },
    { id: "KIDNAP",  label: "Kidnapping",         color: "#f97316", severity: 4 },
    { id: "DRUG",    label: "Drug Offenses",      color: "#8b5cf6", severity: 3 },
    { id: "SEXUAL",  label: "Sexual Offenses",    color: "#e11d48", severity: 5 },
    { id: "ARSON",   label: "Arson",              color: "#fb923c", severity: 3 },
  ],

  // ── Monthly Crime Counts (2023-2024) ─────────────────────
  monthlyTrends: {
    labels: ["Jan'23","Feb'23","Mar'23","Apr'23","May'23","Jun'23",
             "Jul'23","Aug'23","Sep'23","Oct'23","Nov'23","Dec'23",
             "Jan'24","Feb'24","Mar'24","Apr'24","May'24","Jun'24",
             "Jul'24","Aug'24","Sep'24","Oct'24","Nov'24","Dec'24"],
    datasets: {
      THEFT:   [420,390,410,455,478,502,530,521,498,511,490,467,445,418,432,470,495,520,548,539,516,528,507,483],
      ASSAULT: [180,172,185,195,210,225,240,235,218,229,215,195,195,185,198,210,228,245,262,256,238,248,233,212],
      MURDER:  [28,24,31,26,29,32,34,30,27,31,28,25,26,22,29,24,27,30,32,28,25,29,26,23],
      ROBBERY: [95,88,97,105,112,120,128,124,115,119,110,102,100,93,103,112,120,129,138,133,123,127,118,108],
      CYBER:   [320,345,368,412,456,498,542,535,520,567,598,625,660,695,730,785,825,872,915,902,888,935,968,1010],
      FRAUD:   [210,198,215,228,242,258,272,268,252,261,248,235,220,208,225,240,255,272,288,283,266,275,260,247],
      KIDNAP:  [22,19,24,21,23,26,28,25,22,24,21,19,20,18,22,19,21,24,26,23,20,22,19,17],
      DRUG:    [145,138,152,168,182,196,210,204,190,198,185,172,155,148,163,180,196,212,228,222,207,215,201,188],
      SEXUAL:  [42,38,45,48,52,56,60,57,53,55,51,47,44,40,47,51,55,59,63,60,56,58,54,50],
      ARSON:   [18,15,19,22,25,28,30,27,24,26,23,20,19,16,20,23,26,30,32,29,26,28,24,21],
    }
  },

  // ── District Crime Summary (2024) ───────────────────────
  districtCrimes: {
    BLR_U: { THEFT:2850, ASSAULT:1120, MURDER:145, ROBBERY:620, CYBER:4200, FRAUD:1350, KIDNAP:98,  DRUG:880,  SEXUAL:310, ARSON:95  },
    BLR_R: { THEFT:680,  ASSAULT:290,  MURDER:38,  ROBBERY:145, CYBER:520,  FRAUD:280,  KIDNAP:22,  DRUG:195,  SEXUAL:68,  ARSON:28  },
    MYS:   { THEFT:920,  ASSAULT:420,  MURDER:58,  ROBBERY:210, CYBER:680,  FRAUD:380,  KIDNAP:32,  DRUG:295,  SEXUAL:102, ARSON:42  },
    MAN:   { THEFT:780,  ASSAULT:310,  MURDER:42,  ROBBERY:165, CYBER:590,  FRAUD:310,  KIDNAP:28,  DRUG:215,  SEXUAL:78,  ARSON:32  },
    HUB:   { THEFT:860,  ASSAULT:380,  MURDER:52,  ROBBERY:190, CYBER:580,  FRAUD:340,  KIDNAP:29,  DRUG:260,  SEXUAL:90,  ARSON:38  },
    BEL:   { THEFT:1120, ASSAULT:510,  MURDER:72,  ROBBERY:255, CYBER:380,  FRAUD:420,  KIDNAP:42,  DRUG:310,  SEXUAL:118, ARSON:52  },
    KAL:   { THEFT:750,  ASSAULT:350,  MURDER:65,  ROBBERY:180, CYBER:250,  FRAUD:290,  KIDNAP:38,  DRUG:280,  SEXUAL:98,  ARSON:45  },
    BAL:   { THEFT:680,  ASSAULT:320,  MURDER:58,  ROBBERY:165, CYBER:220,  FRAUD:265,  KIDNAP:34,  DRUG:260,  SEXUAL:88,  ARSON:40  },
    SHI:   { THEFT:590,  ASSAULT:270,  MURDER:42,  ROBBERY:140, CYBER:310,  FRAUD:230,  KIDNAP:28,  DRUG:210,  SEXUAL:72,  ARSON:32  },
    DAV:   { THEFT:620,  ASSAULT:285,  MURDER:46,  ROBBERY:148, CYBER:295,  FRAUD:240,  KIDNAP:30,  DRUG:225,  SEXUAL:76,  ARSON:35  },
    TUM:   { THEFT:710,  ASSAULT:325,  MURDER:50,  ROBBERY:170, CYBER:340,  FRAUD:275,  KIDNAP:32,  DRUG:240,  SEXUAL:84,  ARSON:38  },
    VIJ:   { THEFT:680,  ASSAULT:315,  MURDER:60,  ROBBERY:165, CYBER:230,  FRAUD:260,  KIDNAP:36,  DRUG:265,  SEXUAL:92,  ARSON:43  },
    UDU:   { THEFT:340,  ASSAULT:155,  MURDER:22,  ROBBERY:82,  CYBER:310,  FRAUD:148,  KIDNAP:14,  DRUG:105,  SEXUAL:38,  ARSON:16  },
    CHI:   { THEFT:290,  ASSAULT:130,  MURDER:19,  ROBBERY:68,  CYBER:165,  FRAUD:125,  KIDNAP:11,  DRUG:95,   SEXUAL:32,  ARSON:14  },
    KOD:   { THEFT:142,  ASSAULT:65,   MURDER:10,  ROBBERY:34,  CYBER:88,   FRAUD:62,   KIDNAP:6,   DRUG:48,   SEXUAL:16,  ARSON:7   },
  },

  // ── Hotspot Incidents ──────────────────────────────────
  hotspots: [
    { lat:12.9352, lng:77.6245, intensity:9, label:"Whitefield, BLR",   type:"CYBER"   },
    { lat:12.9698, lng:77.5952, intensity:8, label:"MG Road, BLR",      type:"THEFT"   },
    { lat:12.9540, lng:77.4960, intensity:7, label:"Rajajinagar, BLR",  type:"ROBBERY" },
    { lat:12.9010, lng:77.4990, intensity:9, label:"Kengeri, BLR",      type:"DRUG"    },
    { lat:12.9830, lng:77.7500, intensity:6, label:"Marathahalli, BLR", type:"ASSAULT" },
    { lat:12.9279, lng:77.6271, intensity:7, label:"HSR Layout, BLR",   type:"FRAUD"   },
    { lat:13.0268, lng:77.5509, intensity:5, label:"Hebbal, BLR",       type:"THEFT"   },
    { lat:12.2958, lng:76.6394, intensity:6, label:"Mysuru City",       type:"ASSAULT" },
    { lat:12.3054, lng:76.6516, intensity:5, label:"Chamundi Area, MYS",type:"THEFT"   },
    { lat:15.3647, lng:75.1240, intensity:7, label:"Hubballi Central",  type:"ROBBERY" },
    { lat:15.3500, lng:75.1400, intensity:6, label:"Dharwad Town",      type:"DRUG"    },
    { lat:15.8497, lng:74.4977, intensity:6, label:"Belagavi City",     type:"ASSAULT" },
    { lat:12.8698, lng:74.8425, intensity:5, label:"Mangaluru Port",    type:"DRUG"    },
    { lat:17.3297, lng:76.8343, intensity:8, label:"Kalaburagi City",   type:"MURDER"  },
    { lat:15.1394, lng:76.9214, intensity:7, label:"Ballari Mining Belt",type:"ROBBERY"},
    { lat:13.3409, lng:77.1010, intensity:5, label:"Tumakuru Town",     type:"THEFT"   },
    { lat:16.8302, lng:75.7100, intensity:6, label:"Vijayapura City",   type:"ASSAULT" },
    { lat:13.9299, lng:75.5681, intensity:5, label:"Shivamogga City",   type:"DRUG"    },
    { lat:14.4644, lng:75.9218, intensity:5, label:"Davangere Town",    type:"THEFT"   },
  ],

  // ── Network Nodes ─────────────────────────────────────
  networkNodes: [
    { id:"S001", type:"suspect",  label:"Rajan A.",    gang:"G1", risk:9, offenses:8,  mo:"Cybercrime", district:"BLR_U" },
    { id:"S002", type:"suspect",  label:"Vikram B.",   gang:"G1", risk:8, offenses:6,  mo:"Cyber+Fraud",district:"BLR_U" },
    { id:"S003", type:"suspect",  label:"Mohan C.",    gang:"G2", risk:7, offenses:5,  mo:"Robbery",    district:"KAL"   },
    { id:"S004", type:"suspect",  label:"Suresh D.",   gang:"G2", risk:8, offenses:7,  mo:"Robbery",    district:"BAL"   },
    { id:"S005", type:"suspect",  label:"Arun E.",     gang:"G3", risk:6, offenses:4,  mo:"Drug Trade", district:"MAN"   },
    { id:"S006", type:"suspect",  label:"Deepak F.",   gang:"G3", risk:7, offenses:5,  mo:"Drug Trade", district:"MYS"   },
    { id:"S007", type:"suspect",  label:"Kiran G.",    gang:"G1", risk:5, offenses:3,  mo:"Fraud",      district:"BLR_U" },
    { id:"S008", type:"suspect",  label:"Naveen H.",   gang:"G4", risk:9, offenses:10, mo:"Murder+Rob", district:"HUB"   },
    { id:"S009", type:"suspect",  label:"Prasad I.",   gang:"G4", risk:8, offenses:8,  mo:"Assault",    district:"BEL"   },
    { id:"S010", type:"suspect",  label:"Rajesh J.",   gang:"G2", risk:6, offenses:4,  mo:"Theft",      district:"TUM"   },
    { id:"V001", type:"victim",   label:"Anita K.",    gang:null, risk:null, offenses:2, mo:null, district:"BLR_U" },
    { id:"V002", type:"victim",   label:"Sunil L.",    gang:null, risk:null, offenses:3, mo:null, district:"BLR_U" },
    { id:"V003", type:"victim",   label:"Meena M.",    gang:null, risk:null, offenses:1, mo:null, district:"MYS"   },
    { id:"V004", type:"victim",   label:"Ravi N.",     gang:null, risk:null, offenses:2, mo:null, district:"KAL"   },
    { id:"V005", type:"victim",   label:"Lakshmi O.",  gang:null, risk:null, offenses:1, mo:null, district:"HUB"   },
    { id:"L001", type:"location", label:"ATM Cluster WF", gang:null, risk:null, offenses:12, mo:null, district:"BLR_U" },
    { id:"L002", type:"location", label:"Bus Stand BLR",  gang:null, risk:null, offenses:8,  mo:null, district:"BLR_U" },
    { id:"L003", type:"location", label:"NH-44 Stretch",  gang:null, risk:null, offenses:15, mo:null, district:"KAL"   },
    { id:"L004", type:"location", label:"Port Area MAN",  gang:null, risk:null, offenses:9,  mo:null, district:"MAN"   },
    { id:"L005", type:"location", label:"Old City HUB",   gang:null, risk:null, offenses:7,  mo:null, district:"HUB"   },
  ],

  networkLinks: [
    { source:"S001", target:"S002", weight:3, label:"Co-accused" },
    { source:"S001", target:"S007", weight:2, label:"Associate"  },
    { source:"S002", target:"S007", weight:2, label:"Co-accused" },
    { source:"S001", target:"V001", weight:1, label:"Victim"     },
    { source:"S002", target:"V002", weight:1, label:"Victim"     },
    { source:"S001", target:"L001", weight:3, label:"Crime scene"},
    { source:"S002", target:"L001", weight:3, label:"Crime scene"},
    { source:"S003", target:"S004", weight:3, label:"Co-accused" },
    { source:"S003", target:"S010", weight:2, label:"Associate"  },
    { source:"S004", target:"S010", weight:2, label:"Associate"  },
    { source:"S003", target:"V004", weight:1, label:"Victim"     },
    { source:"S004", target:"L003", weight:3, label:"Crime scene"},
    { source:"S003", target:"L003", weight:3, label:"Crime scene"},
    { source:"S005", target:"S006", weight:3, label:"Co-accused" },
    { source:"S005", target:"L004", weight:2, label:"Crime scene"},
    { source:"S006", target:"L004", weight:2, label:"Crime scene"},
    { source:"S008", target:"S009", weight:3, label:"Co-accused" },
    { source:"S008", target:"V005", weight:1, label:"Victim"     },
    { source:"S009", target:"V003", weight:1, label:"Victim"     },
    { source:"S008", target:"L005", weight:3, label:"Crime scene"},
    { source:"S007", target:"V001", weight:1, label:"Victim"     },
    { source:"S007", target:"L002", weight:2, label:"Crime scene"},
    { source:"S001", target:"S003", weight:1, label:"Linked"     },
    { source:"S008", target:"S003", weight:1, label:"Linked"     },
  ],

  // ── Offender Profiles ─────────────────────────────────
  offenders: [
    { id:"S001", name:"Rajan Arumugam",   age:34, district:"BLR_U", arrests:8,  convictions:3, risk:"CRITICAL", mo:"Phishing & Banking Fraud via SIM Swap",  gang:"Cyber Gang Alpha",  status:"Absconding" },
    { id:"S008", name:"Naveen Hegde",     age:29, district:"HUB",   arrests:10, convictions:5, risk:"CRITICAL", mo:"Targeted robbery with violence",         gang:"NH Syndicate",       status:"In Custody" },
    { id:"S004", name:"Suresh Doddappa",  age:41, district:"BAL",   arrests:7,  convictions:4, risk:"HIGH",     mo:"Highway robbery, Dacoity",               gang:"Road Wolves",        status:"Bail"       },
    { id:"S002", name:"Vikram Babu",      age:31, district:"BLR_U", arrests:6,  convictions:2, risk:"HIGH",     mo:"Online fraud & credential theft",        gang:"Cyber Gang Alpha",   status:"Bail"       },
    { id:"S009", name:"Prasad Ingalagi",  age:37, district:"BEL",   arrests:8,  convictions:4, risk:"HIGH",     mo:"Assault & extortion",                   gang:"NH Syndicate",       status:"Bail"       },
    { id:"S006", name:"Deepak Fonseca",   age:27, district:"MYS",   arrests:5,  convictions:2, risk:"MEDIUM",   mo:"Drug courier — inter-district",          gang:"Coastal Cartel",     status:"In Custody" },
    { id:"S003", name:"Mohan Channappa",  age:45, district:"KAL",   arrests:5,  convictions:3, risk:"HIGH",     mo:"Armed robbery on NH-44",                gan:"Road Wolves",         status:"Absconding" },
    { id:"S005", name:"Arun Emmanuel",    age:23, district:"MAN",   arrests:4,  convictions:1, risk:"MEDIUM",   mo:"Drug distribution — coastal route",      gang:"Coastal Cartel",     status:"In Custody" },
    { id:"S007", name:"Kiran Gowda",      age:36, district:"BLR_U", arrests:3,  convictions:1, risk:"MEDIUM",   mo:"Online investment fraud",                gang:"Cyber Gang Alpha",   status:"Bail"       },
    { id:"S010", name:"Rajesh Jadav",     age:32, district:"TUM",   arrests:4,  convictions:2, risk:"MEDIUM",   mo:"Vehicle theft network",                  gang:"Road Wolves",        status:"Bail"       },
  ],

  // ── Predictive Risk Scores ─────────────────────────────
  predictiveRisk: [
    { district:"BLR_U", overall:82, cyber:95, violent:65, property:78, drug:58, trend:"up"   },
    { district:"KAL",   overall:76, cyber:42, violent:88, property:65, drug:72, trend:"up"   },
    { district:"BAL",   overall:72, cyber:38, violent:80, property:60, drug:68, trend:"flat" },
    { district:"BEL",   overall:70, cyber:35, violent:78, property:62, drug:65, trend:"up"   },
    { district:"HUB",   overall:68, cyber:58, violent:72, property:64, drug:62, trend:"flat" },
    { district:"MYS",   overall:62, cyber:60, violent:58, property:55, drug:55, trend:"down" },
    { district:"VIJ",   overall:65, cyber:40, violent:75, property:58, drug:68, trend:"up"   },
    { district:"DAV",   overall:58, cyber:45, violent:62, property:52, drug:55, trend:"flat" },
    { district:"TUM",   overall:55, cyber:48, violent:58, property:50, drug:50, trend:"flat" },
    { district:"SHI",   overall:52, cyber:50, violent:55, property:48, drug:52, trend:"down" },
    { district:"MAN",   overall:58, cyber:55, violent:52, property:50, drug:65, trend:"flat" },
    { district:"BLR_R", overall:48, cyber:30, violent:50, property:45, drug:42, trend:"down" },
    { district:"UDU",   overall:40, cyber:42, violent:38, property:35, drug:38, trend:"down" },
    { district:"CHI",   overall:38, cyber:28, violent:40, property:32, drug:35, trend:"flat" },
    { district:"KOD",   overall:30, cyber:22, violent:30, property:28, drug:30, trend:"down" },
  ],

  // ── Anomaly Events ────────────────────────────────────
  anomalies: [
    { date:"2024-11-03", district:"KAL",   type:"MURDER",  description:"3 homicides in 48hrs on NH-44 — possible gang war resurgence", severity:"CRITICAL", resolved:false },
    { date:"2024-10-18", district:"BLR_U", type:"CYBER",   description:"Coordinated SIM-swap attacks targeting 80+ bank accounts",      severity:"HIGH",     resolved:true  },
    { date:"2024-09-22", district:"BAL",   type:"ROBBERY", description:"6 armed robberies in mining belt — same MO, unknown gang",      severity:"HIGH",     resolved:false },
    { date:"2024-09-05", district:"MAN",   type:"DRUG",    description:"32 kg MDMA seizure — suggests new coastal entry point",         severity:"HIGH",     resolved:false },
    { date:"2024-08-14", district:"HUB",   type:"ASSAULT", description:"Communal tension — 12 assault incidents in 6 hrs",              severity:"CRITICAL", resolved:true  },
    { date:"2024-07-29", district:"BEL",   type:"KIDNAP",  description:"4 child abductions reported — cross-district pattern",          severity:"CRITICAL", resolved:false },
    { date:"2024-06-12", district:"BLR_U", type:"FRAUD",   description:"Fake investment scheme — 250+ victims, Rs.4.2 Cr loss",         severity:"HIGH",     resolved:true  },
    { date:"2024-05-20", district:"VIJ",   type:"ARSON",   description:"Agricultural land disputes — 8 arson incidents in 10 days",     severity:"MEDIUM",   resolved:true  },
  ],

  // ── Time-of-Day Distribution ─────────────────────────
  timeOfDay: {
    hours: Array.from({length:24}, (_,i) => `${String(i).padStart(2,"0")}:00`),
    THEFT:   [5,3,2,2,3,4,8,14,18,20,22,24,20,18,16,15,18,22,28,32,30,25,18,10],
    ASSAULT: [15,12,8,6,4,4,5,6,8,9,10,12,10,9,9,10,12,16,20,28,35,40,32,22],
    MURDER:  [8,6,4,3,2,2,3,4,4,4,5,5,5,4,4,4,5,6,7,9,10,12,10,8],
    ROBBERY: [18,15,10,8,6,5,6,8,10,10,11,12,10,10,10,11,13,16,20,24,22,20,18,16],
    CYBER:   [8,6,5,4,3,3,5,10,18,28,32,35,30,28,25,22,20,22,25,22,18,14,10,8],
    DRUG:    [12,15,18,14,10,8,7,7,8,8,8,9,9,9,8,8,9,10,12,14,16,18,16,13],
  },

  // ── YoY Comparison ────────────────────────────────────
  yoyComparison: {
    2022: { THEFT:18200, ASSAULT:7800, MURDER:1050, ROBBERY:3900, CYBER:8500,  FRAUD:7200, KIDNAP:820, DRUG:5600, SEXUAL:1800, ARSON:780 },
    2023: { THEFT:19500, ASSAULT:8100, MURDER:1020, ROBBERY:4050, CYBER:12800, FRAUD:7800, KIDNAP:850, DRUG:6100, SEXUAL:1900, ARSON:810 },
    2024: { THEFT:20800, ASSAULT:8500, MURDER:980,  ROBBERY:4200, CYBER:18500, FRAUD:8200, KIDNAP:820, DRUG:6500, SEXUAL:2000, ARSON:840 },
  },

  // ── KPI Summary ──────────────────────────────────────
  kpis: {
    totalCrimes2024:      72840,
    totalCrimes2023:      68420,
    totalArrests2024:     52180,
    convictionRate:       68.4,
    cybercrimeSurge:      44.5,
    hotspotCount:         19,
    activeGangs:          24,
    pendingCases:         18450,
    crimeResolutionRate:  71.6,
    avgResponseTime:      12.4,
  },

  // ── Socio-Economic Indicators ────────────────────────────
  socioEconomic: {
    BLR_U: { gdp_per_capita: 425000, literacy: 89, unemployment:  8, gini: 0.42 },
    KAL:   { gdp_per_capita: 125000, literacy: 68, unemployment: 22, gini: 0.38 },
    BAL:   { gdp_per_capita: 138000, literacy: 70, unemployment: 20, gini: 0.40 },
    BEL:   { gdp_per_capita: 142000, literacy: 72, unemployment: 18, gini: 0.37 },
    HUB:   { gdp_per_capita: 195000, literacy: 78, unemployment: 14, gini: 0.39 },
    MYS:   { gdp_per_capita: 215000, literacy: 81, unemployment: 12, gini: 0.38 },
    VIJ:   { gdp_per_capita: 132000, literacy: 69, unemployment: 21, gini: 0.39 },
    DAV:   { gdp_per_capita: 158000, literacy: 74, unemployment: 16, gini: 0.37 },
    TUM:   { gdp_per_capita: 162000, literacy: 75, unemployment: 15, gini: 0.36 },
    SHI:   { gdp_per_capita: 172000, literacy: 77, unemployment: 13, gini: 0.35 },
    MAN:   { gdp_per_capita: 220000, literacy: 83, unemployment: 11, gini: 0.37 },
    BLR_R: { gdp_per_capita: 185000, literacy: 76, unemployment: 12, gini: 0.35 },
    UDU:   { gdp_per_capita: 210000, literacy: 85, unemployment: 10, gini: 0.34 },
    CHI:   { gdp_per_capita: 168000, literacy: 76, unemployment: 14, gini: 0.34 },
    KOD:   { gdp_per_capita: 195000, literacy: 80, unemployment: 11, gini: 0.33 },
  },
};

// ── Helper Utilities ──────────────────────────────────────
KSP_DATA.getDistrictName = (id) => {
  const d = KSP_DATA.districts.find(x => x.id === id);
  return d ? d.name : id;
};
KSP_DATA.getTotalForDistrict = (id) => {
  const d = KSP_DATA.districtCrimes[id];
  return d ? Object.values(d).reduce((a,b)=>a+b,0) : 0;
};
KSP_DATA.getCrimeColor = (type) => {
  const ct = KSP_DATA.crimeTypes.find(x => x.id === type);
  return ct ? ct.color : "#888";
};
KSP_DATA.getRiskColor = (score) => {
  if (score >= 75) return "#ef4444";
  if (score >= 55) return "#f59e0b";
  if (score >= 35) return "#06b6d4";
  return "#10b981";
};
