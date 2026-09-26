import type { SegmentId } from "../taxonomy";

/** v2 game palette: one hue family per lane, one tint + icon name per segment. */
export const FAMILY_COLORS = ["#ff9f43", "#4d8dff", "#2ec4b6", "#ff8fb1"]; // Foundations, Capabilities, Modern stack, Cross-cutting

export const SEGMENT_COLOR: Record<SegmentId, string> = {
  "symbolic-logic": "#ff9f43",
  "classical-ml": "#ffb86b",
  "neural-deep-learning": "#ffcf5c",
  vision: "#4d8dff",
  language: "#6aa9ff",
  "speech-audio": "#8ec5ff",
  "rl-games": "#3d74e0",
  "generative-media": "#9b7bff",
  "robotics-embodied": "#5aa0c9",
  "foundation-models": "#2ec4b6",
  "coding-agents": "#1fa89b",
  "personal-agents": "#4fd6c2",
  "agent-frameworks": "#20b486",
  "llmops-eval": "#67c587",
  "local-runtimes": "#3fb8a6",
  "workflow-lowcode": "#7ad3a1",
  protocols: "#16a0a0",
  "vector-rag": "#5cc7b8",
  "compute-hardware": "#ff8fb1",
  "safety-alignment": "#ff6b8a",
};

export const INK = "#26283b";
