import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { STATIONS, LINES, getStation } from '../lib/mockData';
import { planRoute } from '../lib/routePlanner';
import type { PlannedRoute } from '../lib/routePlanner';
import { GlassCard, PageHeader, StatTile, fontUi } from '../components/ui';

const STORAGE_KEY = 'metro-nexus-journeys';

interface SavedJourneyRecord {
  id: string;
  from: string;
  to: string;
  savedOn: string;
  energyKwh: number;
}

function StationSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (slug: string) => void;
}) {
  return (
    <div className="flex-1">
      <label className="mb-2 block text-xs uppercase tracking-wide text-white/50" style={{ fontFamily: fontUi }}>
        {label}
      </label>
      <div className="liquid-glass relative rounded-2xl">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl bg-transparent px-4 py-3 pr-10 text-white focus:outline-none"
          style={{ fontFamily: fontUi, colorScheme: 'dark' }}
        >
          {STATIONS.map((station) => (
            <option key={station.slug} value={station.slug} className="bg-neutral-900 text-white">
              {station.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
      </div>
    </div>
  );
}

export default function Journey() {
  const [fromSlug, setFromSlug] = useState(STATIONS[0].slug);
  const [toSlug, setToSlug] = useState(STATIONS[1].slug);
  const [route, setRoute] = useState<PlannedRoute | null>(null);
  const [searched, setSearched] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePlanRoute = () => {
    const result = planRoute(fromSlug, toSlug);
    setRoute(result);
    setSearched(true);
    setSaved(false);
  };

  const handleSaveJourney = () => {
    if (!route) return;
    const entry: SavedJourneyRecord = {
      id: crypto.randomUUID(),
      from: fromSlug,
      to: toSlug,
      savedOn: new Date().toISOString().slice(0, 10),
      energyKwh: (route.steps.length - 1) * 40 + route.transfers * 15,
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: SavedJourneyRecord[] = raw ? JSON.parse(raw) : [];
      existing.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setSaved(true);
    } catch {
      
      setSaved(false);
    }
  };

  const stops = route ? Math.max(0, route.steps.length - 1) : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Journey Planner"
        title="Where Are You Headed?"
        subtitle="Routes here adapt in real time to live network conditions — congestion, incidents, and the mood of the murals along the way."
      />

      <GlassCard className="mt-10 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <StationSelect label="From" value={fromSlug} onChange={setFromSlug} />
          <div className="hidden pb-3 text-white/40 sm:block">
            <ArrowRight className="h-5 w-5" />
          </div>
          <StationSelect label="To" value={toSlug} onChange={setToSlug} />
        </div>

        <button type="button" onClick={handlePlanRoute} className="glass-btn-primary mt-6 w-full sm:w-auto">
          Plan Route
        </button>

        {searched && !route && (
          <p className="mt-6 text-sm text-white/60" style={{ fontFamily: fontUi }}>
            No route could be found between these stations right now. The network's still learning — try another
            pair of stations.
          </p>
        )}

        {route && (
          <div className="mt-8 border-t border-white/10 pt-8">
            {fromSlug === toSlug ? (
              <p className="text-sm text-white/60" style={{ fontFamily: fontUi }}>
                You're already there — {getStation(fromSlug)?.name ?? fromSlug} is both your start and your
                destination.
              </p>
            ) : (
              <div className="flex flex-col gap-0">
                {route.steps.map((step, i) => {
                  const station = getStation(step.slug);
                  const color = step.lineId ? LINES[step.lineId].color : '#ffffff66';
                  const isLast = i === route.steps.length - 1;
                  return (
                    <div key={`${step.slug}-${i}`} className="flex items-stretch gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className="mt-1 h-3 w-3 flex-shrink-0 rounded-full border-2 border-black/40"
                          style={{ backgroundColor: color }}
                        />
                        {!isLast && <span className="w-px flex-1" style={{ backgroundColor: color }} />}
                      </div>
                      <div className={isLast ? 'pb-1' : 'pb-6'}>
                        <p className="text-white">{station?.name ?? step.slug}</p>
                        {step.lineId && (
                          <p className="text-xs text-white/50" style={{ fontFamily: fontUi }}>
                            via {LINES[step.lineId].name}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 grid grid-cols-3 gap-3">
              <StatTile label="Stops" value={stops} />
              <StatTile label="Transfers" value={route.transfers} />
              <StatTile label="Minutes" value={route.minutes} />
            </div>

            <button type="button" onClick={handleSaveJourney} className="glass-btn-secondary mt-6 w-full sm:w-auto">
              Save This Journey
            </button>

            {saved && (
              <div className="liquid-glass mt-4 rounded-2xl px-5 py-4">
                <p className="text-sm text-white" style={{ fontFamily: fontUi }}>
                  Saved! Recovered energy will count toward your total.{' '}
                  <Link to="/journeys" className="underline underline-offset-2 hover:text-white/80">
                    View saved journeys
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
