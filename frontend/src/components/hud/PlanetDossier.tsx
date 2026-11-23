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
import { DomainBackdrop } from '../visuals/DomainBackdrops';
import { X, Check, ChevronRight, Layers, Gamepad2, ExternalLink, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <AnimatePresence>
      <motion.aside
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        className="fixed right-6 top-20 bottom-6 w-[450px] max-w-[calc(100vw-3rem)] z-20 pointer-events-auto flex flex-col glass-panel-glow rounded-3xl overflow-hidden select-none border border-white/15 shadow-2xl relative"
      >
        {/* Layered Domain Atmospheric Artwork Background */}
        <DomainBackdrop domainId={planet.id} />

        {/* Header Panel */}
        <div className="relative p-5 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: planet.color, boxShadow: `0 0 14px ${planet.color}` }}
              />
              <h2 className="font-display font-bold text-lg text-white tracking-wide">
                {planet.name}
              </h2>
              {isChallengeDone && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400/50 text-[10px] font-tech text-emerald-300 flex items-center gap-1 font-bold tracking-wider">
                  <Check className="w-3 h-3" /> CALIBRATED
                </span>
              )}
            </div>
            <p className="text-xs font-tech tracking-wider text-cyan-300 mt-0.5 uppercase">
              {planet.domain}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActivePlanet(null)}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Return to System View"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Navigation Tabs */}
        <div className="relative grid grid-cols-3 p-1.5 bg-slate-950/70 border-b border-white/10 font-display text-xs z-10">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleTabChange('dossier')}
            className={`py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'dossier'
                ? 'bg-white/10 text-cyan-200 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Dossier
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleTabChange('game')}
            className={`py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'game'
                ? 'bg-white/10 text-purple-200 border border-purple-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" /> Simulation
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleTabChange('story')}
            className={`py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'story'
                ? 'bg-white/10 text-amber-200 border border-amber-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Field Log
          </motion.button>
        </div>

        {/* Dedicated Tab Launcher Ribbon */}
        <div className="relative px-4 py-2 bg-slate-950/80 border-b border-white/5 flex items-center justify-between font-mono text-xs z-10">
          <span className="text-[10px] text-slate-400 tracking-wider">FULLSCREEN BATTLE STATION</span>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={openDedicatedTab}
            className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200 font-semibold"
            title="Open in dedicated browser tab"
          >
            <span>OPEN IN NEW TAB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Content Body */}
        <div className="relative flex-1 overflow-y-auto p-5 space-y-4 z-10">
          {activeTab === 'dossier' && (
            <>
              {/* Tagline & Overview */}
              <div className="glass-card p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-display text-cyan-200 font-bold mb-1.5 tracking-wide">
                  "{planet.tagline}"
                </p>
                <p className="text-xs text-slate-200 font-sans leading-relaxed">
                  {planet.description}
                </p>
              </div>

              {/* Architectural Pillars */}
              <div className="space-y-2">
                <h3 className="text-xs font-display font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Core Architectural Pillars
                </h3>
                <div className="space-y-2">
                  {planet.keyPillars.map((pillar, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-xs space-y-0.5"
                    >
                      <p className="text-white font-semibold font-display tracking-wide">{pillar.title}</p>
                      <p className="text-[11px] text-slate-300 leading-normal font-sans">
                        {pillar.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="space-y-2">
                <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider">
                  Technical Ecosystem
                </h3>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {planet.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-300 font-semibold shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTabChange('game')}
                  className="w-full py-3 rounded-2xl font-display text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-98 transition-all"
                >
                  <span>
                    {isChallengeDone ? 'REPLAY IN-PANEL SIMULATION' : 'LAUNCH IN-PANEL SIMULATION'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openDedicatedTab}
                  className="w-full py-2.5 rounded-2xl font-display text-xs font-semibold tracking-wider text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-850 border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>RUN IN DEDICATED FULLSCREEN TAB</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </motion.button>
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
              <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-cyan-300 block font-bold uppercase tracking-wider">
                  {story.author} · {story.role}
                </span>
                <h3 className="text-base font-bold text-white font-display">"{story.title}"</h3>
                <p className="text-xs text-amber-200/90 font-mono italic">"{story.quote}"</p>
                <span className="text-[10px] text-slate-500 block">RECORDED: {story.timestamp}</span>
              </div>

              <div className="space-y-3 text-xs text-slate-200 leading-relaxed font-sans">
                {story.logbook.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Return Action */}
        <div className="relative p-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between font-tech text-xs z-10">
          <span className="text-slate-400 text-sm">ORBIT DISTANCE: {planet.orbitRadius} AU</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePlanet(null)}
            className="text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-semibold text-sm tracking-wide"
          >
            RETURN TO SOLAR VIEW
          </motion.button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
