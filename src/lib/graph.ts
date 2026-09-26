import { dateValue, type Dataset } from "./dataset";
import type { Entry } from "./schema";
import { STACK_LAYERS, type EdgeType, type SegmentId } from "./taxonomy";

export type Neighbor = { entry: Entry; edge: EdgeType; direction: "out" | "in"; depth: number };

/** Entries connected to `id` within `depth` hops, following edges both ways. */
const incomingCache = new WeakMap<Dataset, Map<string, { from: string; type: EdgeType }[]>>();
function incomingEdges(ds: Dataset) {
  let incoming = incomingCache.get(ds);
  if (!incoming) {
    incoming = new Map();
    for (const e of ds.entries) {
      for (const edge of e.edges) {
        incoming.set(edge.target, [...(incoming.get(edge.target) ?? []), { from: e.id, type: edge.type }]);
      }
    }
    incomingCache.set(ds, incoming);
  }
  return incoming;
}

export function neighborhood(ds: Dataset, id: string, depth = 1): Neighbor[] {
  const incoming = incomingEdges(ds);
  const seen = new Set([id]);
  const out: Neighbor[] = [];
  let frontier = [id];
  for (let d = 1; d <= depth; d++) {
    const next: string[] = [];
    for (const cur of frontier) {
      const links = [
        ...(ds.byId.get(cur)?.edges ?? []).map((e) => ({ other: e.target, type: e.type, direction: "out" as const })),
        ...(incoming.get(cur) ?? []).map((e) => ({ other: e.from, type: e.type, direction: "in" as const })),
      ];
      for (const l of links) {
        const entry = ds.byId.get(l.other);
        if (!entry || seen.has(l.other)) continue;
        seen.add(l.other);
        out.push({ entry, edge: l.type, direction: l.direction, depth: d });
        next.push(l.other);
      }
    }
    frontier = next;
  }
  return out;
}

/**
 * Alternatives to `id`: same stack layer and overlapping segment, ranked by
 * shared neighbours, explicit competes-with edges, then closeness in time.
 */
export function similar(ds: Dataset, id: string, k = 5): Entry[] {
  const self = ds.byId.get(id);
  if (!self) return [];
  const segs = new Set([self.primarySegment, ...self.secondarySegments]);
  const mine = new Set(neighborhood(ds, id).map((n) => n.entry.id));
  const competes = new Set(
    neighborhood(ds, id)
      .filter((n) => n.edge === "competes-with")
      .map((n) => n.entry.id),
  );
  const t = dateValue(self.date);
  return ds.entries
    .filter((e) => e.id !== id && e.type !== "person" && e.stackLayer === self.stackLayer)
    .filter((e) => segs.has(e.primarySegment) || e.secondarySegments.some((s) => segs.has(s)))
    .map((e) => {
      const shared = neighborhood(ds, e.id).filter((n) => mine.has(n.entry.id)).length;
      const score =
        (competes.has(e.id) ? 10 : 0) +
        (e.primarySegment === self.primarySegment ? 3 : 0) +
        shared * 2 -
        Math.abs(dateValue(e.date) - t) / 10;
      return { e, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.e);
}

export function stackPosition(ds: Dataset, id: string) {
  const entry = ds.byId.get(id);
  if (!entry) return undefined;
  const index = STACK_LAYERS.findIndex((l) => l.id === entry.stackLayer);
  return { layer: STACK_LAYERS[index], index, isSideRail: entry.stackLayer === "ops" };
}

/** successor-of chain from newest to oldest ancestor. */
export function lineage(ds: Dataset, id: string): Entry[] {
  const chain: Entry[] = [];
  let cur = ds.byId.get(id);
  const seen = new Set<string>();
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    chain.push(cur);
    const pred = cur.edges.find((e) => e.type === "successor-of");
    cur = pred ? ds.byId.get(pred.target) : undefined;
  }
  return chain;
}

export function peopleFor(ds: Dataset, id: string) {
  return ds.people.filter((p) => p.knownFor.includes(id));
}

export function updatesFor(ds: Dataset, id: string): Entry[] {
  return ds.entries.filter((e) => e.parentId === id).sort((a, b) => dateValue(a.date) - dateValue(b.date));
}

/** Ids matching any selected segment (primary or secondary). Empty selection matches all. */
export function entriesForSegments(ds: Dataset, segments: SegmentId[]): Set<string> {
  if (!segments.length) return new Set(ds.entries.map((e) => e.id));
  const want = new Set(segments);
  return new Set(
    ds.entries
      .filter((e) => want.has(e.primarySegment) || e.secondarySegments.some((s) => want.has(s)))
      .map((e) => e.id),
  );
}
