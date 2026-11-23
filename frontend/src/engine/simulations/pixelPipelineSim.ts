import { createMulberry32 } from '../prng';
import { Simulation } from '../types';

export type MutationType = 'COMPOSITOR_OPACITY' | 'REPAINT_COLOR' | 'FULL_REFLOW' | 'FORCED_SYNC_LAYOUT';

export interface PipelineItem {
  id: number;
  type: MutationType;
  name: string;
  stage: 'JS' | 'STYLE' | 'LAYOUT' | 'PAINT' | 'COMPOSITE' | 'DONE';
  currentCostMs: number;
  totalCostMs: number;
}

export interface PipelineUpgrades {
  willChangeLayer: boolean; // isolates to compositor
  batchReads: boolean;      // eliminates forced sync layout
  workerOffload: boolean;   // cuts JS execution time in half
}

export interface PixelPipelineState {
  time: number;
  currentFrame: number;
  frameDurationMs: number;
  droppedFrames: number;
  smoothFrames: number;
  itemsQueue: PipelineItem[];
  activeItems: PipelineItem[];
  upgrades: PipelineUpgrades;
  budgetCoins: number;
  isFailed: boolean;
  isWon: boolean;
  prngState: number;
}

export type PixelPipelineInput =
  | { type: 'BUY_UPGRADE'; upgrade: keyof PipelineUpgrades }
  | { type: 'ROUTE_TO_COMPOSITOR'; itemId: number }
  | { type: 'DEFER_TASK'; itemId: number };

const FRAME_BUDGET_MS = 16.6;
const MAX_DROPPED_FAIL = 9;
const TARGET_SMOOTH_FRAMES = 35;

