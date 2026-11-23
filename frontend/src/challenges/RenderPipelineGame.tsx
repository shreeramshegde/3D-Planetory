import { useState, useEffect, useRef } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { Check, Monitor, Play, RotateCcw, Activity } from 'lucide-react';

export const RenderPipelineGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFps, setCurrentFps] = useState(24);
  const [frameTimeMs, setFrameTimeMs] = useState(36.4);
  const [benchmarkTime, setBenchmarkTime] = useState(0);
  const targetBenchmark = 15; // 15 seconds solid 60 FPS to pass

  // 4 Core Architectural Optimizations
  const [batchDom, setBatchDom] = useState(false);
  const [gpuComposite, setGpuComposite] = useState(false);
  const [cssContainment, setCssContainment] = useState(false);
  const [webWorker, setWebWorker] = useState(false);

  const [isWon, setIsWon] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<number[]>([]);
  const loopRef = useRef<number | null>(null);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.frontend);

  const resetGame = () => {
    soundEngine.playClick();
    if (loopRef.current) clearInterval(loopRef.current);
    historyRef.current = [];
    setCurrentFps(24);
    setFrameTimeMs(36.4);
    setBenchmarkTime(0);
    setBatchDom(false);
    setGpuComposite(false);
    setCssContainment(false);
    setWebWorker(false);
    setIsWon(false);
    setIsFailed(false);
    setIsPlaying(false);
  };

  const startGame = () => {
    soundEngine.playClick();
    resetGame();
    setIsPlaying(true);
  };

  // Simulation of rendering engine loop
  useEffect(() => {
    if (!isPlaying || isWon || isFailed) return;

    loopRef.current = window.setInterval(() => {
      // Calculate frame time based on active optimizations
      let baseTime = 38.0;
      if (batchDom) baseTime -= 8.5; // Avoid layout thrashing
      if (gpuComposite) baseTime -= 7.0; // GPU layer promotion
      if (cssContainment) baseTime -= 4.5; // Scoped layout reflow
      if (webWorker) baseTime -= 4.2; // Main thread offload

      const jitter = (Math.random() - 0.5) * 1.6;
      const actualFrameTime = Math.max(12.5, Math.round((baseTime + jitter) * 10) / 10);
      const fps = Math.min(60, Math.round(1000 / actualFrameTime));

      setFrameTimeMs(actualFrameTime);
      setCurrentFps(fps);

      // Record in history for oscilloscope canvas
      historyRef.current.push(actualFrameTime);
      if (historyRef.current.length > 50) historyRef.current.shift();

      // Benchmark progress: only increments when solid 60 FPS (<= 16.6ms)
      if (actualFrameTime <= 16.6) {
        setBenchmarkTime((t) => {
          const nextT = t + 1;
          if (nextT >= targetBenchmark) {
            setIsWon(true);
            setIsPlaying(false);
            completeChallenge('frontend');
          }
          return nextT;
        });
      }
    }, 1000);

    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [isPlaying, isWon, isFailed, batchDom, gpuComposite, cssContainment, webWorker, completeChallenge]);

  // Render Frame Timing Oscilloscope Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 16.6ms Target line (60 FPS threshold)
    const targetY = h - (16.6 / 45) * h;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, targetY);
    ctx.lineTo(w, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw history waveform
    const data = historyRef.current;
    if (data.length > 1) {
      ctx.lineWidth = 2;
      ctx.beginPath();
      data.forEach((val, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - (val / 45) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = frameTimeMs <= 16.6 ? '#10b981' : '#f43f5e';
      ctx.stroke();
    }
  }, [frameTimeMs]);

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-pink-400 font-bold text-xs tracking-wider uppercase">
            16.6ms Render Pipeline: Zero-Jank
          </h3>
          <p className="text-[11px] text-slate-400">
            Eliminate forced reflows and composite to GPU to sustain 60 FPS (&le; 16.6ms).
          </p>
        </div>
        <button
          onClick={resetGame}
          className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">FRAME RATE</span>
          <span
            className={`font-bold ${
              currentFps >= 58 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {currentFps} FPS
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">FRAME BUDGET</span>
          <span
            className={`font-bold ${
              frameTimeMs <= 16.6 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {frameTimeMs} ms
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">TARGET BUDGET</span>
          <span className="font-bold text-slate-300">&le; 16.6 ms</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">60 FPS HOLD</span>
          <span className="font-bold text-amber-300">
            {benchmarkTime}s / {targetBenchmark}s
          </span>
        </div>
      </div>

      {/* Frame Time Oscilloscope Canvas */}
      <div className="relative h-40 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={360}
          height={160}
          className="w-full h-full block"
        />
        <div className="absolute top-1.5 left-2 text-[9px] text-slate-500 flex items-center gap-1">
          <Monitor className="w-3 h-3 text-pink-400" />
          <span>FRAME OSCILLOSCOPE (DASHED: 16.6ms 60 FPS BOUNDARY)</span>
        </div>
      </div>

      {/* 4 Architectural Interventions */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => {
            soundEngine.playClick();
            setBatchDom(!batchDom);
          }}
          className={`p-2 rounded border font-semibold text-[10px] text-left transition-colors ${
            batchDom
              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span className="block font-bold">BATCH DOM VIA RAF</span>
          <span>{batchDom ? 'DEPLOYED (-8.5ms reflow)' : 'LAYOUT THRASHING'}</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setGpuComposite(!gpuComposite);
          }}
          className={`p-2 rounded border font-semibold text-[10px] text-left transition-colors ${
            gpuComposite
              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span className="block font-bold">GPU COMPOSITE LAYER</span>
          <span>{gpuComposite ? 'DEPLOYED (-7.0ms paint)' : 'CPU REPAINTING'}</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setCssContainment(!cssContainment);
          }}
          className={`p-2 rounded border font-semibold text-[10px] text-left transition-colors ${
            cssContainment
              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span className="block font-bold">CSS CONTAINMENT</span>
          <span>{cssContainment ? 'DEPLOYED (-4.5ms layout)' : 'UNBOUNDED CASCADES'}</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setWebWorker(!webWorker);
          }}
          className={`p-2 rounded border font-semibold text-[10px] text-left transition-colors ${
            webWorker
              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span className="block font-bold">WEB WORKER OFFLOAD</span>
          <span>{webWorker ? 'DEPLOYED (-4.2ms script)' : 'MAIN THREAD BLOCKED'}</span>
        </button>
      </div>

      {/* Trigger Button */}
      <button
        disabled={isPlaying || isWon || isCompleted}
        onClick={startGame}
        className={`w-full py-2.5 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
          isWon || isCompleted
            ? 'bg-emerald-600/80 text-white cursor-default'
            : isPlaying
            ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40'
            : 'bg-pink-600 hover:bg-pink-500 text-white'
        }`}
      >
        {isWon || isCompleted ? (
          <>
            <Check className="w-4 h-4" /> 60 FPS RENDER BENCHMARK VERIFIED (+300 XP)
          </>
        ) : isPlaying ? (
          <>
            <Activity className="w-4 h-4 animate-spin" /> RUNNING 15s BENCHMARK STRESS TEST...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" /> START RENDER PIPELINE BENCHMARK
          </>
        )}
      </button>
    </div>
  );
};
