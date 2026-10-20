"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ArticleResult = {
  kind: string;
  criterion: string;
  confidence: string;
  reasoning: string;
  prUrl?: string;
  dryRun: boolean;
  entries: { id: string; title: string; date: string; description: string }[];
  updates: { parentId: string; update: { title: string; date: string } }[];
  forecasts: { scenario: string; forecast: { forecaster: string; targetDate: string; claim: string } }[];
  claimCandidates: { speaker: string; quote: string }[];
  rejected: { what: string; reason: string }[];
};

type ToolResult = {
  verdict: "qualifies" | "not-qualified" | "needs-review";
  criterion: string;
  reasoning: string;
  entry?: { id: string; title: string; date: string; description: string; capabilityNote?: string; oss?: { stars?: number; license?: string } };
  compareTool?: { class: string; cells: Record<string, { v: unknown }> };
  problems: string[];
  sourcesRead: string[];
  prUrl?: string;
  dryRun: boolean;
};

const field = "w-full rounded-2xl border border-hairline bg-ink-raised px-4 py-3 text-paper outline-none focus:border-hairline-strong";
const label = "text-sm text-paper-muted";
const heading = "font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint";

/** Posts JSON; a 401 sends the owner back to sign in. */
function usePost() {
  const router = useRouter();
  return async <T,>(path: string, body: unknown): Promise<T> => {
    const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      router.replace("/admin/login");
      throw new Error("Signed out");
    }
    if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
    return data as T;
  };
}

