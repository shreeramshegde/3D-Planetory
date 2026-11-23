import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useUniverseStore } from '../../store/useUniverseStore';
import { soundEngine } from '../../audio/soundEngine';
import { SunShader } from './shaders/SunShader';
import { ProcessDotsRing } from './planets/ProcessDotsRing';
import { Check } from 'lucide-react';

export const Sun = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const isCompleted = useUniverseStore((s) => s.completedChallenges['kernel']);

  const isCurrentFocus = activePlanetId === 'kernel';

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorCore: { value: new THREE.Color('#FFF4DC') },
    uColorMid: { value: new THREE.Color('#FF5A36') }, // Vermilion transition
    uColorRim: { value: new THREE.Color('#7A1800') },
    uLimbCoeffs: { value: new THREE.Vector2(0.42, 0.38) },
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = t;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.04;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y = -t * 0.02;
      const pulse = 1 + Math.sin(t * 1.6) * 0.025;
      coronaRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Omni-directional solar light */}
      <pointLight
        intensity={280}
        distance={280}
        decay={1.8}
        color="#FFF6DE"
      />

      {/* Main Core Mesh with GLSL Limb-Darkened Convection Shader */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          setActivePlanet('kernel');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          soundEngine.playHover();
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[4.2, 64, 64]} />
        <shaderMaterial
          ref={shaderMaterialRef}
          vertexShader={SunShader.vertexShader}
          fragmentShader={SunShader.fragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Inner Coronal Halo */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[4.7, 36, 36]} />
        <meshBasicMaterial
          color="#FF5A36"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Domain Metaphor: Ring of scheduled CPU process-dots */}
      <ProcessDotsRing starRadius={4.2} />

      {/* Diegetic Surveyor Reticle Tag */}
      {(!activePlanetId || isCurrentFocus) && (
        <Html position={[0, 6.2, 0]} center distanceFactor={42} zIndexRange={[15, 0]}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setActivePlanet('kernel');
            }}
            className="cursor-pointer group flex flex-col items-center select-none"
          >
            <div
              className={`px-3 py-1 rounded-[2px] text-xs font-mono tracking-wider border flex items-center gap-2 transition-all ${
                isCurrentFocus
                  ? 'bg-[#0A0B0F] text-[#E8E3D6] border-[#FF5A36]'
                  : 'bg-[#0A0B0F]/90 text-[#E8E3D6]/85 border-bone/20 hover:border-bone/50'
              }`}
            >
              {isCompleted && (
                <Check className="w-3 h-3 text-[#FF5A36] flex-shrink-0" />
              )}
              <span className="font-serif text-sm text-[#E8E3D6]">The Kernel</span>
              <span className="text-[10px] text-[#FF5A36] font-mono tracking-wider pl-1">
                OBS-00
              </span>
            </div>
            <div
              className={`w-[1px] h-3 transition-colors ${
                isCurrentFocus ? 'bg-[#FF5A36]' : 'bg-bone/20'
              }`}
            />
          </div>
        </Html>
      )}
    </group>
  );
};
