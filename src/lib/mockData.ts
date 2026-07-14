export type LineId = 'pulse' | 'bloom' | 'nova' | 'current';

export interface Line {
  id: LineId;
  name: string;
  color: string;
}

export const LINES: Record<LineId, Line> = {
  pulse: { id: 'pulse', name: 'Pulse Line', color: '#007BFF' },
  bloom: { id: 'bloom', name: 'Bloom Line', color: '#FF2D7A' },
  nova: { id: 'nova', name: 'Nova Line', color: '#7A3CFF' },
  current: { id: 'current', name: 'Current Line', color: '#00E5FF' },
};

export const LINE_LIST = Object.values(LINES);

export interface Station {
  slug: string;
  name: string;
  lines: LineId[];
  mood: string;
  generation: number;
  contributions: number;
  palette: string[];
  blurb: string;
}

export const STATIONS: Station[] = [
  {
    slug: 'harborlight',
    name: 'Harborlight',
    lines: ['pulse'],
    mood: 'Wistful & Blue',
    generation: 14,
    contributions: 18422,
    palette: ['#007BFF', '#4DA3FF', '#0A2540'],
    blurb: 'A slow tide of cool blues, drawn by commuters who ride in before sunrise.',
  },
  {
    slug: 'founders-square',
    name: 'Founders Square',
    lines: ['pulse', 'bloom', 'nova'],
    mood: 'Electric Convergence',
    generation: 41,
    contributions: 96110,
    palette: ['#007BFF', '#FF2D7A', '#7A3CFF'],
    blurb: 'The three-line hub — the most-painted wall in the network, always mid-transformation.',
  },
  {
    slug: 'lumen-court',
    name: 'Lumen Court',
    lines: ['pulse'],
    mood: 'Golden & Slow',
    generation: 9,
    contributions: 8890,
    palette: ['#007BFF', '#FFD400', '#12294a'],
    blurb: 'Riders vote for warm light here more than anywhere else on the Pulse Line.',
  },
  {
    slug: 'meridian-park',
    name: 'Meridian Park',
    lines: ['pulse', 'current'],
    mood: 'Crisp & Kinetic',
    generation: 27,
    contributions: 41230,
    palette: ['#007BFF', '#00E5FF', '#062033'],
    blurb: 'A transfer platform that hums — half Pulse blue, half Current cyan, always shifting.',
  },
  {
    slug: 'sector-9',
    name: 'Sector 9',
    lines: ['pulse'],
    mood: 'Blank Canvas',
    generation: 0,
    contributions: 12,
    palette: ['#1a1c24', '#2a2d38', '#3a3e4d'],
    blurb: 'Newly opened. Undecorated. Waiting for its first thousand marks.',
  },
  {
    slug: 'bloom-district',
    name: 'Bloom District',
    lines: ['bloom'],
    mood: 'Blossoming',
    generation: 33,
    contributions: 58210,
    palette: ['#FF2D7A', '#FF8FB8', '#3a0a1f'],
    blurb: 'Named for what it became: a station that grows a little more color every week.',
  },
  {
    slug: 'paper-rain-plaza',
    name: 'Paper Rain Plaza',
    lines: ['bloom'],
    mood: 'Gentle Melancholy',
    generation: 21,
    contributions: 30450,
    palette: ['#FF2D7A', '#C4B5FD', '#241035'],
    blurb: 'Origami-fold murals drift down the platform walls, redrawn every generation.',
  },
  {
    slug: 'velvet-crossing',
    name: 'Velvet Crossing',
    lines: ['bloom'],
    mood: 'Late-Night Romance',
    generation: 19,
    contributions: 27640,
    palette: ['#FF2D7A', '#7A3CFF', '#1a0a24'],
    blurb: 'The Bloom Line at its most theatrical — deep magenta, low light, slow melodies.',
  },
  {
    slug: 'quartz-hollow',
    name: 'Quartz Hollow',
    lines: ['bloom'],
    mood: 'Faceted & Cool',
    generation: 12,
    contributions: 15870,
    palette: ['#FF2D7A', '#E5D9F2', '#241a2e'],
    blurb: 'Riders sketch crystalline geometry here more than any other station on the network.',
  },
  {
    slug: 'inkwell-junction',
    name: 'Inkwell Junction',
    lines: ['nova'],
    mood: 'Ink & Static',
    generation: 37,
    contributions: 63980,
    palette: ['#7A3CFF', '#C4B5FD', '#170a2e'],
    blurb: 'Where the Nova Line’s sketch pads run darkest — violet ink on a near-black wall.',
  },
  {
    slug: 'glasswing',
    name: 'Glasswing',
    lines: ['nova'],
    mood: 'Iridescent',
    generation: 24,
    contributions: 34210,
    palette: ['#7A3CFF', '#00E5FF', '#140a2a'],
    blurb: 'Named after the murals that shimmer between violet and cyan as trains pass.',
  },
  {
    slug: 'prism-heights',
    name: 'Prism Heights',
    lines: ['nova'],
    mood: 'Refracted Light',
    generation: 16,
    contributions: 19340,
    palette: ['#7A3CFF', '#FFD400', '#1c1030'],
    blurb: 'A lighting-designer favorite — split-beam rigs voted in three generations running.',
  },
  {
    slug: 'sunken-pier',
    name: 'Sunken Pier',
    lines: ['nova'],
    mood: 'Deep & Quiet',
    generation: 8,
    contributions: 9120,
    palette: ['#7A3CFF', '#2a1a40', '#0c0818'],
    blurb: 'The network’s quietest station — slow melodies, low light, few but devoted marks.',
  },
  {
    slug: 'cyan-falls',
    name: 'Cyan Falls',
    lines: ['current'],
    mood: 'Rushing & Bright',
    generation: 30,
    contributions: 47650,
    palette: ['#00E5FF', '#8EFF3C', '#052a2e'],
    blurb: 'A waterfall-motif mural, redrawn every era by the riders who name it home.',
  },
  {
    slug: 'driftwood-yard',
    name: 'Driftwood Yard',
    lines: ['current'],
    mood: 'Weathered Calm',
    generation: 11,
    contributions: 13580,
    palette: ['#00E5FF', '#8EFF3C', '#0a2626'],
    blurb: 'Sea-worn textures and slow tides — the Current Line’s most contemplative stop.',
  },
  {
    slug: 'thistle-court',
    name: 'Thistle Court',
    lines: ['current'],
    mood: 'Prickly & Playful',
    generation: 22,
    contributions: 28990,
    palette: ['#00E5FF', '#FF2D7A', '#062a2f'],
    blurb: 'A cyan-and-magenta clash that somehow always resolves into something riders love.',
  },
  {
    slug: 'halcyon-row',
    name: 'Halcyon Row',
    lines: ['current'],
    mood: 'Serene',
    generation: 18,
    contributions: 22140,
    palette: ['#00E5FF', '#F5F3EE', '#062329'],
    blurb: 'Soft-focus murals and gentle melody loops — the calmest platform on the network.',
  },
  {
    slug: 'amber-terminus',
    name: 'Amber Terminus',
    lines: ['current'],
    mood: 'Warm Farewell',
    generation: 26,
    contributions: 35720,
    palette: ['#00E5FF', '#FFD400', '#062329'],
    blurb: 'The Current Line’s final stop — amber light washes over cyan as trains turn back.',
  },
];

