"use client";

import { ArrowRight, ArrowUpRight, Lock, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Radar } from "./Radar";
import type { Dataset } from "@/lib/dataset";
import { DECOYS, QUESTION_BANK } from "@/lib/quiz/bank";
import { answer, injectFollowUp, next, result, skip, start, type QuizResult, type QuizState } from "@/lib/quiz/engine";
import { generateQuestions } from "@/lib/quiz/generator";
import { DIMENSIONS, type Question, type Track } from "@/lib/quiz/types";
import { personalRoad, quizOpen, useStore } from "@/lib/store";

type Stage =
  | { kind: "intro" }
  | { kind: "question"; question: Question; picked?: number; text: string; feedback?: { correct: boolean; note?: string } }
  | { kind: "grading"; question: Question }
  | { kind: "result"; result: QuizResult };

const TRACKS: { id: Track; name: string; blurb: string }[] = [
  { id: "user", name: "AI User", blurb: "You use AI tools to get work done." },
  { id: "builder", name: "AI Builder", blurb: "You build products, agents or pipelines on top of models." },
  { id: "researcher", name: "AI Researcher", blurb: "Coming soon." },
];

const NOW = 2026.74;

/** Serve options in random order so the answer position carries no signal. */
function shuffled(q: Question): Question {
  if (!q.options || typeof q.answer !== "number" || q.format === "real-or-fake") return q;
  if (q.options.length === 2 && q.options[0] === "True") return q;
  const order = q.options.map((_, i) => i).sort(() => Math.random() - 0.5);
  return { ...q, options: order.map((i) => q.options![i]), answer: order.indexOf(q.answer) };
}

function sessionId() {
  try {
    const k = "unhyped-session";
    const v = sessionStorage.getItem(k) ?? crypto.randomUUID();
    sessionStorage.setItem(k, v);
    return v;
  } catch {
    return crypto.randomUUID();
  }
}

