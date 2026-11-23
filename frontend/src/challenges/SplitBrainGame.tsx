import { useState } from 'react';
import { useSimulationLoop } from '../engine/useSimulationLoop';
import { splitBrainSim } from '../engine/simulations/splitBrainSim';
import { useUniverseStore } from '../store/useUniverseStore';
import { Server, RotateCcw, Scissors, Link, Zap, ShieldCheck, AlertTriangle, CheckCircle, Play, Pause } from 'lucide-react';

export const SplitBrainGame = () => {
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
    isRunning,
    setIsRunning,
  } = useSimulationLoop(splitBrainSim, 77);

  if (state.isWon && !hasReportedWin) {
    setHasReportedWin(true);
    completeChallenge('backend');
    fetch('/api/v1/challenges/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilot_callsign: 'ARCHIVIST-01',
        domain_id: 'backend',
        challenge_id: 'split-brain',
        seed,
        input_log: inputLog,
        claimed_score: score,
        duration_seconds: elapsedTime,
      }),
    }).catch(() => {});
  }

  const handlePartition = () => {
    // Cut Node 0 and 1 from Node 2, 3, 4
    sendInput({ type: 'ISOLATE_NODES', nodeIds: [0, 1] });
  };

  const handleHeal = () => {
    sendInput({ type: 'HEAL_ALL_PARTITIONS' });
  };

  const handleClientWrite = () => {
    sendInput({ type: 'SUBMIT_CLIENT_WRITE', command: `SET_TX_${state.clientWriteCount + 1}` });
  };

  const handleToggleNode = (nodeId: number, isAlive: boolean) => {
    if (isAlive) sendInput({ type: 'KILL_NODE', nodeId });
    else sendInput({ type: 'REVIVE_NODE', nodeId });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0A0B0F] text-[#E8E3D6] font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-bone-hairline text-xs">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-vermilion" />
          <span className="font-semibold text-bone">RAFT CONSENSUS CHAOS</span>
          <span className="text-bone-faint">// 5-NODE DISTRIBUTED CLUSTER</span>
        </div>
        <div className="flex items-center gap-3 tabular-nums">
          <span className="text-vermilion">SCORE: {score}</span>
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={state.isFailed || state.isWon}
            className={`p-1 transition-colors ${
              isRunning ? 'text-vermilion hover:text-white' : 'text-bone hover:text-vermilion'
            } disabled:opacity-30`}
            title={isRunning ? 'Pause cluster network' : 'Resume cluster network'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setHasReportedWin(false);
              reset();
            }}
            className="p-1 hover:text-vermilion transition-colors"
            title="Reset Raft cluster"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Linearizability Invariant Verification Status */}
      <div className="my-1 px-3 py-1 bg-[#0E1017] border border-bone-hairline flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-bone-muted">INVARIANT:</span>
          <span className="text-emerald-400 font-semibold">LINEARIZABLE (NO SPLIT BRAIN)</span>
        </div>
        <span className="text-bone-faint tabular-nums">COMMITTED: {state.committedCommands.length} ENTRIES</span>
      </div>

      {/* Terminal Overlays */}
      {state.isFailed && (
        <div className="p-3 my-1 bg-red-950/60 border border-red-500/50 text-red-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>CONSENSUS INVARIANT VIOLATION</span>
          </div>
          <p className="text-[11px] text-red-300">{state.invariantViolation}</p>
          <button
            onClick={() => {
              setHasReportedWin(false);
              reset();
            }}
            className="px-3 py-1 bg-vermilion text-ink font-semibold text-xs mt-1"
          >
            Reset Cluster State
          </button>
        </div>
      )}

      {state.isWon && (
        <div className="p-3 my-1 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>PARTITION TOLERANCE DEMONSTRATED</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            Maintained single linearizable history across network cuts and healed partitions. Score: {score}
          </p>
        </div>
      )}

      {/* 5-Node Raft Visualizer */}
      <div className="grid grid-cols-5 gap-2 my-2 flex-1">
        {state.nodes.map((node) => {
          const isLeader = node.role === 'LEADER';
          const isCand = node.role === 'CANDIDATE';

          return (
            <div
              key={node.id}
              onClick={() => handleToggleNode(node.id, node.isAlive)}
              className={`p-2 border flex flex-col justify-between text-xs cursor-pointer transition-colors ${
                !node.isAlive
                  ? 'border-red-500/40 bg-red-950/30 text-red-300'
                  : isLeader
                  ? 'border-vermilion bg-[#131114] text-bone'
                  : isCand
                  ? 'border-amber-400 bg-amber-950/30 text-bone'
                  : 'border-bone/15 bg-[#0E1017] text-bone'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold">NODE {node.id}</span>
                <span
                  className={`text-[9px] px-1 font-bold ${
                    isLeader ? 'bg-vermilion text-ink' : isCand ? 'bg-amber-400 text-ink' : 'bg-bone/10 text-bone-faint'
                  }`}
                >
                  {node.role}
                </span>
              </div>

              <div className="my-1.5 space-y-1 text-[10px]">
                <div className="flex justify-between text-bone-muted">
                  <span>Term: {node.currentTerm}</span>
                  <span>Commit: {node.commitIndex}</span>
                </div>
                <div className="flex justify-between text-bone-faint">
                  <span>Log Size: {node.log.length}</span>
                  <span>{node.isAlive ? 'ONLINE' : 'KILLED'}</span>
                </div>
              </div>

              <div className="text-[9px] text-bone-faint text-center border-t border-bone/10 pt-1">
                {isLeader ? 'BROADCASTING HB' : `VoteFor: ${node.votedFor ?? 'none'}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Network Partition Controls & Client Generator */}
      <div className="border-t border-bone-hairline pt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePartition}
            className="px-2.5 py-1 border border-bone/20 hover:border-vermilion text-[11px] flex items-center gap-1.5"
          >
            <Scissors className="w-3 h-3 text-vermilion" />
            <span>Partition [0,1] vs [2,3,4]</span>
          </button>
          <button
            onClick={handleHeal}
            className="px-2.5 py-1 border border-bone/20 hover:border-emerald-400 text-[11px] flex items-center gap-1.5"
          >
            <Link className="w-3 h-3 text-emerald-400" />
            <span>Heal Network</span>
          </button>
        </div>

        <button
          onClick={handleClientWrite}
          className="px-3 py-1 bg-vermilion text-ink font-semibold text-[11px] flex items-center gap-1.5"
        >
          <Zap className="w-3 h-3" />
          <span>Client Write</span>
        </button>
      </div>
    </div>
  );
};