export const STATION_ORDER: Record<LineId, string[]> = {
  pulse: ['harborlight', 'founders-square', 'lumen-court', 'meridian-park', 'sector-9'],
  bloom: ['bloom-district', 'paper-rain-plaza', 'founders-square', 'velvet-crossing', 'quartz-hollow'],
  nova: ['inkwell-junction', 'founders-square', 'glasswing', 'prism-heights', 'sunken-pier'],
  current: ['cyan-falls', 'meridian-park', 'driftwood-yard', 'thistle-court', 'halcyon-row', 'amber-terminus'],
};

export function getStation(slug: string): Station | undefined {
  return STATIONS.find((s) => s.slug === slug);
}

export interface Train {
  id: string;
  lineId: LineId;
  position: number; 
  direction: 1 | -1;
}

export const TRAINS: Train[] = [
  { id: 'pulse-01', lineId: 'pulse', position: 0.12, direction: 1 },
  { id: 'pulse-02', lineId: 'pulse', position: 0.68, direction: -1 },
  { id: 'bloom-01', lineId: 'bloom', position: 0.3, direction: 1 },
  { id: 'bloom-02', lineId: 'bloom', position: 0.82, direction: -1 },
  { id: 'nova-01', lineId: 'nova', position: 0.5, direction: 1 },
  { id: 'nova-02', lineId: 'nova', position: 0.05, direction: 1 },
  { id: 'current-01', lineId: 'current', position: 0.4, direction: 1 },
  { id: 'current-02', lineId: 'current', position: 0.9, direction: -1 },
];

