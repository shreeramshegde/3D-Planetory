from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class PilotRegister(BaseModel):
    callsign: str = Field(..., min_length=2, max_length=32)

class PilotOut(BaseModel):
    id: int
    callsign: str
    score: int
    system_harmony: int
    completed_domains: Dict[str, bool]
    created_at: datetime

    class Config:
        from_attributes = True

class ChallengeVerifyRequest(BaseModel):
    pilot_callsign: str
    domain_id: str
    challenge_id: str
    seed: Optional[int] = 0
    input_log: Optional[List[Dict[str, Any]]] = None
    claimed_score: Optional[int] = 0
    duration_seconds: Optional[float] = 0.0
    payload: Optional[Dict[str, Any]] = None

class ChallengeVerifyResponse(BaseModel):
    is_valid: bool
    reward_xp: int
    system_harmony: int
    message: str
    telemetry_token: Optional[str] = None

class LeaderboardEntry(BaseModel):
    rank: int
    callsign: str
    score: int
    system_harmony: int
    completed_domains_count: int

class SystemTelemetry(BaseModel):
    name: str = "Kepler: DevCosmos Backend Gateway"
    version: str = "1.0.0"
    status: str = "operational"
    total_domains: int = 6
    database_driver: str
