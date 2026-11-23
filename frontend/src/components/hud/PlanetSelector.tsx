import { PLANETS } from '../../data/planets';
import { useUniverseStore } from '../../store/useUniverseStore';
import { soundEngine } from '../../audio/soundEngine';
import { Sun, Check } from 'lucide-react';
import { TechnicalDomainId } from '../../types/universe';
import { motion } from 'framer-motion';

export const PlanetSelector = () => {
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto hardware-composite">
      <div className="glass-panel-glow px-3 py-2 rounded-2xl flex items-center gap-2 border border-white/15 shadow-2xl backdrop-blur-2xl bg-slate-950/80">
        {/* Overview / Sun Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundEngine.playClick();
            setActivePlanet(null);
          }}
          className={`px-3 py-1.5 rounded-xl font-display text-xs flex items-center gap-2 transition-all ${
            !activePlanetId
              ? 'bg-amber-500/25 text-amber-200 border border-amber-400/80 shadow-lg shadow-amber-500/30 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline tracking-wider">The Kernel</span>
        </motion.button>

        <div className="w-[1px] h-5 bg-white/10 mx-0.5" />

        {/* All Planets */}
        {PLANETS.map((planet) => {
          const isActive = activePlanetId === planet.id;
          const isDone = completedChallenges[planet.id as TechnicalDomainId];

          return (
            <motion.button
              key={planet.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundEngine.playClick();
                setActivePlanet(planet.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-display text-xs flex items-center gap-2 transition-all relative ${
                isActive
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/80 shadow-lg shadow-cyan-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: planet.color,
                  boxShadow: isActive ? `0 0 12px ${planet.color}` : 'none',
                }}
              />
              <span className="tracking-wide">{planet.name}</span>

              {isDone && (
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
