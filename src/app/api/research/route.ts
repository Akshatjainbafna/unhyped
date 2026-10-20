import { z } from "zod";
import entries from "../../../../data/entries.json";
import { isAuthed, sameOrigin } from "@/lib/admin/session";
import { research } from "@/lib/ingest/research";
import { researchKey, researchModels } from "@/lib/llm/openrouter";
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
  if (!researchKey() || !researchModels().length) return Response.json({ error: "LLM not configured (a research API key and UNHYPED_RESEARCH_MODEL)" }, { status: 503 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  // Research takes a minute or two. Stream newline-delimited JSON (progress, heartbeats, then the
  // result) so the connection never sits idle long enough for a browser or proxy to drop it.
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (o: object) => {
        try {
          controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
        } catch {
          /* client went away; the work still finishes */
        }
      };
      const beat = setInterval(() => send({ type: "ping" }), 8_000);
      try {
        const data = await research(parsed.data, EntrySchema.array().parse(entries), (message) => send({ type: "progress", message }));
        send({ type: "result", data });
      } catch (e) {
        send({ type: "error", error: e instanceof Error ? e.message : "Research failed" });
      } finally {
        clearInterval(beat);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store, no-transform", "X-Accel-Buffering": "no" } });
}
