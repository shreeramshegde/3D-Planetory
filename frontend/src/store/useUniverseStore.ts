import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UniverseStore, TechnicalDomainId, CameraMode } from '../types/universe';
import { soundEngine } from '../audio/soundEngine';

const TOTAL_PLANETS = 5;

export const useUniverseStore = create<UniverseStore>()(
  persist(
    (set, get) => ({
      activePlanetId: null,
      cameraMode: 'overview',
      completedChallenges: {
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
      pilotCallsign: 'ARCHITECT-01',

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
          const completedCount = Object.values(newCompleted).filter(Boolean).length;
          const harmony = Math.round((completedCount / TOTAL_PLANETS) * 100);

          set({
            completedChallenges: newCompleted,
            systemHarmony: harmony,
            cameraMode: 'orbit', // return to orbit view
          });
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
            cloud: false,
            ai: false,
            backend: false,
            frontend: false,
            security: false,
          },
          systemHarmony: 0,
          orbitSpeedMultiplier: 1.0,
        });
      },

      setPilotCallsign: (callsign: string) => {
        set({ pilotCallsign: callsign });
      },
    }),
    {
      name: 'kepler-devcosmos-state',
      partialize: (state) => ({
        completedChallenges: state.completedChallenges,
        systemHarmony: state.systemHarmony,
        isAudioMuted: state.isAudioMuted,
        pilotCallsign: state.pilotCallsign,
      }),
    }
  )
);
