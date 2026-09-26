"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatYear } from "../scene/Labels";
import { typeLabel } from "./HoverCard";
import type { Dataset } from "@/lib/dataset";
import type { RoadGeometry } from "@/lib/road/layout";
import type { Entry } from "@/lib/schema";
import { openEntry, searchOpen, travel, useStore } from "@/lib/store";
import { SEGMENTS } from "@/lib/taxonomy";

const norm = (t: string) => t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, " ");

/** Title matches first, then creators and segments; ties go to the newer entry. */
export function rank(entries: Entry[], query: string, limit = 8): Entry[] {
  const q = norm(query).trim();
  if (!q) return [];
  const scored: { e: Entry; score: number }[] = [];
  for (const e of entries) {
    const title = norm(e.title);
    let score = 0;
    if (title === q) score = 100;
    else if (title.startsWith(q)) score = 80;
    else if (title.split(/\s+/).some((w) => w.startsWith(q))) score = 60;
    else if (title.includes(q)) score = 45;
    else if (e.creators.some((c) => norm(c).includes(q))) score = 30;
    else if (norm(SEGMENTS[e.primarySegment]).includes(q)) score = 15;
    else if (e.majorUpdates.some((u) => norm(u.title).includes(q))) score = 12;
    if (score) scored.push({ e, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || b.e.date.localeCompare(a.e.date))
    .slice(0, limit)
    .map((x) => x.e);
}

/** Search any tool, paper or person and travel to it on the road (⌘K or /). */
export function SearchPalette({ dataset, road }: { dataset: Dataset; road: RoadGeometry }) {
  const open = useStore(searchOpen);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => rank(dataset.entries, query), [dataset, query]);
  const sById = useMemo(() => new Map(road.nodes.map((n) => [n.id, n.s])), [road]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /INPUT|TEXTAREA/.test(e.target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        searchOpen.set(true);
      } else if (e.key === "Escape") searchOpen.set(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  if (!open) return null;

  const go = (e: Entry) => {
    // Major updates live on their parent's line, so travel to the parent.
    const s = sById.get(e.id) ?? (e.parentId ? sById.get(e.parentId) : undefined);
    if (s !== undefined) travel.to(Math.max(-road.futureLength, s - 18));
    searchOpen.set(false);
    setTimeout(() => openEntry.set(e.id), 0);
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center px-4 pt-[14vh]">
      <button type="button" aria-label="Close search" tabIndex={-1} className="absolute inset-0 cursor-default bg-ink/40" onClick={() => searchOpen.set(false)} />
      <div role="dialog" aria-modal="true" aria-label="Search the road" className="relative w-full max-w-xl animate-[fadeUp_260ms_var(--ease-out)] overflow-hidden rounded-[1.5rem] border border-white/12 bg-ink/90 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
        <label className="flex items-center gap-3 border-b border-hairline px-5">
          <MagnifyingGlass weight="light" size={18} className="shrink-0 text-paper-muted" />
          <span className="sr-only">Search tools, models, papers and people</span>
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(results.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter" && results[active]) {
                // Consume the key so it can't also activate the panel's focused close button.
                e.preventDefault();
                go(results[active]);
              }
            }}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${results[active].id}` : undefined}
            placeholder="Search Claude Code, Prolog, Hermes, Hinton…"
            className="h-14 w-full bg-transparent text-[15px] text-paper outline-none placeholder:text-paper-faint"
          />
          <kbd className="hidden rounded-md border border-hairline px-1.5 py-0.5 font-mono text-[10px] text-paper-faint sm:block">esc</kbd>
        </label>
        <ul id="search-results" role="listbox" className="max-h-[50vh] overflow-auto p-2">
          {query && results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-paper-muted">
              Not on the road yet.{" "}
              <a className="text-paper underline underline-offset-4" href={`https://github.com/unhyped/unhyped/issues/new?title=${encodeURIComponent(`Suggest: ${query}`)}`} target="_blank" rel="noreferrer">
                Suggest it
              </a>
            </li>
          )}
          {results.map((e, i) => (
            <li key={e.id} id={`sr-${e.id}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(e)}
                className={`flex w-full items-baseline justify-between gap-4 rounded-xl px-3 py-2.5 text-left transition-colors ${i === active ? "bg-white/[0.08]" : ""}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[14px] text-paper">{e.title}</span>
                  <span className="block truncate text-[12px] text-paper-faint">
                    {typeLabel(e.type)} · {SEGMENTS[e.primarySegment]}
                    {e.parentId && ` · update to ${dataset.byId.get(e.parentId)?.title ?? e.parentId}`}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-paper-muted tabular">{formatYear(e.date)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
