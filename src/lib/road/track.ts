/**
 * Page scroll ↔ road distance for the 3D view. From the top: a pad, the
 * futures (s < 0), then an intro hold where the camera waits at Today (s = 0)
 * while the heading scrolls away, then the road into the past (s > 0).
 */
export type Track = { toS: (y: number) => number; toY: (s: number) => number; height: number; introStart: number; introEnd: number };

export function makeTrack({ futureLength, length, px, futurePad, introPad }: { futureLength: number; length: number; px: number; futurePad: number; introPad: number }): Track {
  const introStart = futurePad + futureLength * px; // scrollY where Today is reached
  const introEnd = introStart + introPad; // scrollY where the road starts moving
  const toS = (y: number) => {
    if (y <= introStart) return Math.max(0, y - futurePad) / px - futureLength;
    if (y <= introEnd) return 0;
    return (y - introEnd) / px;
  };
  const toY = (s: number) => (s <= 0 ? introStart + s * px : introEnd + s * px);
  return { toS, toY, height: introEnd + length * px, introStart, introEnd };
}
