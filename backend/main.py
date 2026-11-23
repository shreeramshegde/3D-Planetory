import os
import hashlib
from typing import List
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from database import init_db, get_db, DATABASE_URL
from models import Pilot, ChallengeSubmission
from schemas import (
    PilotRegister,
    PilotOut,
    ChallengeVerifyRequest,
    ChallengeVerifyResponse,
    LeaderboardEntry,
    SystemTelemetry
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables on startup
    await init_db()
    yield

app = FastAPI(
    title="Kepler: DevCosmos Gateway API",
    description="High-performance FastAPI service managing planetary challenges, pilot telemetry, and leaderboards for Kepler-DevCosmos.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOMAIN_REWARDS = {
    "cloud": 250,
    "ai": 350,
    "backend": 450,
    "frontend": 300,
    "security": 400
}

@app.get("/", response_model=SystemTelemetry)
async def system_status():
    driver = "PostgreSQL" if "postgresql" in DATABASE_URL else "SQLite (Local Fallback)"
    return SystemTelemetry(database_driver=driver)

@app.post("/api/v1/pilots/register", response_model=PilotOut)
async def register_pilot(data: PilotRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pilot).where(Pilot.callsign == data.callsign))
    pilot = result.scalar_one_or_none()

    if not pilot:
        pilot = Pilot(
            callsign=data.callsign,
            score=0,
            system_harmony=0,
            completed_domains={"cloud": False, "ai": False, "backend": False, "frontend": False, "security": False}
        )
        db.add(pilot)
        await db.commit()
        await db.refresh(pilot)

    return pilot

@app.post("/api/v1/challenges/verify", response_model=ChallengeVerifyResponse)
async def verify_challenge(data: ChallengeVerifyRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pilot).where(Pilot.callsign == data.pilot_callsign))
    pilot = result.scalar_one_or_none()

    if not pilot:
        pilot = Pilot(
            callsign=data.pilot_callsign,
            score=0,
            system_harmony=0,
            completed_domains={"cloud": False, "ai": False, "backend": False, "frontend": False, "security": False}
        )
        db.add(pilot)
        await db.flush()

    domain = data.domain_id
    payload = data.payload
    is_valid = False
    message = "Challenge requirements not met."

    # Server-side validation logic matching the domains
    if domain == "cloud":
        # Check pipeline order: lint, test, build, scan, deploy
        stages = payload.get("stage_order", [])
        expected = ["lint", "test", "build", "scan", "deploy"]
        if stages == expected:
            is_valid = True
            message = "Pipeline dependency order verified."

    elif domain == "ai":
        acc = payload.get("accuracy", 0)
        if acc >= 90.0:
            is_valid = True
            message = "Neural model generalization threshold verified."

    elif domain == "backend":
        algo = payload.get("algorithm")
        hpa = payload.get("hpa_enabled", False)
        if algo == "least-connections" and hpa:
            is_valid = True
            message = "High-throughput cluster load balance stabilized."

    elif domain == "frontend":
        score = payload.get("resonance_score", 0)
        if score >= 90:
            is_valid = True
            message = "Photonic shader frequency matched target waveform."

    elif domain == "security":
        rings = payload.get("ring_degrees", {})
        if rings.get("r1") == 90 and rings.get("r2") == 180 and rings.get("r3") == 270:
            is_valid = True
            message = "Cryptographic key matrix authenticated."

    reward = DOMAIN_REWARDS.get(domain, 200) if is_valid else 0

    if is_valid:
        domains = dict(pilot.completed_domains or {})
        if not domains.get(domain):
            domains[domain] = True
            pilot.completed_domains = domains
            pilot.score += reward

            completed_count = sum(1 for v in domains.values() if v)
            pilot.system_harmony = int((completed_count / 5.0) * 100)

    # Save submission log
    submission = ChallengeSubmission(
        pilot_id=pilot.id,
        domain_id=domain,
        challenge_id=data.challenge_id,
        is_passed=is_valid,
        telemetry_data=payload
    )
    db.add(submission)
    await db.commit()
    await db.refresh(pilot)

    token = hashlib.sha256(f"{pilot.callsign}:{domain}:{is_valid}".encode()).hexdigest()[:16]

    return ChallengeVerifyResponse(
        is_valid=is_valid,
        reward_xp=reward,
        system_harmony=pilot.system_harmony,
        message=message,
        telemetry_token=token if is_valid else None
    )

@app.get("/api/v1/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Pilot).order_by(desc(Pilot.score), desc(Pilot.system_harmony)).limit(10)
    )
    pilots = result.scalars().all()

    entries = []
    for rank, p in enumerate(pilots, 1):
        completed_count = sum(1 for v in (p.completed_domains or {}).values() if v)
        entries.append(
            LeaderboardEntry(
                rank=rank,
                callsign=p.callsign,
                score=p.score,
                system_harmony=p.system_harmony,
                completed_domains_count=completed_count
            )
        )
    return entries
