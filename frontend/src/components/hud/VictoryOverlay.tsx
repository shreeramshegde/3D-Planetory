import { useEffect } from 'react';
import { useUniverseStore } from '../../store/useUniverseStore';
import confetti from 'canvas-confetti';
import { Trophy, Check, RotateCcw } from 'lucide-react';
import { PLANETS } from '../../data/planets';
import { motion } from 'framer-motion';

export const VictoryOverlay = () => {
  const systemHarmony = useUniverseStore((s) => s.systemHarmony);
  const resetUniverse = useUniverseStore((s) => s.resetUniverse);
  const pilotCallsign = useUniverseStore((s) => s.pilotCallsign);

  useEffect(() => {
    if (systemHarmony === 100) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#0284c7', '#7e22ce', '#d97706', '#db2777', '#059669'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#0284c7', '#7e22ce', '#d97706', '#db2777', '#059669'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="max-w-lg w-full glass-panel-glow rounded-3xl p-7 border border-emerald-500/40 text-center space-y-6 shadow-2xl relative"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-950/90 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/30">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-tech font-bold tracking-widest uppercase">
            100% SYSTEM HARMONY CALIBRATED
          </span>
          <h2 className="text-2xl font-display font-bold text-white mt-2">
            Mission Complete, {pilotCallsign}
          </h2>
          <p className="text-xs text-slate-200 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
            All 5 celestial technical domains have reached full operational calibration. The distributed system is operating at maximum throughput and resilience.
          </p>
        </div>

        {/* Domain Achievement Badges */}
        <div className="grid grid-cols-5 gap-2 py-2">
          {PLANETS.map((planet) => (
            <div
              key={planet.id}
              className="p-2.5 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col items-center gap-1.5 font-display text-[10px]"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: planet.color }}
              >
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-200 font-semibold">{planet.name}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const el = document.querySelector('.fixed.inset-0.z-50');
              if (el) (el as HTMLElement).style.display = 'none';
            }}
            className="flex-1 py-3 rounded-2xl font-display text-xs font-bold tracking-wider uppercase bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20"
          >
            Continue Free 3D Exploration
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetUniverse}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors"
            title="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
