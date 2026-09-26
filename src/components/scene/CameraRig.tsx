"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { direct, type HeroMoment } from "@/lib/road/director";
import type { RoadGeometry } from "@/lib/road/layout";
import { ERA_WORLDS } from "@/lib/road/palette";
import { roadPosition } from "@/lib/store";
import { fogUniforms } from "./fog";

/**
 * Reads the road position every frame, eases toward it, and drives the camera,
 * era weights (for the backdrop) and fog colour from the director.
 */
export function CameraRig({
  road,
  heroes,
  reducedMotion,
  weightsRef,
}: {
  road: RoadGeometry;
  heroes: HeroMoment[];
  reducedMotion: boolean;
  weightsRef: React.RefObject<number[]>;
}) {
  const eased = useRef(roadPosition.get());
  const target = useRef(new THREE.Vector3());
  const fog = useRef(new THREE.Color());
  const tmp = useRef(new THREE.Color());

  useFrame(({ camera, scene }, dt) => {
    const goal = roadPosition.get();
    // Critically-damped follow so fast scrolls still feel like travel, not jumps.
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 6);
    eased.current += (goal - eased.current) * k;
    const d = direct(eased.current, road, { heroes, reducedMotion });

    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...d.camera.position);
    target.current.set(...d.camera.target);
    cam.lookAt(target.current);
    if (Math.abs(cam.fov - d.camera.fov) > 0.01) {
      cam.fov = d.camera.fov;
      cam.updateProjectionMatrix();
    }

    weightsRef.current = d.eraWeights;
    fog.current.setRGB(0, 0, 0);
    d.eraWeights.forEach((w, i) => {
      if (!w) return;
      // Match the sky's horizon band so the ground dissolves into it.
      fog.current.add(tmp.current.set(ERA_WORLDS[i].sky).multiplyScalar(2.2 * w));
      fog.current.add(tmp.current.set(ERA_WORLDS[i].glow).multiplyScalar(0.05 * w));
    });
    fogUniforms.uFogColor.value.copy(fog.current);
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(fog.current);
  });
  return null;
}
