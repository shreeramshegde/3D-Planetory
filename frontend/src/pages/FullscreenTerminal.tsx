import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PLANETS } from '../data/planets';
import { STORY_CHAPTERS } from '../data/storylines';
import { useUniverseStore } from '../store/useUniverseStore';
import { SchedulerGame } from '../challenges/SchedulerGame';
import { PacketRainGame } from '../challenges/PacketRainGame';
import { LossLandscapeGame } from '../challenges/LossLandscapeGame';
import { SplitBrainGame } from '../challenges/SplitBrainGame';
import { PixelPipelineGame } from '../challenges/PixelPipelineGame';
import { TimingOracleGame } from '../challenges/TimingOracleGame';
import { DomainBackdrop } from '../components/visuals/DomainBackdrops';
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
    <div className="relative w-screen h-screen bg-[#0A0B0F] text-[#E8E3D6] flex flex-col font-mono select-none overflow-hidden">
      {/* Domain Backdrop with Surveyor Tint */}
      <DomainBackdrop domainId={planet.id} />
      <div className="absolute inset-0 bg-[#0A0B0F]/85 pointer-events-none z-0" />

      {/* Top Surveyor Bar */}
      <header className="relative h-14 px-6 border-b border-bone-hairline bg-[#0A0B0F] flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundEngine.playClick();
              navigate('/');
            }}
            className="flex items-center gap-2 px-3 py-1.5 border border-bone/20 hover:border-vermilion text-bone text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-vermilion" />
            <span>RETURN TO ATLAS VIEW</span>
          </button>

          <div className="h-4 w-[1px] bg-bone/15" />

          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-none" style={{ backgroundColor: planet.color }} />
            <h1 className="text-base font-serif text-bone">
              {planet.name}
            </h1>
            <span className="text-[11px] text-bone-faint border-l border-bone/15 pl-3">
              {planet.catalogId} // {planet.domain}
            </span>
          </div>
        </div>

        {/* Right Status Indicators */}
        <div className="flex items-center gap-3">
          {isDone ? (
            <div className="flex items-center gap-1.5 px-3 py-1 border border-vermilion text-vermilion text-xs font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>SURVEY VERIFIED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 border border-bone/20 text-bone-muted text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-vermilion animate-pulse" />
              <span>CALIBRATION PENDING</span>
            </div>
          )}

          <button
            onClick={toggleAudio}
            className="p-2 border border-bone/20 hover:border-vermilion text-bone text-xs transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-bone-faint" /> : <Volume2 className="w-3.5 h-3.5 text-vermilion" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-bone/20 hover:border-vermilion text-bone text-xs transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'EXIT' : 'FULLSCREEN'}</span>
          </button>
        </div>
      </header>

      {/* Main Terminal Grid */}
      <main className="relative flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden z-10">
        {/* Left Column: Human Story Transcript & Architectural Pillars */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2">
          {story && (
            <div className="p-5 border border-bone-hairline bg-[#0E1017] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-bone/10 font-mono text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-vermilion" />
                <span className="text-bone-faint uppercase">
                  ARCHIVAL FIELD LOG // {story.author} ({story.role})
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-serif text-bone">
                  "{story.title}"
                </h2>
                <p className="text-xs text-bone-muted italic">
                  "{story.quote}"
                </p>
                <span className="text-[10px] text-bone-faint tabular-nums block">
                  RECORDED: {story.timestamp}
                </span>
              </div>

              <div className="space-y-2 text-xs text-bone-muted leading-relaxed font-sans">
                {story.logbook.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Architectural Pillars */}
          <div className="p-5 border border-bone-hairline bg-[#0E1017] space-y-2.5">
            <h3 className="text-xs font-mono uppercase text-bone flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-vermilion" /> Core Architectural Principles
            </h3>
            <div className="space-y-2">
              {planet.keyPillars.map((p, i) => (
                <div key={i} className="p-2.5 border border-bone/10 bg-[#0A0B0F] text-xs space-y-0.5">
                  <span className="font-bold text-bone block">{p.title}</span>
                  <p className="text-[11px] text-bone-muted leading-relaxed font-sans">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deterministic Simulation Challenge */}
        <div className="lg:col-span-7 flex flex-col border border-bone-hairline bg-[#0A0B0F] overflow-hidden">
          {planet.id === 'kernel' && <SchedulerGame />}
          {planet.id === 'cloud' && <PacketRainGame />}
          {planet.id === 'ai' && <LossLandscapeGame />}
          {planet.id === 'backend' && <SplitBrainGame />}
          {planet.id === 'frontend' && <PixelPipelineGame />}
          {planet.id === 'security' && <TimingOracleGame />}
        </div>
      </main>
    </div>
  );
};
