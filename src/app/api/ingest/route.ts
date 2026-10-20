import { z } from "zod";
import entries from "../../../../data/entries.json";
import { isAuthed, sameOrigin } from "@/lib/admin/session";
import { ingest } from "@/lib/ingest/pipeline";
import { llmConfigured } from "@/lib/llm/openrouter";
import type { Entry } from "@/lib/schema";

export const maxDuration = 60;

const Body = z
  .object({
    url: z.string().url().optional(),
    text: z.string().max(50_000).optional(),
    kind: z.enum(["news", "projection", "auto"]).optional(),
    note: z.string().max(1000).optional(),
  })
  .refine((b) => b.url || b.text, "Provide url or text");

/**
 * POST /api/ingest — paste an article (URL or text) about a new development or a
 * forecast. It is classified, drafted into schema-valid candidates, de-duplicated,
 * and opened as a draft PR for review. Nothing is published directly.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!isAuthed(req)) return Response.json({ error: "Unauthorised" }, { status: 401 });
  if (!llmConfigured()) return Response.json({ error: "LLM not configured" }, { status: 503 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  try {
    const result = await ingest(parsed.data, entries as Entry[]);
    return Response.json(result);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Ingestion failed" }, { status: 502 });
  }
}
