"use client";

import { useEffect, useRef } from "react";
import { PANORAMAS } from "../overworld/Panoramas";
import { CAMERA_PITCH } from "@/lib/road/director";
import { mixHex, sceneryWeights } from "@/lib/road/scenery";

// Default horizon position for the camera's pitch and 45° field of view; the rig
// updates it when a tall screen widens the view.
const HORIZON = 0.5 - Math.tan(CAMERA_PITCH) / Math.tan((22.5 * Math.PI) / 180) / 2;

/**
 * Written every frame by the camera rig: where the camera is on the road and
 * the era boundaries, so DOM layers can follow without React re-renders.
 */
export const cameraFrame = { s: 0, boundaries: [] as number[], horizon: HORIZON };


/** The 3D sky sits a little darker than the 2D map's: pull each colour toward dusk. */
const dusk = (c: string, k = 0.24) => mixHex([c, "#22303f"], [1 - k, k]);

export function eraFog(s: number, boundaries: number[]) {
  return dusk(mixHex(PANORAMAS.map((p) => p.mist), sceneryWeights(s, boundaries)));
}

/**
 * The 3D sky: each era's colours, blended as you travel, under a transparent
 * WebGL canvas. (The cartoon landscapes belong to the 2D map only.)
 */
export function Scenery() {
  const sky = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const w = sceneryWeights(cameraFrame.s, cameraFrame.boundaries);
      const key = w.map((x) => x.toFixed(3)).join() + cameraFrame.horizon.toFixed(3);
      if (key === last) return;
      last = key;
      if (sky.current) {
        const top = dusk(mixHex(PANORAMAS.map((p) => p.sky[0]), w), 0.3);
        const mist = dusk(mixHex(PANORAMAS.map((p) => p.mist), w));
        sky.current.style.background = `linear-gradient(180deg, ${top} 0%, ${mist} ${cameraFrame.horizon * 100 + 2}%, ${mist} 100%)`;
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden">
      <div ref={sky} className="absolute inset-0" />
    </div>
  );
}
