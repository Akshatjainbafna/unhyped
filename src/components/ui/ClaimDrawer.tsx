"use client";

import { ArrowSquareOut, X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { formatYear } from "../scene/Labels";
import { renderableAsQuote, type Dataset } from "@/lib/dataset";
import { openClaims, openEntry, useStore } from "@/lib/store";

const OUTCOME: Record<string, string> = {
  "came-true": "Came true",
  partially: "Partially true",
  "not-yet": "Not yet",
  wrong: "Wrong",
  "too-early": "Too early to tell",
};

/** Full Claim vs. Reality for one signpost: every claim, what happened, and sources. */
export function ClaimDrawer({ dataset }: { dataset: Dataset }) {
  const entryId = useStore(openClaims);
  const close = useRef<HTMLButtonElement>(null);
  const entry = entryId ? dataset.byId.get(entryId) : undefined;
  const claims = entryId ? dataset.claims.filter((c) => c.entryId === entryId) : [];

  useEffect(() => {
    if (!entryId) return;
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && openClaims.set(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entryId]);

  if (!entry || !claims.length) return null;

  return (
    <>
      <button type="button" aria-label="Close" tabIndex={-1} onClick={() => openClaims.set(null)} className="fixed inset-0 z-[49] cursor-default bg-transparent" />
      <aside
        role="dialog"
        aria-modal="false"
        aria-labelledby="claims-title"
        data-lenis-prevent
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[460px] animate-[slideIn_420ms_var(--ease-out)] overflow-y-auto overscroll-contain border-l border-white/10 bg-ink/95 px-6 pb-16 pt-6 backdrop-blur-xl md:px-8"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-faint">Claim vs. Reality</p>
          <button ref={close} type="button" onClick={() => openClaims.set(null)} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-paper-muted hover:text-paper">
            <X weight="light" size={16} />
          </button>
        </div>
        <h2 id="claims-title" className="mt-2 font-serif text-3xl leading-tight text-paper">{entry.title}</h2>
        <button
          type="button"
          onClick={() => {
            openClaims.set(null);
            openEntry.set(entry.id);
          }}
          className="mt-1 text-[13px] text-paper-muted underline decoration-hairline-strong underline-offset-4 hover:text-paper"
        >
          Open the full entry
        </button>

        <div className="mt-6 space-y-5">
          {claims.map((c) => (
            <article key={c.id} className="rounded-2xl border border-hairline p-4">
              <p className="font-serif text-lg leading-snug text-paper">{renderableAsQuote(c) ? `“${c.quote}”` : c.quote}</p>
              <p className="mt-2 text-[12px] text-paper-muted">
                {c.speaker}
                {c.speakerRole && `, ${c.speakerRole}`} · {formatYear(c.saidAt)} ·{" "}
                <a className="underline decoration-hairline-strong underline-offset-4" href={c.claimSource} target="_blank" rel="noreferrer">
                  source
                </a>
                {!c.quoteVerified && c.attribution === "named" && <span className="text-paper-faint"> · wording not yet verified</span>}
                {c.attribution === "community-sentiment" && <span className="text-paper-faint"> · community sentiment, not a quote</span>}
              </p>
              <div className="mt-4 border-t border-hairline pt-3">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Reality · {OUTCOME[c.outcome]}</p>
                <p className="text-[14px] leading-relaxed text-paper/90">{c.reality}</p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {c.realitySources.map((u, i) => (
                    <li key={u}>
                      <a href={u} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] text-paper-faint underline underline-offset-4 hover:text-paper">
                        <ArrowSquareOut weight="light" size={12} /> Source {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </>
  );
}
