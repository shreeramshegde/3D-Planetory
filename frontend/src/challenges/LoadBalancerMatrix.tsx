import { useState, useEffect } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { Check, ShieldAlert, Cpu } from 'lucide-react';

type BalancingAlgorithm = 'round-robin' | 'least-connections' | 'ip-hash';

interface WorkerNode {
  id: string;
  name: string;
  load: number; // 0 - 100%
  status: 'healthy' | 'warning' | 'critical';
}

export const LoadBalancerMatrix = () => {
  const [algorithm, setAlgorithm] = useState<BalancingAlgorithm>('least-connections');
  const [nodes, setNodes] = useState<WorkerNode[]>([
    { id: 'node-1', name: 'Replica-Alpha', load: 85, status: 'warning' },
    { id: 'node-2', name: 'Replica-Beta', load: 92, status: 'critical' },
    { id: 'node-3', name: 'Replica-Gamma', load: 20, status: 'healthy' },
  ]);
  const [autoScalePods, setAutoScalePods] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.backend);

  // Dynamic simulation of traffic balancing
  useEffect(() => {
    const timer = setInterval(() => {
      setNodes((prevNodes) => {
        return prevNodes.map((node) => {
          let targetLoad = 50;

          if (algorithm === 'round-robin') {
            targetLoad = autoScalePods ? 42 : 68;
          } else if (algorithm === 'least-connections') {
            targetLoad = autoScalePods ? 34 : 45;
          } else {
            // IP Hash has affinity clustering
            targetLoad = node.id === 'node-2' ? 88 : 40;
          }

          const jitter = (Math.random() - 0.5) * 6;
          const newLoad = Math.min(100, Math.max(10, Math.round(targetLoad + jitter)));
          const st = newLoad > 85 ? 'critical' : newLoad > 70 ? 'warning' : 'healthy';

          return { ...node, load: newLoad, status: st };
        });
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [algorithm, autoScalePods]);

  // Check victory condition: all nodes healthy (load <= 65%)
  useEffect(() => {
    const allHealthy = nodes.every((n) => n.load <= 65);
    if (allHealthy && algorithm === 'least-connections' && autoScalePods) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  }, [nodes, algorithm, autoScalePods]);

  const handleCommit = () => {
    soundEngine.playClick();
    if (isSuccess && !isCompleted) {
      completeChallenge('backend');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="pb-2 border-b border-amber-500/20">
        <h3 className="text-amber-400 font-mono font-bold text-sm tracking-wide">
          CHALLENGE: LOAD BALANCER MATRIX
        </h3>
        <p className="text-xs text-slate-400">
          Rebalance traffic and enable horizontal autoscaling to prevent server deadlock.
        </p>
      </div>

      {/* Routing Algorithm Selector */}
      <div className="bg-slate-900/80 p-3 rounded border border-amber-500/20 space-y-2">
        <p className="text-xs font-mono text-slate-300">Routing Algorithm:</p>
        <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
          {(['round-robin', 'least-connections', 'ip-hash'] as BalancingAlgorithm[]).map((algo) => (
            <button
              key={algo}
              onClick={() => {
                soundEngine.playClick();
                setAlgorithm(algo);
              }}
              className={`py-1.5 px-2 rounded border text-center transition-colors capitalize ${
                algorithm === algo
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {algo.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Autoscaling Switch */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <span className="text-xs font-mono text-slate-300">Horizontal Pod Autoscaler (HPA)</span>
          <button
            onClick={() => {
              soundEngine.playClick();
              setAutoScalePods(!autoScalePods);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              autoScalePods ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                autoScalePods ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Cluster Node Visualizer */}
      <div className="space-y-2">
        <p className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-amber-400" /> Shard Worker Topology:
        </p>
        {nodes.map((node) => (
          <div
            key={node.id}
            className="p-2.5 rounded bg-black/60 border border-slate-800 font-mono text-xs space-y-1.5"
          >
            <div className="flex justify-between items-center">
              <span className="text-slate-200 font-semibold">{node.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  node.status === 'healthy'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : node.status === 'warning'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                }`}
              >
                {node.status} ({node.load}%)
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  node.status === 'healthy'
                    ? 'bg-emerald-500'
                    : node.status === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${node.load}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Status Alert */}
      <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/30 text-xs font-mono flex items-center gap-2">
        {isSuccess ? (
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        ) : (
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
        )}
        <span className={isSuccess ? 'text-emerald-300' : 'text-amber-300'}>
          {isSuccess
            ? 'CONSENSUS REACHED: Traffic perfectly distributed with zero deadlock risk.'
            : 'ACTION REQUIRED: Switch to Least Connections & enable HPA to drain hot nodes.'}
        </span>
      </div>

      {/* Action Button */}
      <button
        disabled={!isSuccess || isCompleted}
        onClick={handleCommit}
        className={`w-full py-2.5 rounded font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all ${
          isCompleted
            ? 'bg-emerald-600/90 text-white cursor-default shadow-emerald-500/20'
            : isSuccess
            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 active:scale-98'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isCompleted ? (
          <>
            <Check className="w-4 h-4" /> BALANCER OPTIMIZED (+450 XP)
          </>
        ) : isSuccess ? (
          'STABILIZE GATEWAY ROUTING'
        ) : (
          'RESOLVE BOTTLENECK TO COMMIT'
        )}
      </button>
    </div>
  );
};
