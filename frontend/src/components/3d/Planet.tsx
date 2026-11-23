import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetConfig } from '../../types/universe';
import { useUniverseStore } from '../../store/useUniverseStore';
import { soundEngine } from '../../audio/soundEngine';
import { OrbitRing } from './OrbitRing';
import { CheckCircle2 } from 'lucide-react';

interface PlanetProps {
  planet: PlanetConfig;
}

export const Planet = ({ planet }: PlanetProps) => {
  const planetGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const moonsRef = useRef<THREE.Group>(null);

  const [isHovered, setIsHovered] = useState(false);

  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const orbitSpeedMultiplier = useUniverseStore((s) => s.orbitSpeedMultiplier);
  const isCompleted = useUniverseStore((s) => s.completedChallenges[planet.id]);

  const isCurrentFocus = activePlanetId === planet.id;

  // Track planet orbital angle
  const angleRef = useRef<number>(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    // 1. Orbital revolution around the sun
    // When focused on this planet, slow down orbital revolution so user can interact comfortably
    const speedFactor = isCurrentFocus ? 0.05 : 1.0;
    angleRef.current += planet.orbitSpeed * orbitSpeedMultiplier * speedFactor * delta * 0.4;

    const x = Math.cos(angleRef.current) * planet.orbitRadius;
    const z = Math.sin(angleRef.current) * planet.orbitRadius;

    if (planetGroupRef.current) {
      planetGroupRef.current.position.set(x, 0, z);
    }

    // 2. Axial rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed * (1 + delta);
    }

    // 3. Atmosphere gentle pulse
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= planet.rotationSpeed * 0.5 * delta;
    }

    // 4. Moons revolution
    if (moonsRef.current && planet.moons) {
      moonsRef.current.children.forEach((moonObj, i) => {
        const moonConfig = planet.moons![i];
        if (moonConfig) {
          moonObj.rotation.y += moonConfig.speed * delta;
        }
      });
    }
  });

  return (
    <>
      {/* Visual Orbit Guide Path around the Sun */}
      <OrbitRing radius={planet.orbitRadius} color={planet.color} dashed={!isCurrentFocus} />

      {/* Orbiting Planet Group */}
      <group ref={planetGroupRef}>
        {/* Main Body */}
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            setActivePlanet(planet.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setIsHovered(true);
            document.body.style.cursor = 'pointer';
            soundEngine.playHover();
          }}
          onPointerOut={() => {
            setIsHovered(false);
            document.body.style.cursor = 'default';
          }}
        >
          <sphereGeometry args={[planet.size, 40, 40]} />
          <meshStandardMaterial
            color={planet.color}
            roughness={0.4}
            metalness={0.3}
            emissive={planet.secondaryColor}
            emissiveIntensity={isHovered || isCurrentFocus ? 0.35 : 0.15}
          />
        </mesh>

        {/* Atmosphere Fresnel Glow Layer */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[planet.size * 1.15, 32, 32]} />
          <meshBasicMaterial
            color={planet.atmosphereColor}
            transparent
            opacity={isHovered || isCurrentFocus ? 0.3 : 0.15}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Planetary Rings (if present) */}
        {planet.hasRings && (
          <mesh rotation={[-Math.PI / 2.8, 0.2, 0]}>
            <ringGeometry
              args={[
                planet.ringInnerRadius || planet.size * 1.4,
                planet.ringOuterRadius || planet.size * 2.3,
                64,
              ]}
            />
            <meshStandardMaterial
              color={planet.ringColor || planet.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.65}
              roughness={0.5}
            />
          </mesh>
        )}

        {/* Moons Group */}
        {planet.moons && (
          <group ref={moonsRef}>
            {planet.moons.map((moon, idx) => (
              <group key={idx}>
                <mesh position={[moon.distance, 0, 0]}>
                  <sphereGeometry args={[moon.size, 16, 16]} />
                  <meshStandardMaterial color={moon.color} roughness={0.7} />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* Holographic Planet Tag / Reticle */}
        {(!activePlanetId || isCurrentFocus || isHovered) && (
          <Html
            position={[0, planet.size * 1.6, 0]}
            center
            distanceFactor={38}
            zIndexRange={[20, 0]}
          >
            <div
              onClick={() => setActivePlanet(planet.id)}
              className={`cursor-pointer transition-all duration-300 pointer-events-auto flex flex-col items-center group ${
                isCurrentFocus
                  ? 'scale-110'
                  : isHovered
                  ? 'scale-105'
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-mono tracking-wider backdrop-blur border shadow-lg transition-colors ${
                  isCurrentFocus
                    ? 'bg-slate-900/90 text-white border-cyan-400 shadow-cyan-500/30'
                    : 'bg-slate-950/80 text-slate-300 border-slate-700/80 group-hover:border-cyan-400/80 group-hover:text-cyan-300'
                }`}
              >
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                )}
                <span className="font-semibold uppercase">{planet.name}</span>
                <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-1.5 hidden sm:inline">
                  {planet.domain.split('&')[0]}
                </span>
              </div>
              <div
                className={`w-[1px] h-3 transition-colors ${
                  isCurrentFocus || isHovered ? 'bg-cyan-400' : 'bg-slate-600'
                }`}
              />
            </div>
          </Html>
        )}
      </group>
    </>
  );
};
