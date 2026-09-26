"use client";

import { useState } from "react";

type Result = {
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

export function IngestForm() {
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [kind, setKind] = useState("auto");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ url: url || undefined, text: text || undefined, kind, note: note || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  const field = "w-full rounded-2xl border border-hairline bg-ink-raised px-4 py-3 text-paper outline-none focus:border-hairline-strong";
  return (
    <>
      <form onSubmit={submit} className="mt-10 grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="token" className="text-sm text-paper-muted">Admin token</label>
          <input id="token" type="password" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} className={field} required />
        </div>
        <div className="grid gap-2">
          <label htmlFor="url" className="text-sm text-paper-muted">Article URL</label>
          <input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={field} placeholder="https://" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="text" className="text-sm text-paper-muted">…or paste the text</label>
          <textarea id="text" rows={8} value={text} onChange={(e) => setText(e.target.value)} className={`${field} font-mono text-[13px]`} />
          <p className="text-[12px] text-paper-faint">Use text for paywalled pages. The article is treated as data; instructions inside it are ignored.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
          <div className="grid gap-2">
            <label htmlFor="kind" className="text-sm text-paper-muted">Kind</label>
            <select id="kind" value={kind} onChange={(e) => setKind(e.target.value)} className={field}>
              <option value="auto">Auto-detect</option>
              <option value="news">New development</option>
              <option value="projection">Future forecast</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="note" className="text-sm text-paper-muted">Note for the reviewer (optional)</label>
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
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint">{result.kind} · {result.confidence} confidence</span>
            <br />
            {result.reasoning}
          </p>
          {result.prUrl ? (
            <a href={result.prUrl} target="_blank" rel="noreferrer" className="inline-block rounded-full border border-hairline-strong px-4 py-2 text-sm text-paper">Open draft PR</a>
          ) : (
            <p className="text-sm text-paper-muted">Dry run: nothing to add, or GitHub is not configured. Proposed changes are below.</p>
          )}
          {[
            ["New entries", result.entries.map((e) => `${e.title} (${e.date}) — ${e.description}`)],
            ["Major updates", result.updates.map((u) => `${u.parentId} ← ${u.update.title} (${u.update.date})`)],
            ["Forecasts", result.forecasts.map((f) => `${f.scenario}: ${f.forecast.forecaster} by ${f.forecast.targetDate} — ${f.forecast.claim}`)],
            ["Claim candidates (unverified)", result.claimCandidates.map((c) => `${c.speaker}: “${c.quote}”`)],
            ["Rejected", result.rejected.map((r) => `${r.what}: ${r.reason}`)],
          ].map(([title, rows]) =>
            (rows as string[]).length ? (
              <div key={title as string}>
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">{title as string}</h2>
                <ul className="mt-2 space-y-1 text-sm text-paper-muted">{(rows as string[]).map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            ) : null,
          )}
        </section>
      )}
    </>
  );
}
