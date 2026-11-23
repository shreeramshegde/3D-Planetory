import { useRef, useState, useEffect, useCallback } from 'react';
import { Simulation, InputLogEntry, FIXED_TIMESTEP_SEC } from './types';

export interface UseSimulationLoopOptions {
  startPaused?: boolean;
}

export function useSimulationLoop<TState, TInput>(
  sim: Simulation<TState, TInput>,
  initialSeed: number = 42,
  options?: UseSimulationLoopOptions
) {
  const [state, setState] = useState<TState>(() => sim.init(initialSeed));
  const [seed, setSeed] = useState<number>(initialSeed);
  const [isRunning, setIsRunning] = useState<boolean>(!options?.startPaused);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const stateRef = useRef<TState>(state);
  stateRef.current = state;

  const isRunningRef = useRef<boolean>(!options?.startPaused);
  isRunningRef.current = isRunning;

  const isGameOverRef = useRef<boolean>(false);
  isGameOverRef.current = isGameOver;

  const currentInputRef = useRef<TInput | null>(null);
  const inputLogRef = useRef<InputLogEntry<TInput>[]>([]);
  const tickRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  const sendInput = useCallback((input: TInput) => {
    inputLogRef.current.push({
      tick: tickRef.current,
      timeMs: Math.round(tickRef.current * FIXED_TIMESTEP_SEC * 1000),
      input,
    });

    // If currently paused or game is over, immediately evaluate the input on the current state
    // with dt = 0 so sliders, policies, and upgrades update without delay!
    if (!isRunningRef.current || isGameOverRef.current) {
      const next = sim.step(stateRef.current, input, 0);
      stateRef.current = next;
      setState(next);
      currentInputRef.current = null;
    } else {
      currentInputRef.current = input;
    }
  }, [sim]);

  const toggleRunning = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const reset = useCallback((newSeed?: number) => {
    const s = newSeed ?? Math.floor(Math.random() * 100000);
    const fresh = sim.init(s);
    setSeed(s);
    setState(fresh);
    stateRef.current = fresh;
    currentInputRef.current = null;
    inputLogRef.current = [];
    tickRef.current = 0;
    accumulatorRef.current = 0;
    lastTimeRef.current = 0;
    setIsGameOver(false);
    setIsVictory(false);
    setElapsedTime(0);
    setIsRunning(!options?.startPaused);
  }, [sim, options?.startPaused]);

  useEffect(() => {
    let active = true;

    const loop = (timestamp: number) => {
      if (!active) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const rawDelta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Cap rawDelta to prevent spiral of death on tab freeze
      const frameDelta = Math.min(rawDelta, 0.1);

      if (isRunning && !isGameOver) {
        accumulatorRef.current += frameDelta;

        let curState = stateRef.current;
        let didStep = false;

        while (accumulatorRef.current >= FIXED_TIMESTEP_SEC) {
          curState = sim.step(curState, currentInputRef.current, FIXED_TIMESTEP_SEC);
          currentInputRef.current = null; // consume one-shot input
          accumulatorRef.current -= FIXED_TIMESTEP_SEC;
          tickRef.current++;
          didStep = true;

          if (sim.isTerminal(curState)) {
            setIsGameOver(true);
            setIsVictory(sim.isWon(curState));
            break;
          }
        }

        if (didStep) {
          stateRef.current = curState;
          setState(curState);
          setElapsedTime(tickRef.current * FIXED_TIMESTEP_SEC);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, isGameOver, sim]);

  return {
    state,
    seed,
    isRunning,
    isGameOver,
    isVictory,
    elapsedTime,
    score: sim.getScore(state),
    inputLog: inputLogRef.current,
    sendInput,
    reset,
    setIsRunning,
    toggleRunning,
  };
}
