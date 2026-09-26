"use client";

import { CaretDown, SlidersHorizontal, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Dataset } from "@/lib/dataset";
import { filterCount, matchFilters } from "@/lib/graph";
import { SEGMENT_COLOR } from "@/lib/overworld/style";
import { filterOpen, ossOnly, selectedLayers, selectedSegments, selectedTypes, useStore } from "@/lib/store";
import { ENTRY_TYPES, SEGMENT_GROUPS, SEGMENTS, STACK_LAYERS, type EntryType, type SegmentId, type StackLayerId } from "@/lib/taxonomy";
import { clearFilters, useFilters } from "@/lib/useFilters";

// The types worth filtering by, with the token shape they have on the 2D map.
const TYPES: { id: EntryType; label: string; shape: string }[] = [
  { id: "product", label: "Product", shape: "rounded-full" },
  { id: "model", label: "Model", shape: "rounded-[3px]" },
  { id: "paper", label: "Paper", shape: "rounded-[1px]" },
  { id: "oss-repo", label: "Open-source repo", shape: "rounded-[4px_1px_4px_1px]" },
  { id: "event", label: "Event", shape: "rotate-45 rounded-[1px] scale-[0.8]" },
  { id: "major-update", label: "Update", shape: "rounded-full" },
];

// Apps at the top, hardware at the bottom, as in the drawer's stack diagram.
const LAYERS = [...STACK_LAYERS.filter((l) => l.id !== "ops").reverse(), STACK_LAYERS.find((l) => l.id === "ops")!];

const toggleIn = <T,>(list: T[], id: T) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

