import { useEffect, useRef, useState } from 'react';
import { Pencil, ThumbsUp, Lightbulb, Music, Trash2, Play, Square } from 'lucide-react';
import { LINE_LIST } from '../lib/mockData';
import { GlassCard, PageHeader, fontUi } from '../components/ui';

type Tab = 'sketch' | 'vote' | 'lighting' | 'melody';

const TABS: { id: Tab; label: string; icon: typeof Pencil }[] = [
  { id: 'sketch', label: 'Sketch Pad', icon: Pencil },
  { id: 'vote', label: 'Theme Voting', icon: ThumbsUp },
  { id: 'lighting', label: 'Lighting Designer', icon: Lightbulb },
  { id: 'melody', label: 'Melody Sequencer', icon: Music },
];

const STROKE_COLORS = ['#ffffff', ...LINE_LIST.map((l) => l.color)];

interface Theme {
  id: string;
  name: string;
  votes: number;
  color: string;
  description: string;
}

const INITIAL_THEMES: Theme[] = [
  {
    id: 'tide',
    name: 'Bioluminescent Tide',
    votes: 3120,
    color: LINE_LIST[3].color,
    description: 'Slow cyan-green waves that ripple across the platform ceiling.',
  },
  {
    id: 'cranes',
    name: 'Paper Cranes',
    votes: 4780,
    color: LINE_LIST[1].color,
    description: 'Folded-paper geometry drifting down the walls in soft pinks.',
  },
  {
    id: 'static',
    name: 'Neon Static',
    votes: 1940,
    color: LINE_LIST[2].color,
    description: 'Glitch-bright violet noise, redrawn with every passing train.',
  },
  {
    id: 'bloom',
    name: 'Midnight Bloom',
    votes: 2650,
    color: LINE_LIST[0].color,
    description: 'Deep blues blooming into pale light at each platform edge.',
  },
];

type Pattern = 'Pulse' | 'Sweep' | 'Flicker' | 'Steady';
const PATTERNS: Pattern[] = ['Pulse', 'Sweep', 'Flicker', 'Steady'];

const COLS = 8;

const INITIAL_GRID: boolean[][] = [
  [true, false, false, true, false, false, true, false],
  [false, false, true, false, false, true, false, false],
  [false, true, false, false, true, false, false, true],
  [false, false, false, true, false, false, false, true],
];

export default function Create() {
  const [tab, setTab] = useState<Tab>('sketch');

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Create"
        title="Leave Your Mark"
        subtitle="Every sketch, vote, light rig, and melody you leave here gets blended by the network's AI into a station wall that no one has ever seen before."
      />

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                active ? 'bg-white text-black' : 'liquid-glass text-white/70 hover:text-white'
              }`}
              style={{ fontFamily: fontUi }}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {tab === 'sketch' && <SketchPad />}
        {tab === 'vote' && <ThemeVoting />}
        {tab === 'lighting' && <LightingDesigner />}
        {tab === 'melody' && <MelodySequencer />}
      </div>
    </div>
  );
}

function SketchPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const [color, setColor] = useState(STROKE_COLORS[0]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    lastPoint.current = getPos(e);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPoint.current = pos;
  }

  function handlePointerUp() {
    isDrawing.current = false;
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl text-white">Sketch Pad</h3>
          <p className="mt-1 text-sm text-white/60" style={{ fontFamily: fontUi }}>
            Freehand a mark for the wall. The network will blend it in.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {STROKE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Choose color ${c}`}
                onClick={() => setColor(c)}
                className="h-7 w-7 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  boxShadow: color === c ? `0 0 0 2px #06070c, 0 0 0 4px ${c}` : '0 0 0 1px rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="glass-btn-secondary liquid-glass"
            style={{ fontFamily: fontUi }}
          >
            <Trash2 size={15} />
            Clear
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={1200}
        height={460}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="liquid-glass mt-6 h-[420px] w-full touch-none rounded-2xl sm:h-[460px]"
        style={{ cursor: 'crosshair' }}
      />
    </GlassCard>
  );
}

