import { useState, useMemo } from 'react';
import { GALLERY_ERAS, LINE_LIST, getStation, type LineId, type GalleryEra } from '../lib/mockData';
import { PageHeader, fontUi } from '../components/ui';
import InfiniteMenu from '../components/ui/InfiniteMenu';

function generateEraPoster(era: GalleryEra): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  const gradient = ctx.createRadialGradient(256, 256, 10, 256, 256, 360);
  gradient.addColorStop(0, era.palette[0] || '#7A3CFF');
  gradient.addColorStop(0.6, era.palette[1] || '#007BFF');
  gradient.addColorStop(1, '#06070c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Decorative vector shapes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.5;
  for (let i = 1; i <= 6; i++) {
    ctx.beginPath();
    ctx.arc(256, 256, i * 45, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Intersecting subway tracks
  ctx.strokeStyle = era.palette[2] || '#FF2D7A';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 80);
  ctx.lineTo(432, 432);
  ctx.stroke();

  ctx.strokeStyle = era.palette[0] || '#007BFF';
  ctx.beginPath();
  ctx.moveTo(80, 432);
  ctx.lineTo(432, 80);
  ctx.stroke();

  // Glow dots
  era.palette.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.shadowColor = col;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(140 + idx * 110, 256 + Math.sin(idx) * 60, 16, 0, Math.PI * 2);
    ctx.fill();
  });

  // Reset shadow
  ctx.shadowBlur = 0;

  // Text details on poster
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(era.stationName.toUpperCase(), 256, 420);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '16px monospace';
  ctx.fillText(`GENERATION ${era.generation} ARCHIVE`, 256, 455);

  return canvas.toDataURL('image/png');
}

export default function Gallery() {
  const [filter, setFilter] = useState<LineId | 'all'>('all');

  const visible = useMemo(() => {
    return filter === 'all'
      ? GALLERY_ERAS
      : GALLERY_ERAS.filter((era) => getStation(era.stationSlug)?.lines.includes(filter));
  }, [filter]);

  const menuItems = useMemo(() => {
    return visible.map((era) => ({
      image: generateEraPoster(era),
      link: `/stations/${era.stationSlug}`,
      title: era.stationName,
      description: `Era ${era.generation} · ${era.summary}`,
    }));
  }, [visible]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="The Archive"
        title="Every Era, Remembered"
        subtitle="Once a station gathers 25 contributions, its living mural is archived forever and a new generation begins. This is the public record of what came before."
      />

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

      <div className="mt-10 relative w-full h-[580px] rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/10">
        {visible.length > 0 ? (
          <InfiniteMenu items={menuItems} scale={1.1} />
        ) : (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-white/50" style={{ fontFamily: fontUi }}>
            No archived eras on this line yet.
          </p>
        )}
      </div>
    </div>
  );
}
