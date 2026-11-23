import { useState } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { Check, KeyRound, RotateCw } from 'lucide-react';

export const CipherProtocol = () => {
  // 3 Rotating cryptographic cipher rings (represented in degrees: 0, 90, 180, 270)
  // Target solution: Ring 1 = 90 deg, Ring 2 = 180 deg, Ring 3 = 270 deg
  const [ring1, setRing1] = useState<number>(0);
  const [ring2, setRing2] = useState<number>(90);
  const [ring3, setRing3] = useState<number>(0);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.security);

  const rotate = (ringNumber: 1 | 2 | 3) => {
    soundEngine.playClick();
    if (ringNumber === 1) setRing1((prev) => (prev + 90) % 360);
    if (ringNumber === 2) setRing2((prev) => (prev + 90) % 360);
    if (ringNumber === 3) setRing3((prev) => (prev + 90) % 360);
  };

  const isUnlocked = ring1 === 90 && ring2 === 180 && ring3 === 270;

  const handleCommit = () => {
    soundEngine.playClick();
    if (isUnlocked && !isCompleted) {
      completeChallenge('security');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="pb-2 border-b border-emerald-500/20">
        <h3 className="text-emerald-400 font-mono font-bold text-sm tracking-wide">
          CHALLENGE: CIPHER PROTOCOL
        </h3>
        <p className="text-xs text-slate-400">
          Rotate concentric cipher rings to align the SHA-256 cryptographic key matrix.
        </p>
      </div>

      {/* Interactive Cryptographic Ring Diagram */}
      <div className="relative h-44 flex items-center justify-center bg-black/70 rounded border border-emerald-500/20 overflow-hidden">
        {/* Outer Ring 3 */}
        <div
          onClick={() => rotate(3)}
          style={{ transform: `rotate(${ring3}deg)` }}
          className="w-36 h-36 rounded-full border-2 border-dashed border-emerald-500/40 absolute flex items-center justify-center cursor-pointer transition-transform duration-500 hover:border-emerald-400"
        >
          <span className="absolute top-1 text-[9px] font-mono text-emerald-400 bg-black/80 px-1">0xFA</span>
          <span className="absolute bottom-1 text-[9px] font-mono text-slate-500">0x00</span>
        </div>

        {/* Middle Ring 2 */}
        <div
          onClick={() => rotate(2)}
          style={{ transform: `rotate(${ring2}deg)` }}
          className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/60 absolute flex items-center justify-center cursor-pointer transition-transform duration-500 hover:border-emerald-400"
        >
          <span className="absolute top-0 text-[9px] font-mono text-emerald-400 bg-black/80 px-1">0xC4</span>
          <span className="absolute bottom-0 text-[9px] font-mono text-slate-500">0x1B</span>
        </div>

        {/* Inner Ring 1 */}
        <div
          onClick={() => rotate(1)}
          style={{ transform: `rotate(${ring1}deg)` }}
          className="w-14 h-14 rounded-full border-2 border-emerald-400 absolute flex items-center justify-center cursor-pointer transition-transform duration-500 bg-emerald-950/40"
        >
          <span className="absolute top-0 text-[9px] font-mono text-emerald-300 font-bold">0x99</span>
        </div>

        {/* Center Lock Icon */}
        <KeyRound className={`w-5 h-5 transition-colors ${isUnlocked ? 'text-emerald-300' : 'text-slate-500'}`} />
      </div>

      {/* Ring Rotation Controllers */}
      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <button
          onClick={() => rotate(1)}
          className="p-2 rounded bg-slate-900 border border-slate-700 hover:border-emerald-400 flex flex-col items-center gap-1 text-slate-300 transition-colors"
        >
          <span className="text-[10px] text-slate-400">INNER RING</span>
          <span className="font-bold text-emerald-400">{ring1}°</span>
          <RotateCw className="w-3.5 h-3.5 text-slate-400 mt-1" />
        </button>

        <button
          onClick={() => rotate(2)}
          className="p-2 rounded bg-slate-900 border border-slate-700 hover:border-emerald-400 flex flex-col items-center gap-1 text-slate-300 transition-colors"
        >
          <span className="text-[10px] text-slate-400">MID RING</span>
          <span className="font-bold text-emerald-400">{ring2}°</span>
          <RotateCw className="w-3.5 h-3.5 text-slate-400 mt-1" />
        </button>

        <button
          onClick={() => rotate(3)}
          className="p-2 rounded bg-slate-900 border border-slate-700 hover:border-emerald-400 flex flex-col items-center gap-1 text-slate-300 transition-colors"
        >
          <span className="text-[10px] text-slate-400">OUTER RING</span>
          <span className="font-bold text-emerald-400">{ring3}°</span>
          <RotateCw className="w-3.5 h-3.5 text-slate-400 mt-1" />
        </button>
      </div>

      <div className="p-2 rounded bg-black/60 border border-slate-800 text-center font-mono text-xs">
        <span className="text-slate-400">Target Alignment: </span>
        <span className="text-emerald-400 font-semibold">[90° - 180° - 270°]</span>
      </div>

      {/* Action Button */}
      <button
        disabled={!isUnlocked || isCompleted}
        onClick={handleCommit}
        className={`w-full py-2.5 rounded font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all ${
          isCompleted
            ? 'bg-emerald-600/90 text-white cursor-default shadow-emerald-500/20'
            : isUnlocked
            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 active:scale-98'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isCompleted ? (
          <>
            <Check className="w-4 h-4" /> CIPHER HANDSHAKE VERIFIED (+400 XP)
          </>
        ) : isUnlocked ? (
          'DECRYPT TELEMETRY & AUTHENTICATE'
        ) : (
          'ALIGN RINGS TO MATCH HASH'
        )}
      </button>
    </div>
  );
};
