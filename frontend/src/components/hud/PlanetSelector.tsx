import { PLANETS } from '../../data/planets';
import { useUniverseStore } from '../../store/useUniverseStore';
import { soundEngine } from '../../audio/soundEngine';
import { TechnicalDomainId } from '../../types/universe';
import { motion } from 'framer-motion';

export const PlanetSelector = () => {
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 24,
        left: activePlanetId ? 24 : '50%',
        transform: activePlanetId ? 'none' : 'translateX(-50%)',
        transition: 'left 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      className="z-20 pointer-events-auto hardware-composite font-mono text-xs"
    >
      <div className="bg-[#0A0B0F] border border-bone-hairline px-2 py-1.5 flex items-center gap-1 shadow-2xl surveyor-corners">
        {/* All 6 Celestial Worlds */}
        {PLANETS.map((planet) => {
          const isActive = activePlanetId === planet.id;
          const isDone = completedChallenges[planet.id as TechnicalDomainId];

          return (
            <motion.button
              key={planet.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                soundEngine.playClick();
                setActivePlanet(planet.id);
              }}
              className={`px-2.5 py-1 text-left transition-colors flex items-center gap-2 border rounded-none ${
                isActive
                  ? 'border-vermilion bg-ink-elevated text-bone font-medium'
                  : 'border-transparent text-bone-muted hover:text-bone hover:border-bone-hairline'
              }`}
            >
              <span className="text-[10px] text-bone-faint tabular-nums">
                {planet.catalogId}
              </span>
              <span className="text-xs uppercase tracking-tight">{planet.name}</span>
              {isDone && (
                <span className="w-1.5 h-1.5 bg-vermilion inline-block" title="Plotted" />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
