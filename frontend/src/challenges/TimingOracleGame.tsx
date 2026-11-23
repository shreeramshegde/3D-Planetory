import { useState } from 'react';
import { useSimulationLoop } from '../engine/useSimulationLoop';
import { timingOracleSim } from '../engine/simulations/timingOracleSim';
import { useUniverseStore } from '../store/useUniverseStore';
import { Lock, RotateCcw, Send, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const CHAR_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3'];

export const TimingOracleGame = () => {
  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const [hasReportedWin, setHasReportedWin] = useState(false);
  const [probeInput, setProbeInput] = useState('A000');

  const {
    state,
    seed,
    score,
    elapsedTime,
    inputLog,
    sendInput,
    reset,
  } = useSimulationLoop(timingOracleSim, 88);

  if (state.isWon && !hasReportedWin) {
    setHasReportedWin(true);
    completeChallenge('security');
    fetch('/api/v1/challenges/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilot_callsign: 'ARCHIVIST-01',
        domain_id: 'security',
        challenge_id: 'timing-oracle',
        seed,
        input_log: inputLog,
        claimed_score: score,
        duration_seconds: elapsedTime,
      }),
    }).catch(() => {});
  }

  const handleSubmitProbe = () => {
    if (probeInput.trim()) {
      sendInput({ type: 'SUBMIT_PROBE', probe: probeInput.trim() });
    }
  };

  const handleSetChar = (index: number, char: string) => {
    sendInput({ type: 'SET_RECOVERED_CHAR', index, char });
  };

  const handleApplyPatch = () => {
    sendInput({ type: 'APPLY_CONSTANT_TIME_PATCH' });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0A0B0F] text-[#E8E3D6] font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-bone-hairline text-xs">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-vermilion" />
          <span className="font-semibold text-bone">TIMING SIDE-CHANNEL ATTACK</span>
          <span className="text-bone-faint">// COMPARATOR ORACLE</span>
        </div>
        <div className="flex items-center gap-4 tabular-nums">
          <span>QUERIES: {state.queryCount} / {state.maxQueries}</span>
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

      {/* Terminal Overlays */}
      {state.isFailed && (
        <div className="p-3 my-1 bg-red-950/60 border border-red-500/50 text-red-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>EXCEEDED QUERY QUOTA</span>
          </div>
          <p className="text-[11px] text-red-300">
            Intrusion detection flagged unusual latency probe frequencies. Analyze the statistical histogram carefully before guessing.
          </p>
          <button
            onClick={() => {
              setHasReportedWin(false);
              reset();
            }}
            className="px-3 py-1 bg-vermilion text-ink font-semibold text-xs mt-1"
          >
            Restart Probe
          </button>
        </div>
      )}

      {state.isWon && (
        <div className="p-3 my-1 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>SECRET RECOVERED &amp; SIDE CHANNEL PATCHED</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            Extracted key '{state.secret}' via latency anomalies and verified constant-time comparison closing the vulnerability. Score: {score}
          </p>
        </div>
      )}

      {/* Key Recovery Visualizer & Byte Slots */}
      <div className="my-2 p-3 bg-[#0E1017] border border-bone-hairline">
        <span className="text-[10px] text-bone-faint uppercase block mb-1.5">Recovered Cryptographic Key:</span>
        <div className="flex items-center gap-3">
          {[0, 1, 2, 3].map((idx) => {
            const char = state.recoveredKey[idx] || '_';
            const isMatch = char === state.secret[idx];

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-12 h-12 border flex items-center justify-center text-lg font-bold ${
                    isMatch
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300'
                      : char !== '_'
                      ? 'border-vermilion bg-vermilion/10 text-vermilion'
                      : 'border-bone/20 bg-[#0A0B0F] text-bone'
                  }`}
                >
                  {char}
                </div>
                <select
                  value={char === '_' ? '' : char}
                  onChange={(e) => handleSetChar(idx, e.target.value)}
                  className="bg-[#0A0B0F] text-bone text-[10px] border border-bone/20 p-0.5"
                >
                  <option value="">?</option>
                  {CHAR_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Latency Histogram / Recent Probes */}
      <div className="flex-1 bg-[#06080D] border border-bone-hairline p-2 my-1 overflow-y-auto max-h-32 text-[11px]">
        <div className="flex justify-between text-bone-faint text-[10px] pb-1 border-b border-bone/10 mb-1">
          <span>QUERY</span>
          <span>LATENCY SAMPLES (MS)</span>
        </div>
        <div className="space-y-1">
          {state.recentProbes.map((p, i) => (
            <div key={i} className="flex items-center justify-between tabular-nums">
              <span className="font-bold text-bone">{p.query}</span>
              <div className="flex items-center gap-2">
                <div className="w-28 bg-bone/10 h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${p.matchedChars > 1 ? 'bg-vermilion' : 'bg-bone/40'}`}
                    style={{ width: `${Math.min(100, (p.latencyMs / 90) * 100)}%` }}
                  />
                </div>
                <span className={p.matchedChars > 1 ? 'text-vermilion font-bold' : 'text-bone-muted'}>
                  {p.latencyMs.toFixed(1)}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attack Console & Constant-Time Patch */}
      <div className="border-t border-bone-hairline pt-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <input
            type="text"
            maxLength={4}
            value={probeInput}
            onChange={(e) => setProbeInput(e.target.value.toUpperCase())}
            placeholder="PROBE (e.g. A000)"
            className="w-24 px-2 py-1 bg-[#0E1017] border border-bone/20 text-bone text-xs font-bold text-center uppercase"
          />
          <button
            onClick={handleSubmitProbe}
            className="px-2.5 py-1 bg-vermilion text-ink font-semibold text-[11px] flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span>Probe</span>
          </button>
        </div>

        <button
          onClick={handleApplyPatch}
          disabled={state.isPatched}
          className={`px-3 py-1 border text-[11px] flex items-center gap-1.5 ${
            state.isPatched
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
              : 'border-bone/20 hover:border-emerald-400 text-bone'
          }`}
        >
          <Shield className="w-3 h-3" />
          <span>{state.isPatched ? 'Constant-Time Patch [ACTIVE]' : 'Apply Constant-Time Patch'}</span>
        </button>
      </div>
    </div>
  );
};
