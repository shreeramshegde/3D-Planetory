import { PLANETS } from '../../data/planets';
import { useUniverseStore } from '../../store/useUniverseStore';
import { soundEngine } from '../../audio/soundEngine';
import { Sun, Check } from 'lucide-react';
import { TechnicalDomainId } from '../../types/universe';

export const PlanetSelector = () => {
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);

  return (
    <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
      <div className="glass-panel px-3 py-2 rounded-2xl flex items-center gap-1.5 border border-slate-800 shadow-2xl">
        {/* Overview / Sun Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setActivePlanet(null);
          }}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
            !activePlanetId
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-lg shadow-amber-500/20 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">The Kernel</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        {/* All Planets */}
        {PLANETS.map((planet) => {
          const isActive = activePlanetId === planet.id;
          const isDone = completedChallenges[planet.id as TechnicalDomainId];

          return (
            <button
              key={planet.id}
              onClick={() => {
                soundEngine.playClick();
                setActivePlanet(planet.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all relative ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-lg shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: planet.color,
                  boxShadow: isActive ? `0 0 10px ${planet.color}` : 'none',
                }}
              />
              <span>{planet.name}</span>

              {isDone && (
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
