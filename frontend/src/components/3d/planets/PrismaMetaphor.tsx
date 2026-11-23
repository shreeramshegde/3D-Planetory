import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { PlanetConfig } from '../../../types/universe';

export const PrismaMetaphor = ({ planet }: { planet: PlanetConfig }) => {
  const crystalOuterRef = useRef<THREE.Mesh>(null);
  const crystalInnerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (crystalOuterRef.current) {
      crystalOuterRef.current.rotation.y += planet.rotationSpeed * delta * 2.2;
      crystalOuterRef.current.rotation.x += planet.rotationSpeed * delta * 1.1;
    }
    if (crystalInnerRef.current) {
      crystalInnerRef.current.rotation.y -= planet.rotationSpeed * delta * 1.8;
      crystalInnerRef.current.rotation.z += planet.rotationSpeed * delta * 1.4;
    }
  });

  return (
    <group>
      {/* Inner Luminescent Geometric Prism Core */}
      <mesh ref={crystalInnerRef}>
        <octahedronGeometry args={[planet.size * 0.55, 0]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Faceted Refractive Crystal with Drei Transmission */}
      <mesh ref={crystalOuterRef}>
        <icosahedronGeometry args={[planet.size, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          resolution={256}
          transmission={0.94}
          roughness={0.08}
          thickness={1.4}
          ior={1.52}
          chromaticAberration={0.08}
          anisotropy={0.1}
          distortion={0.15}
          distortionScale={0.2}
          color="#E0F2FE"
        />
      </mesh>

      {/* Delicate Crystal Vertex Halo */}
      <mesh scale={1.08}>
        <icosahedronGeometry args={[planet.size, 1]} />
        <meshBasicMaterial
          color="#38BDF8"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
};
