import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/useUniverseStore';
import { PLANETS } from '../../data/planets';

export const CameraController = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const cameraMode = useUniverseStore((s) => s.cameraMode);

  // Default Macro Solar System viewpoint
  const defaultTarget = useRef(new THREE.Vector3(0, 0, 0));
  const defaultPosition = useRef(new THREE.Vector3(0, 65, 85));

  // Current target positions for smooth interpolation
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentCamPos = useRef(new THREE.Vector3(0, 65, 85));

  // Handle resets or planet switching
  useEffect(() => {
    if (!activePlanetId) {
      currentTarget.current.copy(defaultTarget.current);
      currentCamPos.current.copy(defaultPosition.current);
    }
  }, [activePlanetId]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (activePlanetId) {
      // Find active planet
      const planet = PLANETS.find((p) => p.id === activePlanetId);
      if (planet) {
        // Find planet's actual position in scene or compute based on angle
        // We can inspect the scene for planet's group position or lerp to close orbit
        const distance = planet.size * 3.4;
        const targetPos = new THREE.Vector3(
          planet.orbitRadius,
          0,
          0
        );

        // Calculate smooth target tracking
        currentTarget.current.lerp(targetPos, 4.0 * delta);

        // Adjust camera offset relative to target
        const offset = cameraMode === 'challenge'
          ? new THREE.Vector3(0, distance * 0.8, distance * 1.5)
          : new THREE.Vector3(distance * 0.7, distance * 0.9, distance * 1.8);

        const desiredCamPos = currentTarget.current.clone().add(offset);
        camera.position.lerp(desiredCamPos, 3.5 * delta);
        controls.target.lerp(currentTarget.current, 4.0 * delta);
      }
    } else {
      // Macro System View
      camera.position.lerp(defaultPosition.current, 2.5 * delta);
      controls.target.lerp(defaultTarget.current, 3.0 * delta);
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxDistance={220}
      minDistance={6}
      maxPolarAngle={Math.PI / 2 + 0.05} // don't go too far below orbital plane
      autoRotate={!activePlanetId}
      autoRotateSpeed={0.25}
    />
  );
};
