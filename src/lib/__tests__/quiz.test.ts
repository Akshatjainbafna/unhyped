import { describe, expect, it } from "vitest";
import { answer, isComplete, levelFor, next, result, start, type QuizState } from "../quiz/engine";
import { QUESTION_BANK } from "../quiz/bank";
import { generateQuestions } from "../quiz/generator";
import { PLANS, WEIGHTS, type Dimension, type Question } from "../quiz/types";
import { fixtureDataset } from "./fixtures";

const dims: Dimension[] = ["concepts", "lineage", "awareness", "prompting", "proficiency", "hype", "building", "workflow"];
const pool: Question[] = dims.flatMap((dimension) =>
  [1, 2, 3].flatMap((difficulty) =>
    [0, 1, 2].map((k) => ({
      id: `${dimension}-${difficulty}-${k}`,
      tracks: dimension === "building" ? ["builder"] : ["user", "builder"],
      dimension,
      format: "mcq",
      difficulty: difficulty as 1 | 2 | 3,
      autoGraded: !["prompting", "building"].includes(dimension),
      prompt: "?",
    })) as Question[],
  ),
);

function run(state: QuizState, score: (q: Question) => number) {
  const seen: Question[] = [];
  for (;;) {
    const r = next(state, pool);
    if (!r.question) return { state: r.state, seen };
    seen.push(r.question);
    state = answer(r.state, r.question, score(r.question));
  }
}

