import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetConfig, MoonConfig } from '../../types/universe';
import { useUniverseStore } from '../../store/useUniverseStore';
import { soundEngine } from '../../audio/soundEngine';
import { OrbitRing } from './OrbitRing';
import { Check } from 'lucide-react';
import { StratosMetaphor } from './planets/StratosMetaphor';
import { SynthetixMetaphor } from './planets/SynthetixMetaphor';
import { KronosMetaphor } from './planets/KronosMetaphor';
import { PrismaMetaphor } from './planets/PrismaMetaphor';
import { CitadelMetaphor } from './planets/CitadelMetaphor';

interface PlanetProps {
  planet: PlanetConfig;
}

export const Planet = ({ planet }: PlanetProps) => {
  // The central star (The Kernel) is rendered by Sun.tsx at origin [0, 0, 0]
  if (planet.id === 'kernel') {
    return null;
  }

  const planetGroupRef = useRef<THREE.Group>(null);
  const moonsRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const orbitSpeedMultiplier = useUniverseStore((s) => s.orbitSpeedMultiplier);
  const isCompleted = useUniverseStore((s) => s.completedChallenges[planet.id]);

  const isCurrentFocus = activePlanetId === planet.id;

  // Initial orbital angle
  const angleRef = useRef<number>((planet.orbitRadius * 1.618) % (Math.PI * 2));

  useFrame((_, delta) => {
    // 1. Orbital revolution with orbital inclination
    const speedFactor = isCurrentFocus ? 0.05 : 1.0;
    angleRef.current += planet.orbitSpeed * orbitSpeedMultiplier * speedFactor * delta * 0.35;

    const x = Math.cos(angleRef.current) * planet.orbitRadius;
    const z = Math.sin(angleRef.current) * planet.orbitRadius;
    const y = Math.sin(angleRef.current) * planet.orbitRadius * planet.inclination;

    if (planetGroupRef.current) {
      planetGroupRef.current.position.set(x, y, z);
    }

    // 2. Moons rotation
    if (moonsRef.current && planet.moons) {
      moonsRef.current.children.forEach((moonObj, i) => {
        const moonConfig = planet.moons![i];
        if (moonConfig) {
          moonObj.rotation.y += moonConfig.speed * delta;
        }
      });
    }
  });

  const renderDomainMetaphor = () => {
    switch (planet.id) {
      case 'cloud':
        return <StratosMetaphor planet={planet} />;
      case 'ai':
        return <SynthetixMetaphor planet={planet} />;
      case 'backend':
        return <KronosMetaphor planet={planet} />;
      case 'frontend':
        return <PrismaMetaphor planet={planet} />;
      case 'security':
        return <CitadelMetaphor planet={planet} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* 3D Orbit Guide Path */}
      <OrbitRing
        radius={planet.orbitRadius}
        color={planet.color}
        dashed={!isCurrentFocus}
      />

      {/* Orbiting Planet Group with Axial Tilt */}
      <group
        ref={planetGroupRef}
        rotation={[planet.inclination, 0, planet.axialTilt]}
      >
        {/* Domain-specific GLSL and Procedural 3D Metaphor */}
        <group
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
          {renderDomainMetaphor()}
        </group>

        {/* Orbiting Moons */}
        {planet.moons && (
          <group ref={moonsRef}>
            {planet.moons.map((moon: MoonConfig, idx: number) => (
              <group key={idx}>
                <mesh position={[moon.distance, 0, 0]}>
                  <sphereGeometry args={[moon.size, 16, 16]} />
                  <meshStandardMaterial
                    color={moon.color}
                    roughness={0.8}
                    metalness={0.1}
                  />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* Observatory Surveyor Reticle Tag */}
        {(!activePlanetId || isCurrentFocus || isHovered) && (
          <Html
            position={[0, planet.size * 1.5 + 0.6, 0]}
            center
            distanceFactor={38}
            zIndexRange={[20, 0]}
          >
            <div
              onClick={() => setActivePlanet(planet.id)}
              className={`cursor-pointer transition-all duration-200 pointer-events-auto flex flex-col items-center select-none ${
                isCurrentFocus
                  ? 'scale-105'
                  : isHovered
                  ? 'scale-105'
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              <div
                className={`px-3 py-1 rounded-[2px] text-xs font-mono tracking-wider border flex items-center gap-2 transition-all ${
                  isCurrentFocus
                    ? 'bg-[#0A0B0F] text-[#E8E3D6] border-[#FF5A36]'
                    : 'bg-[#0A0B0F]/90 text-[#E8E3D6]/80 border-bone/15 hover:border-bone/40'
                }`}
              >
                {isCompleted && (
                  <Check className="w-3 h-3 text-[#FF5A36] flex-shrink-0" />
                )}
                <span className="font-serif text-sm text-[#E8E3D6] tracking-normal">{planet.name}</span>
                <span className="text-[10px] font-mono text-[#E8E3D6]/50 border-l border-bone/15 pl-2 tracking-wider">
                  {planet.catalogId}
                </span>
              </div>
              <div
                className={`w-[1px] h-3 transition-colors ${
                  isCurrentFocus || isHovered ? 'bg-[#FF5A36]' : 'bg-bone/20'
                }`}
              />
            </div>
          </Html>
        )}
      </group>
    </>
  );
};
