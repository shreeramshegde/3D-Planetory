import { describe, it, expect } from 'vitest';
import { schedulerSim } from '../simulations/schedulerSim';
import { packetRainSim } from '../simulations/packetRainSim';
import { lossLandscapeSim } from '../simulations/lossLandscapeSim';
import { splitBrainSim } from '../simulations/splitBrainSim';
import { pixelPipelineSim } from '../simulations/pixelPipelineSim';
import { timingOracleSim } from '../simulations/timingOracleSim';

describe('Deterministic Game Engine Architecture', () => {
  // 1. SCHEDULER SIMULATION TESTS
  describe('Scheduler Simulation', () => {
    it('is strictly deterministic given identical seed and inputs', () => {
      const seed = 12345;
      let stateA = schedulerSim.init(seed);
      let stateB = schedulerSim.init(seed);

      expect(stateA).toEqual(stateB);

      const dt = 1 / 60;
      for (let i = 0; i < 120; i++) {
        const input = i === 30 ? { type: 'SET_POLICY' as const, policy: 'SJF' as const } : null;
        stateA = schedulerSim.step(stateA, input, dt);
        stateB = schedulerSim.step(stateB, input, dt);
      }

      expect(stateA).toEqual(stateB);
    });

    it('correctly handles win condition', () => {
      const state = schedulerSim.init(42);
      // Manually set doneCount to target
      const wonState = { ...state, doneCount: state.targetCount };
      const next = schedulerSim.step(wonState, null, 1 / 60);
      expect(schedulerSim.isWon(next)).toBe(true);
      expect(schedulerSim.isTerminal(next)).toBe(true);
    });

    it('correctly triggers fail condition on starved threads', () => {
      const state = schedulerSim.init(42);
      const failState = {
        ...state,
        readyQueue: state.readyQueue.map((p, idx) =>
          idx < 3 ? { ...p, waitTime: 13.0 } : p
        ),
      };
      const next = schedulerSim.step(failState, null, 1 / 60);
      expect(next.isFailed).toBe(true);
      expect(schedulerSim.isWon(next)).toBe(false);
    });
  });

  // 2. PACKET RAIN SIMULATION TESTS
  describe('Packet Rain Simulation', () => {
    it('is strictly deterministic given identical seed and inputs', () => {
      const seed = 9876;
      let stateA = packetRainSim.init(seed);
      let stateB = packetRainSim.init(seed);

      expect(stateA).toEqual(stateB);

      const dt = 1 / 60;
      for (let i = 0; i < 90; i++) {
        const input = i === 20 ? { type: 'ADD_NODE' as const, nodeType: 'CACHE' as const, x: 1, y: 1 } : null;
        stateA = packetRainSim.step(stateA, input, dt);
        stateB = packetRainSim.step(stateB, input, dt);
      }

      expect(stateA).toEqual(stateB);
    });

    it('fails when drop rate exceeds threshold', () => {
      const state = packetRainSim.init(42);
      const highDropState = { ...state, totalSpawned: 20, totalDropped: 12 };
      const next = packetRainSim.step(highDropState, null, 1 / 60);
      expect(next.isFailed).toBe(true);
    });

    it('wins when throughput target is achieved', () => {
      const state = packetRainSim.init(42);
      const winState = { ...state, totalProcessed: 75, time: 26 };
      const next = packetRainSim.step(winState, null, 1 / 60);
      expect(packetRainSim.isWon(next)).toBe(true);
    });
  });

  // 3. LOSS LANDSCAPE SIMULATION TESTS
  describe('Loss Landscape Simulation', () => {
    it('is strictly deterministic given identical seed and inputs', () => {
      const seed = 555;
      let stateA = lossLandscapeSim.init(seed);
      let stateB = lossLandscapeSim.init(seed);

      expect(stateA).toEqual(stateB);

      const dt = 1 / 60;
      for (let i = 0; i < 60; i++) {
        const input = i === 10 ? { type: 'SET_OPTIMIZER' as const, optimizer: 'ADAM' as const } : null;
        stateA = lossLandscapeSim.step(stateA, input, dt);
        stateB = lossLandscapeSim.step(stateB, input, dt);
      }

      expect(stateA).toEqual(stateB);
    });

    it('detects numerical divergence on extreme learning rate', () => {
      let state = lossLandscapeSim.init(42);
      // Set dangerously high learning rate
      state = lossLandscapeSim.step(state, { type: 'SET_LEARNING_RATE', lr: 0.4 }, 1 / 60);
      for (let i = 0; i < 30; i++) {
        state = lossLandscapeSim.step(state, null, 1 / 60);
      }
      expect(state.isDiverged).toBe(true);
      expect(lossLandscapeSim.isTerminal(state)).toBe(true);
    });

    it('converges to win state when target loss is maintained', () => {
      const state = lossLandscapeSim.init(42);
      // Place near minimum (-0.7, 0)
      const nearMinState = {
        ...state,
        x: -0.7,
        y: 0,
        convergenceTimer: 1.3,
      };
      const next = lossLandscapeSim.step(nearMinState, null, 1 / 60);
      expect(lossLandscapeSim.isWon(next)).toBe(true);
    });
  });

  // 4. SPLIT BRAIN SIMULATION TESTS
  describe('Split Brain Simulation', () => {
    it('is strictly deterministic given identical seed and inputs', () => {
      const seed = 777;
      let stateA = splitBrainSim.init(seed);
      let stateB = splitBrainSim.init(seed);

      expect(stateA).toEqual(stateB);

      const dt = 1 / 60;
      for (let i = 0; i < 60; i++) {
        stateA = splitBrainSim.step(stateA, null, dt);
        stateB = splitBrainSim.step(stateB, null, dt);
      }

      expect(stateA).toEqual(stateB);
    });

    it('detects split-brain invariant violation when two leaders exist in same term', () => {
      const state = splitBrainSim.init(42);
      // Manually set node 0 and node 1 as leaders in term 1
      const brokenNodes = state.nodes.map((n) => {
        if (n.id === 1) return { ...n, role: 'LEADER' as const, currentTerm: 1 };
        return n;
      });
      const invalidState = { ...state, nodes: brokenNodes };
      const next = splitBrainSim.step(invalidState, null, 1 / 60);
      expect(next.isFailed).toBe(true);
      expect(next.invariantViolation).toContain('SPLIT-BRAIN');
    });

    it('satisfies win condition after sufficient committed writes', () => {
      const state = splitBrainSim.init(42);
      const wonState = {
        ...state,
        time: 16,
        committedCommands: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7'],
      };
      const next = splitBrainSim.step(wonState, null, 1 / 60);
      expect(splitBrainSim.isWon(next)).toBe(true);
    });
  });

  // 5. PIXEL PIPELINE SIMULATION TESTS
  describe('Pixel Pipeline Simulation', () => {
    it('is strictly deterministic given identical seed and inputs', () => {
      const seed = 333;
      let stateA = pixelPipelineSim.init(seed);
      let stateB = pixelPipelineSim.init(seed);

      expect(stateA).toEqual(stateB);

      const dt = 1 / 60;
      for (let i = 0; i < 60; i++) {
        stateA = pixelPipelineSim.step(stateA, null, dt);
        stateB = pixelPipelineSim.step(stateB, null, dt);
      }

      expect(stateA).toEqual(stateB);
    });

    it('fails when dropped frames exceed threshold', () => {
      const state = pixelPipelineSim.init(42);
      const failState = { ...state, droppedFrames: 10 };
      const next = pixelPipelineSim.step(failState, null, 1 / 60);
      expect(next.isFailed).toBe(true);
    });

    it('wins when smooth frames hit benchmark', () => {
      const state = pixelPipelineSim.init(42);
      const winState = { ...state, smoothFrames: 36 };
      const next = pixelPipelineSim.step(winState, null, 1 / 60);
      expect(pixelPipelineSim.isWon(next)).toBe(true);
    });
  });

  // 6. TIMING ORACLE SIMULATION TESTS
  describe('Timing Oracle Simulation', () => {
    it('is strictly deterministic given identical seed and inputs', () => {
      const seed = 888;
      let stateA = timingOracleSim.init(seed);
      let stateB = timingOracleSim.init(seed);

      expect(stateA.secret).toEqual(stateB.secret);

      const dt = 1 / 60;
      const input = { type: 'SUBMIT_PROBE' as const, probe: 'A000' };
      stateA = timingOracleSim.step(stateA, input, dt);
      stateB = timingOracleSim.step(stateB, input, dt);

      expect(stateA).toEqual(stateB);
    });

    it('leaks measurable timing for matched prefix', () => {
      const state = timingOracleSim.init(42);
      const firstChar = state.secret[0];
      const matchingProbe = firstChar + '000';
      const nonMatchingProbe = (firstChar === 'A' ? 'B' : 'A') + '000';

      const stateMatch = timingOracleSim.step(state, { type: 'SUBMIT_PROBE', probe: matchingProbe }, 1 / 60);
      const stateNoMatch = timingOracleSim.step(state, { type: 'SUBMIT_PROBE', probe: nonMatchingProbe }, 1 / 60);

      const matchLatency = stateMatch.recentProbes[0].latencyMs;
      const noMatchLatency = stateNoMatch.recentProbes[0].latencyMs;

      expect(matchLatency).toBeGreaterThan(noMatchLatency);
    });

    it('wins when secret is recovered and constant-time patch applied', () => {
      const state = timingOracleSim.init(42);
      const solvedState = { ...state, recoveredKey: state.secret };
      const patchedState = timingOracleSim.step(solvedState, { type: 'APPLY_CONSTANT_TIME_PATCH' }, 1 / 60);
      expect(timingOracleSim.isWon(patchedState)).toBe(true);
    });
  });
});
