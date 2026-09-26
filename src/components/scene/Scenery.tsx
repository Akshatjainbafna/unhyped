"use client";

import { useEffect, useRef } from "react";
import { PANORAMAS } from "../overworld/Panoramas";
import { CAMERA_PITCH } from "@/lib/road/director";
import { mixHex, sceneryWeights } from "@/lib/road/scenery";

/**
 * Written every frame by the camera rig: where the camera is on the road and
 * the era boundaries, so DOM layers can follow without React re-renders.
 */
export const cameraFrame = { s: 0, boundaries: [] as number[] };

// Where the horizon falls on screen for the camera's pitch and 45° field of view.
const HORIZON = 0.5 - Math.tan(CAMERA_PITCH) / Math.tan((22.5 * Math.PI) / 180) / 2;
// Sink landmarks slightly below the horizon so the 3D ground hides their base.
const ROOT = 0.012;
// Size landmarks from the viewport height so the tallest fit above the horizon.
const ART_W = "min(104vh, 140vw)";

export function eraFog(s: number, boundaries: number[]) {
  return mixHex(PANORAMAS.map((p) => p.mist), sceneryWeights(s, boundaries));
}

/**
 * The era landscapes from the 2D map, standing on the 3D horizon behind the
 * road and crossfading as you travel. Rendered as crisp SVG under a
 * transparent WebGL canvas.
 */
export function Scenery() {
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const sky = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const w = sceneryWeights(cameraFrame.s, cameraFrame.boundaries);
      const key = w.map((x) => x.toFixed(3)).join();
      if (key === last) return;
      last = key;
      w.forEach((v, i) => {
        const el = layers.current[i];
        if (el) {
          el.style.opacity = String(v);
          el.style.visibility = v > 0.001 ? "visible" : "hidden";
        }
      });
      if (sky.current) {
        const top = mixHex(PANORAMAS.map((p) => p.sky[0]), w);
        const mist = mixHex(PANORAMAS.map((p) => p.mist), w);
        sky.current.style.background = `linear-gradient(180deg, ${top} 0%, ${mist} ${HORIZON * 100 + 2}%, ${mist} 100%)`;
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden">
      <div ref={sky} className="absolute inset-0" />
      {PANORAMAS.map((p, i) => {
        const { Art } = p;
        return (
          <div
            key={p.id}
            ref={(el) => {
              layers.current[i] = el;
            }}
            className="absolute inset-x-0 transition-opacity duration-300"
            style={{ top: 0, height: "100%", opacity: 0, visibility: "hidden" }}
          >
            {/* Landmarks stand on the horizon line; the 3D ground covers below it. */}
            <svg
              viewBox="0 0 1200 380"
              preserveAspectRatio="xMidYMax meet"
              className="absolute left-1/2 -translate-x-1/2"
              style={{ width: ART_W, aspectRatio: "1200 / 380", bottom: `calc(${(1 - HORIZON - ROOT) * 100}% - ${ART_W} * ${50 / 1200})` }}
            >
              <Art />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
