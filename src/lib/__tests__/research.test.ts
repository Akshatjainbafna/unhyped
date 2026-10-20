import { describe, expect, it } from "vitest";
import { existingFrom } from "../ingest/candidates";
import { buildCompareTool, finishEntry, isSafeUrl, parseGithubRepo } from "../ingest/research-core";
import { sessionValid, makeSession, tokenMatches } from "../admin/session";
import { entry, fixtureEntries } from "./fixtures";

const classes = { "coding-agents": "Coding agents" };

describe("research checks", () => {
  it("refuses local and private URLs", () => {
    for (const u of ["http://localhost:3000", "http://127.0.0.1/x", "http://10.0.0.5", "http://192.168.1.2", "http://169.254.169.254/latest", "file:///etc/passwd", "https://intranet/x"]) expect(isSafeUrl(u)).toBe(false);
    expect(isSafeUrl("https://github.com/a/b")).toBe(true);
  });

  it("reads GitHub repos from URLs", () => {
    expect(parseGithubRepo("https://github.com/ruvnet/ruflo/tree/main")).toEqual({ owner: "ruvnet", repo: "ruflo" });
    expect(parseGithubRepo("https://example.com/a/b")).toBeNull();
  });

  it("keeps compare cells only when backed by a fetched source and never lets the model assign stars", () => {
    const fetched = new Set(["https://github.com/o/r"]);
    const { tool, problems } = buildCompareTool(
      "r",
      { class: "coding-agents", cells: { openSource: { v: true, src: "https://github.com/o/r" }, mcp: { v: true, src: "https://made-up.example" }, context: { v: 5, src: "https://github.com/o/r" } } },
      fetched,
      "2026-10-20",
      classes,
    );
    expect(problems).toEqual([]);
    expect(tool!.cells.openSource).toEqual({ v: true, src: "https://github.com/o/r" });
    expect(tool!.cells.mcp.v).toBeNull();
    expect(tool!.cells.context.v).toBeNull();
    expect(tool!.cells.price).toBeDefined();
  });

  it("overrides model-written GitHub facts and drops unfetched sources", () => {
    const existing = existingFrom(fixtureEntries);
    const raw = { ...entry({ id: "newtool", date: "2026-10-01", type: "product" }), sources: [{ url: "https://made-up.example", title: "x" }], oss: { stars: 99999 } };
    const { entry: e, problems } = finishEntry(
      raw,
      new Set(["https://github.com/o/newtool"]),
      { repoUrl: "https://github.com/o/newtool", stars: 120, license: "MIT", createdAt: "2026-10-01", archived: false, checkedAt: "2026-10-20" },
      existing,
      "2026-10-20",
    );
    expect(problems).toEqual([]);
    expect(e!.type).toBe("oss-repo");
    expect(e!.oss?.stars).toBe(120);
    expect(e!.sources.map((s) => s.url)).toEqual(["https://github.com/o/newtool"]);
  });

  it("rejects duplicates and entries with no fetched source", () => {
    const existing = existingFrom(fixtureEntries);
    expect(finishEntry(entry({ id: "claude", date: "2026" }), new Set(["https://example.com/claude"]), null, existing, "2026-10-20").problems[0]).toMatch(/already/);
    expect(finishEntry(entry({ id: "zzz", date: "2026" }), new Set(), null, existing, "2026-10-20").problems.join()).toMatch(/source/);
  });
});

describe("admin session", () => {
  it("accepts a fresh signed cookie, rejects tampered or expired ones", () => {
    process.env.UNHYPED_ADMIN_TOKEN = "s3cret-token";
    const now = Date.now();
    const c = makeSession(now);
    expect(sessionValid(c, now)).toBe(true);
    expect(sessionValid(c, now + 13 * 3600_000)).toBe(false);
    expect(sessionValid(c.replace(/.$/, c.endsWith("0") ? "1" : "0"), now)).toBe(false);
    expect(sessionValid(`${Number(c.split(".")[0]) + 999999}.${c.split(".")[1]}`, now)).toBe(false);
    expect(tokenMatches("s3cret-token")).toBe(true);
    expect(tokenMatches("nope")).toBe(false);
    delete process.env.UNHYPED_ADMIN_TOKEN;
    expect(sessionValid(c, now)).toBe(false);
  });
});
