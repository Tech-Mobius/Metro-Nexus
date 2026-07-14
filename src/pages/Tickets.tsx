import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { STATIONS } from '../lib/mockData';
import { GlassCard, PageHeader, fontUi } from '../components/ui';
import { focusInput } from '../components/SecurityIcons';
import { 
  AlertCircle, 
  CheckCircle, 
  Ticket as TicketIcon, 
  Coins, 
  ArrowRight, 
  Zap, 
  RefreshCw, 
  Plus, 
  X, 
  ShieldCheck 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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

  // Razorpay and Credits states
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState(100);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [simulatedOrder, setSimulatedOrder] = useState<any | null>(null);

  // Boarding Pass scanner modal state
  const [boardingTicket, setBoardingTicket] = useState<TicketData | null>(null);

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
        setBoardingTicket(null); // Close the boarding modal on success
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

  // Scroll Lock effect for modals
  useEffect(() => {
    if (showAddCreditsModal || simulatedOrder || boardingTicket) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAddCreditsModal, simulatedOrder, boardingTicket]);

  // Add credits payment gateway handler (Mock Mode)
  const handleAddCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setSuccessMsg(null);
    setIsPaymentLoading(true);

    // Simulate brief network latency for simulated gateway initialisation
    setTimeout(() => {
      setSimulatedOrder({
        orderId: 'order_mock_' + Math.random().toString(36).substring(2, 15),
        amount: creditAmount * 100, // paise
        currency: 'INR',
      });
      setIsPaymentLoading(false);
      setShowAddCreditsModal(false);
    }, 450);
  };

  // Confirm Simulated Payment Callback
  const confirmSimulatedPayment = async () => {
    if (!token || !simulatedOrder) return;
    setIsPaymentLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const amount = simulatedOrder.amount / 100;
      const verifyRes = await fetch(`${API_URL}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          isDemo: true,
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok) {
        setSuccessMsg(`[Demo Mode] Payment simulation successful. Added ${amount} Credits!`);
        await refreshUser();
      } else {
        setError(verifyData.error || 'Payment simulation failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to payment simulator.');
    } finally {
      setIsPaymentLoading(false);
      setSimulatedOrder(null);
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
    <div className="mx-auto max-w-5xl px-4 relative">
      {/* CSS Animation Keyframes for scanner effect */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        eyebrow="Rider Dashboard"
        title="Living Ticket Wallet"
        subtitle="Manage your secure transit credits, purchase digital boarding passes, and view verified rides."
      />

      <div className="grid gap-6 md:grid-cols-3 mt-10">
        {/* Left column */}
        <div className="md:col-span-1 space-y-6">
          <GlassCard className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500" />
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm font-medium" style={{ fontFamily: fontUi }}>Your Wallet</span>
              <Coins className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <span className="text-4xl text-white font-bold tracking-tight">{user?.walletBalance ?? 0}</span>
                <span className="text-sm text-white/60 ml-2.5" style={{ fontFamily: fontUi }}>Credits</span>
              </div>
              <button
                onClick={() => setShowAddCreditsModal(true)}
                className="liquid-glass border border-white/10 hover:border-white/20 p-2 rounded-xl text-white hover:text-[#00E5FF] transition-all flex items-center gap-1.5 text-xs font-semibold"
                style={{ fontFamily: fontUi }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Credits
              </button>
            </div>
            <p className="mt-5 text-xs text-white/40 leading-relaxed" style={{ fontFamily: fontUi }}>
              1 Credit = ₹1 INR. Travel cost is dynamically calculated based on station distances.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg text-white mb-4">Book New Journey</h3>
            <form onSubmit={handlePurchase} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-white/50 mb-1.5 font-medium" style={{ fontFamily: fontUi }}>
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
                <label className="block text-xs uppercase tracking-wide text-white/50 mb-1.5 font-medium" style={{ fontFamily: fontUi }}>
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

              <div className="pt-3 flex items-center justify-between border-t border-white/5">
                <span className="text-white/50 text-xs" style={{ fontFamily: fontUi }}>Travel Cost:</span>
                <span className="text-white font-semibold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-yellow-400" />
                  {ticketPrice} Credits
                </span>
              </div>

              <button
                type="submit"
                disabled={purchaseLoading || fromStation === toStation}
                className="w-full bg-white text-black font-semibold rounded-xl py-2.5 hover:bg-neutral-200 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer text-sm shadow-lg shadow-white/5"
                style={{ fontFamily: fontUi }}
              >
                {purchaseLoading ? 'Processing...' : 'Buy Ticket'}
                {!purchaseLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-6">
          {error && (
            <div className="flex items-start gap-2.5 p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-red-300 text-sm">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span style={{ fontFamily: fontUi }}>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-4 bg-green-950/40 border border-green-500/20 rounded-2xl text-green-300 text-sm">
              <CheckCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span style={{ fontFamily: fontUi }}>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-xl text-white font-medium">Your Tickets</h2>
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
                <GlassCard key={t._id} className="p-5 overflow-hidden relative group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-base font-semibold">{getStationName(t.fromStation)}</span>
                        <ArrowRight className="w-4 h-4 text-white/40" />
                        <span className="text-white text-base font-semibold">{getStationName(t.toStation)}</span>
                      </div>
                      <div className="flex items-center gap-3.5 text-xs text-white/50" style={{ fontFamily: fontUi }}>
                        <span>Purchased: {new Date(t.purchaseDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="uppercase font-mono font-semibold tracking-wider text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-md">
                          {t.verificationCode}
                        </span>
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
                          onClick={() => setBoardingTicket(t)}
                          className="bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-neutral-200 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-white/5 group-hover:scale-102 duration-300"
                          style={{ fontFamily: fontUi }}
                        >
                          Board Train
                          <Zap className="w-3 h-3 text-[#00E5FF] fill-[#00E5FF]" />
                        </button>
                      )}
                    </div>
                  </div>

                  {t.status === 'active' && (
                    <div 
                      onClick={() => setBoardingTicket(t)}
                      className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between bg-white/[0.02] p-3.5 rounded-xl cursor-pointer hover:bg-white/[0.04] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-inner">
                          <QRCodeSVG 
                            value={t.verificationCode} 
                            size={44} 
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            level="M"
                          />
                        </div>
                        <div className="text-xs space-y-0.5" style={{ fontFamily: fontUi }}>
                          <p className="text-white/80 font-bold">Active Boarding QR Pass</p>
                          <p className="text-white/40">Tap QR code or click Board Train to open scanner gate.</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 mr-1" />
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 1. Add Credits Modal */}
      {showAddCreditsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <GlassCard className="max-w-md w-full p-6 relative border border-white/10 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowAddCreditsModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl text-white mb-1.5 flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span>Purchase Transit Credits</span>
            </h3>
            <p className="text-xs text-white/50 mb-5 leading-relaxed" style={{ fontFamily: fontUi }}>
              Load credits into your living wallet to purchase dynamically priced commuter boarding passes instantly.
            </p>

            <form onSubmit={handleAddCredits} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-medium" style={{ fontFamily: fontUi }}>
                  Select Package
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[50, 100, 250].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCreditAmount(amt)}
                      className={`py-3 rounded-xl border font-semibold text-sm transition-all flex flex-col items-center gap-1 ${
                        creditAmount === amt 
                          ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white'
                          : 'border-white/5 bg-white/5 text-white/60 hover:border-white/10 hover:bg-white/10'
                      }`}
                      style={{ fontFamily: fontUi }}
                    >
                      <span className="text-white">+{amt}</span>
                      <span className="text-[10px] text-white/40">₹{amt} INR</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-white/40 mb-2 font-medium" style={{ fontFamily: fontUi }}>
                  Or Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white font-semibold text-sm focus:outline-none focus:border-white/20"
                    style={{ fontFamily: fontUi }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs" style={{ fontFamily: fontUi }}>
                <span className="text-white/40">Total Commuted Cost:</span>
                <span className="text-white font-bold text-sm">₹{creditAmount}.00 INR</span>
              </div>

              <button
                type="submit"
                disabled={isPaymentLoading || creditAmount <= 0}
                className="w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-neutral-200 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer text-sm shadow-md"
                style={{ fontFamily: fontUi }}
              >
                {isPaymentLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Opening Simulator...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Proceed to Mock Gateway
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-white/40 mt-3" style={{ fontFamily: fontUi }}>
                * This purchase uses a sandbox payment gateway simulation. No real money will be charged.
              </p>
            </form>
          </GlassCard>
        </div>
      )}

      {/* 2. Simulated payment gateway drawer */}
      {simulatedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <GlassCard className="max-w-md w-full p-6 relative border border-white/10 shadow-2xl shadow-white/5 animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-[#00E5FF]" />
            </div>
            
            <h3 className="text-lg text-white font-semibold text-center mb-1">Nexus Sandbox Payment Gateway</h3>
            <p className="text-xs text-white/50 text-center mb-5 max-w-sm mx-auto" style={{ fontFamily: fontUi }}>
              This is a secure mock payment simulator. No actual currency is charged.
            </p>

            <div className="bg-black/40 rounded-2xl border border-white/5 p-4 space-y-3 mb-6 text-xs" style={{ fontFamily: fontUi }}>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Simulated Merchant:</span>
                <span className="text-white/80 font-semibold">Metro Nexus Transit LLC</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Mock Transaction ID:</span>
                <span className="text-white/80 font-mono">{simulatedOrder.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Credits to Load:</span>
                <span className="text-[#00E5FF] font-semibold">{simulatedOrder.amount / 100} Credits</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Total Commuted Cost:</span>
                <span className="text-white font-bold">₹{simulatedOrder.amount / 100}.00 INR</span>
              </div>
              
              {/* Simulated Card Info */}
              <div className="space-y-2 pt-1">
                <span className="text-white/40 block text-[10px] tracking-wider font-semibold">MOCK CREDIT CARD DETAIL (AUTO-FILLED)</span>
                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-1.5 font-mono text-[10px] text-white/80">
                  <div className="flex justify-between">
                    <span>CARD NUMBER:</span>
                    <span>•••• •••• •••• 4242</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HOLDER NAME:</span>
                    <span>{user?.username?.toUpperCase() || 'METRO COMMUTER'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EXPIRY / CVC:</span>
                    <span>12 / 30  |  ***</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSimulatedOrder(null)}
                className="flex-1 liquid-glass border border-white/10 hover:border-white/20 text-white/80 hover:text-white rounded-xl py-3 text-xs font-semibold cursor-pointer transition-colors"
                style={{ fontFamily: fontUi }}
              >
                Cancel Transaction
              </button>
              <button
                onClick={confirmSimulatedPayment}
                disabled={isPaymentLoading}
                className="flex-1 bg-white hover:bg-neutral-200 text-black rounded-xl py-3 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-white/5"
                style={{ fontFamily: fontUi }}
              >
                {isPaymentLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    Simulate Payment
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 3. Boarding Pass Scan Gate Modal */}
      {boardingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
          <GlassCard className="max-w-md w-full p-6 relative border border-white/10 animate-in fade-in zoom-in duration-300 overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#FF2D7A]/10 rounded-full blur-3xl pointer-events-none" />
            
            <button 
              onClick={() => setBoardingTicket(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5 relative z-10">
              <span className="text-xs uppercase tracking-widest text-[#00E5FF] font-semibold bg-[#00E5FF]/10 px-3 py-1 rounded-full" style={{ fontFamily: fontUi }}>
                Active Commuter QR Pass
              </span>
              <h3 className="text-2xl text-white font-bold mt-3">Metro Schematic Gate</h3>
            </div>

            {/* Simulated Active Scanner Box */}
            <div className="relative mx-auto w-48 h-48 bg-white p-4.5 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border-2 border-[#00E5FF]">
              {/* Scan lasers line */}
              <div className="animate-scan-line absolute left-0 w-full h-[3px] bg-[#00E5FF] shadow-[0_0_8px_#00E5FF,0_0_15px_#00E5FF] z-10" />
              
              <QRCodeSVG 
                value={boardingTicket.verificationCode} 
                size={150} 
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
              />
            </div>

            <div className="mt-5 text-center space-y-1 relative z-10">
              <span className="text-xs text-white/40" style={{ fontFamily: fontUi }}>Verification Passcode</span>
              <p className="text-xl font-mono text-white font-bold tracking-widest uppercase">
                {boardingTicket.verificationCode}
              </p>
            </div>

            <div className="mt-5 bg-black/40 rounded-2xl border border-white/5 p-4 space-y-3 text-xs relative z-10" style={{ fontFamily: fontUi }}>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="space-y-0.5 text-left">
                  <span className="text-white/40 block text-[10px] uppercase">Origin</span>
                  <span className="text-white font-semibold">{getStationName(boardingTicket.fromStation)}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30" />
                <div className="space-y-0.5 text-right">
                  <span className="text-white/40 block text-[10px] uppercase">Destination</span>
                  <span className="text-white font-semibold">{getStationName(boardingTicket.toStation)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Commuted Fare:</span>
                <span className="text-white font-semibold">{boardingTicket.price} Credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Security Status:</span>
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                  Ready to scan
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3 relative z-10">
              <button
                onClick={() => setBoardingTicket(null)}
                className="flex-1 liquid-glass border border-white/10 hover:border-white/20 text-white/80 hover:text-white rounded-xl py-3 text-xs font-semibold cursor-pointer transition-colors"
                style={{ fontFamily: fontUi }}
              >
                Close Pass
              </button>
              <button
                onClick={() => handleUseTicket(boardingTicket._id)}
                disabled={useLoadingId === boardingTicket._id}
                className="flex-1 bg-white hover:bg-neutral-200 text-black rounded-xl py-3 text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-white/5"
                style={{ fontFamily: fontUi }}
              >
                {useLoadingId === boardingTicket._id ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    Confirm Entrance
                    <Zap className="w-3.5 h-3.5 text-[#00E5FF] fill-[#00E5FF]" />
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
