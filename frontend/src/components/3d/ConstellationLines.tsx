import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/useUniverseStore';
import { PLANETS } from '../../data/planets';
import { TechnicalDomainId } from '../../types/universe';

const DOMAIN_ORDER: TechnicalDomainId[] = [
  'kernel',
  'cloud',
  'ai',
  'backend',
  'frontend',
  'security',
];

export const ConstellationLines = () => {
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);
  const orbitSpeedMultiplier = useUniverseStore((s) => s.orbitSpeedMultiplier);

  // Initial angles matching Planet.tsx
  const anglesRef = useRef<Record<string, number>>({
    kernel: 0,
    cloud: (20 * 1.618) % (Math.PI * 2),
    ai: (30 * 1.618) % (Math.PI * 2),
    backend: (42 * 1.618) % (Math.PI * 2),
    frontend: (54 * 1.618) % (Math.PI * 2),
    security: (68 * 1.618) % (Math.PI * 2),
  });

  useFrame((_, delta) => {
    // Update planetary orbital angles
    for (const p of PLANETS) {
      if (p.id !== 'kernel') {
        anglesRef.current[p.id] = (anglesRef.current[p.id] || 0) + p.orbitSpeed * orbitSpeedMultiplier * delta * 0.35;
      }
    }

    if (!lineSegmentsRef.current) return;

    // Filter plotted celestial bodies in order
    const plottedBodies = DOMAIN_ORDER.filter((id) => completedChallenges[id]);
    if (plottedBodies.length < 2) {
      // Hide line
      lineSegmentsRef.current.visible = false;
      return;
    }

    lineSegmentsRef.current.visible = true;

    // Compute active 3D positions
    const positions: THREE.Vector3[] = plottedBodies.map((id) => {
      const p = PLANETS.find((x) => x.id === id)!;
      if (id === 'kernel') {
        return new THREE.Vector3(0, 0, 0);
      }
      const angle = anglesRef.current[id] || 0;
      const x = Math.cos(angle) * p.orbitRadius;
      const z = Math.sin(angle) * p.orbitRadius;
      const y = Math.sin(angle) * p.orbitRadius * p.inclination;
      return new THREE.Vector3(x, y, z);
    });

    // Build line segments between successive completed planets
    const coords: number[] = [];
    for (let i = 0; i < positions.length - 1; i++) {
      coords.push(positions[i].x, positions[i].y, positions[i].z);
      coords.push(positions[i + 1].x, positions[i + 1].y, positions[i + 1].z);
    }

    // If all 6 plotted, close the constellation loop back to origin
    if (plottedBodies.length === 6) {
      coords.push(positions[positions.length - 1].x, positions[positions.length - 1].y, positions[positions.length - 1].z);
      coords.push(positions[0].x, positions[0].y, positions[0].z);
    }

    const posAttr = new THREE.Float32BufferAttribute(coords, 3);
    lineSegmentsRef.current.geometry.setAttribute('position', posAttr);
    lineSegmentsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineSegmentsRef}>
      <bufferGeometry />
      <lineBasicMaterial
        color="#FF5A36"
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};
