import { describe, expect, it } from "vitest";
import { DraftSchema, existingFrom, screen } from "../ingest/candidates";
import { entry, fixtureEntries } from "./fixtures";

const existing = existingFrom(fixtureEntries);
const draft = (d: object) => DraftSchema.parse({ kind: "new-entry", ...d });

describe("ingestion screening", () => {
  it("keeps valid new entries as drafts and strips edges to unknown ids", () => {
    const e = { ...entry({ id: "new-agent", date: "2026-09-20", edges: [{ type: "built-on", target: "claude" }, { type: "uses", target: "ghost" }] }), status: "published" };
    const c = screen(draft({ entries: [e] }), existing);
    expect(c.entries).toHaveLength(1);
    expect(c.entries[0].status).toBe("draft");
    expect(c.entries[0].edges.map((x) => x.target)).toEqual(["claude"]);
  });

  it("rejects duplicates by id or title", () => {
    const c = screen(draft({ entries: [entry({ id: "claude", date: "2026" }), { ...entry({ id: "chat-gpt-2", date: "2026" }), title: "ChatGPT" }] }), existing);
    expect(c.entries).toHaveLength(0);
    expect(c.rejected).toHaveLength(2);
  });

  it("rejects schema-invalid entries with a reason", () => {
    const c = screen(draft({ entries: [{ id: "bad", title: "Bad" }] }), existing);
    expect(c.entries).toHaveLength(0);
    expect(c.rejected[0].reason).toMatch(/date|sources/);
  });

  it("attaches updates only to existing parents and defaults their source", () => {
    const c = screen(
      draft({ kind: "major-update", updates: [{ parentId: "claude", date: "2026-09-25", title: "X", summary: "Y" }, { parentId: "nope", date: "2026", title: "Z", summary: "W" }] }),
      existing,
      "https://example.com/post",
    );
    expect(c.updates).toEqual([{ parentId: "claude", update: { date: "2026-09-25", title: "X", summary: "Y", source: "https://example.com/post" } }]);
    expect(c.rejected[0].reason).toMatch(/Parent/);
  });

  it("requires forecasts to name a forecaster and target date", () => {
    const ok = { scenario: "steady", id: "f1", forecaster: "Epoch AI", claim: "c", madeAt: "2026-09", targetDate: "2030", source: "https://example.com" };
    const bad = { scenario: "takeoff", id: "f2", forecaster: "", claim: "c", madeAt: "2026-09", source: "https://example.com" };
    const c = screen(draft({ kind: "projection", forecasts: [ok, bad] }), existing);
    expect(c.forecasts).toHaveLength(1);
    expect(c.forecasts[0].forecast.status).toBe("pending");
    expect(c.forecasts[0].forecast.quoteVerified).toBe(false);
    expect(c.rejected).toHaveLength(1);
  });

  it("never marks extracted quotes as verified", () => {
    const c = screen(
      draft({ kind: "claim-candidate", claimCandidates: [{ speaker: "A CEO", quote: "X is dead", saidAt: "2026-09", claimSource: "https://example.com" }] }),
      existing,
    );
    expect(c.claimCandidates[0].quoteVerified).toBe(false);
  });

  it("does nothing for non-notable articles", () => {
    const c = screen(draft({ kind: "not-notable", reasoning: "minor blog post", entries: [entry({ id: "x", date: "2026" })] }), existing);
    expect(c.entries).toHaveLength(0);
    expect(c.rejected[0].reason).toMatch(/Not notable/);
  });
});
