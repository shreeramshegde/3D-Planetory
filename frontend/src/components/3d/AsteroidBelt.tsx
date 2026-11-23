import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AsteroidBelt = ({ count = 350 }: { count?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate randomized asteroid transforms between radius 30 and 33
  const asteroids = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 3.5;
      const y = (Math.random() - 0.5) * 1.8;
      const scale = 0.08 + Math.random() * 0.18;
      const speed = (0.04 + Math.random() * 0.03) * (Math.random() > 0.5 ? 1 : 0.9);
      data.push({ angle, distance, y, scale, speed });
    }
    return data;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    asteroids.forEach((ast, i) => {
      ast.angle += ast.speed * delta;
      const x = Math.cos(ast.angle) * ast.distance;
      const z = Math.sin(ast.angle) * ast.distance;

      dummy.position.set(x, ast.y, z);
      dummy.rotation.x += delta * 0.2;
      dummy.rotation.y += delta * 0.3;
      dummy.scale.set(ast.scale, ast.scale, ast.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#64748b"
        roughness={0.9}
        metalness={0.15}
      />
    </instancedMesh>
  );
};
