"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { direct } from "@/lib/road/director";
import type { RoadGeometry } from "@/lib/road/layout";
import { ERA_WORLDS, hexToRgb } from "@/lib/road/palette";
import { fogFragment, fogUniforms, fogVertex } from "./fog";

// The road narrows as capability falls away: highway → asphalt → dirt → footpath.
const ERA_WIDTH = [1.6, 2.6, 3.4, 4.4, 5.4, 6.4, 7.2, 8, 8];
// How much the road surface itself glows (fibre in the agent era, none on dirt).
const ERA_EMISSIVE = [0.05, 0.1, 0.15, 0.2, 0.3, 0.45, 0.6, 0.8, 0.5];

type Strip = { s: number; x: number }[];

/** A flat ribbon along a polyline, with per-vertex width, colour and flags. */
export function ribbon(
  points: Strip,
  width: (s: number) => number,
  attrs: (s: number) => { color: [number, number, number]; glow?: number; frozen?: number },
  y = 0,
) {
  const n = points.length;
  const position = new Float32Array(n * 2 * 3);
  const color = new Float32Array(n * 2 * 3);
  const uv = new Float32Array(n * 2 * 2);
  const glow = new Float32Array(n * 2);
  const frozen = new Float32Array(n * 2);
  const index: number[] = [];
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const q = points[Math.min(n - 1, i + 1)];
    const o = points[Math.max(0, i - 1)];
    // Perpendicular to the local direction in the x/s plane.
    const dx = q.x - o.x;
    const ds = q.s - o.s || 1e-6;
    const len = Math.hypot(dx, ds);
    const nx = ds / len;
    const ns = -dx / len;
    const w = width(p.s) / 2;
    const a = attrs(p.s);
    for (let side = 0; side < 2; side++) {
      const k = i * 2 + side;
      const sign = side === 0 ? -1 : 1;
      position.set([p.x + nx * w * sign, y, -(p.s + ns * w * sign)], k * 3);
      color.set(a.color, k * 3);
      uv.set([side, p.s], k * 2);
      glow[k] = a.glow ?? 0;
      frozen[k] = a.frozen ?? 0;
    }
    if (i < n - 1) {
      const k = i * 2;
      index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(position, 3));
  g.setAttribute("color", new THREE.BufferAttribute(color, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  g.setAttribute("aGlow", new THREE.BufferAttribute(glow, 1));
  g.setAttribute("aFrozen", new THREE.BufferAttribute(frozen, 1));
  g.setIndex(index);
  return g;
}

const roadVertex = /* glsl */ `
  attribute vec3 color;
  attribute float aGlow;
  attribute float aFrozen;
  varying vec3 vColor;
  varying vec2 vUv;
  varying float vGlow;
  varying float vFrozen;
  varying vec2 vWorld;
  ${fogVertex}
  void main() {
    vColor = color; vUv = uv; vGlow = aGlow; vFrozen = aFrozen; vWorld = position.xz;
    FOG_VERTEX
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const roadFragment = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying vec2 vUv;
  varying float vGlow;
  varying float vFrozen;
  uniform float uTime;
  uniform vec3 uLine;
  uniform float uDashed;
  uniform float uSolid;
  uniform float uTexture;
  varying vec2 vWorld;
  ${fogFragment}
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  void main() {
    float edge = min(vUv.x, 1.0 - vUv.x);
    vec3 c = vColor;
    // Surface texture in world space. Road (uTexture 1): fine asphalt grain and
    // worn patches. Ground (uTexture 2): soil mottling, clumps and speckle.
    // Fine detail fades with distance so it never shimmers near the horizon.
    float near = 1.0 - smoothstep(20.0, 110.0, vViewDist);
    if (uTexture > 1.5) {
      float mottle = noise(vWorld * 0.045) * 0.6 + noise(vWorld * 0.13) * 0.4;
      float clumps = noise(vWorld * 0.6);
      float speck = smoothstep(0.72, 0.9, noise(vWorld * 2.2)) * noise(vWorld * 5.0 + 7.0);
      c *= 0.8 + mottle * 0.34;
      c *= 1.0 + (clumps - 0.5) * 0.16 * near;
      c *= 1.0 - speck * 0.3 * near;
    } else if (uTexture > 0.5) {
      float grain = hash(floor(vWorld * 7.0));
      float wear = noise(vWorld * vec2(0.35, 0.08));
      float tracks = smoothstep(0.1, 0.0, abs(abs(vUv.x - 0.5) - 0.22)) * 0.5;
      c *= 0.92 + wear * 0.12;
      c *= 1.0 + (grain - 0.5) * 0.14 * near;
      c *= 1.0 - tracks * 0.08;
    }
    // Centre line (dashed, or solid on the future roads) and edge lines.
    float centre = smoothstep(0.03, 0.0, abs(vUv.x - 0.5));
    float dash = mix(step(0.5, fract(vUv.y * 0.12)), 1.0, uSolid) * centre * uDashed;
    float rim = smoothstep(0.06, 0.0, edge);
    c += uLine * (dash * 0.55 + rim * 0.35) * (0.3 + vGlow);
    // A slow pulse travels along fibre roads.
    c += uLine * vGlow * 0.12 * smoothstep(0.9, 1.0, fract(vUv.y * 0.02 - uTime * 0.15));
    // Frost: pale crystalline noise, traffic stopped.
    float frost = vFrozen * (0.55 + 0.45 * hash(floor(vUv * vec2(40.0, 6.0))));
    c = mix(c, vec3(0.78, 0.86, 0.92), frost * 0.7);
    gl_FragColor = vec4(applyFog(c), 1.0);
  }
`;

export function Road({ road }: { road: RoadGeometry }) {
  const { geometry, ground, forks } = useMemo(() => {
    const step = 2;
    const points: Strip = [];
    for (let s = 0; s <= road.length; s += step) points.push({ s, x: 0 });
    const isFrozen = (s: number) => road.frozen.some((f) => s >= f.sStart && s <= f.sEnd);
    const scalar = (s: number, pick: (i: number) => number) =>
      direct(s, road).eraWeights.reduce((acc, w, i) => acc + (w ? pick(i) * w : 0), 0);
    const color = (s: number, pick: (w: (typeof ERA_WORLDS)[number]) => string): [number, number, number] => {
      const out: [number, number, number] = [0, 0, 0];
      direct(s, road).eraWeights.forEach((w, i) => {
        if (!w) return;
        const c = hexToRgb(pick(ERA_WORLDS[i]));
        for (let k = 0; k < 3; k++) out[k] += c[k] * w;
      });
      return out;
    };
    const width = (s: number) => scalar(s, (i) => ERA_WIDTH[i]);
    const geometry = ribbon(points, width, (s) => ({
      color: color(s, (w) => w.road),
      glow: scalar(s, (i) => ERA_EMISSIVE[i]),
      frozen: isFrozen(s) ? 1 : 0,
    }));
    const groundPts: Strip = [];
    for (let s = -road.futureLength - 120; s <= road.length + 40; s += step * 2) groundPts.push({ s, x: 0 });
    const ground = ribbon(groundPts, () => 2400, (s) => ({ color: color(s, (w) => w.ground) }), -0.05);
    // The three future roads: same surface as today's road, fading into fog.
    const forks = road.futureForks.map((f) => ribbon(f.points, () => 6.4, () => ({ color: hexToRgb("#43464f"), glow: 0.4 }), 0.012));
    return { geometry, ground, forks };
  }, [road]);

  const uniforms = useMemo(
    () => ({ ...fogUniforms, uTime: { value: 0 }, uLine: { value: new THREE.Color("#ece8e1") }, uDashed: { value: 1 }, uSolid: { value: 0 }, uTexture: { value: 1 } }),
    [],
  );
  // The future roads carry a solid centre line so the three read as arrows pointing ahead.
  const forkUniforms = useMemo(
    () => ({ ...fogUniforms, uTime: { value: 0 }, uLine: { value: new THREE.Color("#ece8e1") }, uDashed: { value: 1 }, uSolid: { value: 1 }, uTexture: { value: 1 } }),
    [],
  );
  const groundUniforms = useMemo(
    () => ({ ...fogUniforms, uTime: { value: 0 }, uLine: { value: new THREE.Color("#000000") }, uDashed: { value: 0 }, uSolid: { value: 0 }, uTexture: { value: 2 } }),
    [],
  );
  const roadMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const forkMaterialRef = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (roadMaterialRef.current) roadMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    // The forks share one uniforms object, so the first material ticks them all.
    if (forkMaterialRef.current) forkMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group>
      <mesh geometry={ground}>
        <shaderMaterial vertexShader={roadVertex} fragmentShader={roadFragment} uniforms={groundUniforms} />
      </mesh>
      {forks.map((g, i) => (
        <mesh key={i} geometry={g}>
          <shaderMaterial ref={i === 0 ? forkMaterialRef : undefined} vertexShader={roadVertex} fragmentShader={roadFragment} uniforms={forkUniforms} />
        </mesh>
      ))}
      <mesh geometry={geometry} position={[0, 0.01, 0]}>
        <shaderMaterial ref={roadMaterialRef} vertexShader={roadVertex} fragmentShader={roadFragment} uniforms={uniforms} />
      </mesh>
    </group>
  );
}
