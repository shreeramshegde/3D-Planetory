import { useState, useEffect, useRef } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { Sparkles, Play, RotateCcw, Activity } from 'lucide-react';

export const GradientDescentGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [epoch, setEpoch] = useState(1);
  const [loss, setLoss] = useState(1.45);
  const [accuracy, setAccuracy] = useState(52.0);
  const [step, setStep] = useState(0);

  // Tactical ML Hyperparameters
  const [momentum, setMomentum] = useState(0.0);
  const [gradClip, setGradClip] = useState(false);
  const [adversarialDropout, setAdversarialDropout] = useState(false);

  const [incident, setIncident] = useState<string>('Epoch 1: Approaching saddle point plateau');
  const [isFailed, setIsFailed] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const weightsRef = useRef<{ x: number; y: number }>({ x: -70, y: 70 });
  const trajectoryRef = useRef<{ x: number; y: number }[]>([]);
  const loopRef = useRef<number | null>(null);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.ai);

  const resetGame = () => {
    soundEngine.playClick();
    if (loopRef.current) clearInterval(loopRef.current);
    weightsRef.current = { x: -70, y: 70 };
    trajectoryRef.current = [{ x: -70, y: 70 }];
    setEpoch(1);
    setLoss(1.45);
    setAccuracy(52.0);
    setStep(0);
    setMomentum(0.0);
    setGradClip(false);
    setAdversarialDropout(false);
    setIncident('Epoch 1: Approaching saddle point plateau');
    setIsFailed(false);
    setIsWon(false);
    setIsPlaying(false);
  };

  const startGame = () => {
    soundEngine.playClick();
    resetGame();
    setIsPlaying(true);
  };

  // Main Training Loop
  useEffect(() => {
    if (!isPlaying || isFailed || isWon) return;

    loopRef.current = window.setInterval(() => {
      setStep((prevStep) => {
        const nextStep = prevStep + 1;

        // Epoch Transitions
        if (nextStep === 10) {
          setEpoch(2);
          setIncident('Epoch 2: Gradient explosion hazard! Loss unstable!');
        } else if (nextStep === 22) {
          setEpoch(3);
          setIncident('Epoch 3: Adversarial perturbation detected! Apply Dropout!');
        } else if (nextStep >= 35) {
          // Check final convergence
          if (accuracy >= 96.0 && loss < 0.08) {
            setIsWon(true);
            setIsPlaying(false);
            completeChallenge('ai');
          } else {
            setIsFailed(true);
            setIsPlaying(false);
          }
          return nextStep;
        }

        // Physics of Gradient Descent across the 3 Epochs
        setLoss((prevLoss) => {
          let deltaLoss = 0.04;

          // Epoch 1: Saddle point trap if momentum not enabled
          if (nextStep < 10) {
            if (momentum === 0.0 && nextStep > 3) {
              setIncident('TRAPPED: Zero-gradient saddle point! Enable Momentum boost!');
              return prevLoss; // Stalled!
            }
            deltaLoss = 0.08;
          }

          // Epoch 2: Exploding gradient if gradClip not enabled
          if (nextStep >= 10 && nextStep < 22) {
            if (!gradClip) {
              setIncident('NUMERICAL OVERFLOW: Gradient norm exceeded threshold!');
              const exploded = prevLoss + 0.45;
              if (exploded > 3.0) {
                setIsFailed(true);
                setIsPlaying(false);
              }
              return exploded;
            }
            deltaLoss = 0.06;
          }

          // Epoch 3: Adversarial noise if dropout not enabled
          if (nextStep >= 22) {
            if (!adversarialDropout) {
              setIncident('ADVERSARIAL DRIFT: Perturbation degrading validation accuracy!');
              setAccuracy((a) => Math.max(75.0, a - 1.5));
              return prevLoss + 0.03;
            }
            deltaLoss = 0.04;
          }

          const nextL = Math.max(0.04, Math.round((prevLoss - deltaLoss) * 100) / 100);
          return nextL;
        });

        // Accuracy tracking
        setAccuracy((prevAcc) => {
          if (nextStep < 10 && momentum === 0.0) return prevAcc;
          if (nextStep >= 10 && nextStep < 22 && !gradClip) return prevAcc;
          if (nextStep >= 22 && !adversarialDropout) return prevAcc;

          const boost = (100 - prevAcc) * 0.12;
          return Math.min(97.8, Math.round((prevAcc + boost) * 10) / 10);
        });

        // Update 2D weight coordinates
        const targetX = 0;
        const targetY = 0;
        const w = weightsRef.current;
        const stepRate = momentum > 0 ? 0.15 : 0.08;
        w.x += (targetX - w.x) * stepRate;
        w.y += (targetY - w.y) * stepRate;
        trajectoryRef.current.push({ ...w });

        return nextStep;
      });
    }, 900);

    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [isPlaying, isFailed, isWon, momentum, gradClip, adversarialDropout, accuracy, loss, completeChallenge]);

  // Render 2D Loss Landscape Contour Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Concentric loss contour ellipses
    const contours = [15, 35, 60, 90, 125, 160];
    contours.forEach((radius, i) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.2, radius * 0.8, 0.2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 + (i / contours.length) * 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw global minimum target
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw descent trajectory path
    if (trajectoryRef.current.length > 1) {
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      trajectoryRef.current.forEach((pt, i) => {
        const px = cx + pt.x * 1.5;
        const py = cy + pt.y * 1.1;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Draw current weights position
    const currentW = weightsRef.current;
    const currX = cx + currentW.x * 1.5;
    const currY = cy + currentW.y * 1.1;
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(currX, currY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [step]);

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-purple-400 font-bold text-xs tracking-wider uppercase">
            Gradient Descent &amp; Adversarial Defense
          </h3>
          <p className="text-[11px] text-slate-400">
            Guide model convergence across non-convex loss surface. Target: &ge; 96.0% accuracy.
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
          <span className="text-[10px] text-slate-400 block">TEST ACCURACY</span>
          <span
            className={`font-bold ${
              accuracy >= 96.0 ? 'text-emerald-400' : 'text-purple-300'
            }`}
          >
            {accuracy.toFixed(1)}%
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">TRAIN LOSS</span>
          <span className="font-bold text-slate-200">{loss.toFixed(3)}</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">EPOCH</span>
          <span className="font-bold text-amber-300">{epoch} / 3</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">TRAIN STEPS</span>
          <span className="font-bold text-slate-200">{step} / 35</span>
        </div>
      </div>

      {/* 2D Loss Landscape Contour Canvas */}
      <div className="relative h-44 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={360}
          height={176}
          className="w-full h-full block"
        />
        <div className="absolute top-1.5 left-2 text-[9px] text-slate-500">
          CONTOUR: NON-CONVEX LOSS SURFACE J(θ)
        </div>
      </div>

      {/* Telemetry Alert Bar */}
      <div className="p-2 rounded bg-purple-950/40 border border-purple-500/30 text-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-purple-200">{incident}</span>
        </div>
      </div>

      {/* Tactical Hyperparameter Interventions */}
      <div className="grid grid-cols-3 gap-1.5 text-xs">
        <button
          onClick={() => {
            soundEngine.playClick();
            setMomentum((m) => (m === 0 ? 0.9 : 0));
          }}
          className={`p-2 rounded border font-semibold text-[10px] text-left transition-colors ${
            momentum > 0
              ? 'bg-purple-950 border-purple-400 text-purple-200'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span className="block font-bold">MOMENTUM β=0.9</span>
          <span>{momentum > 0 ? 'ACTIVE (Saddle Escape)' : 'DISABLED'}</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setGradClip(!gradClip);
          }}
          className={`p-2 rounded border font-semibold text-[10px] text-left transition-colors ${
            gradClip
              ? 'bg-purple-950 border-purple-400 text-purple-200'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span className="block font-bold">GRADIENT CLIP</span>
          <span>{gradClip ? 'ACTIVE (Limit ||g||)' : 'DISABLED'}</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setAdversarialDropout(!adversarialDropout);
          }}
          className={`p-2 rounded border font-semibold text-[10px] text-left transition-colors ${
            adversarialDropout
              ? 'bg-purple-950 border-purple-400 text-purple-200'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span className="block font-bold">ADVERSARIAL DROPOUT</span>
          <span>{adversarialDropout ? 'ACTIVE (FGSM Shield)' : 'DISABLED'}</span>
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
            ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
            : 'bg-purple-600 hover:bg-purple-500 text-white'
        }`}
      >
        {isWon || isCompleted ? (
          <>
            <Sparkles className="w-4 h-4" /> MODEL CONVERGED &ge; 96.0% (+350 XP)
          </>
        ) : isFailed ? (
          'RESTART OPTIMIZATION RUN'
        ) : isPlaying ? (
          'TRAINING MODEL ACROSS MANIFOLD...'
        ) : (
          <>
            <Play className="w-4 h-4" /> START GRADIENT DESCENT RUN
          </>
        )}
      </button>
    </div>
  );
};
