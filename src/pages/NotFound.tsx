import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { fontUi } from '../components/ui';
import Screensaver from '../components/ui/Screensaver';

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[60vh] min-h-[400px] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/40 backdrop-blur-md flex flex-col items-center justify-center text-center px-4"
    >
      {/* Bouncing DVD-like Screensaver elements */}
      <Screensaver
        speed={1.5}
        startPosition={{ x: 15, y: 15 }}
        startAngle={35}
        containerRef={containerRef}
      >
        <div className="liquid-glass relative w-36 h-20 sm:w-44 sm:h-24 select-none pointer-events-none rounded-xl overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
          <div className="absolute inset-0 p-3 flex flex-col justify-between text-left">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase">METRO NEXUS</span>
              <span className="text-[9px] font-mono text-white/50">TICKET</span>
            </div>
            <div className="text-[10px] font-mono text-white/80">
              STATUS: VOID
              <br />
              SECTOR: [ERROR]
            </div>
          </div>
        </div>
      </Screensaver>

      <Screensaver
        speed={1.2}
        startPosition={{ x: 70, y: 70 }}
        startAngle={130}
        containerRef={containerRef}
      >
        <div className="liquid-glass relative w-28 h-28 select-none pointer-events-none rounded-full overflow-hidden border border-white/15 shadow-[0_0_20px_rgba(255,45,122,0.15)] flex items-center justify-center bg-black/60">
          <span className="absolute text-xl font-bold font-mono text-white/60">404</span>
        </div>
      </Screensaver>

      <div className="relative z-10 flex flex-col items-center max-w-md">
        <h1 className="text-5xl text-white sm:text-6xl font-['Instrument_Serif'] italic">Off the Map</h1>
        <p className="mt-4 text-white/60 text-sm" style={{ fontFamily: fontUi }}>
          This platform doesn't exist in the network yet. Maybe it's tomorrow's blank canvas.
        </p>
        <Link to="/" className="glass-btn-primary mt-8 inline-flex relative overflow-hidden group">
          Return Home
        </Link>
      </div>
    </div>
  );
}
