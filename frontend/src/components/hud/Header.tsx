import { useUniverseStore } from '../../store/useUniverseStore';
import { Volume2, VolumeX, RotateCcw, Table } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onToggleTableView?: () => void;
}

export const Header = ({ onToggleTableView }: HeaderProps) => {
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);
  const isAudioMuted = useUniverseStore((s) => s.isAudioMuted);
  const toggleAudio = useUniverseStore((s) => s.toggleAudio);
  const resetUniverse = useUniverseStore((s) => s.resetUniverse);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const orbitSpeedMultiplier = useUniverseStore((s) => s.orbitSpeedMultiplier);
  const setOrbitSpeedMultiplier = useUniverseStore((s) => s.setOrbitSpeedMultiplier);

  const plottedCount = Object.values(completedChallenges).filter(Boolean).length;

  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-30 px-5 bg-[#0A0B0F] border-b border-bone-hairline flex items-center justify-between hardware-composite select-none font-sans">
      {/* Left: Surveyor Identifier and Archival Catalog */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => setActivePlanet(null)}
          className="flex items-baseline gap-2.5 text-left group focus:outline-none"
        >
          <span className="font-serif text-lg tracking-tight text-bone group-hover:text-vermilion transition-colors">
            Kepler Surveyor
          </span>
          <span className="font-mono text-[11px] text-bone-faint tabular-nums tracking-wider uppercase">
            Atlas No. 84 · Epoch 2046
          </span>
        </button>

        <div className="h-3.5 w-[1px] bg-bone-hairline hidden sm:block" />

        {/* Constellation Star Chart Progress */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-bone-muted tabular-nums">
          <span className="text-[10px] uppercase text-bone-faint">Star chart</span>
          <span className="text-bone font-medium">{plottedCount} of 6 plotted</span>
          <div className="flex items-center gap-1 ml-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-none transition-colors ${
                  i < plottedCount ? 'bg-vermilion' : 'bg-bone-hairline'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Astrometric Controls */}
      <div className="flex items-center gap-4 font-mono text-xs">
        {/* Orbit Speed Multiplier */}
        <div className="flex items-center gap-2 text-bone-muted">
          <span className="text-[10px] text-bone-faint uppercase">Time scale</span>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={orbitSpeedMultiplier}
            onChange={(e) => setOrbitSpeedMultiplier(parseFloat(e.target.value))}
            className="w-14 h-1 accent-vermilion bg-ink-elevated rounded-none cursor-pointer"
            aria-label="Adjust orbital time scale"
          />
          <span className="w-8 text-[11px] text-bone tabular-nums text-right">
            {orbitSpeedMultiplier.toFixed(1)}x
          </span>
        </div>

        <div className="h-3.5 w-[1px] bg-bone-hairline" />

        {/* Audio Engine Mute */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={toggleAudio}
          className="p-1.5 rounded-sm border border-bone-hairline hover:border-bone-muted text-bone-muted hover:text-bone transition-colors focus:outline-none focus:border-vermilion"
          title={isAudioMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
          aria-label={isAudioMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
        >
          {!isAudioMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-bone-faint" />}
        </motion.button>

        {/* 2D Accessible Star Chart Toggle */}
        {onToggleTableView && (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onToggleTableView}
            className="px-2.5 py-1 rounded-sm border border-bone-hairline hover:border-vermilion text-bone-muted hover:text-bone text-[11px] font-mono transition-colors flex items-center gap-1.5 focus:outline-none"
            title="Switch to 2D Accessible Star Chart"
            aria-label="Switch to 2D Accessible Star Chart"
          >
            <Table className="w-3.5 h-3.5 text-vermilion" />
            <span className="hidden md:inline">2D Atlas</span>
          </motion.button>
        )}

        {/* Reset Atlas */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            if (confirm('Reset recorded telemetry and plotted star chart coordinates?')) {
              resetUniverse();
            }
          }}
          className="p-1.5 rounded-sm border border-bone-hairline hover:border-bone-muted text-bone-faint hover:text-bone transition-colors focus:outline-none focus:border-vermilion"
          title="Reset star chart progress"
          aria-label="Reset star chart progress"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </header>
  );
};
