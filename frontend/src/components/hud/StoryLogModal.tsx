import { useState } from 'react';
import { PROLOGUE, STORY_CHAPTERS } from '../../data/storylines';
import { soundEngine } from '../../audio/soundEngine';
import { BookOpen, X, ChevronRight, User } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="max-w-3xl w-full h-[620px] max-h-[90vh] glass-panel-glow rounded-3xl border border-slate-700/80 flex flex-col overflow-hidden font-mono">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white tracking-widest uppercase">
                THE ARCHITECT'S LOGBOOK · HISTORICAL RECORDS
              </h2>
              <p className="text-[10px] text-slate-400">
                Transcripts from the founders and caretakers of the DevCosmos
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left chapter list + Right story view */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Chapter Selector (4 cols) */}
          <div className="col-span-4 border-r border-slate-800 bg-slate-950/50 p-3 space-y-1.5 overflow-y-auto">
            <button
              onClick={() => {
                soundEngine.playClick();
                setSelectedKey('prologue');
              }}
              className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between ${
                selectedKey === 'prologue'
                  ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <span>PROLOGUE: THE CASCADE</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="h-[1px] bg-slate-800 my-2" />

            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedKey(ch.domainId);
                }}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors flex flex-col gap-0.5 ${
                  selectedKey === ch.domainId
                    ? 'bg-slate-800 border border-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{ch.worldName}</span>
                  <span className="text-[9px] text-slate-500">{ch.author.split(' ')[0]}</span>
                </div>
                <span className="text-[10px] text-slate-500 truncate">{ch.title}</span>
              </button>
            ))}
          </div>

          {/* Chapter Content (8 cols) */}
          <div className="col-span-8 p-6 overflow-y-auto space-y-4">
            {selectedKey === 'prologue' ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    {PROLOGUE.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-white font-sans mt-0.5">
                    {PROLOGUE.title}
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed">
                  {PROLOGUE.text.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ) : activeChapter ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{activeChapter.author} · {activeChapter.role}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-sans">
                    "{activeChapter.title}"
                  </h3>
                  <p className="text-xs text-cyan-300/90 italic font-mono mt-1">
                    "{activeChapter.quote}"
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    RECORDED: {activeChapter.timestamp}
                  </span>
                </div>

                <div className="h-[1px] bg-slate-800" />

                <div className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed">
                  {activeChapter.logbook.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
