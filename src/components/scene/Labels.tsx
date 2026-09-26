"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { renderableAsQuote, type Dataset } from "@/lib/dataset";
import { entriesForSegments } from "@/lib/graph";
import type { RoadGeometry } from "@/lib/road/layout";
import { hoveredEntry, hudPosition, openEntry, selectedSegments, useStore } from "@/lib/store";

const AHEAD = 85;
const BEHIND = 6;
const MAX = 22;

/** Year label for a partial date. Negative years render as BCE. */
export function formatYear(date: string) {
  if (date.startsWith("-")) return `${date.slice(1).split("-")[0]} BCE`;
  const [y, m] = date.split("-");
  if (!m) return y;
  return new Date(Date.UTC(Number(y), Number(m) - 1, 1)).toLocaleString("en", { month: "short", year: "numeric", timeZone: "UTC" });
}

/**
 * Anchors registered DOM elements to 3D points. Lives inside the Canvas and
 * writes transforms directly each frame, so labels never re-render React.
 */
export const anchors = new Map<string, { el: HTMLElement; pos: THREE.Vector3 }>();

export function LabelProjector() {
  const v = useRef(new THREE.Vector3());
  useFrame(({ camera, size }) => {
    for (const { el, pos } of anchors.values()) {
      v.current.copy(pos).project(camera);
      const behind = v.current.z > 1;
      const x = (v.current.x * 0.5 + 0.5) * size.width;
      const y = (-v.current.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
      el.style.visibility = behind ? "hidden" : "visible";
      // Fade with depth so the road ahead reads as distance, not clutter.
      const depth = Math.min(1, Math.max(0, (v.current.z - 0.96) / 0.04));
      el.style.setProperty("--depth", String(1 - depth * 0.85));
      el.style.zIndex = String(Math.round((1 - v.current.z) * 10000));
    }
  });
  return null;
}

function Anchor({ id, position, children }: { id: string; position: [number, number, number]; children: React.ReactNode }) {
  return (
    <div
      ref={(el) => {
        if (el) anchors.set(id, { el, pos: new THREE.Vector3(...position) });
        return () => {
          anchors.delete(id);
        };
      }}
      className="absolute left-0 top-0 will-change-transform"
      style={{ visibility: "hidden", opacity: "var(--depth, 1)" }}
    >
      {children}
    </div>
  );
}

/**
 * Entry labels and Claim vs. Reality signposts for the stretch of road ahead,
 * as real HTML (crisp, selectable, focusable) positioned by LabelProjector.
 */
export function Labels({ road, dataset }: { road: RoadGeometry; dataset: Dataset }) {
  const s = useStore(hudPosition);
  const selected = useStore(selectedSegments);
  const match = useMemo(() => entriesForSegments(dataset, selected), [dataset, selected]);
  const claimsByEntry = useMemo(() => {
    const m = new Map<string, Dataset["claims"]>();
    for (const c of dataset.claims) m.set(c.entryId, [...(m.get(c.entryId) ?? []), c]);
    return m;
  }, [dataset]);

  const visible = road.nodes.filter((n) => n.s > s - BEHIND && n.s < s + AHEAD).slice(0, MAX);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {visible.map((n) => {
        const e = dataset.byId.get(n.id)!;
        const dim = !match.has(n.id);
        const claim = claimsByEntry.get(n.id)?.[0];
        const side = n.x < 0 ? -1 : 1;
        return (
          <div key={n.id}>
            <Anchor id={`label:${n.id}`} position={[n.x, 2.6, -n.s]}>
              <button
                type="button"
                tabIndex={-1}
                className={`pointer-events-auto whitespace-nowrap rounded-full border border-hairline bg-ink/70 px-3 py-1 text-left transition-opacity duration-500 ease-out-soft ${dim ? "opacity-20" : "opacity-100"}`}
                onPointerEnter={(ev) => hoveredEntry.set({ id: n.id, x: ev.clientX, y: ev.clientY })}
                onPointerLeave={() => hoveredEntry.set(null)}
                onClick={() => openEntry.set(n.id)}
              >
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint tabular">{formatYear(e.date)}</span>
                <span className="block text-[13px] text-paper">{e.title}</span>
              </button>
            </Anchor>
            {claim && (
              <Anchor id={`sign:${n.id}`} position={[n.x + side * 10, 5, -n.s]}>
                {/* Phones get claims in the detail panel; floating signposts would crowd the lane. */}
                <Signpost claim={claim} dim={dim} onOpen={() => openEntry.set(n.id)} />
              </Anchor>
            )}
          </div>
        );
      })}
    </div>
  );
}

const OUTCOME: Record<string, { label: string; tone: string }> = {
  "came-true": { label: "Came true", tone: "text-accent" },
  partially: { label: "Partially", tone: "text-paper" },
  "not-yet": { label: "Not yet", tone: "text-paper-muted" },
  wrong: { label: "Wrong", tone: "text-wrong" },
  "too-early": { label: "Too early to tell", tone: "text-paper-muted" },
};

function Signpost({ claim, dim, onOpen }: { claim: Dataset["claims"][number]; dim: boolean; onOpen: () => void }) {
  const asQuote = renderableAsQuote(claim);
  const o = OUTCOME[claim.outcome];
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onOpen}
      className={`pointer-events-auto hidden w-[260px] rounded-[14px] md:block border border-hairline-strong bg-ink/85 p-3 text-left shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)] transition-opacity duration-500 ${dim ? "opacity-15" : "opacity-100"}`}
    >
      <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-paper-faint">Claim vs. Reality</span>
      <span className="line-clamp-4 block font-serif text-[17px] leading-snug text-paper">
        {asQuote ? `“${claim.quote}”` : claim.attribution === "community-sentiment" ? `Sentiment: ${claim.quote}` : claim.quote}
      </span>
      <span className="mt-1 block text-[11px] text-paper-muted">
        {claim.speaker}
        {!asQuote && claim.attribution === "named" && " · wording unverified"}
      </span>
      <span className={`mt-2 inline-block rounded-full border border-current px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${o.tone}`}>{o.label}</span>
    </button>
  );
}
