import { describe, expect, it } from "vitest";
import { entriesForSegments, lineage, neighborhood, similar, stackPosition, updatesFor } from "../graph";
import { fixtureDataset } from "./fixtures";

const ds = fixtureDataset();

describe("graph queries", () => {
  it("follows edges both ways and respects depth", () => {
    const one = neighborhood(ds, "gpt-3", 1).map((n) => n.entry.id).sort();
    expect(one).toEqual(["chatgpt", "transformer"]);
    const two = neighborhood(ds, "gpt-3", 2).map((n) => n.entry.id);
    expect(two).toContain("backprop");
    expect(two).toContain("claude");
    expect(two).not.toContain("gpt-3");
  });

  it("finds alternatives in the same layer and segment, excluding itself", () => {
    const alts = similar(ds, "langgraph").map((e) => e.id);
    expect(alts).not.toContain("langgraph");
    expect(alts[0]).toBe("crewai"); // explicit competes-with ranks first
    expect(alts).toContain("langchain");
    expect(alts).not.toContain("chatgpt");
  });

  it("reports the stack layer", () => {
    expect(stackPosition(ds, "langgraph")?.layer.id).toBe("frameworks");
    expect(stackPosition(ds, "claude-code")?.layer.name).toBe("Harnesses & Agents");
    expect(stackPosition(ds, "nope")).toBeUndefined();
  });

  it("walks successor chains", () => {
    expect(lineage(ds, "chatgpt").map((e) => e.id)).toEqual(["chatgpt"]);
  });

  it("lists child updates in date order", () => {
    expect(updatesFor(ds, "claude").map((e) => e.id)).toEqual(["claude-cowork", "opus-5-5"]);
  });

  it("filters by primary or secondary segments; empty selection matches all", () => {
    const vision = entriesForSegments(ds, ["vision"]);
    expect([...vision]).toEqual(["alexnet"]);
    expect(entriesForSegments(ds, []).size).toBe(ds.entries.length);
    const multi = entriesForSegments(ds, ["vision", "coding-agents"]);
    expect(multi.has("claude-code") && multi.has("alexnet")).toBe(true);
  });
});
