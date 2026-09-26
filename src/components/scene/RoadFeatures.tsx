"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SEGMENT_COLOR } from "@/lib/overworld/style";
import type { RoadGeometry } from "@/lib/road/layout";
import { hexToRgb } from "@/lib/road/palette";
import type { Dataset } from "@/lib/dataset";
import { entriesForSegments } from "@/lib/graph";
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


type Prop = { x: number; s: number; scale: number; era: number };

/** Era the road environment is in at distance s (the backdrop's era, not an entry's). */
function envEra(road: RoadGeometry, s: number) {
  return road.eraBands.find((b) => s >= b.sStart && s < b.sEnd)?.era ?? 0;
}

const CROWN: Record<number, string> = { 0: "#b9c67a", 1: "#a8c77e", 2: "#e9eef0", 3: "#9fcd8c", 4: "#8fcf8a", 5: "#8fcf8a", 6: "#86cb86", 7: "#7fc68a", 8: "#a9d3a0" };

/**
 * Low-poly roadside: trees on both verges, street lamps in the modern eras,
 * telegraph poles in the middle eras, rocks at the dawn of tools.
 */
export function Roadside({ road }: { road: RoadGeometry }) {
  const { trees, posts, rocks } = useMemo(() => {
    const trees: Prop[] = [];
    const posts: Prop[] = [];
    const rocks: Prop[] = [];
    // Deterministic scatter: a hash of position, so the verge never reshuffles.
    const hash = (n: number) => {
      const v = Math.sin(n * 12.9898) * 43758.5453;
      return v - Math.floor(v);
    };
    for (let s = -road.futureLength; s < road.length; s += 7) {
      for (const side of [-1, 1]) {
        const era = envEra(road, s);
        const k = s * 2 + side;
        const r = hash(k);
        const x = side * (34 + hash(k + 0.1) * 46);
        const at = s + hash(k + 0.2) * 5;
        const scale = hash(k + 0.3);
        if (r < 0.55) trees.push({ x, s: at, scale: 0.8 + scale * 0.9, era });
        else if (era <= 1 && r < 0.8) rocks.push({ x, s: at, scale: 0.6 + scale * 0.9, era });
      }
      // Lamps / poles line the verge just outside the lanes.
      if (Math.round(s) % 21 === 0) {
        const era = envEra(road, s);
        if (era >= 2) for (const side of [-1, 1]) posts.push({ x: side * 30, s, scale: 1, era });
      }
    }
    return { trees, posts, rocks };
  }, [road]);

  const trunk = useRef<THREE.InstancedMesh>(null);
  const crown = useRef<THREE.InstancedMesh>(null);
  const pole = useRef<THREE.InstancedMesh>(null);
  const lamp = useRef<THREE.InstancedMesh>(null);
  const rock = useRef<THREE.InstancedMesh>(null);

  const place = () => {
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    trees.forEach((t, i) => {
      m.compose(new THREE.Vector3(t.x, 1.2 * t.scale, -t.s), new THREE.Quaternion(), new THREE.Vector3(t.scale, t.scale, t.scale));
      trunk.current?.setMatrixAt(i, m);
      m.compose(new THREE.Vector3(t.x, 3.2 * t.scale, -t.s), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, t.s, 0)), new THREE.Vector3(t.scale, t.scale * 1.15, t.scale));
      crown.current?.setMatrixAt(i, m);
      crown.current?.setColorAt(i, c.set(CROWN[t.era] ?? "#8fcf8a"));
    });
    posts.forEach((p, i) => {
      m.makeTranslation(p.x, 2.6, -p.s);
      pole.current?.setMatrixAt(i, m);
      m.makeTranslation(p.x, 5.3, -p.s);
      lamp.current?.setMatrixAt(i, m);
      lamp.current?.setColorAt(i, c.set(p.era >= 5 ? "#ffd23f" : "#8a7560"));
    });
    rocks.forEach((r, i) => {
      m.compose(new THREE.Vector3(r.x, 0.5 * r.scale, -r.s), new THREE.Quaternion().setFromEuler(new THREE.Euler(r.s, r.s * 2, 0)), new THREE.Vector3(r.scale * 1.4, r.scale, r.scale * 1.2));
      rock.current?.setMatrixAt(i, m);
    });
    for (const ref of [trunk, crown, pole, lamp, rock]) {
      if (ref.current) {
        ref.current.instanceMatrix.needsUpdate = true;
        if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
      }
    }
  };

  return (
    <group
      ref={() => {
        place();
      }}
    >
      <instancedMesh ref={trunk} args={[undefined, undefined, trees.length]}>
        <cylinderGeometry args={[0.28, 0.36, 2.4, 6]} />
        <meshLambertMaterial color="#9a6b3f" flatShading />
      </instancedMesh>
      <instancedMesh ref={crown} args={[undefined, undefined, trees.length]}>
        <icosahedronGeometry args={[1.8, 0]} />
        <meshLambertMaterial flatShading />
      </instancedMesh>
      <instancedMesh ref={pole} args={[undefined, undefined, posts.length]}>
        <cylinderGeometry args={[0.12, 0.16, 5.2, 6]} />
        <meshLambertMaterial color="#6b7080" flatShading />
      </instancedMesh>
      <instancedMesh ref={lamp} args={[undefined, undefined, posts.length]}>
        <boxGeometry args={[0.9, 0.35, 0.5]} />
        <meshLambertMaterial flatShading />
      </instancedMesh>
      <instancedMesh ref={rock} args={[undefined, undefined, rocks.length]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshLambertMaterial color="#c9b8a0" flatShading />
      </instancedMesh>
    </group>
  );
}


