export const TRACKS = ["user", "builder", "researcher"] as const;
export type Track = (typeof TRACKS)[number];
export const ENABLED_TRACKS: Track[] = ["user", "builder"];

export const DIMENSIONS = {
  concepts: "Concepts",
  lineage: "Lineage & Stack",
  awareness: "Awareness",
  prompting: "Prompting",
  proficiency: "Tool proficiency",
  hype: "Hype calibration",
  building: "Building",
  workflow: "Workflow & judgement",
} as const;
export type Dimension = keyof typeof DIMENSIONS;

export const WEIGHTS: Record<Exclude<Track, "researcher">, Record<Dimension, number>> = {
  // Users need to use AI well, not know its history: no lineage, launches or hype calibration.
  user: { concepts: 10, lineage: 0, awareness: 0, prompting: 30, proficiency: 25, hype: 0, building: 0, workflow: 35 },
  builder: { concepts: 10, lineage: 10, awareness: 10, prompting: 15, proficiency: 15, hype: 10, building: 20, workflow: 10 },
};

/**
 * Run length per track, and for the user track a fixed number of written
 * (LLM-graded) tasks so a run is mostly quick choices plus a few real exercises.
 */
export const PLANS: Record<Exclude<Track, "researcher">, { min: number; max: number; written?: number }> = {
  user: { min: 20, max: 20, written: 4 },
  builder: { min: 12, max: 15 },
};

export const LEVELS = [
  { min: 85, name: "Architect" },
  { min: 65, name: "Power User" },
  { min: 40, name: "Practitioner" },
  { min: 0, name: "Curious" },
] as const;

export type QuestionFormat =
  | "mcq"
  | "trick"
  | "real-or-fake"
  | "order"
  | "prompt-write"
  | "build-task"
  | "tool-usage"
  | "cross-question"
  | "prompt-improve"
  | "plan";

export type Rubric = {
  criteria: string[];
  /** Fixed anchor answers per score (0–5) keep open-weight graders consistent. */
  anchors: { score: number; answer: string }[];
};

export type Question = {
  id: string;
  tracks: Exclude<Track, "researcher">[];
  dimension: Dimension;
  format: QuestionFormat;
  difficulty: 1 | 2 | 3;
  /** Auto-graded questions need no LLM and survive light mode. */
  autoGraded: boolean;
  prompt: string;
  options?: string[];
  /** Index (or indices, for order) of the correct option(s). */
  answer?: number | number[];
  rubric?: Rubric;
  explanation?: string;
  reviewEntryId?: string;
  /** Only one question per group is asked in a run (e.g. the text and image versions of a task). */
  group?: string;
  /** Material the task works on (a prompt to improve, a draft to fix), shown under the question and given to the grader. */
  material?: string;
  /** Images the task refers to; their alt text is what the grader sees. */
  images?: { src: string; alt: string; label: string }[];
};
