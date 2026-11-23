import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetConfig } from '../../../types/universe';

export const CitadelMetaphor = ({ planet }: { planet: PlanetConfig }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerLatticeRef = useRef<THREE.Mesh>(null);
  const innerLatticeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y += planet.rotationSpeed * delta;
    }
    if (outerLatticeRef.current) {
      outerLatticeRef.current.rotation.y += 0.28 * delta;
      outerLatticeRef.current.rotation.z = Math.sin(t * 0.4) * 0.12;
    }
    if (innerLatticeRef.current) {
      innerLatticeRef.current.rotation.y -= 0.42 * delta;
      innerLatticeRef.current.rotation.x = Math.cos(t * 0.3) * 0.15;
    }
  });

  return (
    <group>
      {/* Dark Obsidian Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[planet.size * 0.78, 36, 36]} />
        <meshStandardMaterial
          color="#080B10"
          roughness={0.9}
          metalness={0.4}
        />
      </mesh>

      {/* Inner Geodesic Cryptographic Shield */}
      <mesh ref={innerLatticeRef}>
        <icosahedronGeometry args={[planet.size * 0.98, 2]} />
        <meshStandardMaterial
          color="#10B981"
          wireframe
          transparent
          opacity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Rotating Lattice Barrier */}
      <mesh ref={outerLatticeRef}>
        <icosahedronGeometry args={[planet.size * 1.22, 1]} />
        <meshStandardMaterial
          color="#34D399"
          wireframe
          transparent
          opacity={0.42}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Outer Defense Boundary Reticle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.size * 1.35, planet.size * 1.38, 48]} />
        <meshBasicMaterial
          color="#10B981"
          side={THREE.DoubleSide}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
};
