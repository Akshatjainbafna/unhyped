import type { SegmentId } from "../taxonomy";

/**
 * Each era's world: sky, horizon glow, ground and road surface. Indexed by era
 * id (0 Tools … 7 Agency, 8 Futures). Colours stay desaturated so only the
 * world, never the chrome, carries the glow.
 */
export const ERA_WORLDS = [
  { sky: "#0f0906", glow: "#ff8a3d", ground: "#22160e", road: "#3a2a1c", motif: "Firelight on stone" },
  { sky: "#100d09", glow: "#f2a950", ground: "#1b1712", road: "#2d2923", motif: "Punch cards and valve glow" },
  { sky: "#050f0b", glow: "#5fd49a", ground: "#0b1712", road: "#1a2621", motif: "Green phosphor, frost at the edges" },
  { sky: "#070b13", glow: "#7fa8e8", ground: "#0c1320", road: "#1b2231", motif: "Wireframe" },
  { sky: "#061018", glow: "#4ec3cf", ground: "#0a1820", road: "#1a2830", motif: "A lattice waking up" },
  { sky: "#0d0b10", glow: "#e9e1cf", ground: "#141218", road: "#26232b", motif: "Fields of text" },
  { sky: "#090d10", glow: "#9fdcc0", ground: "#10181a", road: "#1f2a2c", motif: "An interconnected graph" },
  { sky: "#0c0a0d", glow: "#f0a98a", ground: "#141015", road: "#2a2226", motif: "Volumetric, every medium at once" },
  { sky: "#101216", glow: "#d6dbe4", ground: "#15181d", road: "#2a2e35", motif: "Fog: several possible roads" },
] as const;

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** One muted hue per segment group so lanes read as families, not a rainbow. */
export const SEGMENT_COLORS: Record<SegmentId, string> = {
  "symbolic-logic": "#c9a36a",
  "classical-ml": "#b8b07a",
  "neural-deep-learning": "#d9c28a",
  vision: "#7fb3c9",
  language: "#9cc3d6",
  "speech-audio": "#86a9c2",
  "rl-games": "#7fa3b8",
  "generative-media": "#c7a0b0",
  "robotics-embodied": "#8fb0a2",
  "foundation-models": "#ece8e1",
  "coding-agents": "#a7c9a0",
  "personal-agents": "#b9d1a8",
  "agent-frameworks": "#98bf9a",
  "llmops-eval": "#a3b8a6",
  "local-runtimes": "#8fb5a0",
  "workflow-lowcode": "#b0c7a8",
  protocols: "#c3d6b4",
  "vector-rag": "#9fb89b",
  "compute-hardware": "#b3a69a",
  "safety-alignment": "#d7a58f",
};
