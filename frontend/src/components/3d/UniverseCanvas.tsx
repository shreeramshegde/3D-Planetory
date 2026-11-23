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
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const UniverseCanvas = () => {
  const [dpr, setDpr] = useState(1.5);
  const [isContextLost, setIsContextLost] = useState(false);

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      {isContextLost ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#0A0B0F] text-[#E8E3D6] font-mono">
          <div className="max-w-md w-full border border-bone-hairline p-6 space-y-4 text-center">
            <div className="flex items-center justify-center text-vermilion">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-serif text-bone">WebGL Context Interrupted</h2>
            <p className="text-xs text-bone-muted leading-relaxed">
              The graphics hardware context was temporarily suspended by the operating system or browser memory manager.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-vermilion text-ink font-semibold text-xs inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore Viewport</span>
            </button>
          </div>
        </div>
      ) : (
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 140, 260], fov: 45, near: 0.1, far: 1600 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setIsContextLost(true);
            });
            gl.domElement.addEventListener('webglcontextrestored', () => {
              setIsContextLost(false);
            });
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
      )}
    </div>
  );
};