export interface Incident {
  id: string;
  lineId: LineId;
  message: string;
}

export const INCIDENTS: Incident[] = [
  { id: 'inc-1', lineId: 'nova', message: 'Nova Line: brief pressure-seal delay near Glasswing, capsules slowed 20%.' },
];

export interface GalleryEra {
  id: string;
  stationSlug: string;
  stationName: string;
  generation: number;
  palette: string[];
  archivedOn: string;
  summary: string;
}

export const GALLERY_ERAS: GalleryEra[] = [
  { id: 'era-1', stationSlug: 'founders-square', stationName: 'Founders Square', generation: 40, palette: ['#007BFF', '#FF2D7A', '#7A3CFF'], archivedOn: '2038-06-02', summary: 'The Tricolor Era — three lines’ palettes fully merged for the first time.' },
  { id: 'era-2', stationSlug: 'bloom-district', stationName: 'Bloom District', generation: 32, palette: ['#FF2D7A', '#FF8FB8', '#3a0a1f'], archivedOn: '2038-05-21', summary: 'The Petal Fall Era — 25 consecutive floral-theme votes.' },
  { id: 'era-3', stationSlug: 'inkwell-junction', stationName: 'Inkwell Junction', generation: 36, palette: ['#7A3CFF', '#C4B5FD', '#170a2e'], archivedOn: '2038-05-14', summary: 'The Static Ink Era — sketch pad contributions up 240%.' },
  { id: 'era-4', stationSlug: 'cyan-falls', stationName: 'Cyan Falls', generation: 29, palette: ['#00E5FF', '#8EFF3C', '#052a2e'], archivedOn: '2038-04-30', summary: 'The Rushing Era — melody contributions synced into one looping anthem.' },
  { id: 'era-5', stationSlug: 'meridian-park', stationName: 'Meridian Park', generation: 26, palette: ['#007BFF', '#00E5FF', '#062033'], archivedOn: '2038-04-11', summary: 'The Split Platform Era — Pulse and Current riders each claimed a half.' },
  { id: 'era-6', stationSlug: 'velvet-crossing', stationName: 'Velvet Crossing', generation: 18, palette: ['#FF2D7A', '#7A3CFF', '#1a0a24'], archivedOn: '2038-03-27', summary: 'The Late Bloom Era — a night-only lighting theme, voted in for six weeks straight.' },
];

export interface Thought {
  id: string;
  text: string;
}

export const THOUGHTS: Thought[] = [
  { id: 't1', text: 'Blending 214 new sketches into Founders Square — the wall is leaning violet tonight.' },
  { id: 't2', text: 'Cyan Falls just crossed 47,000 contributions. Its wall has never repeated a pattern.' },
  { id: 't3', text: 'A commuter on the Nova Line hummed something in D minor. It is now part of Glasswing’s melody.' },
  { id: 't4', text: 'Sector 9 received its first vote. A single yellow brushstroke, alone on a dark wall.' },
  { id: 't5', text: 'Regenerative braking on the Pulse Line recovered 3.2 MWh in the last hour.' },
  { id: 't6', text: 'Bloom District is entering its 34th generation. I am archiving the Petal Fall era now.' },
  { id: 't7', text: 'Two riders at Meridian Park voted for opposite themes within the same second. I split the wall.' },
  { id: 't8', text: 'The Current Line is running four minutes ahead of schedule. Nobody asked me to notice, but I did.' },
];

export interface SavedJourney {
  id: string;
  from: string;
  to: string;
  savedOn: string;
  energyKwh: number;
}

export const ENERGY_STATS = {
  recoveredTodayKwh: 4820,
  homesPowered: 138,
  co2AvoidedKg: 2760,
};
