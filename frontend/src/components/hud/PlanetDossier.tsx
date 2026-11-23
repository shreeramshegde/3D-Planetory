import { useState, useEffect } from 'react';
import { useUniverseStore } from '../../store/useUniverseStore';
import { PLANETS } from '../../data/planets';
import { STORY_CHAPTERS } from '../../data/storylines';
import { soundEngine } from '../../audio/soundEngine';
import { SchedulerGame } from '../../challenges/SchedulerGame';
import { PacketRainGame } from '../../challenges/PacketRainGame';
import { LossLandscapeGame } from '../../challenges/LossLandscapeGame';
import { SplitBrainGame } from '../../challenges/SplitBrainGame';
import { PixelPipelineGame } from '../../challenges/PixelPipelineGame';
import { TimingOracleGame } from '../../challenges/TimingOracleGame';
import { X, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PlanetDossier = () => {
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const cameraMode = useUniverseStore((s) => s.cameraMode);
  const setCameraMode = useUniverseStore((s) => s.setCameraMode);
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);
  const triggerDive = useUniverseStore((s) => s.triggerDive);
  const resetDive = useUniverseStore((s) => s.resetDive);

  const [activeTab, setActiveTab] = useState<'dossier' | 'sim' | 'transcript'>('dossier');
  const [isDivingLocal, setIsDivingLocal] = useState(false);

  useEffect(() => {
    if (cameraMode === 'challenge') {
      setActiveTab('sim');
    } else {
      setActiveTab('dossier');
    }
  }, [cameraMode]);

  if (!activePlanetId) return null;

  const planet = PLANETS.find((p) => p.id === activePlanetId);
  if (!planet) return null;

  const story = STORY_CHAPTERS[planet.id];
  const isPlotted = completedChallenges[planet.id];

  const handleTabChange = (tab: 'dossier' | 'sim' | 'transcript') => {
    soundEngine.playClick();
    setActiveTab(tab);
    setCameraMode(tab === 'sim' ? 'challenge' : 'orbit');
  };

  const handleInitiateSimulation = () => {
    setIsDivingLocal(true);
    triggerDive();
    setTimeout(() => {
      setIsDivingLocal(false);
      handleTabChange('sim');
      resetDive();
    }, 750);
  };

  const openDedicatedTab = () => {
    soundEngine.playClick();
    window.open(`#/terminal/${planet.id}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ position: 'fixed', right: 24, top: 64, bottom: 24 }}
        className="w-[400px] xl:w-[440px] max-w-[calc(100vw-3rem)] z-30 pointer-events-auto flex flex-col bg-[#0E1017] border border-bone-hairline shadow-2xl surveyor-corners font-sans overflow-hidden"
      >
        {/* Ledger Header */}
        <div className="p-4 border-b border-bone-hairline flex items-start justify-between flex-shrink-0 bg-[#0A0B0F]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[11px] text-bone-faint tabular-nums tracking-wider uppercase">
              <span>{planet.catalogId}</span>
              <span>·</span>
              <span>R={planet.orbitRadius} AU</span>
              {isPlotted && (
                <span className="text-vermilion font-medium">PLOTTED</span>
              )}
            </div>
            <h2 className="font-serif text-2xl tracking-tight text-bone">
              {planet.name}
            </h2>
            <p className="font-mono text-xs text-bone-muted uppercase tracking-wider">
              {planet.domain}
            </p>
          </div>

          <button
            onClick={() => setActivePlanet(null)}
            className="p-1.5 border border-bone-hairline hover:border-bone-muted text-bone-muted hover:text-bone transition-colors"
            title="Return to survey view"
            aria-label="Return to survey view"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 border-b border-bone-hairline font-mono text-xs text-center flex-shrink-0 bg-[#0A0B0F]">
          <button
            onClick={() => handleTabChange('dossier')}
            className={`py-2 transition-colors ${
              activeTab === 'dossier'
                ? 'bg-ink-elevated text-bone border-b-2 border-vermilion font-medium'
                : 'text-bone-muted hover:text-bone'
            }`}
          >
            Dossier
          </button>
          <button
            onClick={() => handleTabChange('sim')}
            className={`py-2 transition-colors ${
              activeTab === 'sim'
                ? 'bg-ink-elevated text-bone border-b-2 border-vermilion font-medium'
                : 'text-bone-muted hover:text-bone'
            }`}
          >
            Simulation
          </button>
          <button
            onClick={() => handleTabChange('transcript')}
            className={`py-2 transition-colors ${
              activeTab === 'transcript'
                ? 'bg-ink-elevated text-bone border-b-2 border-vermilion font-medium'
                : 'text-bone-muted hover:text-bone'
            }`}
          >
            Field Log
          </button>
        </div>

        {/* Dedicated Tab Action Bar */}
        <div className="px-4 py-1.5 border-b border-bone-hairline bg-[#0A0B0F] flex items-center justify-between font-mono text-[11px] text-bone-muted flex-shrink-0">
          <span>SURVEYOR TERMINAL</span>
          <button
            onClick={openDedicatedTab}
            className="flex items-center gap-1 text-bone hover:text-vermilion transition-colors"
          >
            <span>Open in new tab</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Content Region */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
          {activeTab === 'dossier' && (
            <>
              {/* Technical Overview */}
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] text-bone-faint uppercase tracking-wider block">
                  Astrometric Summary
                </span>
                <p className="text-bone-muted leading-relaxed">
                  {planet.description}
                </p>
              </div>

              {/* Core Architectural Pillars */}
              <div className="space-y-2 pt-2 border-t border-bone-hairline">
                <span className="font-mono text-[10px] text-bone-faint uppercase tracking-wider block">
                  Core Invariants
                </span>
                <div className="space-y-2 font-mono text-[11px]">
                  {planet.keyPillars.map((pillar, i) => (
                    <div key={i} className="p-2 border border-bone-hairline bg-ink-panel space-y-0.5">
                      <p className="text-bone font-medium">{pillar.title}</p>
                      <p className="text-bone-muted font-sans text-xs leading-normal">{pillar.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ecosystem Tokens */}
              <div className="space-y-1.5 pt-2 border-t border-bone-hairline">
                <span className="font-mono text-[10px] text-bone-faint uppercase tracking-wider block">
                  Tooling Registry
                </span>
                <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                  {planet.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 border border-bone-hairline bg-ink-panel text-bone-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Launch Challenge */}
              <div className="pt-3 border-t border-bone-hairline space-y-2">
                <button
                  onClick={handleInitiateSimulation}
                  disabled={isDivingLocal}
                  className="w-full py-2.5 bg-vermilion hover:bg-vermilion-hover text-ink font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <span>{isDivingLocal ? 'Entering atmosphere...' : isPlotted ? 'Replay simulation' : 'Begin verification simulation'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {activeTab === 'sim' && (
            <div className="h-full flex flex-col">
              {planet.id === 'kernel' && <SchedulerGame />}
              {planet.id === 'cloud' && <PacketRainGame />}
              {planet.id === 'ai' && <LossLandscapeGame />}
              {planet.id === 'backend' && <SplitBrainGame />}
              {planet.id === 'frontend' && <PixelPipelineGame />}
              {planet.id === 'security' && <TimingOracleGame />}
            </div>
          )}

          {activeTab === 'transcript' && story && (
            <div className="space-y-3 font-sans">
              <div className="space-y-1 pb-2 border-b border-bone-hairline font-mono text-[11px]">
                <span className="text-bone-faint block">{story.author} / {story.role}</span>
                <p className="text-bone font-serif text-lg italic">"{story.quote}"</p>
                <span className="text-[10px] text-bone-faint tabular-nums block">{story.timestamp}</span>
              </div>
              <div className="space-y-2.5 text-xs text-bone-muted leading-relaxed font-sans">
                {story.logbook.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-bone-hairline bg-[#0A0B0F] flex items-center justify-between font-mono text-[11px] text-bone-faint flex-shrink-0">
          <span>SURVEY STATUS: {isPlotted ? 'VERIFIED' : 'PENDING'}</span>
          <button
            onClick={() => setActivePlanet(null)}
            className="text-bone hover:text-vermilion transition-colors uppercase tracking-tight"
          >
            Close dossier
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
