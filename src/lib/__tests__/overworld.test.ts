import { describe, expect, it } from "vitest";
import { buildDataset } from "../dataset";
import { layoutOverworld, lengthAt, pointAt } from "../overworld/layout";
import { bucketOf, buildStops } from "../overworld/stops";
import { entry, fixtureEntries, fixtureRaw } from "./fixtures";

// Pinned so the expectations do not move when the site's "now" does.
const NOW = { year: 2026, month: 9 };
const ds = buildDataset({
  ...fixtureRaw,
  entries: [...fixtureEntries.map((e) => (e.id === "claude" ? { ...e, majorUpdates: [{ date: "2026-08-20", title: "Update", summary: "s" }] } : e))],
});

describe("overworld stops", () => {
  it("buckets by month, year, decade and period", () => {
    expect(bucketOf("2026-08-20")).toBe("2026-08");
    expect(bucketOf("2023")).toBe("2023-01");
    expect(bucketOf("2017-06-12")).toBe("2017");
    expect(bucketOf("1986")).toBe("1980s");
    expect(bucketOf("1843")).toBe("1800-1939");
    expect(bucketOf("-150")).toBe("antiquity");
  });

  it("lists every month since 2022 and every year 2012–2021, newest first, even when empty", () => {
    const stops = buildStops(ds, NOW);
    expect(stops[0].key).toBe("2026-09");
    const months = stops.filter((s) => s.kind === "month");
    expect(months).toHaveLength(12 * 4 + 9);
    expect(stops.filter((s) => s.kind === "year").map((s) => s.key)).toEqual(["2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"]);
    for (let i = 1; i < stops.length; i++) expect(stops[i].from).toBeLessThan(stops[i - 1].from);
  });

  it("drops empty decades and periods but keeps their populated ones", () => {
    const keys = buildStops(ds, NOW).map((s) => s.key);
    expect(keys).toContain("1980s");
    expect(keys).toContain("1970s");
    expect(keys).not.toContain("1950s");
  });

  it("counts major updates as tokens that open their parent", () => {
    const aug = buildStops(ds, NOW).find((s) => s.key === "2026-08")!;
    const update = aug.tokens.find((t) => t.type === "update")!;
    expect(update.entryId).toBe("claude");
    expect(aug.tokens.map((t) => t.entryId)).toContain("claude-cowork");
  });
});

