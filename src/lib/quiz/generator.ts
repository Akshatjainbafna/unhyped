import { dateValue, renderableAsQuote, type Dataset } from "../dataset";
import { STACK_LAYERS } from "../taxonomy";
import type { Question } from "./types";

export type GeneratorOptions = {
  now: number; // fractional year
  decoys: string[];
  awarenessWindowDays?: number;
  seed?: number;
};

function shuffle<T>(items: T[], seed: number): T[] {
  const a = [...items];
  let s = seed | 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s ^ (s >>> 15), 2246822519) + 0x9e3779b9) | 0;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const OUTCOME_LABEL = {
  "came-true": "It came true",
  partially: "Partially true",
  "not-yet": "Not yet",
  wrong: "It was wrong",
  "too-early": "Too early to tell",
} as const;

/** Questions derived from the dataset; they refresh automatically as data lands. */
export function generateQuestions(ds: Dataset, opts: GeneratorOptions): Question[] {
  const { now, awarenessWindowDays = 90, seed = 1 } = opts;
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");
  const names = new Set(ds.entries.flatMap((e) => [norm(e.title), norm(e.id)]));
  const decoys = opts.decoys.filter((d) => !names.has(norm(d)));
  const windowStart = now - awarenessWindowDays / 365;
  const out: Question[] = [];

  // Awareness: which of these shipped recently is real?
  const recent = ds.timeline.filter((e) => {
    const t = dateValue(e.date);
    return t >= windowStart && t <= now && e.type !== "person";
  });
  recent.forEach((e, i) => {
    const fakes = shuffle(decoys, seed + i).slice(0, 3);
    if (fakes.length < 3) return;
    const options = shuffle([e.title, ...fakes], seed * 31 + i);
    out.push({
      id: `aw-real-${e.id}`,
      tracks: ["user", "builder"],
      dimension: "awareness",
      format: "real-or-fake",
      difficulty: 2,
      autoGraded: true,
      prompt: "Only one of these shipped in the last three months. Which one is real?",
      options,
      answer: options.indexOf(e.title),
      explanation: e.description,
      reviewEntryId: e.id,
    });
  });

  // Hype calibration: only verified, named quotes become questions.
  const outcomes = Object.keys(OUTCOME_LABEL) as (keyof typeof OUTCOME_LABEL)[];
  ds.claims.filter(renderableAsQuote).forEach((c) => {
    out.push({
      id: `hype-${c.id}`,
      tracks: ["user", "builder"],
      dimension: "hype",
      format: "mcq",
      difficulty: 2,
      autoGraded: true,
      prompt: `${c.speaker} (${c.saidAt.slice(0, 4)}): “${c.quote}” — What happened?`,
      options: outcomes.map((o) => OUTCOME_LABEL[o]),
      answer: outcomes.indexOf(c.outcome),
      explanation: c.reality,
      reviewEntryId: c.entryId,
    });
  });

  // Lineage & stack: which layer does this belong to?
  const layered = ds.timeline.filter((e) => e.type !== "person" && e.type !== "event");
  shuffle(layered, seed).slice(0, 40).forEach((e, i) => {
    const correct = STACK_LAYERS.find((l) => l.id === e.stackLayer)!.name;
    const others = shuffle(
      STACK_LAYERS.filter((l) => l.id !== e.stackLayer).map((l) => l.name),
      seed + i,
    ).slice(0, 3);
    const options = shuffle([correct, ...others], seed * 17 + i);
    out.push({
      id: `stack-${e.id}`,
      tracks: ["user", "builder"],
      dimension: "lineage",
      format: "mcq",
      difficulty: e.stackLayer === "harnesses" || e.stackLayer === "protocols" ? 3 : 2,
      autoGraded: true,
      prompt: `Where does ${e.title} sit in the AI stack?`,
      options,
      answer: options.indexOf(correct),
      reviewEntryId: e.id,
    });
  });

  // Lineage: which came first?
  const pairs = shuffle(ds.timeline.filter((e) => e.type !== "person"), seed + 7);
  for (let i = 0; i + 1 < pairs.length && i < 40; i += 2) {
    const [a, b] = [pairs[i], pairs[i + 1]];
    const gap = Math.abs(dateValue(a.date) - dateValue(b.date));
    if (gap < 1) continue;
    const older = dateValue(a.date) < dateValue(b.date) ? 0 : 1;
    out.push({
      id: `order-${a.id}-${b.id}`,
      tracks: ["user", "builder"],
      dimension: "lineage",
      format: "mcq",
      difficulty: gap > 10 ? 1 : gap > 3 ? 2 : 3,
      autoGraded: true,
      prompt: "Which came first?",
      options: [a.title, b.title],
      answer: older,
      reviewEntryId: older === 0 ? a.id : b.id,
    });
  }
  return out;
}
