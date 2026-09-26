"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SEGMENT_COLOR } from "@/lib/overworld/style";
import type { RoadGeometry } from "@/lib/road/layout";
import { hexToRgb } from "@/lib/road/palette";
import { selectedSegments, useStore } from "@/lib/store";
import { ribbon } from "./Road";

/** Segment lanes in the map's colours: they merge around the Transformer and branch out after. */
export function Lanes({ road }: { road: RoadGeometry }) {
  const selected = useStore(selectedSegments);
  const lanes = useMemo(
    () =>
      road.lanes.map((lane) => ({
        segment: lane.segment,
        geometry: ribbon(lane.points, () => 0.7, () => ({ color: hexToRgb(SEGMENT_COLOR[lane.segment]) }), 0.03),
      })),
    [road],
  );
  return (
    <group>
      {lanes.map(({ segment, geometry }) => {
        const active = !selected.length || selected.includes(segment);
        return (
          <mesh key={segment} geometry={geometry}>
            <meshBasicMaterial vertexColors transparent opacity={active ? (selected.length ? 1 : 0.85) : 0.12} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Abandoned approaches peel off the road and stop at a barrier. */
export function DeadEnds({ road }: { road: RoadGeometry }) {
  const items = useMemo(
    () =>
      road.deadEnds.map((d) => {
        const pts = Array.from({ length: 12 }, (_, i) => {
          const t = i / 11;
          return { s: d.s + t * 6, x: d.x + d.dir * t * d.length };
        });
        return { id: d.id, geometry: ribbon(pts, () => 1.6, () => ({ color: [0.25, 0.22, 0.2] }), 0.005), end: pts.at(-1)! };
      }),
    [road],
  );
  return (
    <group>
      {items.map(({ id, geometry, end }) => (
        <group key={id}>
          <mesh geometry={geometry}>
            <meshBasicMaterial vertexColors />
          </mesh>
          <mesh position={[end.x, 0.5, -end.s]}>
            <boxGeometry args={[2, 1, 0.2]} />
            <meshBasicMaterial color="#e0826b" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Above Today the road forks into three scenario roads fading into fog. */
export function FutureForks({ road }: { road: RoadGeometry }) {
  const forks = useMemo(
    () =>
      road.futureForks.map((f) => ({
        scenario: f.scenario,
        geometry: ribbon(
          f.points,
          (s) => 5 * (1 - Math.min(1, -s / road.futureLength) * 0.6),
          () => ({ color: [0.24, 0.26, 0.3] }),
          0.01,
        ),
      })),
    [road],
  );
  return (
    <group>
      {forks.map(({ scenario, geometry }) => (
        <mesh key={scenario} geometry={geometry}>
          <meshBasicMaterial vertexColors transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** The end of the road: a campfire where it started. */
export function Campfire({ road }: { road: RoadGeometry }) {
  const flame = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const f = 0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 3.7);
    if (flame.current) flame.current.scale.set(1, f * 1.2, 1);
    if (light.current) light.current.intensity = 40 * f;
  });
  const z = -(road.length - 6);
  return (
    <group position={[0, 0, z]}>
      <pointLight ref={light} color="#ff8a3d" distance={40} position={[0, 2, 0]} />
      <mesh ref={flame} position={[0, 1, 0]}>
        <coneGeometry args={[0.8, 2.4, 7]} />
        <meshBasicMaterial color="#ff9a4d" toneMapped={false} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.26) * 1.2, 0.15, Math.sin(i * 1.26) * 1.2]} rotation={[0, i, 0]}>
          <boxGeometry args={[1.4, 0.25, 0.25]} />
          <meshBasicMaterial color="#3a2616" />
        </mesh>
      ))}
    </group>
  );
}
