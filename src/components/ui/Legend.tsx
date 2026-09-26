"use client";

import { Info, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { SEGMENT_COLOR } from "@/lib/overworld/style";
import { SEGMENT_GROUPS, SEGMENTS, type SegmentId } from "@/lib/taxonomy";

const SHAPES: { label: string; cls: string; note?: string }[] = [
  { label: "Product", cls: "rounded-full" },
  { label: "Model", cls: "rounded-[7px]" },
  { label: "Paper", cls: "rounded-[2px]" },
  { label: "Open-source repo", cls: "rounded-[9px_2px_9px_2px]" },
  { label: "Event", cls: "rotate-45 rounded-[2px] scale-[0.8]" },
];

/** What the colours, shapes, numbers and rings mean. */
export function Legend({ view }: { view: "2d" | "3d" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="fixed bottom-4 left-3 z-40 md:bottom-6 md:left-6">
        <div className="rounded-full border border-white/10 bg-ink/60 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="legend"
            aria-label="Legend: what colours and shapes mean"
            className="inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-[13px] text-paper md:px-4"
          >
            <Info weight="light" size={16} />
            <span className="hidden md:inline">Legend</span>
          </button>
        </div>
      </div>

      {open && (
        <>
          <button type="button" aria-label="Close legend" tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-[44] cursor-default bg-transparent" />
          <section
            id="legend"
            aria-label="Legend"
            data-lenis-prevent className="overscroll-contain fixed bottom-20 left-3 right-3 z-[45] max-h-[68dvh] overflow-auto rounded-[22px] border-[3px] border-[#26283b] bg-white p-5 text-[#26283b] shadow-[0_6px_0_#26283b] md:bottom-24 md:left-6 md:right-auto md:w-[560px]"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-game text-2xl font-bold">How to read the map</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#26283b]">
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-game text-sm font-bold uppercase tracking-[0.12em] text-[#7d819c]">Each marker</h3>
                <ul className="mt-2 space-y-2 text-[14px] font-semibold">
                  <li className="flex items-center gap-3">
                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-[#26283b] bg-white" style={{ boxShadow: "inset 0 0 0 3px #2ec4b6" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logos/lobe-claude.svg" alt="" className="h-5 w-5" />
                    </span>
                    The logo is the company or product. Two letters when there is no logo.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-9 w-9 shrink-0 rounded-full border-[3px] border-[#26283b] bg-white" style={{ boxShadow: "inset 0 0 0 3px #4d8dff" }} />
                    The inner ring colour is the segment (below).
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="relative h-7 w-7 shrink-0 rounded-full border-[3px] border-[#26283b] bg-white">
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#26283b] bg-[#ffd23f] text-[9px] font-black">↑</span>
                    </span>
                    Small with ↑: a major update to an existing product.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-9 w-9 shrink-0 rounded-full border-[3px] border-[#ffc21a] outline-[3px] outline-offset-2 outline-[#ff6b5b]" />
                    After the quiz: gold ring = you knew it, coral = you missed it.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-game text-sm font-bold uppercase tracking-[0.12em] text-[#7d819c]">Shape = type</h3>
                <ul className="mt-2 grid grid-cols-2 gap-2 text-[14px] font-semibold">
                  {SHAPES.map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                      <span className={`h-6 w-6 shrink-0 border-[3px] border-[#26283b] bg-white ${s.cls}`} />
                      {s.label}
                    </li>
                  ))}
                </ul>
                <h3 className="mt-4 font-game text-sm font-bold uppercase tracking-[0.12em] text-[#7d819c]">On the road</h3>
                <ul className="mt-2 space-y-1.5 text-[14px] font-semibold">
                  {view === "2d" ? (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[3px] border-[#26283b] bg-[#ffd23f] font-game text-xs font-bold">12</span>
                        Stop number: launches and updates in that month (or year, or decade).
                      </li>
                      <li>Scenes show what AI could do in that era, with the same three requests answered each time.</li>
                    </>
                  ) : (
                    <>
                      <li>Signposts: a claim someone made, and what actually happened.</li>
                      <li>A road peeling off to a red barrier: an abandoned approach (a dead end).</li>
                      <li>Frosted road: an AI winter, when funding and progress stalled.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <h3 className="mt-5 font-game text-sm font-bold uppercase tracking-[0.12em] text-[#7d819c]">Colour = segment</h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {Object.entries(SEGMENT_GROUPS).map(([group, ids]) => (
                <div key={group}>
                  <p className="font-game text-[15px] font-bold">{group}</p>
                  <ul className="mt-1 space-y-1">
                    {(ids as readonly SegmentId[]).map((id) => (
                      <li key={id} className="flex items-center gap-2 text-[13px] font-semibold">
                        <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[#26283b]" style={{ background: SEGMENT_COLOR[id] }} />
                        {SEGMENTS[id]}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12.5px] font-semibold text-[#7d819c]">
              Logos are the property of their owners and are shown only to identify each product.
            </p>
          </section>
        </>
      )}
    </>
  );
}
