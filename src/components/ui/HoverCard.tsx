"use client";

import { useMemo } from "react";
import { formatYear } from "../scene/Labels";
import type { Dataset } from "@/lib/dataset";
import { neighborhood, similar } from "@/lib/graph";
import { SEGMENT_COLORS } from "@/lib/road/palette";
import type { Entry } from "@/lib/schema";
import { hoveredEntry, useStore } from "@/lib/store";
import { SEGMENTS, STACK_LAYERS } from "@/lib/taxonomy";

const TYPE_LABEL: Record<Entry["type"], string> = {
  paper: "Paper",
  model: "Model",
  product: "Product",
  "oss-repo": "Open-source repo",
  "major-update": "Major update",
  person: "Person",
  org: "Organization",
  event: "Event",
};
export const typeLabel = (t: Entry["type"]) => TYPE_LABEL[t];

/** The nine-layer stack with this entry's layer lit; Ops/Eval/Safety is a side rail. */
export function StackDiagram({ layer }: { layer: Entry["stackLayer"] }) {
  const layers = STACK_LAYERS.filter((l) => l.id !== "ops").reverse();
  const ops = layer === "ops";
  return (
    <div className="flex gap-1.5" role="img" aria-label={`Stack layer: ${STACK_LAYERS.find((l) => l.id === layer)?.name}`}>
      <ol className="flex flex-1 flex-col gap-[3px]">
        {layers.map((l) => {
          const on = l.id === layer;
          return (
            <li
              key={l.id}
              className={`rounded-[5px] px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.12em] transition-colors ${on ? "bg-paper text-ink" : "bg-white/[0.04] text-paper-faint"}`}
            >
              {l.name}
            </li>
          );
        })}
      </ol>
      <div
        className={`flex w-5 items-center justify-center rounded-[5px] font-mono text-[9px] uppercase tracking-[0.12em] [writing-mode:vertical-rl] ${ops ? "bg-paper text-ink" : "bg-white/[0.04] text-paper-faint"}`}
      >
        Ops · Eval · Safety
      </div>
    </div>
  );
}

export function HoverCard({ dataset }: { dataset: Dataset }) {
  const hover = useStore(hoveredEntry);
  const entry = hover ? dataset.byId.get(hover.id) : undefined;
  const related = useMemo(() => (entry ? neighborhood(dataset, entry.id).slice(0, 5) : []), [dataset, entry]);
  const alts = useMemo(() => (entry ? similar(dataset, entry.id, 4) : []), [dataset, entry]);
  if (!hover || !entry) return null;

  const W = 340;
  const left = Math.min(hover.x + 18, (typeof window !== "undefined" ? window.innerWidth : 1200) - W - 16);
  const top = Math.max(80, Math.min(hover.y - 40, (typeof window !== "undefined" ? window.innerHeight : 800) - 460));

  return (
    <div
      role="tooltip"
      className="pointer-events-none fixed z-50 hidden animate-[fadeUp_220ms_var(--ease-out)] md:block"
      style={{ left, top, width: W }}
    >
      <div className="rounded-[1.4rem] border border-white/10 bg-ink/92 p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-faint">
          {typeLabel(entry.type)} · <span className="tabular">{formatYear(entry.date)}</span>
        </p>
        <h3 className="mt-1 font-serif text-2xl leading-tight text-paper">{entry.title}</h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-paper-muted">{entry.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {[entry.primarySegment, ...entry.secondarySegments].map((s, i) => (
            <span
              key={s}
              className={`inline-flex items-center gap-1.5 rounded-full border border-hairline px-2 py-0.5 text-[11px] ${i === 0 ? "text-paper" : "text-paper-muted"}`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: SEGMENT_COLORS[s] }} />
              {SEGMENTS[s]}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-[1fr_1fr] gap-3">
          <StackDiagram layer={entry.stackLayer} />
          <div className="min-w-0 space-y-3">
            {related.length > 0 && (
              <div>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-paper-faint">Connected</p>
                <ul className="mt-1 space-y-0.5">
                  {related.map((n) => (
                    <li key={n.entry.id} className="truncate text-[12px] text-paper-muted">
                      <span className="text-paper-faint">{n.direction === "out" ? n.edge : `← ${n.edge}`}</span> {n.entry.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {alts.length > 0 && (
              <div>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-paper-faint">Similar</p>
                <ul className="mt-1 space-y-0.5">
                  {alts.map((a) => (
                    <li key={a.id} className="truncate text-[12px] text-paper-muted">{a.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-[11px] text-paper-faint">Click for sources and the full story</p>
      </div>
    </div>
  );
}
