import { z } from "zod";
import dimensionsJson from "../../data/compare-dimensions.json";

export const CompareLimit = 5;

export const DimensionSchema = z.object({
  group: z.string(),
  id: z.string(),
  label: z.string(),
  kind: z.enum(["bool", "stars", "text"]),
});
export type Dimension = z.infer<typeof DimensionSchema>;

/** `v: null` means "not verified": shown as such, never guessed. */
const CellSchema = z.object({
  v: z.union([z.boolean(), z.literal("partial"), z.number().int().min(1).max(5), z.string(), z.null()]),
  note: z.string().optional(),
  src: z.string().url().optional(),
});
export type Cell = z.infer<typeof CellSchema>;

export const CompareToolSchema = z.object({
  entryId: z.string(),
  class: z.string(),
  asOf: z.string(),
  sources: z.array(z.string().url()).min(1),
  cells: z.record(z.string(), CellSchema),
});
export type CompareTool = z.infer<typeof CompareToolSchema>;

export const CompareDataSchema = z.object({
  classes: z.record(z.string(), z.string()),
  tools: z.array(CompareToolSchema),
});
export type CompareData = z.infer<typeof CompareDataSchema>;

const DIMENSIONS_BY_CLASS = z.record(z.string(), z.array(DimensionSchema)).parse(dimensionsJson);
export const dimensionsFor = (cls: string): Dimension[] => DIMENSIONS_BY_CLASS[cls] ?? [];

/** Star ratings are editorial and only given where the docs give evidence. */
export const STAR_RUBRIC: Record<string, string> = {
  context: "Does it keep the right information in front of the model: project memory, session recall, isolated subagent context.",
  autonomy: "How much it can do unattended: scheduling, background runs, parallel agents.",
  extensibility: "How far you can bend it: MCP, plugins, skills, hooks, SDK.",
  setup: "How quickly a new user is working: install steps, accounts, keys, config.",
};

export function validateCompare(data: unknown, entryIds: Set<string>): string[] {
  const parsed = CompareDataSchema.safeParse(data);
  if (!parsed.success) return parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const t of parsed.data.tools) {
    if (!entryIds.has(t.entryId)) errors.push(`compare tool "${t.entryId}" is not an entry`);
    if (seen.has(t.entryId)) errors.push(`compare tool "${t.entryId}" is listed twice`);
    seen.add(t.entryId);
    if (!(t.class in parsed.data.classes) || !(t.class in DIMENSIONS_BY_CLASS)) errors.push(`${t.entryId}: unknown class "${t.class}"`);
    for (const d of dimensionsFor(t.class)) {
      const c = t.cells[d.id];
      if (!c) errors.push(`${t.entryId}: missing "${d.id}" (use v: null if not verified)`);
      else if (c.v !== null && d.kind === "stars" && typeof c.v !== "number") errors.push(`${t.entryId}.${d.id}: stars need a number 1-5`);
      else if (c.v !== null && d.kind === "bool" && typeof c.v === "number") errors.push(`${t.entryId}.${d.id}: expected yes/no`);
      else if (c.v !== null && d.kind === "text" && typeof c.v !== "string") errors.push(`${t.entryId}.${d.id}: expected text`);
    }
  }
  return errors;
}
