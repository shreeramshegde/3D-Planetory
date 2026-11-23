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
  const isTransitioningRef = useRef<boolean>(false);
  const transitionProgressRef = useRef<number>(1);

  const startCamPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const endCamPos = useRef(new THREE.Vector3());
  const endTarget = useRef(new THREE.Vector3());

  // Default solar system viewpoint
  const systemViewTarget = new THREE.Vector3(0, 0, 0);
  const systemViewPosition = new THREE.Vector3(0, 50, 75);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    startCamPos.current.copy(controls.object.position);
    startTarget.current.copy(controls.target);

    if (activePlanetId) {
      const planet = PLANETS.find((p) => p.id === activePlanetId);
      if (planet) {
        // Set target to planet's orbit distance
        endTarget.current.set(planet.orbitRadius, 0, 0);
        const viewDist = planet.size * 3.8;
        endCamPos.current.set(
          planet.orbitRadius + viewDist * 0.7,
          viewDist * 0.5,
          viewDist * 0.9
        );
      }
    } else {
      endTarget.current.copy(systemViewTarget);
      endCamPos.current.copy(systemViewPosition);
    }

    isTransitioningRef.current = true;
    transitionProgressRef.current = 0;
  }, [activePlanetId]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    // Smooth transition between planetary target and solar view
    if (isTransitioningRef.current) {
      transitionProgressRef.current += delta * 2.2;
      const t = Math.min(1, transitionProgressRef.current);
      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - t, 3);

      controls.object.position.lerpVectors(startCamPos.current, endCamPos.current, ease);
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
      zoomSpeed={1.1}
      panSpeed={0.8}
      minDistance={4}
      maxDistance={280}
      // Full 360-degree rotation freedom: allow viewing from poles, below, around (like a 3D car model)
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI - 0.05}
      autoRotate={!activePlanetId && !isTransitioningRef.current}
      autoRotateSpeed={0.3}
    />
  );
};
