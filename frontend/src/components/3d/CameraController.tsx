import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/useUniverseStore';
import { PLANETS } from '../../data/planets';

export const CameraController = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const isIntroActive = useUniverseStore((s) => s.isIntroActive);
  const skipIntro = useUniverseStore((s) => s.skipIntro);
  const isDiving = useUniverseStore((s) => s.isDiving);

  const introElapsedRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);
  const transitionProgressRef = useRef<number>(1);

  const startCamPos = useRef(new THREE.Vector3(0, 140, 260));
  const startTarget = useRef(new THREE.Vector3(0, 0, 0));
  const endCamPos = useRef(new THREE.Vector3(0, 50, 75));
  const endTarget = useRef(new THREE.Vector3(0, 0, 0));

  const systemViewTarget = new THREE.Vector3(0, 0, 0);
  const systemViewPosition = new THREE.Vector3(0, 50, 75);

  // Keyboard shortcut: Escape to skip intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isIntroActive) {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIntroActive, skipIntro]);

  // Planet target transitions
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls || isIntroActive) return;

    startCamPos.current.copy(controls.object.position);
    startTarget.current.copy(controls.target);

    if (activePlanetId) {
      const planet = PLANETS.find((p) => p.id === activePlanetId);
      if (planet) {
        endTarget.current.set(planet.orbitRadius, 0, 0);
        const viewDist = planet.size * 3.6;
        endCamPos.current.set(
          planet.orbitRadius + viewDist * 0.75,
          viewDist * 0.55,
          viewDist * 0.95
        );
      }
    } else {
      endTarget.current.copy(systemViewTarget);
      endCamPos.current.copy(systemViewPosition);
    }

    isTransitioningRef.current = true;
    transitionProgressRef.current = 0;
  }, [activePlanetId, isIntroActive]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    // 1. Cinematic 6s Intro camera push-in from deep space
    if (isIntroActive) {
      introElapsedRef.current += delta;
      const t = Math.min(1, introElapsedRef.current / 6.0);
      // Smooth cubic-bezier(0.2, 0.8, 0.2, 1) approximation
      const ease = 1 - Math.pow(1 - t, 3.5);

      const introStart = new THREE.Vector3(0, 140, 260);
      const introEnd = new THREE.Vector3(0, 50, 75);

      controls.object.position.lerpVectors(introStart, introEnd, ease);
      controls.target.set(0, 0, 0);

      if (t >= 1) {
        skipIntro();
      }
      controls.update();
      return;
    }

    // 2. Game Dive Cinematic: camera plunges toward planet atmosphere
    if (isDiving && activePlanetId) {
      const planet = PLANETS.find((p) => p.id === activePlanetId);
      const diveTarget = new THREE.Vector3(planet?.orbitRadius || 0, 0, 0);
      controls.target.lerp(diveTarget, delta * 3.0);
      controls.object.position.lerp(diveTarget, delta * 2.8);
      controls.update();
      return;
    }

    // 3. Curved Arc Planet Focus Transition
    if (isTransitioningRef.current) {
      transitionProgressRef.current += delta * 1.6;
      const t = Math.min(1, transitionProgressRef.current);
      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - t, 3);

      const linearPos = new THREE.Vector3().lerpVectors(startCamPos.current, endCamPos.current, ease);
      // Elevated curved arc flight path
      const arcElevation = Math.sin(t * Math.PI) * 9.0;
      controls.object.position.copy(linearPos).add(new THREE.Vector3(0, arcElevation, 0));
      controls.target.lerpVectors(startTarget.current, endTarget.current, ease);

      if (t >= 1) {
        isTransitioningRef.current = false;
      }
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.8}
      minDistance={4}
      maxDistance={320}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI - 0.05}
      autoRotate={!activePlanetId && !isTransitioningRef.current && !isIntroActive && !isDiving}
      autoRotateSpeed={0.25}
    />
  );
};
