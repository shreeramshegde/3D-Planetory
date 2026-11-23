import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GasGiantShader } from '../shaders/GasGiantShader';
import { PlanetConfig } from '../../../types/universe';

interface StratosProps {
  planet: PlanetConfig;
}

export const StratosMetaphor = ({ planet }: StratosProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#38BDF8') },
    uColorB: { value: new THREE.Color('#0369A1') },
    uColorC: { value: new THREE.Color('#082F49') },
    uAtmosphereRim: { value: new THREE.Color('#7DD3FC') },
  }), []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed * delta * 2.5;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y -= planet.rotationSpeed * delta * 1.2;
    }
  });

  return (
    <group>
      {/* Primary Gas Giant Body with Domain-Warped FBM Jet Stream */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[planet.size, 48, 48]} />
        <shaderMaterial
          ref={shaderMatRef}
          vertexShader={GasGiantShader.vertexShader}
          fragmentShader={GasGiantShader.fragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Counter-rotating wispy outer cloud deck */}
      <mesh ref={cloudRef} scale={1.03}>
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshStandardMaterial
          color="#BAE6FD"
          transparent
          opacity={0.18}
          roughness={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Delicate Planetary Rings */}
      {planet.hasRings && (
        <mesh rotation={[-Math.PI / 2.3, 0.2, 0]}>
          <ringGeometry
            args={[
              planet.ringInnerRadius || planet.size * 1.4,
              planet.ringOuterRadius || planet.size * 2.2,
              64,
            ]}
          />
          <meshBasicMaterial
            color="#38BDF8"
            side={THREE.DoubleSide}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
