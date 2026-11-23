import { useState } from 'react';
import { PROLOGUE, STORY_CHAPTERS, StoryFragment } from '../../data/storylines';
import { soundEngine } from '../../audio/soundEngine';
import { BookOpen, X, ChevronRight, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryLogModal = ({ isOpen, onClose }: StoryLogModalProps) => {
  const [selectedKey, setSelectedKey] = useState<string>('prologue');

  if (!isOpen) return null;

  const chapters = Object.values(STORY_CHAPTERS) as StoryFragment[];
  const activeChapter = selectedKey === 'prologue' ? null : STORY_CHAPTERS[selectedKey];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B0F]/85 backdrop-blur-md select-none">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-4xl w-full h-[580px] max-h-[90vh] border border-bone-hairline bg-[#0A0B0F] text-[#E8E3D6] flex flex-col font-mono shadow-2xl relative"
        >
          {/* Modal Header */}
          <div className="px-6 py-3.5 border-b border-bone-hairline flex items-center justify-between flex-shrink-0 bg-[#0E1017]">
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-vermilion" />
              <div>
                <h2 className="text-sm font-semibold text-bone tracking-wide uppercase">
                  ARCHIVAL FIELD LOGS // SIX CORE DOMAINS
                </h2>
                <p className="text-[11px] text-bone-faint">
                  Transcripts and recovery logs from the systems architects
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1 hover:text-vermilion text-bone-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body: Left chapter list + Right story view */}
          <div className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* Chapter Selector (4 cols) */}
            <div className="col-span-4 border-r border-bone-hairline bg-[#0A0B0F] p-3 space-y-1.5 overflow-y-auto">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedKey('prologue');
                }}
                className={`w-full p-2.5 text-left text-xs transition-colors flex items-center justify-between border ${
                  selectedKey === 'prologue'
                    ? 'border-vermilion bg-vermilion/10 text-bone'
                    : 'border-transparent hover:border-bone/20 text-bone-muted'
                }`}
              >
                <div>
                  <span className="text-[10px] text-vermilion font-bold block">ORIGIN</span>
                  <span className="font-semibold">{PROLOGUE.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-bone-faint" />
              </button>

              <div className="pt-2 border-t border-bone/10">
                <span className="text-[10px] uppercase text-bone-faint px-2 block mb-1">
                  Planetary Logs
                </span>
                {chapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedKey(ch.domainId);
                    }}
                    className={`w-full p-2 text-left text-xs transition-colors flex items-center justify-between border mb-1 ${
                      selectedKey === ch.domainId
                        ? 'border-vermilion bg-vermilion/10 text-bone'
                        : 'border-transparent hover:border-bone/20 text-bone-muted'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] text-bone-faint block">{ch.catalogId} // {ch.worldName}</span>
                      <span className="font-semibold block truncate max-w-[170px]">{ch.title}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-bone-faint flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Active Story View (8 cols) */}
            <div className="col-span-8 p-6 overflow-y-auto bg-[#0E1017]">
              {selectedKey === 'prologue' ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] text-vermilion uppercase tracking-widest block">
                      {PROLOGUE.subtitle}
                    </span>
                    <h3 className="text-2xl font-serif text-bone mt-1">
                      {PROLOGUE.title}
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs text-bone-muted font-sans leading-relaxed">
                    {PROLOGUE.text.map((p: string, i: number) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              ) : activeChapter ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-bone-faint mb-1.5">
                      <Compass className="w-3.5 h-3.5 text-vermilion" />
                      <span>{activeChapter.author} // {activeChapter.role}</span>
                    </div>
                    <h3 className="text-2xl font-serif text-bone">
                      "{activeChapter.title}"
                    </h3>
                    <p className="text-xs text-bone-muted italic font-serif mt-1">
                      "{activeChapter.quote}"
                    </p>
                    <span className="text-[10px] text-bone-faint tabular-nums block mt-1">
                      RECORDED: {activeChapter.timestamp}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-bone-muted leading-relaxed font-sans border-t border-bone/10 pt-3">
                    {activeChapter.logbook.map((paragraph: string, i: number) => (
                      <p key={i}>{paragraph}</p>
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
