import { useEffect } from 'react';
import { UniverseCanvas } from './components/3d/UniverseCanvas';
import { Header } from './components/hud/Header';
import { PlanetSelector } from './components/hud/PlanetSelector';
import { PlanetDossier } from './components/hud/PlanetDossier';
import { VictoryOverlay } from './components/hud/VictoryOverlay';
import { soundEngine } from './audio/soundEngine';

export function App() {
  // Start ambient audio on first user interaction if not muted
  useEffect(() => {
    const handleFirstGesture = () => {
      soundEngine.startAmbient();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030712] select-none">
      {/* 3D WebGL Universe Canvas */}
      <UniverseCanvas />

      {/* 2D Sci-Fi Holographic HUD Overlay */}
      <Header />
      <PlanetSelector />
      <PlanetDossier />
      <VictoryOverlay />

      {/* Subtle CRT scanline aesthetic overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines z-10" />
    </main>
  );
}

export default App;
