import type { Stop } from "./stops";

/**
 * Serpentine level-select layout. Rows of stops run alternately left→right and
 * right→left, joined by rounded connectors down the side; scene blocks sit
 * between rows with the road running past them. All units are map pixels.
 */
export type Scene = { id: string; at: number }; // appears before the first stop older than `at`

export type Seg =
  | { kind: "line"; x0: number; y0: number; x1: number; y1: number; len: number }
  | { kind: "arc"; cx: number; cy: number; r: number; a0: number; a1: number; len: number };

export type PlacedStop = { stop: Stop; x: number; y: number; row: number; tokenRows: number };
export type Block =
  | { kind: "row"; row: number; y: number; dir: 1 | -1; stops: PlacedStop[] }
  | { kind: "scene"; id: string; y: number; height: number; side: "left" | "right" };

export type Overworld = {
  width: number;
  height: number;
  blocks: Block[];
  stops: PlacedStop[];
  segs: Seg[];
  lanes: string[]; // SVG path per lane (4 families)
  road: string; // centre-line SVG path
  length: number;
  /** Map-y of the viewport focus → distance along the road. */
  keyframes: { y: number; len: number }[];
};

export type LayoutOptions = {
  width?: number;
  cols?: number;
  top?: number;
  sceneHeight?: number;
  tokenCols?: number;
  maxTokens?: number;
  radius?: number;
  laneGap?: number;
};

const TOKEN = 52; // token row pitch

export function layoutOverworld(stops: Stop[], scenes: Scene[], o: LayoutOptions = {}): Overworld {
  const { width = 1200, cols = 4, top = 120, sceneHeight = 470, tokenCols = 5, maxTokens = 20, radius = 64, laneGap = 13 } = o;
  const left = radius + 60;
  const right = width - radius - 60;
  const span = (right - left) / cols;

  // Split stops into rows, inserting scenes where their date is crossed.
  const pending = [...scenes].sort((a, b) => b.at - a.at);
  const blocks: Block[] = [];
  const placed: PlacedStop[] = [];
  let y = top;
  let row = 0;
  let dir: 1 | -1 = 1;
  let current: PlacedStop[] = [];

  const flushRow = () => {
    if (!current.length) return;
    const rowY = y + 70;
    const tokenRows = Math.max(1, ...current.map((p) => p.tokenRows));
    current.forEach((p, i) => {
      const slot = dir === 1 ? i : cols - 1 - i;
      p.x = left + span * (slot + 0.5);
      p.y = rowY;
    });
    blocks.push({ kind: "row", row, y: rowY, dir, stops: current });
    placed.push(...current);
    y = rowY + 48 + tokenRows * TOKEN + 40;
    row += 1;
    dir = dir === 1 ? -1 : 1;
    current = [];
  };

  for (const stop of stops) {
    while (pending.length && stop.to <= pending[0].at) {
      flushRow();
      const sc = pending.shift()!;
      blocks.push({ kind: "scene", id: sc.id, y: y + 30, height: sceneHeight, side: dir === 1 ? "left" : "right" });
      y += sceneHeight + 60;
    }
    const shown = Math.min(stop.tokens.length, maxTokens);
    current.push({ stop, x: 0, y: 0, row, tokenRows: Math.max(1, Math.ceil(shown / tokenCols)) });
    if (current.length === cols) flushRow();
  }
  flushRow();
  for (const sc of pending) {
    blocks.push({ kind: "scene", id: sc.id, y: y + 30, height: sceneHeight, side: dir === 1 ? "left" : "right" });
    y += sceneHeight + 60;
  }
  const height = y + 40;

  // Road geometry: each row is a line; consecutive rows join by a connector
  // (quarter arc, vertical run, quarter arc) on the side the row ends.
  const rows = blocks.filter((b): b is Extract<Block, { kind: "row" }> => b.kind === "row");
  const segs: Seg[] = [];
  const line = (x0: number, y0: number, x1: number, y1: number): Seg => ({ kind: "line", x0, y0, x1, y1, len: Math.hypot(x1 - x0, y1 - y0) });
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number): Seg => ({ kind: "arc", cx, cy, r, a0, a1, len: Math.abs(a1 - a0) * r });
  const rowStart = (r: (typeof rows)[number]) => (r.dir === 1 ? left : right);
  const rowEnd = (r: (typeof rows)[number]) => (r.dir === 1 ? right : left);

  // Lead-in from the top (the futures) down into the first row.
  const first = rows[0];
  if (first) segs.push(line(rowStart(first), top - 40, rowStart(first), first.y));
  rows.forEach((r, i) => {
    segs.push(line(rowStart(r), r.y, rowEnd(r), r.y));
    const next = rows[i + 1];
    const endX = rowEnd(r);
    const out = r.dir; // +1: turn on the right side, -1: on the left
    const toY = next ? next.y : r.y + 260; // tail runs down to the campfire
    segs.push(arc(endX, r.y + radius, radius, -Math.PI / 2, -Math.PI / 2 + (out * Math.PI) / 2));
    const sideX = endX + out * radius;
    segs.push(line(sideX, r.y + radius, sideX, toY - radius));
    if (next) segs.push(arc(endX, toY - radius, radius, out === 1 ? 0 : Math.PI, Math.PI / 2));
  });

  const toPath = (offset: number) => {
    let d = "";
    for (const s of segs) {
      if (s.kind === "line") {
        // Offset to the left of travel: rows shift in y, verticals in x.
        const horizontal = s.y0 === s.y1;
        // Verticals always shift +x so they meet both turns' offset radii.
        const sign = horizontal ? (s.x1 > s.x0 ? -1 : 1) : 1;
        const dx = horizontal ? 0 : sign * offset;
        const dy = horizontal ? sign * offset : 0;
        d += `${d ? "L" : "M"}${(s.x0 + dx).toFixed(1)} ${(s.y0 + dy).toFixed(1)} L${(s.x1 + dx).toFixed(1)} ${(s.y1 + dy).toFixed(1)} `;
      } else {
        // Right-side turns are clockwise (outer lanes on the outside), left-side turns counter-clockwise.
        const rightSide = Math.cos(s.a1) > 0.5 || Math.cos(s.a0) > 0.5;
        const r = s.r + (rightSide ? offset : -offset);
        const x1 = s.cx + r * Math.cos(s.a1);
        const y1 = s.cy + r * Math.sin(s.a1);
        const sweep = s.a1 > s.a0 ? 1 : 0;
        d += `A${r.toFixed(1)} ${r.toFixed(1)} 0 0 ${sweep} ${x1.toFixed(1)} ${y1.toFixed(1)} `;
      }
    }
    return d.trim();
  };
  const lanes = [-1.5, -0.5, 0.5, 1.5].map((k) => toPath(k * laneGap));
  const roadPath = toPath(0);
  const length = segs.reduce((a, s) => a + s.len, 0);

  // Scroll mapping: walking a row while you scroll through it, turning while
  // you scroll through the gap (and any scene) below it.
  const keyframes: { y: number; len: number }[] = [{ y: top - 200, len: 0 }];
  let acc = segs[0]?.len ?? 0;
  keyframes.push({ y: first ? first.y - 120 : top, len: acc });
  let si = 1;
  rows.forEach((r, i) => {
    const rowLen = segs[si].len;
    keyframes.push({ y: r.y + 40, len: acc + rowLen });
    acc += rowLen;
    si += 1;
    const next = rows[i + 1];
    const turn = segs[si].len + segs[si + 1].len + (next ? segs[si + 2].len : 0);
    keyframes.push({ y: next ? next.y - 120 : r.y + 400, len: acc + turn });
    acc += turn;
    si += next ? 3 : 2;
  });

  return { width, height, blocks, stops: placed, segs, lanes, road: roadPath, length, keyframes };
}

