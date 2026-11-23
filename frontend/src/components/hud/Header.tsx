import { useUniverseStore } from '../../store/useUniverseStore';
import { Volume2, VolumeX, RotateCcw, Compass, Activity, Award } from 'lucide-react';

export const Header = () => {
  const systemHarmony = useUniverseStore((s) => s.systemHarmony);
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);
  const isAudioMuted = useUniverseStore((s) => s.isAudioMuted);
  const toggleAudio = useUniverseStore((s) => s.toggleAudio);
  const resetUniverse = useUniverseStore((s) => s.resetUniverse);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const orbitSpeedMultiplier = useUniverseStore((s) => s.orbitSpeedMultiplier);
  const setOrbitSpeedMultiplier = useUniverseStore((s) => s.setOrbitSpeedMultiplier);

  const completedCount = Object.values(completedChallenges).filter(Boolean).length;

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-4 pointer-events-none flex items-start justify-between">
      {/* Brand & Narrative Title */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          onClick={() => setActivePlanet(null)}
          className="flex items-center gap-3 p-2.5 rounded-lg glass-panel hover:border-cyan-400/50 transition-all group"
        >
          <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div className="text-left font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-widest text-slate-100">
                KEPLER: DEVCOSMOS
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-cyan-400/80 tracking-wider">
              3D TECHNICAL UNIVERSE // SYSTEM ONLINE
            </p>
          </div>
        </button>
      </div>

      {/* Center Telemetry & Harmony Meter */}
      <div className="pointer-events-auto flex flex-col items-center gap-1.5 glass-panel px-4 py-2 rounded-xl border border-cyan-500/20">
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-slate-400">HARMONY:</span>
            <span className="font-bold text-cyan-300">{systemHarmony}%</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-700" />
          <div className="flex items-center gap-1 text-slate-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400">CALIBRATED:</span>
            <span className="font-bold text-amber-300">{completedCount}/5</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${systemHarmony}%` }}
          />
        </div>
      </div>

      {/* Control Station: Speed, Audio, Reset */}
      <div className="pointer-events-auto flex items-center gap-2 font-mono text-xs">
        {/* Orbit Speed Controller */}
        <div className="glass-panel px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-800">
          <span className="text-[10px] text-slate-400">SPEED</span>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={orbitSpeedMultiplier}
            onChange={(e) => setOrbitSpeedMultiplier(parseFloat(e.target.value))}
            className="w-16 h-1 accent-cyan-400 bg-slate-700 rounded cursor-pointer"
            title="Adjust planetary orbital speed"
          />
          <span className="text-[10px] text-cyan-300 w-6 font-bold">
            {orbitSpeedMultiplier.toFixed(1)}x
          </span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          className={`p-2 rounded-lg glass-panel transition-colors border ${
            !isAudioMuted
              ? 'text-cyan-400 border-cyan-500/40 hover:bg-cyan-950/40'
              : 'text-slate-500 border-slate-800 hover:text-slate-300'
          }`}
          title={isAudioMuted ? 'Enable synthesized soundscape' : 'Mute soundscape'}
        >
          {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Reset State */}
        <button
          onClick={() => {
            if (confirm('Reset system telemetry and calibration progress?')) {
              resetUniverse();
            }
          }}
          className="p-2 rounded-lg glass-panel text-slate-400 hover:text-rose-400 hover:border-rose-500/40 border border-slate-800 transition-colors"
          title="Reset progress"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
