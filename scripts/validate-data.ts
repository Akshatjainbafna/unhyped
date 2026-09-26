import { readFileSync, existsSync } from "node:fs";
import { validateDataset } from "../src/lib/dataset";

const read = (f: string) => (existsSync(`data/${f}`) ? JSON.parse(readFileSync(`data/${f}`, "utf8")) : []);
const raw = {
  entries: read("entries.json"),
  claims: read("claims.json"),
  stillAlive: read("still-alive.json"),
  people: read("people.json"),
  scenarios: read("scenarios.json"),
};
const errors = validateDataset(raw);
const byEra = raw.entries.reduce((m: Record<number, number>, e: { era: number }) => ((m[e.era] = (m[e.era] ?? 0) + 1), m), {});
console.log(`entries=${raw.entries.length} claims=${raw.claims.length} stillAlive=${raw.stillAlive.length} people=${raw.people.length} scenarios=${raw.scenarios.length}`);
console.log("by era:", byEra);
if (errors.length) {
  console.error(`${errors.length} errors`);
  for (const e of errors.slice(0, 50)) console.error(`  ${e.path}: ${e.message}`);
  process.exit(1);
}
console.log("dataset OK");
