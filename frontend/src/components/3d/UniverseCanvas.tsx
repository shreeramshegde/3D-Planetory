import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { AsteroidBelt } from './AsteroidBelt';
import { Starfield } from './Starfield';
import { CameraController } from './CameraController';
import { PLANETS } from '../../data/planets';

export const UniverseCanvas = () => {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 65, 85], fov: 45, near: 0.1, far: 1200 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
      >
        <color attach="background" args={['#030712']} />

        {/* Camera and Navigation Controller */}
        <CameraController />

        {/* Cosmic Background */}
        <Starfield />

        {/* Central Star: The Kernel */}
        <Sun />

        {/* All Technical Domain Planets */}
        {PLANETS.map((planet) => (
          <Planet key={planet.id} planet={planet} />
        ))}

        {/* Kuiper / Asteroid Belt */}
        <AsteroidBelt count={320} />

        {/* Post-Processing Effects for AAA Glow & Atmosphere */}
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={1.1}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.7}
            mipmapBlur
          />
          <ToneMapping />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
