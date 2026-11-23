import { useState } from 'react';
import { PROLOGUE, STORY_CHAPTERS } from '../../data/storylines';
import { soundEngine } from '../../audio/soundEngine';
import { BookOpen, X, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryLogModal = ({ isOpen, onClose }: StoryLogModalProps) => {
  const [selectedKey, setSelectedKey] = useState<string>('prologue');

  if (!isOpen) return null;

  const chapters = Object.values(STORY_CHAPTERS);
  const activeChapter = selectedKey === 'prologue' ? null : STORY_CHAPTERS[selectedKey];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none hardware-composite">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="max-w-4xl w-full h-[640px] max-h-[90vh] glass-panel-glow rounded-3xl border border-white/20 flex flex-col overflow-hidden font-sans shadow-2xl relative"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wider uppercase font-display">
                  THE ARCHITECT'S LOGBOOK · HISTORICAL RECORDS
                </h2>
                <p className="text-[11px] text-cyan-300/80 font-tech tracking-wider">
                  Transcripts from the founders and caretakers of the DevCosmos
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/10"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Modal Body: Left chapter list + Right story view */}
          <div className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* Chapter Selector (4 cols) */}
            <div className="col-span-4 border-r border-white/10 bg-slate-950/60 p-4 space-y-2 overflow-y-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedKey('prologue');
                }}
                className={`w-full p-3 rounded-2xl text-left text-xs transition-all flex items-center justify-between font-display ${
                  selectedKey === 'prologue'
                    ? 'bg-cyan-950/80 border border-cyan-400/60 text-cyan-200 font-bold shadow-md shadow-cyan-950/40'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>PROLOGUE: THE CASCADE</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </motion.button>

              <div className="h-[1px] bg-white/10 my-2" />

              {chapters.map((ch) => (
                <motion.button
                  key={ch.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedKey(ch.domainId);
                  }}
                  className={`w-full p-3 rounded-2xl text-left text-xs transition-all flex flex-col gap-1 font-display ${
                    selectedKey === ch.domainId
                      ? 'bg-white/10 border border-white/20 text-white font-bold shadow-lg'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white tracking-wide">{ch.worldName}</span>
                    <span className="text-[10px] text-amber-300 font-mono">{ch.author.split(' ')[0]}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans truncate">{ch.title}</span>
                </motion.button>
              ))}
            </div>

            {/* Chapter Content (8 cols) */}
            <div className="col-span-8 p-7 overflow-y-auto space-y-4 bg-slate-950/30">
              {selectedKey === 'prologue' ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
                      {PROLOGUE.subtitle}
                    </span>
                    <h3 className="text-2xl font-bold text-white font-display mt-1">
                      {PROLOGUE.title}
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-200 font-sans leading-relaxed">
                    {PROLOGUE.text.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              ) : activeChapter ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono mb-1.5">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>{activeChapter.author} · {activeChapter.role}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white font-display">
                      "{activeChapter.title}"
                    </h3>
                    <p className="text-xs text-amber-200/90 italic font-mono mt-1.5">
                      "{activeChapter.quote}"
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">
                      RECORDED: {activeChapter.timestamp}
                    </span>
                  </div>

                  <div className="h-[1px] bg-white/10 my-2" />

                  <div className="space-y-3.5 text-xs text-slate-200 font-sans leading-relaxed">
                    {activeChapter.logbook.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
