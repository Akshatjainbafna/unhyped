// Applies a quote-verification pass to the data parts.
//   tsx scripts/apply-quote-verification.ts <dir with result-*.json> [YYYY-MM-DD]
//
// Rules (editorial standard: only checked, verbatim words render as quotes):
//  - verified / corrected, from a primary or reputable source that was opened
//      → wording replaced with the exact text, quoteVerified = true, source and date updated
//  - claims that are paraphrase-only / not-found / misattributed
//      → removed from published data into data/review/claims-held.json with the reason
//  - people-card quotes in those states → quote removed (kept in review file)
//  - forecasts: paraphrase-only stays (the forecast is real, shown without quote marks);
//      misattributed / not-found → held for review
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

type Verdict = "verified" | "corrected" | "paraphrase-only" | "misattributed" | "not-found";
type Result = {
  id: string;
  kind: "claim" | "person" | "forecast";
  verdict: Verdict;
  exactQuote?: string;
  sourceUrl?: string;
  sourceType?: "primary" | "reputable-secondary" | "weak";
  sourceOpened?: boolean;
  actualDate?: string;
  note?: string;
};

const dir = process.argv[2];
const day = process.argv[3] ?? new Date().toISOString().slice(0, 10);
if (!dir) throw new Error("usage: apply-quote-verification.ts <results dir> [date]");

const results: Result[] = readdirSync(dir)
  .filter((f) => /^result-\d+\.json$/.test(f))
  .flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8")));

const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const write = (p: string, v: unknown) => writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const DATE = /^-?\d{1,6}(-\d{2}(-\d{2})?)?$/;
const trusted = (r: Result) =>
  (r.verdict === "verified" || r.verdict === "corrected") &&
  !!r.exactQuote?.trim() &&
  r.sourceOpened === true &&
  (r.sourceType === "primary" || r.sourceType === "reputable-secondary") &&
  !!r.sourceUrl?.startsWith("http");
const held = (r: Result) => r.verdict === "misattributed" || r.verdict === "not-found" || r.verdict === "paraphrase-only";

const byId = new Map(results.map((r) => [`${r.kind}:${r.id}`, r]));
const report: string[] = [];
const log = (kind: string, id: string, r: Result, action: string) =>
  report.push(`| ${kind} | \`${id}\` | ${r.verdict} | ${action} | ${r.sourceUrl ? `[source](${r.sourceUrl})` : "—"} | ${(r.note ?? "").replace(/\|/g, "/").replace(/\n/g, " ")} |`);

// Claims
const claims = read("data/parts/claims.json");
const keptClaims = [];
const heldClaims = existsSync("data/review/claims-held.json") ? read("data/review/claims-held.json") : [];
for (const c of claims) {
  const r = byId.get(`claim:${c.id}`);
  if (!r) {
    keptClaims.push(c);
    continue;
  }
  if (trusted(r)) {
    const changed = r.exactQuote!.trim() !== c.quote.trim();
    c.quote = r.exactQuote!.trim();
    c.quoteVerified = true;
    c.claimSource = r.sourceUrl;
    if (r.actualDate && DATE.test(r.actualDate)) c.saidAt = r.actualDate;
    keptClaims.push(c);
    log("claim", c.id, r, changed ? "wording corrected, verified" : "verified");
  } else if (held(r)) {
    heldClaims.push({ ...c, heldReason: `${r.verdict}: ${r.note ?? ""}`, checkedAt: day, checkedSource: r.sourceUrl });
    log("claim", c.id, r, "held for review (removed from site)");
  } else {
    keptClaims.push(c);
    log("claim", c.id, r, "left unverified (weak or unopened source)");
  }
}
write("data/parts/claims.json", keptClaims);
mkdirSync("data/review", { recursive: true });
write("data/review/claims-held.json", heldClaims);

// Still-alive follow-ups must not point at a held claim.
const keptIds = new Set(keptClaims.map((c: { id: string }) => c.id));
const still = read("data/parts/still-alive.json").map((s: { claimId?: string }) =>
  s.claimId && !keptIds.has(s.claimId) ? { ...s, claimId: undefined } : s,
);
write("data/parts/still-alive.json", still);

// People
const people = read("data/parts/people.json");
const heldQuotes = existsSync("data/review/quotes-held.json") ? read("data/review/quotes-held.json") : [];
for (const p of people) {
  const r = byId.get(`person:${p.id}`);
  if (!r || !p.quote) continue;
  if (trusted(r)) {
    p.quote = { text: r.exactQuote!.trim(), verified: true, source: r.sourceUrl, date: r.actualDate && DATE.test(r.actualDate) ? r.actualDate : p.quote.date };
    log("person", p.id, r, "verified");
  } else if (held(r)) {
    heldQuotes.push({ personId: p.id, ...p.quote, heldReason: `${r.verdict}: ${r.note ?? ""}`, checkedAt: day });
    delete p.quote;
    log("person", p.id, r, "quote removed from card");
  } else log("person", p.id, r, "left unverified");
}
write("data/parts/people.json", people);
write("data/review/quotes-held.json", heldQuotes);

// Forecasts
const scenarios = read("data/parts/scenarios.json");
const heldForecasts = existsSync("data/review/forecasts-held.json") ? read("data/review/forecasts-held.json") : [];
for (const sc of scenarios) {
  sc.forecasts = sc.forecasts.filter((f: Record<string, unknown>) => {
    const r = byId.get(`forecast:${f.id}`);
    if (!r) return true;
    if (trusted(r)) {
      f.claim = r.exactQuote!.trim();
      f.quoteVerified = true;
      f.source = r.sourceUrl;
      if (r.actualDate && DATE.test(r.actualDate)) f.madeAt = r.actualDate;
      log("forecast", f.id as string, r, "verified");
      return true;
    }
    if (r.verdict === "misattributed" || r.verdict === "not-found") {
      heldForecasts.push({ scenario: sc.id, ...f, heldReason: `${r.verdict}: ${r.note ?? ""}`, checkedAt: day });
      log("forecast", f.id as string, r, "held for review (removed from site)");
      return false;
    }
    f.quoteVerified = false;
    log("forecast", f.id as string, r, "kept as paraphrase (no quote marks)");
    return true;
  });
}
write("data/parts/scenarios.json", scenarios);
write("data/review/forecasts-held.json", heldForecasts);

const counts = results.reduce<Record<string, number>>((m, r) => ((m[r.verdict] = (m[r.verdict] ?? 0) + 1), m), {});
mkdirSync("docs/verification", { recursive: true });
writeFileSync(
  `docs/verification/quotes-${day}.md`,
  [
    `# Quote verification pass — ${day}`,
    "",
    `Checked ${results.length} quotes. ${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(" · ")}.`,
    "",
    "Only wording confirmed in a primary or reputable source that was actually opened is marked verified.",
    "Held items are in `data/review/` and do not appear on the site.",
    "",
    "| Kind | Id | Verdict | Action | Source | Note |",
    "|---|---|---|---|---|---|",
    ...report,
    "",
  ].join("\n"),
);
console.log(`applied ${results.length} results:`, counts);
