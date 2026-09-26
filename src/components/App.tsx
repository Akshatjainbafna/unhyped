"use client";

import { Cube, MapTrifold } from "@phosphor-icons/react";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { Experience } from "./Experience";
import { Overworld2D } from "./overworld/Overworld2D";
import { QuizModal } from "./quiz/QuizModal";
import { DetailPanel } from "./ui/DetailPanel";
import { FilterBar } from "./ui/FilterBar";
import { HoverCard } from "./ui/HoverCard";
import { Legend } from "./ui/Legend";
import { Navbar } from "./ui/Navbar";
import { SearchPalette } from "./ui/SearchPalette";
import { buildDataset } from "@/lib/dataset";
import type { RawDataset } from "@/lib/schema";
import { createStore, hoveredEntry } from "@/lib/store";

type View = "2d" | "3d";

// The view lives in the URL (?view=3d) so it survives reloads and can be shared.
const viewStore = createStore<View>("2d");
let viewRead = false;
const getView = () => {
  if (!viewRead && typeof window !== "undefined") {
    viewRead = true;
    viewStore.set(new URLSearchParams(location.search).get("view") === "3d" ? "3d" : "2d");
  }
  return viewStore.get();
};

/** App shell: shared chrome plus a Google Maps-style 2D ↔ 3D switch. */
export function App({ raw, logos }: { raw: RawDataset; logos: Record<string, string> }) {
  const dataset = useMemo(() => buildDataset(raw), [raw]);
  const view = useSyncExternalStore(viewStore.subscribe, getView, () => "2d" as View);
  const setView = (v: View) => viewStore.set(v);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = view === "2d" ? "game" : "";
    const url = new URL(location.href);
    if (view === "3d") url.searchParams.set("view", "3d");
    else url.searchParams.delete("view");
    history.replaceState(null, "", url);
    hoveredEntry.set(null);
  }, [view]);

  return (
    <>
      {view === "2d" ? <Overworld2D dataset={dataset} logos={logos} /> : <Experience dataset={dataset} logos={logos} />}
      <Navbar />
      <FilterBar />
      <SearchPalette dataset={dataset} />
      <HoverCard dataset={dataset} />
      <DetailPanel dataset={dataset} />
      <QuizModal dataset={dataset} />
      <Legend view={view} />
      <ViewToggle view={view} onChange={setView} />
    </>
  );
}

function ViewToggle({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const opts: { id: View; label: string; Icon: typeof Cube }[] = [
    { id: "2d", label: "2D map", Icon: MapTrifold },
    { id: "3d", label: "3D road", Icon: Cube },
  ];
  return (
    <div role="radiogroup" aria-label="View" className="fixed bottom-20 right-3 z-40 flex gap-1 rounded-2xl md:bottom-6 md:right-6 border-[3px] border-[#26283b] bg-white p-1 shadow-[0_4px_0_#26283b] md:bottom-6 md:right-6">
      {opts.map(({ id, label, Icon }) => {
        const on = view === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(id)}
            className={`flex min-h-11 items-center gap-2 rounded-xl px-3 font-game text-[15px] font-bold transition-colors ${on ? "bg-[#26283b] text-white" : "text-[#26283b] hover:bg-[#fff1c9]"}`}
          >
            <Icon size={18} weight="bold" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{id.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
