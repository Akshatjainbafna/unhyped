// Shared vocabulary for the dataset, the road, the filter and the quiz.

export const ENTRY_TYPES = [
  "paper",
  "model",
  "product",
  "oss-repo",
  "major-update",
  "person",
  "org",
  "event",
] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export const ERAS = [
  { id: 0, name: "Tools extend the hand", short: "Tools" },
  { id: 1, name: "Machines follow logic", short: "Logic" },
  { id: 2, name: "Machines follow hand-written rules", short: "Rules" },
  { id: 3, name: "Machines learn patterns from data", short: "Patterns" },
  { id: 4, name: "Machines see and hear", short: "Perception" },
  { id: 5, name: "Machines write", short: "Language" },
  { id: 6, name: "Machines reason and use tools", short: "Reasoning" },
  { id: 7, name: "Machines act and create across media", short: "Agency" },
  { id: 8, name: "Projections", short: "Futures" },
] as const;
export type EraId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export const ERA_COUNT = ERAS.length;

/**
 * Where each era's *world* begins along the road. An entry's own `era` is set by
 * its capability (Deep Blue is era 1 though it is from 1997); the backdrop follows
 * the dominant capability of the time, so it must be monotonic in date.
 * Era 8 (projections) lives above "Today" and has no start year.
 */
export const ERA_START_YEAR: Record<Exclude<EraId, 8>, number> = {
  0: -Infinity,
  1: 1943, // McCulloch–Pitts, then Turing and Dartmouth
  2: 1966, // ELIZA, then expert systems and Prolog
  3: 1986, // backpropagation popularised
  4: 2012, // AlexNet
  5: 2017.5, // Transformer
  6: 2024.7, // o1: reasoning models and tool use
  7: 2025.9, // agents that act across media
};

export const SEGMENT_GROUPS = {
  Foundations: ["symbolic-logic", "classical-ml", "neural-deep-learning"],
  Capabilities: [
    "vision",
    "language",
    "speech-audio",
    "rl-games",
    "generative-media",
    "robotics-embodied",
  ],
  "The modern stack": [
    "foundation-models",
    "coding-agents",
    "personal-agents",
    "agent-frameworks",
    "llmops-eval",
    "local-runtimes",
    "workflow-lowcode",
    "protocols",
    "vector-rag",
  ],
  "Cross-cutting": ["compute-hardware", "safety-alignment"],
} as const;

export type SegmentId =
  (typeof SEGMENT_GROUPS)[keyof typeof SEGMENT_GROUPS][number];

export const SEGMENTS: Record<SegmentId, string> = {
  "symbolic-logic": "Symbolic & Logic AI",
  "classical-ml": "Classical ML",
  "neural-deep-learning": "Neural Networks & Deep Learning",
  vision: "Vision",
  language: "Language / NLP",
  "speech-audio": "Speech & Audio",
  "rl-games": "RL & Games",
  "generative-media": "Generative Media",
  "robotics-embodied": "Robotics & Embodied",
  "foundation-models": "Foundation Models",
  "coding-agents": "Coding Agents & Harnesses",
  "personal-agents": "Personal Agents",
  "agent-frameworks": "Agent Frameworks",
  "llmops-eval": "LLMOps & Eval",
  "local-runtimes": "Local Runtimes & Inference",
  "workflow-lowcode": "Workflow & Low-code",
  protocols: "Protocols & Standards",
  "vector-rag": "Vector DB & RAG",
  "compute-hardware": "Compute & Hardware",
  "safety-alignment": "Safety & Alignment",
};
export const SEGMENT_IDS = Object.keys(SEGMENTS) as SegmentId[];

// Bottom to top; `ops` is the side rail that spans every layer.
export const STACK_LAYERS = [
  { id: "compute", name: "Compute & Hardware" },
  { id: "data", name: "Data" },
  { id: "algorithms", name: "Algorithms & Research" },
  { id: "models", name: "Models" },
  { id: "inference", name: "Inference & Runtime" },
  { id: "frameworks", name: "Frameworks & SDKs" },
  { id: "protocols", name: "Protocols" },
  { id: "harnesses", name: "Harnesses & Agents" },
  { id: "apps", name: "Apps & Products" },
  { id: "ops", name: "Ops / Eval / Safety" },
] as const;
export type StackLayerId = (typeof STACK_LAYERS)[number]["id"];
export const STACK_LAYER_IDS = STACK_LAYERS.map((l) => l.id) as StackLayerId[];

export const EDGE_TYPES = [
  "built-on",
  "successor-of",
  "competes-with",
  "created-by",
  "uses",
  "inspired-by",
  "acquired-by",
] as const;
export type EdgeType = (typeof EDGE_TYPES)[number];

export const CLAIM_OUTCOMES = [
  "came-true",
  "partially",
  "not-yet",
  "wrong",
  "too-early",
] as const;
export type ClaimOutcome = (typeof CLAIM_OUTCOMES)[number];

export const SCENARIOS = [
  { id: "steady", name: "Steady progress" },
  { id: "plateau", name: "Plateau" },
  { id: "takeoff", name: "Fast takeoff" },
] as const;
export type ScenarioId = (typeof SCENARIOS)[number]["id"];
