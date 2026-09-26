import { describe, expect, it } from "vitest";
import { rank } from "../../components/ui/SearchPalette";
import { entry } from "./fixtures";

const entries = [
  entry({ id: "claude-code", title: "Claude Code", date: "2025-02-24" }),
  entry({ id: "claude", title: "Claude", date: "2023-03-14" }),
  entry({ id: "prolog", title: "Prolog", date: "1972", creators: ["Alain Colmerauer"] }),
  entry({ id: "code-llama", title: "Code Llama", date: "2023-08" }),
];

describe("search ranking", () => {
  it("puts exact and prefix title matches first", () => {
    expect(rank(entries, "claude").map((e) => e.id)).toEqual(["claude", "claude-code"]);
  });
  it("matches word starts inside titles", () => {
    expect(rank(entries, "code").map((e) => e.id)).toEqual(["code-llama", "claude-code"]);
  });
  it("finds entries by creator", () => {
    expect(rank(entries, "colmerauer").map((e) => e.id)).toEqual(["prolog"]);
  });
  it("returns nothing for an empty query", () => {
    expect(rank(entries, "  ")).toEqual([]);
  });
});

describe("search typos", () => {
  const more = [...entries, entry({ id: "dspy", title: "DSPy", date: "2023-10" }), entry({ id: "jev", title: "Jev (TypeSafe AI)", date: "2026-09-15" })];
  it("forgives a small typo", () => {
    expect(rank(more, "dypy").map((e) => e.id)).toContain("dspy");
    expect(rank(more, "prologe").map((e) => e.id)).toContain("prolog");
  });
  it("still prefers exact matches", () => {
    expect(rank(more, "jev")[0].id).toBe("jev");
  });
});
