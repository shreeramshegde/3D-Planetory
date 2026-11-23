import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitRingProps {
  radius: number;
  color?: string;
  dashed?: boolean;
}

export const OrbitRing = ({ radius, color = '#38bdf8', dashed = true }: OrbitRingProps) => {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      dashed={dashed}
      dashSize={1.2}
      gapSize={0.8}
      opacity={0.28}
      transparent
    />
  );
};
