import { useState } from 'react';
import { useUniverseStore } from '../../store/useUniverseStore';
import { Volume2, VolumeX, RotateCcw, Compass, Activity, Award, Orbit, BookOpen } from 'lucide-react';
import { StoryLogModal } from './StoryLogModal';
import { motion } from 'framer-motion';

export const Header = () => {
  const systemHarmony = useUniverseStore((s) => s.systemHarmony);
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);
  const isAudioMuted = useUniverseStore((s) => s.isAudioMuted);
  const toggleAudio = useUniverseStore((s) => s.toggleAudio);
  const resetUniverse = useUniverseStore((s) => s.resetUniverse);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const orbitSpeedMultiplier = useUniverseStore((s) => s.orbitSpeedMultiplier);
  const setOrbitSpeedMultiplier = useUniverseStore((s) => s.setOrbitSpeedMultiplier);

  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const completedCount = Object.values(completedChallenges).filter(Boolean).length;

  return (
    <>
      {/* Unified, Rock-Solid Fixed Aerospace Top Bar with Anti-Tearing Hardware Composite */}
      <header className="fixed top-0 left-0 right-0 h-16 z-30 px-6 backdrop-blur-2xl bg-[#060a17]/85 border-b border-white/10 flex items-center justify-between shadow-2xl hardware-composite select-none">
        {/* Left Section: Brand & Mission Logbook */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActivePlanet(null)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="text-left font-display">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wider text-white">
                  KEPLER DEVCOSMOS
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
              </div>
              <p className="text-[10px] text-cyan-400 font-mono tracking-wider">
                Interactive Technical Domains
              </p>
            </div>
          </motion.button>

          <div className="h-6 w-[1px] bg-white/10" />

          {/* Mission Story Logbook Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsStoryModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-xs font-display text-cyan-200 font-semibold transition-all shadow-sm shadow-cyan-950/40"
          >
            <BookOpen className="w-4 h-4 text-cyan-300" />
            <span className="tracking-wide">MISSION LOGBOOK</span>
          </motion.button>

          {/* 3D Navigation Guide Tip */}
          <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-[11px] font-mono text-slate-300 border border-white/5">
            <Orbit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drag: 360° Free Orbit · Scroll: Zoom · Click: Focus World</span>
          </div>
        </div>

        {/* Center Section: Telemetry & System Harmony Meter */}
        <div className="hidden md:flex items-center gap-4 bg-slate-900/90 px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
          <div className="flex items-center gap-2 font-tech text-sm tracking-wide">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-xs font-sans">HARMONY:</span>
            <span className="font-bold text-cyan-200 text-base">{systemHarmony}%</span>
          </div>

          {/* Pill Progress Bar */}
          <div className="w-40 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 transition-all duration-700 shadow-sm shadow-cyan-400/50"
              style={{ width: `${systemHarmony}%` }}
            />
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-1.5 font-tech text-sm tracking-wide">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-xs font-sans">CALIBRATED:</span>
            <span className="font-bold text-amber-300 text-base">{completedCount} / 5</span>
          </div>
        </div>

        {/* Right Section: Speed Controller, Audio & Reset */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          {/* Orbit Speed Controller */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 flex items-center gap-2 border border-white/10">
            <span className="text-[10px] text-slate-400 font-sans">ORBIT SPEED</span>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={orbitSpeedMultiplier}
              onChange={(e) => setOrbitSpeedMultiplier(parseFloat(e.target.value))}
              className="w-16 h-1 accent-cyan-400 bg-slate-700 rounded cursor-pointer"
              title="Adjust planetary orbital speed"
            />
            <span className="text-[11px] text-cyan-300 w-6 font-bold font-tech">
              {orbitSpeedMultiplier.toFixed(1)}x
            </span>
          </div>

          {/* Audio Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAudio}
            className={`p-2 rounded-lg transition-colors border ${
              !isAudioMuted
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/50 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-500 border-white/10 hover:text-slate-300'
            }`}
            title={isAudioMuted ? 'Enable procedural audio' : 'Mute audio'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>

          {/* Reset State */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (confirm('Reset system telemetry and calibration progress?')) {
                resetUniverse();
              }
            }}
            className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-300 hover:border-rose-500/40 border border-white/10 transition-colors"
            title="Reset progress"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* Narrative Story Modal */}
      <StoryLogModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />
    </>
  );
};
