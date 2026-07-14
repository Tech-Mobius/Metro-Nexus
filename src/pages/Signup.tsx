import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fontUi } from '../components/ui';
import { Icons } from '../components/SecurityIcons';
import { AlertCircle, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';
import FloatingPaths from '../components/ui/FloatingPaths';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await signup(name, email, password);
      navigate('/tickets');
    } catch (err: any) {
      setError(err.message || 'Error signing up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[90vh] md:h-[85vh] md:min-h-[650px] overflow-hidden rounded-3xl border border-white/10 bg-black text-white lg:grid lg:grid-cols-2">
      
      
      <div className="bg-neutral-950/60 relative hidden h-full flex-col border-r border-white/5 p-10 lg:flex overflow-hidden">
        <img
          src="/xlr680n42ec21.jpg"
          alt="Metro Nexus illustration"
          className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
        <div className="z-20 flex items-center gap-2">
          <span className="font-['Instrument_Serif'] text-2xl italic text-white">Metro Nexus</span>
        </div>
        <div className="z-20 mt-auto max-w-md space-y-5">
          <h3 className="text-2xl font-bold tracking-tight text-white font-['Instrument_Serif'] italic">
            The World's First AI-Powered Subway Network
          </h3>
          <ul className="space-y-4 text-sm text-white/70" style={{ fontFamily: fontUi }}>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 size-1.5 rounded-full bg-[#FF2D7A] shrink-0" />
              <div>
                <strong className="text-white">Living Stations:</strong> Every transit sector changes dynamic colors and themes based on rider submissions.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 size-1.5 rounded-full bg-[#FF2D7A] shrink-0" />
              <div>
                <strong className="text-white">Transit Wallet:</strong> Secure credit ledger ensuring lightning-fast ticket purchases and refunds.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 size-1.5 rounded-full bg-[#FF2D7A] shrink-0" />
              <div>
                <strong className="text-white">Creative Agency:</strong> Design live digital wall art and vote on music loops during your daily commute.
              </div>
            </li>
          </ul>
        </div>
        <div className="absolute inset-0 z-0">
          <FloatingPaths position={1.2} />
          <FloatingPaths position={-1.2} />
        </div>
      </div>

      
      <div className="relative flex flex-col justify-center p-6 sm:p-10 md:p-14">
        
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,45,122,0.06)_0,transparent_100%)] absolute top-0 right-0 h-96 w-96 rounded-full blur-2xl" />
        </div>

        
        <Link 
          to="/" 
          className="relative z-10 self-start mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-all"
          style={{ fontFamily: fontUi }}
        >
          <ChevronLeft className="size-3.5" />
          <span>Home</span>
        </Link>

        <div className="relative z-10 mx-auto w-full max-w-sm space-y-6">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="font-['Instrument_Serif'] text-xl italic text-white">Metro Nexus</span>
          </div>

          <div className="flex flex-col space-y-1.5">
            <h1 className="text-3xl font-['Instrument_Serif'] italic tracking-wide text-white">
              Create Rider Identity
            </h1>
            <p className="text-white/60 text-sm" style={{ fontFamily: fontUi }}>
              Register to purchase tickets, design murals, and vote.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5"
                style={{ fontFamily: fontUi }}
              >
                Rider Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Smith"
                className="w-full bg-neutral-900/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF2D7A] focus:ring-1 focus:ring-[#FF2D7A] transition-all"
                style={{ fontFamily: fontUi }}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5"
                style={{ fontFamily: fontUi }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rider@metronexus.net"
                className="w-full bg-neutral-900/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF2D7A] focus:ring-1 focus:ring-[#FF2D7A] transition-all"
                style={{ fontFamily: fontUi }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5"
                style={{ fontFamily: fontUi }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF2D7A] focus:ring-1 focus:ring-[#FF2D7A] transition-all"
                style={{ fontFamily: fontUi }}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5"
                style={{ fontFamily: fontUi }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF2D7A] focus:ring-1 focus:ring-[#FF2D7A] transition-all"
                style={{ fontFamily: fontUi }}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-950/30 border border-red-500/20 rounded-xl text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span style={{ fontFamily: fontUi }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
              style={{ fontFamily: fontUi }}
            >
              {loading ? 'Registering...' : 'Register'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-sm text-white/60" style={{ fontFamily: fontUi }}>
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF2D7A] underline underline-offset-2 hover:text-[#FF2D7A]/85">
              Sign In
            </Link>
          </p>

          
          <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/40" style={{ fontFamily: fontUi }}>
              <ShieldCheck className="w-3.5 h-3.5 text-[#8EFF3C]" />
              <span>Secure Transit Portal</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
                <Icons.soc2Dark className="h-8 w-auto" />
                <span className="text-[9px] text-white/30 mt-1" style={{ fontFamily: fontUi }}>SOC2 Certified</span>
              </div>
              <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
                <Icons.hipaaDark className="h-8 w-auto" />
                <span className="text-[9px] text-white/30 mt-1" style={{ fontFamily: fontUi }}>HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
