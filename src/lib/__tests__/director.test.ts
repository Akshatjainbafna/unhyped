import { describe, expect, it } from "vitest";
import { direct } from "../road/director";
import { layoutRoad } from "../road/layout";
import { fixtureEntries } from "./fixtures";

const road = layoutRoad(fixtureEntries);
const sum = (w: number[]) => w.reduce((a, b) => a + b, 0);

describe("direct", () => {
  it("keeps era weights summing to 1 everywhere", () => {
    for (let s = -road.futureLength; s <= road.length; s += road.length / 400) {
      expect(sum(direct(s, road).eraWeights)).toBeCloseTo(1, 6);
    }
  });

  it("shows projections above Today and the present era just below it", () => {
    expect(direct(-50, road).dominantEra).toBe(8);
    expect(direct(1, road).dominantEra).toBe(7);
  });

  it("puts the oldest era at the campfire", () => {
    expect(direct(road.length, road).dominantEra).toBe(road.eraBands.at(-1)!.era);
  });

  it("blends monotonically across a boundary", () => {
    const band = road.eraBands.find((b) => b.era === 4)!;
    let prev = -1;
    for (let s = band.sEnd - 20; s <= band.sEnd + 20; s += 1) {
      const w = direct(s, road).eraWeights[3];
      expect(w).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = w;
    }
  });

  it("uses the era active at a date", () => {
    const s = (id: string) => road.nodes.find((n) => n.id === id)!.s;
    expect(direct((s("alexnet") + s("transformer")) / 2, road).dominantEra).toBe(4);
    expect(direct(s("prolog"), road).dominantEra).toBe(2);
  });

  it("activates hero moments only inside their window", () => {
    const hero = { id: "alexnet", s: road.nodes.find((n) => n.id === "alexnet")!.s };
    expect(direct(hero.s, road, { heroes: [hero] }).activeHero).toBe("alexnet");
    expect(direct(hero.s, road, { heroes: [hero] }).heroProgress).toBeCloseTo(0.5);
    expect(direct(hero.s + 100, road, { heroes: [hero] }).activeHero).toBeUndefined();
  });

  it("uses discrete stills in reduced motion", () => {
    for (let s = 0; s <= road.length; s += road.length / 100) {
      const w = direct(s, road, { reducedMotion: true }).eraWeights;
      expect(w.filter((x) => x > 0)).toEqual([1]);
    }
  });

  it("clamps outside the road", () => {
    expect(direct(1e9, road).s).toBe(road.length);
    expect(direct(-1e9, road).s).toBe(-road.futureLength);
  });
});
