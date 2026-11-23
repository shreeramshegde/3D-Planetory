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
import { soundEngine } from '../audio/soundEngine';
import { Maximize2, Minimize2, ArrowLeft, Check, Volume2, VolumeX, BookOpen, Layers } from 'lucide-react';
import { TechnicalDomainId } from '../types/universe';

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
    <div className="w-screen h-screen bg-[#030611] text-slate-100 flex flex-col font-mono select-none overflow-hidden">
      {/* Top Aerospace Battle Station Header */}
      <header className="h-14 px-6 border-b border-slate-800/80 bg-slate-950/90 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundEngine.playClick();
              navigate('/');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO SOLAR VIEW</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: planet.color, boxShadow: `0 0 12px ${planet.color}` }}
            />
            <h1 className="text-sm font-bold tracking-wider uppercase text-white">
              {planet.name}
            </h1>
            <span className="text-xs text-slate-400 border-l border-slate-800 pl-2">
              {planet.domain}
            </span>
          </div>
        </div>

        {/* Right Status Indicators */}
        <div className="flex items-center gap-3">
          {isDone ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>DOMAIN CALIBRATED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>SIMULATION ACTIVE</span>
            </div>
          )}

          <button
            onClick={toggleAudio}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-semibold transition-colors"
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
          </button>
        </div>
      </header>

      {/* Main Terminal Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Left Column: Human Story Transcript & Architectural Pillars */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2">
          {/* Story Transcript Card */}
          {story && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 tracking-wider uppercase">
                  HISTORICAL FIELD LOG · {story.author} ({story.role})
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-bold text-white font-sans">
                  "{story.title}"
                </h2>
                <p className="text-xs text-cyan-300/90 font-mono italic">
                  "{story.quote}"
                </p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  RECORDED: {story.timestamp}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 font-sans leading-relaxed">
                {story.logbook.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Architectural Pillars */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Architectural Principles
            </h3>
            <div className="space-y-2">
              {planet.keyPillars.map((p, i) => (
                <div key={i} className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-0.5">
                  <span className="font-bold text-slate-200">{p.title}</span>
                  <p className="text-[11px] text-slate-400 font-sans">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: High-Intensity Dedicated Game Console */}
        <div className="lg:col-span-7 flex flex-col glass-panel-glow p-6 rounded-2xl border border-slate-700/80 overflow-y-auto">
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
