"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { CAMERA_PITCH, direct, type HeroMoment } from "@/lib/road/director";
import type { RoadGeometry } from "@/lib/road/layout";
import { roadPosition } from "@/lib/store";
import { fogUniforms } from "./fog";
import { cameraFrame, eraFog } from "./Scenery";

/**
 * Reads the road position every frame, eases toward it, and drives the camera,
 * era weights (for the backdrop) and fog colour from the director.
 */
export function CameraRig({
  road,
  heroes,
  reducedMotion,
  weightsRef,
  boundaries,
}: {
  road: RoadGeometry;
  heroes: HeroMoment[];
  reducedMotion: boolean;
  weightsRef: React.RefObject<number[]>;
  boundaries: number[];
}) {
  const eased = useRef(roadPosition.get());
  const target = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const fog = useRef(new THREE.Color());

  useFrame(({ camera, scene }, dt) => {
    const goal = roadPosition.get();
    // Critically-damped follow so fast scrolls still feel like travel, not jumps.
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 6);
    eased.current += (goal - eased.current) * k;
    const d = direct(eased.current, road, { heroes, reducedMotion });

    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...d.camera.position);
    target.current.set(...d.camera.target);
    // Tall (phone) screens: widen the view so the lanes fit across, and tilt
    // down so the horizon sits higher and the road, not the sky, fills the screen.
    const { fov, tilt } = framing(d.camera.fov, cam.aspect);
    if (tilt) {
      const v = look.current.subVectors(target.current, cam.position);
      const flat = Math.hypot(v.x, v.z);
      v.y = -Math.tan(Math.atan2(-v.y, flat) + tilt) * flat;
      target.current.copy(cam.position).add(v);
    }
    cam.lookAt(target.current);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    cameraFrame.horizon = 0.5 - Math.tan(CAMERA_PITCH + tilt) / Math.tan((fov * Math.PI) / 360) / 2;

    weightsRef.current = d.eraWeights;
    // The fog matches the era landscape's air on the horizon (see Scenery).
    cameraFrame.s = eased.current;
    cameraFrame.boundaries = boundaries;
    fog.current.set(eraFog(eased.current, boundaries));
    fogUniforms.uFogColor.value.copy(fog.current);
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(fog.current);
  });
  return null;
}

/** Field of view and extra downward tilt for the screen's shape; wide screens get the director's framing unchanged. */
export function framing(baseFov: number, aspect: number): { fov: number; tilt: number } {
  if (!aspect || aspect >= 1) return { fov: baseFov, tilt: 0 };
  const half = (baseFov * Math.PI) / 360;
  // Keep roughly the horizontal view of a 1.4:1 screen, capped so it doesn't fish-eye.
  const fov = Math.min(70, (2 * Math.atan((Math.tan(half) * 1.4 * 0.62) / aspect) * 180) / Math.PI);
  // Aim the horizon about 30% down the screen.
  const want = Math.atan(0.4 * Math.tan((fov * Math.PI) / 360));
  return { fov: Math.max(baseFov, fov), tilt: Math.max(0, want - CAMERA_PITCH) };
}
