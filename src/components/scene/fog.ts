import * as THREE from "three";

/** Shared distance-fog uniforms; the camera rig tints them to the current era's sky. */
export const fogUniforms = {
  uFogColor: { value: new THREE.Color("#0c0b0a") },
  uFogNear: { value: 60 },
  uFogFar: { value: 260 },
};

export const fogVertex = /* glsl */ `
  varying float vViewDist;
  #define FOG_VERTEX vViewDist = -(modelViewMatrix * vec4(position, 1.0)).z;
`;

export const fogFragment = /* glsl */ `
  varying float vViewDist;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  vec3 applyFog(vec3 c) {
    return mix(c, uFogColor, smoothstep(uFogNear, uFogFar, vViewDist));
  }
  float fogAlpha() { return 1.0 - smoothstep(uFogNear, uFogFar, vViewDist); }
`;
