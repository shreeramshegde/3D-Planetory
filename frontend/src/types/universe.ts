export type TechnicalDomainId = 'cloud' | 'ai' | 'backend' | 'frontend' | 'security';

export interface MoonConfig {
  name: string;
  size: number;
  distance: number;
  speed: number;
  color: string;
}

export interface ChallengeConfig {
  id: string;
  title: string;
  instruction: string;
  difficulty: 'Novice' | 'Advanced' | 'Expert';
  rewardXP: number;
  objective: string;
}

export interface PlanetConfig {
  id: TechnicalDomainId;
  name: string;
  domain: string;
  color: string;
  secondaryColor: string;
  atmosphereColor: string;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  size: number;
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringColor?: string;
  moons?: MoonConfig[];
  tagline: string;
  description: string;
  keyPillars: { title: string; desc: string }[];
  techStack: string[];
  challenge: ChallengeConfig;
}

export type CameraMode = 'overview' | 'orbit' | 'challenge';

export interface UniverseStore {
  activePlanetId: TechnicalDomainId | null;
  cameraMode: CameraMode;
  completedChallenges: Record<TechnicalDomainId, boolean>;
  orbitSpeedMultiplier: number;
  isAudioMuted: boolean;
  isControlsLocked: boolean;
  systemHarmony: number; // 0 - 100
  pilotCallsign: string;

  // Actions
  setActivePlanet: (id: TechnicalDomainId | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  completeChallenge: (id: TechnicalDomainId) => void;
  setOrbitSpeedMultiplier: (speed: number) => void;
  toggleAudio: () => void;
  resetUniverse: () => void;
  setPilotCallsign: (callsign: string) => void;
}
