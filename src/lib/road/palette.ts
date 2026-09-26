import type { SegmentId } from "../taxonomy";

/**
 * Each era's world in the 3D view: sky (the era's atmosphere, shared with the
 * 2D map), an accent for its backdrop pattern, ground, and road surface.
 * Indexed by era id (0 Tools … 7 Agency, 8 Futures). Light and crisp: the
 * road darkens and roughens as you travel back, from asphalt to a dirt path.
 */
export const ERA_WORLDS = [
  { sky: "#ffe8c6", glow: "#ff8a3d", ground: "#f3cf9c", road: "#c79a62", motif: "Firelight on stone" },
  { sky: "#fff1d9", glow: "#e98b5b", ground: "#f2dcb8", road: "#a8977b", motif: "Punch cards and valve glow" },
  { sky: "#e6edf1", glow: "#3f9a6a", ground: "#d4dfe6", road: "#7e7c77", motif: "Green phosphor, frost at the edges" },
  { sky: "#e9eff5", glow: "#5b7fc7", ground: "#d6e0ea", road: "#6d707b", motif: "Wireframe" },
  { sky: "#e4f0ff", glow: "#2ea7b8", ground: "#d2e4f8", road: "#5f6474", motif: "A lattice waking up" },
  { sky: "#eaf3ff", glow: "#ff9f43", ground: "#d6e6f8", road: "#575c6e", motif: "Fields of text" },
  { sky: "#e0f1ff", glow: "#2ec4b6", ground: "#cfe5f8", road: "#4f5466", motif: "An interconnected graph" },
  { sky: "#d4efff", glow: "#4d8dff", ground: "#c2e3f5", road: "#4b5063", motif: "Volumetric, every medium at once" },
  { sky: "#f4faff", glow: "#9aa3b8", ground: "#e6eef7", road: "#8a90a2", motif: "Fog: several possible roads" },
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
