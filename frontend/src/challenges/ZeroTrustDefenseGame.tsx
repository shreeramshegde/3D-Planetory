import { useState, useEffect } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { soundEngine } from '../audio/soundEngine';
import { ShieldCheck, ShieldAlert, Timer, Play, RotateCcw } from 'lucide-react';

export const ZeroTrustDefenseGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tier, setTier] = useState<1 | 2 | 3>(1);
  const [intrusionProgress, setIntrusionProgress] = useState(0); // 0 to 100%

  // Tier 1: 4 Rotating Hex Cipher Rings
  const [ring1, setRing1] = useState(0); // target: 90
  const [ring2, setRing2] = useState(0); // target: 180
  const [ring3, setRing3] = useState(0); // target: 270
  const [ring4, setRing4] = useState(0); // target: 90

  // Tier 2: HMAC Packet Inspection
  const [inspectedCount, setInspectedCount] = useState(0);
  const [currentPacket, setCurrentPacket] = useState<{ id: number; hmac: string; isValid: boolean } | null>(null);

  // Tier 3: Diffie-Hellman Prime Selection
  const [, setSelectedPrime] = useState<number | null>(null);

  const [isWon, setIsWon] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const completeChallenge = useUniverseStore((s) => s.completeChallenge);
  const isCompleted = useUniverseStore((s) => s.completedChallenges.security);

  const resetGame = () => {
    soundEngine.playClick();
    setTier(1);
    setIntrusionProgress(0);
    setRing1(0);
    setRing2(0);
    setRing3(0);
    setRing4(0);
    setInspectedCount(0);
    setCurrentPacket(null);
    setSelectedPrime(null);
    setIsWon(false);
    setIsFailed(false);
    setIsPlaying(false);
  };

  const startGame = () => {
    soundEngine.playClick();
    resetGame();
    setIsPlaying(true);
    generateNextPacket();
  };

  const generateNextPacket = () => {
    const isValid = Math.random() > 0.45;
    setCurrentPacket({
      id: Math.floor(Math.random() * 9000) + 1000,
      hmac: isValid ? 'VALID_HMAC_SHA256' : 'TAMPERED_CHECKSUM_ERROR',
      isValid,
    });
  };

  // Intrusion progress timer
  useEffect(() => {
    if (!isPlaying || isWon || isFailed) return;

    const timer = setInterval(() => {
      setIntrusionProgress((prev) => {
        const next = prev + 2.5;
        if (next >= 100) {
          setIsFailed(true);
          setIsPlaying(false);
          return 100;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isWon, isFailed]);

  // Tier 1 Check
  useEffect(() => {
    if (tier === 1 && ring1 === 90 && ring2 === 180 && ring3 === 270 && ring4 === 90) {
      soundEngine.playSuccess();
      setTier(2);
      setIntrusionProgress((p) => Math.max(0, p - 30)); // Reward time
      generateNextPacket();
    }
  }, [tier, ring1, ring2, ring3, ring4]);

  // Tier 2 Handler
  const handlePacketVerdict = (accept: boolean) => {
    if (!currentPacket) return;
    soundEngine.playClick();

    const isCorrect = accept === currentPacket.isValid;
    if (isCorrect) {
      const nextCount = inspectedCount + 1;
      setInspectedCount(nextCount);
      if (nextCount >= 5) {
        soundEngine.playSuccess();
        setTier(3);
        setIntrusionProgress((p) => Math.max(0, p - 30));
      } else {
        generateNextPacket();
      }
    } else {
      // Penalty for wrong verdict
      setIntrusionProgress((p) => Math.min(100, p + 25));
      generateNextPacket();
    }
  };

  // Tier 3 Handler
  const handleSelectPrime = (prime: number, isCoprime: boolean) => {
    soundEngine.playClick();
    setSelectedPrime(prime);
    if (isCoprime) {
      setIsWon(true);
      setIsPlaying(false);
      completeChallenge('security');
    } else {
      setIntrusionProgress((p) => Math.min(100, p + 35));
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-emerald-400 font-bold text-xs tracking-wider uppercase">
            Zero-Trust Defense: 3-Tier Handshake
          </h3>
          <p className="text-[11px] text-slate-400">
            Authenticate keys, inspect HMAC signatures, and derive Diffie-Hellman secret.
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
          <span className="text-[10px] text-slate-400 block">DEFENSE TIER</span>
          <span className="font-bold text-emerald-300">Tier {tier} of 3</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">INTRUSION RISK</span>
          <span
            className={`font-bold ${
              intrusionProgress > 75
                ? 'text-rose-400 animate-pulse'
                : intrusionProgress > 45
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {Math.round(intrusionProgress)}%
          </span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded">
          <span className="text-[10px] text-slate-400 block">TIME BUDGET</span>
          <span className="font-bold text-slate-200 flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            {Math.max(0, Math.round((100 - intrusionProgress) * 0.4))}s
          </span>
        </div>
      </div>

      {/* Tier 1: 4 Concentric Cipher Rings */}
      {tier === 1 && (
        <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-300 font-semibold flex justify-between">
            <span>TIER 1: ASYMMETRIC KEY ALIGNMENT</span>
            <span className="text-emerald-400">TARGET [90°-180°-270°-90°]</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-xs text-center">
            <button
              onClick={() => {
                soundEngine.playClick();
                setRing1((r) => (r + 90) % 360);
              }}
              className="p-2 rounded bg-slate-900 border border-slate-700 hover:border-emerald-400"
            >
              <span className="text-[9px] text-slate-400 block">RING 1</span>
              <span className="font-bold text-emerald-400">{ring1}°</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setRing2((r) => (r + 90) % 360);
              }}
              className="p-2 rounded bg-slate-900 border border-slate-700 hover:border-emerald-400"
            >
              <span className="text-[9px] text-slate-400 block">RING 2</span>
              <span className="font-bold text-emerald-400">{ring2}°</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setRing3((r) => (r + 90) % 360);
              }}
              className="p-2 rounded bg-slate-900 border border-slate-700 hover:border-emerald-400"
            >
              <span className="text-[9px] text-slate-400 block">RING 3</span>
              <span className="font-bold text-emerald-400">{ring3}°</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setRing4((r) => (r + 90) % 360);
              }}
              className="p-2 rounded bg-slate-900 border border-slate-700 hover:border-emerald-400"
            >
              <span className="text-[9px] text-slate-400 block">RING 4</span>
              <span className="font-bold text-emerald-400">{ring4}°</span>
            </button>
          </div>
        </div>
      )}

      {/* Tier 2: Live HMAC Packet Verification */}
      {tier === 2 && currentPacket && (
        <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-300 font-semibold flex justify-between">
            <span>TIER 2: REAL-TIME HMAC SHA-256 VERIFICATION</span>
            <span className="text-emerald-400">{inspectedCount} / 5 PACKETS</span>
          </div>

          <div className="p-2.5 rounded bg-slate-900 border border-slate-700 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">PACKET PAYLOAD #{currentPacket.id}</span>
              <span className="text-cyan-300 font-mono">TLS 1.3 mTLS</span>
            </div>
            <div className="text-[11px] font-mono text-slate-200">
              HASH: {currentPacket.hmac}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handlePacketVerdict(true)}
              className="py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              ACCEPT VALID PACKET
            </button>
            <button
              onClick={() => handlePacketVerdict(false)}
              className="py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              DROP TAMPERED PACKET
            </button>
          </div>
        </div>
      )}

      {/* Tier 3: Diffie-Hellman Key Derivation */}
      {tier === 3 && (
        <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-300 font-semibold flex justify-between">
            <span>TIER 3: DIFFIE-HELLMAN KEY DERIVATION</span>
            <span className="text-emerald-400">K = g^(ab) mod p</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Select the cryptographically secure coprime prime modulus to complete handshake:
          </p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleSelectPrime(997, true)}
              className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-bold"
            >
              p = 997 (Coprime Safe)
            </button>
            <button
              onClick={() => handleSelectPrime(1024, false)}
              className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400"
            >
              p = 1024 (Non-Prime)
            </button>
            <button
              onClick={() => handleSelectPrime(512, false)}
              className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400"
            >
              p = 512 (Weak Modulus)
            </button>
          </div>
        </div>
      )}

      {/* Failure Box */}
      {isFailed && (
        <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded text-center text-xs text-rose-300">
          <ShieldAlert className="w-5 h-5 mx-auto mb-1 text-rose-400" />
          <p className="font-bold">PERIMETER BREACHED: INTRUSION AT 100%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Cryptographic handshake timed out. Click Retry to re-authenticate.
          </p>
        </div>
      )}

      {/* Trigger Button */}
      <button
        disabled={isPlaying || isWon || isCompleted}
        onClick={startGame}
        className={`w-full py-2.5 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
          isWon || isCompleted
            ? 'bg-emerald-600/80 text-white cursor-default'
            : isPlaying
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
        }`}
      >
        {isWon || isCompleted ? (
          <>
            <ShieldCheck className="w-4 h-4" /> ZERO-TRUST HANDSHAKE VERIFIED (+400 XP)
          </>
        ) : isFailed ? (
          'RETRY DEFENSE HANDSHAKE'
        ) : isPlaying ? (
          'AUTHENTICATING HANDSHAKE...'
        ) : (
          <>
            <Play className="w-4 h-4" /> START ZERO-TRUST HANDSHAKE
          </>
        )}
      </button>
    </div>
  );
};