/** A small disc on the lane under each label: where the entry sits on the road. */
export function PathMarkers({ road, dataset }: { road: RoadGeometry; dataset: Dataset }) {
  const selected = useStore(selectedSegments);
  // Same rule as the labels: an entry matches if any of its segments is selected.
  const match = useMemo(() => entriesForSegments(dataset, selected), [dataset, selected]);
  const on = road.nodes.filter((n) => match.has(n.id));
  const off = road.nodes.filter((n) => !match.has(n.id));
  return (
    <group>
      {/* Keyed by count: an instanced mesh's size is fixed when it is created. */}
      <Discs key={`on-${on.length}`} nodes={on} opacity={1} />
      {off.length > 0 && <Discs key={`off-${off.length}`} nodes={off} opacity={0.18} />}
    </group>
  );
}

function Discs({ nodes, opacity }: { nodes: RoadGeometry["nodes"]; opacity: number }) {
  const rim = useRef<THREE.InstancedMesh>(null);
  const dot = useRef<THREE.InstancedMesh>(null);
  const faded = opacity < 1;

  useLayoutEffect(() => {
    const flat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    const one = new THREE.Vector3(1, 1, 1);
    nodes.forEach((n, i) => {
      m.compose(new THREE.Vector3(n.x, 0.05, -n.s), flat, one);
      rim.current?.setMatrixAt(i, m);
      m.compose(new THREE.Vector3(n.x, 0.06, -n.s), flat, one);
      dot.current?.setMatrixAt(i, m);
      dot.current?.setColorAt(i, c.set(SEGMENT_COLOR[n.lane]));
    });
    for (const r of [rim, dot]) {
      if (r.current) {
        r.current.instanceMatrix.needsUpdate = true;
        if (r.current.instanceColor) r.current.instanceColor.needsUpdate = true;
      }
    }
  }, [nodes]);

  if (!nodes.length) return null;
  return (
    <group>
      <instancedMesh ref={rim} args={[undefined, undefined, nodes.length]}>
        <circleGeometry args={[0.85, 20]} />
        <meshBasicMaterial color="#f7f3e8" transparent={faded} opacity={opacity} depthWrite={!faded} />
      </instancedMesh>
      <instancedMesh ref={dot} args={[undefined, undefined, nodes.length]}>
        <circleGeometry args={[0.6, 20]} />
        <meshBasicMaterial transparent={faded} opacity={opacity} depthWrite={!faded} />
      </instancedMesh>
    </group>
  );
}
