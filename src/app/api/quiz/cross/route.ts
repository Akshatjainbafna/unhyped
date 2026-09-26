import { z } from "zod";
import { admit, clientIp } from "@/lib/llm/budget";
import { crossQuestion } from "@/lib/llm/grader";
import { llmConfigured } from "@/lib/llm/openrouter";
import { QUESTION_BANK } from "@/lib/quiz/bank";

const Body = z.object({ session: z.string().min(8).max(64), questionId: z.string(), answer: z.string().max(4000) });

export async function POST(req: Request) {
  if (!llmConfigured()) return Response.json({ mode: "light-mode" }, { status: 503 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });
  const original = QUESTION_BANK.find((q) => q.id === parsed.data.questionId && q.format === "tool-usage");
  if (!original) return Response.json({ error: "Unknown question" }, { status: 404 });
  if (admit(parsed.data.session, clientIp(req)) !== "allow") return Response.json({ mode: "throttle" }, { status: 429 });
  try {
    return Response.json(await crossQuestion(original, parsed.data.answer));
  } catch {
    return Response.json({ error: "Could not write a follow-up" }, { status: 502 });
  }
}
