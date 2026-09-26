import { describe, expect, it } from "vitest";
import { makeTrack } from "../road/track";

const t = makeTrack({ futureLength: 120, length: 1000, px: 5, futurePad: 900, introPad: 800 });

describe("3D scroll track", () => {
  it("holds the camera at Today through the intro", () => {
    expect(t.toS(t.introStart)).toBe(0);
    expect(t.toS(t.introStart + 400)).toBe(0);
    expect(t.toS(t.introEnd)).toBe(0);
    expect(t.toS(t.introEnd + 5)).toBeCloseTo(1);
  });
  it("maps the futures above Today and clamps the pad", () => {
    expect(t.toS(0)).toBe(-120);
    expect(t.toS(900)).toBe(-120);
    expect(t.toS(t.introStart - 50)).toBeCloseTo(-10);
  });
  it("round-trips outside the hold", () => {
    for (const s of [-100, -1, 0.5, 10, 500, 999]) expect(t.toS(t.toY(s))).toBeCloseTo(s);
  });
  it("is monotonic", () => {
    let prev = -Infinity;
    for (let y = 0; y < t.height; y += 37) {
      const s = t.toS(y);
      expect(s).toBeGreaterThanOrEqual(prev);
      prev = s;
    }
  });
});
