import { useState, useEffect } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { ShieldCheck, Timer, RotateCcw, Play } from 'lucide-react';

const HEX_OPTIONS = ['1C', 'BD', '55', '7A', 'E9'];

export const BreachProtocolGame = () => {
  const [matrix, setMatrix] = useState<string[][]>([]);
  const [targetSequence] = useState<string[]>(['BD', '7A', '1C']);
  const [buffer, setBuffer] = useState<string[]>([]);
  const [bufferLimit] = useState(4);

  // Active selection axis: true for horizontal row, false for vertical column
  const [isRowActive, setIsRowActive] = useState<boolean>(true);
  const [activeRow, setActiveRow] = useState<number>(0);
  const [activeCol, setActiveCol] = useState<number | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(35);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.security);

  // Initialize a random 5x5 matrix that guarantees the target sequence is solvable
  const generateSolvableMatrix = () => {
    const grid: string[][] = [];
    for (let r = 0; r < 5; r++) {
      const row: string[] = [];
      for (let c = 0; c < 5; c++) {
        row.push(HEX_OPTIONS[Math.floor(Math.random() * HEX_OPTIONS.length)]);
      }
      grid.push(row);
    }
    // Plant solution:
    // Row 0, Col 2 = 'BD'
    // Row 3, Col 2 = '7A'
    // Row 3, Col 4 = '1C'
    grid[0][2] = 'BD';
    grid[3][2] = '7A';
    grid[3][4] = '1C';

    return grid;
  };

  const startGame = () => {
    soundEngine.playClick();
    setMatrix(generateSolvableMatrix());
    setBuffer([]);
    setIsRowActive(true);
    setActiveRow(0);
    setActiveCol(null);
    setTimeLeft(35);
    setIsWon(false);
    setIsFailed(false);
    setIsPlaying(true);
  };

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || isWon || isFailed) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsFailed(true);
          setIsPlaying(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isWon, isFailed]);

  // Click on a cell in the 5x5 grid
  const handleCellClick = (r: number, c: number) => {
    if (!isPlaying || isWon || isFailed) return;

    // Check if cell is in the currently active row or column
    const isValidClick = isRowActive ? r === activeRow : c === activeCol;
    if (!isValidClick) return;

    soundEngine.playClick();
    const hex = matrix[r][c];
    const newBuffer = [...buffer, hex];
    setBuffer(newBuffer);

    // Check if target sequence is satisfied
    const seqStr = targetSequence.join(',');
    const bufStr = newBuffer.join(',');
    if (bufStr.includes(seqStr)) {
      setIsWon(true);
      setIsPlaying(false);
      completeChallenge('security');
      return;
    }

    // Check if buffer limit reached without matching
    if (newBuffer.length >= bufferLimit) {
      setIsFailed(true);
      setIsPlaying(false);
      return;
    }

    // Alternate axis: if we picked in a row, next must be in that column!
    if (isRowActive) {
      setIsRowActive(false);
      setActiveCol(c);
      setActiveRow(r);
    } else {
      setIsRowActive(true);
      setActiveRow(r);
      setActiveCol(c);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-emerald-400 font-bold text-xs tracking-wider uppercase">
            Matrix Breach Protocol
          </h3>
          <p className="text-[11px] text-slate-400">
            Alternating row and column hops to extract the target sequence.
          </p>
        </div>
        <button
          onClick={startGame}
          className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
          title="Restart"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Target Sequence & Buffer Bar */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">TARGET SEQUENCE</span>
          <div className="flex gap-1.5 mt-0.5">
            {targetSequence.map((hex, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold text-[11px]"
              >
                {hex}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>BUFFER MEMORY</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Timer className="w-3 h-3" /> {timeLeft}s
            </span>
          </div>
          <div className="flex gap-1 mt-0.5">
            {Array.from({ length: bufferLimit }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold border ${
                  buffer[i]
                    ? 'bg-slate-800 border-emerald-500/60 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                {buffer[i] || '_'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5x5 Code Matrix */}
      <div className="p-2 bg-slate-950 rounded border border-slate-800 relative">
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {(matrix.length > 0 ? matrix : generateSolvableMatrix()).map((row, r) =>
            row.map((hex, c) => {
              const isEligible = isPlaying && (isRowActive ? r === activeRow : c === activeCol);

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  disabled={!isEligible}
                  className={`h-8 rounded font-mono text-xs font-bold transition-all ${
                    isEligible
                      ? 'bg-emerald-950/80 border border-emerald-400 text-emerald-200 hover:bg-emerald-800 hover:scale-105 shadow-sm shadow-emerald-500/30'
                      : isRowActive && r === activeRow
                      ? 'bg-slate-900 border border-emerald-500/30 text-emerald-300'
                      : !isRowActive && c === activeCol
                      ? 'bg-slate-900 border border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/40 border border-slate-800/80 text-slate-600'
                  }`}
                >
                  {hex}
                </button>
              );
            })
          )}
        </div>

        {/* Start Game Prompt Overlay */}
        {!isPlaying && !isWon && !isFailed && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 rounded">
            <p className="text-xs text-slate-300">
              Extract sequence [BD · 7A · 1C] within 4 buffer slots.
            </p>
            <button
              onClick={startGame}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded flex items-center gap-1.5 text-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5" /> INITIATE BREACH RUN
            </button>
          </div>
        )}

        {/* Failed Overlay */}
        {isFailed && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-2 rounded">
            <p className="text-rose-400 font-bold text-xs">BUFFER OVERRUN / TIMEOUT</p>
            <button
              onClick={startGame}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs"
            >
              RETRY BREACH
            </button>
          </div>
        )}
      </div>

      {/* Tactical Step Indicator */}
      <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
        <span>ACTIVE AXIS: {isRowActive ? `ROW ${activeRow + 1}` : `COL ${activeCol! + 1}`}</span>
        <span>BUFFER: {buffer.length} / {bufferLimit}</span>
      </div>

      {/* Status Bar */}
      <button
        disabled={isPlaying || isWon || isCompleted}
        onClick={startGame}
        className={`w-full py-2.5 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
          isWon || isCompleted
            ? 'bg-emerald-600/80 text-white cursor-default'
            : isPlaying
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
        }`}
      >
        {isWon || isCompleted ? (
          <>
            <ShieldCheck className="w-4 h-4" /> CIPHER BUFFER EXTRACTED (+400 XP)
          </>
        ) : isPlaying ? (
          'EXECUTION IN PROGRESS...'
        ) : (
          'START BREACH RUN'
        )}
      </button>
    </div>
  );
};
