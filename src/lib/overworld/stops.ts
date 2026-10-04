import { dateValue, type Dataset } from "../dataset";
import type { Entry } from "../schema";
import { ERA_START_YEAR, SEGMENT_GROUPS, type EraId, type SegmentId } from "../taxonomy";

/**
 * Time buckets for the 2D overworld. Recent history is dense, so the map gets
 * finer as it approaches today: months for 2022+, years for 2012–2021,
 * decades for 1940–2011, and broad periods before that.
 */
export type Token = {
  key: string;
  entryId: string; // the entry to open (a major update opens its parent)
  title: string;
  segment: SegmentId;
  group: number; // 0 Foundations · 1 Capabilities · 2 Modern stack · 3 Cross-cutting
  type: Entry["type"] | "update";
  date: string;
  /** Other launches/updates of the same product in this stop, folded into this token. */
  more: number;
};

export type Stop = {
  key: string;
  label: string; // short, for the plaque
  long: string; // for cards and the HUD
  kind: "month" | "year" | "decade" | "period";
  from: number; // fractional years, inclusive
  to: number; // exclusive
  era: EraId;
  tokens: Token[]; // one per product
  events: number; // launches + updates, counting folded ones
};

const GROUP_KEYS = Object.keys(SEGMENT_GROUPS) as (keyof typeof SEGMENT_GROUPS)[];
export const groupOf = (s: SegmentId) =>
  GROUP_KEYS.findIndex((g) => (SEGMENT_GROUPS[g] as readonly string[]).includes(s));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function eraAt(year: number): EraId {
  let era: EraId = 0;
  for (const [id, start] of Object.entries(ERA_START_YEAR)) if (year >= start) era = Number(id) as EraId;
  return era;
}

/** Bucket key for a partial date. */
export function bucketOf(date: string): string {
  const neg = date.startsWith("-");
  const [ys, ms] = (neg ? date.slice(1) : date).split("-");
  const y = Number(ys) * (neg ? -1 : 1);
  if (y >= 2022) return `${y}-${ms ?? "01"}`;
  if (y >= 2012) return `${y}`;
  if (y >= 1940) return `${Math.floor(y / 10) * 10}s`;
  if (y >= 1800) return "1800-1939";
  if (y >= 1000) return "1000-1799";
  return "antiquity";
}

function stopFor(key: string): Omit<Stop, "tokens" | "era" | "events"> {
  if (/^\d{4}-\d{2}$/.test(key)) {
    const [y, m] = key.split("-").map(Number);
    return { key, label: `${MONTHS[m - 1]} '${String(y).slice(2)}`, long: `${MONTHS_LONG[m - 1]} ${y}`, kind: "month", from: y + (m - 1) / 12, to: y + m / 12 };
  }
  if (/^\d{4}$/.test(key)) return { key, label: key, long: key, kind: "year", from: Number(key), to: Number(key) + 1 };
  if (/^\d{4}s$/.test(key)) {
    const d = Number(key.slice(0, 4));
    return { key, label: key, long: `The ${key}`, kind: "decade", from: d, to: d + 10 };
  }
  if (key === "1800-1939") return { key, label: "1800–1939", long: "1800 to 1939", kind: "period", from: 1800, to: 1940 };
  if (key === "1000-1799") return { key, label: "1300s–1700s", long: "The 1300s to the 1700s", kind: "period", from: 1000, to: 1800 };
  return { key, label: "Antiquity", long: "Antiquity", kind: "period", from: -4000, to: 1000 };
}

/** Every stop from `now` back to antiquity, newest first; months and years are never skipped. */
export function buildStops(ds: Dataset, now = { year: 2026, month: 10 }): Stop[] {
  const keys: string[] = [];
  for (let y = now.year; y >= 2022; y--) {
    for (let m = y === now.year ? now.month : 12; m >= 1; m--) keys.push(`${y}-${String(m).padStart(2, "0")}`);
  }
  for (let y = 2021; y >= 2012; y--) keys.push(String(y));
  for (let d = 2000; d >= 1940; d -= 10) keys.push(`${d}s`);
  keys.push("1800-1939", "1000-1799", "antiquity");

  const tokens = new Map<string, Token[]>(keys.map((k) => [k, []]));
  const push = (date: string, t: Omit<Token, "date" | "more">) => tokens.get(bucketOf(date))?.push({ ...t, date, more: 0 });
  for (const e of ds.entries) {
    if (e.type === "person" || e.status !== "published") continue;
    const base = { segment: e.primarySegment, group: groupOf(e.primarySegment) };
    push(e.date, { ...base, key: e.id, entryId: e.id, title: e.title, type: e.type });
    e.majorUpdates.forEach((u, i) =>
      push(u.date, { ...base, key: `${e.id}#${i}`, entryId: e.id, title: `${e.title}: ${u.title}`, type: "update" }),
    );
  }
  return keys
    .map((k) => {
      const s = stopFor(k);
      // One token per product: keep the launch itself if it is here, else its
      // newest update, and fold the rest into a count.
      const byEntry = new Map<string, Token[]>();
      for (const t of tokens.get(k) ?? []) byEntry.set(t.entryId, [...(byEntry.get(t.entryId) ?? []), t]);
      const list = [...byEntry.values()]
        .map((group) => {
          const lead = group.find((t) => t.type !== "update") ?? group.sort((a, b) => dateValue(b.date) - dateValue(a.date))[0];
          return { ...lead, more: group.length - 1 };
        })
        .sort((a, b) => dateValue(b.date) - dateValue(a.date));
      const events = list.reduce((n, t) => n + 1 + t.more, 0);
      return { ...s, era: eraAt(s.from), tokens: list, events };
    })
    .filter((s) => s.kind === "month" || s.kind === "year" || s.tokens.length > 0);
}
