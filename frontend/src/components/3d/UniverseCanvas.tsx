import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { PerformanceMonitor } from '@react-three/drei';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { AsteroidBelt } from './AsteroidBelt';
import { Starfield } from './Starfield';
import { CameraController } from './CameraController';
import { ConstellationLines } from './ConstellationLines';
import { PLANETS } from '../../data/planets';

export const UniverseCanvas = () => {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 140, 260], fov: 45, near: 0.1, far: 1600 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(1.5)}
          onDecline={() => setDpr(1.0)}
        />

        <color attach="background" args={['#0A0B0F']} />

        {/* 360-degree Cinematic Camera Controller with Intro & Arc Trajectories */}
        <CameraController />

        {/* Deep Space Background Starfield */}
        <Starfield />

        {/* Subtle celestial directional fill light */}
        <directionalLight position={[30, 45, 20]} intensity={0.2} color="#E8E3D6" />

        {/* Central Star: The Kernel (OBS-00) */}
        <Sun />

        {/* Dynamic Star Atlas Constellation Lines */}
        <ConstellationLines />

        {/* All Technical Domain Worlds */}
        {PLANETS.map((planet) => (
          <Planet key={planet.id} planet={planet} />
        ))}

        {/* Asteroid Belt */}
        <AsteroidBelt count={280} />

        {/* Post-Processing Effects: Bloom strictly restricted to emissive thresholds */}
        <EffectComposer multisampling={2}>
          <Bloom
            intensity={0.65}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.25}
            mipmapBlur
          />
          <ToneMapping />
          <Vignette eskil={false} offset={0.15} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
