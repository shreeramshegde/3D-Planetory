import { createMulberry32 } from '../prng';
import { Simulation } from '../types';

export type SchedulingPolicy = 'ROUND_ROBIN' | 'PRIORITY' | 'SJF';

export interface ProcessBlock {
  id: number;
  name: string;
  totalBurst: number;
  burstRemaining: number;
  priority: number; // 1 = High, 2 = Medium, 3 = Low
  ioWaitRemaining: number;
  waitTime: number;
  status: 'READY' | 'RUNNING' | 'BLOCKED_IO' | 'STARVED' | 'DONE';
  assignedCore: number | null;
}

export interface CpuCore {
  id: number;
  activeProcessId: number | null;
  timeSliceRemaining: number;
  busyTime: number;
}

export interface SchedulerState {
  time: number;
  cores: CpuCore[];
  readyQueue: ProcessBlock[];
  blockedQueue: ProcessBlock[];
  doneCount: number;
  starvedCount: number;
  totalWaitPenalty: number;
  policy: SchedulingPolicy;
  nextProcessId: number;
  spawnTimer: number;
  targetCount: number;
  isFailed: boolean;
  isWon: boolean;
  prngState: number;
}

export type SchedulerInput =
  | { type: 'SET_POLICY'; policy: SchedulingPolicy }
  | { type: 'BOOST_PRIORITY'; processId: number }
  | { type: 'ASSIGN_CORE'; processId: number; coreId: number };

const QUANTUM_SEC = 0.5; // Round-robin quantum
const STARVATION_THRESHOLD_SEC = 12.0;
const MAX_STARVED_FAIL = 3;
const TARGET_PROCESSES = 24;

