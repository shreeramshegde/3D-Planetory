import os
import json
import hashlib
from typing import List, Dict, Any
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
    description="Deterministic verification gateway and telemetry service for the Kepler Observatory.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load shared game specifications for plausibility verification
SPECS_PATH = os.path.join(os.path.dirname(__file__), "game_specs.json")
GAME_SPECS: Dict[str, Any] = {}
if os.path.exists(SPECS_PATH):
    with open(SPECS_PATH, "r") as f:
        GAME_SPECS = json.load(f)

DOMAIN_REWARDS = {
    "kernel": 300,
    "cloud": 250,
    "ai": 350,
    "backend": 450,
    "frontend": 300,
    "security": 400
}

TOTAL_DOMAINS = 6

@app.get("/", response_model=SystemTelemetry)
async def system_status():
    driver = "PostgreSQL" if "postgresql" in DATABASE_URL else "SQLite (Local Fallback)"
    return SystemTelemetry(database_driver=driver, total_domains=TOTAL_DOMAINS)

@app.post("/api/v1/pilots/register", response_model=PilotOut)
async def register_pilot(data: PilotRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pilot).where(Pilot.callsign == data.callsign))
    pilot = result.scalar_one_or_none()

    if not pilot:
        pilot = Pilot(
            callsign=data.callsign,
            score=0,
            system_harmony=0,
            completed_domains={
                "kernel": False,
                "cloud": False,
                "ai": False,
                "backend": False,
                "frontend": False,
                "security": False
            }
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
            completed_domains={
                "kernel": False,
                "cloud": False,
                "ai": False,
                "backend": False,
                "frontend": False,
                "security": False
            }
        )
        db.add(pilot)
        await db.flush()

    domain = data.domain_id
    challenge_id = data.challenge_id
    claimed_score = data.claimed_score or 0
    duration = data.duration_seconds or 0.0
    input_log = data.input_log or []

    spec = GAME_SPECS.get(challenge_id)
    is_valid = True
    rejection_reason = ""

    # Plausibility checks against specification
    if spec:
        # 1. Score Ceiling check
        if claimed_score > spec.get("maxScoreCeiling", 1200):
            is_valid = False
            rejection_reason = f"Claimed score {claimed_score} exceeds game ceiling {spec.get('maxScoreCeiling')}."

        # 2. Minimum Duration check
        elif duration < spec.get("minDurationSeconds", 3.0):
            is_valid = False
            rejection_reason = f"Duration {duration:.1f}s is below minimum plausible playthrough time."

        # 3. Input Rate Plausibility (human reflex ceiling)
        elif duration > 0 and len(input_log) > 0:
            rate = len(input_log) / duration
            max_rate = spec.get("maxInputsPerSecond", 30)
            if rate > max_rate:
                is_valid = False
                rejection_reason = f"Input rate {rate:.1f}/s exceeds physiological limit {max_rate}/s."
    else:
        # Fallback heuristic if challenge spec is missing
        if claimed_score < 0 or claimed_score > 2000:
            is_valid = False
            rejection_reason = "Score outside permissible envelope."

    reward = DOMAIN_REWARDS.get(domain, 250) if is_valid else 0
    message = "Deterministic simulation verified successfully." if is_valid else rejection_reason

    if is_valid:
        domains = dict(pilot.completed_domains or {})
        if not domains.get(domain):
            domains[domain] = True
            pilot.completed_domains = domains
            pilot.score += reward

            completed_count = sum(1 for v in domains.values() if v)
            pilot.system_harmony = int((completed_count / float(TOTAL_DOMAINS)) * 100)

    # Save challenge submission record
    submission = ChallengeSubmission(
        pilot_id=pilot.id,
        domain_id=domain,
        challenge_id=challenge_id,
        is_passed=is_valid,
        telemetry_data={
            "seed": data.seed,
            "claimed_score": claimed_score,
            "duration": duration,
            "input_count": len(input_log),
            "payload": data.payload
        }
    )
    db.add(submission)
    await db.commit()
    await db.refresh(pilot)

    token = hashlib.sha256(f"{pilot.callsign}:{domain}:{is_valid}:{claimed_score}".encode()).hexdigest()[:16]

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
