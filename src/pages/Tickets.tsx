import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { STATIONS } from '../lib/mockData';
import { GlassCard, PageHeader, fontUi } from '../components/ui';
import { focusInput } from '../components/SecurityIcons';
import { AlertCircle, CheckCircle, Ticket as TicketIcon, QrCode, Coins, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface TicketData {
  _id: string;
  fromStation: string;
  toStation: string;
  price: number;
  status: 'active' | 'used' | 'expired';
  purchaseDate: string;
  verificationCode: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Tickets() {
  const { user, token, isAuthenticated, refreshUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [fromStation, setFromStation] = useState(STATIONS[0].slug);
  const [toStation, setToStation] = useState(STATIONS[1].slug);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [useLoadingId, setUseLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Price calculator mirroring backend logic
  const calculatePrice = (from: string, to: string): number => {
    if (from === to) return 0;
    const diff = Math.abs(from.length - to.length);
    return 10 + (diff % 5) * 5;
  };

  const ticketPrice = calculatePrice(fromStation, toStation);

  const fetchTickets = useCallback(async () => {
    if (!token) return;
    setLoadingTickets(true);
    try {
      const response = await fetch(`${API_URL}/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to retrieve tickets.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend server failed.');
    } finally {
      setLoadingTickets(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated, authLoading, navigate, fetchTickets]);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setSuccessMsg(null);

    if (fromStation === toStation) {
      setError('Start and destination stations cannot be the same.');
      return;
    }

    setPurchaseLoading(true);
    try {
      const response = await fetch(`${API_URL}/tickets/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fromStation, toStation }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(`Ticket purchased successfully! ${data.ticket.price} Credits deducted.`);
        await refreshUser();
        await fetchTickets();
      } else {
        setError(data.error || 'Failed to purchase ticket.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to ticketing network.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleUseTicket = async (ticketId: string) => {
    if (!token) return;
    setError(null);
    setSuccessMsg(null);
    setUseLoadingId(ticketId);

    try {
      const response = await fetch(`${API_URL}/tickets/${ticketId}/use`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg('Boarding successful! Ticket verified.');
        await fetchTickets();
      } else {
        setError(data.error || 'Failed to verify ticket.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not process boarding request.');
    } finally {
      setUseLoadingId(null);
    }
  };

  const getStationName = (slug: string) => {
    return STATIONS.find((s) => s.slug === slug)?.name || slug;
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4">
      <PageHeader
        eyebrow="Rider Dashboard"
        title="Living Ticket Wallet"
        subtitle="Manage your secure transit credits, purchase digital boarding passes, and view verified rides."
      />

      <div className="grid gap-6 md:grid-cols-3 mt-10">
        {/* Wallet Overview & Ticket Purchase form */}
        <div className="md:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm" style={{ fontFamily: fontUi }}>Your Wallet</span>
              <Coins className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="mt-3">
              <span className="text-4xl text-white font-semibold">{user?.walletBalance ?? 0}</span>
              <span className="text-sm text-white/60 ml-2.5" style={{ fontFamily: fontUi }}>Credits</span>
            </div>
            <p className="mt-4 text-xs text-white/40 leading-relaxed" style={{ fontFamily: fontUi }}>
              New accounts start with 100 Credits. Travel cost is dynamically calculated based on stations.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg text-white mb-4">Book New Journey</h3>
            <form onSubmit={handlePurchase} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-white/50 mb-1.5" style={{ fontFamily: fontUi }}>
                  Origin
                </label>
                <select
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  className={`w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none transition-all ${focusInput.join(' ')}`}
                  style={{ fontFamily: fontUi, colorScheme: 'dark' }}
                >
                  {STATIONS.map((s) => (
                    <option key={s.slug} value={s.slug} className="bg-neutral-900 text-white">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-white/50 mb-1.5" style={{ fontFamily: fontUi }}>
                  Destination
                </label>
                <select
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  className={`w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none transition-all ${focusInput.join(' ')}`}
                  style={{ fontFamily: fontUi, colorScheme: 'dark' }}
                >
                  {STATIONS.map((s) => (
                    <option key={s.slug} value={s.slug} className="bg-neutral-900 text-white">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-white/50 text-xs" style={{ fontFamily: fontUi }}>Travel Cost:</span>
                <span className="text-white font-semibold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-yellow-400" />
                  {ticketPrice} Credits
                </span>
              </div>

              <button
                type="submit"
                disabled={purchaseLoading || fromStation === toStation}
                className="w-full bg-white text-black font-semibold rounded-xl py-2.5 hover:bg-neutral-200 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                style={{ fontFamily: fontUi }}
              >
                {purchaseLoading ? 'Processing...' : 'Buy Ticket'}
                {!purchaseLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Tickets Lists */}
        <div className="md:col-span-2 space-y-6">
          {error && (
            <div className="flex items-start gap-2.5 p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span style={{ fontFamily: fontUi }}>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-4 bg-green-950/40 border border-green-500/20 rounded-2xl text-green-300 text-sm">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span style={{ fontFamily: fontUi }}>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-xl text-white">Your Tickets</h2>
            <button
              onClick={fetchTickets}
              disabled={loadingTickets}
              className="text-white/60 hover:text-white transition-colors p-1"
              aria-label="Refresh tickets"
            >
              <RefreshCw className={`w-4 h-4 ${loadingTickets ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingTickets && tickets.length === 0 ? (
            <div className="flex justify-center py-10">
              <RefreshCw className="w-6 h-6 animate-spin text-white/40" />
            </div>
          ) : tickets.length === 0 ? (
            <GlassCard className="p-8 text-center text-white/50">
              <TicketIcon className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p style={{ fontFamily: fontUi }}>No tickets purchased yet. Use the booking panel to secure your first trip.</p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {tickets.map((t) => (
                <GlassCard key={t._id} className="p-5 overflow-hidden relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-base font-medium">{getStationName(t.fromStation)}</span>
                        <ArrowRight className="w-4 h-4 text-white/40" />
                        <span className="text-white text-base font-medium">{getStationName(t.toStation)}</span>
                      </div>
                      <div className="flex items-center gap-3.5 text-xs text-white/50" style={{ fontFamily: fontUi }}>
                        <span>Purchased: {new Date(t.purchaseDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="uppercase font-semibold tracking-wider">{t.verificationCode}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold ${
                          t.status === 'active'
                            ? 'bg-blue-900/40 text-blue-300 border border-blue-500/20'
                            : t.status === 'used'
                            ? 'bg-green-900/40 text-green-300 border border-green-500/20'
                            : 'bg-neutral-900/60 text-white/30 border border-white/5'
                        }`}
                        style={{ fontFamily: fontUi }}
                      >
                        {t.status}
                      </span>

                      {t.status === 'active' && (
                        <button
                          onClick={() => handleUseTicket(t._id)}
                          disabled={useLoadingId === t._id}
                          className="bg-white text-black font-semibold text-xs px-4 py-2 rounded-lg hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                          style={{ fontFamily: fontUi }}
                        >
                          {useLoadingId === t._id ? 'Verifying...' : 'Board Train'}
                          <Zap className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {t.status === 'active' && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 bg-white/[0.02] p-3.5 rounded-xl">
                      <QrCode className="w-10 h-10 text-white/70" />
                      <div className="text-xs space-y-0.5" style={{ fontFamily: fontUi }}>
                        <p className="text-white/70 font-semibold">Active Boarding Pass</p>
                        <p className="text-white/40">Present code or click Board Train to simulate entry.</p>
                      </div>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
