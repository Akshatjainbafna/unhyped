// Combines data/parts/*.json into the canonical data files and reports anything
// that would fail validation because it points across part boundaries.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = "data/parts";
const read = (f: string) => (existsSync(`${dir}/${f}`) ? JSON.parse(readFileSync(`${dir}/${f}`, "utf8")) : []);

type Row = { id: string; [k: string]: unknown };
const entryFiles = readdirSync(dir).filter((f) => f.startsWith("entries-"));
const entries: Row[] = [];
const seen = new Map<string, string>();
for (const f of entryFiles) {
  for (const e of read(f) as Row[]) {
    if (seen.has(e.id)) {
      console.warn(`duplicate id ${e.id} in ${f} (kept the one from ${seen.get(e.id)})`);
      continue;
    }
    seen.set(e.id, f);
    entries.push(e);
  }
}

// Parts were built in parallel; map the shared ids other parts used onto the canonical ones.
const ALIASES: Record<string, string> = {
  imagenet: "imagenet-2009",
  backpropagation: "backprop-1986",
  lenet: "lenet5-mnist-1998",
  lstm: "lstm-1997",
  cuda: "cuda-2007",
  lisp: "lisp-1958",
  perceptron: "perceptron-1958",
  "dartmouth-workshop": "dartmouth-1956",
  "fifth-generation-project": "fifth-generation-1982",
  "tesla-autopilot-fsd": "self-driving-hype",
  "google-bard": "bard",
};
const resolve = (id: string) => ALIASES[id] ?? id;
for (const e of entries) {
  e.edges = ((e.edges as { target: string; type: string }[] | undefined) ?? []).map((edge) => ({ ...edge, target: resolve(edge.target) }));
  if (e.parentId) e.parentId = resolve(e.parentId as string);
}

// Reviewed ingestion output: point releases onto their parents.
for (const u of read("updates-ingested.json") as { parentId: string; update: Row }[]) {
  const parent = entries.find((e) => e.id === resolve(u.parentId));
  if (parent) parent.majorUpdates = [...((parent.majorUpdates as Row[]) ?? []), u.update];
  else console.warn(`update for missing parent ${u.parentId}`);
}

const ids = new Set(entries.map((e) => e.id));
let dropped = 0;
for (const e of entries) {
  const edges = (e.edges as { target: string; type: string }[] | undefined) ?? [];
  e.edges = edges.filter((edge) => {
    if (ids.has(edge.target)) return true;
    console.warn(`drop edge ${e.id} -[${edge.type}]-> ${edge.target}`);
    dropped++;
    return false;
  });
  if (e.parentId && !ids.has(e.parentId as string)) console.warn(`missing parent ${e.parentId} for ${e.id}`);
}

const claims = (read("claims.json") as Row[]).map((c) => ({ ...c, entryId: resolve(c.entryId as string) })).filter((c) => {
  if (ids.has(c.entryId as string)) return true;
  console.warn(`claim ${c.id} → missing entry ${c.entryId}`);
  return false;
});
const people = (read("people.json") as Row[]).map((p) => ({
  ...p,
  knownFor: ((p.knownFor as string[]) ?? []).map(resolve).filter((k) => {
    if (ids.has(k)) return true;
    console.warn(`person ${p.id} knownFor missing ${k}`);
    return false;
  }),
}));
const claimIds = new Set(claims.map((c) => c.id));
const stillAlive = (read("still-alive.json") as Row[]).map((s) => ({
  ...s,
  entryId: s.entryId && ids.has(resolve(s.entryId as string)) ? resolve(s.entryId as string) : undefined,
  claimId: s.claimId && claimIds.has(s.claimId as string) ? s.claimId : undefined,
}));

const write = (f: string, v: unknown) => writeFileSync(`data/${f}`, JSON.stringify(v, null, 2) + "\n");
write("entries.json", entries);
write("claims.json", claims);
write("still-alive.json", stillAlive);
write("people.json", people);
const scenarios = read("scenarios.json") as { id: string; forecasts: Row[] }[];
for (const f of read("forecasts-ingested.json") as { scenario: string; forecast: Row }[]) {
  const sc = scenarios.find((s) => s.id === f.scenario);
  if (sc && !sc.forecasts.some((x) => x.id === f.forecast.id)) sc.forecasts.push(f.forecast);
}
write("scenarios.json", scenarios);
// Researched tools bring their Compare cells; add any whose entry exists and that are not already listed.
const compare = JSON.parse(readFileSync("data/compare.json", "utf8")) as { tools: { entryId: string }[] };
let addedCompare = 0;
for (const t of read("compare-ingested.json") as { entryId: string }[]) {
  if (ids.has(t.entryId) && !compare.tools.some((x) => x.entryId === t.entryId)) {
    compare.tools.push(t);
    addedCompare++;
  }
}
if (addedCompare) write("compare.json", compare);
// When the data last changed; shown on the site.
write("meta.json", { updatedAt: new Date().toISOString().slice(0, 10) });
console.log(`merged ${entries.length} entries from ${entryFiles.length} files; dropped ${dropped} dangling edges`);
