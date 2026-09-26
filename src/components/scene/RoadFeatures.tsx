"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Dataset } from "@/lib/dataset";
import { entriesForSegments } from "@/lib/graph";
import type { RoadGeometry, RoadNode } from "@/lib/road/layout";
import { hoveredEntry, openEntry, personalRoad, selectedSegments, useStore } from "@/lib/store";
import type { EntryType, SegmentId } from "@/lib/taxonomy";
import { SEGMENT_COLOR } from "@/lib/overworld/style";
import { ribbon } from "./Road";

const DIM = 0.18;

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

// Same language as the 2D map: colour = segment, shape = type.
type ShapeKind = "product" | "model" | "paper" | "oss" | "event";
const SHAPE_OF: Record<EntryType, ShapeKind> = {
  product: "product",
  "major-update": "product",
  person: "product",
  model: "model",
  org: "model",
  paper: "paper",
  "oss-repo": "oss",
  event: "event",
};
const GEOMETRY: Record<ShapeKind, () => THREE.BufferGeometry> = {
  product: () => new THREE.SphereGeometry(0.55, 18, 12),
  model: () => new THREE.BoxGeometry(0.9, 0.9, 0.9),
  paper: () => new THREE.BoxGeometry(0.95, 1.15, 0.12),
  oss: () => new THREE.CylinderGeometry(0.55, 0.55, 0.5, 6).rotateX(Math.PI / 2),
  event: () => new THREE.OctahedronGeometry(0.62, 0),
};

/** Entry markers: a thin post with a coloured cap, instanced per shape. */
export function Nodes({ road, dataset }: { road: RoadGeometry; dataset: Dataset }) {
  const posts = useRef<THREE.InstancedMesh>(null);
  const selected = useStore(selectedSegments);
  const personal = useStore(personalRoad);
  const nodes = road.nodes;
  const groups = useMemo(() => {
    const g: Record<ShapeKind, RoadNode[]> = { product: [], model: [], paper: [], oss: [], event: [] };
    for (const n of nodes) g[SHAPE_OF[dataset.byId.get(n.id)!.type]].push(n);
    return g;
  }, [nodes, dataset]);

  useEffect(() => {
    const m = new THREE.Matrix4();
    nodes.forEach((n, i) => {
      m.makeTranslation(n.x, 0.8, -n.s);
      posts.current?.setMatrixAt(i, m);
    });
    if (posts.current) posts.current.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  return (
    <group>
      <instancedMesh ref={posts} args={[undefined, undefined, nodes.length]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 6]} />
        <meshBasicMaterial color="#6f6a62" />
      </instancedMesh>
      {(Object.keys(groups) as ShapeKind[]).map((k) =>
        groups[k].length ? <ShapeCaps key={k} kind={k} nodes={groups[k]} dataset={dataset} selected={selected} personal={personal} /> : null,
      )}
    </group>
  );
}

function ShapeCaps({
  kind,
  nodes,
  dataset,
  selected,
  personal,
}: {
  kind: ShapeKind;
  nodes: RoadNode[];
  dataset: Dataset;
  selected: SegmentId[];
  personal: { known: string[]; missed: string[] } | null;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => GEOMETRY[kind](), [kind]);

  useEffect(() => {
    const m = new THREE.Matrix4();
    nodes.forEach((n, i) => {
      m.makeTranslation(n.x, 1.7, -n.s);
      ref.current?.setMatrixAt(i, m);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  useEffect(() => {
    const match = entriesForSegments(dataset, selected);
    const known = new Set(personal?.known ?? []);
    const missed = new Set(personal?.missed ?? []);
    const c = new THREE.Color();
    nodes.forEach((n, i) => {
      const e = dataset.byId.get(n.id)!;
      c.set(missed.has(n.id) ? "#ff6b5b" : known.has(n.id) ? "#ffc21a" : SEGMENT_COLOR[e.primarySegment]);
      if (!match.has(n.id)) c.multiplyScalar(DIM);
      ref.current?.setColorAt(i, c);
    });
    if (ref.current?.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [nodes, dataset, selected, personal]);

  const idAt = (e: ThreeEvent<PointerEvent | MouseEvent>) => (e.instanceId !== undefined ? nodes[e.instanceId]?.id : undefined);
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, undefined, nodes.length]}
      onPointerOver={(e) => {
        e.stopPropagation();
        const id = idAt(e);
        if (id) hoveredEntry.set({ id, x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
        document.body.style.cursor = "pointer";
      }}
      onPointerMove={(e) => {
        const id = idAt(e);
        if (id) hoveredEntry.set({ id, x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
      }}
      onPointerOut={() => {
        hoveredEntry.set(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        const id = idAt(e);
        if (id) openEntry.set(id);
      }}
    >
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
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
