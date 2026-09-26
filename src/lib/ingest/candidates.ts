import { z } from "zod";
import { EntrySchema, ForecastSchema, MajorUpdateSchema, type Entry } from "../schema";

/**
 * Pure half of the ingestion pipeline: take what the model drafted, keep only
 * schema-valid, non-duplicate candidates, and enforce the editorial rules.
 */
export const DraftSchema = z.object({
  kind: z.enum(["new-entry", "major-update", "projection", "claim-candidate", "not-notable"]),
  criterion: z.string().default(""),
  confidence: z.enum(["low", "medium", "high"]).default("low"),
  reasoning: z.string().default(""),
  entries: z.array(z.unknown()).default([]),
  updates: z.array(z.object({ parentId: z.string() }).passthrough()).default([]),
  forecasts: z.array(z.object({ scenario: z.enum(["steady", "plateau", "takeoff"]) }).passthrough()).default([]),
  claimCandidates: z
    .array(
      z.object({
        speaker: z.string(),
        quote: z.string(),
        saidAt: z.string(),
        claimSource: z.string().url(),
        entryId: z.string().optional(),
      }),
    )
    .default([]),
});
export type Draft = z.infer<typeof DraftSchema>;

export type Existing = { ids: Set<string>; titles: Set<string>; urls: Set<string> };
export type Candidates = {
  entries: Entry[];
  updates: { parentId: string; update: z.infer<typeof MajorUpdateSchema> }[];
  forecasts: { scenario: "steady" | "plateau" | "takeoff"; forecast: z.infer<typeof ForecastSchema> }[];
  claimCandidates: (Draft["claimCandidates"][number] & { quoteVerified: false })[];
  rejected: { what: string; reason: string }[];
};

export const normTitle = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");

export function existingFrom(entries: Entry[]): Existing {
  return {
    ids: new Set(entries.map((e) => e.id)),
    titles: new Set(entries.map((e) => normTitle(e.title))),
    urls: new Set(entries.flatMap((e) => e.sources.map((s) => s.url))),
  };
}

export function screen(draft: Draft, existing: Existing, sourceUrl?: string): Candidates {
  const out: Candidates = { entries: [], updates: [], forecasts: [], claimCandidates: [], rejected: [] };
  if (draft.kind === "not-notable") {
    out.rejected.push({ what: "article", reason: `Not notable: ${draft.reasoning}` });
    return out;
  }

  for (const raw of draft.entries) {
    // Ingested entries are always drafts until a human merges the PR.
    const parsed = EntrySchema.safeParse({ ...(raw as object), status: "draft" });
    if (!parsed.success) {
      out.rejected.push({ what: String((raw as { id?: string })?.id ?? "entry"), reason: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") });
      continue;
    }
    const e = parsed.data;
    if (existing.ids.has(e.id) || existing.titles.has(normTitle(e.title))) {
      out.rejected.push({ what: e.id, reason: "Duplicate of an existing entry; consider a major update instead" });
      continue;
    }
    // Edges may only point at entries that exist, or at other candidates in this batch.
    const batchIds = new Set(draft.entries.map((x) => (x as { id?: string })?.id));
    e.edges = e.edges.filter((edge) => existing.ids.has(edge.target) || batchIds.has(edge.target));
    out.entries.push(e);
  }

  for (const u of draft.updates) {
    const parsed = MajorUpdateSchema.safeParse(u);
    if (!existing.ids.has(u.parentId)) out.rejected.push({ what: `update → ${u.parentId}`, reason: "Parent entry does not exist" });
    else if (!parsed.success) out.rejected.push({ what: `update → ${u.parentId}`, reason: "Invalid update" });
    else out.updates.push({ parentId: u.parentId, update: { ...parsed.data, source: parsed.data.source ?? sourceUrl } });
  }

  for (const f of draft.forecasts) {
    // Projections must name who forecast what, by when.
    const parsed = ForecastSchema.safeParse({ ...f, quoteVerified: false, status: "pending" });
    if (!parsed.success || !parsed.data.forecaster.trim() || !parsed.data.targetDate) {
      out.rejected.push({ what: "forecast", reason: "Projections need a named forecaster, a target date and a source" });
      continue;
    }
    out.forecasts.push({ scenario: f.scenario, forecast: parsed.data });
  }

  // Quotes are extracted verbatim and never marked verified; Reality is written by a human.
  for (const c of draft.claimCandidates) out.claimCandidates.push({ ...c, quoteVerified: false });

  return out;
}
