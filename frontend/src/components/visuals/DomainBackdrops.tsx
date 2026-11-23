import React from 'react';

interface DomainBackdropProps {
  domainId: string;
  className?: string;
}

export const DomainBackdrop: React.FC<DomainBackdropProps> = ({ domainId, className = '' }) => {
  if (domainId === 'cloud') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Deep cyan atmospheric space gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-sky-950/20 to-slate-950/90" />
        
        {/* Vector orbital rings & cloud eddies */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cloudGlow" cx="70%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#cloudGlow)" />
          {/* Orbital path waves */}
          <path d="M-100,80 Q200,20 500,90 T1100,50" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 8" />
          <path d="M-50,180 Q300,120 700,200 T1200,160" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
          <circle cx="75%" cy="35%" r="140" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="8 12" />
        </svg>
      </div>
    );
  }

  if (domainId === 'ai') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-indigo-950/25 to-slate-950/90" />
        
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="neuralGlow" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#neuralGlow)" />
          {/* Neural Synapse Constellation */}
          <line x1="20%" y1="30%" x2="45%" y2="20%" stroke="#c084fc" strokeWidth="1.2" opacity="0.5" />
          <line x1="45%" y1="20%" x2="70%" y2="40%" stroke="#c084fc" strokeWidth="1.2" opacity="0.5" />
          <line x1="45%" y1="20%" x2="50%" y2="65%" stroke="#a855f7" strokeWidth="1.2" opacity="0.5" />
          <line x1="70%" y1="40%" x2="85%" y2="75%" stroke="#c084fc" strokeWidth="1.2" opacity="0.5" />
          <line x1="20%" y1="30%" x2="35%" y2="70%" stroke="#a855f7" strokeWidth="1.2" opacity="0.5" />
          
          <circle cx="20%" cy="30%" r="4" fill="#f3e8ff" />
          <circle cx="45%" cy="20%" r="5" fill="#f3e8ff" />
          <circle cx="70%" cy="40%" r="4" fill="#f3e8ff" />
          <circle cx="50%" cy="65%" r="4.5" fill="#c084fc" />
          <circle cx="85%" cy="75%" r="4" fill="#c084fc" />
          <circle cx="35%" cy="70%" r="4" fill="#a855f7" />
        </svg>
      </div>
    );
  }

  if (domainId === 'backend') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-orange-950/20 to-slate-950/90" />
        
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="magmaGlow" cx="40%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#magmaGlow)" />
          {/* Molten Pipeline Tracks */}
          <path d="M0,120 L300,120 L450,220 L900,220" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="10 6" />
          <path d="M100,50 L500,50 L650,150 L1000,150" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.6" />
          <circle cx="450" cy="220" r="8" fill="#fbbf24" />
          <circle cx="650" cy="150" r="6" fill="#f59e0b" />
        </svg>
      </div>
    );
  }

  if (domainId === 'frontend') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-950/40 via-rose-950/25 to-slate-950/90" />
        
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="prismLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#prismLight)" />
          {/* Crystalline facets */}
          <polygon points="120,40 320,80 220,240" fill="none" stroke="#f472b6" strokeWidth="1.2" opacity="0.6" />
          <polygon points="320,80 520,60 420,220" fill="none" stroke="#ec4899" strokeWidth="1.2" opacity="0.5" />
          <polygon points="220,240 420,220 300,340" fill="none" stroke="#a855f7" strokeWidth="1.2" opacity="0.5" />
        </svg>
      </div>
    );
  }

  if (domainId === 'security') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-teal-950/25 to-slate-950/90" />
        
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexPattern" width="40" height="69.282" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 20 11.547 L 0 0 L 0 23.094 L 20 34.641 L 40 23.094 Z M 0 34.641 L 20 46.188 L 0 57.735 L 0 80.829 L 20 92.376 L 40 80.829 L 40 57.735 L 20 46.188 Z" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexPattern)" />
        </svg>
      </div>
    );
  }

  return null;
};
