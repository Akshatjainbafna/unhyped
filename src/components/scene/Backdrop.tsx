"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { ERA_WORLDS, hexToRgb } from "@/lib/road/palette";
import { roadPosition } from "@/lib/store";

/**
 * Full-screen sky behind the road. Nine procedural motifs, one per era, are
 * mixed by the director's era weights so eras cross-fade continuously.
 */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uWeights[9];
  uniform vec3 uSky[9];
  uniform vec3 uGlow[9];
  uniform float uTime;
  uniform float uS;
  uniform float uAspect;
  uniform float uDetail;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  // 0 Firelight: warm flicker rising from the horizon.
  float mFire(vec2 uv) {
    float rise = fbm(vec2(uv.x * 3.0, uv.y * 2.0 - uTime * 0.35));
    return smoothstep(0.75, 0.0, uv.y) * (0.35 + 0.65 * rise) * (0.85 + 0.15 * sin(uTime * 7.0));
  }
  // 1 Punch cards / valves: a slow grid of holes and warm points.
  float mCards(vec2 uv) {
    vec2 g = vec2(uv.x * uAspect * 28.0, uv.y * 14.0 + uS * 0.02);
    vec2 c = fract(g) - 0.5;
    float hole = step(0.6, hash(floor(g))) * smoothstep(0.22, 0.12, length(c * vec2(1.0, 1.8)));
    return hole * 0.5 * smoothstep(1.0, 0.2, uv.y) + 0.25 * smoothstep(0.5, 0.0, uv.y);
  }
  // 2 CRT phosphor with frost creeping in from the edges.
  float mCrt(vec2 uv) {
    float scan = 0.5 + 0.5 * sin(uv.y * 420.0 + uTime * 2.0);
    float frost = smoothstep(0.35, 0.0, min(uv.x, 1.0 - uv.x)) * fbm(uv * 18.0);
    return 0.28 * scan * smoothstep(1.0, 0.1, uv.y) + 0.6 * frost;
  }
  // 3 Wireframe: a receding grid floor in the sky.
  float mWire(vec2 uv) {
    vec2 p = vec2((uv.x - 0.5) * uAspect / max(0.05, 1.0 - uv.y), 1.0 / max(0.05, 1.0 - uv.y) + uS * 0.01);
    vec2 g = abs(fract(p * 3.0) - 0.5);
    return smoothstep(0.03, 0.0, min(g.x, g.y)) * smoothstep(1.0, 0.45, uv.y) * 0.8;
  }
  // 4 Lattice: points connected into a waking net.
  float mLattice(vec2 uv) {
    vec2 g = vec2(uv.x * uAspect, uv.y) * 12.0 + vec2(0.0, uS * 0.01);
    vec2 id = floor(g), f = fract(g) - 0.5;
    vec2 jitter = vec2(hash(id), hash(id + 3.1)) - 0.5;
    float d = length(f - jitter * 0.6);
    float pulse = 0.5 + 0.5 * sin(uTime * 1.5 + hash(id) * 6.28);
    return smoothstep(0.08, 0.0, d) * pulse + 0.15 * fbm(g * 0.5);
  }
  // 5 Text fields: short dashes like lines of glyphs drifting.
  float mText(vec2 uv) {
    vec2 g = vec2(uv.x * uAspect * 60.0 + uTime * 0.6, uv.y * 40.0 + uS * 0.02);
    float row = floor(g.y);
    float on = step(0.45, hash(vec2(floor(g.x / 3.0), row)));
    float glyph = step(0.25, fract(g.y)) * step(0.1, fract(g.x)) * on;
    return glyph * 0.35 * smoothstep(1.0, 0.3, uv.y);
  }
  // 6 Graph: nodes with links, a web of tools.
  float mGraph(vec2 uv) {
    vec2 p = vec2(uv.x * uAspect, uv.y) * 6.0 + vec2(uTime * 0.02, uS * 0.004);
    float n = fbm(p * 1.5);
    float web = smoothstep(0.02, 0.0, abs(n - 0.5)) * 0.9;
    return web + 0.2 * smoothstep(0.7, 0.0, uv.y);
  }
  // 7 Volumetric bands across every medium.
  float mVolume(vec2 uv) {
    float b = fbm(vec2(uv.x * 2.0 + uTime * 0.05, uv.y * 6.0 - uTime * 0.08));
    return pow(b, 1.6) * 1.3 * smoothstep(1.0, 0.0, uv.y) + 0.2;
  }
  // 8 Fog over the futures.
  float mFog(vec2 uv) {
    return 0.35 + 0.5 * fbm(vec2(uv.x * 2.5 + uTime * 0.03, uv.y * 3.0));
  }

  void main() {
    vec2 uv = vUv;
    vec3 col = vec3(0.0);
    float motifs[9];
    motifs[0] = uWeights[0] > 0.001 ? mFire(uv) : 0.0;
    motifs[1] = uWeights[1] > 0.001 ? mCards(uv) : 0.0;
    motifs[2] = uWeights[2] > 0.001 ? mCrt(uv) : 0.0;
    motifs[3] = uWeights[3] > 0.001 ? mWire(uv) : 0.0;
    motifs[4] = uWeights[4] > 0.001 ? mLattice(uv) : 0.0;
    motifs[5] = uWeights[5] > 0.001 ? mText(uv) : 0.0;
    motifs[6] = uWeights[6] > 0.001 ? mGraph(uv) : 0.0;
    motifs[7] = uWeights[7] > 0.001 ? mVolume(uv) : 0.0;
    motifs[8] = uWeights[8] > 0.001 ? mFog(uv) : 0.0;
    for (int i = 0; i < 9; i++) {
      vec3 sky = mix(uSky[i] * 0.9, uSky[i] * 2.2 + uGlow[i] * 0.05, smoothstep(0.95, 0.0, uv.y));
      col += uWeights[i] * (sky + uGlow[i] * motifs[i] * 0.42 * uDetail);
    }
    // Vignette keeps the chrome legible at the edges.
    float v = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(uAspect * 0.8, 1.0)));
    gl_FragColor = vec4(col * (0.55 + 0.45 * v), 1.0);
  }
`;

export function Backdrop({ weightsRef, detail = 1 }: { weightsRef: React.RefObject<number[]>; detail?: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uWeights: { value: new Array(9).fill(0) },
      uSky: { value: ERA_WORLDS.map((w) => new THREE.Vector3(...hexToRgb(w.sky))) },
      uGlow: { value: ERA_WORLDS.map((w) => new THREE.Vector3(...hexToRgb(w.glow))) },
      uTime: { value: 0 },
      uS: { value: 0 },
      uAspect: { value: 1 },
      uDetail: { value: detail },
    }),
    [detail],
  );

  useFrame(({ clock, size }) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uWeights.value = weightsRef.current;
    u.uTime.value = clock.elapsedTime;
    u.uS.value = roadPosition.get();
    u.uAspect.value = size.width / size.height;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
