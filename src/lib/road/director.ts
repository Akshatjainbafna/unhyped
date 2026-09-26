import type { EraId } from "../taxonomy";
import type { RoadGeometry } from "./layout";

export type Vec3 = [number, number, number];
export type CameraPose = { position: Vec3; target: Vec3; fov: number };
export type HeroMoment = { id: string; s: number };

export type Direction = {
  s: number;
  year: number;
  eraWeights: number[]; // length 9, sums to 1
  dominantEra: EraId;
  camera: CameraPose;
  activeHero?: string;
  heroProgress: number; // 0..1 inside the active hero window
};

export type DirectOptions = {
  heroes?: HeroMoment[];
  reducedMotion?: boolean;
  /** Road units over which neighbouring eras cross-fade. */
  blendWidth?: number;
  heroWindow?: number;
};

// Camera rig: low over the road, tilted down it so the horizon sits in the
// upper third — travelling, not reading a map.
const HEIGHT = 7.5;
const PITCH = (11 * Math.PI) / 180;
const LOOK_AHEAD = HEIGHT / Math.tan(PITCH);
const BEHIND = 14;

const smoothstep = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/** Road distance → world space. The road runs along -z; the past is further away. */
export const toWorld = (s: number, x = 0, y = 0): Vec3 => [x, y, -s];

export function direct(s: number, road: RoadGeometry, options: DirectOptions = {}): Direction {
  const { heroes = [], reducedMotion = false, blendWidth = 40, heroWindow = 30 } = options;
  const clamped = Math.min(road.length, Math.max(-road.futureLength, s));

  const weights = new Array(9).fill(0);
  const bands = road.eraBands;
  const found = bands.findIndex((b) => clamped >= b.sStart && clamped < b.sEnd);
  const i = found === -1 ? bands.length - 1 : found; // s === length sits in the oldest band
  const band = bands[i];
  weights[band.era] = 1;

  if (!reducedMotion) {
    // Cross-fade into the next (older) band as we approach its boundary.
    const next = bands[i + 1];
    if (next && Number.isFinite(band.sEnd)) {
      const t = smoothstep((clamped - (band.sEnd - blendWidth / 2)) / blendWidth);
      weights[band.era] = 1 - t;
      weights[next.era] += t;
    }
    // And out of the previous (newer) band just after crossing into this one.
    const prev = bands[i - 1];
    if (prev && Number.isFinite(band.sStart)) {
      const t = smoothstep((band.sStart + blendWidth / 2 - clamped) / blendWidth);
      if (t > 0) {
        const total = weights.reduce((a, b) => a + b, 0);
        for (let k = 0; k < weights.length; k++) weights[k] = (weights[k] / total) * (1 - t);
        weights[prev.era] += t;
      }
    }
  }
  const dominantEra = weights.indexOf(Math.max(...weights)) as EraId;

  const hero = heroes.find((h) => Math.abs(clamped - h.s) <= heroWindow / 2);
  const heroProgress = hero ? (clamped - (hero.s - heroWindow / 2)) / heroWindow : 0;

  let camera: CameraPose = {
    position: toWorld(clamped - BEHIND, 0, HEIGHT),
    target: toWorld(clamped + LOOK_AHEAD, 0, 0),
    fov: 45,
  };
  if (hero && !reducedMotion) {
    // Hero takeover: drop low and swing sideways, peaking mid-window.
    const lift = Math.sin(heroProgress * Math.PI);
    camera = {
      position: toWorld(clamped - BEHIND, 8 * lift, HEIGHT * (1 - 0.6 * lift)),
      target: toWorld(hero.s, 0, 2 * lift),
      fov: 45 - 10 * lift,
    };
  }

  return {
    s: clamped,
    year: road.yearAt(clamped),
    eraWeights: weights,
    dominantEra,
    camera,
    activeHero: hero?.id,
    heroProgress,
  };
}