export function QuizModal({ dataset }: { dataset: Dataset }) {
  const open = useStore(quizOpen);
  const [track, setTrack] = useState<Exclude<Track, "researcher">>("user");
  const [stage, setStage] = useState<Stage>({ kind: "intro" });
  const [llm, setLlm] = useState<boolean | null>(null);
  const [count, setCount] = useState(0);
  const state = useRef<QuizState | null>(null);
  const crossCriteria = useRef(new Map<string, string[]>());
  const injected = useRef<Question[]>([]);
  const dialog = useRef<HTMLDivElement>(null);

  const pool = useMemo(
    () => [...QUESTION_BANK, ...generateQuestions(dataset, { now: NOW, decoys: DECOYS, seed: 11 })],
    [dataset],
  );

  useEffect(() => {
    if (!open) return;
    fetch("/api/quiz/grade")
      .then((r) => r.json())
      .then((d) => setLlm(Boolean(d.llm)))
      .catch(() => setLlm(false));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && quizOpen.set(false);
    window.addEventListener("keydown", onKey);
    dialog.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const advance = (s: QuizState) => {
    const r = next(s, pool);
    state.current = r.state;
    setCount(r.state.asked.length);
    if (!r.question) {
      const all = [...pool, ...injected.current];
      const res = result(r.state, all);
      const byId = new Map(all.map((q) => [q.id, q]));
      const known = r.state.asked.filter((id) => (r.state.scores[id] ?? 0) >= 0.5).map((id) => byId.get(id)?.reviewEntryId).filter(Boolean) as string[];
      personalRoad.set({ known, missed: res.reviewEntryIds });
      setStage({ kind: "result", result: res });
      return;
    }
    setStage({ kind: "question", question: shuffled(r.question), text: "" });
  };

  const begin = () => {
    state.current = start(track, pool, { seed: Date.now(), lightMode: llm === false });
    advance(state.current);
  };

  const submitChoice = (q: Question, picked: number) => {
    const correct = picked === q.answer;
    setStage({ kind: "question", question: q, picked, text: "", feedback: { correct, note: q.explanation } });
  };

  const continueAfterChoice = (q: Question, picked: number) => {
    state.current = answer(state.current!, q, picked === q.answer ? 1 : 0);
    advance(state.current);
  };

  const submitText = async (q: Question, text: string) => {
    setStage({ kind: "grading", question: q });
    const session = sessionId();
    const cross = crossCriteria.current.get(q.id);
    try {
      const res = await fetch("/api/quiz/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cross ? { session, answer: text, cross: { question: q.prompt, criteria: cross } } : { session, answer: text, questionId: q.id }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const g = await res.json();
      let s = answer(state.current!, q, g.score);
      // Self-reported tool use gets a follow-up that is hard to bluff.
      if (q.format === "tool-usage") {
        const c = await fetch("/api/quiz/cross", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session, questionId: q.id, answer: text }),
        });
        if (c.ok) {
          const { question, criteria } = await c.json();
          const follow: Question = { ...q, id: `cross-${q.id}`, format: "cross-question", prompt: question, rubric: undefined };
          crossCriteria.current.set(follow.id, criteria);
          injected.current.push(follow);
          s = injectFollowUp(s, follow);
        }
      }
      state.current = s;
      advance(s);
    } catch {
      state.current = skip(state.current!, q);
      advance(state.current);
    }
  };

  const reset = () => {
    state.current = null;
    injected.current = [];
    setStage({ kind: "intro" });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button type="button" aria-label="Close quiz" className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={() => quizOpen.set(false)} />
      <div
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-title"
        className="relative w-full max-w-[720px] animate-[fadeUp_380ms_var(--ease-out)] rounded-[2rem] border border-white/15 bg-white/[0.06] p-1.5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] outline-none backdrop-blur-2xl backdrop-saturate-150"
      >
        {/* Liquid glass: an inner core with its own refraction edge. */}
        <div className="relative max-h-[86dvh] overflow-y-auto rounded-[calc(2rem-0.375rem)] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] px-6 pb-7 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.04)] sm:px-9 sm:pb-9">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-muted">
              Unhyped quiz{stage.kind !== "intro" && stage.kind !== "result" && ` · ${count + 1} of ~13`}
            </p>
            <button
              type="button"
              onClick={() => quizOpen.set(false)}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-paper-muted hover:text-paper"
            >
              <X weight="light" size={16} />
            </button>
          </div>

          {stage.kind === "intro" && (
            <div className="mt-4">
              <h2 id="quiz-title" className="max-w-[18ch] font-serif text-4xl leading-[1.02] text-paper sm:text-5xl">
                How much of AI do you actually know?
              </h2>
              <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-paper-muted">
                8–12 minutes. Multiple choice, trick questions, writing a real prompt, and follow-ups on the tools you say you use. It adapts to you.
              </p>
              <div role="radiogroup" aria-label="Choose a track" className="mt-7 grid gap-2 sm:grid-cols-3">
                {TRACKS.map((t) => {
                  const disabled = t.id === "researcher";
                  const on = t.id === track;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-disabled={disabled}
                      disabled={disabled}
                      onClick={() => !disabled && setTrack(t.id as Exclude<Track, "researcher">)}
                      className={`rounded-[1.25rem] border p-4 text-left transition-all duration-300 ease-spring ${on ? "border-white/40 bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"} ${disabled ? "cursor-not-allowed opacity-45" : "active:scale-[0.98]"}`}
                    >
                      <span className="flex items-center justify-between font-serif text-xl text-paper">
                        {t.name} {disabled && <Lock weight="light" size={14} />}
                      </span>
                      <span className="mt-1 block text-[12.5px] leading-snug text-paper-muted">{t.blurb}</span>
                    </button>
                  );
                })}
              </div>
              {llm === false && (
                <p className="mt-4 text-[12.5px] text-paper-muted">
                  Written answers are offline right now, so this run uses auto-graded questions only (light mode).
                </p>
              )}
              <button
                type="button"
                onClick={begin}
                disabled={llm === null}
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-paper py-2 pl-6 pr-2 text-sm font-medium text-ink transition-transform duration-300 ease-spring active:scale-[0.98] disabled:opacity-60"
              >
                Start the {TRACKS.find((t) => t.id === track)?.name} track
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 transition-transform duration-300 ease-spring group-hover:translate-x-0.5">
                  <ArrowRight weight="light" size={14} />
                </span>
              </button>
            </div>
          )}

          {stage.kind === "question" && (
            <QuestionView
              key={stage.question.id}
              stage={stage}
              onPick={(i) => submitChoice(stage.question, i)}
              onContinue={() => continueAfterChoice(stage.question, stage.picked!)}
              onSubmitText={(t) => submitText(stage.question, t)}
            />
          )}

          {stage.kind === "grading" && (
            <div className="mt-10 space-y-3" aria-live="polite">
              <p className="font-serif text-2xl text-paper">Reading your answer…</p>
              <div className="h-2 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="h-2 w-1/2 animate-pulse rounded-full bg-white/10" />
              <p className="text-[12.5px] text-paper-faint">Graded twice against a fixed rubric so scores stay consistent.</p>
            </div>
          )}

          {stage.kind === "result" && <ResultView result={stage.result} track={track} onRetake={reset} />}
        </div>
      </div>
    </div>
  );
}

