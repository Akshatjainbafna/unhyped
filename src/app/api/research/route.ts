import { z } from "zod";
import entries from "../../../../data/entries.json";
import { isAuthed, sameOrigin } from "@/lib/admin/session";
import { research } from "@/lib/ingest/research";
import { researchModels } from "@/lib/llm/openrouter";
import { EntrySchema } from "@/lib/schema";

export const maxDuration = 300;

const Body = z.object({
  query: z.string().trim().min(2).max(200),
  url: z.string().url().max(500).optional(),
  note: z.string().max(1000).optional(),
});

/**
 * POST /api/research: give it a tool's name (and optionally an official URL). It
 * reads the official pages itself, decides whether the tool meets the inclusion
 * rules, and if so opens a pull request with the entry and its Compare cells.
 * Owner only.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!isAuthed(req)) return Response.json({ error: "Unauthorised" }, { status: 401 });
  if (!process.env.OPENROUTER_API_KEY || !researchModels().length) return Response.json({ error: "LLM not configured (OPENROUTER_API_KEY and a model)" }, { status: 503 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  try {
    return Response.json(await research(parsed.data, EntrySchema.array().parse(entries)));
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Research failed" }, { status: 502 });
  }
}
