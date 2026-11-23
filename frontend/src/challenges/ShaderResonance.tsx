import { useState, useMemo } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { Check, Wand2 } from 'lucide-react';

export const ShaderResonance = () => {
  const [chroma, setChroma] = useState<number>(12); // target ~24
  const [frequency, setFrequency] = useState<number>(4); // target ~8
  const [refraction, setRefraction] = useState<number>(30); // target ~60

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.frontend);

  // Compute resonance match percentage against target harmonic signature:
  // Target: Chroma = 24, Frequency = 8, Refraction = 60
  const resonanceScore = useMemo(() => {
    const diff1 = Math.abs(chroma - 24) / 50;
    const diff2 = Math.abs(frequency - 8) / 16;
    const diff3 = Math.abs(refraction - 60) / 100;

    const avgDiff = (diff1 + diff2 + diff3) / 3;
    const score = Math.max(0, Math.min(100, Math.round((1 - avgDiff) * 100)));
    return score;
  }, [chroma, frequency, refraction]);

  const isHarmonized = resonanceScore >= 92;

  const handleCommit = () => {
    soundEngine.playClick();
    if (isHarmonized && !isCompleted) {
      completeChallenge('frontend');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="pb-2 border-b border-pink-500/20">
        <h3 className="text-pink-400 font-mono font-bold text-sm tracking-wide">
          CHALLENGE: SHADER RESONANCE
        </h3>
        <p className="text-xs text-slate-400">
          Tune WebGL shader variables to match the target photonic refraction waveform (&gt;90%).
        </p>
      </div>

      {/* Live Interactive Shader Canvas Preview */}
      <div className="h-32 rounded bg-black/80 border border-pink-500/30 overflow-hidden relative flex items-center justify-center p-3">
        {/* Animated dynamic CSS/SVG wave simulating live shader output */}
        <div
          className="absolute inset-0 opacity-40 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(236, 72, 153, ${refraction / 100}) 0%, transparent 70%)`,
            filter: `blur(${Math.max(2, 20 - resonanceScore / 5)}px)`,
          }}
        />

        {/* Dynamic Waveform Canvas Simulation */}
        <div className="z-10 text-center font-mono space-y-1">
          <p className="text-[11px] text-pink-300 font-semibold tracking-widest uppercase">
            {isHarmonized ? 'HARMONIC LOCK ACHIEVED' : 'DISPERSED PRISMATIC SIGNATURE'}
          </p>
          <div className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-1">
            <span>{resonanceScore}%</span>
            <span className="text-xs font-mono text-pink-400">RESONANCE</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Target signature: Chroma [24] • Freq [8] • Refr [60]
          </p>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 bg-slate-900/80 p-3 rounded border border-pink-500/20">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Chromatic Aberration</span>
            <span className="text-pink-300 font-semibold">{chroma} px</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={chroma}
            onChange={(e) => setChroma(parseInt(e.target.value))}
            className="w-full accent-pink-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Oscillation Frequency</span>
            <span className="text-pink-300 font-semibold">{frequency} Hz</span>
          </div>
          <input
            type="range"
            min="1"
            max="16"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value))}
            className="w-full accent-pink-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Photonic Refraction</span>
            <span className="text-pink-300 font-semibold">{refraction}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={refraction}
            onChange={(e) => setRefraction(parseInt(e.target.value))}
            className="w-full accent-pink-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        disabled={!isHarmonized || isCompleted}
        onClick={handleCommit}
        className={`w-full py-2.5 rounded font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all ${
          isCompleted
            ? 'bg-emerald-600/90 text-white cursor-default shadow-emerald-500/20'
            : isHarmonized
            ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-500/30 active:scale-98'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isCompleted ? (
          <>
            <Check className="w-4 h-4" /> SHADER RESONANCE LOCKED (+300 XP)
          </>
        ) : isHarmonized ? (
          <>
            <Wand2 className="w-4 h-4" /> SYNCHRONIZE PRISMATIC LENS
          </>
        ) : (
          'ALIGN SLIDERS TO REACH >90% RESONANCE'
        )}
      </button>
    </div>
  );
};
