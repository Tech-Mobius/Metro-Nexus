import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, LogOut, User, Coins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SYSTEM_FONT = 'system-ui, sans-serif';
const EASE = 'cubic-bezier(0.4,0,0.2,1)';

const NAV_LINKS = [
  { to: '/network', label: 'Network' },
  { to: '/stations', label: 'Stations' },
  { to: '/create', label: 'Create' },
  { to: '/journey', label: 'Journey' },
  { to: '/nexus', label: 'Nexus AI' },
  { to: '/impact', label: 'Impact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <Link to="/" className="font-['Instrument_Serif'] text-xl italic text-white sm:text-2xl">
          Metro Nexus
        </Link>

        <div className="liquid-glass hidden items-center gap-1 rounded-full py-2 pl-3 pr-3 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`
              }
              style={{ fontFamily: SYSTEM_FONT }}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`
              }
              style={{ fontFamily: SYSTEM_FONT }}
            >
              My Tickets
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3 ml-3 pl-3 border-l border-white/10">
              <Link to="/tickets" className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white" style={{ fontFamily: SYSTEM_FONT }}>
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span>{user?.walletBalance} Credits</span>
              </Link>
              <div className="flex items-center gap-1 text-xs text-white/50" style={{ fontFamily: SYSTEM_FONT }} title={`User ID: ${user?._id}`}>
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>ID: {user?._id ? user._id.slice(-6) : ''}</span>
              </div>
              <button
                onClick={logout}
                className="rounded-full bg-white/10 p-1.5 text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-3 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition-transform hover:scale-105"
              style={{ fontFamily: SYSTEM_FONT }}
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="liquid-glass relative flex h-11 w-11 items-center justify-center rounded-full md:hidden"
        >
          <Menu
            className={`absolute h-5 w-5 text-white transition-all duration-300 ${
              menuOpen ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'
            }`}
          />
          <X
            className={`absolute h-5 w-5 text-white transition-all duration-300 ${
              menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'
            }`}
          />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ transitionDuration: '500ms', transitionTimingFunction: EASE }}
        onClick={() => setMenuOpen(false)}
      >
        <div className="flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
          {[
            ...NAV_LINKS,
            ...(isAuthenticated ? [{ to: '/tickets', label: 'My Tickets' }] : []),
            { to: '/gallery', label: 'Gallery' },
            { to: '/journeys', label: 'My Journeys' },
          ].map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`text-3xl text-white transition-all ${
                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionDuration: '500ms',
                transitionTimingFunction: EASE,
                transitionDelay: menuOpen ? `${100 + i * 50}ms` : '0ms',
              }}
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="text-white/60 text-sm flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-yellow-400" />
                {user?.walletBalance} Credits
              </span>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="mt-2 rounded-full bg-white/10 px-8 py-2.5 text-white hover:bg-white/20 transition-all cursor-pointer text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className={`mt-4 rounded-full bg-white px-8 py-3 text-black transition-all ${
                menuOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
              }`}
              style={{
                fontFamily: SYSTEM_FONT,
                transitionDuration: '500ms',
                transitionTimingFunction: EASE,
                transitionDelay: menuOpen ? '300ms' : '0ms',
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
