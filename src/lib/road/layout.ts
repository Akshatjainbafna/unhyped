import { dateValue } from "../dataset";
import type { Entry } from "../schema";
import { ERA_START_YEAR, SEGMENT_GROUPS, type EraId, type SegmentId } from "../taxonomy";

/**
 * Road coordinates: `s` is distance along the road (0 = Today, growing into the
 * past, negative = the future fork); `x` is lateral offset (0 = main highway).
 */
export type RoadNode = { id: string; s: number; x: number; lane: SegmentId; year: number };
export type LanePath = { segment: SegmentId; points: { s: number; x: number }[] };
export type Span = { sStart: number; sEnd: number };
export type EraBand = Span & { era: EraId };
export type DeadEnd = { id: string; s: number; x: number; dir: -1 | 1; length: number };
export type ForkPath = { scenario: "steady" | "plateau" | "takeoff"; points: { s: number; x: number }[] };

export type RoadGeometry = {
  now: number;
  length: number; // s of the campfire
  nodes: RoadNode[];
  lanes: LanePath[];
  eraBands: EraBand[];
  frozen: Span[];
  deadEnds: DeadEnd[];
  futureForks: ForkPath[];
  futureLength: number;
  /** Monotonic lookup tables so the director can map s ↔ year. */
  yearAt: (s: number) => number;
  sAt: (year: number) => number;
};

export type LayoutOptions = {
  viewport?: "desktop" | "mobile";
  /** Fractional year treated as "Today". */
  now?: number;
  minSpacing?: number;
  laneWidth?: number;
};

const LANE_ORDER: SegmentId[] = [
  ...SEGMENT_GROUPS.Foundations,
  ...SEGMENT_GROUPS.Capabilities,
  ...SEGMENT_GROUPS["The modern stack"],
  ...SEGMENT_GROUPS["Cross-cutting"],
];
const HIGHWAY: SegmentId = "foundation-models";

/** Signed lane slot, alternating either side of the highway: 0, 1, -1, 2, -2 … */
function laneSlot(segment: SegmentId): number {
  if (segment === HIGHWAY) return 0;
  const others = LANE_ORDER.filter((s) => s !== HIGHWAY);
  const i = others.indexOf(segment);
  const k = Math.floor(i / 2) + 1;
  return i % 2 === 0 ? k : -k;
}

/**
 * How far lanes sit from the highway at a given year: separate sub-fields in the
 * past, converging on the Transformer (2017–2021), branching into the modern stack after.
 */
