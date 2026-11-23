import { useState, useMemo } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { Check, Sparkles, AlertTriangle } from 'lucide-react';

export const NeuralWeightTuner = () => {
  const [learningRate, setLearningRate] = useState<number>(0.05); // optimal 0.01 - 0.03
  const [regularization, setRegularization] = useState<number>(0.005); // optimal 0.001 - 0.01
  const [epochs, setEpochs] = useState<number>(30); // optimal 40 - 70

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.ai);

  // Compute validation accuracy and model diagnosis based on hyperparameters
  const { trainLoss, valLoss, accuracy, status, isSuccess } = useMemo(() => {
    // Loss simulation math:
    // High learning rate (> 0.06) -> divergence / gradient explosion
    // Low learning rate (< 0.005) -> underfitting / slow convergence
    // High regularization (> 0.05) -> over-regularized / underfitting
    // Low epochs (< 20) -> under-trained
    // High epochs with 0 regularization -> overfitting (trainLoss ~0, valLoss high)

    let tLoss = 1.0;
    let vLoss = 1.0;
    let acc = 50.0;
    let diag = 'Model initialized in random weight state.';
    let success = false;

    if (learningRate > 0.07) {
      tLoss = 2.45;
      vLoss = 3.82;
      acc = 42.0;
      diag = 'DIVERGENCE: Gradient explosion detected! Learning rate is too high.';
    } else if (learningRate < 0.005) {
      tLoss = 0.85;
      vLoss = 0.88;
      acc = 58.0;
      diag = 'UNDERFITTING: Learning rate too low to escape local saddle point.';
    } else if (epochs < 25) {
      tLoss = 0.55;
      vLoss = 0.62;
      acc = 68.0;
      diag = 'EARLY TERMINATION: Inadequate epochs to converge.';
    } else if (regularization < 0.001 && epochs > 50) {
      tLoss = 0.04;
      vLoss = 0.95;
      acc = 65.0;
      diag = 'OVERFITTING: Memorizing training samples! Increase L2 weight decay.';
    } else if (regularization > 0.04) {
      tLoss = 0.72;
      vLoss = 0.75;
      acc = 62.0;
      diag = 'OVER-PENALIZED: Regularization is dampening expressive feature weights.';
    } else {
      // Harmonic Sweet Spot: lr in [0.008, 0.035], reg in [0.002, 0.02], epochs in [35, 80]
      const scoreRatio = 1 - Math.abs(learningRate - 0.02) * 10 - Math.abs(regularization - 0.005) * 15;
      acc = Math.min(97.4, Math.max(88.0, 94.0 + scoreRatio * 4));
      tLoss = 0.12;
      vLoss = 0.14;
      diag = 'OPTIMAL CONVERGENCE: Generalization bound satisfied (>90% accuracy).';
      success = acc >= 90;
    }

    return { trainLoss: tLoss, valLoss: vLoss, accuracy: Math.round(acc * 10) / 10, status: diag, isSuccess: success };
  }, [learningRate, regularization, epochs]);

  const handleApply = () => {
    soundEngine.playClick();
    if (isSuccess && !isCompleted) {
      completeChallenge('ai');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="pb-2 border-b border-purple-500/20">
        <h3 className="text-purple-400 font-mono font-bold text-sm tracking-wide">
          CHALLENGE: NEURAL WEIGHT TUNER
        </h3>
        <p className="text-xs text-slate-400">
          Calibrate hyperparameters to minimize validation loss and reach &gt;90% accuracy.
        </p>
      </div>

      {/* Interactive Sliders */}
      <div className="space-y-3.5 bg-slate-900/80 p-3 rounded border border-purple-500/20">
        {/* Learning Rate */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Learning Rate (η)</span>
            <span className="text-purple-300 font-semibold">{learningRate.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.001"
            max="0.1"
            step="0.002"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
            <span>0.001 (Slow)</span>
            <span>0.1 (Volatile)</span>
          </div>
        </div>

        {/* L2 Regularization */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">L2 Weight Decay (λ)</span>
            <span className="text-purple-300 font-semibold">{regularization.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.000"
            max="0.05"
            step="0.001"
            value={regularization}
            onChange={(e) => setRegularization(parseFloat(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
            <span>0.00 (Overfit risk)</span>
            <span>0.05 (High penalty)</span>
          </div>
        </div>

        {/* Training Epochs */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Epochs</span>
            <span className="text-purple-300 font-semibold">{epochs}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={epochs}
            onChange={(e) => setEpochs(parseInt(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
            <span>10 Epochs</span>
            <span>100 Epochs</span>
          </div>
        </div>
      </div>

      {/* Real-time Loss & Accuracy Meter */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded bg-black/60 border border-slate-800 text-center font-mono">
          <p className="text-[10px] text-slate-400">TRAIN LOSS</p>
          <p className="text-sm font-bold text-slate-200">{trainLoss.toFixed(2)}</p>
        </div>
        <div className="p-2 rounded bg-black/60 border border-slate-800 text-center font-mono">
          <p className="text-[10px] text-slate-400">VAL LOSS</p>
          <p className="text-sm font-bold text-purple-300">{valLoss.toFixed(2)}</p>
        </div>
        <div className="p-2 rounded bg-black/60 border border-slate-800 text-center font-mono">
          <p className="text-[10px] text-slate-400">ACCURACY</p>
          <p className={`text-sm font-bold ${accuracy >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {accuracy}%
          </p>
        </div>
      </div>

      {/* Diagnostics */}
      <div className="p-2.5 rounded bg-purple-950/40 border border-purple-500/30 text-xs font-mono flex items-start gap-2">
        {isSuccess ? (
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        )}
        <span className={isSuccess ? 'text-emerald-300' : 'text-amber-300'}>
          {status}
        </span>
      </div>

      {/* Submit / Commit Calibration */}
      <button
        disabled={!isSuccess || isCompleted}
        onClick={handleApply}
        className={`w-full py-2.5 rounded font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all ${
          isCompleted
            ? 'bg-emerald-600/90 text-white cursor-default shadow-emerald-500/20'
            : isSuccess
            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/30 active:scale-98'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isCompleted ? (
          <>
            <Check className="w-4 h-4" /> MODEL CALIBRATED (+350 XP)
          </>
        ) : isSuccess ? (
          <>
            <Sparkles className="w-4 h-4" /> LOCK IN HYPERPARAMETERS
          </>
        ) : (
          'TUNE SLIDERS TO REACH >90% ACCURACY'
        )}
      </button>
    </div>
  );
};
