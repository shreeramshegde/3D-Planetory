import { useEffect } from 'react';
import { useUniverseStore } from '../../store/useUniverseStore';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { PLANETS } from '../../data/planets';

export const VictoryOverlay = () => {
  const systemHarmony = useUniverseStore((s) => s.systemHarmony);
  const resetUniverse = useUniverseStore((s) => s.resetUniverse);
  const pilotCallsign = useUniverseStore((s) => s.pilotCallsign);

  useEffect(() => {
    if (systemHarmony === 100) {
      // Fire celebratory cosmic confetti bursts
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00f5ff', '#a855f7', '#f59e0b', '#ec4899', '#10b981'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00f5ff', '#a855f7', '#f59e0b', '#ec4899', '#10b981'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [systemHarmony]);

  if (systemHarmony < 100) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="max-w-lg w-full glass-panel-glow rounded-3xl p-6 border border-emerald-500/40 text-center space-y-6 shadow-2xl shadow-emerald-500/20">
        {/* Trophy Header */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/30">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold tracking-widest uppercase">
            100% SYSTEM HARMONY ACHIEVED
          </span>
          <h2 className="text-2xl font-mono font-bold text-white mt-2">
            MISSION COMPLETE, {pilotCallsign}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            All 5 celestial technical domains have been calibrated. The DevCosmos operating system is operating at maximum resilience and throughput.
          </p>
        </div>

        {/* Domain Achievement Badges */}
        <div className="grid grid-cols-5 gap-2 py-2">
          {PLANETS.map((planet) => (
            <div
              key={planet.id}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 flex flex-col items-center gap-1 font-mono text-[10px]"
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: planet.color }}
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-300 font-semibold">{planet.name}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              // Close modal by setting harmony to 99 temporarily or continue exploring
              const el = document.querySelector('.fixed.inset-0.z-50');
              if (el) (el as HTMLElement).style.display = 'none';
            }}
            className="flex-1 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> CONTINUE FREE EXPLORATION
          </button>
          <button
            onClick={resetUniverse}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
