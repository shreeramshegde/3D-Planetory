import { useState } from 'react';
import { useSimulationLoop } from '../engine/useSimulationLoop';
import { lossLandscapeSim, OptimizerType } from '../engine/simulations/lossLandscapeSim';
import { useUniverseStore } from '../store/useUniverseStore';
import { BrainCircuit, RotateCcw, AlertOctagon, CheckCircle, Play, Pause } from 'lucide-react';

export const LossLandscapeGame = () => {
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
    isRunning,
    setIsRunning,
  } = useSimulationLoop(lossLandscapeSim, 42, { startPaused: true });

  if (state.isWon && !hasReportedWin) {
    setHasReportedWin(true);
    completeChallenge('ai');
    fetch('/api/v1/challenges/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilot_callsign: 'ARCHIVIST-01',
        domain_id: 'ai',
        challenge_id: 'loss-landscape',
        seed,
        input_log: inputLog,
        claimed_score: score,
        duration_seconds: elapsedTime,
      }),
    }).catch(() => {});
  }

  const handleOptimizerChange = (opt: OptimizerType) => {
    sendInput({ type: 'SET_OPTIMIZER', optimizer: opt });
  };

  const handleLrChange = (lr: number) => {
    sendInput({ type: 'SET_LEARNING_RATE', lr });
  };

  const handleMomentumChange = (beta: number) => {
    sendInput({ type: 'SET_MOMENTUM', beta });
  };

  const handleResetTrajectory = () => {
    setHasReportedWin(false);
    sendInput({ type: 'RESET_TRAJECTORY' });
    setIsRunning(false);
  };

  const handleHardReset = () => {
    setHasReportedWin(false);
    reset();
  };

  // Convert (x, y) coordinates to SVG canvas view [0..300, 0..160]
  const svgW = 320;
  const svgH = 150;
  const mapX = (x: number) => ((x + 4.5) / 9.0) * svgW;
  const mapY = (y: number) => ((3.5 - y) / 7.0) * svgH;

  const currentX = mapX(state.x);
  const currentY = mapY(state.y);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0A0B0F] text-[#E8E3D6] font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-bone-hairline text-xs">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-vermilion" />
          <span className="font-semibold text-bone">LOSS LANDSCAPE OPTIMIZER</span>
          <span className="text-bone-faint">// NON-CONVEX MANIFOLD</span>
        </div>
        <div className="flex items-center gap-3 tabular-nums">
          <span>STEP: {state.stepCount}</span>
          <span className="text-vermilion">SCORE: {score}</span>
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={state.isDiverged || state.isWon}
            className={`p-1 transition-colors ${
              isRunning ? 'text-vermilion hover:text-white' : 'text-bone hover:text-vermilion'
            } disabled:opacity-30`}
            title={isRunning ? 'Pause descent' : 'Resume descent'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleHardReset}
            className="p-1 hover:text-vermilion transition-colors"
            title="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Overlays */}
      {state.isDiverged && (
        <div className="p-3 my-1.5 bg-red-950/60 border border-red-500/50 text-red-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-red-400">
            <AlertOctagon className="w-4 h-4" />
            <span>NUMERICAL DIVERGENCE (EXPLODING GRADIENT)</span>
          </div>
          <p className="text-[11px] text-red-300">
            Learning rate was too high for the steep ravine walls, causing parameter oscillation to explode. Adjust η below and reset.
          </p>
          <button
            onClick={handleResetTrajectory}
            className="px-3 py-1 bg-vermilion hover:bg-vermilion-hover text-ink font-semibold text-xs mt-1 transition-colors"
          >
            Reset Trajectory (Keeps Adjusted η)
          </button>
        </div>
      )}

      {state.isWon && (
        <div className="p-3 my-1.5 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>GLOBAL MINIMUM CONVERGED</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            Stabilized parameter weights at loss {state.currentLoss.toFixed(4)}. Score: {score}
          </p>
          <button
            onClick={handleResetTrajectory}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-ink font-semibold text-xs mt-1 transition-colors"
          >
            Re-run Trajectory
          </button>
        </div>
      )}

      {/* Primary Action Button (when paused/ready) */}
      {!isRunning && !state.isDiverged && !state.isWon && (
        <button
          onClick={() => setIsRunning(true)}
          className="w-full py-2 bg-vermilion hover:bg-vermilion-hover text-ink font-semibold uppercase text-xs flex items-center justify-center gap-2 transition-colors my-1 tracking-wider"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{state.stepCount > 0 ? 'Resume Gradient Descent' : 'Start Gradient Descent'}</span>
        </button>
      )}

      {/* 2D Contour Map / Trajectory View */}
      <div className="relative w-full h-40 bg-[#06080D] border border-bone-hairline my-1 overflow-hidden">
        <svg className="w-full h-full" viewBox={`0 0 ${svgW} ${svgH}`}>
          {/* Contour Lines */}
          <ellipse cx={mapX(0)} cy={mapY(0)} rx={svgW * 0.4} ry={svgH * 0.4} fill="none" stroke="rgba(232, 227, 214, 0.08)" strokeDasharray="3,3" />
          <ellipse cx={mapX(0)} cy={mapY(0)} rx={svgW * 0.25} ry={svgH * 0.25} fill="none" stroke="rgba(232, 227, 214, 0.12)" strokeDasharray="2,2" />
          <circle cx={mapX(-0.7)} cy={mapY(0)} r={12} fill="none" stroke="rgba(255, 90, 54, 0.3)" />

          {/* Decoy Local Minima Marker */}
          <circle cx={mapX(2.2)} cy={mapY(1.2)} r={16} fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeDasharray="4,4" />
          <text x={mapX(2.2)} y={mapY(1.2) - 8} fill="rgba(168, 85, 247, 0.7)" fontSize="8" textAnchor="middle">
            Decoy Min
          </text>

          {/* Trajectory Trail */}
          {state.trajectory.length > 1 && (
            <polyline
              fill="none"
              stroke="#FF5A36"
              strokeWidth="1.5"
              strokeOpacity="0.75"
              points={state.trajectory.map(([tx, ty]) => `${mapX(tx)},${mapY(ty)}`).join(' ')}
            />
          )}

          {/* Current Parameter Ball */}
          <circle cx={currentX} cy={currentY} r={5} fill="#E8E3D6" stroke="#FF5A36" strokeWidth="2" />
        </svg>

        {/* Real-time Loss Overlay Readout */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-[#0A0B0F]/90 border border-bone-hairline text-[10px] space-y-0.5">
          <div className="flex gap-2">
            <span className="text-bone-faint">LOSS:</span>
            <span className="font-bold text-vermilion tabular-nums">{state.currentLoss.toFixed(4)}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-bone-faint">||∇L||:</span>
            <span className="text-bone tabular-nums">{state.gradNorm.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Optimizer Selection & Real-Time Hyperparameter Tuning */}
      <div className="space-y-2 border-t border-bone-hairline pt-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {(['SGD', 'MOMENTUM', 'ADAM'] as OptimizerType[]).map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptimizerChange(opt)}
                className={`px-2.5 py-1 text-[11px] border transition-colors ${
                  state.optimizer === opt
                    ? 'bg-vermilion text-ink border-vermilion font-bold'
                    : 'bg-[#0A0B0F] border-bone/15 text-bone-muted hover:border-bone/40'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-bone-faint tabular-nums">
            η = {state.learningRate.toFixed(3)}
          </span>
        </div>

        {/* Learning Rate Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-bone-muted">
            <span>Learning Rate (η)</span>
            <span className="tabular-nums">{state.learningRate.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.005"
            max="0.25"
            step="0.005"
            value={state.learningRate}
            onChange={(e) => handleLrChange(parseFloat(e.target.value))}
            className="w-full accent-vermilion bg-bone/10 h-1 cursor-pointer"
          />
        </div>

        {/* Momentum Beta Slider (for Momentum / Adam) */}
        {state.optimizer !== 'SGD' && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-bone-muted">
              <span>Momentum Friction (β)</span>
              <span className="tabular-nums">{state.momentumBeta.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.98"
              step="0.02"
              value={state.momentumBeta}
              onChange={(e) => handleMomentumChange(parseFloat(e.target.value))}
              className="w-full accent-vermilion bg-bone/10 h-1 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};
