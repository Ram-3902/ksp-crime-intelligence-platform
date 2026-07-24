"""
KSP CIAP Backend — Database Seed Script
Run: python seed.py
Populates SQLite with all KSP synthetic crime data + default users.
"""
from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import (
    User, District, MonthlyCrime, DistrictCrime, YoYCrime,
    Hotspot, NetworkNode, NetworkLink, Offender,
    PredictiveRisk, Anomaly, KPISummary,
)
from auth import hash_password

def seed():
    create_db_and_tables()
    with Session(engine) as s:
        # ── Skip if already seeded ──────────────────────────────────────────
        if s.exec(select(User)).first():
            print("[INFO] Database already seeded - skipping.")
            return

        print("[INFO] Seeding KSP CIAP database...")

        # ── Users ──────────────────────────────────────────────────────────
        users = [
            User(username="admin",   full_name="SCRB Administrator", role="admin",   division="SCRB HQ",          hashed_password=hash_password("Admin@123")),
            User(username="analyst", full_name="Crime Analyst",       role="analyst", division="Bengaluru Urban",   hashed_password=hash_password("Analyst@123")),
            User(username="viewer",  full_name="District Officer",     role="viewer",  division="Mysuru Division",   hashed_password=hash_password("Viewer@123")),
        ]
        for u in users: s.add(u)

        # ── Districts ──────────────────────────────────────────────────────
        districts_data = [
            ("BLR_U","Bengaluru Urban",   "Bengaluru", 12.9716,77.5946,9621551,98,12,425000,89, 8,0.42),
            ("BLR_R","Bengaluru Rural",   "Bengaluru", 13.1500,77.5200, 990923,28,22,185000,76,12,0.35),
            ("MYS",  "Mysuru",            "Mysuru",    12.2958,76.6394,3001127,55,18,215000,81,12,0.38),
            ("MAN",  "Mangaluru",         "Coastal",   12.8698,74.8425,2089649,62,15,220000,83,11,0.37),
            ("HUB",  "Hubballi-Dharwad",  "Dharwad",   15.3647,75.1240,2143582,65,20,195000,78,14,0.39),
            ("BEL",  "Belagavi",          "Belgaum",   15.8497,74.4977,4814803,30,28,142000,72,18,0.37),
            ("KAL",  "Kalaburagi",        "Gulbarga",  17.3297,76.8343,2564892,35,35,125000,68,22,0.38),
            ("BAL",  "Ballari",           "Bellary",   15.1394,76.9214,2531592,40,30,138000,70,20,0.40),
            ("SHI",  "Shivamogga",        "Shivamogga",13.9299,75.5681,1755512,45,22,172000,77,13,0.35),
            ("DAV",  "Davangere",         "Davangere", 14.4644,75.9218,1977550,48,25,158000,74,16,0.37),
            ("TUM",  "Tumakuru",          "Bengaluru", 13.3409,77.1010,2678980,32,23,162000,75,15,0.36),
            ("VIJ",  "Vijayapura",        "Gulbarga",  16.8302,75.7100,2175102,33,32,132000,69,21,0.39),
            ("UDU",  "Udupi",             "Coastal",   13.3409,74.7421,1177361,50,14,210000,85,10,0.34),
            ("CHI",  "Chikkamagaluru",    "Shivamogga",13.3153,75.7754,1137961,28,20,168000,76,14,0.34),
            ("KOD",  "Kodagu",            "Mysuru",    12.3375,75.8069, 554762,22,16,195000,80,11,0.33),
        ]
        for d in districts_data:
            s.add(District(code=d[0],name=d[1],division=d[2],lat=d[3],lng=d[4],
                           population=d[5],urbanization=d[6],poverty=d[7],
                           gdp_per_capita=d[8],literacy=d[9],unemployment=d[10],gini=d[11]))

        # ── Monthly Crimes ─────────────────────────────────────────────────
        labels = [
            "Jan'23","Feb'23","Mar'23","Apr'23","May'23","Jun'23",
            "Jul'23","Aug'23","Sep'23","Oct'23","Nov'23","Dec'23",
            "Jan'24","Feb'24","Mar'24","Apr'24","May'24","Jun'24",
            "Jul'24","Aug'24","Sep'24","Oct'24","Nov'24","Dec'24",
        ]
        monthly = {
            "THEFT":   [420,390,410,455,478,502,530,521,498,511,490,467,445,418,432,470,495,520,548,539,516,528,507,483],
            "ASSAULT": [180,172,185,195,210,225,240,235,218,229,215,195,195,185,198,210,228,245,262,256,238,248,233,212],
            "MURDER":  [28,24,31,26,29,32,34,30,27,31,28,25,26,22,29,24,27,30,32,28,25,29,26,23],
            "ROBBERY": [95,88,97,105,112,120,128,124,115,119,110,102,100,93,103,112,120,129,138,133,123,127,118,108],
            "CYBER":   [320,345,368,412,456,498,542,535,520,567,598,625,660,695,730,785,825,872,915,902,888,935,968,1010],
            "FRAUD":   [210,198,215,228,242,258,272,268,252,261,248,235,220,208,225,240,255,272,288,283,266,275,260,247],
            "KIDNAP":  [22,19,24,21,23,26,28,25,22,24,21,19,20,18,22,19,21,24,26,23,20,22,19,17],
            "DRUG":    [145,138,152,168,182,196,210,204,190,198,185,172,155,148,163,180,196,212,228,222,207,215,201,188],
            "SEXUAL":  [42,38,45,48,52,56,60,57,53,55,51,47,44,40,47,51,55,59,63,60,56,58,54,50],
            "ARSON":   [18,15,19,22,25,28,30,27,24,26,23,20,19,16,20,23,26,30,32,29,26,28,24,21],
        }
        for crime_type, counts in monthly.items():
            for i, (label, count) in enumerate(zip(labels, counts)):
                s.add(MonthlyCrime(month_label=label, month_index=i+1, crime_type=crime_type, count=count))

        # ── District Crimes ────────────────────────────────────────────────
        dc_data = {
            "BLR_U":{"THEFT":2850,"ASSAULT":1120,"MURDER":145,"ROBBERY":620,"CYBER":4200,"FRAUD":1350,"KIDNAP":98,"DRUG":880,"SEXUAL":310,"ARSON":95},
            "BLR_R":{"THEFT":680,"ASSAULT":290,"MURDER":38,"ROBBERY":145,"CYBER":520,"FRAUD":280,"KIDNAP":22,"DRUG":195,"SEXUAL":68,"ARSON":28},
            "MYS":  {"THEFT":920,"ASSAULT":420,"MURDER":58,"ROBBERY":210,"CYBER":680,"FRAUD":380,"KIDNAP":32,"DRUG":295,"SEXUAL":102,"ARSON":42},
            "MAN":  {"THEFT":780,"ASSAULT":310,"MURDER":42,"ROBBERY":165,"CYBER":590,"FRAUD":310,"KIDNAP":28,"DRUG":215,"SEXUAL":78,"ARSON":32},
            "HUB":  {"THEFT":860,"ASSAULT":380,"MURDER":52,"ROBBERY":190,"CYBER":580,"FRAUD":340,"KIDNAP":29,"DRUG":260,"SEXUAL":90,"ARSON":38},
            "BEL":  {"THEFT":1120,"ASSAULT":510,"MURDER":72,"ROBBERY":255,"CYBER":380,"FRAUD":420,"KIDNAP":42,"DRUG":310,"SEXUAL":118,"ARSON":52},
            "KAL":  {"THEFT":750,"ASSAULT":350,"MURDER":65,"ROBBERY":180,"CYBER":250,"FRAUD":290,"KIDNAP":38,"DRUG":280,"SEXUAL":98,"ARSON":45},
            "BAL":  {"THEFT":680,"ASSAULT":320,"MURDER":58,"ROBBERY":165,"CYBER":220,"FRAUD":265,"KIDNAP":34,"DRUG":260,"SEXUAL":88,"ARSON":40},
            "SHI":  {"THEFT":590,"ASSAULT":270,"MURDER":42,"ROBBERY":140,"CYBER":310,"FRAUD":230,"KIDNAP":28,"DRUG":210,"SEXUAL":72,"ARSON":32},
            "DAV":  {"THEFT":620,"ASSAULT":285,"MURDER":46,"ROBBERY":148,"CYBER":295,"FRAUD":240,"KIDNAP":30,"DRUG":225,"SEXUAL":76,"ARSON":35},
            "TUM":  {"THEFT":710,"ASSAULT":325,"MURDER":50,"ROBBERY":170,"CYBER":340,"FRAUD":275,"KIDNAP":32,"DRUG":240,"SEXUAL":84,"ARSON":38},
            "VIJ":  {"THEFT":680,"ASSAULT":315,"MURDER":60,"ROBBERY":165,"CYBER":230,"FRAUD":260,"KIDNAP":36,"DRUG":265,"SEXUAL":92,"ARSON":43},
            "UDU":  {"THEFT":340,"ASSAULT":155,"MURDER":22,"ROBBERY":82,"CYBER":310,"FRAUD":148,"KIDNAP":14,"DRUG":105,"SEXUAL":38,"ARSON":16},
            "CHI":  {"THEFT":290,"ASSAULT":130,"MURDER":19,"ROBBERY":68,"CYBER":165,"FRAUD":125,"KIDNAP":11,"DRUG":95,"SEXUAL":32,"ARSON":14},
            "KOD":  {"THEFT":142,"ASSAULT":65,"MURDER":10,"ROBBERY":34,"CYBER":88,"FRAUD":62,"KIDNAP":6,"DRUG":48,"SEXUAL":16,"ARSON":7},
        }
        for dist_code, crimes in dc_data.items():
            for crime_type, count in crimes.items():
                s.add(DistrictCrime(district_code=dist_code, crime_type=crime_type, count=count, year=2024))

        # ── YoY Crimes ─────────────────────────────────────────────────────
        yoy = {
            2022:{"THEFT":18200,"ASSAULT":7800,"MURDER":1050,"ROBBERY":3900,"CYBER":8500,"FRAUD":7200,"KIDNAP":820,"DRUG":5600,"SEXUAL":1800,"ARSON":780},
            2023:{"THEFT":19500,"ASSAULT":8100,"MURDER":1020,"ROBBERY":4050,"CYBER":12800,"FRAUD":7800,"KIDNAP":850,"DRUG":6100,"SEXUAL":1900,"ARSON":810},
            2024:{"THEFT":20800,"ASSAULT":8500,"MURDER":980,"ROBBERY":4200,"CYBER":18500,"FRAUD":8200,"KIDNAP":820,"DRUG":6500,"SEXUAL":2000,"ARSON":840},
        }
        for year, crimes in yoy.items():
            for crime_type, total in crimes.items():
                s.add(YoYCrime(year=year, crime_type=crime_type, total=total))

        # ── Hotspots ───────────────────────────────────────────────────────
        hotspots = [
            (12.9352,77.6245,9,"Whitefield, BLR","CYBER"),
            (12.9698,77.5952,8,"MG Road, BLR","THEFT"),
            (12.9540,77.4960,7,"Rajajinagar, BLR","ROBBERY"),
            (12.9010,77.4990,9,"Kengeri, BLR","DRUG"),
            (12.9830,77.7500,6,"Marathahalli, BLR","ASSAULT"),
            (12.9279,77.6271,7,"HSR Layout, BLR","FRAUD"),
            (13.0268,77.5509,5,"Hebbal, BLR","THEFT"),
            (12.2958,76.6394,6,"Mysuru City","ASSAULT"),
            (12.3054,76.6516,5,"Chamundi Area, MYS","THEFT"),
            (15.3647,75.1240,7,"Hubballi Central","ROBBERY"),
            (15.3500,75.1400,6,"Dharwad Town","DRUG"),
            (15.8497,74.4977,6,"Belagavi City","ASSAULT"),
            (12.8698,74.8425,5,"Mangaluru Port","DRUG"),
            (17.3297,76.8343,8,"Kalaburagi City","MURDER"),
            (15.1394,76.9214,7,"Ballari Mining Belt","ROBBERY"),
            (13.3409,77.1010,5,"Tumakuru Town","THEFT"),
            (16.8302,75.7100,6,"Vijayapura City","ASSAULT"),
            (13.9299,75.5681,5,"Shivamogga City","DRUG"),
            (14.4644,75.9218,5,"Davangere Town","THEFT"),
        ]
        for h in hotspots:
            s.add(Hotspot(lat=h[0],lng=h[1],intensity=h[2],label=h[3],crime_type=h[4]))

        # ── Network Nodes ──────────────────────────────────────────────────
        nodes = [
            ("S001","suspect","Rajan A.","G1",9,8,"Cybercrime","BLR_U"),
            ("S002","suspect","Vikram B.","G1",8,6,"Cyber+Fraud","BLR_U"),
            ("S003","suspect","Mohan C.","G2",7,5,"Robbery","KAL"),
            ("S004","suspect","Suresh D.","G2",8,7,"Robbery","BAL"),
            ("S005","suspect","Arun E.","G3",6,4,"Drug Trade","MAN"),
            ("S006","suspect","Deepak F.","G3",7,5,"Drug Trade","MYS"),
            ("S007","suspect","Kiran G.","G1",5,3,"Fraud","BLR_U"),
            ("S008","suspect","Naveen H.","G4",9,10,"Murder+Rob","HUB"),
            ("S009","suspect","Prasad I.","G4",8,8,"Assault","BEL"),
            ("S010","suspect","Rajesh J.","G2",6,4,"Theft","TUM"),
            ("V001","victim","Anita K.",None,None,2,None,"BLR_U"),
            ("V002","victim","Sunil L.",None,None,3,None,"BLR_U"),
            ("V003","victim","Meena M.",None,None,1,None,"MYS"),
            ("V004","victim","Ravi N.",None,None,2,None,"KAL"),
            ("V005","victim","Lakshmi O.",None,None,1,None,"HUB"),
            ("L001","location","ATM Cluster WF",None,None,12,None,"BLR_U"),
            ("L002","location","Bus Stand BLR",None,None,8,None,"BLR_U"),
            ("L003","location","NH-44 Stretch",None,None,15,None,"KAL"),
            ("L004","location","Port Area MAN",None,None,9,None,"MAN"),
            ("L005","location","Old City HUB",None,None,7,None,"HUB"),
        ]
        for n in nodes:
            s.add(NetworkNode(node_id=n[0],node_type=n[1],label=n[2],gang=n[3],
                              risk=n[4],offenses=n[5],mo=n[6],district_code=n[7]))

        # ── Network Links ──────────────────────────────────────────────────
        links = [
            ("S001","S002",3,"Co-accused"),("S001","S007",2,"Associate"),
            ("S002","S007",2,"Co-accused"),("S001","V001",1,"Victim"),
            ("S002","V002",1,"Victim"),("S001","L001",3,"Crime scene"),
            ("S002","L001",3,"Crime scene"),("S003","S004",3,"Co-accused"),
            ("S003","S010",2,"Associate"),("S004","S010",2,"Associate"),
            ("S003","V004",1,"Victim"),("S004","L003",3,"Crime scene"),
            ("S003","L003",3,"Crime scene"),("S005","S006",3,"Co-accused"),
            ("S005","L004",2,"Crime scene"),("S006","L004",2,"Crime scene"),
            ("S008","S009",3,"Co-accused"),("S008","V005",1,"Victim"),
            ("S009","V003",1,"Victim"),("S008","L005",3,"Crime scene"),
            ("S007","V001",1,"Victim"),("S007","L002",2,"Crime scene"),
            ("S001","S003",1,"Linked"),("S008","S003",1,"Linked"),
        ]
        for l in links:
            s.add(NetworkLink(source_id=l[0],target_id=l[1],weight=l[2],label=l[3]))

        # ── Offenders ──────────────────────────────────────────────────────
        offenders = [
            ("S001","Rajan Arumugam",34,"BLR_U",8,3,"CRITICAL","Phishing & Banking Fraud via SIM Swap","Cyber Gang Alpha","Absconding"),
            ("S008","Naveen Hegde",29,"HUB",10,5,"CRITICAL","Targeted robbery with violence","NH Syndicate","In Custody"),
            ("S004","Suresh Doddappa",41,"BAL",7,4,"HIGH","Highway robbery, Dacoity","Road Wolves","Bail"),
            ("S002","Vikram Babu",31,"BLR_U",6,2,"HIGH","Online fraud & credential theft","Cyber Gang Alpha","Bail"),
            ("S009","Prasad Ingalagi",37,"BEL",8,4,"HIGH","Assault & extortion","NH Syndicate","Bail"),
            ("S006","Deepak Fonseca",27,"MYS",5,2,"MEDIUM","Drug courier — inter-district","Coastal Cartel","In Custody"),
            ("S003","Mohan Channappa",45,"KAL",5,3,"HIGH","Armed robbery on NH-44","Road Wolves","Absconding"),
            ("S005","Arun Emmanuel",23,"MAN",4,1,"MEDIUM","Drug distribution — coastal route","Coastal Cartel","In Custody"),
            ("S007","Kiran Gowda",36,"BLR_U",3,1,"MEDIUM","Online investment fraud","Cyber Gang Alpha","Bail"),
            ("S010","Rajesh Jadav",32,"TUM",4,2,"MEDIUM","Vehicle theft network","Road Wolves","Bail"),
        ]
        for o in offenders:
            s.add(Offender(offender_id=o[0],name=o[1],age=o[2],district_code=o[3],
                           arrests=o[4],convictions=o[5],risk=o[6],mo=o[7],gang=o[8],status=o[9]))

        # ── Predictive Risk ────────────────────────────────────────────────
        risks = [
            ("BLR_U",82,95,65,78,58,"up"),("KAL",76,42,88,65,72,"up"),
            ("BAL",72,38,80,60,68,"flat"),("BEL",70,35,78,62,65,"up"),
            ("HUB",68,58,72,64,62,"flat"),("MYS",62,60,58,55,55,"down"),
            ("VIJ",65,40,75,58,68,"up"),("DAV",58,45,62,52,55,"flat"),
            ("TUM",55,48,58,50,50,"flat"),("SHI",52,50,55,48,52,"down"),
            ("MAN",58,55,52,50,65,"flat"),("BLR_R",48,30,50,45,42,"down"),
            ("UDU",40,42,38,35,38,"down"),("CHI",38,28,40,32,35,"flat"),
            ("KOD",30,22,30,28,30,"down"),
        ]
        for r in risks:
            s.add(PredictiveRisk(district_code=r[0],overall=r[1],cyber=r[2],
                                 violent=r[3],property_=r[4],drug=r[5],trend=r[6]))

        # ── Anomalies ──────────────────────────────────────────────────────
        anomalies = [
            ("2024-11-03","KAL","MURDER","3 homicides in 48hrs on NH-44 — possible gang war resurgence","CRITICAL",False),
            ("2024-10-18","BLR_U","CYBER","Coordinated SIM-swap attacks targeting 80+ bank accounts","HIGH",True),
            ("2024-09-22","BAL","ROBBERY","6 armed robberies in mining belt — same MO, unknown gang","HIGH",False),
            ("2024-09-05","MAN","DRUG","32 kg MDMA seizure — suggests new coastal entry point","HIGH",False),
            ("2024-08-14","HUB","ASSAULT","Communal tension — 12 assault incidents in 6 hrs","CRITICAL",True),
            ("2024-07-29","BEL","KIDNAP","4 child abductions reported — cross-district pattern","CRITICAL",False),
            ("2024-06-12","BLR_U","FRAUD","Fake investment scheme — 250+ victims, Rs.4.2 Cr loss","HIGH",True),
            ("2024-05-20","VIJ","ARSON","Agricultural land disputes — 8 arson incidents in 10 days","MEDIUM",True),
        ]
        for a in anomalies:
            s.add(Anomaly(date=a[0],district_code=a[1],crime_type=a[2],
                          description=a[3],severity=a[4],resolved=a[5]))

        # ── KPI ────────────────────────────────────────────────────────────
        s.add(KPISummary(
            total_crimes_2024=72840, total_crimes_2023=68420,
            total_arrests_2024=52180, conviction_rate=68.4,
            cybercrime_surge=44.5, hotspot_count=19, active_gangs=24,
            pending_cases=18450, resolution_rate=71.6, avg_response_time=12.4,
        ))

        s.commit()
        print("[SUCCESS] Database seeded successfully!")
        print("   Users: admin / Admin@123 | analyst / Analyst@123 | viewer / Viewer@123")

if __name__ == "__main__":
    seed()
