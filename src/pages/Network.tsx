import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TriangleAlert, RefreshCw, Layers } from 'lucide-react';
import { getStation, LINE_LIST, LINES, INCIDENTS, type Station, type LineId } from '../lib/mockData';
import { GlassCard, PageHeader, fontUi } from '../components/ui';

interface MapNode {
  slug: string;
  name: string;
  x: number;
  y: number;
  labelPos: 'top' | 'bottom' | 'left' | 'right';
  isTransfer?: boolean;
  isDashed?: boolean;
  highlightBorder?: string;
}

const STATION_COORDS: Record<string, MapNode> = {
  'inkwell-junction': { slug: 'inkwell-junction', name: 'Inkwell Junction', x: 100, y: 170, labelPos: 'top' },
  'paper-rain-plaza': { slug: 'paper-rain-plaza', name: 'Paper Rain Plaza', x: 230, y: 225, labelPos: 'top' },
  'founders-square': { slug: 'founders-square', name: 'Founders Square', x: 360, y: 280, labelPos: 'top', isTransfer: true },
  'lumen-court': { slug: 'lumen-court', name: 'Lumen Court', x: 470, y: 235, labelPos: 'top' },
  'cyan-falls': { slug: 'cyan-falls', name: 'Cyan Falls', x: 580, y: 190, labelPos: 'top', isTransfer: true },
  'harborlight': { slug: 'harborlight', name: 'Harborlight', x: 680, y: 140, labelPos: 'top', isTransfer: true },
  'sector-9': { slug: 'sector-9', name: 'Sector 9', x: 790, y: 110, labelPos: 'top', isDashed: true },

  'bloom-district': { slug: 'bloom-district', name: 'Bloom District', x: 340, y: 490, labelPos: 'left' },
  'prism-heights': { slug: 'prism-heights', name: 'Prism Heights', x: 390, y: 420, labelPos: 'right' },
  'velvet-crossing': { slug: 'velvet-crossing', name: 'Velvet Crossing', x: 450, y: 490, labelPos: 'right', isTransfer: true },
  'meridian-park': { slug: 'meridian-park', name: 'Meridian Park', x: 490, y: 550, labelPos: 'right', isTransfer: true },
  'thistle-court': { slug: 'thistle-court', name: 'Thistle Court', x: 580, y: 720, labelPos: 'right', isTransfer: true, highlightBorder: '#FFD400' },
  'quartz-hollow': { slug: 'quartz-hollow', name: 'Quartz Hollow', x: 620, y: 600, labelPos: 'right' },

  'amber-terminus': { slug: 'amber-terminus', name: 'Amber Terminus', x: 300, y: 660, labelPos: 'left' },
  'glasswing': { slug: 'glasswing', name: 'Glasswing', x: 530, y: 660, labelPos: 'left' },
  'driftwood-yard': { slug: 'driftwood-yard', name: 'Driftwood Yard', x: 460, y: 800, labelPos: 'left' },
  'halcyon-row': { slug: 'halcyon-row', name: 'Halcyon Row', x: 650, y: 800, labelPos: 'right' },
  'sunken-pier': { slug: 'sunken-pier', name: 'Sunken Pier', x: 710, y: 860, labelPos: 'right' },
};

const TRACKS = [
  { id: 'pulse', lineId: 'pulse' as LineId, color: '#007BFF', d: 'M 100 170 L 230 225 L 360 280 L 470 235 L 580 190 L 680 140' },
  { id: 'pulse-dashed', lineId: 'pulse' as LineId, color: '#007BFF', d: 'M 680 140 L 790 110', isDashed: true },
  { id: 'bloom-1', lineId: 'bloom' as LineId, color: '#FF2D7A', d: 'M 340 490 L 360 280' },
  { id: 'bloom-2', lineId: 'bloom' as LineId, color: '#FF2D7A', d: 'M 360 280 L 390 420 L 450 490 L 490 550 L 580 720' },
  { id: 'bloom-3', lineId: 'bloom' as LineId, color: '#FF2D7A', d: 'M 680 140 L 450 490' },
  { id: 'nova', lineId: 'nova' as LineId, color: '#7A3CFF', d: 'M 300 660 L 450 490 L 490 550 L 620 600' },
  { id: 'current-1', lineId: 'current' as LineId, color: '#00E5FF', d: 'M 580 190 L 530 660 L 580 720 L 650 800 L 710 860' },
  { id: 'current-2', lineId: 'current' as LineId, color: '#00E5FF', d: 'M 580 190 L 490 550 L 460 800' },
];

interface AnimatedTrain {
  id: string;
  lineId: LineId;
  trackId: string;
  speed: number;
  color: string;
}

