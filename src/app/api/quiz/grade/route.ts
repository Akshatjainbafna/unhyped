import { z } from "zod";
import { admit, clientIp } from "@/lib/llm/budget";
import { grade } from "@/lib/llm/grader";
import { llmConfigured } from "@/lib/llm/openrouter";
import { QUESTION_BANK } from "@/lib/quiz/bank";
import type { Question } from "@/lib/quiz/types";

const Body = z.object({
  session: z.string().min(8).max(64),
  answer: z.string().max(6000),
  questionId: z.string().optional(),
  // Cross-questions are generated per session, so the client sends them back.
  cross: z.object({ question: z.string().max(600), criteria: z.array(z.string().max(300)).min(1).max(5) }).optional(),
});

export async function POST(req: Request) {
  if (!llmConfigured()) return Response.json({ mode: "light-mode" }, { status: 503 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });
  const { session, answer, questionId, cross } = parsed.data;

  let question: Question | undefined = QUESTION_BANK.find((q) => q.id === questionId && q.rubric);
  if (!question && cross) {
    question = {
      id: "cross",
      tracks: ["user", "builder"],
      dimension: "proficiency",
      format: "cross-question",
      difficulty: 3,
      autoGraded: false,
      prompt: cross.question,
      rubric: {
        criteria: cross.criteria,
        anchors: [
          { score: 0, answer: "No answer, or generic text that could apply to any tool." },
          { score: 3, answer: "Plausible but generic; mentions one criterion." },
          { score: 5, answer: "Specific, first-hand detail covering most criteria." },
        ],
      },
    };
  }
  if (!question) return Response.json({ error: "Unknown question" }, { status: 404 });

  // Double grading may take a third pass; reserve up to 3 calls.
  const verdict = admit(session, clientIp(req), 3);
  if (verdict !== "allow") return Response.json({ mode: verdict }, { status: 429 });

  try {
    const g = await grade(question, answer);
    return Response.json({ score: g.score / 5, rationale: g.rationale, flags: g.flags });
  } catch {
    return Response.json({ mode: "light-mode" }, { status: 502 });
  }
}

/** Lets the quiz decide up front whether LLM-graded questions are available. */
export async function GET() {
  return Response.json({ llm: llmConfigured() });
}
