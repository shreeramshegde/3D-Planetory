export interface InputLogEntry<TInput> {
  tick: number;
  timeMs: number;
  input: TInput;
}

export interface Simulation<TState, TInput> {
  init: (seed: number) => TState;
  step: (state: TState, input: TInput | null, dt: number) => TState;
  getScore: (state: TState) => number;
  isTerminal: (state: TState) => boolean;
  isWon: (state: TState) => boolean;
}

export const FIXED_TIMESTEP_SEC = 1 / 60; // 60Hz fixed physics step
