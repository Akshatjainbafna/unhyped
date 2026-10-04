import compareJson from "../../data/compare.json";
import dimensionsJson from "../../data/compare-dimensions.json";
import entriesJson from "../../data/entries.json";
import meta from "../../data/meta.json";
import { CompareDataSchema, DimensionSchema, type CompareTool, type Dimension } from "./compare";
import { EntrySchema } from "./schema";
import { STACK_LAYERS } from "./taxonomy";

/** Set NEXT_PUBLIC_SITE_URL in the host's environment to the real domain. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://unhyped-ai.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "Unhyped";
export const UPDATED_ISO: string = meta.updatedAt;

export const entries = EntrySchema.array().parse(entriesJson).filter((e) => (e.status ?? "published") === "published");
export const entryById = new Map(entries.map((e) => [e.id, e]));

const compare = CompareDataSchema.parse(compareJson);
export const compareKinds = compare.classes;
export const compareTools = compare.tools;
export const dimensionsFor = (kind: string): Dimension[] =>
  (dimensionsJson as Record<string, unknown[]>)[kind]?.map((d) => DimensionSchema.parse(d)) ?? [];
export const toolsOfKind = (kind: string): CompareTool[] => compareTools.filter((t) => t.class === kind);
export const kindOfEntry = (id: string): string | undefined => compareTools.find((t) => t.entryId === id)?.class;

export const layerName = (id: string) => STACK_LAYERS.find((l) => l.id === id)?.name ?? id;

export const TYPE_LABEL: Record<string, string> = {
  paper: "Paper",
  model: "Model",
  product: "Product",
  "oss-repo": "Open-source project",
  "major-update": "Major update",
  person: "Person",
  org: "Organisation",
  event: "Event",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const bce = (d: string) => `${Number(d.slice(1).split("-")[0])} BCE`;
/** "2025-03-13" → "13 Mar 2025"; "-150" → "150 BCE". */
export function humanDate(d: string): string {
  if (d.startsWith("-")) return bce(d);
  const [y, m, day] = d.split("-");
  return [day && Number(day), m && MONTHS[Number(m) - 1], y].filter(Boolean).join(" ");
}
export const yearOf = (d: string) => (d.startsWith("-") ? bce(d) : d.split("-")[0]);

export const url = (path: string) => `${SITE_URL}${path}`;
export const clip = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}…`);

export function cellText(dim: Dimension, v: unknown): string {
  if (v === null || v === undefined) return "Not verified";
  if (dim.kind === "stars" && typeof v === "number") return `${v}/5`;
  if (dim.kind === "bool") return v === true ? "Yes" : v === false ? "No" : v === "partial" ? "Partly" : String(v);
  return String(v);
}
