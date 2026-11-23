import { useState, useEffect } from 'react';
import { useUniverseStore } from '../../store/useUniverseStore';
import { PLANETS } from '../../data/planets';
import { STORY_CHAPTERS } from '../../data/storylines';
import { soundEngine } from '../../audio/soundEngine';
import { ChaosClusterGame } from '../../challenges/ChaosClusterGame';
import { GradientDescentGame } from '../../challenges/GradientDescentGame';
import { RaftConsensusGame } from '../../challenges/RaftConsensusGame';
import { RenderPipelineGame } from '../../challenges/RenderPipelineGame';
import { ZeroTrustDefenseGame } from '../../challenges/ZeroTrustDefenseGame';
import { X, Check, ChevronRight, Layers, Gamepad2, ExternalLink, BookOpen } from 'lucide-react';

export const PlanetDossier = () => {
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const cameraMode = useUniverseStore((s) => s.cameraMode);
  const setCameraMode = useUniverseStore((s) => s.setCameraMode);
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);

  const [activeTab, setActiveTab] = useState<'dossier' | 'game' | 'story'>('dossier');

  useEffect(() => {
    if (cameraMode === 'challenge') {
      setActiveTab('game');
    } else {
      setActiveTab('dossier');
    }
  }, [cameraMode]);

  if (!activePlanetId) return null;

  const planet = PLANETS.find((p) => p.id === activePlanetId);
  if (!planet) return null;

  const story = STORY_CHAPTERS[planet.id];
  const isChallengeDone = completedChallenges[planet.id];

  const handleTabChange = (tab: 'dossier' | 'game' | 'story') => {
    soundEngine.playClick();
    setActiveTab(tab);
    setCameraMode(tab === 'game' ? 'challenge' : 'orbit');
  };

  const openDedicatedTab = () => {
    soundEngine.playClick();
    window.open(`#/terminal/${planet.id}`, '_blank');
  };

  return (
    <aside className="absolute right-6 top-20 bottom-20 w-[440px] max-w-[calc(100vw-3rem)] z-20 pointer-events-auto flex flex-col glass-panel-glow rounded-2xl overflow-hidden select-none">
      {/* Header Panel */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: planet.color, boxShadow: `0 0 10px ${planet.color}` }}
            />
            <h2 className="font-mono font-bold text-base text-white uppercase tracking-wider">
              {planet.name}
            </h2>
            {isChallengeDone && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-3 h-3" /> Calibrated
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-cyan-400 mt-0.5">{planet.domain}</p>
        </div>

        <button
          onClick={() => setActivePlanet(null)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Return to System View"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 p-1.5 bg-slate-900/60 border-b border-slate-800 font-mono text-xs">
        <button
          onClick={() => handleTabChange('dossier')}
          className={`py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'dossier'
              ? 'bg-slate-800 text-cyan-300 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Dossier
        </button>
        <button
          onClick={() => handleTabChange('game')}
          className={`py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'game'
              ? 'bg-slate-800 text-purple-300 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" /> Simulation
        </button>
        <button
          onClick={() => handleTabChange('story')}
          className={`py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'story'
              ? 'bg-slate-800 text-amber-300 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Field Log
        </button>
      </div>

      {/* Dedicated Tab Launcher Banner */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between font-mono text-xs">
        <span className="text-[10px] text-slate-400">DESKTOP FULLSCREEN MODE</span>
        <button
          onClick={openDedicatedTab}
          className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
          title="Open in dedicated browser tab"
        >
          <span>OPEN IN NEW TAB</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'dossier' && (
          <>
            {/* Tagline & Overview */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <p className="text-xs font-mono text-cyan-300 font-semibold mb-1">
                {planet.tagline}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
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
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      {pillar.desc}
                    </p>
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
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleTabChange('game')}
                className="w-full py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-98 transition-all"
              >
                <span>
                  {isChallengeDone ? 'REPLAY IN-PANEL SIMULATION' : 'LAUNCH IN-PANEL SIMULATION'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={openDedicatedTab}
                className="w-full py-2.5 rounded-xl font-mono text-xs font-semibold tracking-wider text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>RUN IN DEDICATED FULLSCREEN TAB</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </>
        )}

        {activeTab === 'game' && (
          <div className="h-full flex flex-col">
            {planet.id === 'cloud' && <ChaosClusterGame />}
            {planet.id === 'ai' && <GradientDescentGame />}
            {planet.id === 'backend' && <RaftConsensusGame />}
            {planet.id === 'frontend' && <RenderPipelineGame />}
            {planet.id === 'security' && <ZeroTrustDefenseGame />}
          </div>
        )}

        {activeTab === 'story' && story && (
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 block font-bold uppercase">
                {story.author} · {story.role}
              </span>
              <h3 className="text-sm font-bold text-white">"{story.title}"</h3>
              <p className="text-xs text-slate-400 font-mono italic">"{story.quote}"</p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
              {story.logbook.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Return Action */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between font-mono text-xs">
        <span className="text-slate-400 text-[11px]">Orbit Distance: {planet.orbitRadius} AU</span>
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
