import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LavaCrustShader } from '../shaders/LavaCrustShader';
import { PlanetConfig } from '../../../types/universe';

const RAFT_NODE_COUNT = 5;

export const KronosMetaphor = ({ planet }: { planet: PlanetConfig }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const clusterGroupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uCrustColor: { value: new THREE.Color('#141014') },
    uMagmaCore: { value: new THREE.Color('#FF4500') },
    uMagmaHot: { value: new THREE.Color('#FFAA33') },
  }), []);

  // Raft 5-node cluster geometry orbiting Kronos Prime
  const { nodeOffsets, linePositions } = useMemo(() => {
    const offsets: THREE.Vector3[] = [];
    const orbitR = planet.size * 1.7;

    for (let i = 0; i < RAFT_NODE_COUNT; i++) {
      const angle = (i / RAFT_NODE_COUNT) * Math.PI * 2;
      offsets.push(
        new THREE.Vector3(
          Math.cos(angle) * orbitR,
          Math.sin(angle * 2.0) * 0.35,
          Math.sin(angle) * orbitR
        )
      );
    }

    // Connect fully (all-to-all heartbeat mesh)
    const lines: number[] = [];
    for (let i = 0; i < RAFT_NODE_COUNT; i++) {
      for (let j = i + 1; j < RAFT_NODE_COUNT; j++) {
        lines.push(offsets[i].x, offsets[i].y, offsets[i].z);
        lines.push(offsets[j].x, offsets[j].y, offsets[j].z);
      }
    }

    return { nodeOffsets: offsets, linePositions: new Float32Array(lines) };
  }, [planet.size]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed * delta * 2;
    }
    if (clusterGroupRef.current) {
      clusterGroupRef.current.rotation.y += 0.35 * delta;
    }
  });

  return (
    <group>
      {/* Central Tectonic Core with Procedural GLSL Lava Fissures */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[planet.size, 48, 48]} />
        <shaderMaterial
          ref={shaderMatRef}
          vertexShader={LavaCrustShader.vertexShader}
          fragmentShader={LavaCrustShader.fragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Orbiting 5-Node Raft Consensus Cluster */}
      <group ref={clusterGroupRef}>
        {/* Consensus Network Lines */}
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#FF5A36"
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>

        {/* 5 Raft Nodes */}
        {nodeOffsets.map((pos, idx) => {
          const isLeader = idx === 0;
          return (
            <group key={idx} position={pos}>
              <mesh>
                <sphereGeometry args={[isLeader ? 0.16 : 0.1, 16, 16]} />
                <meshBasicMaterial
                  color={isLeader ? '#FF5A36' : '#E8E3D6'}
                  transparent
                  opacity={0.9}
                />
              </mesh>
              {isLeader && (
                <mesh>
                  <sphereGeometry args={[0.26, 12, 12]} />
                  <meshBasicMaterial
                    color="#FF5A36"
                    transparent
                    opacity={0.25}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
};
