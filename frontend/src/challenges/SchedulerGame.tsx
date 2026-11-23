import { useState } from 'react';
import { useSimulationLoop } from '../engine/useSimulationLoop';
import { schedulerSim, SchedulingPolicy } from '../engine/simulations/schedulerSim';
import { useUniverseStore } from '../store/useUniverseStore';
import { Cpu, RotateCcw, AlertTriangle, CheckCircle, ShieldAlert, Play, Pause } from 'lucide-react';

export const SchedulerGame = () => {
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
  } = useSimulationLoop(schedulerSim, 42);

  // Trigger store completion once won
  if (state.isWon && !hasReportedWin) {
    setHasReportedWin(true);
    completeChallenge('kernel');
    // Non-blocking telemetry reporting to backend
    fetch('/api/v1/challenges/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilot_callsign: 'ARCHIVIST-01',
        domain_id: 'kernel',
        challenge_id: 'scheduler',
        seed,
        input_log: inputLog,
        claimed_score: score,
        duration_seconds: elapsedTime,
      }),
    }).catch(() => {});
  }

  const handlePolicyChange = (policy: SchedulingPolicy) => {
    sendInput({ type: 'SET_POLICY', policy });
  };

  const handleBoost = (processId: number) => {
    sendInput({ type: 'BOOST_PRIORITY', processId });
  };

  const handleAssignCore = (processId: number, coreId: number) => {
    sendInput({ type: 'ASSIGN_CORE', processId, coreId });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0A0B0F] text-[#E8E3D6] font-mono select-none">
      {/* Header Telemetry */}
      <div className="flex items-center justify-between pb-3 border-b border-bone-hairline text-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-vermilion" />
          <span className="font-semibold text-bone">CPU ARBITRATION BENCHMARK</span>
          <span className="text-bone-faint">// 4-CORE PREEMPTIVE SCHEDULER</span>
        </div>
        <div className="flex items-center gap-3 tabular-nums">
          <span>TIME: {elapsedTime.toFixed(1)}s</span>
          <span className="text-vermilion">SCORE: {score}</span>
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={state.isFailed || state.isWon}
            className={`p-1 transition-colors ${
              isRunning ? 'text-vermilion hover:text-white' : 'text-bone hover:text-vermilion'
            } disabled:opacity-30`}
            title={isRunning ? 'Pause scheduler' : 'Resume scheduler'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setHasReportedWin(false);
              reset();
            }}
            className="p-1 hover:text-vermilion transition-colors"
            title="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Policy Selector */}
      <div className="py-2 flex items-center gap-2 text-xs">
        <span className="text-bone-faint text-[10px] uppercase">Policy:</span>
        {(['ROUND_ROBIN', 'PRIORITY', 'SJF'] as SchedulingPolicy[]).map((p) => (
          <button
            key={p}
            onClick={() => handlePolicyChange(p)}
            className={`px-2.5 py-1 text-[11px] border transition-colors ${
              state.policy === p
                ? 'bg-vermilion text-ink border-vermilion font-bold'
                : 'bg-[#0A0B0F] border-bone/15 text-bone-muted hover:border-bone/40'
            }`}
          >
            {p.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Starvation Warning Banner */}
      {state.starvedCount > 0 && !state.isFailed && (
        <div className="my-1 px-3 py-1.5 bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>STARVATION ALERT: {state.starvedCount} process(es) waiting &gt;12s! Switch to Round-Robin or boost priority.</span>
        </div>
      )}

      {/* Fail / Victory Overlays */}
      {state.isFailed && (
        <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-red-400">
            <ShieldAlert className="w-4 h-4" />
            <span>THREAD STARVATION TIMEOUT</span>
          </div>
          <p className="text-[11px] text-red-300">
            3 or more processes were starved of CPU execution cycles. Unfair scheduling caused priority inversion.
          </p>
          <button
            onClick={() => {
              setHasReportedWin(false);
              reset();
            }}
            className="px-3 py-1 bg-vermilion text-ink font-semibold text-xs mt-1"
          >
            Retry Benchmark
          </button>
        </div>
      )}

      {state.isWon && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>PREEMPTIVE ARBITRATION VERIFIED</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            Dispatched {state.doneCount} threads across 4 execution cores without starvation lockups. Score: {score}
          </p>
        </div>
      )}

      {/* Main Execution Grid: 4 Cores */}
      <div className="grid grid-cols-4 gap-2 my-2">
        {state.cores.map((core) => {
          const activeProcess = state.readyQueue.find((p) => p.assignedCore === core.id && p.status === 'RUNNING');
          const percent = activeProcess ? ((activeProcess.totalBurst - activeProcess.burstRemaining) / activeProcess.totalBurst) * 100 : 0;

          return (
            <div key={core.id} className="p-2 border border-bone-hairline bg-[#0E1017] flex flex-col justify-between h-28 text-[11px]">
              <div className="flex items-center justify-between text-bone-faint border-b border-bone/10 pb-1">
                <span>CORE_{core.id}</span>
                <span className="text-[10px] tabular-nums">{(core.busyTime).toFixed(1)}s busy</span>
              </div>
              <div className="my-auto text-center">
                {activeProcess ? (
                  <div className="space-y-1">
                    <span className="font-bold text-bone block">{activeProcess.name}</span>
                    <span className="text-[10px] text-vermilion block">PRI-{activeProcess.priority}</span>
                    <div className="w-full bg-bone/10 h-1.5 rounded-none overflow-hidden">
                      <div className="bg-vermilion h-full transition-all" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                ) : (
                  <span className="text-bone-faint text-[10px] italic">IDLE</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Process Ready Queue */}
      <div className="flex-1 flex flex-col justify-between border-t border-bone-hairline pt-2">
        <div className="flex items-center justify-between text-[11px] text-bone-muted mb-1.5">
          <span>READY QUEUE ({state.readyQueue.length} processes)</span>
          <span className="text-bone-faint tabular-nums">COMPLETED: {state.doneCount} / {state.targetCount}</span>
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-40 pr-1">
          {state.readyQueue.slice(0, 6).map((p) => {
            const isStarved = p.status === 'STARVED';
            return (
              <div
                key={p.id}
                className={`p-1.5 border flex items-center justify-between text-[11px] ${
                  isStarved ? 'border-amber-500 bg-amber-950/40 text-amber-200' : 'border-bone/10 bg-[#0E1017] text-bone'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">{p.name}</span>
                  <span className="text-[10px] px-1 bg-bone/10 text-bone-faint">PRI-{p.priority}</span>
                  <span className="text-[10px] text-bone-faint tabular-nums">{p.burstRemaining.toFixed(1)}s burst</span>
                  {p.waitTime > 3 && (
                    <span className={`text-[10px] tabular-nums ${isStarved ? 'text-amber-400 font-bold' : 'text-bone-faint'}`}>
                      wait: {p.waitTime.toFixed(1)}s
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {p.priority > 1 && (
                    <button
                      onClick={() => handleBoost(p.id)}
                      className="px-1.5 py-0.5 text-[9px] border border-bone/20 hover:border-vermilion text-bone-muted hover:text-bone"
                    >
                      Boost
                    </button>
                  )}
                  {state.cores.filter((c) => c.activeProcessId === null).map((idleCore) => (
                    <button
                      key={idleCore.id}
                      onClick={() => handleAssignCore(p.id, idleCore.id)}
                      className="px-1.5 py-0.5 text-[9px] bg-vermilion/20 hover:bg-vermilion text-bone hover:text-ink transition-colors"
                    >
                      Core {idleCore.id}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
