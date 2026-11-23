export type TechnicalDomainId = 'kernel' | 'cloud' | 'ai' | 'backend' | 'frontend' | 'security';

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
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  rewardXP: number;
  objective: string;
}

export interface PlanetConfig {
  id: TechnicalDomainId;
  name: string;
  catalogId: string; // e.g. "OBS-00", "OBS-01"
  domain: string;
  color: string;
  secondaryColor: string;
  atmosphereColor: string;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  size: number;
  axialTilt: number;
  inclination: number;
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
  systemHarmony: number; // 0 to 100 percentage
  plottedCount: number; // 0 to 6 plotted bodies
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
