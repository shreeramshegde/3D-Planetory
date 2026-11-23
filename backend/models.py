import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Pilot(Base):
    __tablename__ = "pilots"

    id = Column(Integer, primary_key=True, index=True)
    callsign = Column(String(64), unique=True, index=True, nullable=False)
    score = Column(Integer, default=0)
    system_harmony = Column(Integer, default=0)
    completed_domains = Column(JSON, default=dict) # e.g. {"cloud": true, "ai": false}
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    submissions = relationship("ChallengeSubmission", back_populates="pilot")

class ChallengeSubmission(Base):
    __tablename__ = "challenge_submissions"

    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    domain_id = Column(String(32), nullable=False)
    challenge_id = Column(String(64), nullable=False)
    is_passed = Column(Boolean, default=False)
    telemetry_data = Column(JSON, default=dict)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

    pilot = relationship("Pilot", back_populates="submissions")
