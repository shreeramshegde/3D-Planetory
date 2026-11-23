import { useEffect, useState } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { TechnicalDomainId } from '../types/universe';
import { PLANETS } from '../data/planets';

const DOMAIN_MAP: Record<string, TechnicalDomainId> = {
  '1': 'kernel',
  '2': 'cloud',
  '3': 'ai',
  '4': 'backend',
  '5': 'frontend',
  '6': 'security',
};

export function useKeyboardShortcuts() {
  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const toggleAudio = useUniverseStore((s) => s.toggleAudio);
  const [announcement, setAnnouncement] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or select
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT')
      ) {
        return;
      }

      // 1-6 keys jump to worlds
      if (DOMAIN_MAP[e.key]) {
        e.preventDefault();
        const targetId = DOMAIN_MAP[e.key];
        setActivePlanet(targetId);
        const p = PLANETS.find((x) => x.id === targetId);
        if (p) {
          setAnnouncement(`Navigated to ${p.name}: ${p.domain}`);
        }
      }
      // Escape returns to overview
      else if (e.key === 'Escape') {
        if (activePlanetId) {
          e.preventDefault();
          setActivePlanet(null);
          setAnnouncement('Returned to solar system overview');
        }
      }
      // Space toggles audio
      else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleAudio();
        setAnnouncement('Toggled ambient audio');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePlanetId, setActivePlanet, toggleAudio]);

  return { announcement };
}
