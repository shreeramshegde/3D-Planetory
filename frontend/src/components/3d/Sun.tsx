import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, PointLight } from 'three';
import { Html } from '@react-three/drei';
import { useUniverseStore } from '../../store/useUniverseStore';
import { soundEngine } from '../../audio/soundEngine';

export const Sun = () => {
  const coreRef = useRef<Mesh>(null);
  const coronaRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.05;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y = -t * 0.03;
      coronaRef.current.rotation.z = t * 0.02;
      const pulse = 1 + Math.sin(t * 1.5) * 0.04;
      coronaRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic central point light casting light on all planets */}
      <pointLight
        ref={lightRef}
        intensity={350}
        distance={250}
        decay={1.8}
        color="#fffaed"
      />
      <ambientLight intensity={0.15} />

      {/* Main Core Mesh */}
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
        <sphereGeometry args={[4.2, 48, 48]} />
        <meshBasicMaterial color="#ffea75" />
      </mesh>

      {/* Pulsing Corona Atmosphere */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[4.8, 36, 36]} />
        <meshBasicMaterial
          color="#ff7b00"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Golden Corona Glow */}
      <mesh>
        <sphereGeometry args={[5.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff4800"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      {/* Holographic Label (only when in overview) */}
      {!activePlanetId && (
        <Html position={[0, 6.4, 0]} center distanceFactor={45} zIndexRange={[10, 0]}>
          <div
            onClick={() => setActivePlanet(null)}
            className="cursor-pointer group flex flex-col items-center pointer-events-auto"
          >
            <div className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/50 rounded text-[11px] font-mono tracking-widest text-amber-300 backdrop-blur uppercase shadow-lg shadow-amber-900/40 group-hover:border-amber-300 transition-colors">
              THE KERNEL // CORE
            </div>
            <div className="w-[1px] h-3 bg-amber-500/50" />
          </div>
        </Html>
      )}
    </group>
  );
};
