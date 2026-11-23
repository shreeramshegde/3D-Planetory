import { useState } from 'react';
import { useSimulationLoop } from '../engine/useSimulationLoop';
import { pixelPipelineSim, PipelineUpgrades } from '../engine/simulations/pixelPipelineSim';
import { useUniverseStore } from '../store/useUniverseStore';
import { Layers, RotateCcw, Zap, Gauge, AlertTriangle, CheckCircle } from 'lucide-react';

export const PixelPipelineGame = () => {
  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const [hasReportedWin, setHasReportedWin] = useState(false);

  const {
    state,
    seed,
    score,
    elapsedTime,
    inputLog,
    sendInput,
    reset,
  } = useSimulationLoop(pixelPipelineSim, 33);

  if (state.isWon && !hasReportedWin) {
    setHasReportedWin(true);
    completeChallenge('frontend');
    fetch('/api/v1/challenges/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilot_callsign: 'ARCHIVIST-01',
        domain_id: 'frontend',
        challenge_id: 'pixel-pipeline',
        seed,
        input_log: inputLog,
        claimed_score: score,
        duration_seconds: elapsedTime,
      }),
    }).catch(() => {});
  }

  const handleBuyUpgrade = (upgrade: keyof PipelineUpgrades) => {
    sendInput({ type: 'BUY_UPGRADE', upgrade });
  };

  const handleCompositorRoute = (itemId: number) => {
    sendInput({ type: 'ROUTE_TO_COMPOSITOR', itemId });
  };

  const frameTimePercent = Math.min(100, (state.frameDurationMs / 16.6) * 100);
  const isJank = state.frameDurationMs > 16.6;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0A0B0F] text-[#E8E3D6] font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-bone-hairline text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-vermilion" />
          <span className="font-semibold text-bone">BROWSER PIXEL PIPELINE</span>
          <span className="text-bone-faint">// 16.6MS FRAME BUDGET</span>
        </div>
        <div className="flex items-center gap-4 tabular-nums">
          <span>COINS: {state.budgetCoins}</span>
          <span className="text-vermilion">SCORE: {score}</span>
          <button
            onClick={() => {
              setHasReportedWin(false);
              reset();
            }}
            className="p-1 hover:text-vermilion transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Budget Bar */}
      <div className="my-1.5 p-2 bg-[#0E1017] border border-bone-hairline space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-bone-muted" />
            <span>FRAME TIME:</span>
            <span className={`font-bold ${isJank ? 'text-red-400' : 'text-emerald-400'}`}>
              {state.frameDurationMs.toFixed(1)}ms / 16.6ms
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] tabular-nums text-bone-muted">
            <span className="text-emerald-400">Smooth: {state.smoothFrames}</span>
            <span className={state.droppedFrames > 5 ? 'text-red-400 font-bold' : 'text-bone-faint'}>
              Dropped: {state.droppedFrames} / 9
            </span>
          </div>
        </div>
        <div className="w-full bg-bone/10 h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ${
              isJank ? 'bg-red-500' : 'bg-emerald-400'
            }`}
            style={{ width: `${frameTimePercent}%` }}
          />
        </div>
      </div>

      {/* Overlays */}
      {state.isFailed && (
        <div className="p-3 my-1 bg-red-950/60 border border-red-500/50 text-red-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>FRAME BUDGET COLLAPSE (&gt;9 DROPPED FRAMES)</span>
          </div>
          <p className="text-[11px] text-red-300">
            Forced synchronous layout thrashing locked the main thread. Purchase 'Batch Reads' or route cheap mutations to the Compositor.
          </p>
          <button
            onClick={() => {
              setHasReportedWin(false);
              reset();
            }}
            className="px-3 py-1 bg-vermilion text-ink font-semibold text-xs mt-1"
          >
            Re-run Benchmark
          </button>
        </div>
      )}

      {state.isWon && (
        <div className="p-3 my-1 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>60 FPS SMOOTH PIPELINE DELIVERED</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            Delivered {state.smoothFrames} frames under the 16.6ms frame deadline. Score: {score}
          </p>
        </div>
      )}

      {/* Pipeline Conveyor Stages */}
      <div className="grid grid-cols-5 gap-1 my-2 text-center text-[10px]">
        {['JS Execute', 'Recalc Style', 'Reflow / Layout', 'Raster Paint', 'Composite'].map((stage, idx) => (
          <div key={stage} className="p-1.5 border border-bone/15 bg-[#0E1017]">
            <span className="text-bone-faint block text-[9px]">STEP 0{idx + 1}</span>
            <span className="font-bold text-bone text-[10px]">{stage}</span>
          </div>
        ))}
      </div>

      {/* Arriving Mutation Queue */}
      <div className="flex-1 space-y-1.5 overflow-y-auto max-h-32 pr-1 my-1">
        {state.itemsQueue.slice(0, 5).map((item) => {
          const isForced = item.type === 'FORCED_SYNC_LAYOUT';
          return (
            <div
              key={item.id}
              className={`p-1.5 border flex items-center justify-between text-[11px] ${
                isForced ? 'border-red-500/50 bg-red-950/20 text-red-200' : 'border-bone/10 bg-[#0E1017] text-bone'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-[10px]">{item.name}</span>
                <span className="text-[9px] text-bone-faint tabular-nums">+{item.totalCostMs.toFixed(1)}ms</span>
              </div>
              <button
                onClick={() => handleCompositorRoute(item.id)}
                className="px-2 py-0.5 text-[9px] bg-vermilion/20 hover:bg-vermilion text-bone hover:text-ink transition-colors flex items-center gap-1"
              >
                <Zap className="w-2.5 h-2.5" />
                <span>Fast Composite</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Performance Optimization Upgrades Store */}
      <div className="border-t border-bone-hairline pt-2 flex items-center justify-between text-xs">
        <span className="text-bone-faint text-[10px] uppercase">Upgrades:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBuyUpgrade('batchReads')}
            disabled={state.upgrades.batchReads || state.budgetCoins < 30}
            className={`px-2 py-1 border text-[10px] ${
              state.upgrades.batchReads
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                : 'border-bone/20 hover:border-vermilion disabled:opacity-40'
            }`}
          >
            {state.upgrades.batchReads ? 'Batch Reads [ACTIVE]' : 'Batch Reads (30c)'}
          </button>
          <button
            onClick={() => handleBuyUpgrade('willChangeLayer')}
            disabled={state.upgrades.willChangeLayer || state.budgetCoins < 25}
            className={`px-2 py-1 border text-[10px] ${
              state.upgrades.willChangeLayer
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                : 'border-bone/20 hover:border-vermilion disabled:opacity-40'
            }`}
          >
            {state.upgrades.willChangeLayer ? 'will-change [ACTIVE]' : 'will-change (25c)'}
          </button>
          <button
            onClick={() => handleBuyUpgrade('workerOffload')}
            disabled={state.upgrades.workerOffload || state.budgetCoins < 20}
            className={`px-2 py-1 border text-[10px] ${
              state.upgrades.workerOffload
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                : 'border-bone/20 hover:border-vermilion disabled:opacity-40'
            }`}
          >
            {state.upgrades.workerOffload ? 'Worker [ACTIVE]' : 'Web Worker (20c)'}
          </button>
        </div>
      </div>
    </div>
  );
};
