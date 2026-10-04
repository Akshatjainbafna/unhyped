"use client";

import { X } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef } from "react";
import { CompareView, type PickerTool } from "./CompareView";
import compare from "../../../data/compare.json";
import type { Dataset } from "@/lib/dataset";
import { CompareDataSchema } from "@/lib/compare";
import { SEGMENTS, STACK_LAYERS } from "@/lib/taxonomy";
import { UPDATED_AT, UPDATED_ISO } from "@/lib/updated";
import { compareOpen, compareSeed, useStore } from "@/lib/store";

/** Compare tools side by side, as a sheet like the quiz and the Map of AI. */
export function CompareModal({ dataset, logos }: { dataset: Dataset; logos: Record<string, string> }) {
  const open = useStore(compareOpen);
  const seed = useStore(compareSeed);
  const dialog = useRef<HTMLDivElement>(null);
  const data = useMemo(() => CompareDataSchema.parse(compare), []);
  const tools: PickerTool[] = useMemo(
    () =>
      data.tools.flatMap((t) => {
        const e = dataset.byId.get(t.entryId);
        return e ? [{ ...t, title: e.title, date: e.date, logo: logos[t.entryId] ?? null, layer: e.stackLayer, segment: SEGMENTS[e.primarySegment] }] : [];
      }),
    [data, dataset, logos],
  );

  useEffect(() => {
    if (!open) return;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && compareOpen.set(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  const close = () => {
    compareOpen.set(false);
    compareSeed.set([]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button type="button" aria-label="Close compare" className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={close} />
      <div
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-title"
        className="relative w-full max-w-[1040px] animate-[fadeUp_380ms_var(--ease-out)] rounded-[2rem] border border-white/15 bg-white/[0.06] p-1.5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] outline-none backdrop-blur-2xl backdrop-saturate-150"
      >
        <div data-lenis-prevent className="glass-ink overscroll-contain relative max-h-[88dvh] overflow-auto rounded-[calc(2rem-0.375rem)] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] px-4 pb-5 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.04)] sm:px-8 sm:pb-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-muted">Compare · Updated <time dateTime={UPDATED_ISO}>{UPDATED_AT}</time></p>
              <h2 id="compare-title" className="mt-1 font-serif text-2xl text-paper md:text-3xl">Find the one that fits</h2>
              <p className="mt-1 max-w-xl text-[13px] text-paper-muted">Up to five tools of the same kind. No overall score; a dash means not verified.</p>
            </div>
            <button type="button" onClick={close} aria-label="Close" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-paper-muted hover:text-paper">
              <X weight="light" size={16} />
            </button>
          </div>
          <CompareView key={seed.join(",")} tools={tools} classes={data.classes} layers={STACK_LAYERS.map((l) => ({ id: l.id, name: l.name }))} initial={seed} />
        </div>
      </div>
    </div>
  );
}
