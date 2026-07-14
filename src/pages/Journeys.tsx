import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { getStation } from '../lib/mockData';
import { GlassCard, PageHeader, StatTile, fontUi } from '../components/ui';

const STORAGE_KEY = 'metro-nexus-journeys';

interface SavedJourneyRecord {
  id: string;
  from: string;
  to: string;
  savedOn: string;
  energyKwh: number;
}

function loadJourneys(): SavedJourneyRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedJourneyRecord[]) : [];
  } catch {
    return [];
  }
}

export default function Journeys() {
  const [journeys, setJourneys] = useState<SavedJourneyRecord[]>([]);

  useEffect(() => {
    setJourneys(loadJourneys());
  }, []);

  const handleClearAll = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      
    }
    setJourneys([]);
  };

  const totalEnergy = journeys.reduce((sum, j) => sum + j.energyKwh, 0);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="My Journeys"
        title="Every Trip Leaves Energy Behind"
        subtitle="Each ride you save here recovers a little power through regenerative braking — captured as you slow into the platform and fed straight back into the network."
      />

      {journeys.length === 0 ? (
        <GlassCard className="mt-10 flex flex-col items-center gap-4 p-10 text-center">
          <p className="text-white/70" style={{ fontFamily: fontUi }}>
            You haven't saved a journey yet.
          </p>
          <Link to="/journey" className="glass-btn-primary">
            Plan Your First Journey
          </Link>
        </GlassCard>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2">
            <StatTile label="Energy You've Recovered" value={`${Math.round(totalEnergy).toLocaleString()} kWh`} />
            <StatTile label="Journeys Taken" value={journeys.length.toLocaleString()} />
          </div>

          <div className="mt-6 flex justify-end">
            <button type="button" onClick={handleClearAll} className="glass-btn-secondary">
              Clear All
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {journeys.map((journey) => {
              const fromName = getStation(journey.from)?.name ?? journey.from;
              const toName = getStation(journey.to)?.name ?? journey.to;
              return (
                <GlassCard key={journey.id} className="flex flex-wrap items-center justify-between gap-4 p-6">
                  <div>
                    <p className="flex items-center gap-2 text-lg text-white">
                      {fromName}
                      <ArrowRight className="h-4 w-4 text-white/40" />
                      {toName}
                    </p>
                    <p className="mt-1 text-sm text-white/50" style={{ fontFamily: fontUi }}>
                      {journey.savedOn}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/80" style={{ fontFamily: fontUi }}>
                    <Zap className="h-4 w-4" style={{ color: '#8EFF3C' }} />
                    {journey.energyKwh.toLocaleString()} kWh
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
