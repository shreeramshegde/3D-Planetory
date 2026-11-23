import { useState } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { ArrowUp, ArrowDown, Check, Terminal, Play, RotateCcw } from 'lucide-react';

interface Stage {
  id: string;
  label: string;
  command: string;
  correctIndex: number;
}

const INITIAL_STAGES: Stage[] = [
  { id: 'scan', label: 'Security Vulnerability Scan', command: 'trivy image --severity HIGH,CRITICAL', correctIndex: 3 },
  { id: 'lint', label: 'Static Analysis & Linting', command: 'biome check ./src && eslint --max-warnings=0', correctIndex: 0 },
  { id: 'deploy', label: 'Canary Kubernetes Rollout', command: 'kubectl set image deployment/app app=v2.4.0', correctIndex: 4 },
  { id: 'build', label: 'Multi-Arch Container Build', command: 'docker buildx build --platform linux/amd64 -t app:v2.4.0 .', correctIndex: 2 },
  { id: 'test', label: 'Automated Unit & E2E Tests', command: 'vitest run && playwright test', correctIndex: 1 },
];

export const PipelineOrchestrator = () => {
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const [logs, setLogs] = useState<string[]>([
    'SYSTEM ALERT: CI/CD Pipeline broken by solar flare.',
    'Status: Dependency graph corrupted.',
    'Instruction: Re-order stages to restore valid zero-downtime deployment flow.'
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.cloud);

  const moveStage = (index: number, direction: 'up' | 'down') => {
    soundEngine.playClick();
    const newStages = [...stages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStages.length) return;

    const temp = newStages[index];
    newStages[index] = newStages[targetIndex];
    newStages[targetIndex] = temp;
    setStages(newStages);
  };

  const handleVerify = () => {
    soundEngine.playClick();
    setIsVerifying(true);
    setLogs((prev) => [...prev, '> Initiating automated pipeline dry-run...']);

    setTimeout(() => {
      let isAllCorrect = true;
      const newLogs: string[] = [];

      stages.forEach((st, idx) => {
        if (st.correctIndex === idx) {
          newLogs.push(`✔ [Stage ${idx + 1}] ${st.label}: PASSED`);
        } else {
          isAllCorrect = false;
          newLogs.push(`✖ [Stage ${idx + 1}] ${st.label}: SEQUENCE ERROR (Dependency missing)`);
        }
      });

      if (isAllCorrect) {
        newLogs.push('🎉 DEPLOYMENT SUCCESSFUL: Stratos-9 cluster restored to 100% uptime!');
        setIsSuccess(true);
        completeChallenge('cloud');
      } else {
        newLogs.push('💥 PIPELINE FAILED: Verify standard lifecycle (Lint -> Test -> Build -> Scan -> Deploy).');
      }

      setLogs((prev) => [...prev, ...newLogs]);
      setIsVerifying(false);
    }, 800);
  };

  const handleReset = () => {
    soundEngine.playClick();
    setStages(INITIAL_STAGES);
    setIsSuccess(false);
    setLogs(['Pipeline sequence reset to corrupted state.']);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div>
          <h3 className="text-cyan-400 font-mono font-bold text-sm tracking-wide">
            CHALLENGE: PIPELINE ORCHESTRATOR
          </h3>
          <p className="text-xs text-slate-400">
            Arrange deployment stages from earliest prerequisite to final release.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Reset sequence"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Stage Order List */}
      <div className="space-y-2">
        {stages.map((stage, idx) => (
          <div
            key={stage.id}
            className="flex items-center justify-between p-2.5 rounded bg-slate-900/90 border border-slate-700/70 hover:border-cyan-400/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-[10px] font-mono text-cyan-300">
                {idx + 1}
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-200">{stage.label}</p>
                <p className="text-[11px] font-mono text-cyan-400/70">{stage.command}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                disabled={idx === 0 || isSuccess}
                onClick={() => moveStage(idx, 'up')}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={idx === stages.length - 1 || isSuccess}
                onClick={() => moveStage(idx, 'down')}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Output */}
      <div className="flex-1 bg-black/70 rounded border border-slate-800 p-2.5 font-mono text-[11px] overflow-y-auto max-h-36">
        <div className="flex items-center gap-1.5 text-cyan-500/80 mb-1 pb-1 border-b border-slate-800/80">
          <Terminal className="w-3 h-3" />
          <span>RUNNER TELEMETRY // STAGE CONSOLE</span>
        </div>
        {logs.map((log, i) => (
          <div
            key={i}
            className={`${
              log.includes('PASSED') || log.includes('SUCCESSFUL')
                ? 'text-emerald-400'
                : log.includes('ERROR') || log.includes('FAILED')
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {log}
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        disabled={isVerifying || isSuccess || isCompleted}
        onClick={handleVerify}
        className={`w-full py-2.5 rounded font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all ${
          isSuccess || isCompleted
            ? 'bg-emerald-600/90 text-white cursor-default shadow-emerald-500/20'
            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30 active:scale-98'
        }`}
      >
        {isSuccess || isCompleted ? (
          <>
            <Check className="w-4 h-4" /> PIPELINE CALIBRATED (+250 XP)
          </>
        ) : isVerifying ? (
          'VALIDATING BUILD GRAPH...'
        ) : (
          <>
            <Play className="w-4 h-4" /> TEST & EXECUTE PIPELINE
          </>
        )}
      </button>
    </div>
  );
};
