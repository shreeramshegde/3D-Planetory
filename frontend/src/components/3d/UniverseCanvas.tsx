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
        camera={{ position: [0, 50, 75], fov: 45, near: 0.1, far: 1400 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
      >
        <color attach="background" args={['#040711']} />

        {/* 360-degree Free Orbit Camera Controller */}
        <CameraController />

        {/* Deep Space Background */}
        <Starfield />

        {/* Subtle celestial directional fill light */}
        <directionalLight position={[30, 45, 20]} intensity={0.25} color="#e2e8f0" />

        {/* Central Star: The Kernel */}
        <Sun />

        {/* All Technical Domain Worlds */}
        {PLANETS.map((planet) => (
          <Planet key={planet.id} planet={planet} />
        ))}

        {/* Asteroid Belt */}
        <AsteroidBelt count={360} />

        {/* Post-Processing Effects */}
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.65}
            mipmapBlur
          />
          <ToneMapping />
          <Vignette eskil={false} offset={0.12} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
