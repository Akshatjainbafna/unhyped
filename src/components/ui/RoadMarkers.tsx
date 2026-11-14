"use client";

import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import type { Dataset } from "@/lib/dataset";
import type { RoadGeometry } from "@/lib/road/layout";
import type { Track } from "@/lib/road/track";
import { openEntry, quizOpen, travel } from "@/lib/store";
import { SCENARIOS } from "@/lib/taxonomy";
import { UPDATED_AT } from "@/lib/updated";

/**
 * Content that lives *in* the scroll track, so it travels past with the road:
 * the future fork, the arrival card at Today, era titles, and the campfire.
 * Also the keyboard / screen-reader path through every entry.
 */
export function RoadMarkers({ road, dataset, track }: { road: RoadGeometry; dataset: Dataset; track: Track }) {
  const y = track.toY;

  return (
    <div className="relative">
      {/* The future, above Today. */}
      <section className="absolute inset-x-0 px-4 md:px-[8vw]" style={{ top: 130 }} aria-labelledby="futures">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-faint">Era 8 · Projections</p>
        <h2 id="futures" className="mt-3 max-w-[18ch] font-serif text-4xl leading-[1.05] text-paper md:text-6xl">
          The road forks. Nobody knows which one we are on.
        </h2>
        <ul className="mt-8 grid max-w-3xl gap-3 md:grid-cols-[1.2fr_1fr_1fr]">
          {SCENARIOS.map((sc) => {
            const data = dataset.scenarios.find((d) => d.id === sc.id);
            return (
              <li key={sc.id} className="rounded-2xl border border-hairline bg-ink/60 p-4 backdrop-blur-sm">
                <p className="font-serif text-xl text-paper">{sc.name}</p>
                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-paper-muted">{data?.summary}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-faint">
                  {data?.forecasts.length ?? 0} sourced forecasts
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Arrival: Today. Held in place (camera still) until it has scrolled away. */}
      <section className="absolute inset-x-0 px-4 md:px-[8vw]" style={{ top: y(0) + 120 }} aria-labelledby="today">
        <div className="max-w-[720px] rounded-[1.75rem] border border-white/10 bg-ink/85 p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md md:p-9">
          <p className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-paper-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Today · {UPDATED_AT}
          </p>
          <h2 id="today" className="mt-5 max-w-[16ch] font-serif text-5xl leading-[0.98] text-paper md:text-6xl">
            The real history of AI, <em className="text-paper-muted">without the hype.</em>
          </h2>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-paper-muted">
            What each technology demonstrably did, who built it, where it sits in the stack, and which claims held up.
            Every entry is sourced. Nothing here killed anything.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint">
            <span className="inline-flex items-center gap-2"><ArrowDown weight="light" size={16} /> Scroll to travel back in time</span>
            <span className="inline-flex items-center gap-2"><ArrowUp weight="light" size={16} /> Up for the futures</span>
          </div>
        </div>
      </section>

      {/* The campfire. */}
      <section className="absolute inset-x-0 px-4 text-center" style={{ top: y(road.length) - 520 }} aria-labelledby="start">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-faint">Era 0</p>
        <h2 id="start" className="mx-auto mt-3 max-w-[14ch] font-serif text-5xl leading-none text-paper md:text-7xl">
          This is where it started.
        </h2>
        <p className="mx-auto mt-5 max-w-[46ch] text-paper-muted">
          People have always handed thinking to tools. You just travelled the whole road. How much of it did you already know?
        </p>
        <button
          type="button"
          onClick={() => quizOpen.set(true)}
          className="group mx-auto mt-8 inline-flex items-center gap-3 rounded-full bg-paper py-2 pl-6 pr-2 text-sm font-medium text-ink transition-transform duration-300 ease-spring active:scale-[0.98]"
        >
          Take the Unhyped quiz
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 transition-transform duration-300 ease-spring group-hover:-translate-y-px group-hover:translate-x-0.5">
            <ArrowUp weight="light" size={14} className="rotate-45" />
          </span>
        </button>
      </section>

      {/* Keyboard and screen-reader route through every entry, newest first. */}
      <nav aria-label="Entries on the road" data-lenis-prevent className="overscroll-contain sr-only focus-within:not-sr-only focus-within:fixed focus-within:bottom-24 focus-within:left-4 focus-within:z-40 focus-within:max-h-[40vh] focus-within:overflow-auto focus-within:rounded-xl focus-within:bg-ink focus-within:p-3">
        <ol>
          {road.nodes.map((n) => {
            const e = dataset.byId.get(n.id)!;
            return (
              <li key={n.id}>
                <button type="button" className="text-left text-sm text-paper" onFocus={() => travel.to(n.s - 20)} onClick={() => openEntry.set(n.id)}>
                  {e.date.split("-")[0]} · {e.title}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
