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
} as const;
export type Dimension = keyof typeof DIMENSIONS;

export const WEIGHTS: Record<Exclude<Track, "researcher">, Record<Dimension, number>> = {
  user: { concepts: 15, lineage: 10, awareness: 15, prompting: 25, proficiency: 25, hype: 10, building: 0 },
  builder: { concepts: 10, lineage: 10, awareness: 10, prompting: 15, proficiency: 20, hype: 10, building: 25 },
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
  | "cross-question";

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
};
