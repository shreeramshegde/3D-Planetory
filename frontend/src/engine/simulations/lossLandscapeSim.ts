import { Simulation } from '../types';

export type OptimizerType = 'SGD' | 'MOMENTUM' | 'ADAM';

export interface LossLandscapeState {
  time: number;
  stepCount: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Adam first and second moments
  m_x: number;
  m_y: number;
  v_x: number;
  v_y: number;
  adamStep: number;
  // Optimizer configuration
  optimizer: OptimizerType;
  learningRate: number;
  momentumBeta: number;
  currentLoss: number;
  gradNorm: number;
  trajectory: [number, number, number][]; // [x, y, loss]
  convergenceTimer: number;
  isDiverged: boolean;
  isWon: boolean;
}

export type LossLandscapeInput =
  | { type: 'SET_OPTIMIZER'; optimizer: OptimizerType }
  | { type: 'SET_LEARNING_RATE'; lr: number }
  | { type: 'SET_MOMENTUM'; beta: number }
  | { type: 'RESET_TRAJECTORY' }
  | { type: 'NUDGE'; dx: number; dy: number };

// Analytical 3D Loss surface: Ravine with non-convex local extrema
export function computeLoss(x: number, y: number): number {
  const ravine = 0.5 * (x * x + 10.0 * y * y);
  const ripple = 1.2 * Math.sin(1.8 * x) * Math.cos(1.8 * y);
  const decoyMin = 2.0 / ((x - 2.2) * (x - 2.2) + (y - 1.2) * (y - 1.2) + 1.0);
  return ravine + ripple + decoyMin;
}

// Analytical Gradients dL/dx and dL/dy
export function computeGradients(x: number, y: number): [number, number] {
  const dRavine_dx = x;
  const dRavine_dy = 10.0 * y;

  const dRipple_dx = 1.2 * 1.8 * Math.cos(1.8 * x) * Math.cos(1.8 * y);
  const dRipple_dy = -1.2 * 1.8 * Math.sin(1.8 * x) * Math.sin(1.8 * y);

  const denom = (x - 2.2) * (x - 2.2) + (y - 1.2) * (y - 1.2) + 1.0;
  const denomSq = denom * denom;
  const dDecoy_dx = (-4.0 * (x - 2.2)) / denomSq;
  const dDecoy_dy = (-4.0 * (y - 1.2)) / denomSq;

  return [dRavine_dx + dRipple_dx + dDecoy_dx, dRavine_dy + dRipple_dy + dDecoy_dy];
}

const EPSILON = 1e-8;
const ADAM_BETA1 = 0.9;
const ADAM_BETA2 = 0.999;
const TARGET_LOSS = 0.25;