export const pixelPipelineSim: Simulation<PixelPipelineState, PixelPipelineInput> = {
  init(seed: number): PixelPipelineState {
    const rng = createMulberry32(seed);

    const initialQueue: PipelineItem[] = [];
    for (let i = 1; i <= 8; i++) {
      const roll = rng();
      let type: MutationType = 'COMPOSITOR_OPACITY';
      let cost = 2.0;

      if (roll < 0.3) {
        type = 'FORCED_SYNC_LAYOUT';
        cost = 14.5;
      } else if (roll < 0.6) {
        type = 'FULL_REFLOW';
        cost = 8.5;
      } else if (roll < 0.8) {
        type = 'REPAINT_COLOR';
        cost = 5.0;
      }

      initialQueue.push({
        id: i,
        type,
        name: type.toLowerCase(),
        stage: 'JS',
        currentCostMs: 0,
        totalCostMs: cost,
      });
    }

    return {
      time: 0,
      currentFrame: 0,
      frameDurationMs: 0,
      droppedFrames: 0,
      smoothFrames: 0,
      itemsQueue: initialQueue,
      activeItems: [],
      upgrades: {
        willChangeLayer: false,
        batchReads: false,
        workerOffload: false,
      },
      budgetCoins: 50,
      isFailed: false,
      isWon: false,
      prngState: seed,
    };
  },

  step(state: PixelPipelineState, input: PixelPipelineInput | null, dt: number): PixelPipelineState {
    if (state.isFailed || state.isWon) return state;

    const nextState: PixelPipelineState = {
      ...state,
      time: state.time + dt,
      upgrades: { ...state.upgrades },
      itemsQueue: state.itemsQueue.map((item) => ({ ...item })),
      activeItems: state.activeItems.map((item) => ({ ...item })),
    };

    const rng = createMulberry32((state.prngState + Math.floor(state.time * 60)) >>> 0);

    // 1. Process player actions and upgrades
    if (input) {
      if (input.type === 'BUY_UPGRADE') {
        const cost = input.upgrade === 'batchReads' ? 30 : input.upgrade === 'willChangeLayer' ? 25 : 20;
        if (nextState.budgetCoins >= cost && !nextState.upgrades[input.upgrade]) {
          nextState.budgetCoins -= cost;
          nextState.upgrades[input.upgrade] = true;
        }
      } else if (input.type === 'ROUTE_TO_COMPOSITOR') {
        const item = nextState.activeItems.find((x) => x.id === input.itemId) || nextState.itemsQueue.find((x) => x.id === input.itemId);
        if (item) {
          item.stage = 'COMPOSITE';
          item.totalCostMs = 1.5;
        }
      } else if (input.type === 'DEFER_TASK') {
        const idx = nextState.activeItems.findIndex((x) => x.id === input.itemId);
        if (idx !== -1) {
          const [deferred] = nextState.activeItems.splice(idx, 1);
          nextState.itemsQueue.push(deferred);
        }
      }
    }

    // 2. Continuous frame progression (simulate 60Hz tick)
    nextState.currentFrame++;

    // Spawn new mutations into queue
    if (rng() < 0.25 && nextState.itemsQueue.length < 10) {
      const id = nextState.currentFrame * 10 + nextState.itemsQueue.length;
      const roll = rng();
      let type: MutationType = 'COMPOSITOR_OPACITY';
      let cost = 1.8;

      if (roll < 0.35) {
        type = 'FORCED_SYNC_LAYOUT';
        cost = 15.0;
      } else if (roll < 0.65) {
        type = 'FULL_REFLOW';
        cost = 8.0;
      } else if (roll < 0.85) {
        type = 'REPAINT_COLOR';
        cost = 4.5;
      }

      nextState.itemsQueue.push({
        id,
        type,
        name: type.toLowerCase(),
        stage: 'JS',
        currentCostMs: 0,
        totalCostMs: cost,
      });
    }

    // Take top 2 items from queue into frame
    while (nextState.activeItems.length < 3 && nextState.itemsQueue.length > 0) {
      const item = nextState.itemsQueue.shift()!;
      // Apply upgrades
      if (nextState.upgrades.batchReads && item.type === 'FORCED_SYNC_LAYOUT') {
        item.type = 'FULL_REFLOW';
        item.totalCostMs = 7.0; // Batch reads eliminates forced reflow!
      }
      if (nextState.upgrades.willChangeLayer && item.type === 'COMPOSITOR_OPACITY') {
        item.totalCostMs = 0.8;
      }
      if (nextState.upgrades.workerOffload) {
        item.totalCostMs = Math.max(1.0, item.totalCostMs - 2.5);
      }
      nextState.activeItems.push(item);
    }

    // Compute frame cost for this frame
    let frameCost = 2.5; // Base browser overhead (V8 GC, event loop)
    for (const item of nextState.activeItems) {
      frameCost += item.totalCostMs;
    }
    nextState.frameDurationMs = frameCost;

    // Frame budget determination
    if (frameCost > FRAME_BUDGET_MS) {
      nextState.droppedFrames++;
    } else {
      nextState.smoothFrames++;
      nextState.budgetCoins += 1;
    }

    // Clear completed items from frame
    nextState.activeItems = [];

    // Check terminal conditions
    if (nextState.droppedFrames >= MAX_DROPPED_FAIL) {
      nextState.isFailed = true;
    } else if (nextState.smoothFrames >= TARGET_SMOOTH_FRAMES) {
      nextState.isWon = true;
    }

    return nextState;
  },

  getScore(state: PixelPipelineState): number {
    if (state.isFailed) return 0;
    const smoothPoints = state.smoothFrames * 15;
    const droppedPenalty = state.droppedFrames * 25;
    const coinBonus = state.budgetCoins * 2;
    return Math.max(0, smoothPoints - droppedPenalty + coinBonus);
  },

  isTerminal(state: PixelPipelineState): boolean {
    return state.isFailed || state.isWon;
  },

  isWon(state: PixelPipelineState): boolean {
    return state.isWon && !state.isFailed;
  },
};
