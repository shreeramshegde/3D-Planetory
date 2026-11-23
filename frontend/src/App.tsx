import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { UniverseCanvas } from './components/3d/UniverseCanvas';
import { Header } from './components/hud/Header';
import { PlanetSelector } from './components/hud/PlanetSelector';
import { PlanetDossier } from './components/hud/PlanetDossier';
import { VictoryOverlay } from './components/hud/VictoryOverlay';
import { FullscreenTerminal } from './pages/FullscreenTerminal';
import { soundEngine } from './audio/soundEngine';

function UniverseView() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030712] select-none">
      {/* 3D WebGL Universe Canvas */}
      <UniverseCanvas />

      {/* 2D Sci-Fi Aerospace HUD Overlay */}
      <Header />
      <PlanetSelector />
      <PlanetDossier />
      <VictoryOverlay />

      {/* Subtle CRT scanline aesthetic overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines z-10" />
    </main>
  );
}

export function App() {
  // Start ambient audio on first user gesture if not muted
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
    <HashRouter>
      <Routes>
        <Route path="/" element={<UniverseView />} />
        <Route path="/terminal/:domainId" element={<FullscreenTerminal />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
