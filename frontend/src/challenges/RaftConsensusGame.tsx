import { useState, useEffect, useRef } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { Check, Play, RotateCcw, Activity } from 'lucide-react';

interface RaftNode {
  id: number;
  role: 'Leader' | 'Follower' | 'Candidate';
  term: number;
  logIndex: number;
  heartbeatTimer: number; // 0 to 100%
  partition: 'A' | 'B'; // A: Minority (1, 2), B: Majority (3, 4, 5)
}

export const RaftConsensusGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPartitioned, setIsPartitioned] = useState(false);
  const [committedEntries, setCommittedEntries] = useState(0);
  const targetCommits = 15;

  const [nodes, setNodes] = useState<RaftNode[]>([
    { id: 1, role: 'Leader', term: 1, logIndex: 2, heartbeatTimer: 80, partition: 'A' },
    { id: 2, role: 'Follower', term: 1, logIndex: 2, heartbeatTimer: 65, partition: 'A' },
    { id: 3, role: 'Follower', term: 1, logIndex: 2, heartbeatTimer: 70, partition: 'B' },
    { id: 4, role: 'Follower', term: 1, logIndex: 2, heartbeatTimer: 60, partition: 'B' },
    { id: 5, role: 'Follower', term: 1, logIndex: 2, heartbeatTimer: 55, partition: 'B' },
  ]);

  const [incident, setIncident] = useState<string>('Cluster healthy: 5/5 nodes reachable under Term 1');
  const [isWon, setIsWon] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const loopRef = useRef<number | null>(null);
  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.backend);

  const resetGame = () => {
    soundEngine.playClick();
    if (loopRef.current) clearInterval(loopRef.current);
    setNodes([
      { id: 1, role: 'Leader', term: 1, logIndex: 2, heartbeatTimer: 80, partition: 'A' },
      { id: 2, role: 'Follower', term: 1, logIndex: 2, heartbeatTimer: 65, partition: 'A' },
      { id: 3, role: 'Follower', term: 1, logIndex: 2, heartbeatTimer: 70, partition: 'B' },
      { id: 4, role: 'Follower', term: 1, logIndex: 2, heartbeatTimer: 60, partition: 'B' },
      { id: 5, role: 'Follower', term: 1, logIndex: 2, heartbeatTimer: 55, partition: 'B' },
    ]);
    setIsPartitioned(false);
    setCommittedEntries(0);
    setIncident('Cluster healthy: 5/5 nodes reachable');
    setIsWon(false);
    setIsFailed(false);
    setIsPlaying(false);
  };

  const startGame = () => {
    soundEngine.playClick();
    resetGame();
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || isWon || isFailed) return;

    let tick = 0;
    loopRef.current = window.setInterval(() => {
      tick++;

      // Trigger network partition at tick = 8
      if (tick === 8 && !isPartitioned) {
        setIsPartitioned(true);
        setIncident('NETWORK PARTITION: Nodes {1, 2} isolated from {3, 4, 5}! Majority quorum required!');
      }

      setNodes((prevNodes) => {
        return prevNodes.map((node) => {
          // Decrement heartbeats
          const nextHb = Math.max(0, node.heartbeatTimer - 12);

          // If follower heartbeat hits 0, it becomes Candidate
          if (nextHb === 0 && node.role === 'Follower') {
            return {
              ...node,
              role: 'Candidate',
              term: node.term + 1,
              heartbeatTimer: 100,
            };
          }

          return { ...node, heartbeatTimer: nextHb };
        });
      });
    }, 1000);

    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [isPlaying, isWon, isFailed, isPartitioned]);

  // Propose a Write-Ahead Log Entry
  const proposeLogEntry = () => {
    soundEngine.playClick();
    const leader = nodes.find((n) => n.role === 'Leader');
    if (!leader) {
      setIncident('ERROR: No active cluster leader! Election required!');
      return;
    }

    // Check partition quorum
    if (isPartitioned) {
      if (leader.partition === 'A') {
        // Minority partition has only 2 nodes (Node 1 and Node 2) < Quorum 3!
        setIncident('SPLIT-BRAIN BLOCKED: Minority partition cannot achieve quorum (2 < 3)! Must step down leader!');
        setIsFailed(true);
        setIsPlaying(false);
        return;
      }
    }

    // Successful quorum replication!
    const newIndex = leader.logIndex + 1;
    setNodes((prev) =>
      prev.map((n) => {
        if (!isPartitioned || n.partition === leader.partition) {
          return { ...n, logIndex: newIndex, heartbeatTimer: 100 };
        }
        return n;
      })
    );

    setCommittedEntries((c) => {
      const nextC = c + 1;
      if (nextC >= targetCommits) {
        setIsWon(true);
        setIsPlaying(false);
        completeChallenge('backend');
      }
      return nextC;
    });

    setIncident(`LOG REPLICATED: Term ${leader.term} · Log Index #${newIndex} committed across Quorum`);
  };

  // Step down rogue leader on minority partition
  const stepDownMinorityLeader = () => {
    soundEngine.playClick();
    setNodes((prev) =>
      prev.map((n) => (n.id === 1 ? { ...n, role: 'Follower' } : n))
    );
    setIncident('LEADER STEPPED DOWN: Node 1 yielded leadership. Trigger election on majority partition (Node 3).');
  };

  // Elect Leader on Majority Partition (Node 3)
  const electMajorityLeader = (nodeId: number) => {
    soundEngine.playClick();
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          return { ...n, role: 'Leader', term: n.term + 1, heartbeatTimer: 100 };
        } else if (n.partition === 'B') {
          return { ...n, role: 'Follower', heartbeatTimer: 90 };
        }
        return n;
      })
    );
    setIncident(`CONSENSUS FORGED: Node ${nodeId} elected Leader on Majority Partition (Term 2)`);
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-amber-400 font-bold text-xs tracking-wider uppercase">
            Raft Consensus &amp; Distributed Quorum
          </h3>
          <p className="text-[11px] text-slate-400">
            Maintain consensus through network partitions and split-brain hazards. Target: 15 commits.
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

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">COMMITTED WAL LOGS</span>
          <span className="font-bold text-amber-300">
            {committedEntries} / {targetCommits}
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">QUORUM MAJORITY</span>
          <span className="font-bold text-emerald-400">3 of 5 Nodes</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">CLUSTER STATE</span>
          <span
            className={`font-bold ${
              isPartitioned ? 'text-rose-400' : 'text-slate-200'
            }`}
          >
            {isPartitioned ? 'PARTITIONED' : 'SYNCHRONIZED'}
          </span>
        </div>
      </div>

      {/* Incident Alert Bar */}
      <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 text-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-amber-200">{incident}</span>
        </div>
      </div>

      {/* 5 Cluster Nodes Topology */}
      <div className="space-y-1.5">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`p-2 rounded border flex items-center justify-between text-xs transition-colors ${
              node.role === 'Leader'
                ? 'bg-amber-950/40 border-amber-400/80 text-amber-200'
                : node.role === 'Candidate'
                ? 'bg-purple-950/40 border-purple-400/80 text-purple-200'
                : 'bg-slate-900/80 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold">
                N{node.id}
              </span>
              <div>
                <span className="font-bold block text-[11px]">
                  Node {node.id} ({node.role})
                </span>
                <span className="text-[9px] text-slate-400">
                  Partition {node.partition} · Term {node.term} · Log Index #{node.logIndex}
                </span>
              </div>
            </div>

            {/* Heartbeat Bar */}
            <div className="w-24 flex flex-col items-end gap-1">
              <span className="text-[9px] text-slate-400">
                HB: {node.heartbeatTimer}%
              </span>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${node.heartbeatTimer}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tactical Consensus Actions */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={proposeLogEntry}
          disabled={!isPlaying}
          className="p-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5"
        >
          PROPOSE WAL LOG ENTRY (COMMIT)
        </button>

        {isPartitioned && nodes.find((n) => n.id === 1)?.role === 'Leader' ? (
          <button
            onClick={stepDownMinorityLeader}
            className="p-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 animate-pulse"
          >
            STEP DOWN MINORITY LEADER (N1)
          </button>
        ) : (
          <button
            onClick={() => electMajorityLeader(3)}
            disabled={!isPlaying || !isPartitioned}
            className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5"
          >
            ELECT MAJORITY LEADER (N3)
          </button>
        )}
      </div>

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
            <Check className="w-4 h-4" /> RAFT QUORUM CERTIFIED (+450 XP)
          </>
        ) : isFailed ? (
          'RETRY CONSENSUS SIMULATION'
        ) : isPlaying ? (
          'CONSENSUS PROTOCOL ACTIVE...'
        ) : (
          <>
            <Play className="w-4 h-4" /> INITIATE RAFT PROTOCOL
          </>
        )}
      </button>
    </div>
  );
};
