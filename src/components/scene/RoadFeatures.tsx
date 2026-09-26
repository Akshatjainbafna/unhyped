"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Dataset } from "@/lib/dataset";
import { entriesForSegments } from "@/lib/graph";
import type { RoadGeometry } from "@/lib/road/layout";
import { hexToRgb, SEGMENT_COLORS } from "@/lib/road/palette";
import { hoveredEntry, openEntry, personalRoad, selectedSegments, useStore } from "@/lib/store";
import type { EntryType } from "@/lib/taxonomy";
import { ribbon } from "./Road";

const DIM = 0.18;

/** Segment lanes: they merge into the highway around the Transformer and branch out after. */
export function Lanes({ road }: { road: RoadGeometry }) {
  const selected = useStore(selectedSegments);
  const lanes = useMemo(
    () =>
      road.lanes.map((lane) => ({
        segment: lane.segment,
        geometry: ribbon(lane.points, () => 0.45, () => ({ color: hexToRgb(SEGMENT_COLORS[lane.segment]) }), 0.02),
      })),
    [road],
  );
  return (
    <group>
      {lanes.map(({ segment, geometry }) => {
        const active = !selected.length || selected.includes(segment);
        return (
          <mesh key={segment} geometry={geometry}>
            <meshBasicMaterial vertexColors transparent opacity={active ? (selected.length ? 0.95 : 0.4) : 0.06} />
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

const TYPE_COLOR: Record<EntryType, string> = {
  paper: "#9cc3d6",
  model: "#ece8e1",
  product: "#e3b25a",
  "oss-repo": "#a7c9a0",
  "major-update": "#e3b25a",
  person: "#c7a0b0",
  org: "#b3a69a",
  event: "#e0826b",
};

/** Entry markers: a thin post with a lit cap, instanced for all ~350 entries. */
export function Nodes({ road, dataset }: { road: RoadGeometry; dataset: Dataset }) {
  const caps = useRef<THREE.InstancedMesh>(null);
  const posts = useRef<THREE.InstancedMesh>(null);
  const selected = useStore(selectedSegments);
  const personal = useStore(personalRoad);
  const nodes = road.nodes;

  useEffect(() => {
    const m = new THREE.Matrix4();
    nodes.forEach((n, i) => {
      m.makeTranslation(n.x, 1.6, -n.s);
      caps.current?.setMatrixAt(i, m);
      m.makeTranslation(n.x, 0.8, -n.s);
      posts.current?.setMatrixAt(i, m);
    });
    if (caps.current) caps.current.instanceMatrix.needsUpdate = true;
    if (posts.current) posts.current.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  useEffect(() => {
    const match = entriesForSegments(dataset, selected);
    const known = new Set(personal?.known ?? []);
    const missed = new Set(personal?.missed ?? []);
    const c = new THREE.Color();
    nodes.forEach((n, i) => {
      const e = dataset.byId.get(n.id)!;
      c.set(missed.has(n.id) ? "#e0826b" : known.has(n.id) ? "#e3b25a" : TYPE_COLOR[e.type]);
      if (!match.has(n.id)) c.multiplyScalar(DIM);
      caps.current?.setColorAt(i, c);
    });
    if (caps.current?.instanceColor) caps.current.instanceColor.needsUpdate = true;
  }, [nodes, dataset, selected, personal]);

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const id = e.instanceId !== undefined ? nodes[e.instanceId]?.id : undefined;
    if (id) hoveredEntry.set({ id, x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    hoveredEntry.set(null);
    document.body.style.cursor = "";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const id = e.instanceId !== undefined ? nodes[e.instanceId]?.id : undefined;
    if (id) openEntry.set(id);
  };

  return (
    <group>
      <instancedMesh ref={posts} args={[undefined, undefined, nodes.length]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 6]} />
        <meshBasicMaterial color="#6f6a62" />
      </instancedMesh>
      <instancedMesh
        ref={caps}
        args={[undefined, undefined, nodes.length]}
        onPointerOver={over}
        onPointerMove={over}
        onPointerOut={out}
        onClick={click}
      >
        <octahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
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
