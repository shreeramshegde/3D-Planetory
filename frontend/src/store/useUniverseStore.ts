import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UniverseStore, TechnicalDomainId, CameraMode } from '../types/universe';
import { soundEngine } from '../audio/soundEngine';

const TOTAL_BODIES = 6;

let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  syncChannel = new BroadcastChannel('kepler-cosmos-sync');
}

export const useUniverseStore = create<UniverseStore>()(
  persist(
    (set, get) => {
      if (typeof window !== 'undefined') {
        if (syncChannel) {
          syncChannel.onmessage = (event) => {
            if (event.data?.type === 'CHALLENGE_COMPLETED') {
              const domainId = event.data.domainId as TechnicalDomainId;
              const current = get().completedChallenges;
              if (!current[domainId]) {
                soundEngine.playSuccess();
                const newCompleted = { ...current, [domainId]: true };
                const count = Object.values(newCompleted).filter(Boolean).length;
                const harmony = Math.round((count / TOTAL_BODIES) * 100);
                set({
                  completedChallenges: newCompleted,
                  plottedCount: count,
                  systemHarmony: harmony,
                });
              }
            } else if (event.data?.type === 'RESET_UNIVERSE') {
              set({
                completedChallenges: {
                  kernel: false,
                  cloud: false,
                  ai: false,
                  backend: false,
                  frontend: false,
                  security: false,
                },
                plottedCount: 0,
                systemHarmony: 0,
              });
            }
          };
        }

        window.addEventListener('storage', (e) => {
          if (e.key === 'kepler-devcosmos-state' && e.newValue) {
            try {
              const parsed = JSON.parse(e.newValue);
              if (parsed?.state?.completedChallenges) {
                const count = Object.values(parsed.state.completedChallenges).filter(Boolean).length;
                set({
                  completedChallenges: parsed.state.completedChallenges,
                  plottedCount: count,
                  systemHarmony: Math.round((count / TOTAL_BODIES) * 100),
                });
              }
            } catch {
              // Ignore parse error
            }
          }
        });
      }

      return {
        activePlanetId: null,
        cameraMode: 'overview',
        completedChallenges: {
          kernel: false,
          cloud: false,
          ai: false,
          backend: false,
          frontend: false,
          security: false,
        },
        orbitSpeedMultiplier: 1.0,
        isAudioMuted: false,
        isControlsLocked: false,
        systemHarmony: 0,
        plottedCount: 0,
        pilotCallsign: 'ARCHIVIST-01',

        setActivePlanet: (id: TechnicalDomainId | null) => {
          if (id) {
            soundEngine.playWarp();
            set({
              activePlanetId: id,
              cameraMode: 'orbit',
            });
          } else {
            soundEngine.playClick();
            set({
              activePlanetId: null,
              cameraMode: 'overview',
            });
          }
        },

        setCameraMode: (mode: CameraMode) => {
          soundEngine.playClick();
          set({ cameraMode: mode });
        },

        completeChallenge: (id: TechnicalDomainId) => {
          const currentCompleted = get().completedChallenges;
          if (!currentCompleted[id]) {
            soundEngine.playSuccess();
            const newCompleted = { ...currentCompleted, [id]: true };
            const count = Object.values(newCompleted).filter(Boolean).length;
            const harmony = Math.round((count / TOTAL_BODIES) * 100);

            set({
              completedChallenges: newCompleted,
              plottedCount: count,
              systemHarmony: harmony,
            });

            if (syncChannel) {
              syncChannel.postMessage({
                type: 'CHALLENGE_COMPLETED',
                domainId: id,
                plottedCount: count,
                systemHarmony: harmony,
              });
            }
          }
        },

        setOrbitSpeedMultiplier: (speed: number) => {
          set({ orbitSpeedMultiplier: speed });
        },

        toggleAudio: () => {
          const newMuted = !get().isAudioMuted;
          soundEngine.setMuted(newMuted);
          if (!newMuted) {
            soundEngine.startAmbient();
            soundEngine.playClick();
          }
          set({ isAudioMuted: newMuted });
        },

        resetUniverse: () => {
          soundEngine.playClick();
          set({
            activePlanetId: null,
            cameraMode: 'overview',
            completedChallenges: {
              kernel: false,
              cloud: false,
              ai: false,
              backend: false,
              frontend: false,
              security: false,
            },
            plottedCount: 0,
            systemHarmony: 0,
            orbitSpeedMultiplier: 1.0,
          });

          if (syncChannel) {
            syncChannel.postMessage({ type: 'RESET_UNIVERSE' });
          }
        },

        setPilotCallsign: (callsign: string) => {
          set({ pilotCallsign: callsign });
        },
      };
    },
    {
      name: 'kepler-devcosmos-state',
      partialize: (state) => ({
        completedChallenges: state.completedChallenges,
        plottedCount: state.plottedCount,
        systemHarmony: state.systemHarmony,
        isAudioMuted: state.isAudioMuted,
        pilotCallsign: state.pilotCallsign,
      }),
    }
  )
);