const MAP_TRAINS: AnimatedTrain[] = [
  { id: 't-pulse-1', lineId: 'pulse', trackId: 'pulse', speed: 0.8, color: '#007BFF' },
  { id: 't-bloom-1', lineId: 'bloom', trackId: 'bloom-2', speed: 1.0, color: '#FF2D7A' },
  { id: 't-bloom-2', lineId: 'bloom', trackId: 'bloom-3', speed: 0.9, color: '#FF2D7A' },
  { id: 't-nova-1', lineId: 'nova', trackId: 'nova', speed: 1.1, color: '#7A3CFF' },
  { id: 't-current-1', lineId: 'current', trackId: 'current-1', speed: 0.9, color: '#00E5FF' },
  { id: 't-current-2', lineId: 'current', trackId: 'current-2', speed: 1.0, color: '#00E5FF' },
];

export default function Network() {
  const [activeLine, setActiveLine] = useState<LineId | null>(null);
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 70, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const trainCircleRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const trackPathRefs = useRef<Record<string, SVGPathElement | null>>({});

  useEffect(() => {
    let animId: number;
    const trainData = MAP_TRAINS.map(t => ({
      ...t,
      progress: Math.random(),
      direction: Math.random() > 0.5 ? 1 : -1,
    }));

    function update() {
      trainData.forEach(t => {
        t.progress += 0.0015 * t.speed * t.direction;
        if (t.progress >= 1) {
          t.progress = 1;
          t.direction = -1;
        } else if (t.progress <= 0) {
          t.progress = 0;
          t.direction = 1;
        }

        const path = trackPathRefs.current[t.trackId];
        const circle = trainCircleRefs.current[t.id];
        if (path && circle) {
          try {
            const len = path.getTotalLength();
            const pt = path.getPointAtLength(t.progress * len);
            circle.setAttribute('cx', pt.x.toString());
            circle.setAttribute('cy', pt.y.toString());
          } catch (e) {
            // path length calculation fallback before load
          }
        }
      });
      animId = requestAnimationFrame(update);
    }

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a') || target.closest('button')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsPanning(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const zoomFactor = 1.05;
    const newZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
    setZoom(Math.max(0.5, Math.min(2.5, newZoom)));
  };

  const handleNodeMouseEnter = (slug: string, x: number, y: number) => {
    const station = getStation(slug);
    if (station) {
      setHoveredStation(station);
      setTooltipPos({ x, y });
    }
  };

  const handleNodeMouseLeave = () => {
    setHoveredStation(null);
  };

  const resetView = () => {
    setZoom(0.85);
    setPan({ x: 70, y: 30 });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Interactive System Map"
        title="Metro Schematic Grid"
        subtitle="A live co-created transit matrix. Toggle lines, track automated capsules, and explore stations in real time."
      />

      {INCIDENTS.length > 0 && (
        <div className="mx-auto mt-6 flex max-w-2xl items-center gap-3 rounded-2xl border border-[#FF3B30]/30 bg-[#FF3B30]/10 px-5 py-3 text-sm text-white">
          <TriangleAlert size={16} className="shrink-0 text-[#FF3B30]" />
          <span style={{ fontFamily: fontUi }}>{INCIDENTS[0].message}</span>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Map Container */}
        <div className="relative col-span-1 h-[650px] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 lg:col-span-3">
          {/* Controls overlay */}
          <div className="absolute left-6 top-6 z-20 flex gap-2">
            <button
              onClick={resetView}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white/70 backdrop-blur-md transition-colors hover:bg-white/5 hover:text-white"
              style={{ fontFamily: fontUi }}
            >
              <RefreshCw className="size-3.5" />
              <span>Reset View</span>
            </button>
          </div>

          <div
            className="h-full w-full cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
          >
            <svg
              className="h-full w-full"
              style={{ pointerEvents: 'none' }}
            >
              <defs>
                {/* Glow filters for tracks */}
                <filter id="glow-pulse" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-bloom" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-nova" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-current" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-train" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Drop shadow for text labels */}
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.8" />
                </filter>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transition: isPanning ? 'none' : 'transform 0.15s ease-out' }}>
                {/* Line Tracks */}
                {TRACKS.map((track) => {
                  const isDimmed = activeLine !== null && activeLine !== track.lineId;
                  return (
                    <path
                      key={track.id}
                      ref={(el) => {
                        trackPathRefs.current[track.id] = el;
                      }}
                      d={track.d}
                      fill="none"
                      stroke={track.color}
                      strokeWidth={6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={track.isDashed ? '8,8' : undefined}
                      opacity={isDimmed ? 0.15 : 0.85}
                      style={{
                        filter: `url(#glow-${track.lineId})`,
                        transition: 'opacity 0.3s ease',
                      }}
                    />
                  );
                })}

                {/* Animated Train Capsules */}
                {MAP_TRAINS.map((train) => {
                  const isHidden = activeLine !== null && activeLine !== train.lineId;
                  return (
                    <circle
                      key={train.id}
                      ref={(el) => {
                        trainCircleRefs.current[train.id] = el;
                      }}
                      r={6}
                      fill="#FFFFFF"
                      stroke={train.color}
                      strokeWidth={3}
                      opacity={isHidden ? 0 : 1}
                      style={{
                        filter: 'url(#glow-train)',
                        transition: 'opacity 0.3s ease',
                      }}
                    />
                  );
                })}

                {/* Station Nodes */}
                {Object.values(STATION_COORDS).map((node) => {
                  const isTransfer = node.isTransfer;
                  const isDimmed = activeLine !== null && !getStation(node.slug)?.lines.includes(activeLine);
                  
                  // Label offsets
                  let dx = 0;
                  let dy = 0;
                  let textAnchor: "inherit" | "end" | "start" | "middle" = 'middle';
                  if (node.labelPos === 'top') {
                    dy = -15;
                  } else if (node.labelPos === 'bottom') {
                    dy = 22;
                  } else if (node.labelPos === 'left') {
                    dx = -15;
                    dy = 4;
                    textAnchor = 'end';
                  } else if (node.labelPos === 'right') {
                    dx = 15;
                    dy = 4;
                    textAnchor = 'start';
                  }

                  return (
                    <g
                      key={node.slug}
                      className="group cursor-pointer pointer-events-auto"
                      opacity={isDimmed ? 0.25 : 1}
                      style={{ transition: 'opacity 0.3s ease' }}
                      onMouseEnter={() => handleNodeMouseEnter(node.slug, node.x, node.y)}
                      onMouseLeave={handleNodeMouseLeave}
                    >
                      <Link to={`/stations/${node.slug}`}>
                        {/* Interactive Hit Area */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={25}
                          fill="transparent"
                        />
                        {/* Outer Glow Ring */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isTransfer ? 10 : 7}
                          fill="black"
                          stroke={node.highlightBorder || (node.isDashed ? '#555555' : '#FFFFFF')}
                          strokeWidth={2}
                          className="transition-transform group-hover:scale-125"
                        />
                        {/* Core Dot */}
                        {!node.isDashed && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={isTransfer ? 5 : 3.5}
                            fill={node.isDashed ? '#333333' : '#FFFFFF'}
                          />
                        )}
                        {/* Station Name Label */}
                        <text
                          x={node.x}
                          y={node.y}
                          dx={dx}
                          dy={dy}
                          textAnchor={textAnchor}
                          fill="white"
                          filter="url(#shadow)"
                          className="font-['Instrument_Serif'] text-sm italic tracking-wide select-none group-hover:fill-[#00E5FF] transition-colors"
                        >
                          {node.name}
                        </text>
                      </Link>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Floating Tooltip */}
          {hoveredStation && (
            <div
              className="absolute z-30 pointer-events-none p-4 rounded-2xl border border-white/10 bg-neutral-950/95 text-white shadow-2xl w-64 backdrop-blur-md"
              style={{
                left: `${(tooltipPos.x * zoom) + pan.x}px`,
                top: `${(tooltipPos.y * zoom) + pan.y - 175}px`,
                transform: 'translateX(-50%)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-['Instrument_Serif'] text-lg italic font-bold leading-none">{hoveredStation.name}</h4>
                <div className="flex gap-1">
                  {hoveredStation.lines.map(lineId => (
                    <span
                      key={lineId}
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-mono font-semibold"
                      style={{
                        backgroundColor: `${LINES[lineId].color}22`,
                        color: LINES[lineId].color,
                        border: `1px solid ${LINES[lineId].color}44`
                      }}
                    >
                      {lineId.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-white/60 mb-3 leading-relaxed" style={{ fontFamily: fontUi }}>
                {hoveredStation.blurb}
              </p>
              <div className="flex items-center justify-between text-[10px] text-white/50 border-t border-white/5 pt-2" style={{ fontFamily: fontUi }}>
                <span>Gen {hoveredStation.generation}</span>
                <span>{hoveredStation.contributions.toLocaleString()} marks</span>
              </div>
              <div
                className="mt-3 text-center text-[10px] text-white/40 uppercase tracking-wider font-semibold"
                style={{ fontFamily: fontUi }}
              >
                Click node to enter station
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white" style={{ fontFamily: fontUi }}>
              <Layers className="size-4 text-[#00E5FF]" />
              <span>Transit Lines</span>
            </h3>
            <div className="flex flex-col gap-3">
              {LINE_LIST.map((line) => {
                const isActive = activeLine === line.id;
                return (
                  <button
                    key={line.id}
                    onClick={() => setActiveLine(isActive ? null : line.id)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                      isActive
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/5 bg-white/5 text-white/70 hover:border-white/10 hover:bg-white/5 hover:text-white'
                    }`}
                    style={{ fontFamily: fontUi }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: line.color, boxShadow: `0 0 8px ${line.color}` }} />
                      <span className="text-sm font-medium">{line.name}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-white/40">
                      {isActive ? 'Active' : 'Show'}
                    </span>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="mb-2 text-sm font-semibold text-white/80" style={{ fontFamily: fontUi }}>
              Map Interaction
            </h3>
            <ul className="space-y-2 text-xs text-white/50" style={{ fontFamily: fontUi }}>
              <li>• Drag map to pan around sectors.</li>
              <li>• Scroll mousewheel to zoom in and out.</li>
              <li>• Hover on station nodes for status telemetry.</li>
              <li>• Tap node to enter station's living mural.</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
