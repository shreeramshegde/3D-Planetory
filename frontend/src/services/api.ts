// Optional REST Client with autonomous offline fallback
// Allows seamless integration with FastAPI without breaking offline/standalone usage

const API_BASE = 'http://localhost:8000/api/v1';

export interface LeaderboardPilot {
  rank: number;
  callsign: string;
  score: number;
  system_harmony: number;
  completed_domains_count: number;
}

export const api = {
  async checkBackendHealth(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:8000/', { signal: AbortSignal.timeout(1500) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async registerPilot(callsign: string) {
    try {
      const res = await fetch(`${API_BASE}/pilots/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callsign }),
        signal: AbortSignal.timeout(2000),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async submitChallengeVerification(
    callsign: string,
    domainId: string,
    challengeId: string,
    payload: Record<string, unknown>
  ) {
    try {
      const res = await fetch(`${API_BASE}/challenges/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilot_callsign: callsign,
          domain_id: domainId,
          challenge_id: challengeId,
          payload,
        }),
        signal: AbortSignal.timeout(2500),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getLeaderboard(): Promise<LeaderboardPilot[]> {
    try {
      const res = await fetch(`${API_BASE}/leaderboard`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },
};
