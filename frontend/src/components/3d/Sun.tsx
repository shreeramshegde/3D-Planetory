import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, PointLight } from 'three';
import { Html } from '@react-three/drei';
import { useUniverseStore } from '../../store/useUniverseStore';
import { soundEngine } from '../../audio/soundEngine';
import { createSunTexture } from '../../utils/proceduralTextures';

export const Sun = () => {
  const coreRef = useRef<Mesh>(null);
  const coronaRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);

  const sunTexture = useMemo(() => createSunTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.04;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y = -t * 0.02;
      coronaRef.current.rotation.z = t * 0.015;
      const pulse = 1 + Math.sin(t * 1.8) * 0.035;
      coronaRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Omni-directional solar light */}
      <pointLight
        ref={lightRef}
        intensity={400}
        distance={300}
        decay={1.8}
        color="#fffaf0"
      />
      <ambientLight intensity={0.18} />

      {/* Main Core Mesh with Procedural Convection Surface */}
      <mesh
        ref={coreRef}
        onClick={(e) => {
          e.stopPropagation();
          setActivePlanet(null);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          soundEngine.playHover();
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[4.4, 48, 48]} />
        <meshBasicMaterial map={sunTexture} />
      </mesh>

      {/* Inner Coronal Atmosphere */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[4.9, 36, 36]} />
        <meshBasicMaterial
          color="#ff7a00"
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Solar Flare Halo */}
      <mesh>
        <sphereGeometry args={[5.9, 32, 32]} />
        <meshBasicMaterial
          color="#ff3b00"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      {/* Clean, Non-AI Human-Crafted Center Tag */}
      {!activePlanetId && (
        <Html position={[0, 6.6, 0]} center distanceFactor={45} zIndexRange={[10, 0]}>
          <div
            onClick={() => setActivePlanet(null)}
            className="cursor-pointer group flex flex-col items-center select-none"
          >
            <div className="px-3 py-1 bg-amber-950/80 border border-amber-500/40 rounded text-xs font-mono tracking-wider text-amber-200 backdrop-blur shadow-lg shadow-amber-950/50 group-hover:border-amber-400 transition-colors">
              The Kernel <span className="text-amber-400/70 text-[10px] ml-1">Central Star</span>
            </div>
            <div className="w-[1px] h-3.5 bg-amber-500/40" />
          </div>
        </Html>
      )}
    </group>
  );
};
