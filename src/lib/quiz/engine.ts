import { DIMENSIONS, LEVELS, WEIGHTS, type Dimension, type Question, type Track } from "./types";

export const MIN_QUESTIONS = 12;
export const MAX_QUESTIONS = 15;

export type QuizState = {
  track: Exclude<Track, "researcher">;
  lightMode: boolean;
  weights: Record<Dimension, number>; // normalised to sum 1
  difficulty: 1 | 2 | 3;
  rng: number;
  asked: string[];
  scores: Record<string, number>; // question id → 0..1
  skipped: string[]; // could not be graded (e.g. budget cap); never counted
  queue: Question[]; // injected follow-ups (cross-questions) served first
};

export type QuizResult = {
  percent: number;
  level: string;
  dimensionScores: Partial<Record<Dimension, number>>; // 0..100
  reviewEntryIds: string[];
};

// mulberry32: small, seedable, good enough for question selection.
function nextRandom(seed: number): [number, number] {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, (seed + 0x6d2b79f5) | 0];
}

const DIMS = Object.keys(DIMENSIONS) as Dimension[];

export function availableDimensions(pool: Question[], track: QuizState["track"], lightMode: boolean): Dimension[] {
  return DIMS.filter(
    (d) =>
      WEIGHTS[track][d] > 0 &&
      pool.some((q) => q.dimension === d && q.tracks.includes(track) && (!lightMode || q.autoGraded)),
  );
}

export function start(
  track: Track,
  pool: Question[],
  { seed = Date.now(), lightMode = false }: { seed?: number; lightMode?: boolean } = {},
): QuizState {
  if (track === "researcher") throw new Error("The researcher track is coming soon");
  const dims = availableDimensions(pool, track, lightMode);
  const total = dims.reduce((sum, d) => sum + WEIGHTS[track][d], 0);
  const weights = Object.fromEntries(
    DIMS.map((d) => [d, dims.includes(d) ? WEIGHTS[track][d] / total : 0]),
  ) as Record<Dimension, number>;
  return { track, lightMode, weights, difficulty: 2, rng: seed | 0, asked: [], scores: {}, skipped: [], queue: [] };
}

function dimensionOf(pool: Question[], state: QuizState, id: string): Dimension | undefined {
  return pool.find((q) => q.id === id)?.dimension ?? state.queue.find((q) => q.id === id)?.dimension;
}

export function isComplete(state: QuizState, pool: Question[]): boolean {
  if (state.queue.length) return false;
  if (state.asked.length >= MAX_QUESTIONS) return true;
  const covered = new Set(state.asked.map((id) => dimensionOf(pool, state, id)));
  const allCovered = DIMS.every((d) => state.weights[d] === 0 || covered.has(d));
  return state.asked.length >= MIN_QUESTIONS && allCovered;
}

/** Picks the next question and returns the advanced state (rng moves on). */
export function next(state: QuizState, pool: Question[]): { question: Question | null; state: QuizState } {
  if (state.queue.length) {
    const [question, ...queue] = state.queue;
    return { question, state: { ...state, queue } };
  }
  if (isComplete(state, pool)) return { question: null, state };

  const candidates = pool.filter(
    (q) =>
      q.tracks.includes(state.track) &&
      !state.asked.includes(q.id) &&
      !state.skipped.includes(q.id) &&
      (!state.lightMode || q.autoGraded),
  );
  const counts = new Map<Dimension, number>();
  for (const id of state.asked) {
    const d = pool.find((q) => q.id === id)?.dimension;
    if (d) counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  const asked = Math.max(1, state.asked.length);
  // Uncovered dimensions first (heaviest first), then whichever is furthest below its weight.
  const order = DIMS.filter((d) => state.weights[d] > 0).sort((a, b) => {
    const ca = counts.get(a) ?? 0;
    const cb = counts.get(b) ?? 0;
    if ((ca === 0) !== (cb === 0)) return ca === 0 ? -1 : 1;
    return state.weights[b] - (cb / asked) - (state.weights[a] - ca / asked);
  });

  let rng = state.rng;
  for (const dim of order) {
    const inDim = candidates.filter((q) => q.dimension === dim);
    if (!inDim.length) continue;
    const best = Math.min(...inDim.map((q) => Math.abs(q.difficulty - state.difficulty)));
    const closest = inDim.filter((q) => Math.abs(q.difficulty - state.difficulty) === best);
    const [r, nextRng] = nextRandom(rng);
    rng = nextRng;
    return { question: closest[Math.floor(r * closest.length)], state: { ...state, rng } };
  }
  return { question: null, state };
}

/** Records a 0..1 score and steps difficulty up after a strong answer, down after a weak one. */
export function answer(state: QuizState, question: Question, score: number): QuizState {
  const s = Math.min(1, Math.max(0, score));
  const step = s >= 0.7 ? 1 : s < 0.4 ? -1 : 0;
  const difficulty = Math.min(3, Math.max(1, state.difficulty + step)) as 1 | 2 | 3;
  return { ...state, difficulty, asked: [...state.asked, question.id], scores: { ...state.scores, [question.id]: s } };
}

/**
 * Drops a question that could not be graded and switches to light mode, so the
 * rest of the run only uses auto-graded questions. The skipped one never counts.
 */
export function skip(state: QuizState, question: Question): QuizState {
  return { ...state, lightMode: true, skipped: [...state.skipped, question.id], queue: [] };
}

/** Adds an adaptive follow-up (e.g. an LLM cross-question) to be served next. */
export function injectFollowUp(state: QuizState, question: Question): QuizState {
  return { ...state, queue: [...state.queue, question] };
}

export function levelFor(percent: number): string {
  return LEVELS.find((l) => percent >= l.min)!.name;
}

export function result(state: QuizState, pool: Question[]): QuizResult {
  const byId = new Map(pool.map((q) => [q.id, q]));
  const sums = new Map<Dimension, { total: number; weight: number }>();
  const reviewEntryIds: string[] = [];
  for (const id of state.asked) {
    const q = byId.get(id);
    if (!q) continue;
    const score = state.scores[id] ?? 0;
    const w = q.difficulty; // harder questions count more within a dimension
    const cur = sums.get(q.dimension) ?? { total: 0, weight: 0 };
    sums.set(q.dimension, { total: cur.total + score * w, weight: cur.weight + w });
    if (score < 0.5 && q.reviewEntryId) reviewEntryIds.push(q.reviewEntryId);
  }
  const dimensionScores: QuizResult["dimensionScores"] = {};
  let weighted = 0;
  let weightTotal = 0;
  for (const [d, { total, weight }] of sums) {
    const mean = weight ? total / weight : 0;
    dimensionScores[d] = Math.round(mean * 100);
    weighted += mean * state.weights[d];
    weightTotal += state.weights[d];
  }
  const percent = weightTotal ? Math.round((weighted / weightTotal) * 100) : 0;
  return { percent, level: levelFor(percent), dimensionScores, reviewEntryIds: [...new Set(reviewEntryIds)] };
}
