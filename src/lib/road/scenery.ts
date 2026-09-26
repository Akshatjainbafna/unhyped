/**
 * Which era landscapes are on the 3D horizon at road distance s. Scenes are
 * ordered newest first; each owns the road from its boundary to the next and
 * crossfades into it over `blend` road units. Weights always sum to 1.
 */
export function sceneryWeights(s: number, boundaries: number[], blend = 40): number[] {
  const n = boundaries.length;
  const w = new Array(n).fill(0);
  if (!n) return w;
  let k = 0;
  for (let i = 0; i < n; i++) if (s >= boundaries[i]) k = i;
  if (s < boundaries[0]) k = 0;
  w[k] = 1;
  const next = boundaries[k + 1];
  if (next !== undefined && s > next - blend) {
    const t = Math.min(1, (s - (next - blend)) / blend);
    const e = t * t * (3 - 2 * t);
    w[k] = 1 - e;
    w[k + 1] = e;
  }
  return w;
}

/** Mix hex colours by weights (for the sky and fog). */
export function mixHex(colors: string[], weights: number[]): string {
  let r = 0, g = 0, b = 0;
  colors.forEach((c, i) => {
    const n = parseInt(c.slice(1), 16);
    r += ((n >> 16) & 255) * weights[i];
    g += ((n >> 8) & 255) * weights[i];
    b += (n & 255) * weights[i];
  });
  const h = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}