export const schedulerSim: Simulation<SchedulerState, SchedulerInput> = {
  init(seed: number): SchedulerState {
    const rng = createMulberry32(seed);

    const initialQueue: ProcessBlock[] = [];
    for (let i = 1; i <= 6; i++) {
      const burst = 1.5 + rng() * 3.5;
      const priority = Math.floor(rng() * 3) + 1;
      initialQueue.push({
        id: i,
        name: `pid_${i * 100}`,
        totalBurst: burst,
        burstRemaining: burst,
        priority,
        ioWaitRemaining: 0,
        waitTime: 0,
        status: 'READY',
        assignedCore: null,
      });
    }

    return {
      time: 0,
      cores: [0, 1, 2, 3].map((id) => ({
        id,
        activeProcessId: null,
        timeSliceRemaining: QUANTUM_SEC,
        busyTime: 0,
      })),
      readyQueue: initialQueue,
      blockedQueue: [],
      doneCount: 0,
      starvedCount: 0,
      totalWaitPenalty: 0,
      policy: 'ROUND_ROBIN',
      nextProcessId: 7,
      spawnTimer: 0,
      targetCount: TARGET_PROCESSES,
      isFailed: false,
      isWon: false,
      prngState: seed,
    };
  },

  step(state: SchedulerState, input: SchedulerInput | null, dt: number): SchedulerState {
    if (state.isFailed || state.isWon) return state;

    const nextState: SchedulerState = {
      ...state,
      time: state.time + dt,
      cores: state.cores.map((c) => ({ ...c })),
      readyQueue: state.readyQueue.map((p) => ({ ...p })),
      blockedQueue: state.blockedQueue.map((p) => ({ ...p })),
    };

    const rng = createMulberry32((state.prngState + Math.floor(state.time * 1000)) >>> 0);

    // 1. Process player inputs
    if (input) {
      if (input.type === 'SET_POLICY') {
        nextState.policy = input.policy;
      } else if (input.type === 'BOOST_PRIORITY') {
        const p = nextState.readyQueue.find((x) => x.id === input.processId);
        if (p && p.priority > 1) {
          p.priority -= 1;
          p.status = 'READY';
        }
      } else if (input.type === 'ASSIGN_CORE') {
        const core = nextState.cores.find((c) => c.id === input.coreId);
        const pIndex = nextState.readyQueue.findIndex((x) => x.id === input.processId);
        if (core && pIndex !== -1) {
          const [p] = nextState.readyQueue.splice(pIndex, 1);
          p.assignedCore = core.id;
          p.status = 'RUNNING';
          core.activeProcessId = p.id;
          core.timeSliceRemaining = QUANTUM_SEC;
        }
      }
    }

    // 2. Spawn arriving processes up to target
    nextState.spawnTimer += dt;
    if (nextState.spawnTimer >= 2.0 && nextState.nextProcessId <= nextState.targetCount + 6) {
      nextState.spawnTimer = 0;
      const burst = 1.0 + rng() * 3.0;
      const priority = Math.floor(rng() * 3) + 1;
      nextState.readyQueue.push({
        id: nextState.nextProcessId,
        name: `pid_${nextState.nextProcessId * 100}`,
        totalBurst: burst,
        burstRemaining: burst,
        priority,
        ioWaitRemaining: 0,
        waitTime: 0,
        status: 'READY',
        assignedCore: null,
      });
      nextState.nextProcessId++;
    }

    // 3. Update I/O blocked queue
    for (let i = nextState.blockedQueue.length - 1; i >= 0; i--) {
      const b = nextState.blockedQueue[i];
      b.ioWaitRemaining -= dt;
      if (b.ioWaitRemaining <= 0) {
        b.ioWaitRemaining = 0;
        b.status = 'READY';
        nextState.readyQueue.push(b);
        nextState.blockedQueue.splice(i, 1);
      }
    }

    // 4. Update Ready Queue wait times & detect starvation
    let starvedTotal = 0;
    for (const p of nextState.readyQueue) {
      p.waitTime += dt;
      nextState.totalWaitPenalty += dt * p.priority;
      if (p.waitTime >= STARVATION_THRESHOLD_SEC) {
        p.status = 'STARVED';
        starvedTotal++;
      }
    }
    nextState.starvedCount = starvedTotal;

    // Fail check on starvation
    if (nextState.starvedCount >= MAX_STARVED_FAIL) {
      nextState.isFailed = true;
      return nextState;
    }

    // 5. Core execution & scheduling policy dispatch
    for (const core of nextState.cores) {
      let activeP = nextState.readyQueue.find((p) => p.assignedCore === core.id && p.status === 'RUNNING');

      // If idle, pick next process based on scheduling policy
      if (!activeP && nextState.readyQueue.length > 0) {
        let chosenIndex = 0;

        if (nextState.policy === 'ROUND_ROBIN') {
          // First available ready process
          chosenIndex = nextState.readyQueue.findIndex((p) => p.assignedCore === null);
        } else if (nextState.policy === 'PRIORITY') {
          // Highest priority (lowest priority number)
          let bestPri = 999;
          nextState.readyQueue.forEach((p, idx) => {
            if (p.assignedCore === null && p.priority < bestPri) {
              bestPri = p.priority;
              chosenIndex = idx;
            }
          });
        } else if (nextState.policy === 'SJF') {
          // Shortest job first
          let shortestBurst = 999;
          nextState.readyQueue.forEach((p, idx) => {
            if (p.assignedCore === null && p.burstRemaining < shortestBurst) {
              shortestBurst = p.burstRemaining;
              chosenIndex = idx;
            }
          });
        }

        if (chosenIndex >= 0 && chosenIndex < nextState.readyQueue.length) {
          activeP = nextState.readyQueue[chosenIndex];
          activeP.assignedCore = core.id;
          activeP.status = 'RUNNING';
          core.activeProcessId = activeP.id;
          core.timeSliceRemaining = QUANTUM_SEC;
        }
      }

      if (activeP) {
        core.busyTime += dt;
        activeP.burstRemaining -= dt;
        core.timeSliceRemaining -= dt;

        // Occasional I/O burst trigger (10% chance when burst finishes half)
        if (
          activeP.burstRemaining > 0.5 &&
          Math.abs(activeP.burstRemaining - activeP.totalBurst * 0.5) < dt &&
          rng() < 0.25
        ) {
          activeP.ioWaitRemaining = 1.5;
          activeP.status = 'BLOCKED_IO';
          activeP.assignedCore = null;
          core.activeProcessId = null;
          const idx = nextState.readyQueue.findIndex((x) => x.id === activeP!.id);
          if (idx !== -1) {
            nextState.readyQueue.splice(idx, 1);
            nextState.blockedQueue.push(activeP);
          }
          continue;
        }

        // Process completed
        if (activeP.burstRemaining <= 0) {
          activeP.burstRemaining = 0;
          activeP.status = 'DONE';
          activeP.assignedCore = null;
          core.activeProcessId = null;
          nextState.doneCount++;
          const idx = nextState.readyQueue.findIndex((x) => x.id === activeP!.id);
          if (idx !== -1) nextState.readyQueue.splice(idx, 1);
        }
        // Quantum preemption for Round-Robin
        else if (nextState.policy === 'ROUND_ROBIN' && core.timeSliceRemaining <= 0) {
          activeP.status = 'READY';
          activeP.assignedCore = null;
          core.activeProcessId = null;
          // Rotate to back of queue
          const idx = nextState.readyQueue.findIndex((x) => x.id === activeP!.id);
          if (idx !== -1) {
            const [rotated] = nextState.readyQueue.splice(idx, 1);
            nextState.readyQueue.push(rotated);
          }
        }
      }
    }

    // Win condition check
    if (nextState.doneCount >= nextState.targetCount) {
      nextState.isWon = true;
    }

    return nextState;
  },

  getScore(state: SchedulerState): number {
    const throughputPoints = state.doneCount * 45;
    const penalty = Math.min(throughputPoints * 0.7, Math.floor(state.totalWaitPenalty * 1.5));
    const bonus = state.isWon ? Math.max(0, Math.floor((60 - state.time) * 10)) : 0;
    return Math.max(0, throughputPoints - penalty + bonus);
  },

  isTerminal(state: SchedulerState): boolean {
    return state.isFailed || state.isWon;
  },

  isWon(state: SchedulerState): boolean {
    return state.isWon && !state.isFailed;
  },
};
