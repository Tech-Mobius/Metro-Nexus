import { STATION_ORDER, type LineId } from './mockData';

interface Edge {
  to: string;
  lineId: LineId;
}

function buildGraph(): Map<string, Edge[]> {
  const graph = new Map<string, Edge[]>();
  const addEdge = (a: string, b: string, lineId: LineId) => {
    if (!graph.has(a)) graph.set(a, []);
    graph.get(a)!.push({ to: b, lineId });
  };
  for (const [lineId, order] of Object.entries(STATION_ORDER) as [LineId, string[]][]) {
    for (let i = 0; i < order.length - 1; i++) {
      addEdge(order[i], order[i + 1], lineId);
      addEdge(order[i + 1], order[i], lineId);
    }
  }
  return graph;
}

const GRAPH = buildGraph();

export interface RouteStep {
  slug: string;
  lineId: LineId | null; // line used to arrive at this station (null for the origin)
}

export interface PlannedRoute {
  steps: RouteStep[];
  transfers: number;
  minutes: number;
}

export function planRoute(fromSlug: string, toSlug: string): PlannedRoute | null {
  if (fromSlug === toSlug) return { steps: [{ slug: fromSlug, lineId: null }], transfers: 0, minutes: 0 };

  const visited = new Set<string>([fromSlug]);
  const queue: string[] = [fromSlug];
  const prev = new Map<string, { from: string; lineId: LineId }>();

  while (queue.length) {
    const current = queue.shift()!;
    if (current === toSlug) break;
    for (const edge of GRAPH.get(current) ?? []) {
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      prev.set(edge.to, { from: current, lineId: edge.lineId });
      queue.push(edge.to);
    }
  }

  if (!visited.has(toSlug)) return null;

  const steps: RouteStep[] = [];
  let cursor: string | undefined = toSlug;
  while (cursor) {
    const entry = prev.get(cursor);
    steps.unshift({ slug: cursor, lineId: entry?.lineId ?? null });
    cursor = entry?.from;
  }

  let transfers = 0;
  for (let i = 2; i < steps.length; i++) {
    if (steps[i].lineId !== steps[i - 1].lineId) transfers++;
  }

  const minutes = Math.max(2, (steps.length - 1) * 3 + transfers * 4);

  return { steps, transfers, minutes };
}
