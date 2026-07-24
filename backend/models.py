"""
KSP CIAP Backend — SQLModel Table Definitions
"""
from typing import Optional
from sqlmodel import SQLModel, Field


# ── Users ────────────────────────────────────────────────────────────────────
class User(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    username:     str           = Field(index=True, unique=True)
    full_name:    str
    role:         str           = "analyst"       # admin | analyst | viewer
    division:     str           = "SCRB"
    hashed_password: str

class UserRead(SQLModel):
    id:        int
    username:  str
    full_name: str
    role:      str
    division:  str

class UserCreate(SQLModel):
    username:  str
    full_name: str
    role:      str
    division:  str
    password:  str


# ── Districts ─────────────────────────────────────────────────────────────────
class District(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    code:         str           = Field(index=True, unique=True)
    name:         str
    division:     str
    lat:          float
    lng:          float
    population:   int
    urbanization: int           # percent
    poverty:      int           # percent
    gdp_per_capita: int
    literacy:     int
    unemployment: int
    gini:         float


# ── Monthly Crime Counts ──────────────────────────────────────────────────────
class MonthlyCrime(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    month_label:  str           # "Jan'24"
    month_index:  int           # 1-24 (chronological order)
    crime_type:   str           # THEFT, CYBER, etc.
    count:        int


# ── District Crime Totals (annual 2024) ───────────────────────────────────────
class DistrictCrime(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    district_code: str
    crime_type:   str
    count:        int
    year:         int           = 2024


# ── Year-over-Year ────────────────────────────────────────────────────────────
class YoYCrime(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    year:         int
    crime_type:   str
    total:        int


# ── Crime Hotspots ────────────────────────────────────────────────────────────
class Hotspot(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    lat:          float
    lng:          float
    intensity:    int
    label:        str
    crime_type:   str


# ── Network Nodes ─────────────────────────────────────────────────────────────
class NetworkNode(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    node_id:      str           = Field(index=True, unique=True)
    node_type:    str           # suspect | victim | location
    label:        str
    gang:         Optional[str] = None
    risk:         Optional[int] = None
    offenses:     int           = 0
    mo:           Optional[str] = None
    district_code: Optional[str] = None


# ── Network Links ─────────────────────────────────────────────────────────────
class NetworkLink(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    source_id:    str
    target_id:    str
    weight:       int
    label:        str


# ── Offender Profiles ─────────────────────────────────────────────────────────
class Offender(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    offender_id:  str           = Field(index=True, unique=True)
    name:         str
    age:          int
    district_code: str
    arrests:      int
    convictions:  int
    risk:         str           # CRITICAL | HIGH | MEDIUM | LOW
    mo:           str
    gang:         Optional[str] = None
    status:       str           # In Custody | Bail | Absconding


# ── Predictive Risk Scores ────────────────────────────────────────────────────
class PredictiveRisk(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    district_code: str          = Field(index=True)
    overall:      int
    cyber:        int
    violent:      int
    property_:    int           = Field(alias="property")
    drug:         int
    trend:        str           # up | flat | down

    class Config:
        populate_by_name = True


# ── Anomaly Events ────────────────────────────────────────────────────────────
class Anomaly(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    date:         str
    district_code: str
    crime_type:   str
    description:  str
    severity:     str           # CRITICAL | HIGH | MEDIUM
    resolved:     bool          = False


# ── KPI Summary ───────────────────────────────────────────────────────────────
class KPISummary(SQLModel, table=True):
    id:                  Optional[int] = Field(default=None, primary_key=True)
    total_crimes_2024:   int
    total_crimes_2023:   int
    total_arrests_2024:  int
    conviction_rate:     float
    cybercrime_surge:    float
    hotspot_count:       int
    active_gangs:        int
    pending_cases:       int
    resolution_rate:     float
    avg_response_time:   float
