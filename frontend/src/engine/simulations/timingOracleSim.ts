import { createMulberry32 } from '../prng';
import { Simulation } from '../types';

export interface ProbeRecord {
  query: string;
  latencyMs: number;
  matchedChars: number;
}

export interface TimingOracleState {
  time: number;
  secret: string;
  recoveredKey: string;
  queryCount: number;
  maxQueries: number;
  recentProbes: ProbeRecord[];
  latencyHistogram: Record<string, number[]>; // char -> latencies
  isPatched: boolean;
  patchVerified: boolean;
  isFailed: boolean;
  isWon: boolean;
  prngState: number;
}

export type TimingOracleInput =
  | { type: 'SUBMIT_PROBE'; probe: string }
  | { type: 'SET_RECOVERED_CHAR'; index: number; char: string }
  | { type: 'APPLY_CONSTANT_TIME_PATCH' }
  | { type: 'VERIFY_PATCH' };

const SECRET_CHARS = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3'];
const BASE_LATENCY_MS = 14;
const PER_MATCH_LATENCY_MS = 18;

export const timingOracleSim: Simulation<TimingOracleState, TimingOracleInput> = {
  init(seed: number): TimingOracleState {
    const rng = createMulberry32(seed);

    // Pick 4-character hex secret
    let secret = '';
    for (let i = 0; i < 4; i++) {
      const charIndex = Math.floor(rng() * SECRET_CHARS.length);
      secret += SECRET_CHARS[charIndex];
    }

    return {
      time: 0,
      secret,
      recoveredKey: '____',
      queryCount: 0,
      maxQueries: 55,
      recentProbes: [],
      latencyHistogram: {},
      isPatched: false,
      patchVerified: false,
      isFailed: false,
      isWon: false,
      prngState: seed,
    };
  },

  step(state: TimingOracleState, input: TimingOracleInput | null, dt: number): TimingOracleState {
    if (state.isFailed || state.isWon) return state;

    const nextState: TimingOracleState = {
      ...state,
      time: state.time + dt,
      recentProbes: [...state.recentProbes],
      latencyHistogram: { ...state.latencyHistogram },
    };

    const rng = createMulberry32((state.prngState + state.queryCount * 17) >>> 0);

    if (input) {
      if (input.type === 'SUBMIT_PROBE') {
        const probe = input.probe.toUpperCase().padEnd(4, '0').slice(0, 4);
        nextState.queryCount++;

        // Determine matching prefix length
        let matched = 0;
        for (let i = 0; i < 4; i++) {
          if (probe[i] === state.secret[i]) {
            matched++;
          } else {
            break; // Vulnerable early break!
          }
        }

        // Latency simulation with statistical jitter
        let latency: number;
        const jitter = (rng() - 0.5) * 4.0;

        if (state.isPatched) {
          // Constant-time execution: all iterations executed regardless of match
          latency = BASE_LATENCY_MS + 4 * PER_MATCH_LATENCY_MS + jitter;
        } else {
          // Vulnerable timing leak
          latency = BASE_LATENCY_MS + matched * PER_MATCH_LATENCY_MS + jitter;
        }

        const probeRecord: ProbeRecord = {
          query: probe,
          latencyMs: Math.round(latency * 10) / 10,
          matchedChars: matched,
        };

        nextState.recentProbes.unshift(probeRecord);
        if (nextState.recentProbes.length > 20) {
          nextState.recentProbes.pop();
        }

        // Record for candidate char histogram at current prefix position
        const targetChar = probe[Math.min(3, matched)];
        if (targetChar) {
          const list = nextState.latencyHistogram[targetChar] || [];
          nextState.latencyHistogram[targetChar] = [...list, probeRecord.latencyMs];
        }

        // Exceeded query budget check
        if (nextState.queryCount >= state.maxQueries && !nextState.isWon) {
          nextState.isFailed = true;
        }
      } else if (input.type === 'SET_RECOVERED_CHAR') {
        const chars = nextState.recoveredKey.split('');
        chars[input.index] = input.char.toUpperCase();
        nextState.recoveredKey = chars.join('');
      } else if (input.type === 'APPLY_CONSTANT_TIME_PATCH') {
        nextState.isPatched = true;
      } else if (input.type === 'VERIFY_PATCH') {
        if (nextState.isPatched && nextState.recoveredKey === state.secret) {
          nextState.patchVerified = true;
          nextState.isWon = true;
        }
      }
    }

    // Auto-win if secret matches and constant-time patch is confirmed
    if (nextState.recoveredKey === state.secret && nextState.isPatched) {
      nextState.patchVerified = true;
      nextState.isWon = true;
    }

    return nextState;
  },

  getScore(state: TimingOracleState): number {
    if (state.isFailed) return 0;
    const recoveryPoints = state.recoveredKey === state.secret ? 400 : 0;
    const queryEfficiency = Math.max(0, (state.maxQueries - state.queryCount) * 12);
    const patchBonus = state.isPatched ? 200 : 0;
    return recoveryPoints + queryEfficiency + patchBonus;
  },

  isTerminal(state: TimingOracleState): boolean {
    return state.isFailed || state.isWon;
  },

  isWon(state: TimingOracleState): boolean {
    return state.isWon && !state.isFailed;
  },
};