function readList<T extends string>(params: URLSearchParams, key: string, valid: readonly string[]): T[] {
  return (params.get(key)?.split(",") ?? []).filter((v) => valid.includes(v)) as T[];
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-[13px] transition-all duration-300 ease-spring active:scale-[0.98] ${on ? "border-paper/60 bg-paper text-ink" : "border-hairline bg-white/40 text-paper-muted hover:border-hairline-strong hover:text-paper"}`}
    >
      {children}
    </button>
  );
}

const Legend = ({ children }: { children: React.ReactNode }) => (
  <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">{children}</legend>
);

/**
 * Map of AI: filter the road by segment, type, stack layer and open source.
 * Picks within a group widen the match; groups narrow it. Non-matching entries dim.
 */
export function FilterBar({ dataset }: { dataset: Dataset }) {
  const open = useStore(filterOpen);
  const filters = useFilters();
  const { segments, types, layers, oss } = filters;
  const count = filterCount(filters);
  const matches = count ? matchFilters(dataset, filters).size : dataset.entries.length;
  const [layersOpen, setLayersOpen] = useState(false);

  // Filter state lives in the URL so a filtered road can be shared.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    selectedSegments.set(readList<SegmentId>(params, "segments", Object.keys(SEGMENTS)));
    selectedTypes.set(readList<EntryType>(params, "types", ENTRY_TYPES));
    selectedLayers.set(readList<StackLayerId>(params, "layers", STACK_LAYERS.map((l) => l.id)));
    ossOnly.set(params.get("oss") === "1");
  }, []);
  useEffect(() => {
    const url = new URL(window.location.href);
    const put = (key: string, list: string[]) => (list.length ? url.searchParams.set(key, list.join(",")) : url.searchParams.delete(key));
    // Read the stores, not this render's values: on mount the reader above has
    // just set them, and a stale empty render must not wipe a shared link.
    put("segments", selectedSegments.get());
    put("types", selectedTypes.get());
    put("layers", selectedLayers.get());
    if (ossOnly.get()) url.searchParams.set("oss", "1");
    else url.searchParams.delete("oss");
    window.history.replaceState(null, "", url);
  }, [segments, types, layers, oss]);

  // Close like the other modals: Escape or a click anywhere outside the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && filterOpen.set(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const summary = [
    ...types.map((t) => TYPES.find((x) => x.id === t)?.label ?? t),
    ...(oss ? ["Open source"] : []),
    ...layers.map((l) => STACK_LAYERS.find((x) => x.id === l)?.name ?? l),
    ...segments.map((s) => SEGMENTS[s]),
  ];

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
                data-lenis-prevent
                className="glass-ink max-h-[62dvh] overflow-auto overscroll-contain rounded-[calc(2rem-0.375rem)] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.04)] md:p-7"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="font-serif text-2xl text-paper md:text-3xl">Map of AI</h2>
                  <p className="text-sm text-paper-muted" aria-live="polite">
                    {count ? (
                      matches ? (
                        <>
                          Showing <span className="tabular text-paper">{matches}</span> of {dataset.entries.length}.{" "}
                          <button type="button" onClick={clearFilters} className="underline underline-offset-4 hover:text-paper">
                            Clear all
                          </button>
                        </>
                      ) : (
                        <>
                          Nothing matches all of these.{" "}
                          <button type="button" onClick={clearFilters} className="underline underline-offset-4 hover:text-paper">
                            Clear all
                          </button>
                        </>
                      )
                    ) : (
                      "Filter the road. Everything else fades back."
                    )}
                  </p>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-[1.4fr_1fr]">
                  <fieldset>
                    <Legend>Type</Legend>
                    <div className="flex flex-wrap gap-2">
                      {TYPES.map((t) => (
                        <Chip key={t.id} on={types.includes(t.id)} onClick={() => selectedTypes.set(toggleIn(types, t.id))}>
                          <span className={`h-2.5 w-2.5 border-[1.5px] border-current ${t.shape}`} />
                          {t.label}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <Legend>License</Legend>
                    <Chip on={oss} onClick={() => ossOnly.set(!oss)}>
                      <span className={`flex h-4 w-7 items-center rounded-full p-0.5 transition-colors ${oss ? "bg-ink/30" : "bg-paper/15"}`}>
                        <span className={`h-3 w-3 rounded-full bg-current transition-transform duration-300 ease-spring ${oss ? "translate-x-3" : ""}`} />
                      </span>
                      Open source only
                    </Chip>
                    <p className="mt-2 text-[11.5px] text-paper-faint">Open-weight models count, as well as repos.</p>
                  </fieldset>
                </div>

                <fieldset className="mt-5">
                  <button
                    type="button"
                    onClick={() => setLayersOpen((o) => !o)}
                    aria-expanded={layersOpen}
                    className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint hover:text-paper"
                  >
                    Stack layer{layers.length ? ` · ${layers.length}` : ""}
                    <CaretDown size={12} className={`transition-transform duration-300 ${layersOpen ? "rotate-180" : ""}`} />
                  </button>
                  {layersOpen && (
                    <div className="flex flex-wrap gap-2">
                      {LAYERS.map((l) => (
                        <Chip key={l.id} on={layers.includes(l.id)} onClick={() => selectedLayers.set(toggleIn(layers, l.id))}>
                          {l.name}
                        </Chip>
                      ))}
                    </div>
                  )}
                </fieldset>

                <div className="mt-5 grid gap-5 border-t border-hairline pt-5 md:grid-cols-[1fr_1.4fr]">
                  {Object.entries(SEGMENT_GROUPS).map(([group, ids]) => (
                    <fieldset key={group} className={group === "The modern stack" ? "md:row-span-2" : ""}>
                      <Legend>{group}</Legend>
                      <div className="flex flex-wrap gap-2">
                        {(ids as readonly SegmentId[]).map((id) => (
                          <Chip key={id} on={segments.includes(id)} onClick={() => selectedSegments.set(toggleIn(segments, id))}>
                            <span className="h-2 w-2 rounded-full" style={{ background: SEGMENT_COLOR[id] }} />
                            {SEGMENTS[id]}
                          </Chip>
                        ))}
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
              {count ? `${count} filter${count > 1 ? "s" : ""}` : "Filter"}
            </button>
            {count > 0 && (
              <>
                <span className="hidden max-w-[40vw] truncate text-[12px] text-paper-muted sm:inline">{summary.join(" · ")}</span>
                <button
                  type="button"
                  onClick={clearFilters}
                  aria-label="Clear all filters"
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
