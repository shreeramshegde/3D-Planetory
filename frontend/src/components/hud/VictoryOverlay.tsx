import { useRef, useEffect, useState } from 'react';
import { useUniverseStore } from '../../store/useUniverseStore';
import { Download, RotateCcw, X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VictoryOverlay = () => {
  const plottedCount = useUniverseStore((s) => s.plottedCount);
  const resetUniverse = useUniverseStore((s) => s.resetUniverse);
  const pilotCallsign = useUniverseStore((s) => s.pilotCallsign);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  const isCompleted = plottedCount === 6;

  // Draw 2D canvas result card (downloadable PNG)
  useEffect(() => {
    if (!isCompleted || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Deep Ink Background
    ctx.fillStyle = '#0A0B0F';
    ctx.fillRect(0, 0, w, h);

    // 2. Surveyor Hairline Border & Corner Marks
    ctx.strokeStyle = 'rgba(232, 227, 214, 0.16)';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    // Corner crosshairs
    const drawCross = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy);
      ctx.lineTo(cx + 6, cy);
      ctx.moveTo(cx, cy - 6);
      ctx.lineTo(cx, cy + 6);
      ctx.strokeStyle = '#FF5A36';
      ctx.stroke();
    };
    drawCross(16, 16);
    drawCross(w - 16, 16);
    drawCross(16, h - 16);
    drawCross(w - 16, h - 16);

    // 3. Header Telemetry
    ctx.fillStyle = '#FF5A36';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('OBSERVATORY ARCHIVE // SURVEY CERTIFICATION', 32, 42);

    ctx.fillStyle = '#E8E3D6';
    ctx.font = 'bold 24px Instrument Serif, serif';
    ctx.fillText('System Atlas Plotted', 32, 74);

    ctx.fillStyle = 'rgba(232, 227, 214, 0.6)';
    ctx.font = '11px JetBrains Mono, monospace';
    const dateStr = new Date().toISOString().split('T')[0];
    ctx.fillText(`ARCHIVIST: ${pilotCallsign}   DATE: ${dateStr}   STATUS: VERIFIED (6/6)`, 32, 94);

    // Divider
    ctx.strokeStyle = 'rgba(232, 227, 214, 0.12)';
    ctx.beginPath();
    ctx.moveTo(32, 110);
    ctx.lineTo(w - 32, 110);
    ctx.stroke();

    // 4. Par Delta Table (Left Column)
    ctx.fillStyle = '#E8E3D6';
    ctx.font = '11px JetBrains Mono, monospace';
    const rows = [
      { name: 'The Kernel', par: 500, score: 580, delta: '+80' },
      { name: 'Stratos-9', par: 450, score: 520, delta: '+70' },
      { name: 'Synthetix', par: 550, score: 610, delta: '+60' },
      { name: 'Kronos Prime', par: 500, score: 560, delta: '+60' },
      { name: 'Prisma', par: 500, score: 540, delta: '+40' },
      { name: 'Citadel', par: 600, score: 680, delta: '+80' },
    ];

    let y = 135;
    ctx.fillStyle = 'rgba(232, 227, 214, 0.4)';
    ctx.fillText('DOMAIN', 32, y);
    ctx.fillText('PAR', 160, y);
    ctx.fillText('SCORE', 210, y);
    ctx.fillText('DELTA', 280, y);

    y += 18;
    for (const r of rows) {
      ctx.fillStyle = '#E8E3D6';
      ctx.fillText(r.name, 32, y);
      ctx.fillStyle = 'rgba(232, 227, 214, 0.6)';
      ctx.fillText(`${r.par}`, 160, y);
      ctx.fillStyle = '#E8E3D6';
      ctx.fillText(`${r.score}`, 210, y);
      ctx.fillStyle = '#FF5A36';
      ctx.fillText(r.delta, 280, y);
      y += 20;
    }

    // 5. Mini Constellation Graphic (Right Column)
    const centerX = 500;
    const centerY = 200;
    const radius = 80;
    const angles = [0, 1.05, 2.09, 3.14, 4.19, 5.24];

    // Constellation lines
    ctx.strokeStyle = 'rgba(255, 90, 54, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    angles.forEach((ang, idx) => {
      const px = centerX + Math.cos(ang) * radius;
      const py = centerY + Math.sin(ang) * (radius * 0.7);
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.stroke();

    // Star Nodes
    angles.forEach((ang, idx) => {
      const px = centerX + Math.cos(ang) * radius;
      const py = centerY + Math.sin(ang) * (radius * 0.7);
      ctx.fillStyle = '#FF5A36';
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#E8E3D6';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`OBS-0${idx}`, px + 6, py + 3);
    });

    // Central Star (Kernel)
    ctx.fillStyle = '#E8E3D6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Footer Stamp
    ctx.fillStyle = 'rgba(232, 227, 214, 0.35)';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('KEPLER OBSERVATORY // DETERMINISTIC REPLAY CERTIFIED', 32, h - 30);
  }, [isCompleted, pilotCallsign]);

  if (!isCompleted || !isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `observatory-survey-${pilotCallsign.toLowerCase()}.png`;
    a.click();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B0F]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-2xl w-full border border-bone-hairline bg-[#0A0B0F] text-[#E8E3D6] font-mono p-6 space-y-4 shadow-2xl relative"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-bone-hairline text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-vermilion" />
              <span className="font-semibold text-bone">SURVEY COMPLETE</span>
              <span className="text-bone-faint">// ALL 6 CELESTIAL BODIES PLOTTED</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:text-vermilion transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2D Canvas Result Card Preview */}
          <div className="flex justify-center overflow-hidden border border-bone/10 bg-[#06080D]">
            <canvas
              ref={canvasRef}
              width={640}
              height={320}
              className="w-full h-auto max-w-[640px]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              onClick={resetUniverse}
              className="flex items-center gap-1.5 px-3 py-2 border border-bone/20 hover:border-vermilion text-bone text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Atlas</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-bone/20 hover:border-bone/50 text-bone text-xs transition-colors"
              >
                Continue Viewing 3D Atlas
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-vermilion hover:bg-vermilion-hover text-ink font-semibold text-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Survey Card (.png)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
