import "server-only";
import type { Candidates } from "./candidates";

/**
 * Opens a *draft* pull request with the proposed data changes. Nothing is
 * published until a human reviews and merges it.
 */
const API = "https://api.github.com";

async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub ${init.method ?? "GET"} ${path}: ${res.status}`);
  return (res.status === 204 ? undefined : await res.json()) as T;
}

async function readJson(repo: string, path: string, ref: string): Promise<{ data: unknown[]; sha?: string }> {
  try {
    const f = await gh<{ content: string; sha: string }>(`/repos/${repo}/contents/${path}?ref=${ref}`);
    return { data: JSON.parse(Buffer.from(f.content, "base64").toString("utf8")), sha: f.sha };
  } catch {
    return { data: [] };
  }
}

async function appendJson(repo: string, branch: string, path: string, items: unknown[], message: string) {
  if (!items.length) return;
  const { data, sha } = await readJson(repo, path, branch);
  const content = Buffer.from(JSON.stringify([...data, ...items], null, 2) + "\n").toString("base64");
  await gh(`/repos/${repo}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message, content, branch, ...(sha ? { sha } : {}) }),
  });
}

export async function openDraftPR({
  candidates,
  meta,
  sourceUrl,
}: {
  candidates: Candidates;
  meta: { kind: string; criterion: string; confidence: string; reasoning: string };
  sourceUrl?: string;
}): Promise<string> {
  const repo = process.env.GITHUB_REPO!;
  const base = process.env.GITHUB_BASE_BRANCH ?? "main";
  const ref = await gh<{ object: { sha: string } }>(`/repos/${repo}/git/ref/heads/${base}`);
  const branch = `ingest/${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;
  await gh(`/repos/${repo}/git/refs`, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.object.sha }) });

  const msg = `ingest: ${sourceUrl ?? "pasted text"}`;
  await appendJson(repo, branch, "data/parts/entries-ingested.json", candidates.entries, msg);
  await appendJson(repo, branch, "data/parts/updates-ingested.json", candidates.updates, msg);
  await appendJson(repo, branch, "data/parts/forecasts-ingested.json", candidates.forecasts, msg);
  await appendJson(repo, branch, "data/review/claim-candidates.json", candidates.claimCandidates, msg);

  const list = (title: string, rows: string[]) => (rows.length ? `### ${title}\n${rows.map((r) => `- ${r}`).join("\n")}\n` : "");
  const body = [
    `Source: ${sourceUrl ?? "pasted text"}`,
    `Classification: **${meta.kind}** · criterion: ${meta.criterion || "n/a"} · confidence: **${meta.confidence}**`,
    `> ${meta.reasoning}`,
    list("New entries (status: draft)", candidates.entries.map((e) => `\`${e.id}\` ${e.title} (${e.date}) — ${e.description}`)),
    list("Major updates", candidates.updates.map((u) => `\`${u.parentId}\` ← ${u.update.title} (${u.update.date})`)),
    list("Forecasts", candidates.forecasts.map((f) => `${f.scenario}: ${f.forecast.forecaster} → ${f.forecast.targetDate}: ${f.forecast.claim}`)),
    list("Claim candidates (unverified quotes; write Reality by hand before publishing)", candidates.claimCandidates.map((c) => `${c.speaker}: “${c.quote}”`)),
    list("Rejected", candidates.rejected.map((r) => `${r.what}: ${r.reason}`)),
    "Review checklist: verify every date and quote against the source · flip `status` to `published` · run `npm run merge:data && npm run validate:data`.",
  ].join("\n\n");

  const pr = await gh<{ html_url: string }>(`/repos/${repo}/pulls`, {
    method: "POST",
    body: JSON.stringify({ title: `Ingest: ${candidates.entries[0]?.title ?? meta.kind}`, head: branch, base, body, draft: true }),
  });
  return pr.html_url;
}

/** Opens a ready-for-review PR for one researched tool: its entry and, if it fits a class, its compare cells. */
export async function openResearchPR({
  entry,
  compareTool,
  summary,
}: {
  entry: import("../schema").Entry;
  compareTool?: import("../compare").CompareTool;
  summary: string;
}): Promise<string> {
  const repo = process.env.GITHUB_REPO!;
  const base = process.env.GITHUB_BASE_BRANCH ?? "main";
  const ref = await gh<{ object: { sha: string } }>(`/repos/${repo}/git/ref/heads/${base}`);
  const branch = `ingest/${entry.id}-${Math.random().toString(36).slice(2, 6)}`;
  await gh(`/repos/${repo}/git/refs`, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.object.sha }) });
  const msg = `research: add ${entry.title}`;
  await appendJson(repo, branch, "data/parts/entries-ingested.json", [entry], msg);
  if (compareTool) await appendJson(repo, branch, "data/parts/compare-ingested.json", [compareTool], msg);
  const pr = await gh<{ html_url: string }>(`/repos/${repo}/pulls`, {
    method: "POST",
    body: JSON.stringify({
      title: `Add ${entry.title}`,
      head: branch,
      base,
      body: `${summary}\n\nA workflow regenerates \`data/*.json\` and validates them on this branch. Check every date and cell against the sources, then merge.`,
    }),
  });
  return pr.html_url;
}
