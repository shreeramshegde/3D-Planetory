import { useState, useEffect } from 'react';
import { useUniverseStore } from '../../store/useUniverseStore';
import { PLANETS } from '../../data/planets';
import { soundEngine } from '../../audio/soundEngine';
import { PipelineOrchestrator } from '../../challenges/PipelineOrchestrator';
import { NeuralWeightTuner } from '../../challenges/NeuralWeightTuner';
import { LoadBalancerMatrix } from '../../challenges/LoadBalancerMatrix';
import { ShaderResonance } from '../../challenges/ShaderResonance';
import { CipherProtocol } from '../../challenges/CipherProtocol';
import { X, CheckCircle2, ChevronRight, Layers, Cpu } from 'lucide-react';

export const PlanetDossier = () => {
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const cameraMode = useUniverseStore((s) => s.cameraMode);
  const setCameraMode = useUniverseStore((s) => s.setCameraMode);
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);

  const [activeTab, setActiveTab] = useState<'dossier' | 'challenge'>('dossier');

  // Synchronize active tab with camera mode
  useEffect(() => {
    if (cameraMode === 'challenge') {
      setActiveTab('challenge');
    } else {
      setActiveTab('dossier');
    }
  }, [cameraMode]);

  if (!activePlanetId) return null;

  const planet = PLANETS.find((p) => p.id === activePlanetId);
  if (!planet) return null;

  const isChallengeDone = completedChallenges[planet.id];

  const handleTabChange = (tab: 'dossier' | 'challenge') => {
    soundEngine.playClick();
    setActiveTab(tab);
    setCameraMode(tab === 'challenge' ? 'challenge' : 'orbit');
  };

  return (
    <aside className="absolute right-6 top-20 bottom-20 w-[420px] max-w-[calc(100vw-3rem)] z-20 pointer-events-auto flex flex-col glass-panel-glow rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right duration-300">
      {/* Header Panel */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: planet.color, boxShadow: `0 0 12px ${planet.color}` }}
            />
            <h2 className="font-mono font-bold text-lg text-white uppercase tracking-wider">
              {planet.name}
            </h2>
            {isChallengeDone && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> CALIBRATED
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-cyan-400 mt-0.5">{planet.domain}</p>
        </div>

        <button
          onClick={() => setActivePlanet(null)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Return to Solar System"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1.5 bg-slate-900/60 border-b border-slate-800 font-mono text-xs">
        <button
          onClick={() => handleTabChange('dossier')}
          className={`py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'dossier'
              ? 'bg-slate-800 text-cyan-300 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Technical Dossier
        </button>
        <button
          onClick={() => handleTabChange('challenge')}
          className={`py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'challenge'
              ? 'bg-slate-800 text-purple-300 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> Domain Challenge
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'dossier' ? (
          <>
            {/* Tagline & Lore */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <p className="text-xs font-mono text-cyan-300 font-semibold mb-1">
                "{planet.tagline}"
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {planet.description}
              </p>
            </div>

            {/* Architectural Pillars */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Architectural Pillars
              </h3>
              <div className="space-y-2">
                {planet.keyPillars.map((pillar, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-black/40 border border-slate-800/60 font-mono text-xs space-y-0.5"
                  >
                    <p className="text-slate-200 font-semibold">{pillar.title}</p>
                    <p className="text-[11px] text-slate-400 leading-normal">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Standard Tech Ecosystem
              </h3>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {planet.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch Challenge CTA */}
            <div className="pt-2">
              <button
                onClick={() => handleTabChange('challenge')}
                className="w-full py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-98 transition-all"
              >
                <span>
                  {isChallengeDone ? 'RE-TEST DOMAIN CALIBRATION' : 'INITIATE DOMAIN CALIBRATION'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* Challenge Component View */
          <div className="h-full flex flex-col">
            {planet.id === 'cloud' && <PipelineOrchestrator />}
            {planet.id === 'ai' && <NeuralWeightTuner />}
            {planet.id === 'backend' && <LoadBalancerMatrix />}
            {planet.id === 'frontend' && <ShaderResonance />}
            {planet.id === 'security' && <CipherProtocol />}
          </div>
        )}
      </div>

      {/* Footer Return Action */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between font-mono text-xs">
        <span className="text-slate-400 text-[11px]">Orbit: R={planet.orbitRadius} AU</span>
        <button
          onClick={() => setActivePlanet(null)}
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
        >
          Return to Solar View
        </button>
      </div>
    </aside>
  );
};
