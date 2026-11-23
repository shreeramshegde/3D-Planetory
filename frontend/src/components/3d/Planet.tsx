import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ExtendedPlanetConfig } from '../../data/planets';
import { useUniverseStore } from '../../store/useUniverseStore';
import { soundEngine } from '../../audio/soundEngine';
import { OrbitRing } from './OrbitRing';
import { Check } from 'lucide-react';
import {
  createGasGiantTexture,
  createNeuralTexture,
  createLavaCrustTexture,
  createCrystallineTexture,
  createHexShieldTexture,
} from '../../utils/proceduralTextures';

interface PlanetProps {
  planet: ExtendedPlanetConfig;
}

export const Planet = ({ planet }: PlanetProps) => {
  const planetGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudMeshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const moonsRef = useRef<THREE.Group>(null);

  const [isHovered, setIsHovered] = useState(false);

  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const orbitSpeedMultiplier = useUniverseStore((s) => s.orbitSpeedMultiplier);
  const isCompleted = useUniverseStore((s) => s.completedChallenges[planet.id]);

  const isCurrentFocus = activePlanetId === planet.id;

  // Generate unique domain procedural texture
  const surfaceTexture = useMemo(() => {
    switch (planet.id) {
      case 'cloud':
        return createGasGiantTexture(planet.color, planet.secondaryColor);
      case 'ai':
        return createNeuralTexture();
      case 'backend':
        return createLavaCrustTexture();
      case 'frontend':
        return createCrystallineTexture();
      case 'security':
        return createHexShieldTexture();
      default:
        return null;
    }
  }, [planet.id, planet.color, planet.secondaryColor]);

  // Initial randomized orbital angle
  const angleRef = useRef<number>(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    // 1. Orbital revolution with orbital inclination
    const speedFactor = isCurrentFocus ? 0.05 : 1.0;
    angleRef.current += planet.orbitSpeed * orbitSpeedMultiplier * speedFactor * delta * 0.35;

    const x = Math.cos(angleRef.current) * planet.orbitRadius;
    const z = Math.sin(angleRef.current) * planet.orbitRadius;
    // 3D orbital inclination gives true height depth
    const y = Math.sin(angleRef.current) * planet.orbitRadius * planet.inclination;

    if (planetGroupRef.current) {
      planetGroupRef.current.position.set(x, y, z);
    }

    // 2. Axial rotation with axial tilt
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed * (1 + delta);
    }

    // 3. Counter-rotating atmospheric cloud layer
    if (cloudMeshRef.current) {
      cloudMeshRef.current.rotation.y -= planet.rotationSpeed * 0.7 * delta;
    }

    // 4. Atmosphere glow
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= planet.rotationSpeed * 0.3 * delta;
    }

    // 5. Moons rotation
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
        {/* Main Planet Body with High-Detail Procedural Texture */}
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
          <sphereGeometry args={[planet.size, 64, 64]} />
          <meshStandardMaterial
            map={surfaceTexture}
            roughness={0.55}
            metalness={0.25}
            emissive={planet.secondaryColor}
            emissiveIntensity={isHovered || isCurrentFocus ? 0.35 : 0.12}
          />
        </mesh>

        {/* Counter-rotating cloud shell for atmospheric depth */}
        <mesh ref={cloudMeshRef}>
          <sphereGeometry args={[planet.size * 1.025, 48, 48]} />
          <meshStandardMaterial
            color={planet.atmosphereColor}
            transparent
            opacity={0.16}
            roughness={0.8}
            depthWrite={false}
          />
        </mesh>

        {/* Outer Fresnel Atmosphere Shell */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[planet.size * 1.14, 32, 32]} />
          <meshBasicMaterial
            color={planet.atmosphereColor}
            transparent
            opacity={isHovered || isCurrentFocus ? 0.28 : 0.14}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Planetary Rings */}
        {planet.hasRings && (
          <mesh rotation={[-Math.PI / 2.6, 0.15, 0]}>
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
              opacity={0.6}
              roughness={0.5}
            />
          </mesh>
        )}

        {/* Orbiting Moons */}
        {planet.moons && (
          <group ref={moonsRef}>
            {planet.moons.map((moon, idx) => (
              <group key={idx}>
                <mesh position={[moon.distance, 0, 0]}>
                  <sphereGeometry args={[moon.size, 20, 20]} />
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

        {/* Clean, Non-AI Human-Crafted Reticle Tag */}
        {(!activePlanetId || isCurrentFocus || isHovered) && (
          <Html
            position={[0, planet.size * 1.6, 0]}
            center
            distanceFactor={38}
            zIndexRange={[20, 0]}
          >
            <div
              onClick={() => setActivePlanet(planet.id)}
              className={`cursor-pointer transition-all duration-300 pointer-events-auto flex flex-col items-center select-none ${
                isCurrentFocus
                  ? 'scale-105'
                  : isHovered
                  ? 'scale-105'
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              <div
                className={`px-3 py-1 rounded text-xs font-mono tracking-wider backdrop-blur border shadow-lg flex items-center gap-2 transition-colors ${
                  isCurrentFocus
                    ? 'bg-slate-900/95 text-white border-cyan-400 shadow-cyan-500/25'
                    : 'bg-slate-950/85 text-slate-300 border-slate-700/80 hover:border-cyan-400/80'
                }`}
              >
                {isCompleted && (
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                )}
                <span className="font-semibold text-slate-100">{planet.name}</span>
                <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2">
                  {planet.domain.split('&')[0].trim()}
                </span>
              </div>
              <div
                className={`w-[1px] h-3.5 transition-colors ${
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
