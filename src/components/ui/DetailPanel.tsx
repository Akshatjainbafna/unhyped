"use client";

import { ArrowSquareOut, GithubLogo, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef } from "react";
import { formatYear } from "../scene/Labels";
import { StackDiagram, typeLabel } from "./HoverCard";
import { renderableAsQuote, type Dataset } from "@/lib/dataset";
import { lineage, neighborhood, peopleFor, similar } from "@/lib/graph";
import { openEntry, travel, useStore } from "@/lib/store";
import { SEGMENTS } from "@/lib/taxonomy";

const REPO = "https://github.com/unhyped/unhyped";

/** Side panel with the whole record: sources, updates, people, claims, and a way to correct it. */
export function DetailPanel({ dataset }: { dataset: Dataset }) {
  const id = useStore(openEntry);
  const entry = id ? dataset.byId.get(id) : undefined;
  const close = useRef<HTMLButtonElement>(null);

  const data = useMemo(() => {
    if (!entry) return null;
    return {
      related: neighborhood(dataset, entry.id),
      alts: similar(dataset, entry.id, 5),
      chain: lineage(dataset, entry.id).slice(1),
      people: peopleFor(dataset, entry.id),
      claims: dataset.claims.filter((c) => c.entryId === entry.id),
      still: dataset.stillAlive.filter((s) => s.entryId === entry.id),
      children: dataset.entries.filter((e) => e.parentId === entry.id),
    };
  }, [dataset, entry]);

  useEffect(() => {
    if (!entry) return;
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && openEntry.set(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entry]);

  if (!entry || !data) return null;

  const issue = `${REPO}/issues/new?template=suggest-edit.yml&title=${encodeURIComponent(`Edit: ${entry.title}`)}&entry=${entry.id}`;
  const jump = (target: string) => {
    openEntry.set(target);
  };

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="detail-title"
      data-lenis-prevent className="overscroll-contain fixed inset-y-0 right-0 z-50 w-full max-w-[460px] animate-[slideIn_420ms_var(--ease-out)] overflow-y-auto border-l border-white/10 bg-ink/95 px-6 pb-16 pt-6 backdrop-blur-xl md:px-8"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-faint">
          {typeLabel(entry.type)} · <span className="tabular">{formatYear(entry.date)}</span>
          {entry.endDate && <> – {formatYear(entry.endDate)}</>}
        </p>
        <button
          ref={close}
          type="button"
          onClick={() => openEntry.set(null)}
          aria-label="Close"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-paper-muted hover:text-paper"
        >
          <X weight="light" size={16} />
        </button>
      </div>

      <h2 id="detail-title" className="mt-3 font-serif text-4xl leading-[1.05] text-paper">{entry.title}</h2>
      {entry.creators.length > 0 && <p className="mt-2 text-sm text-paper-muted">{entry.creators.join(", ")}</p>}
      <p className="mt-5 text-[15px] leading-relaxed text-paper/90">{entry.description}</p>
      {entry.capabilityNote && (
        <p className="mt-4 border-l border-accent/60 pl-3 text-[14px] leading-relaxed text-paper-muted">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">What it could actually do</span>
          <br />
          {entry.capabilityNote}
        </p>
      )}

      <div className="mt-6 grid grid-cols-[1fr_1fr] gap-4">
        <StackDiagram layer={entry.stackLayer} />
        <div className="space-y-2 text-[12px]">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-paper-faint">Segments</p>
          {[entry.primarySegment, ...entry.secondarySegments].map((s) => (
            <p key={s} className="text-paper-muted">{SEGMENTS[s]}</p>
          ))}
          {entry.oss && (
            <div className="pt-2">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-paper-faint">Open source</p>
              <p className="text-paper-muted">{entry.oss.license}</p>
              {entry.oss.stars !== undefined && (
                <p className="text-paper-muted tabular">
                  {entry.oss.stars.toLocaleString()} stars
                  <span className="text-paper-faint"> · as of {entry.oss.starsCheckedAt}</span>
                </p>
              )}
              {entry.oss.archived && <p className="text-wrong">Archived</p>}
              <p className="mt-1 text-[11px] text-paper-faint">Stars show attention, not use.</p>
            </div>
          )}
        </div>
      </div>

      {(entry.majorUpdates.length > 0 || data.children.length > 0) && (
        <Section title="Major updates">
          <ol className="space-y-2">
            {[...entry.majorUpdates.map((u) => ({ ...u, id: undefined as string | undefined })), ...data.children.map((c) => ({ date: c.date, title: c.title, summary: c.description, id: c.id as string | undefined }))]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((u, i) => (
                <li key={i} className="grid grid-cols-[72px_1fr] gap-3 text-[13px]">
                  <span className="font-mono text-[11px] text-paper-faint tabular">{formatYear(u.date)}</span>
                  <span className="text-paper-muted">
                    {u.id ? (
                      <button type="button" className="text-paper underline decoration-hairline-strong underline-offset-4" onClick={() => jump(u.id!)}>{u.title}</button>
                    ) : (
                      <span className="text-paper">{u.title}</span>
                    )}
                    {u.summary && <> — {u.summary}</>}
                  </span>
                </li>
              ))}
          </ol>
        </Section>
      )}

      {data.claims.length > 0 && (
        <Section title="Claim vs. Reality">
          <div className="space-y-4">
            {data.claims.map((c) => (
              <article key={c.id} className="rounded-2xl border border-hairline p-4">
                <p className="font-serif text-lg leading-snug text-paper">
                  {renderableAsQuote(c) ? `“${c.quote}”` : c.quote}
                </p>
                <p className="mt-1 text-[12px] text-paper-muted">
                  {c.speaker}
                  {c.speakerRole && `, ${c.speakerRole}`} · {formatYear(c.saidAt)} ·{" "}
                  <a className="underline decoration-hairline-strong underline-offset-4" href={c.claimSource} target="_blank" rel="noreferrer">source</a>
                  {!c.quoteVerified && <span className="text-paper-faint"> · wording not yet verified</span>}
                  {c.attribution === "community-sentiment" && <span className="text-paper-faint"> · community sentiment, not a quote</span>}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-paper/85">
                  <span className="mr-2 rounded-full border border-accent/50 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent">
                    Reality · {c.outcome.replace("-", " ")}
                  </span>
                  {c.reality}
                </p>
                <p className="mt-2 flex flex-wrap gap-x-3 text-[11px] text-paper-faint">
                  {c.realitySources.map((u, i) => (
                    <a key={u} href={u} target="_blank" rel="noreferrer" className="underline underline-offset-4">Source {i + 1}</a>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </Section>
      )}

      {data.still.map((s) => (
        <Section key={s.id} title={s.verdict === "declined" ? "Actually declined" : s.verdict === "transformed" ? "Transformed" : "Still alive"}>
          <p className="text-[13px] leading-relaxed text-paper-muted">{s.summary}</p>
        </Section>
      ))}

      {data.people.length > 0 && (
        <Section title="People">
          <ul className="space-y-3">
            {data.people.map((p) => (
              <li key={p.id} className="text-[13px]">
                <p className="text-paper">{p.name}</p>
                <p className="text-paper-faint">{p.roles.slice(0, 2).join(" · ")}</p>
                {p.quote?.verified && <p className="mt-1 font-serif text-[15px] text-paper-muted">“{p.quote.text}”</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(data.related.length > 0 || data.alts.length > 0) && (
        <Section title="On the graph">
          <ul className="flex flex-wrap gap-2">
            {[...data.related.map((r) => r.entry), ...data.alts]
              .filter((e, i, a) => a.findIndex((x) => x.id === e.id) === i)
              .slice(0, 12)
              .map((e) => (
                <li key={e.id}>
                  <button type="button" onClick={() => jump(e.id)} className="rounded-full border border-hairline px-3 py-1 text-[12px] text-paper-muted hover:border-hairline-strong hover:text-paper">
                    {e.title}
                  </button>
                </li>
              ))}
          </ul>
        </Section>
      )}

      <Section title="Sources">
        <ul className="space-y-1.5">
          {entry.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 text-[13px] text-paper-muted hover:text-paper">
                <ArrowSquareOut weight="light" size={14} className="mt-0.5 shrink-0" />
                <span className="break-all">{s.title ?? s.url}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            const n = dataset.timeline.findIndex((e) => e.id === entry.id);
            if (n >= 0) travel.to(Math.max(0, n)); // coarse; the road scrolls it into view
          }}
          className="hidden"
        />
        <a href={issue} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-hairline px-4 text-[13px] text-paper-muted hover:text-paper">
          <GithubLogo weight="light" size={16} /> Suggest an edit
        </a>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 border-t border-hairline pt-5">
      <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">{title}</h3>
      {children}
    </section>
  );
}