export function IngestForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"tool" | "article">("tool");
  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };
  const tab = (m: typeof mode, text: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => setMode(m)}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${mode === m ? "bg-paper text-ink" : "text-paper-muted hover:text-paper"}`}
    >
      {text}
    </button>
  );
  return (
    <>
      <div className="mt-10 flex items-center justify-between gap-3">
        <div role="tablist" aria-label="What to add" className="flex gap-1 rounded-full border border-hairline p-1">
          {tab("tool", "Research a tool")}
          {tab("article", "From an article")}
        </div>
        <button type="button" onClick={signOut} className="text-sm text-paper-faint hover:text-paper">Sign out</button>
      </div>
      {mode === "tool" ? <ToolForm /> : <ArticleForm />}
    </>
  );
}

function ToolForm() {
  const post = usePost();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [r, setR] = useState<ToolResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setR(null);
    try {
      setR(await post<ToolResult>("/api/research", { query: name, url: url || undefined, note: note || undefined }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  const filled = r?.compareTool ? Object.values(r.compareTool.cells).filter((c) => c.v !== null).length : 0;
  const total = r?.compareTool ? Object.keys(r.compareTool.cells).length : 0;
  const tone = r?.verdict === "qualifies" ? "text-paper" : "text-paper-muted";

  return (
    <>
      <form onSubmit={submit} className="mt-8 grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="name" className={label}>Tool name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="e.g. LM Studio" required minLength={2} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="turl" className={label}>Official URL or GitHub repo (optional, but it helps)</label>
          <input id="turl" type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={field} placeholder="https://github.com/owner/repo" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="tnote" className={label}>Note for the reviewer (optional)</label>
          <input id="tnote" value={note} onChange={(e) => setNote(e.target.value)} className={field} />
        </div>
        {error && <p role="alert" className="text-sm text-wrong">{error}</p>}
        <button type="submit" disabled={busy || name.trim().length < 2} className="w-max rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-ink active:scale-[0.98] disabled:opacity-50">
          {busy ? "Researching… this can take a minute" : "Research and add if it qualifies"}
        </button>
      </form>

      {r && (
        <section aria-live="polite" className="mt-12 space-y-6 border-t border-hairline pt-8">
          <p className={tone}>
            <span className={heading}>{r.verdict === "qualifies" ? "Qualifies" : r.verdict === "not-qualified" ? "Does not qualify" : "Needs your review"}{r.criterion ? ` · ${r.criterion}` : ""}</span>
            <br />
            {r.reasoning}
          </p>
          {r.entry && (
            <div className="rounded-2xl border border-hairline p-4">
              <p className="font-serif text-2xl text-paper">{r.entry.title} <span className="font-mono text-xs text-paper-faint">{r.entry.date}</span></p>
              <p className="mt-2 text-sm text-paper-muted">{r.entry.description}</p>
              {r.entry.capabilityNote && <p className="mt-2 text-sm text-paper-faint">{r.entry.capabilityNote}</p>}
              {r.entry.oss && <p className="mt-2 font-mono text-[11px] text-paper-faint">{r.entry.oss.stars?.toLocaleString()} stars · {r.entry.oss.license ?? "license not declared"} (from the GitHub API)</p>}
              {r.compareTool && <p className="mt-2 font-mono text-[11px] text-paper-faint">Compare: {r.compareTool.class} · {filled} of {total} cells backed by a source</p>}
            </div>
          )}
          {r.prUrl ? (
            <a href={r.prUrl} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-paper px-5 py-2 text-sm font-medium text-ink">Review the pull request</a>
          ) : r.entry ? (
            <p className="text-sm text-paper-muted">Dry run: GitHub is not configured, so no pull request was opened.</p>
          ) : null}
          {r.problems.length > 0 && (
            <div>
              <h2 className={heading}>Notes</h2>
              <ul className="mt-2 space-y-1 text-sm text-paper-muted">{r.problems.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          )}
          {r.sourcesRead.length > 0 && (
            <div>
              <h2 className={heading}>Pages read</h2>
              <ul className="mt-2 space-y-1 break-all text-sm text-paper-muted">{r.sourcesRead.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          )}
        </section>
      )}
    </>
  );
}

function ArticleForm() {
  const post = usePost();
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [kind, setKind] = useState("auto");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArticleResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await post<ArticleResult>("/api/ingest", { url: url || undefined, text: text || undefined, kind, note: note || undefined }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <form onSubmit={submit} className="mt-8 grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="url" className={label}>Article URL</label>
          <input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={field} placeholder="https://" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="text" className={label}>…or paste the text</label>
          <textarea id="text" rows={8} value={text} onChange={(e) => setText(e.target.value)} className={`${field} font-mono text-[13px]`} />
          <p className="text-[12px] text-paper-faint">Use text for paywalled pages. The article is treated as data; instructions inside it are ignored.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
          <div className="grid gap-2">
            <label htmlFor="kind" className={label}>Kind</label>
            <select id="kind" value={kind} onChange={(e) => setKind(e.target.value)} className={field}>
              <option value="auto">Auto-detect</option>
              <option value="news">New development</option>
              <option value="projection">Future forecast</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="note" className={label}>Note for the reviewer (optional)</label>
            <input id="note" value={note} onChange={(e) => setNote(e.target.value)} className={field} />
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-wrong">{error}</p>}
        <button type="submit" disabled={busy || (!url && !text)} className="w-max rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-ink active:scale-[0.98] disabled:opacity-50">
          {busy ? "Evaluating…" : "Evaluate and draft PR"}
        </button>
      </form>

      {result && (
        <section aria-live="polite" className="mt-12 space-y-6 border-t border-hairline pt-8">
          <p className="text-paper">
            <span className={heading}>{result.kind} · {result.confidence} confidence</span>
            <br />
            {result.reasoning}
          </p>
          {result.prUrl ? (
            <a href={result.prUrl} target="_blank" rel="noreferrer" className="inline-block rounded-full border border-hairline-strong px-4 py-2 text-sm text-paper">Open draft PR</a>
          ) : (
            <p className="text-sm text-paper-muted">Dry run: nothing to add, or GitHub is not configured. Proposed changes are below.</p>
          )}
          {(
            [
              ["New entries", result.entries.map((e) => `${e.title} (${e.date}) — ${e.description}`)],
              ["Major updates", result.updates.map((u) => `${u.parentId} ← ${u.update.title} (${u.update.date})`)],
              ["Forecasts", result.forecasts.map((f) => `${f.scenario}: ${f.forecast.forecaster} by ${f.forecast.targetDate} — ${f.forecast.claim}`)],
              ["Claim candidates (unverified)", result.claimCandidates.map((c) => `${c.speaker}: “${c.quote}”`)],
              ["Rejected", result.rejected.map((r) => `${r.what}: ${r.reason}`)],
            ] as [string, string[]][]
          ).map(([title, rows]) =>
            rows.length ? (
              <div key={title}>
                <h2 className={heading}>{title}</h2>
                <ul className="mt-2 space-y-1 text-sm text-paper-muted">{rows.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            ) : null,
          )}
        </section>
      )}
    </>
  );
}