describe("quiz engine", () => {
  it("has weights summing to 100 per track", () => {
    for (const w of Object.values(WEIGHTS)) expect(Object.values(w).reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("refuses the researcher track", () => {
    expect(() => start("researcher", pool)).toThrow(/coming soon/i);
  });

  it("covers every weighted dimension and keeps to each track's length", () => {
    for (const track of ["user", "builder"] as const) {
      const { state, seen } = run(start(track, pool, { seed: 42 }), () => 1);
      const covered = new Set(seen.map((q) => q.dimension));
      for (const d of dims) if (WEIGHTS[track][d] > 0) expect(covered.has(d)).toBe(true);
      expect(covered.has("building")).toBe(track === "builder");
      expect(seen.length).toBeGreaterThanOrEqual(PLANS[track].min);
      expect(seen.length).toBeLessThanOrEqual(PLANS[track].max);
      expect(isComplete(state, pool)).toBe(true);
    }
  });

  it("gives the user track 20 questions with exactly 4 written, and no history or hype", () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const { seen } = run(start("user", pool, { seed }), () => (seed % 2 ? 1 : 0));
      expect(seen).toHaveLength(20);
      expect(seen.filter((q) => !q.autoGraded)).toHaveLength(4);
      expect(seen.some((q) => ["lineage", "awareness", "hype"].includes(q.dimension))).toBe(false);
    }
  });

  it("asks at most one question per group", () => {
    const grouped = pool.map((q, i) => (q.dimension === "concepts" ? { ...q, group: `g${i % 2}` } : q));
    const seen: Question[] = [];
    let s = start("user", grouped, { seed: 11 });
    for (;;) {
      const r = next(s, grouped);
      if (!r.question) break;
      seen.push(r.question);
      s = answer(r.state, r.question, 1);
    }
    const groups = seen.map((q) => q.group).filter(Boolean);
    expect(new Set(groups).size).toBe(groups.length);
  });

  it("raises difficulty after correct answers and lowers it after misses", () => {
    const s0 = start("user", pool, { seed: 1 });
    const q = pool[0];
    expect(answer(s0, q, 1).difficulty).toBe(3);
    expect(answer(s0, q, 0).difficulty).toBe(1);
    expect(answer(answer(s0, q, 1), q, 1).difficulty).toBe(3);
  });

  it("is reproducible for a seed and varies across seeds", () => {
    const ids = (seed: number) => run(start("builder", pool, { seed }), () => 0.5).seen.map((q) => q.id);
    expect(ids(7)).toEqual(ids(7));
    const variants = new Set([1, 2, 3, 4, 5].map((s) => ids(s).join()));
    expect(variants.size).toBeGreaterThan(1);
  });

  it("scores 100% / Architect for perfect answers and 0% / Curious for none", () => {
    const perfect = run(start("user", pool, { seed: 3 }), () => 1).state;
    expect(result(perfect, pool)).toMatchObject({ percent: 100, level: "Architect" });
    const zero = run(start("user", pool, { seed: 3 }), () => 0).state;
    expect(result(zero, pool)).toMatchObject({ percent: 0, level: "Curious" });
  });

  it("maps level thresholds at the edges", () => {
    expect(levelFor(39)).toBe("Curious");
    expect(levelFor(40)).toBe("Practitioner");
    expect(levelFor(64)).toBe("Practitioner");
    expect(levelFor(65)).toBe("Power User");
    expect(levelFor(85)).toBe("Architect");
  });

  it("uses only auto-graded questions in light mode and renormalises weights", () => {
    const s = start("builder", pool, { seed: 9, lightMode: true });
    expect(s.weights.prompting).toBe(0);
    expect(s.weights.building).toBe(0);
    expect(Object.values(s.weights).reduce((a, b) => a + b, 0)).toBeCloseTo(1);
    const { seen } = run(s, () => 1);
    expect(seen.every((q) => q.autoGraded)).toBe(true);
  });

  it("skips ungradable questions without counting them, then stays auto-graded", async () => {
    const { skip } = await import("../quiz/engine");
    const free = pool.find((q) => !q.autoGraded && q.tracks.includes("user"))!;
    let s = skip(start("user", pool, { seed: 2 }), free);
    const { seen, state } = run(s, () => 1);
    expect(seen.every((q) => q.autoGraded)).toBe(true);
    expect(seen.find((q) => q.id === free.id)).toBeUndefined();
    s = state;
    expect(result(s, pool).percent).toBe(100);
  });

  it("serves injected follow-ups next", async () => {
    const { injectFollowUp } = await import("../quiz/engine");
    const follow: Question = { ...pool[0], id: "cross-1", format: "cross-question" };
    const s = injectFollowUp(start("user", pool, { seed: 1 }), follow);
    expect(next(s, pool).question?.id).toBe("cross-1");
  });
});

describe("question generator", () => {
  const ds = fixtureDataset();
  const decoys = ["Claude Cowork", "Fluxion Agent", "Nimbus Code", "Orbit Studio", "Quill Pilot"];
  const qs = generateQuestions(ds, { now: 2026.74, decoys });

  it("builds awareness questions only from the last 90 days", () => {
    const aw = qs.filter((q) => q.dimension === "awareness");
    expect(aw.map((q) => q.reviewEntryId)).toEqual(["claude-cowork"]);
  });

  it("never uses a real entry name as a decoy", () => {
    const aw = qs.find((q) => q.dimension === "awareness")!;
    const cowork = aw.options!.filter((o) => o === "claude-cowork" || o === "Claude Cowork");
    expect(cowork).toHaveLength(1);
    expect(aw.options![aw.answer as number]).toBe("claude-cowork");
  });

  it("builds hype questions only from verified, named quotes", () => {
    const hype = qs.filter((q) => q.dimension === "hype");
    expect(hype.map((q) => q.id)).toEqual(["hype-hinton-radiologists"]);
    expect(hype[0].options![hype[0].answer as number]).toBe("It was wrong");
  });

  it("builds answerable stack and ordering questions", () => {
    for (const q of qs.filter((q) => q.dimension === "lineage")) {
      expect(typeof q.answer).toBe("number");
      expect(q.options![q.answer as number]).toBeDefined();
    }
  });
});

describe("question bank", () => {
  const user = QUESTION_BANK.filter((q) => q.tracks.includes("user"));

  it("has enough user questions for a full run, even without the grader", () => {
    const auto = user.filter((q) => q.autoGraded);
    expect(auto.length).toBeGreaterThanOrEqual(PLANS.user.max + 8);
    expect(user.filter((q) => !q.autoGraded).length).toBeGreaterThanOrEqual(PLANS.user.written! * 2);
    for (const d of dims) if (WEIGHTS.user[d] > 0) expect(auto.some((q) => q.dimension === d)).toBe(true);
  });

  it("explains every user question, and grades every written one against a rubric", () => {
    for (const q of user) {
      expect(q.explanation, q.id).toBeTruthy();
      if (!q.autoGraded) expect(q.rubric?.criteria.length, q.id).toBeGreaterThan(0);
      if (q.autoGraded) expect(q.options?.[q.answer as number], q.id).toBeDefined();
    }
  });

  it("gives nothing away by option length", () => {
    const mc = QUESTION_BANK.filter((q) => q.options && q.options.length >= 3 && typeof q.answer === "number");
    let longest = 0;
    let shortest = 0;
    for (const q of mc) {
      const len = q.options!.map((o) => o.length);
      const right = len[q.answer as number];
      const others = len.filter((_, i) => i !== q.answer);
      // Options sit within a similar length band…
      expect(Math.max(...len) / Math.min(...len), q.id).toBeLessThanOrEqual(2);
      if (right > Math.max(...others)) longest++;
      if (right < Math.min(...others)) shortest++;
    }
    // …and the right answer is the longest (or shortest) about as often as chance would give.
    expect(longest / mc.length).toBeLessThanOrEqual(0.3);
    expect(shortest / mc.length).toBeLessThanOrEqual(0.3);
  });

  it("has unique ids", () => {
    expect(new Set(QUESTION_BANK.map((q) => q.id)).size).toBe(QUESTION_BANK.length);
  });

  it("completes a real 20-question user run in light mode", () => {
    const s0 = start("user", QUESTION_BANK, { seed: 5, lightMode: true });
    let s = s0;
    let n = 0;
    for (;;) {
      const r = next(s, QUESTION_BANK);
      if (!r.question) break;
      n++;
      s = answer(r.state, r.question, 1);
    }
    expect(n).toBe(20);
  });
});
