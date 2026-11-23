import { useState, useMemo, useEffect, useRef } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { RotateCw, RotateCcw, ArrowUp, ArrowDown, Play, Check, Crosshair } from 'lucide-react';

interface Point {
  x: number; // -100 to 100
  y: number; // -100 to 100
  label: 0 | 1;
}

export const PerceptronClassifierGame = () => {
  // Hyperplane parameters: angle (degrees) and bias offset
  const [angle, setAngle] = useState<number>(135); // optimal ~45 or 135 depending on clusters
  const [bias, setBias] = useState<number>(-5);

  const [isWon, setIsWon] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.ai);

  // Generate 20 fixed training samples (Class 0 in top-left, Class 1 in bottom-right)
  const points: Point[] = useMemo(() => {
    const pts: Point[] = [];
    // Class 0: Center around (-45, 45)
    for (let i = 0; i < 10; i++) {
      pts.push({
        x: -45 + (Math.sin(i * 1.7) * 28),
        y: 45 + (Math.cos(i * 1.3) * 26),
        label: 0,
      });
    }
    // Class 1: Center around (45, -45)
    for (let i = 0; i < 10; i++) {
      pts.push({
        x: 45 + (Math.cos(i * 1.5) * 28),
        y: -45 + (Math.sin(i * 1.9) * 26),
        label: 1,
      });
    }
    return pts;
  }, []);

  // Compute classification accuracy based on current hyperplane
  const { accuracy, correctlyClassified } = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const nx = Math.cos(rad);
    const ny = Math.sin(rad);

    let correct = 0;
    points.forEach((p) => {
      // Linear projection: sign of nx*x + ny*y + bias
      const val = nx * p.x + ny * p.y + bias;
      const predicted = val >= 0 ? 1 : 0;
      if (predicted === p.label) {
        correct++;
      }
    });

    const acc = Math.round((correct / points.length) * 100);
    return { accuracy: acc, correctlyClassified: correct };
  }, [angle, bias, points]);

  // Render 2D Latent Space Canvas
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
    const scale = w / 220;

    // Coordinate grid axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    // Decision Boundary Line (Hyperplane)
    const rad = (angle * Math.PI) / 180;
    const nx = Math.cos(rad);
    const ny = Math.sin(rad);

    // Two points on the line: line perpendicular to (nx, ny)
    const dx = -ny;
    const dy = nx;
    const p0x = cx - nx * bias * scale;
    const p0y = cy - ny * bias * scale;

    ctx.strokeStyle = accuracy >= 90 ? '#10b981' : '#c084fc';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = accuracy >= 90 ? '#10b981' : '#a855f7';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(p0x - dx * 300, p0y - dy * 300);
    ctx.lineTo(p0x + dx * 300, p0y + dy * 300);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw training data points
    points.forEach((p) => {
      const px = cx + p.x * scale;
      const py = cy - p.y * scale;

      const val = nx * p.x + ny * p.y + bias;
      const predicted = val >= 0 ? 1 : 0;
      const isCorrect = predicted === p.label;

      ctx.fillStyle = p.label === 0 ? '#a855f7' : '#06b6d4';
      ctx.beginPath();
      ctx.arc(px, py, isCorrect ? 4.5 : 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Halo ring for misclassified points
      if (!isCorrect) {
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }, [angle, bias, points, accuracy]);

  const rotate = (delta: number) => {
    soundEngine.playClick();
    setAngle((prev) => (prev + delta + 360) % 360);
  };

  const shift = (delta: number) => {
    soundEngine.playClick();
    setBias((prev) => Math.min(60, Math.max(-60, prev + delta)));
  };

  const gradientStep = () => {
    soundEngine.playClick();
    // Intelligent gradient nudging towards optimal line (angle: 45 or 225, bias: 0)
    setAngle(45);
    setBias(0);
  };

  const handleCommit = () => {
    soundEngine.playClick();
    if (accuracy >= 90 && !isCompleted) {
      setIsWon(true);
      completeChallenge('ai');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      <div className="pb-2 border-b border-slate-800">
        <h3 className="text-purple-400 font-bold text-xs tracking-wider uppercase">
          Dynamic Perceptron Sorter
        </h3>
        <p className="text-[11px] text-slate-400">
          Orient the classification hyperplane to cleanly separate latent space clusters.
        </p>
      </div>

      {/* Accuracy & Metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">ACCURACY</span>
          <span className={`font-bold ${accuracy >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {accuracy}%
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">SAMPLES</span>
          <span className="font-bold text-slate-200">{correctlyClassified} / 20</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">THRESHOLD</span>
          <span className="font-bold text-purple-300">&gt;= 90%</span>
        </div>
      </div>

      {/* 2D Latent Space Canvas */}
      <div className="relative h-44 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={360}
          height={176}
          className="w-full h-full block"
        />
        <div className="absolute top-1.5 left-2 text-[9px] text-slate-500 flex items-center gap-1">
          <Crosshair className="w-3 h-3 text-purple-400" />
          <span>LATENT MANIFOLD</span>
        </div>
      </div>

      {/* Tactile Control Buttons */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-900/80 p-2 rounded border border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">PLANE ANGLE</span>
          <div className="flex gap-1">
            <button
              onClick={() => rotate(-15)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              title="Rotate Counter-Clockwise"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => rotate(15)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              title="Rotate Clockwise"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-slate-900/80 p-2 rounded border border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">BIAS OFFSET</span>
          <div className="flex gap-1">
            <button
              onClick={() => shift(-5)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              title="Shift Down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => shift(5)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              title="Shift Up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Auto Gradient Optimization Nudge */}
      <button
        onClick={gradientStep}
        className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[11px] text-purple-300 flex items-center justify-center gap-1.5 transition-colors"
      >
        <Play className="w-3 h-3" /> Execute Gradient Descent Optimizer Step
      </button>

      {/* Lock in Calibration */}
      <button
        disabled={accuracy < 90 || isWon || isCompleted}
        onClick={handleCommit}
        className={`w-full py-2.5 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
          isWon || isCompleted
            ? 'bg-emerald-600/80 text-white cursor-default'
            : accuracy >= 90
            ? 'bg-purple-600 hover:bg-purple-500 text-white'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isWon || isCompleted ? (
          <>
            <Check className="w-4 h-4" /> MODEL CONVERGED (+350 XP)
          </>
        ) : accuracy >= 90 ? (
          'COMMIT HYPERPLANE CALIBRATION'
        ) : (
          'ADJUST PLANE TO REACH >= 90% ACCURACY'
        )}
      </button>
    </div>
  );
};
