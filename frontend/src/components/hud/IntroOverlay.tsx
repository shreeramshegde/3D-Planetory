import { motion, AnimatePresence } from 'framer-motion';
import { useUniverseStore } from '../../store/useUniverseStore';
import { ArrowRight, Compass } from 'lucide-react';

export const IntroOverlay = () => {
  const isIntroActive = useUniverseStore((s) => s.isIntroActive);
  const skipIntro = useUniverseStore((s) => s.skipIntro);

  return (
    <AnimatePresence>
      {isIntroActive && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } }}
          className="absolute inset-0 z-30 pointer-events-auto flex flex-col justify-between p-8 bg-gradient-to-b from-[#0A0B0F]/80 via-transparent to-[#0A0B0F]/90"
          onClick={skipIntro}
        >
          {/* Top Surveyor Header */}
          <div className="flex items-center justify-between font-mono text-[11px] text-bone-muted tracking-wider">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-vermilion" />
              <span className="text-bone">OBSERVATORY ARCHIVE</span>
              <span className="text-bone-faint">· SECTOR 07 ATLAS</span>
            </div>
            <span className="text-bone-faint tabular-nums">RA 18h 36m 56s | DEC +38° 47′ 01″</span>
          </div>

          {/* Center Title Card */}
          <div className="max-w-xl mx-auto text-center space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-xs uppercase tracking-[0.25em] text-vermilion"
            >
              System Transit In Progress
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-serif text-5xl md:text-6xl text-bone tracking-tight leading-tight"
            >
              The Observatory
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-sans text-sm text-bone-muted max-w-md mx-auto leading-relaxed"
            >
              A surveyor's instrument for six core computational systems. Calibrate each domain through deterministic simulation.
            </motion.p>
          </div>

          {/* Bottom Action Prompt */}
          <div className="flex items-center justify-between font-mono text-xs text-bone-muted">
            <span className="text-bone-faint">HOLD OR CLICK TO ENTER DIRECT CONTROL</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                skipIntro();
              }}
              className="flex items-center gap-2 px-3 py-1.5 border border-bone-hairline bg-[#0A0B0F] hover:border-vermilion text-bone text-xs transition-colors"
            >
              <span>Skip Intro</span>
              <kbd className="px-1 py-0.5 text-[9px] bg-bone/10 text-bone-faint border border-bone-hairline rounded">ESC</kbd>
              <ArrowRight className="w-3 h-3 text-vermilion" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
