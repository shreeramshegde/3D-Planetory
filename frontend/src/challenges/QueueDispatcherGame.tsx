import { useState, useEffect, useRef } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { Check, ShieldAlert, Cpu, Play, RotateCcw } from 'lucide-react';

interface Shard {
  id: number;
  name: string;
  queue: number; // current queue count (0 to 8)
  maxQueue: number;
  hasLock: boolean;
}

export const QueueDispatcherGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shards, setShards] = useState<Shard[]>([
    { id: 1, name: 'Shard 01 (Read)', queue: 2, maxQueue: 8, hasLock: false },
    { id: 2, name: 'Shard 02 (Write)', queue: 3, maxQueue: 8, hasLock: false },
    { id: 3, name: 'Shard 03 (Stream)', queue: 1, maxQueue: 8, hasLock: false },
  ]);
  const [processedCount, setProcessedCount] = useState(0);
  const [isDeadlocked, setIsDeadlocked] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.backend);
  const targetTransactions = 25;

  const timerRef = useRef<number | null>(null);

  const resetGame = () => {
    soundEngine.playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    setShards([
      { id: 1, name: 'Shard 01 (Read)', queue: 2, maxQueue: 8, hasLock: false },
      { id: 2, name: 'Shard 02 (Write)', queue: 3, maxQueue: 8, hasLock: false },
      { id: 3, name: 'Shard 03 (Stream)', queue: 1, maxQueue: 8, hasLock: false },
    ]);
    setProcessedCount(0);
    setIsDeadlocked(false);
    setIsWon(false);
    setIsPlaying(false);
  };

  const startGame = () => {
    soundEngine.playClick();
    resetGame();
    setIsPlaying(true);
  };

  // Transaction arrival simulation loop
  useEffect(() => {
    if (!isPlaying || isDeadlocked || isWon) return;

    timerRef.current = window.setInterval(() => {
      setShards((prevShards) => {
        // Randomly add 1 transaction to a random shard
        const targetIdx = Math.floor(Math.random() * 3);
        const updated = prevShards.map((s, idx) => {
          if (idx === targetIdx && !s.hasLock) {
            const nextQ = s.queue + 1;
            return { ...s, queue: nextQ };
          }
          return s;
        });

        // 10% chance of lock contention occurring on a non-locked shard
        if (Math.random() < 0.12) {
          const lockIdx = Math.floor(Math.random() * 3);
          updated[lockIdx] = { ...updated[lockIdx], hasLock: true };
        }

        // Check if any shard overflowed (queue >= maxQueue)
        const overflow = updated.some((s) => s.queue >= s.maxQueue);
        if (overflow) {
          setIsDeadlocked(true);
          setIsPlaying(false);
        }

        return updated;
      });
    }, 850);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isDeadlocked, isWon]);

  // Dispatch a worker to flush 2 items from the chosen shard
  const dispatchWorker = (shardId: number) => {
    if (!isPlaying || isDeadlocked || isWon) return;
    soundEngine.playClick();

    setShards((prev) =>
      prev.map((s) => {
        if (s.id === shardId) {
          const flushAmount = Math.min(s.queue, 2);
          if (flushAmount > 0) {
            setProcessedCount((c) => {
              const nextC = c + flushAmount;
              if (nextC >= targetTransactions) {
                setIsWon(true);
                setIsPlaying(false);
                completeChallenge('backend');
              }
              return nextC;
            });
          }
          return { ...s, queue: Math.max(0, s.queue - flushAmount) };
        }
        return s;
      })
    );
  };

  // Unlock contention lock
  const resolveLock = (shardId: number) => {
    soundEngine.playClick();
    setShards((prev) =>
      prev.map((s) => (s.id === shardId ? { ...s, hasLock: false } : s))
    );
  };

  // Keyboard controls [1], [2], [3]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') dispatchWorker(1);
      if (e.key === '2') dispatchWorker(2);
      if (e.key === '3') dispatchWorker(3);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-amber-400 font-bold text-xs tracking-wider uppercase">
            Concurrency Queue Dispatcher
          </h3>
          <p className="text-[11px] text-slate-400">
            Dispatch workers to process shard queues and resolve locks before buffer overflow.
          </p>
        </div>
        <button
          onClick={resetGame}
          className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress & Target */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">COMMITTED TRANSACTIONS</span>
          <span className="font-bold text-amber-300">
            {processedCount} / {targetTransactions}
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">KEYBOARD SHORTCUTS</span>
          <span className="font-bold text-slate-200">Keys [1], [2], [3]</span>
        </div>
      </div>

      {/* 3 Shard Queues */}
      <div className="space-y-2">
        {shards.map((shard) => {
          const isDanger = shard.queue >= 6;

          return (
            <div
              key={shard.id}
              className={`p-2.5 rounded border transition-colors ${
                shard.hasLock
                  ? 'bg-rose-950/40 border-rose-500/50'
                  : isDanger
                  ? 'bg-amber-950/40 border-amber-500/50'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-200">{shard.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    shard.hasLock
                      ? 'bg-rose-500 text-white animate-pulse'
                      : isDanger
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {shard.hasLock ? 'LOCK CONTENTION' : `${shard.queue} / ${shard.maxQueue} ITEMS`}
                </span>
              </div>

              {/* Discrete queue slots */}
              <div className="flex gap-1 h-3 mb-2">
                {Array.from({ length: shard.maxQueue }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm transition-colors ${
                      i < shard.queue
                        ? isDanger
                          ? 'bg-rose-500'
                          : 'bg-amber-400'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              {/* Action Button */}
              {shard.hasLock ? (
                <button
                  onClick={() => resolveLock(shard.id)}
                  className="w-full py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold tracking-wider"
                >
                  RESOLVE MUTEX LOCK
                </button>
              ) : (
                <button
                  onClick={() => dispatchWorker(shard.id)}
                  disabled={!isPlaying || shard.queue === 0}
                  className="w-full py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 rounded text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <Cpu className="w-3 h-3 text-amber-400" />
                  FLUSH QUEUE (KEY {shard.id})
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Deadlock overlay */}
      {isDeadlocked && (
        <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded text-center text-xs text-rose-300">
          <ShieldAlert className="w-5 h-5 mx-auto mb-1 text-rose-400" />
          <p className="font-bold">BUFFER SATURATION DEADLOCK</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Queue reached 100% capacity. Click Retry below.
          </p>
        </div>
      )}

      {/* Action / Trigger */}
      <button
        disabled={isPlaying || isWon || isCompleted}
        onClick={startGame}
        className={`w-full py-2.5 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
          isWon || isCompleted
            ? 'bg-emerald-600/80 text-white cursor-default'
            : isPlaying
            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
        }`}
      >
        {isWon || isCompleted ? (
          <>
            <Check className="w-4 h-4" /> SHARD CLUSTER BALANCED (+450 XP)
          </>
        ) : isDeadlocked ? (
          'RETRY QUEUE RUN'
        ) : isPlaying ? (
          'PROCESSING TRANSACTION STREAM...'
        ) : (
          <>
            <Play className="w-4 h-4" /> START QUEUE SIMULATION
          </>
        )}
      </button>
    </div>
  );
};
