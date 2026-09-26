"use client";

import { SlidersHorizontal, X } from "@phosphor-icons/react";
import { useEffect } from "react";
import { SEGMENT_COLOR } from "@/lib/overworld/style";
import { filterOpen, selectedSegments, useStore } from "@/lib/store";
import { SEGMENT_GROUPS, SEGMENTS, type SegmentId } from "@/lib/taxonomy";

/** Map of AI: segments grouped in four families; selecting lights that lane through all of history. */
export function FilterBar() {
  const open = useStore(filterOpen);
  const selected = useStore(selectedSegments);

  // Filter state lives in the URL so a filtered road can be shared.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("segments");
    if (fromUrl) selectedSegments.set(fromUrl.split(",").filter((s) => s in SEGMENTS) as SegmentId[]);
  }, []);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selected.length) url.searchParams.set("segments", selected.join(","));
    else url.searchParams.delete("segments");
    window.history.replaceState(null, "", url);
  }, [selected]);

  // Close like the other modals: Escape or a click anywhere outside the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && filterOpen.set(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = (id: SegmentId) =>
    selectedSegments.set(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  return (
    <>
    {open && (
      <button
        type="button"
        aria-label="Close Map of AI"
        tabIndex={-1}
        onClick={() => filterOpen.set(false)}
        className="fixed inset-0 z-[35] cursor-default bg-ink/45 backdrop-blur-[2px]"
      />
    )}
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 md:pb-6">
      <div className="pointer-events-auto w-full max-w-4xl">
        {open && (
          <div className="mb-3 animate-[fadeUp_320ms_var(--ease-out)] rounded-[2rem] border border-white/15 bg-white/[0.06] p-1.5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-saturate-150">
          <section
            aria-label="Map of AI"
            data-lenis-prevent className="glass-ink overscroll-contain max-h-[55dvh] overflow-auto rounded-[calc(2rem-0.375rem)] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.04)] p-5 md:p-7"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-2xl text-paper md:text-3xl">Map of AI</h2>
              <p className="text-sm text-paper-muted">Pick segments to follow their lane through history.</p>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1.4fr]">
              {Object.entries(SEGMENT_GROUPS).map(([group, ids]) => (
                <fieldset key={group} className={group === "The modern stack" ? "md:row-span-2" : ""}>
                  <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">{group}</legend>
                  <div className="flex flex-wrap gap-2">
                    {(ids as readonly SegmentId[]).map((id) => {
                      const on = selected.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(id)}
                          className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-[13px] transition-all duration-300 ease-spring active:scale-[0.98] ${on ? "border-paper/60 bg-paper text-ink" : "border-hairline bg-white/40 text-paper-muted hover:border-hairline-strong hover:text-paper"}`}
                        >
                          <span className="h-2 w-2 rounded-full" style={{ background: SEGMENT_COLOR[id] }} />
                          {SEGMENTS[id]}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          </section>
          </div>
        )}

        <div className="mx-auto flex w-max max-w-full items-center gap-2 rounded-full border border-white/10 bg-ink/60 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => filterOpen.set(!open)}
            className="inline-flex min-h-9 items-center gap-2 rounded-full px-4 text-[13px] text-paper"
          >
            <SlidersHorizontal weight="light" size={16} />
            {selected.length ? `${selected.length} segment${selected.length > 1 ? "s" : ""}` : "Filter by segment"}
          </button>
          {selected.length > 0 && (
            <>
              <span className="hidden max-w-[40vw] truncate text-[12px] text-paper-muted sm:inline">
                {selected.map((s) => SEGMENTS[s]).join(" · ")}
              </span>
              <button
                type="button"
                onClick={() => selectedSegments.set([])}
                aria-label="Clear segment filter"
                className="flex h-9 w-9 items-center justify-center rounded-full text-paper-muted hover:text-paper"
              >
                <X weight="light" size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