function ThemeVoting() {
  const [themes, setThemes] = useState<Theme[]>(INITIAL_THEMES);
  const [votedId, setVotedId] = useState<string | null>(null);

  function handleVote(id: string) {
    setThemes((prev) => prev.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t)));
    setVotedId(id);
  }

  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl text-white">Theme Voting</h3>
        <p className="mx-auto mt-1 max-w-xl text-sm text-white/60" style={{ fontFamily: fontUi }}>
          Cast a vote for the theme you want the AI to weave into the next generation.
        </p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {themes.map((theme) => {
          const voted = votedId === theme.id;
          return (
            <div
              key={theme.id}
              className="rounded-3xl transition-shadow"
              style={{ boxShadow: voted ? `0 0 0 2px ${theme.color}` : 'none' }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: theme.color }} />
                  <h4 className="text-xl text-white">{theme.name}</h4>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/60" style={{ fontFamily: fontUi }}>
                  {theme.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-white/50" style={{ fontFamily: fontUi }}>
                    {theme.votes.toLocaleString()} votes
                  </span>
                  <button
                    type="button"
                    onClick={() => handleVote(theme.id)}
                    className={voted ? 'glass-btn-primary' : 'glass-btn-secondary liquid-glass'}
                    style={{ fontFamily: fontUi }}
                  >
                    <ThumbsUp size={14} />
                    {voted ? 'Voted' : 'Vote'}
                  </button>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LightingDesigner() {
  const [color, setColor] = useState(LINE_LIST[0].color);
  const [pattern, setPattern] = useState<Pattern>('Pulse');

  const patternClass =
    pattern === 'Pulse'
      ? 'lighting-pulse-strip'
      : pattern === 'Sweep'
        ? 'lighting-sweep-strip'
        : pattern === 'Flicker'
          ? 'lighting-flicker-strip'
          : 'lighting-steady-strip';

  const previewStyle =
    pattern === 'Sweep'
      ? {
          backgroundImage: `linear-gradient(90deg, transparent 0%, ${color} 45%, ${color} 55%, transparent 100%)`,
        }
      : {
          backgroundColor: color,
          boxShadow: `0 0 40px 8px ${color}66, 0 0 90px 20px ${color}33`,
        };

  return (
    <GlassCard className="p-6 sm:p-8">
      <h3 className="text-2xl text-white">Lighting Designer</h3>
      <p className="mt-1 text-sm text-white/60" style={{ fontFamily: fontUi }}>
        Tune the color and rhythm of the platform's light rig.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-white/40" style={{ fontFamily: fontUi }}>
            Color
          </div>
          <div className="flex items-center gap-2">
            {LINE_LIST.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-label={`Choose ${l.name} color`}
                onClick={() => setColor(l.color)}
                className="h-8 w-8 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: l.color,
                  boxShadow: color === l.color ? `0 0 0 2px #06070c, 0 0 0 4px ${l.color}` : '0 0 0 1px rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-white/40" style={{ fontFamily: fontUi }}>
            Pattern
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPattern(p)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  pattern === p ? 'bg-white text-black' : 'liquid-glass text-white/70 hover:text-white'
                }`}
                style={{ fontFamily: fontUi }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 h-16 w-full overflow-hidden rounded-full bg-white/5 sm:h-20">
        <div key={`${pattern}-${color}`} className={`h-full w-full rounded-full ${patternClass}`} style={previewStyle} />
      </div>
    </GlassCard>
  );
}

const NOTES = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 — always harmonious together

function MelodySequencer() {
  const [grid, setGrid] = useState<boolean[][]>(INITIAL_GRID);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const gridRef = useRef(grid);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  function ensureAudioContext() {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }

  function playNote(freq: number) {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.26);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.27);
  }

  function playColumn(col: number) {
    gridRef.current.forEach((row, ri) => {
      if (row[col]) playNote(NOTES[ri % NOTES.length]);
    });
  }

  useEffect(() => {
    if (!playing) {
      setStep(-1);
      return;
    }
    let current = -1;
    const tick = () => {
      current = (current + 1) % COLS;
      setStep(current);
      playColumn(current);
    };
    tick();
    const id = setInterval(tick, 300);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  function handleTogglePlaying() {
    if (!playing) ensureAudioContext();
    setPlaying((p) => !p);
  }

  function toggleCell(row: number, col: number) {
    setGrid((prev) => prev.map((r, ri) => (ri === row ? r.map((c, ci) => (ci === col ? !c : c)) : r)));
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl text-white">Melody Sequencer</h3>
          <p className="mt-1 text-sm text-white/60" style={{ fontFamily: fontUi }}>
            Lay down a loop. Each row is a line's voice in the station's melody.
          </p>
        </div>
        <button
          type="button"
          onClick={handleTogglePlaying}
          className={playing ? 'glass-btn-secondary liquid-glass' : 'glass-btn-primary'}
          style={{ fontFamily: fontUi }}
        >
          {playing ? <Square size={15} /> : <Play size={15} />}
          {playing ? 'Stop' : 'Play'}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        {grid.map((row, ri) => (
          <div key={ri} className="flex gap-2.5">
            {row.map((active, ci) => {
              const lineColor = LINE_LIST[ri % LINE_LIST.length].color;
              const isPlayhead = step === ci;
              return (
                <button
                  key={ci}
                  type="button"
                  onClick={() => toggleCell(ri, ci)}
                  aria-pressed={active}
                  className="liquid-glass h-9 flex-1 rounded-lg transition-all sm:h-11"
                  style={{
                    backgroundColor: active ? lineColor : undefined,
                    opacity: active ? 0.9 : 1,
                    boxShadow: isPlayhead ? '0 0 0 2px rgba(255,255,255,0.8)' : undefined,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
