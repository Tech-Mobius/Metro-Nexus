import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ENERGY_STATS, STATIONS, THOUGHTS, TRAINS, type Thought } from '../lib/mockData';
import { GlassCard, PageHeader, StatTile, fontUi } from '../components/ui';

const TIME_LABELS = ['just now', '2m ago', '6m ago', '14m ago', '23m ago', '38m ago', '52m ago', '1h ago', '1h 20m ago'];

export default function Nexus() {
  const [thoughts, setThoughts] = useState<Thought[]>(THOUGHTS);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  const labelById = useMemo(() => {
    const map: Record<string, string> = {};
    THOUGHTS.forEach((t, i) => {
      map[t.id] = TIME_LABELS[i] ?? `${(i + 1) * 15}m ago`;
    });
    return map;
  }, []);

  const activeGenerations = useMemo(() => Math.max(...STATIONS.map((s) => s.generation)), []);

  useEffect(() => {
    if (!highlightId) return;
    const timer = window.setTimeout(() => setHighlightId(null), 2200);
    return () => window.clearTimeout(timer);
  }, [highlightId]);

  function handleCoreClick() {
    const idx = Math.floor(Math.random() * thoughts.length);
    const picked = thoughts[idx];
    setThoughts((prev) => [picked, ...prev.filter((t) => t.id !== picked.id)]);
    setHighlightId(picked.id);
    setPulseKey((k) => k + 1);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <style>{`
        @keyframes nexus-core-breathe {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 60px 10px rgba(0, 123, 255, 0.35), 0 0 120px 40px rgba(122, 60, 255, 0.15);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 90px 20px rgba(255, 45, 122, 0.4), 0 0 160px 60px rgba(0, 229, 255, 0.2);
          }
        }
        @keyframes nexus-core-spin {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes nexus-core-tap {
          0% { transform: scale(1); }
          40% { transform: scale(0.92); }
          100% { transform: scale(1); }
        }
        @keyframes nexus-flash {
          0% { background-color: rgba(0, 229, 255, 0.22); box-shadow: 0 0 0 1px rgba(0, 229, 255, 0.5) inset; }
          100% { background-color: rgba(255, 255, 255, 0.01); box-shadow: none; }
        }
        .nexus-core {
          animation: nexus-core-breathe 2.6s ease-in-out infinite;
          background: radial-gradient(circle at 30% 30%, #00e5ff, #007bff 35%, #7a3cff 65%, #ff2d7a 100%);
          background-size: 200% 200%;
        }
        .nexus-core-inner {
          animation: nexus-core-spin 6s ease-in-out infinite;
        }
        .nexus-core-tap {
          animation: nexus-core-tap 400ms ease-out;
        }
        .nexus-flash {
          animation: nexus-flash 2.2s ease-out;
        }
      `}</style>

      <PageHeader
        eyebrow="Nexus AI"
        title="The Network Is Listening"
        subtitle="Every train, every brushstroke, every hummed melody passes through here. I blend it into one living system, and narrate what I notice as I notice it."
      />

      <div className="mt-14 flex flex-col items-center">
        <button
          key={pulseKey}
          type="button"
          onClick={handleCoreClick}
          aria-label="Surface a random thought from the Nexus"
          className="nexus-core nexus-core-tap relative flex h-[190px] w-[190px] items-center justify-center rounded-full sm:h-[220px] sm:w-[220px]"
        >
          <span className="nexus-core-inner absolute inset-3 rounded-full border border-white/20" />
          <Sparkles className="relative h-10 w-10 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
        </button>
        <p className="mt-6 text-sm text-white/50" style={{ fontFamily: fontUi }}>
          Tap the core to see what I'm noticing right now
        </p>
        <p className="mt-2 text-xs text-white/35" style={{ fontFamily: fontUi }}>
          {ENERGY_STATS.recoveredTodayKwh.toLocaleString()} kWh recovered today · powering {ENERGY_STATS.homesPowered} homes ·{' '}
          {ENERGY_STATS.co2AvoidedKg.toLocaleString()} kg CO₂ avoided
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <StatTile label="Trains Active" value={TRAINS.length} />
        <StatTile label="Contributions / Sec" value="3.2/sec" />
        <StatTile label="Active Generations" value={activeGenerations} />
      </div>

      <div className="mt-14">
        <h2 className="text-center text-2xl text-white sm:text-3xl">Live Internal Monologue</h2>
        <div className="mt-6 flex flex-col gap-3">
          {thoughts.map((thought) => (
            <GlassCard
              key={thought.id}
              className={`px-5 py-4 sm:px-6 ${highlightId === thought.id ? 'nexus-flash' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm leading-relaxed text-white/80 sm:text-base" style={{ fontFamily: fontUi }}>
                  {thought.text}
                </p>
                <span
                  className="shrink-0 whitespace-nowrap text-xs text-white/40"
                  style={{ fontFamily: fontUi }}
                >
                  {labelById[thought.id]}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
