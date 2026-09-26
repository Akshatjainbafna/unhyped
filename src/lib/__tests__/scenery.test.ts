import { describe, expect, it } from "vitest";
import { mixHex, sceneryWeights } from "../road/scenery";

const B = [-50, 100, 300, 700];
const sum = (w: number[]) => w.reduce((a, b) => a + b, 0);

describe("scenery weights", () => {
  it("always sums to 1", () => {
    for (let s = -200; s < 1000; s += 7) expect(sum(sceneryWeights(s, B))).toBeCloseTo(1);
  });
  it("shows one scene inside its stretch and the first one before it", () => {
    expect(sceneryWeights(0, B)).toEqual([1, 0, 0, 0]);
    expect(sceneryWeights(-500, B)).toEqual([1, 0, 0, 0]);
    expect(sceneryWeights(200, B)).toEqual([0, 1, 0, 0]);
    expect(sceneryWeights(5000, B)).toEqual([0, 0, 0, 1]);
  });
  it("crossfades into the next scene before its boundary", () => {
    const w = sceneryWeights(280, B, 40);
    expect(w[1]).toBeGreaterThan(0);
    expect(w[2]).toBeGreaterThan(0);
    let prev = -1;
    for (let s = 250; s <= 300; s += 2) {
      const v = sceneryWeights(s, B, 40)[2];
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
  it("mixes colours", () => {
    expect(mixHex(["#000000", "#ffffff"], [0.5, 0.5])).toBe("#808080");
    expect(mixHex(["#ff0000", "#0000ff"], [1, 0])).toBe("#ff0000");
  });
});
