from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables

from routers import auth, kpis, crimes, districts, hotspots, network, offenders, predictive

app = FastAPI(
    title="KSP CIAP API",
    description="Karnataka State Police — Crime Intelligence & Analytical Platform Backend API",
    version="2.0.0",
)

# Enable CORS for React frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router)
app.include_router(kpis.router)
app.include_router(crimes.router)
app.include_router(districts.router)
app.include_router(hotspots.router)
app.include_router(network.router)
app.include_router(offenders.router)
app.include_router(predictive.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "Karnataka State Police Crime Intelligence Platform API",
        "version": "2.0.0",
        "docs": "/docs",
    }
