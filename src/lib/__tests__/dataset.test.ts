import { describe, expect, it } from "vitest";
import { buildDataset, renderableAsQuote, validateDataset } from "../dataset";
import { entry, fixtureEntries, fixtureRaw } from "./fixtures";

const withEntries = (extra: object[]) => ({ ...fixtureRaw, entries: [...fixtureEntries, ...extra] });

describe("dataset validation", () => {
  it("accepts the fixture dataset", () => {
    expect(validateDataset(fixtureRaw)).toEqual([]);
  });

  it("rejects an entry without sources", () => {
    const errors = validateDataset(withEntries([{ ...entry({ id: "x", date: "2020" }), sources: [] }]));
    expect(errors.some((e) => e.message.includes("at least one source"))).toBe(true);
  });

  it("rejects dangling edges", () => {
    const errors = validateDataset(withEntries([entry({ id: "x", date: "2020", edges: [{ type: "uses", target: "nope" }] })]));
    expect(errors).toContainEqual(expect.objectContaining({ message: 'edge target "nope" does not exist' }));
  });

  it("rejects duplicate ids", () => {
    const errors = validateDataset(withEntries([entry({ id: "prolog", date: "1972" })]));
    expect(errors.some((e) => e.message.includes("duplicate"))).toBe(true);
  });

  it("rejects a major update without a parent", () => {
    const errors = validateDataset(withEntries([entry({ id: "x", date: "2020", type: "major-update" })]));
    expect(errors.some((e) => e.message.includes("parentId"))).toBe(true);
  });

  it("rejects bad enums and malformed dates", () => {
    expect(validateDataset(withEntries([entry({ id: "x", date: "May 2020" })])).length).toBeGreaterThan(0);
    expect(validateDataset(withEntries([{ ...entry({ id: "y", date: "2020" }), primarySegment: "Vision" }])).length).toBeGreaterThan(0);
  });

  it("rejects claims pointing at missing entries", () => {
    const raw = { ...fixtureRaw, claims: [{ ...fixtureRaw.claims![0], entryId: "missing" }] };
    expect(validateDataset(raw).some((e) => e.path.startsWith("claims"))).toBe(true);
  });
});

describe("buildDataset", () => {
  it("orders the timeline newest first and leaves major updates out of it", () => {
    const ds = buildDataset(fixtureRaw);
    expect(ds.timeline[0].id).toBe("claude-cowork");
    expect(ds.timeline.at(-1)!.id).toBe("prolog");
    expect(ds.timeline.find((e) => e.id === "opus-5-5")).toBeUndefined();
  });
});

describe("renderableAsQuote", () => {
  it("only renders verified, named quotes as quotes", () => {
    const [named, sentiment] = fixtureRaw.claims!;
    expect(renderableAsQuote(named)).toBe(true);
    expect(renderableAsQuote(sentiment)).toBe(false);
    expect(renderableAsQuote({ ...named, quoteVerified: false })).toBe(false);
  });
});

describe("the real seed dataset", () => {
  it("validates", async () => {
    const { readFileSync } = await import("node:fs");
    const read = (f: string) => JSON.parse(readFileSync(`data/${f}`, "utf8"));
    const raw = {
      entries: read("entries.json"),
      claims: read("claims.json"),
      stillAlive: read("still-alive.json"),
      people: read("people.json"),
      scenarios: read("scenarios.json"),
    };
    expect(validateDataset(raw)).toEqual([]);
    const ids = new Set(raw.entries.map((e: { id: string }) => e.id));
    for (const must of ["prolog", "hermes", "hermes-agent", "claude-cowork", "transformer", "alexnet", "chatgpt"]) {
      expect(ids.has(must)).toBe(true);
    }
  });
});
