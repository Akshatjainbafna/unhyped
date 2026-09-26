import { describe, expect, it } from "vitest";
import { laneSpread, layoutRoad } from "../road/layout";
import { fixtureEntries } from "./fixtures";

const road = layoutRoad(fixtureEntries);

describe("layoutRoad", () => {
  it("is deterministic", () => {
    const again = layoutRoad(fixtureEntries);
    expect(again.nodes).toEqual(road.nodes);
    expect(again.eraBands).toEqual(road.eraBands);
  });

  it("puts newer entries closer to Today (reverse chronology)", () => {
    const s = (id: string) => road.nodes.find((n) => n.id === id)!.s;
    expect(s("claude-cowork")).toBeLessThan(s("chatgpt"));
    expect(s("chatgpt")).toBeLessThan(s("alexnet"));
    expect(s("alexnet")).toBeLessThan(s("prolog"));
    expect(road.nodes.every((n) => n.s > 0)).toBe(true);
  });

  it("keeps a minimum spacing between nodes", () => {
    const ss = road.nodes.map((n) => n.s);
    for (let i = 1; i < ss.length; i++) expect(ss[i] - ss[i - 1]).toBeGreaterThanOrEqual(6 - 1e-9);
  });

  it("leaves major updates off the road", () => {
    expect(road.nodes.find((n) => n.id === "opus-5-5")).toBeUndefined();
  });

  it("converges lanes around the Transformer and spreads them before and after", () => {
    expect(laneSpread(2019)).toBeLessThan(laneSpread(2010));
    expect(laneSpread(2019)).toBeLessThan(laneSpread(2025));
    const alexnet = road.nodes.find((n) => n.id === "alexnet")!;
    const transformer = road.nodes.find((n) => n.id === "transformer")!;
    expect(Math.abs(transformer.x)).toBeLessThan(Math.abs(alexnet.x) + 1e-9);
  });

  it("keeps the foundation-models highway at x = 0", () => {
    expect(road.nodes.find((n) => n.id === "gpt-3")!.x).toBe(0);
  });

  it("marks frozen stretches and dead ends", () => {
    expect(road.frozen).toHaveLength(1);
    const winter = road.frozen[0];
    expect(winter.sStart).toBeLessThan(winter.sEnd);
    expect(road.deadEnds.map((d) => d.id)).toEqual(["fifth-gen"]);
  });

  it("builds three future forks above Today", () => {
    expect(road.futureForks.map((f) => f.scenario).sort()).toEqual(["plateau", "steady", "takeoff"]);
    for (const f of road.futureForks) expect(f.points.every((p) => p.s <= 0)).toBe(true);
  });

  it("ends at the campfire beyond the oldest node", () => {
    expect(road.length).toBeGreaterThan(road.nodes.at(-1)!.s);
  });

  it("covers the road with contiguous era bands, newest first", () => {
    const bands = road.eraBands.filter((b) => b.era !== 8);
    expect(bands[0].sStart).toBe(0);
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i].sStart).toBeCloseTo(bands[i - 1].sEnd);
      expect(bands[i].era).toBeLessThan(bands[i - 1].era);
    }
    expect(bands.at(-1)!.sEnd).toBe(road.length);
  });

  it("maps s and year consistently", () => {
    for (const n of road.nodes) expect(road.yearAt(n.s)).toBeCloseTo(n.year, 5);
    expect(road.sAt(2012.5)).toBeGreaterThan(road.sAt(2020));
  });

  it("collapses to a single lane on mobile", () => {
    const mobile = layoutRoad(fixtureEntries, { viewport: "mobile" });
    expect(mobile.nodes.every((n) => n.x === 0)).toBe(true);
    expect(mobile.lanes).toHaveLength(0);
  });
});