export const lossLandscapeSim: Simulation<LossLandscapeState, LossLandscapeInput> = {
  init(seed: number): LossLandscapeState {
    // Initial starting point on high ridge
    const startX = -3.2 + (seed % 10) * 0.1;
    const startY = 2.4 - (seed % 5) * 0.1;
    const initialLoss = computeLoss(startX, startY);

    return {
      time: 0,
      stepCount: 0,
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      m_x: 0,
      m_y: 0,
      v_x: 0,
      v_y: 0,
      adamStep: 0,
      optimizer: 'SGD',
      learningRate: 0.04,
      momentumBeta: 0.85,
      currentLoss: initialLoss,
      gradNorm: 0,
      trajectory: [[startX, startY, initialLoss]],
      convergenceTimer: 0,
      isDiverged: false,
      isWon: false,
    };
  },

  step(state: LossLandscapeState, input: LossLandscapeInput | null, dt: number): LossLandscapeState {
    let opt = state.optimizer;
    let lr = state.learningRate;
    let beta = state.momentumBeta;
    let x = state.x;
    let y = state.y;
    let isDiverged = state.isDiverged;
    let isWon = state.isWon;

    if (input) {
      if (input.type === 'SET_OPTIMIZER') opt = input.optimizer;
      else if (input.type === 'SET_LEARNING_RATE') lr = Math.max(0.001, Math.min(0.4, input.lr));
      else if (input.type === 'SET_MOMENTUM') beta = Math.max(0.0, Math.min(0.98, input.beta));
      else if (input.type === 'RESET_TRAJECTORY') {
        const startX = -3.2 + (state.stepCount % 10) * 0.1;
        const startY = 2.4 - (state.stepCount % 5) * 0.1;
        const initialLoss = computeLoss(startX, startY);
        return {
          ...state,
          x: startX,
          y: startY,
          vx: 0,
          vy: 0,
          m_x: 0,
          m_y: 0,
          v_x: 0,
          v_y: 0,
          adamStep: 0,
          optimizer: opt,
          learningRate: lr,
          momentumBeta: beta,
          currentLoss: initialLoss,
          gradNorm: 0,
          trajectory: [[startX, startY, initialLoss]],
          convergenceTimer: 0,
          isDiverged: false,
          isWon: false,
        };
      } else if (input.type === 'NUDGE') {
        x += input.dx;
        y += input.dy;
      }
    }

    if (dt <= 0 || isDiverged || isWon) {
      return {
        ...state,
        optimizer: opt,
        learningRate: lr,
        momentumBeta: beta,
      };
    }

    const [gx, gy] = computeGradients(x, y);
    const gradNorm = Math.sqrt(gx * gx + gy * gy);

    let nextVx = state.vx;
    let nextVy = state.vy;
    let nextMx = state.m_x;
    let nextMy = state.m_y;
    let nextAdamVx = state.v_x;
    let nextAdamVy = state.v_y;
    let nextAdamStep = state.adamStep;

    if (opt === 'SGD') {
      x -= lr * gx;
      y -= lr * gy;
      nextVx = 0;
      nextVy = 0;
    } else if (opt === 'MOMENTUM') {
      nextVx = beta * state.vx + lr * gx;
      nextVy = beta * state.vy + lr * gy;
      x -= nextVx;
      y -= nextVy;
    } else if (opt === 'ADAM') {
      nextAdamStep++;
      nextMx = ADAM_BETA1 * state.m_x + (1 - ADAM_BETA1) * gx;
      nextMy = ADAM_BETA1 * state.m_y + (1 - ADAM_BETA1) * gy;
      nextAdamVx = ADAM_BETA2 * state.v_x + (1 - ADAM_BETA2) * (gx * gx);
      nextAdamVy = ADAM_BETA2 * state.v_y + (1 - ADAM_BETA2) * (gy * gy);

      const mHatX = nextMx / (1 - Math.pow(ADAM_BETA1, nextAdamStep));
      const mHatY = nextMy / (1 - Math.pow(ADAM_BETA1, nextAdamStep));
      const vHatX = nextAdamVx / (1 - Math.pow(ADAM_BETA2, nextAdamStep));
      const vHatY = nextAdamVy / (1 - Math.pow(ADAM_BETA2, nextAdamStep));

      x -= (lr / (Math.sqrt(vHatX) + EPSILON)) * mHatX;
      y -= (lr / (Math.sqrt(vHatY) + EPSILON)) * mHatY;
    }

    const loss = computeLoss(x, y);

    // Divergence detection
    const isNaNOrInf = !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(loss);
    const isExploded = Math.abs(x) > 12 || Math.abs(y) > 12;

    if (isNaNOrInf || isExploded) {
      return {
        ...state,
        optimizer: opt,
        learningRate: lr,
        momentumBeta: beta,
        isDiverged: true,
        isWon: false,
      };
    }

    // Trajectory logging (sample every 4 frames)
    const newTraj = state.trajectory.length > 120 ? state.trajectory.slice(1) : [...state.trajectory];
    if (state.stepCount % 3 === 0) {
      newTraj.push([x, y, loss]);
    }

    // Convergence stability timer
    let convTimer = state.convergenceTimer;
    let won = false;

    if (loss <= TARGET_LOSS && gradNorm < 0.8) {
      convTimer += dt;
      if (convTimer >= 1.2) {
        won = true;
      }
    } else {
      convTimer = Math.max(0, convTimer - dt * 0.5);
    }

    return {
      time: state.time + dt,
      stepCount: state.stepCount + 1,
      x,
      y,
      vx: nextVx,
      vy: nextVy,
      m_x: nextMx,
      m_y: nextMy,
      v_x: nextAdamVx,
      v_y: nextAdamVy,
      adamStep: nextAdamStep,
      optimizer: opt,
      learningRate: lr,
      momentumBeta: beta,
      currentLoss: loss,
      gradNorm,
      trajectory: newTraj,
      convergenceTimer: convTimer,
      isDiverged: false,
      isWon: won,
    };
  },

  getScore(state: LossLandscapeState): number {
    if (state.isDiverged) return 0;
    const lossScore = Math.max(0, Math.floor((3.0 - state.currentLoss) * 200));
    const stepBonus = state.isWon ? Math.max(0, Math.floor((400 - state.stepCount) * 1.5)) : 0;
    return Math.max(0, lossScore + stepBonus);
  },

  isTerminal(state: LossLandscapeState): boolean {
    return state.isDiverged || state.isWon;
  },

  isWon(state: LossLandscapeState): boolean {
    return state.isWon && !state.isDiverged;
  },
};
