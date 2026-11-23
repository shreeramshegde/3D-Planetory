import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetConfig } from '../../../types/universe';

const NODE_COUNT = 36;
const CONNECTION_MAX = 54;

export const SynthetixMetaphor = ({ planet }: { planet: PlanetConfig }) => {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pulsePointsRef = useRef<THREE.Points>(null);

  // Generate 3D neural lattice nodes and synapses
  const { nodePositions, linePositions, pulseStarts, pulseEnds, pulseSpeeds } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const r = planet.size * 1.35;

    // Fibonacci sphere distribution for uniform neural node placement
    const phi = Math.PI * (Math.sqrt(5) - 1);
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      // Slight radial jitter
      const jitterR = r * (0.92 + Math.random() * 0.16);
      nodes.push(new THREE.Vector3(x * jitterR, y * jitterR, z * jitterR));
    }

    // Connect nearest neighbours to form neural lattice filaments
    const lineCoords: number[] = [];
    const pStarts: THREE.Vector3[] = [];
    const pEnds: THREE.Vector3[] = [];
    const pSpds: number[] = [];

    let connections = 0;
    for (let i = 0; i < NODE_COUNT && connections < CONNECTION_MAX; i++) {
      for (let j = i + 1; j < NODE_COUNT && connections < CONNECTION_MAX; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < planet.size * 1.1) {
          lineCoords.push(nodes[i].x, nodes[i].y, nodes[i].z);
          lineCoords.push(nodes[j].x, nodes[j].y, nodes[j].z);
          pStarts.push(nodes[i]);
          pEnds.push(nodes[j]);
          pSpds.push(0.4 + Math.random() * 0.8);
          connections++;
        }
      }
    }

    return {
      nodePositions: nodes,
      linePositions: new Float32Array(lineCoords),
      pulseStarts: pStarts,
      pulseEnds: pEnds,
      pulseSpeeds: pSpds,
    };
  }, [planet.size]);

  // Pulse particles for synaptic action potentials
  const pulsePosBuffer = useMemo(() => new Float32Array(pulseStarts.length * 3), [pulseStarts.length]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y += planet.rotationSpeed * delta * 1.5;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
    }

    if (pulsePointsRef.current) {
      const posAttr = pulsePointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pulseStarts.length; i++) {
        const progress = (t * pulseSpeeds[i]) % 1.0;
        const cur = new THREE.Vector3().lerpVectors(pulseStarts[i], pulseEnds[i], progress);
        posAttr.setXYZ(i, cur.x, cur.y, cur.z);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dark Synaptic Core */}
      <mesh>
        <sphereGeometry args={[planet.size * 0.88, 32, 32]} />
        <meshStandardMaterial
          color="#1E1035"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Latent Synaptic Filaments (Neural Lattice Edges) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#A855F7"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Neural Nodes */}
      <group>
        {nodePositions.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial
              color="#C084FC"
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Synaptic Action Potential Pulses */}
      <points ref={pulsePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePosBuffer, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#F3E8FF"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
