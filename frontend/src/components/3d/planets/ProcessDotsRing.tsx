import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DOT_COUNT = 32;

export const ProcessDotsRing = ({ starRadius }: { starRadius: number }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate initial thread process orbits around The Kernel
  const { positions, speeds, radii, phases, colors } = useMemo(() => {
    const pos = new Float32Array(DOT_COUNT * 3);
    const spd = new Float32Array(DOT_COUNT);
    const rad = new Float32Array(DOT_COUNT);
    const phs = new Float32Array(DOT_COUNT);
    const col = new Float32Array(DOT_COUNT * 3);

    const palette = [
      new THREE.Color('#FF5A36'), // Vermilion
      new THREE.Color('#F2C94C'), // Amber
      new THREE.Color('#E8E3D6'), // Warm bone
    ];

    for (let i = 0; i < DOT_COUNT; i++) {
      rad[i] = starRadius + 1.2 + (i % 4) * 0.45;
      spd[i] = 0.5 + (i % 5) * 0.25;
      phs[i] = (i / DOT_COUNT) * Math.PI * 2;

      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      pos[i * 3] = Math.cos(phs[i]) * rad[i];
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      pos[i * 3 + 2] = Math.sin(phs[i]) * rad[i];
    }

    return { positions: pos, speeds: spd, radii: rad, phases: phs, colors: col };
  }, [starRadius]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = phases[i] + t * speeds[i] * 0.8;
      const r = radii[i];
      positionAttr.setXYZ(
        i,
        Math.cos(angle) * r,
        Math.sin(angle * 2.0) * 0.3,
        Math.sin(angle) * r
      );
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
