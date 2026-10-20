import { z } from "zod";
import { CompareToolSchema, dimensionsFor, type CompareTool } from "../compare";
import { EntrySchema, type Entry } from "../schema";
import { existingFrom, normTitle } from "./candidates";

/** Pure half of tool research: validates what the model drafted against what was actually fetched. */

export const ResearchDraftSchema = z.object({
  verdict: z.enum(["qualifies", "not-qualified", "needs-review"]),
  criterion: z.string().default(""),
  reasoning: z.string().default(""),
  entry: z.unknown().optional(),
  compare: z.object({ class: z.string(), cells: z.record(z.string(), z.unknown()) }).optional(),
});
export type ResearchDraft = z.infer<typeof ResearchDraftSchema>;

export type GithubFacts = { repoUrl: string; stars: number; license?: string; createdAt: string; archived: boolean; checkedAt: string };

/** The admin fetches URLs on the server; keep it away from local and private addresses. */
export function isSafeUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal") || !h.includes(".")) return false;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
      const [a, b] = h.split(".").map(Number);
      if (a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return false;
    }
    return !h.includes(":") && !h.startsWith("[");
  } catch {
    return false;
  }
}

export function parseGithubRepo(raw: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(raw);
    if (u.hostname !== "github.com") return null;
    const [owner, repo] = u.pathname.split("/").filter(Boolean);
    return owner && repo ? { owner, repo: repo.replace(/\.git$/, "") } : null;
  } catch {
    return null;
  }
}

const normUrl = (u: string) => u.replace(/#.*$/, "").replace(/\/$/, "");

/**
 * Cells keep only sources that were really fetched, and any claimed value without
 * one is demoted to "not verified". Every dimension of the class is present.
 */
export function buildCompareTool(
  entryId: string,
  draft: NonNullable<ResearchDraft["compare"]>,
  fetched: Set<string>,
  asOf: string,
  classes: Record<string, string>,
): { tool?: CompareTool; problems: string[] } {
  const problems: string[] = [];
  if (!(draft.class in classes)) return { problems: [`unknown compare class "${draft.class}"`] };
  const ok = new Set([...fetched].map(normUrl));
  const used = new Set<string>();
  const cells: CompareTool["cells"] = {};
  for (const d of dimensionsFor(draft.class)) {
    const raw = (draft.cells[d.id] ?? {}) as { v?: unknown; note?: unknown; src?: unknown };
    const src = typeof raw.src === "string" && ok.has(normUrl(raw.src)) ? raw.src : undefined;
    const typeOk =
      d.kind === "bool" ? typeof raw.v === "boolean" || raw.v === "partial" : d.kind === "stars" ? Number.isInteger(raw.v) && (raw.v as number) >= 1 && (raw.v as number) <= 5 : typeof raw.v === "string" && raw.v.trim() !== "";
    // Star ratings are editorial; the model may not assign them.
    if (!typeOk || !src || d.kind === "stars") {
      cells[d.id] = { v: null, note: typeof raw.note === "string" && raw.v == null ? raw.note.slice(0, 160) : "Not verified" };
      continue;
    }
    used.add(src);
    cells[d.id] = { v: raw.v as never, ...(typeof raw.note === "string" && raw.note ? { note: raw.note.slice(0, 160) } : {}), src };
  }
  const parsed = CompareToolSchema.safeParse({ entryId, class: draft.class, asOf, sources: [...used].length ? [...used] : [...fetched].slice(0, 1), cells });
  if (!parsed.success) return { problems: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) };
  if (!Object.values(cells).some((c) => c.v !== null)) problems.push("no compare cell could be backed by a fetched source");
  return { tool: parsed.data, problems };
}

/** Facts the API gave us override whatever the model wrote. */
export function finishEntry(
  raw: unknown,
  fetched: Set<string>,
  gh: GithubFacts | null,
  existing: ReturnType<typeof existingFrom>,
  today: string,
): { entry?: Entry; problems: string[] } {
  const base = { ...(raw as object), status: "published" } as Record<string, unknown>;
  const sources = Array.isArray(base.sources) ? (base.sources as { url?: string; title?: string }[]) : [];
  const ok = new Set([...fetched].map(normUrl));
  base.sources = sources.filter((s) => s.url && ok.has(normUrl(s.url))).map((s) => ({ url: s.url, title: s.title ?? s.url, accessedAt: today }));
  if (gh) {
    base.type = "oss-repo";
    base.oss = { license: gh.license, repoUrl: gh.repoUrl, stars: gh.stars, starsCheckedAt: today, ...(gh.archived ? { archived: true } : {}) };
    if (!(base.sources as unknown[]).some((s) => normUrl((s as { url: string }).url) === normUrl(gh.repoUrl))) (base.sources as unknown[]).push({ url: gh.repoUrl, title: "GitHub repository (API)", accessedAt: today });
  }
  const parsed = EntrySchema.safeParse(base);
  if (!parsed.success) return { problems: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) };
  const e = parsed.data;
  if (existing.ids.has(e.id) || existing.titles.has(normTitle(e.title))) return { problems: [`already in the data as "${e.id}"`] };
  e.edges = e.edges.filter((edge) => existing.ids.has(edge.target));
  if (e.parentId && !existing.ids.has(e.parentId)) delete e.parentId;
  return { entry: e, problems: [] };
}