function QuestionView({
  stage,
  onPick,
  onContinue,
  onSubmitText,
}: {
  stage: Extract<Stage, { kind: "question" }>;
  onPick: (i: number) => void;
  onContinue: () => void;
  onSubmitText: (t: string) => void;
}) {
  const q = stage.question;
  const [text, setText] = useState("");
  const free = !q.options;
  return (
    <div className="mt-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
        {DIMENSIONS[q.dimension]}
        {q.format === "cross-question" && " · follow-up"}
      </p>
      <h2 id="quiz-title" className="mt-2 font-serif text-[1.7rem] leading-snug text-paper">{q.prompt}</h2>

      {!free && (
        <div className="mt-6 grid gap-2">
          {q.options!.map((o, i) => {
            const picked = stage.picked === i;
            const reveal = stage.feedback && (i === q.answer || picked);
            const tone = !reveal ? "" : i === q.answer ? "border-accent/70 bg-accent/10" : "border-wrong/70 bg-wrong/10";
            return (
              <button
                key={i}
                type="button"
                disabled={Boolean(stage.feedback)}
                onClick={() => onPick(i)}
                className={`min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-[14.5px] text-paper transition-all duration-300 ease-spring hover:bg-white/[0.08] active:scale-[0.99] disabled:cursor-default ${tone}`}
              >
                {o}
              </button>
            );
          })}
        </div>
      )}

      {stage.feedback && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4" aria-live="polite">
          <p className="max-w-[48ch] text-[13.5px] text-paper-muted">
            <span className={stage.feedback.correct ? "text-accent" : "text-wrong"}>{stage.feedback.correct ? "Right." : "Not quite."}</span>{" "}
            {stage.feedback.note}
          </p>
          <button type="button" onClick={onContinue} className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2 text-sm font-medium text-ink active:scale-[0.98]">
            Next <ArrowRight weight="light" size={14} />
          </button>
        </div>
      )}

      {free && (
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitText(text);
          }}
        >
          <label htmlFor="quiz-answer" className="mb-2 block text-[12px] text-paper-muted">
            {q.format === "prompt-write" ? "Your prompt" : "Your answer"}
          </label>
          <textarea
            id="quiz-answer"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            className="w-full resize-y rounded-2xl border border-white/12 bg-ink/40 p-4 font-mono text-[13px] leading-relaxed text-paper outline-none placeholder:text-paper-faint focus:border-white/30"
            placeholder={q.format === "prompt-write" ? "Write it exactly as you would send it." : "Be specific; generic answers score low."}
          />
          <p className="mt-2 text-[11.5px] text-paper-faint">Graded by an open-weight model against a fixed rubric. Not stored.</p>
          <button type="submit" disabled={text.trim().length < 10} className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2 text-sm font-medium text-ink active:scale-[0.98] disabled:opacity-40">
            Submit <ArrowRight weight="light" size={14} />
          </button>
        </form>
      )}
    </div>
  );
}

function ResultView({ result: r, track, onRetake }: { result: QuizResult; track: Track; onRetake: () => void }) {
  const dims = Object.entries(r.dimensionScores).map(([k, v]) => ({ label: DIMENSIONS[k as keyof typeof DIMENSIONS], value: v ?? 0 }));
  const share = `/share?p=${r.percent}&l=${encodeURIComponent(r.level)}&t=${track}&d=${encodeURIComponent(
    Object.entries(r.dimensionScores).map(([k, v]) => `${k}:${v}`).join(","),
  )}`;
  return (
    <div className="mt-4 grid gap-8 sm:grid-cols-[1fr_1fr]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">Your Unhyped score</p>
        <p id="quiz-title" className="mt-2 font-serif text-7xl leading-none text-paper tabular">{r.percent}%</p>
        <p className="mt-2 font-serif text-2xl text-accent">{r.level}</p>
        <p className="mt-4 text-[13.5px] leading-relaxed text-paper-muted">
          Your road is now lit: gold where you knew it, coral where you missed. Close the quiz and travel it to fill the gaps.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a href={share} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-paper py-1.5 pl-5 pr-1.5 text-sm font-medium text-ink active:scale-[0.98]">
            Share your card
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/10"><ArrowUpRight weight="light" size={14} /></span>
          </a>
          <button type="button" onClick={() => quizOpen.set(false)} className="rounded-full border border-white/15 px-5 py-2 text-sm text-paper">See my road</button>
          <button type="button" onClick={onRetake} className="rounded-full px-4 py-2 text-sm text-paper-muted hover:text-paper">Retake</button>
        </div>
      </div>
      <Radar dims={dims} />
    </div>
  );
}
