"use client";

import { formatYear } from "../scene/Labels";
import type { Dataset } from "@/lib/dataset";
import { SEGMENT_COLOR } from "@/lib/overworld/style";
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

/** A glance, not a page: name, type and date, segment, one line. Details open on click. */
export function HoverCard({ dataset, logos }: { dataset: Dataset; logos: Record<string, string> }) {
  const hover = useStore(hoveredEntry);
  const entry = hover ? dataset.byId.get(hover.id) : undefined;
  if (!hover || !entry) return null;

  const W = 280;
  const left = Math.min(hover.x + 16, (typeof window !== "undefined" ? window.innerWidth : 1200) - W - 16);
  const top = Math.max(80, Math.min(hover.y - 20, (typeof window !== "undefined" ? window.innerHeight : 800) - 180));
  const logo = logos[entry.id] ?? (entry.parentId ? logos[entry.parentId] : undefined);

  return (
    <div role="tooltip" className="pointer-events-none fixed z-50 hidden animate-[fadeUp_180ms_var(--ease-out)] md:block" style={{ left, top, width: W }}>
      <div className="rounded-2xl border border-white/10 bg-ink/95 p-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          {logo && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white" style={{ boxShadow: `inset 0 0 0 2px ${SEGMENT_COLOR[entry.primarySegment]}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="" className="h-[18px] w-[18px] object-contain" />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="truncate font-serif text-lg leading-tight text-paper">{entry.title}</h3>
            <p className="text-[11px] text-paper-faint">
              {typeLabel(entry.type)} · <span className="tabular">{formatYear(entry.date)}</span>
            </p>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-snug text-paper-muted">{entry.description}</p>
        <p className="mt-2 flex items-center justify-between gap-2 text-[11px]">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-paper-muted">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SEGMENT_COLOR[entry.primarySegment] }} />
            <span className="truncate">{SEGMENTS[entry.primarySegment]}</span>
          </span>
          <span className="shrink-0 text-paper-faint">Click for details</span>
        </p>
      </div>
    </div>
  );
}