/** Distance along the road for a map-y focus point (piecewise linear, clamped). */
export function lengthAt(ow: Overworld, y: number): number {
  const k = ow.keyframes;
  if (y <= k[0].y) return 0;
  for (let i = 1; i < k.length; i++) {
    if (y <= k[i].y) {
      const t = (y - k[i - 1].y) / (k[i].y - k[i - 1].y || 1);
      return k[i - 1].len + t * (k[i].len - k[i - 1].len);
    }
  }
  return k[k.length - 1].len;
}

/** Point and heading on the centre line at distance `len`. */
export function pointAt(ow: Overworld, len: number): { x: number; y: number; dx: number } {
  let rest = Math.max(0, Math.min(len, ow.length));
  for (const s of ow.segs) {
    if (rest <= s.len || s === ow.segs[ow.segs.length - 1]) {
      const t = s.len ? Math.min(1, rest / s.len) : 0;
      if (s.kind === "line") return { x: s.x0 + (s.x1 - s.x0) * t, y: s.y0 + (s.y1 - s.y0) * t, dx: Math.sign(s.x1 - s.x0) };
      const a = s.a0 + (s.a1 - s.a0) * t;
      return { x: s.cx + s.r * Math.cos(a), y: s.cy + s.r * Math.sin(a), dx: -Math.sign(Math.sin(a)) * Math.sign(s.a1 - s.a0) };
    }
    rest -= s.len;
  }
  return { x: 0, y: 0, dx: 1 };
}

/** Distance along the road of a point on one of the row segments (e.g. a stop). */
export function lengthAtPoint(ow: Overworld, x: number, y: number): number {
  let acc = 0;
  for (const s of ow.segs) {
    if (s.kind === "line" && s.y0 === s.y1 && Math.abs(s.y0 - y) < 0.5 && x >= Math.min(s.x0, s.x1) - 0.5 && x <= Math.max(s.x0, s.x1) + 0.5) {
      return acc + Math.abs(x - s.x0);
    }
    acc += s.len;
  }
  return 0;
}

/** Inverse of lengthAt: the focus y at which the traveller reaches `len`. */
export function yAtLength(ow: Overworld, len: number): number {
  const k = ow.keyframes;
  for (let i = 1; i < k.length; i++) {
    if (len <= k[i].len) {
      const t = (len - k[i - 1].len) / (k[i].len - k[i - 1].len || 1);
      return k[i - 1].y + t * (k[i].y - k[i - 1].y);
    }
  }
  return k[k.length - 1].y;
}
