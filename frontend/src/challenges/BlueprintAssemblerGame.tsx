import { useState } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { Check, Layout, RotateCcw, Monitor } from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  tag: string;
  color: string;
  slotIndex: number; // 0, 1, 2, 3
}

const AVAILABLE_COMPONENTS: ComponentItem[] = [
  { id: 'grid', name: 'Data Metric Grid', tag: '<MetricGrid columns={3} />', color: '#db2777', slotIndex: 2 },
  { id: 'nav', name: 'Global Nav Bar', tag: '<Navigation logo="Kepler" />', color: '#ec4899', slotIndex: 0 },
  { id: 'footer', name: 'Action Footer', tag: '<FooterActions commit="push" />', color: '#f472b6', slotIndex: 3 },
  { id: 'hero', name: 'Hero Canvas Banner', tag: '<CanvasViewport aspect="16:9" />', color: '#be185d', slotIndex: 1 },
];

export const BlueprintAssemblerGame = () => {
  const [placedSlots, setPlacedSlots] = useState<(ComponentItem | null)[]>([null, null, null, null]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.frontend);

  const slotLabels = [
    'Slot 01: Top Navigation Container',
    'Slot 02: Primary Hero Viewport',
    'Slot 03: Reactive Data Grid',
    'Slot 04: Control Action Footer',
  ];

  const handleSelect = (item: ComponentItem) => {
    soundEngine.playClick();
    setSelectedComponent(item);
  };

  const handlePlaceInSlot = (slotIdx: number) => {
    if (!selectedComponent) return;
    soundEngine.playClick();

    const newSlots = [...placedSlots];
    // Remove if already placed elsewhere
    const prevIdx = newSlots.findIndex((s) => s?.id === selectedComponent.id);
    if (prevIdx !== -1) newSlots[prevIdx] = null;

    newSlots[slotIdx] = selectedComponent;
    setPlacedSlots(newSlots);
    setSelectedComponent(null);
  };

  const handleClearSlot = (slotIdx: number) => {
    soundEngine.playClick();
    const newSlots = [...placedSlots];
    newSlots[slotIdx] = null;
    setPlacedSlots(newSlots);
  };

  const resetGame = () => {
    soundEngine.playClick();
    setPlacedSlots([null, null, null, null]);
    setSelectedComponent(null);
  };

  // Check if all 4 slots contain the correct components
  const isAllCorrect = placedSlots.every((s, idx) => s !== null && s.slotIndex === idx);

  const handleCommit = () => {
    soundEngine.playClick();
    if (isAllCorrect && !isCompleted) {
      completeChallenge('frontend');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-pink-400 font-bold text-xs tracking-wider uppercase">
            Interface Blueprint Assembler
          </h3>
          <p className="text-[11px] text-slate-400">
            Construct the responsive interface tree by placing components into target slots.
          </p>
        </div>
        <button
          onClick={resetGame}
          className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
          title="Reset Layout"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Available Component Shards Dock */}
      <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1.5">
        <span className="text-[10px] text-slate-400 block font-semibold">
          COMPONENT INVENTORY (Click to select):
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {AVAILABLE_COMPONENTS.map((item) => {
            const isPlaced = placedSlots.some((s) => s?.id === item.id);
            const isCurrent = selectedComponent?.id === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-1.5 rounded border text-left transition-colors flex flex-col gap-0.5 ${
                  isCurrent
                    ? 'bg-pink-950 border-pink-400 text-pink-200'
                    : isPlaced
                    ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-400'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <span className="font-bold text-[11px]">{item.name}</span>
                <span className="text-[9px] text-pink-400/80 truncate">{item.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Wireframe Blueprint Slots */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-slate-400 block font-semibold">
          TARGET WIREFRAME TREE (Click slot to place selected component):
        </span>
        {placedSlots.map((slotItem, idx) => (
          <div
            key={idx}
            onClick={() => handlePlaceInSlot(idx)}
            className={`p-2 rounded border border-dashed transition-all cursor-pointer flex items-center justify-between text-xs ${
              slotItem
                ? slotItem.slotIndex === idx
                  ? 'bg-emerald-950/30 border-emerald-500/60 text-slate-200'
                  : 'bg-rose-950/30 border-rose-500/60 text-slate-200'
                : selectedComponent
                ? 'bg-pink-950/20 border-pink-400/60 hover:bg-pink-900/30 text-pink-300'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                {idx + 1}
              </span>
              <div>
                <span className="text-[11px] block font-semibold">
                  {slotItem ? slotItem.name : slotLabels[idx]}
                </span>
                {slotItem && (
                  <span className="text-[9px] text-slate-400 font-mono">
                    {slotItem.tag}
                  </span>
                )}
              </div>
            </div>

            {slotItem && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSlot(idx);
                }}
                className="text-[10px] text-slate-400 hover:text-rose-400 px-1.5 py-0.5 rounded bg-slate-900"
              >
                REMOVE
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Live UI Render Preview */}
      <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[10px] space-y-1">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Monitor className="w-3 h-3 text-pink-400" />
          <span>DOM TREE COMPLIANCE:</span>
          <span
            className={`font-bold ml-auto ${
              isAllCorrect ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            {isAllCorrect ? '100% SPEC MATCH' : 'UNRESOLVED SLOTS'}
          </span>
        </div>
      </div>

      {/* Submit / Commit Layout */}
      <button
        disabled={!isAllCorrect || isCompleted}
        onClick={handleCommit}
        className={`w-full py-2.5 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
          isCompleted
            ? 'bg-emerald-600/80 text-white cursor-default'
            : isAllCorrect
            ? 'bg-pink-600 hover:bg-pink-500 text-white'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isCompleted ? (
          <>
            <Check className="w-4 h-4" /> BLUEPRINT COMPILED (+300 XP)
          </>
        ) : isAllCorrect ? (
          <>
            <Layout className="w-4 h-4" /> COMPILE INTERFACE TREE
          </>
        ) : (
          'PLACE ALL 4 COMPONENTS IN ORDER'
        )}
      </button>
    </div>
  );
};
