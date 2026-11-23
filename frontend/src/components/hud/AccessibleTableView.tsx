import { useUniverseStore } from '../../store/useUniverseStore';
import { PLANETS } from '../../data/planets';
import { Check, ArrowRight, Eye, Table } from 'lucide-react';
import { TechnicalDomainId } from '../../types/universe';

interface AccessibleTableViewProps {
  onClose: () => void;
}

export const AccessibleTableView = ({ onClose }: AccessibleTableViewProps) => {
  const completedChallenges = useUniverseStore((s) => s.completedChallenges);
  const setActivePlanet = useUniverseStore((s) => s.setActivePlanet);
  const setCameraMode = useUniverseStore((s) => s.setCameraMode);

  const handleLaunch = (id: TechnicalDomainId) => {
    setActivePlanet(id);
    setCameraMode('challenge');
    onClose();
  };

  const handleInspect = (id: TechnicalDomainId) => {
    setActivePlanet(id);
    setCameraMode('orbit');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#0A0B0F]/95 p-6 flex flex-col justify-between font-mono text-[#E8E3D6] overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-bone-hairline">
          <div className="flex items-center gap-3">
            <Table className="w-5 h-5 text-vermilion" />
            <div>
              <h2 className="text-base font-serif text-bone">
                Accessible Archival Star Chart
              </h2>
              <p className="text-[11px] text-bone-faint">
                2D tabular navigation for all six computational domains. WCAG 2.1 Compliant.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-bone/20 hover:border-vermilion text-xs transition-colors"
          >
            Switch to 3D Viewport
          </button>
        </div>

        {/* 2D Accessible Table */}
        <div className="border border-bone-hairline bg-[#0E1017] overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" aria-label="Celestial technical domains">
            <thead>
              <tr className="border-b border-bone/15 text-bone-faint text-[10px] uppercase bg-[#0A0B0F]">
                <th scope="col" className="p-3">Catalog ID</th>
                <th scope="col" className="p-3">Celestial Body</th>
                <th scope="col" className="p-3">Technical Domain</th>
                <th scope="col" className="p-3">Status</th>
                <th scope="col" className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bone/10">
              {PLANETS.map((planet) => {
                const isVerified = completedChallenges[planet.id];
                return (
                  <tr key={planet.id} className="hover:bg-bone/5 transition-colors">
                    <td className="p-3 font-mono text-bone-faint">{planet.catalogId}</td>
                    <td className="p-3 font-serif font-bold text-bone text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-none" style={{ backgroundColor: planet.color }} />
                        <span>{planet.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-bone-muted text-xs">{planet.domain}</td>
                    <td className="p-3">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>VERIFIED</span>
                        </span>
                      ) : (
                        <span className="text-bone-faint text-[11px]">PENDING</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleInspect(planet.id)}
                        className="px-2.5 py-1 border border-bone/20 hover:border-bone/50 text-[11px] inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-bone-muted" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => handleLaunch(planet.id)}
                        className="px-2.5 py-1 bg-vermilion hover:bg-vermilion-hover text-ink font-semibold text-[11px] inline-flex items-center gap-1"
                      >
                        <span>Simulate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Keyboard Shortcuts Guide */}
        <div className="p-3 border border-bone/10 bg-[#0A0B0F] text-[11px] text-bone-muted flex items-center justify-between">
          <span>SHORTCUTS: [1-6] Jump to worlds · [SPACE] Toggle simulation/audio · [ESC] Return to atlas overview</span>
          <span className="text-bone-faint">SYSTEM PROTOCOL 1.0</span>
        </div>
      </div>
    </div>
  );
};
