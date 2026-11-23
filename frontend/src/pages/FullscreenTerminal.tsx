import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PLANETS } from '../data/planets';
import { STORY_CHAPTERS } from '../data/storylines';
import { useUniverseStore } from '../store/useUniverseStore';
import { ChaosClusterGame } from '../challenges/ChaosClusterGame';
import { GradientDescentGame } from '../challenges/GradientDescentGame';
import { RaftConsensusGame } from '../challenges/RaftConsensusGame';
import { RenderPipelineGame } from '../challenges/RenderPipelineGame';
import { ZeroTrustDefenseGame } from '../challenges/ZeroTrustDefenseGame';
import { DomainBackdrop } from '../components/visuals/DomainBackdrops';
import { soundEngine } from '../audio/soundEngine';
import { Maximize2, Minimize2, ArrowLeft, Check, Volume2, VolumeX, BookOpen, Layers } from 'lucide-react';
import { TechnicalDomainId } from '../types/universe';
import { motion } from 'framer-motion';

export const FullscreenTerminal = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const completedChallenges = useUniverseStore((s) => s.completedChallenges);
  const isAudioMuted = useUniverseStore((s) => s.isAudioMuted);
  const toggleAudio = useUniverseStore((s) => s.toggleAudio);

  const planet = PLANETS.find((p) => p.id === domainId) || PLANETS[0];
  const story = STORY_CHAPTERS[planet.id];
  const isDone = completedChallenges[planet.id as TechnicalDomainId];

  // Fullscreen API toggle
  const toggleFullscreen = () => {
    soundEngine.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#030611] text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* High-Resolution Domain Artwork Backdrop */}
      <DomainBackdrop domainId={planet.id} />

      {/* Top Aerospace Battle Station Header */}
      <header className="relative h-16 px-6 border-b border-white/10 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-between z-20 flex-shrink-0 shadow-xl">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundEngine.playClick();
              navigate('/');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-display font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>RETURN TO SOLAR VIEW</span>
          </motion.button>

          <div className="h-5 w-[1px] bg-white/10" />

          <div className="flex items-center gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: planet.color, boxShadow: `0 0 14px ${planet.color}` }}
            />
            <h1 className="text-base font-bold tracking-wider uppercase text-white font-display">
              {planet.name}
            </h1>
            <span className="text-xs text-cyan-300 font-tech tracking-wider border-l border-white/10 pl-3">
              {planet.domain}
            </span>
          </div>
        </div>

        {/* Right Status Indicators */}
        <div className="flex items-center gap-3">
          {isDone ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 text-xs font-tech font-bold tracking-wider">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>DOMAIN CALIBRATED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-tech font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>SIMULATION ACTIVE</span>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAudio}
            className="p-2 rounded-xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/50 text-slate-200 transition-colors"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-400/50 hover:bg-cyan-900/60 text-cyan-200 text-xs font-display font-semibold transition-colors shadow-sm shadow-cyan-950/50"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" /> <span>EXIT FULLSCREEN</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" /> <span>FULLSCREEN TERMINAL</span>
              </>
            )}
          </motion.button>
        </div>
      </header>

      {/* Main Terminal Grid */}
      <main className="relative flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden z-10">
        {/* Left Column: Human Story Transcript & Architectural Pillars */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2">
          {/* Story Transcript Card */}
          {story && (
            <div className="glass-panel p-6 rounded-3xl border border-white/15 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 font-display tracking-wider uppercase">
                  HISTORICAL FIELD LOG · {story.author} ({story.role})
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-white font-display">
                  "{story.title}"
                </h2>
                <p className="text-xs text-amber-200/95 font-mono italic">
                  "{story.quote}"
                </p>
                <span className="text-[10px] text-slate-400 font-mono block">
                  RECORDED: {story.timestamp}
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-200 leading-relaxed font-sans">
                {story.logbook.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Architectural Pillars */}
          <div className="glass-panel p-6 rounded-3xl border border-white/15 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-white font-display tracking-wider uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Core Architectural Principles
            </h3>
            <div className="space-y-2.5">
              {planet.keyPillars.map((p, i) => (
                <div key={i} className="p-3 bg-slate-950/70 border border-white/10 rounded-2xl text-xs space-y-0.5">
                  <span className="font-bold text-white font-display tracking-wide">{p.title}</span>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: High-Intensity Dedicated Game Console */}
        <div className="lg:col-span-7 flex flex-col glass-panel-glow p-6 rounded-3xl border border-white/20 overflow-y-auto shadow-2xl relative">
          {planet.id === 'cloud' && <ChaosClusterGame />}
          {planet.id === 'ai' && <GradientDescentGame />}
          {planet.id === 'backend' && <RaftConsensusGame />}
          {planet.id === 'frontend' && <RenderPipelineGame />}
          {planet.id === 'security' && <ZeroTrustDefenseGame />}
        </div>
      </main>
    </div>
  );
};