describe("overworld layout", () => {
  const stops = buildStops(ds, NOW);
  const ow = layoutOverworld(stops, [{ id: "agent-city", at: 2026.8 }, { id: "launch-night", at: 2022.92 }]);
  const rows = ow.blocks.filter((b) => b.kind === "row") as Extract<(typeof ow.blocks)[number], { kind: "row" }>[];

  it("places every stop exactly once, rows alternating direction", () => {
    expect(ow.stops).toHaveLength(stops.length);
    rows.forEach((r, i) => expect(r.dir).toBe(i % 2 === 0 ? 1 : -1));
  });

  it("puts scenes before the first stop older than their date", () => {
    expect(ow.blocks[0]).toMatchObject({ kind: "scene", id: "agent-city" });
    const i = ow.blocks.findIndex((b) => b.kind === "scene" && b.id === "launch-night");
    const after = ow.blocks.slice(i + 1).find((b) => b.kind === "row") as (typeof rows)[number];
    expect(after.stops[0].stop.to).toBeLessThanOrEqual(2022.92);
  });

  it("keeps blocks in order without overlap", () => {
    for (let i = 1; i < ow.blocks.length; i++) expect(ow.blocks[i].y).toBeGreaterThan(ow.blocks[i - 1].y);
    expect(ow.height).toBeGreaterThan(ow.blocks.at(-1)!.y);
  });

  it("draws a continuous road and four lanes", () => {
    expect(ow.lanes).toHaveLength(4);
    for (let i = 1; i < ow.segs.length; i++) {
      const end = pointAt({ ...ow, segs: ow.segs.slice(0, i) , length: ow.segs.slice(0, i).reduce((a, s) => a + s.len, 0) }, Infinity);
      const start = pointAt({ ...ow, segs: [ow.segs[i]], length: ow.segs[i].len }, 0);
      expect(Math.hypot(end.x - start.x, end.y - start.y)).toBeLessThan(0.01);
    }
  });

  it("maps scroll to road distance monotonically, clamped at both ends", () => {
    let prev = -1;
    for (let y = -500; y < ow.height + 500; y += 25) {
      const l = lengthAt(ow, y);
      expect(l).toBeGreaterThanOrEqual(prev);
      prev = l;
    }
    expect(lengthAt(ow, -1e6)).toBe(0);
    expect(lengthAt(ow, 1e9)).toBeLessThanOrEqual(ow.length + 1e-6);
  });

  it("walks through each stop as its row scrolls by", () => {
    const r = rows[1];
    const mid = pointAt(ow, lengthAt(ow, r.y));
    expect(Math.abs(mid.y - r.y)).toBeLessThan(1);
  });

  it("collapses to one stop per row on mobile", () => {
    const m = layoutOverworld(stops, [], { width: 440, cols: 1 });
    const mrows = m.blocks.filter((b) => b.kind === "row") as (typeof rows)[number][];
    expect(mrows.every((r) => r.stops.length === 1)).toBe(true);
    expect(m.stops.every((p) => p.x > 0 && p.x < 440)).toBe(true);
  });

  it("caps visible token rows", () => {
    const many = buildDataset({ ...fixtureRaw, entries: [...fixtureEntries, ...Array.from({ length: 40 }, (_, i) => entry({ id: `x${i}`, date: "2026-07-01" }))] });
    const l = layoutOverworld(buildStops(many), [], { maxTokens: 20, tokenCols: 5 });
    expect(Math.max(...l.stops.map((p) => p.tokenRows))).toBe(4);
  });
});

describe("storyboard placement", () => {
  it("starts each era's scene exactly at its boundary stop", async () => {
    const { PANORAMAS } = await import("../../components/overworld/Panoramas");
    const real = buildStops(ds, NOW);
    const ow = layoutOverworld(real, PANORAMAS);
    const order = ow.blocks.map((b) => (b.kind === "scene" ? `#${b.id}` : b.stops.map((p) => p.stop.key).join(",")));
    const firstAfter = (id: string) => order[order.indexOf(`#${id}`) + 1]?.split(",")[0];
    expect(firstAfter("reasoning-quarter")).toBe("2025-12");
    expect(firstAfter("launch-night")).toBe("2022-11");
    expect(firstAfter("seeing-machines")).toBe("2016");
    expect(firstAfter("expert-offices")).toBe("1970s");
  });
});

describe("arrival at a stop", () => {
  it("scrolls so the traveller stands on the chosen stop", async () => {
    const { lengthAtPoint, yAtLength } = await import("../overworld/layout");
    const ow = layoutOverworld(buildStops(ds, NOW), []);
    for (const p of [ow.stops[0], ow.stops[5], ow.stops[20]]) {
      const at = pointAt(ow, lengthAt(ow, yAtLength(ow, lengthAtPoint(ow, p.x, p.y))));
      expect(Math.hypot(at.x - p.x, at.y - p.y)).toBeLessThan(1);
    }
  });
});

describe("one token per product per stop", () => {
  it("folds a product's launch and its updates in the same month into one token", () => {
    const many = buildDataset({
      ...fixtureRaw,
      entries: fixtureEntries.map((e) =>
        e.id === "claude-cowork"
          ? { ...e, date: "2026-01-12", majorUpdates: [{ date: "2026-01-16", title: "Pro", summary: "s" }, { date: "2026-01-23", title: "Team", summary: "s" }] }
          : e,
      ),
    });
    const jan = buildStops(many).find((s) => s.key === "2026-01")!;
    const cowork = jan.tokens.filter((t) => t.entryId === "claude-cowork");
    expect(cowork).toHaveLength(1);
    expect(cowork[0].type).toBe("product");
    expect(cowork[0].more).toBe(2);
    expect(jan.events).toBe(3);
  });
});
