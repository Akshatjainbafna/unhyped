"use client";

import { formatYear } from "../scene/Labels";
import type { RoadGeometry } from "@/lib/road/layout";
import { ERA_WORLDS } from "@/lib/road/palette";
import { hudPosition, travel, useStore } from "@/lib/store";
import { ERAS } from "@/lib/taxonomy";

/** Vertical rail: nine eras, the current position, and the date readout. */
export function Minimap({ road }: { road: RoadGeometry }) {
  const s = useStore(hudPosition);
  const total = road.futureLength + road.length;
  const at = (x: number) => ((x + road.futureLength) / total) * 100;
  const year = road.yearAt(s);
  const bands = [...road.eraBands]
    .map((b) => ({ ...b, sStart: Math.max(b.sStart, -road.futureLength) }))
    .filter((b) => b.sEnd > b.sStart);

  const yearLabel =
    s < 0 ? "The futures" : year < 0 ? `${Math.round(-year)} BCE` : formatYear(`${Math.floor(year)}-${String(Math.floor((year % 1) * 12) + 1).padStart(2, "0")}`);

  return (
    <aside aria-label="Timeline position" className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 items-stretch gap-3 md:flex">
      <div className="flex flex-col items-end py-1 text-right">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">Now at</p>
        <p className="font-mono text-sm text-paper tabular" aria-live="off">{yearLabel}</p>
      </div>
      <ol className="relative h-[52vh] w-2 overflow-visible rounded-full bg-white/5">
        {bands.map((b) => (
          <li key={b.era} className="absolute inset-x-0" style={{ top: `${at(b.sStart)}%`, height: `${at(b.sEnd) - at(b.sStart)}%` }}>
            <button
              type="button"
              onClick={() => travel.to(b.era === 8 ? -road.futureLength * 0.6 : b.sStart + 1)}
              className="group absolute inset-0 rounded-full"
              style={{ background: ERA_WORLDS[b.era].glow, opacity: 0.35 }}
              aria-label={`Travel to era ${b.era}: ${ERAS[b.era].name}`}
            >
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                {ERAS[b.era].short}
              </span>
            </button>
          </li>
        ))}
        <li
          aria-hidden="true"
          className="pointer-events-none absolute -left-1 h-[3px] w-4 rounded-full bg-paper transition-[top] duration-150"
          style={{ top: `${at(s)}%` }}
        />
      </ol>
    </aside>
  );
}
