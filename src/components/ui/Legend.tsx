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
          <button type="button" aria-label="Close legend" tabIndex={-1} onClick={() => setOpen(false)} className={`fixed inset-0 z-[44] cursor-default ${view === "3d" ? "bg-ink/45 backdrop-blur-[2px]" : "bg-transparent"}`} />
          {view === "2d" ? <GamePanel onClose={() => setOpen(false)} /> : <GlassPanel onClose={() => setOpen(false)} />}
        </>
      )}
    </>
  );
}

/** 2D map legend: the game-card style of the overworld. */
function GamePanel({ onClose }: { onClose: () => void }) {
  return (
    <section
      id="legend"
      aria-label="Legend"
      data-lenis-prevent className="overscroll-contain fixed bottom-20 left-3 right-3 z-[45] max-h-[68dvh] overflow-auto rounded-[22px] border-[3px] border-[#26283b] bg-white p-5 text-[#26283b] shadow-[0_6px_0_#26283b] md:bottom-24 md:left-6 md:right-auto md:w-[560px]"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-game text-2xl font-bold">How to read the map</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#26283b]">
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

            <li className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[3px] border-[#26283b] bg-[#ffd23f] font-game text-xs font-bold">12</span>
              Stop number: launches and updates in that month (or year, or decade).
            </li>
            <li>Scenes show what AI could do in that era, with the same three requests answered each time.</li>
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
  );
}

const Row = ({ sample, children }: { sample: React.ReactNode; children: React.ReactNode }) => (
  <li className="grid grid-cols-[92px_1fr] items-center gap-3 text-[13px] leading-snug text-paper-muted">
    <span className="flex justify-center">{sample}</span>
    <span>{children}</span>
  </li>
);

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">{children}</h3>
);

/** 3D road legend: the same glass shell as the quiz, search and Map of AI. */
function GlassPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-20 left-3 right-3 z-[45] animate-[fadeUp_320ms_var(--ease-out)] rounded-[2rem] border border-white/15 bg-white/[0.06] p-1.5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-saturate-150 md:bottom-24 md:left-6 md:right-auto md:w-[560px]">
      <section
        id="legend"
        aria-label="Legend"
        data-lenis-prevent
        className="max-h-[68dvh] overflow-auto overscroll-contain rounded-[calc(2rem-0.375rem)] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.04)] md:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-2xl text-paper md:text-3xl">How to read the road</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-paper-muted hover:text-paper">
            <X weight="light" size={16} />
          </button>
        </div>
        <p className="mt-2 text-sm text-paper-muted">Scroll down to travel back in time; up for the futures.</p>

        <div className="mt-6">
          <Heading>Along the road</Heading>
          <ul className="space-y-3">
            <Row
              sample={
                <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-ink/90 py-1 pl-1 pr-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white" style={{ boxShadow: "inset 0 0 0 2px #2ec4b6" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos/lobe-claude.svg" alt="" className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[11px] text-paper">Claude</span>
                </span>
              }
            >
              A label: logo, date and name. Its ring colour is the segment. Hover for a glance, click for the full entry.
            </Row>
            <Row sample={<span className="h-2 w-9 rounded-[50%] border-2 border-[#2ec4b6] bg-[#2ec4b6]/40" />}>
              A disc on a lane marks exactly where that entry sits on the road.
            </Row>
            <Row sample={<span className="rounded-full bg-[#e0503a] px-1.5 py-px text-[10px] font-semibold text-white">Discontinued</span>}>
              The product was shut down or abandoned. Its segment carries on.
            </Row>
            <Row
              sample={
                <span className="w-[88px] rounded-lg border border-hairline-strong bg-ink/90 px-2 py-1 text-left">
                  <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-paper-faint">Claim vs. Reality</span>
                  <span className="block truncate font-serif text-[10px] text-paper">“It will…”</span>
                </span>
              }
            >
              A signpost: something a named person claimed, and what actually happened. Click to read it.
            </Row>
          </ul>
        </div>

        <div className="mt-6 border-t border-hairline pt-5">
          <Heading>The road itself</Heading>
          <ul className="space-y-3">
            <Row
              sample={
                <span className="flex h-6 items-end gap-1">
                  {["#4d8dff", "#2ec4b6", "#ff9f43"].map((c) => (
                    <span key={c} className="h-6 w-1.5 rounded-full" style={{ background: c }} />
                  ))}
                </span>
              }
            >
              Coloured lanes are segments. They merge around the Transformer and branch out after. Filter them from the bottom bar.
            </Row>
            <Row sample={<span className="h-1.5 w-10 rounded-full bg-[#dfe8ef]" />}>Frosted road: an AI winter, when funding and progress stalled.</Row>
            <Row
              sample={
                <span className="flex h-6 items-end gap-2">
                  <span className="h-6 w-0.5 -rotate-[25deg] bg-paper/70" />
                  <span className="h-6 w-0.5 bg-paper/70" />
                  <span className="h-6 w-0.5 rotate-[25deg] bg-paper/70" />
                </span>
              }
            >
              Past Today the road forks into three possible futures, each with sourced forecasts.
            </Row>
            <Row sample={<span className="h-3 w-3 rounded-full bg-[#ff9a4d] shadow-[0_0_12px_#ff8a3d]" />}>The campfire at the end is where it all started.</Row>
          </ul>
        </div>

        <div className="mt-6 border-t border-hairline pt-5">
          <Heading>Colour = segment</Heading>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(SEGMENT_GROUPS).map(([group, ids]) => (
              <div key={group}>
                <p className="text-[13px] text-paper">{group}</p>
                <ul className="mt-1.5 space-y-1">
                  {(ids as readonly SegmentId[]).map((id) => (
                    <li key={id} className="flex items-center gap-2 text-[12.5px] text-paper-muted">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SEGMENT_COLOR[id] }} />
                      {SEGMENTS[id]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-5 text-[12px] text-paper-faint">Logos are the property of their owners and are shown only to identify each product.</p>
      </section>
    </div>
  );
}
