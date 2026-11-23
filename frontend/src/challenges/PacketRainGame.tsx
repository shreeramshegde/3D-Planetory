import { useState } from 'react';
import { useSimulationLoop } from '../engine/useSimulationLoop';
import { packetRainSim, ServiceNodeType } from '../engine/simulations/packetRainSim';
import { useUniverseStore } from '../store/useUniverseStore';
import { Cloud, RotateCcw, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export const PacketRainGame = () => {
  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const [hasReportedWin, setHasReportedWin] = useState(false);

  const {
    state,
    seed,
    score,
    elapsedTime,
    inputLog,
    sendInput,
    reset,
  } = useSimulationLoop(packetRainSim, 101);

  if (state.isWon && !hasReportedWin) {
    setHasReportedWin(true);
    completeChallenge('cloud');
    fetch('/api/v1/challenges/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilot_callsign: 'ARCHIVIST-01',
        domain_id: 'cloud',
        challenge_id: 'packet-rain',
        seed,
        input_log: inputLog,
        claimed_score: score,
        duration_seconds: elapsedTime,
      }),
    }).catch(() => {});
  }

  const handleAddNode = (type: ServiceNodeType) => {
    sendInput({ type: 'ADD_NODE', nodeType: type, x: 1, y: 1 });
  };

  const handleReboot = (nodeId: string) => {
    sendInput({ type: 'REBOOT_NODE', nodeId });
  };

  const dropRate = state.totalSpawned > 0 ? (state.totalDropped / state.totalSpawned) * 100 : 0;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0A0B0F] text-[#E8E3D6] font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-bone-hairline text-xs">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-vermilion" />
          <span className="font-semibold text-bone">PACKET RAIN TOPOLOGY</span>
          <span className="text-bone-faint">// WAVE {state.wave} / 3</span>
        </div>
        <div className="flex items-center gap-4 tabular-nums">
          <span>BUDGET: ${state.budget}</span>
          <span className="text-vermilion">SCORE: {score}</span>
          <button
            onClick={() => {
              setHasReportedWin(false);
              reset();
            }}
            className="p-1 hover:text-vermilion transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chaos Alert Banner */}
      {state.chaosTriggered && (
        <div className="my-1.5 px-3 py-1.5 bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>CHAOS EVENT: Worker replica failure induced at t=18s. Reboot node or route around.</span>
          </div>
        </div>
      )}

      {/* Terminal Overlays */}
      {state.isFailed && (
        <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs space-y-2">
          <span className="font-bold text-red-400 block">CASCADING PACKET LOSS EXCEEDED 35%</span>
          <p className="text-[11px] text-red-300">
            Node saturation caused request buffer exhaustion. Add queues and cache nodes to absorb traffic bursts.
          </p>
          <button
            onClick={() => {
              setHasReportedWin(false);
              reset();
            }}
            className="px-3 py-1 bg-vermilion text-ink font-semibold text-xs mt-1"
          >
            Re-provision Topology
          </button>
        </div>
      )}

      {state.isWon && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>HIGH AVAILABILITY TOPOLOGY VERIFIED</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            Routed {state.totalProcessed} requests through all 3 traffic waves with stable latency. Score: {score}
          </p>
        </div>
      )}

      {/* Topology Nodes Grid */}
      <div className="grid grid-cols-3 gap-2 my-2 flex-1">
        {state.nodes.map((node) => {
          const loadPercent = Math.min(100, (node.currentLoad / node.capacity) * 100);
          return (
            <div
              key={node.id}
              className={`p-2.5 border flex flex-col justify-between text-xs ${
                !node.isAlive
                  ? 'border-red-500 bg-red-950/40 text-red-200'
                  : node.currentLoad > node.capacity * 0.8
                  ? 'border-amber-500/60 bg-[#0E1017] text-bone'
                  : 'border-bone/15 bg-[#0E1017] text-bone'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold">{node.id}</span>
                <span className="text-[10px] text-bone-faint">{node.type}</span>
              </div>

              <div className="my-2">
                {node.isAlive ? (
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-bone-muted text-[10px]">
                      <span>LOAD: {node.currentLoad}/{node.capacity}</span>
                      <span>{Math.round(loadPercent)}%</span>
                    </div>
                    <div className="w-full bg-bone/10 h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          loadPercent > 85 ? 'bg-amber-400' : 'bg-vermilion'
                        }`}
                        style={{ width: `${loadPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-bone-faint block">Processed: {node.processedCount}</span>
                  </div>
                ) : (
                  <div className="text-center py-1">
                    <span className="text-red-400 font-bold block text-[11px]">NODE OFFLINE</span>
                    <button
                      onClick={() => handleReboot(node.id)}
                      className="mt-1 px-2 py-0.5 bg-red-800 hover:bg-red-700 text-white text-[10px] flex items-center gap-1 mx-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reboot ($5)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Provisioning Store Bar */}
      <div className="border-t border-bone-hairline pt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-bone-faint text-[10px] uppercase">Provision:</span>
          <button
            onClick={() => handleAddNode('CACHE')}
            disabled={state.budget < 20}
            className="px-2 py-1 border border-bone/20 hover:border-vermilion text-[10px] disabled:opacity-40"
          >
            + Cache ($20)
          </button>
          <button
            onClick={() => handleAddNode('QUEUE')}
            disabled={state.budget < 10}
            className="px-2 py-1 border border-bone/20 hover:border-vermilion text-[10px] disabled:opacity-40"
          >
            + Queue ($10)
          </button>
          <button
            onClick={() => handleAddNode('REPLICA')}
            disabled={state.budget < 18}
            className="px-2 py-1 border border-bone/20 hover:border-vermilion text-[10px] disabled:opacity-40"
          >
            + Replica ($18)
          </button>
        </div>

        <div className="flex items-center gap-4 text-[11px] tabular-nums text-bone-muted">
          <span>Processed: {state.totalProcessed}</span>
          <span className={dropRate > 25 ? 'text-red-400' : 'text-bone-faint'}>
            Drop Rate: {dropRate.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