export function laneSpread(year: number): number {
  const pts: [number, number][] = [
    [2012, 1],
    [2017, 0.25],
    [2021, 0.25],
    [2023.5, 1],
  ];
  if (year <= pts[0][0]) return pts[0][1];
  if (year >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
  for (let i = 1; i < pts.length; i++) {
    const [y1, v1] = pts[i];
    if (year <= y1) {
      const [y0, v0] = pts[i - 1];
      return v0 + ((year - y0) / (y1 - y0)) * (v1 - v0);
    }
  }
  return 1;
}

/** Recent years get more road per year than ancient ones. */
function timeDistance(yearsAgo: number): number {
  return 400 * Math.log1p(Math.max(0, yearsAgo) / 0.6);
}

export function layoutRoad(entries: Entry[], options: LayoutOptions = {}): RoadGeometry {
  const { viewport = "desktop", now = 2026.74, minSpacing = 6, laneWidth = 2.6 } = options;
  const mobile = viewport === "mobile";

  const sorted = entries
    .filter((e) => e.status === "published" && e.type !== "major-update")
    .map((e) => ({ e, year: dateValue(e.date) }))
    .sort((a, b) => b.year - a.year || a.e.id.localeCompare(b.e.id));

  // Walk from Today into the past; each node sits at its time distance, pushed
  // back just enough to keep minSpacing from the previous node.
  const nodes: RoadNode[] = [];
  const table: { s: number; year: number }[] = [{ s: 0, year: now }];
  let last = -Infinity;
  for (const { e, year } of sorted) {
    const s = Math.max(timeDistance(now - year), last + minSpacing);
    last = s;
    const x = mobile ? 0 : laneSlot(e.primarySegment) * laneWidth * laneSpread(year);
    nodes.push({ id: e.id, s, x, lane: e.primarySegment, year });
    table.push({ s, year });
  }
  const length = (nodes.at(-1)?.s ?? 0) + minSpacing * 4; // room for the campfire
  const oldest = sorted.at(-1)?.year ?? now - 1;
  table.push({ s: length, year: oldest - 1 });

  const yearAt = (s: number) => {
    if (s <= 0) return now + (-s / 40) * 0.5; // the future stretches gently
    for (let i = 1; i < table.length; i++) {
      if (s <= table[i].s) {
        const a = table[i - 1];
        const b = table[i];
        const t = b.s === a.s ? 0 : (s - a.s) / (b.s - a.s);
        return a.year + t * (b.year - a.year);
      }
    }
    return table.at(-1)!.year;
  };
  const sAt = (year: number) => {
    if (year >= now) return -((year - now) / 0.5) * 40;
    for (let i = 1; i < table.length; i++) {
      if (year >= table[i].year) {
        const a = table[i - 1];
        const b = table[i];
        const t = a.year === b.year ? 0 : (a.year - year) / (a.year - b.year);
        return a.s + t * (b.s - a.s);
      }
    }
    return length;
  };

  // Lanes run from their newest to their oldest node, following the spread curve.
  const bySegment = new Map<SegmentId, RoadNode[]>();
  for (const n of nodes) bySegment.set(n.lane, [...(bySegment.get(n.lane) ?? []), n]);
  const lanes: LanePath[] = [];
  if (!mobile) {
    for (const [segment, ns] of bySegment) {
      const from = ns[0].s;
      const to = ns.at(-1)!.s;
      const steps = Math.max(2, Math.ceil((to - from) / 10));
      const points = Array.from({ length: steps + 1 }, (_, i) => {
        const s = from + ((to - from) * i) / steps;
        return { s, x: laneSlot(segment) * laneWidth * laneSpread(yearAt(s)) };
      });
      lanes.push({ segment, points });
    }
  }

  const eraIds = (Object.keys(ERA_START_YEAR).map(Number) as Exclude<EraId, 8>[]).sort((a, b) => b - a);
  const eraBands: EraBand[] = [{ era: 8, sStart: -Infinity, sEnd: 0 }];
  let cursor = 0;
  for (const era of eraIds) {
    const start = ERA_START_YEAR[era];
    const sEnd = start === -Infinity ? length : Math.min(length, sAt(start));
    if (sEnd > cursor) eraBands.push({ era, sStart: cursor, sEnd });
    cursor = Math.max(cursor, sEnd);
  }

  const frozen: Span[] = [];
  const deadEnds: DeadEnd[] = [];
  for (const n of nodes) {
    const e = entries.find((x) => x.id === n.id)!;
    if (e.roadFeature === "frozen") {
      const endYear = e.endDate ? dateValue(e.endDate) : n.year + 5;
      frozen.push({ sStart: sAt(endYear), sEnd: n.s });
    }
    if (e.roadFeature === "dead-end") {
      deadEnds.push({ id: n.id, s: n.s, x: n.x, dir: n.x < 0 ? -1 : 1, length: laneWidth * 3 });
    }
  }

  const futureLength = 120;
  const futureForks: ForkPath[] = (["plateau", "steady", "takeoff"] as const).map((scenario, i) => {
    const side = i - 1;
    const points = Array.from({ length: 13 }, (_, k) => {
      const t = k / 12;
      return { s: -t * futureLength, x: side * laneWidth * 3 * Math.sin((t * Math.PI) / 2) };
    });
    return { scenario, points };
  });

  return { now, length, nodes, lanes, eraBands, frozen, deadEnds, futureForks, futureLength, yearAt, sAt };
}
