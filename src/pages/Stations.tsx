import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LINE_LIST, STATIONS, type LineId } from '../lib/mockData';
import { GlassCard, LineBadge, PageHeader, fontUi } from '../components/ui';
import { TextFlippingBoard } from '../components/ui/TextFlippingBoard';

const BOARD_MESSAGES = [
  "18 ACTIVE STATIONS \nALL SYSTEMS LIVE \n- METRO NEXUS",
  "PULSE LINE: 100% OK \nHARBORLIGHT ACTIVE \nSEC-9 BLANK CANVAS",
  "BLOOM LINE: ONLINE \nPAPER RAIN PLAZA \nVELVET CROSSING ACTIVE",
  "NOVA LINE: SLOW 20% \nSEAL PRESSURE NORMAL \nCAPSULES ACTIVE 100%",
  "CURRENT LINE: ACTIVE \n4820 KWH RECOVERED \nPOWERING 138 HOMES",
];

export default function Stations() {
  const [filter, setFilter] = useState<LineId | 'all'>('all');
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((idx) => (idx + 1) % BOARD_MESSAGES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const visible = filter === 'all' ? STATIONS : STATIONS.filter((s) => s.lines.includes(filter));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Directory"
        title="Eighteen Stations, Never the Same Twice"
        subtitle="Every station's mood, palette, and generation is a live record of what its riders have made."
      />

      <div className="mt-8 flex justify-center w-full">
        <TextFlippingBoard text={BOARD_MESSAGES[msgIdx]} />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            filter === 'all' ? 'bg-white text-black' : 'liquid-glass text-white/70 hover:text-white'
          }`}
          style={{ fontFamily: fontUi }}
        >
          All Lines
        </button>
        {LINE_LIST.map((line) => (
          <button
            key={line.id}
            type="button"
            onClick={() => setFilter(line.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === line.id ? 'text-black' : 'liquid-glass text-white/70 hover:text-white'
            }`}
            style={{ fontFamily: fontUi, backgroundColor: filter === line.id ? line.color : undefined }}
          >
            {line.name}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((station) => (
          <Link key={station.slug} to={`/stations/${station.slug}`}>
            <GlassCard hover className="h-full p-6">
              <div className="flex flex-wrap gap-1.5">
                {station.lines.map((l) => (
                  <LineBadge key={l} lineId={l} />
                ))}
              </div>
              <h3 className="mt-4 text-2xl text-white">{station.name}</h3>
              <p className="mt-1 text-sm text-white/60" style={{ fontFamily: fontUi }}>
                {station.mood} · Era {station.generation}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/60" style={{ fontFamily: fontUi }}>
                {station.blurb}
              </p>
              <div className="mt-4 flex gap-1.5">
                {station.palette.map((c) => (
                  <span key={c} className="h-4 w-4 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
              <p className="mt-3 text-xs text-white/40" style={{ fontFamily: fontUi }}>
                {station.contributions.toLocaleString()} contributions
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
