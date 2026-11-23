import { useState, useEffect, useRef, useCallback } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { Play, RotateCcw, Check, ShieldCheck, Activity } from 'lucide-react';

interface Packet {
  id: number;
  type: 'api' | 'auth' | 'ddos';
  x: number; // 0 to 100%
  lane: number; // 0 (top), 1 (mid), 2 (bottom)
  speed: number;
}

export const TrafficRouterGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [routedCount, setRoutedCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Router gate switches: gateA controls lane 0-1, gateB controls lane 1-2
  const [gateA, setGateA] = useState<'straight' | 'divert'>('straight');
  const [gateB, setGateB] = useState<'straight' | 'divert'>('straight');

  const packetsRef = useRef<Packet[]>([]);
  const nextIdRef = useRef(1);
  const frameRef = useRef<number | null>(null);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.cloud);

  const spawnPacket = useCallback(() => {
    const types: ('api' | 'auth' | 'ddos')[] = ['api', 'api', 'auth', 'ddos', 'ddos'];
    const type = types[Math.floor(Math.random() * types.length)];
    const initialLane = type === 'ddos' ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3);

    packetsRef.current.push({
      id: nextIdRef.current++,
      type,
      x: 0,
      lane: initialLane,
      speed: 0.35 + Math.random() * 0.25,
    });
  }, []);

  const resetGame = () => {
    soundEngine.playClick();
    packetsRef.current = [];
    setHealth(100);
    setScore(0);
    setRoutedCount(0);
    setIsWon(false);
    setIsGameOver(false);
    setIsPlaying(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  };

  const startGame = () => {
    soundEngine.playClick();
    resetGame();
    setIsPlaying(true);
    for (let i = 0; i < 3; i++) {
      spawnPacket();
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    let spawnTimer = 0;

    const loop = () => {
      spawnTimer++;
      if (spawnTimer % 65 === 0 && packetsRef.current.length < 7) {
        spawnPacket();
      }

      // Update packets
      packetsRef.current = packetsRef.current.map((p) => {
        const nextX = p.x + p.speed;
        let currentLane = p.lane;

        // Router Gate A interaction at x = 35%
        if (p.x < 35 && nextX >= 35) {
          if (gateA === 'divert') {
            currentLane = currentLane === 0 ? 1 : currentLane === 1 ? 0 : 2;
          }
        }

        // Router Gate B interaction at x = 65%
        if (p.x < 65 && nextX >= 65) {
          if (gateB === 'divert') {
            currentLane = currentLane === 1 ? 2 : currentLane === 2 ? 1 : 0;
          }
        }

        return { ...p, x: nextX, lane: currentLane };
      });

      // Check arrival at destinations (x >= 100%)
      const arrived = packetsRef.current.filter((p) => p.x >= 100);
      if (arrived.length > 0) {
        arrived.forEach((p) => {
          // Destinations:
          // Lane 0: API Gateway (wants 'api')
          // Lane 1: Auth Cluster (wants 'auth')
          // Lane 2: Quarantine Sinkhole (wants 'ddos')
          if (p.type === 'ddos') {
            if (p.lane === 2) {
              // Successfully quarantined!
              setScore((s) => s + 150);
              setRoutedCount((c) => c + 1);
            } else {
              // Malicious traffic hit service!
              setHealth((h) => {
                const nextH = Math.max(0, h - 25);
                if (nextH === 0) setIsGameOver(true);
                return nextH;
              });
            }
          } else if (p.type === 'api') {
            if (p.lane === 0) {
              setScore((s) => s + 100);
              setRoutedCount((c) => c + 1);
            } else {
              setHealth((h) => Math.max(0, h - 10));
            }
          } else if (p.type === 'auth') {
            if (p.lane === 1) {
              setScore((s) => s + 100);
              setRoutedCount((c) => c + 1);
            } else {
              setHealth((h) => Math.max(0, h - 10));
            }
          }
        });

        packetsRef.current = packetsRef.current.filter((p) => p.x < 100);
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isPlaying, gateA, gateB, spawnPacket]);

  // Win condition: score >= 800 and routed >= 8 packets
  useEffect(() => {
    if (score >= 800 && health > 0 && !isWon) {
      setIsWon(true);
      setIsPlaying(false);
      completeChallenge('cloud');
    }
  }, [score, health, isWon, completeChallenge]);

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      {/* Title */}
      <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-cyan-400 font-bold text-xs tracking-wider uppercase">
            Cluster Traffic Router
          </h3>
          <p className="text-[11px] text-slate-400">
            Toggle network gates to route clean requests and quarantine threats.
          </p>
        </div>
        <button
          onClick={resetGame}
          className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
          title="Reset Game"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">CLUSTER HEALTH</span>
          <span
            className={`font-bold ${
              health > 60
                ? 'text-emerald-400'
                : health > 30
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {health}%
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">SCORE</span>
          <span className="font-bold text-cyan-300">{score} / 800</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">ROUTED PACKETS</span>
          <span className="font-bold text-slate-200">{routedCount}</span>
        </div>
      </div>

      {/* Interactive Network Circuit Board View */}
      <div className="relative h-48 bg-slate-950 border border-slate-800 rounded-lg p-2 overflow-hidden select-none">
        {/* Network Lanes */}
        <div className="absolute inset-0 flex flex-col justify-around py-3 px-12 pointer-events-none">
          <div className="w-full h-[1px] bg-cyan-900/50" />
          <div className="w-full h-[1px] bg-cyan-900/50" />
          <div className="w-full h-[1px] bg-cyan-900/50" />
        </div>

        {/* Source Ingress */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 font-bold [writing-mode:vertical-lr] tracking-widest">
          INGRESS
        </div>

        {/* Target Destination Pods on Right */}
        <div className="absolute right-1 inset-y-2 flex flex-col justify-between py-1 text-[9px]">
          <div className="px-1.5 py-1 bg-cyan-950/80 border border-cyan-500/60 rounded text-cyan-300 font-bold">
            API POD
          </div>
          <div className="px-1.5 py-1 bg-blue-950/80 border border-blue-500/60 rounded text-blue-300 font-bold">
            AUTH POD
          </div>
          <div className="px-1.5 py-1 bg-rose-950/80 border border-rose-500/60 rounded text-rose-300 font-bold">
            SINKHOLE
          </div>
        </div>

        {/* Router Gate Switch A (at 35%) */}
        <div className="absolute left-[35%] inset-y-3 flex flex-col justify-center items-center gap-1 z-10">
          <button
            onClick={() => {
              soundEngine.playClick();
              setGateA((g) => (g === 'straight' ? 'divert' : 'straight'));
            }}
            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
              gateA === 'divert'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            GATE 1: {gateA === 'straight' ? 'LANE 0' : 'SWITCH'}
          </button>
        </div>

        {/* Router Gate Switch B (at 65%) */}
        <div className="absolute left-[65%] inset-y-3 flex flex-col justify-center items-center gap-1 z-10">
          <button
            onClick={() => {
              soundEngine.playClick();
              setGateB((g) => (g === 'straight' ? 'divert' : 'straight'));
            }}
            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
              gateB === 'divert'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            GATE 2: {gateB === 'straight' ? 'LANE 1' : 'SWITCH'}
          </button>
        </div>

        {/* Animated Packets Moving Across Lanes */}
        {packetsRef.current.map((p) => {
          const topPercent = p.lane === 0 ? 18 : p.lane === 1 ? 50 : 82;
          return (
            <div
              key={p.id}
              className={`absolute w-3.5 h-3.5 -ml-2 -mt-2 rounded-full border shadow-md transition-all duration-75 flex items-center justify-center text-[7px] font-bold ${
                p.type === 'api'
                  ? 'bg-cyan-500 border-white text-slate-950'
                  : p.type === 'auth'
                  ? 'bg-blue-500 border-white text-slate-950'
                  : 'bg-rose-500 border-white text-white animate-pulse'
              }`}
              style={{
                left: `${Math.min(92, Math.max(3, p.x))}%`,
                top: `${topPercent}%`,
              }}
            >
              {p.type[0].toUpperCase()}
            </div>
          );
        })}

        {/* Overlay when game not running */}
        {!isPlaying && !isWon && !isGameOver && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 z-20">
            <p className="text-xs text-slate-300">
              Guide API (Cyan) and Auth (Blue) to pods. Sink DDOS (Red) into Quarantine.
            </p>
            <button
              onClick={startGame}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded flex items-center gap-1.5 text-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5" /> START NETWORK ROUTING
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-2 z-20">
            <p className="text-rose-400 font-bold text-xs">CLUSTER HEALTH DEPLETED</p>
            <button
              onClick={startGame}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs"
            >
              RETRY ROUTING
            </button>
          </div>
        )}

        {/* Victory Screen */}
        {(isWon || isCompleted) && (
          <div className="absolute inset-0 bg-emerald-950/90 border border-emerald-500/50 flex flex-col items-center justify-center gap-1.5 z-20">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <p className="text-emerald-300 font-bold text-xs">CLUSTER STABILIZED</p>
            <p className="text-[10px] text-emerald-400/80">
              Zero packet leakage · Target throughput sustained
            </p>
          </div>
        )}
      </div>

      {/* Legend & Instructions */}
      <div className="bg-slate-900/60 p-2 rounded border border-slate-800 text-[11px] space-y-1">
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> API Packet (Top)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> Auth Packet (Mid)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> DDOS Threat (Bottom)
          </span>
        </div>
      </div>

      {/* Status Bar */}
      <button
        disabled={isPlaying || isWon || isCompleted}
        onClick={startGame}
        className={`w-full py-2.5 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
          isWon || isCompleted
            ? 'bg-emerald-600/80 text-white cursor-default'
            : isPlaying
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
        }`}
      >
        {isWon || isCompleted ? (
          <>
            <Check className="w-4 h-4" /> DOMAIN CALIBRATED (+250 XP)
          </>
        ) : isPlaying ? (
          <>
            <Activity className="w-4 h-4 animate-spin" /> ROUTING IN PROGRESS
          </>
        ) : (
          'START CHALLENGE'
        )}
      </button>
    </div>
  );
};
