import { useState, useEffect, useRef } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { ShieldCheck, ShieldAlert, Cpu, Play, RotateCcw, Activity } from 'lucide-react';

interface ClusterNode {
  id: string;
  az: 'AZ-East' | 'AZ-West' | 'AZ-Central';
  status: 'healthy' | 'degraded' | 'crashed';
  pods: number; // 0 to 4
  maxPods: number;
}

export const ChaosClusterGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [nodes, setNodes] = useState<ClusterNode[]>([
    { id: 'node-east-1', az: 'AZ-East', status: 'healthy', pods: 3, maxPods: 4 },
    { id: 'node-west-1', az: 'AZ-West', status: 'healthy', pods: 3, maxPods: 4 },
    { id: 'node-central-1', az: 'AZ-Central', status: 'healthy', pods: 2, maxPods: 4 },
  ]);

  const [rps, setRps] = useState(600);
  const [uptimeSla, setUptimeSla] = useState(100.0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [targetTime] = useState(40); // 40 seconds to survive
  const [activeWave, setActiveWave] = useState<number>(1);
  const [waveAlert, setWaveAlert] = useState<string>('Wave 1: Normal Ingress Load');

  const [wafEnabled, setWafEnabled] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.cloud);

  const loopRef = useRef<number | null>(null);

  const resetGame = () => {
    soundEngine.playClick();
    if (loopRef.current) clearInterval(loopRef.current);
    setNodes([
      { id: 'node-east-1', az: 'AZ-East', status: 'healthy', pods: 3, maxPods: 4 },
      { id: 'node-west-1', az: 'AZ-West', status: 'healthy', pods: 3, maxPods: 4 },
      { id: 'node-central-1', az: 'AZ-Central', status: 'healthy', pods: 2, maxPods: 4 },
    ]);
    setRps(600);
    setUptimeSla(100.0);
    setElapsedTime(0);
    setActiveWave(1);
    setWaveAlert('Wave 1: Baseline Load');
    setWafEnabled(false);
    setIsFailed(false);
    setIsWon(false);
    setIsPlaying(false);
  };

  const startGame = () => {
    soundEngine.playClick();
    resetGame();
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || isFailed || isWon) return;

    loopRef.current = window.setInterval(() => {
      setElapsedTime((prevTime) => {
        const nextTime = prevTime + 1;

        // Wave 2 at 12s: Chaos Monkey strike on Central Node!
        if (nextTime === 12) {
          setActiveWave(2);
          setWaveAlert('Wave 2: Chaos Monkey terminated AZ-Central! Pods evicted!');
          setNodes((prev) =>
            prev.map((n) =>
              n.az === 'AZ-Central'
                ? { ...n, status: 'crashed', pods: 0 }
                : n
            )
          );
        }

        // Wave 3 at 24s: Severe DDoS Traffic Surge (1800 RPS)!
        if (nextTime === 24) {
          setActiveWave(3);
          setWaveAlert('Wave 3: 1,800 RPS Surge! Enable WAF rate-limiting immediately!');
          setRps(1800);
        }

        // Check victory
        if (nextTime >= targetTime) {
          setIsWon(true);
          setIsPlaying(false);
          completeChallenge('cloud');
          return targetTime;
        }

        return nextTime;
      });

      // Simulation physics per second
      setNodes((currentNodes) => {
        const totalHealthyPods = currentNodes
          .filter((n) => n.status === 'healthy')
          .reduce((sum, n) => sum + n.pods, 0);

        // Required pods = rps / 250
        const effectiveRps = wafEnabled ? rps * 0.55 : rps;
        const requiredPods = Math.ceil(effectiveRps / 200);

        if (totalHealthyPods < requiredPods) {
          // Cluster is under-provisioned! SLA drops
          const penalty = ((requiredPods - totalHealthyPods) / requiredPods) * 0.35;
          setUptimeSla((prevSla) => {
            const nextSla = Math.max(90.0, Math.round((prevSla - penalty) * 100) / 100);
            if (nextSla < 99.90) {
              setIsFailed(true);
              setIsPlaying(false);
            }
            return nextSla;
          });
        } else {
          // Pod capacity is sufficient
          setUptimeSla((prevSla) => Math.min(100.0, Math.round((prevSla + 0.05) * 100) / 100));
        }

        return currentNodes;
      });
    }, 1000);

    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [isPlaying, isFailed, isWon, rps, wafEnabled, targetTime, completeChallenge]);

  // Tactical Actions
  const scaleOut = () => {
    soundEngine.playClick();
    setNodes((prev) => {
      return prev.map((n) => {
        if (n.status === 'healthy' && n.pods < n.maxPods) {
          return { ...n, pods: Math.min(n.maxPods, n.pods + 1) };
        }
        return n;
      });
    });
  };

  const rebootCrashedNode = (nodeId: string) => {
    soundEngine.playClick();
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, status: 'healthy', pods: 2 } : n
      )
    );
  };

  const toggleWaf = () => {
    soundEngine.playClick();
    setWafEnabled(!wafEnabled);
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-cyan-400 font-bold text-xs tracking-wider uppercase">
            Chaos Cluster: 99.99% SLA Defense
          </h3>
          <p className="text-[11px] text-slate-400">
            Survive multi-AZ node crashes and DDoS surges. Maintain SLA &ge; 99.90%.
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

      {/* Real-time Telemetry Dashboard */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">UPTIME SLA</span>
          <span
            className={`font-bold ${
              uptimeSla >= 99.90 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {uptimeSla.toFixed(2)}%
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">INGRESS RPS</span>
          <span className="font-bold text-cyan-300">
            {wafEnabled ? Math.round(rps * 0.55) : rps} req/s
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">ACTIVE WAVE</span>
          <span className="font-bold text-amber-300">{activeWave} / 3</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">SURVIVAL TIME</span>
          <span className="font-bold text-slate-200">
            {elapsedTime}s / {targetTime}s
          </span>
        </div>
      </div>

      {/* Wave Incident Alert Bar */}
      <div className="p-2 rounded bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-200">{waveAlert}</span>
        </div>
        <span className="text-[10px] text-slate-500">TARGET: &ge; 99.90%</span>
      </div>

      {/* 3 Availability Zone Nodes Visualizer */}
      <div className="space-y-2">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`p-2.5 rounded border transition-colors ${
              node.status === 'crashed'
                ? 'bg-rose-950/40 border-rose-500/50'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex justify-between items-center text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">{node.az}</span>
                <span className="text-[10px] text-slate-500">[{node.id}]</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  node.status === 'healthy'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                }`}
              >
                {node.status} ({node.pods}/{node.maxPods} PODS)
              </span>
            </div>

            {/* Pod Slots Graphic */}
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: node.maxPods }).map((_, i) => (
                <div
                  key={i}
                  className={`h-5 rounded flex items-center justify-center text-[9px] font-bold border transition-colors ${
                    i < node.pods
                      ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-700'
                  }`}
                >
                  {i < node.pods ? 'POD' : 'EMPTY'}
                </div>
              ))}
            </div>

            {/* Crashed Node Recovery Button */}
            {node.status === 'crashed' && (
              <button
                onClick={() => rebootCrashedNode(node.id)}
                className="mt-2 w-full py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold tracking-wider"
              >
                RE-PROVISION REPLACEMENT NODE
              </button>
            )}
          </div>
        ))}
      </div>

      {/* SRE Tactical Controls */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={scaleOut}
          disabled={!isPlaying}
          className="p-2 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-1.5"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          SCALE OUT REPLICAS (+1 POD/NODE)
        </button>

        <button
          onClick={toggleWaf}
          disabled={!isPlaying}
          className={`p-2 rounded border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            wafEnabled
              ? 'bg-amber-950 border-amber-400 text-amber-300'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          {wafEnabled ? 'WAF RATE-LIMIT: ACTIVE (-45%)' : 'ENABLE WAF RATE-LIMIT'}
        </button>
      </div>

      {/* Failure Box */}
      {isFailed && (
        <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded text-center text-xs text-rose-300">
          <ShieldAlert className="w-5 h-5 mx-auto mb-1 text-rose-400" />
          <p className="font-bold">SLA BREACHED: CATASTROPHIC OUTAGE</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Cluster availability dipped below 99.90%. Click Retry to redeploy.
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
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
        }`}
      >
        {isWon || isCompleted ? (
          <>
            <ShieldCheck className="w-4 h-4" /> 99.99% SLA CERTIFIED (+250 XP)
          </>
        ) : isFailed ? (
          'RETRY DISASTER RECOVERY RUN'
        ) : isPlaying ? (
          'CLUSTER SURVIVAL IN PROGRESS...'
        ) : (
          <>
            <Play className="w-4 h-4" /> INITIATE CHAOS DRILL
          </>
        )}
      </button>
    </div>
  );
};
