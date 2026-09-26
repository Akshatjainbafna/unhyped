import { DatasetSchema, type DatasetData, type Entry, type RawDataset } from "./schema";

export type DatasetError = { path: string; message: string };

export type Dataset = DatasetData & {
  byId: Map<string, Entry>;
  /** Published entries sorted newest first (the direction of travel). */
  timeline: Entry[];
};

/** Sortable number for a partial date: 1956 → 1956.0, 2026-01-12 → ~2026.03. */
export function dateValue(date: string): number {
  const neg = date.startsWith("-");
  const [y, m = "1", d = "1"] = (neg ? date.slice(1) : date).split("-");
  const year = Number(y) * (neg ? -1 : 1);
  return year + (Number(m) - 1) / 12 + (Number(d) - 1) / 365;
}

export function validateDataset(raw: unknown): DatasetError[] {
  const parsed = DatasetSchema.safeParse(raw);
  if (!parsed.success) {
    return parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
  }
  return checkReferences(parsed.data);
}

function checkReferences(data: DatasetData): DatasetError[] {
  const errors: DatasetError[] = [];
  const ids = new Set<string>();
  data.entries.forEach((e, i) => {
    if (ids.has(e.id)) errors.push({ path: `entries.${i}.id`, message: `duplicate id "${e.id}"` });
    ids.add(e.id);
  });

  data.entries.forEach((e, i) => {
    e.edges.forEach((edge, j) => {
      if (!ids.has(edge.target)) {
        errors.push({ path: `entries.${i}.edges.${j}`, message: `edge target "${edge.target}" does not exist` });
      }
    });
    if (e.type === "major-update" && !e.parentId) {
      errors.push({ path: `entries.${i}.parentId`, message: "major-update entries need a parentId" });
    }
    if (e.parentId && !ids.has(e.parentId)) {
      errors.push({ path: `entries.${i}.parentId`, message: `parent "${e.parentId}" does not exist` });
    }
  });

  data.claims.forEach((c, i) => {
    if (!ids.has(c.entryId)) errors.push({ path: `claims.${i}.entryId`, message: `entry "${c.entryId}" does not exist` });
  });
  const claimIds = new Set(data.claims.map((c) => c.id));
  data.stillAlive.forEach((s, i) => {
    if (s.entryId && !ids.has(s.entryId)) errors.push({ path: `stillAlive.${i}.entryId`, message: `entry "${s.entryId}" does not exist` });
    if (s.claimId && !claimIds.has(s.claimId)) errors.push({ path: `stillAlive.${i}.claimId`, message: `claim "${s.claimId}" does not exist` });
  });
  data.people.forEach((p, i) => {
    p.knownFor.forEach((k, j) => {
      if (!ids.has(k)) errors.push({ path: `people.${i}.knownFor.${j}`, message: `entry "${k}" does not exist` });
    });
  });
  return errors;
}

export function buildDataset(raw: RawDataset): Dataset {
  const errors = validateDataset(raw);
  if (errors.length) {
    const head = errors.slice(0, 10).map((e) => `  ${e.path}: ${e.message}`).join("\n");
    throw new Error(`Invalid dataset (${errors.length} errors):\n${head}`);
  }
  const data = DatasetSchema.parse(raw);
  const byId = new Map(data.entries.map((e) => [e.id, e]));
  const timeline = data.entries
    .filter((e) => e.status === "published" && e.type !== "major-update")
    .sort((a, b) => dateValue(b.date) - dateValue(a.date));
  return { ...data, byId, timeline };
}

/**
 * Only verified, named quotes may render as quotes. Everything else renders as
 * a paraphrased sentiment without quotation marks.
 */
export function renderableAsQuote(claim: { attribution: string; quoteVerified: boolean }): boolean {
  return claim.attribution === "named" && claim.quoteVerified;
}
