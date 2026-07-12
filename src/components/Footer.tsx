import { Link } from 'react-router-dom';
import { FlickeringGrid } from './ui/FlickeringGrid';
import { Icons } from './SecurityIcons';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const SYSTEM_FONT = 'system-ui, sans-serif';

const ROUTE_LINKS = [
  { to: '/network', label: 'Network' },
  { to: '/stations', label: 'Stations' },
  { to: '/create', label: 'Create' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/journey', label: 'Journey' },
  { to: '/journeys', label: 'My Journeys' },
  { to: '/nexus', label: 'Nexus AI' },
  { to: '/impact', label: 'Impact' },
  { to: '/design', label: 'Design Rationale' },
];

function useLocalMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function checkQuery() {
      const result = window.matchMedia(query);
      setValue(result.matches);
    }
    checkQuery();
    window.addEventListener('resize', checkQuery);
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener('change', checkQuery);
    return () => {
      window.removeEventListener('resize', checkQuery);
      mediaQuery.removeEventListener('change', checkQuery);
    };
  }, [query]);

  return value;
}

export default function Footer() {
  const isMobile = useLocalMediaQuery('(max-width: 768px)');

  return (
    <footer id="footer" className="relative z-10 border-t border-white/10 bg-black w-full pb-0 mt-20">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10 flex flex-col md:flex-row md:items-start md:justify-between gap-y-10">
        
        {/* Left column: Branding & Badges */}
        <div className="flex flex-col items-start justify-start gap-y-5 max-w-xs mx-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="font-['Instrument_Serif'] text-2xl italic text-white">Metro Nexus</div>
          </Link>
          <p className="tracking-tight text-white/60 font-medium text-sm" style={{ fontFamily: SYSTEM_FONT }}>
            The city is your living canvas. Vote on themes, paint digital art, and design light systems. Every journey leaves a mark.
          </p>
          <div className="flex items-center gap-2">
            <Icons.soc2Dark className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            <Icons.hipaaDark className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50" style={{ fontFamily: SYSTEM_FONT }}>
            <span className="h-2 w-2 rounded-full bg-[#8EFF3C]" aria-hidden="true" />
            All system capsules operational
          </div>
        </div>

        {/* Center column: Routes Grid */}
        <div className="md:w-1/2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40" style={{ fontFamily: SYSTEM_FONT }}>Transit</span>
              <ul className="flex flex-col gap-y-2 text-sm text-white/60" style={{ fontFamily: SYSTEM_FONT }}>
                {ROUTE_LINKS.slice(0, 3).map((link) => (
                  <li key={link.to} className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                    <Link to={link.to}>{link.label}</Link>
                    <ChevronRight className="h-3.5 w-3.5 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40" style={{ fontFamily: SYSTEM_FONT }}>Rider Hub</span>
              <ul className="flex flex-col gap-y-2 text-sm text-white/60" style={{ fontFamily: SYSTEM_FONT }}>
                {ROUTE_LINKS.slice(3, 6).map((link) => (
                  <li key={link.to} className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                    <Link to={link.to}>{link.label}</Link>
                    <ChevronRight className="h-3.5 w-3.5 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40" style={{ fontFamily: SYSTEM_FONT }}>System</span>
              <ul className="flex flex-col gap-y-2 text-sm text-white/60" style={{ fontFamily: SYSTEM_FONT }}>
                {ROUTE_LINKS.slice(6, 9).map((link) => (
                  <li key={link.to} className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                    <Link to={link.to}>{link.label}</Link>
                    <ChevronRight className="h-3.5 w-3.5 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right column: Copyright & Callouts */}
        <div className="text-sm text-white/60 md:text-right" style={{ fontFamily: SYSTEM_FONT }}>
          <p>© 2038 Horizon Transit. All marks remembered.</p>
          <Link
            to="/network?station=sector-9"
            className="mt-4 inline-block rounded-full border border-[#8EFF3C]/30 px-4 py-2 text-[#8EFF3C] transition-all hover:bg-[#8EFF3C]/10"
          >
            Sector 9 is a blank canvas →
          </Link>
        </div>
      </div>

      {/* Interactive Flickering Grid logo at bottom */}
      <div className="w-full h-40 md:h-52 relative mt-10 z-0 overflow-hidden border-t border-white/5 bg-gradient-to-b from-black to-neutral-950">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black z-10 pointer-events-none" />
        <div className="absolute inset-0 mx-6">
          <FlickeringGrid
            text="METRO NEXUS"
            fontSize={isMobile ? 50 : 96}
            fontWeight="bold"
            className="h-full w-full"
            squareSize={3}
            gridGap={3}
            color="#007BFF"
            maxOpacity={0.22}
            flickerChance={0.08}
          />
        </div>
      </div>
    </footer>
  );
}
