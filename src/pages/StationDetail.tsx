import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Palette, Train as TrainIcon, Archive } from 'lucide-react';
import { getStation, GALLERY_ERAS, LINES } from '../lib/mockData';
import { GlassCard, LineBadge, fontUi } from '../components/ui';

const CONTRIBUTION_TYPES = [
  { kind: 'sketch', label: 'added a sketch to the wall', when: '2m ago' },
  { kind: 'vote', label: 'voted for the current theme', when: '11m ago' },
  { kind: 'melody', label: 'contributed a melody loop', when: '38m ago' },
  { kind: 'lighting', label: 'adjusted the lighting rhythm', when: '1h ago' },
  { kind: 'sketch', label: 'sketched over the east wall', when: '3h ago' },
];

export default function StationDetail() {
  const { slug } = useParams();
  const station = slug ? getStation(slug) : undefined;

  if (!station) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl text-white">Station Not Found</h1>
        <p className="mt-4 text-white/60" style={{ fontFamily: fontUi }}>
          This platform doesn't exist yet — maybe it's next generation's blank canvas.
        </p>
        <Link to="/stations" className="glass-btn-primary mt-8 inline-flex">
          Back to Stations
        </Link>
      </div>
    );
  }

  const eras = GALLERY_ERAS.filter((e) => e.stationSlug === station.slug);
  const gradient = `linear-gradient(120deg, ${station.palette.join(', ')})`;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/stations"
        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
        style={{ fontFamily: fontUi }}
      >
        <ArrowLeft size={14} /> All Stations
      </Link>

      <GlassCard className="relative mt-6 overflow-hidden p-8 sm:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 blur-2xl"
          style={{ background: gradient }}
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex flex-wrap gap-1.5">
            {station.lines.map((l) => (
              <LineBadge key={l} lineId={l} />
            ))}
          </div>
          <h1 className="mt-4 text-4xl text-white sm:text-6xl">{station.name}</h1>
          <p className="mt-3 max-w-xl text-white/70" style={{ fontFamily: fontUi }}>
            {station.blurb}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/60" style={{ fontFamily: fontUi }}>
            <span className="liquid-glass rounded-full px-3 py-1.5">Mood: {station.mood}</span>
            <span className="liquid-glass rounded-full px-3 py-1.5">Generation {station.generation}</span>
            <span className="liquid-glass rounded-full px-3 py-1.5">
              {station.contributions.toLocaleString()} contributions
            </span>
          </div>
          <div className="mt-6 flex gap-2">
            {station.palette.map((c) => (
              <span key={c} className="h-8 w-8 rounded-full border border-white/20" style={{ backgroundColor: c }} />
            ))}
          </div>
          <Link to="/create" className="glass-btn-primary mt-8 inline-flex">
            Leave a Mark Here
          </Link>
        </div>
      </GlassCard>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2 text-white">
            <TrainIcon size={16} />
            <span style={{ fontFamily: fontUi }}>Next Arrivals</span>
          </div>
          <ul className="space-y-3 text-sm text-white/70" style={{ fontFamily: fontUi }}>
            {station.lines.map((l, i) => (
              <li key={l} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LINES[l].color }} />
                  {LINES[l].name}
                </span>
                <span>{2 + i * 3} min</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Palette size={16} />
            <span style={{ fontFamily: fontUi }}>Recent Contributions</span>
          </div>
          <ul className="space-y-3 text-sm text-white/70" style={{ fontFamily: fontUi }}>
            {CONTRIBUTION_TYPES.map((c, i) => (
              <li key={i} className="flex items-start justify-between gap-3">
                <span>A rider {c.label}</span>
                <span className="shrink-0 text-white/40">{c.when}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Archive size={16} />
            <span style={{ fontFamily: fontUi }}>Archived Eras</span>
          </div>
          {eras.length === 0 ? (
            <p className="text-sm text-white/50" style={{ fontFamily: fontUi }}>
              No eras archived yet — this station is still writing its first.
            </p>
          ) : (
            <ul className="space-y-3 text-sm text-white/70" style={{ fontFamily: fontUi }}>
              {eras.map((e) => (
                <li key={e.id}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {e.palette.map((c) => (
                        <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span>Era {e.generation}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/50">{e.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
