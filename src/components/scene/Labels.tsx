"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { renderableAsQuote, type Dataset } from "@/lib/dataset";
import { SEGMENT_COLOR } from "@/lib/overworld/style";
import type { RoadGeometry } from "@/lib/road/layout";
import { hoveredEntry, hudPosition, openClaims, openEntry, useStore } from "@/lib/store";
import { useFilterMatch } from "@/lib/useFilters";

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
    const placed: { el: HTMLElement; x: number; y: number; z: number }[] = [];
    for (const { el, pos } of anchors.values()) {
      v.current.copy(pos).project(camera);
      const x = (v.current.x * 0.5 + 0.5) * size.width;
      const y = (-v.current.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
      const depth = Math.min(1, Math.max(0, (v.current.z - 0.96) / 0.04));
      el.style.setProperty("--depth", String(1 - depth * 0.35));
      el.style.zIndex = String(Math.round((1 - v.current.z) * 10000));
      placed.push({ el, x, y, z: v.current.z });
    }
    // Declutter: nearer labels claim their space; farther ones that would
    // overlap stay hidden until the traveller gets closer.
    placed.sort((a, b) => a.z - b.z);
    const kept: { l: number; r: number; t: number; b: number }[] = [];
    for (const p of placed) {
      if (p.z > 1) {
        p.el.style.visibility = "hidden";
        continue;
      }
      const w = p.el.offsetWidth;
      const h = p.el.offsetHeight;
      const box = { l: p.x - w / 2, r: p.x + w / 2, t: p.y - h, b: p.y };
      const clash = kept.some((k) => box.l < k.r - 6 && box.r > k.l + 6 && box.t < k.b - 4 && box.b > k.t + 4);
      p.el.style.visibility = clash ? "hidden" : "visible";
      if (!clash) kept.push(box);
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
export function Labels({ road, dataset, logos }: { road: RoadGeometry; dataset: Dataset; logos: Record<string, string> }) {
  const s = useStore(hudPosition);
  const match = useFilterMatch(dataset);
  const claimsByEntry = useMemo(() => {
    const m = new Map<string, Dataset["claims"]>();
    for (const c of dataset.claims) m.set(c.entryId, [...(m.get(c.entryId) ?? []), c]);
    // Lead with a verified quote when there is one, then the most recent.
    for (const list of m.values()) list.sort((a, b) => Number(renderableAsQuote(b)) - Number(renderableAsQuote(a)) || b.saidAt.localeCompare(a.saidAt));
    return m;
  }, [dataset]);

  // Nothing on the road while the intro holds at Today (or up in the futures).
  const visible = s <= 0.02 ? [] : road.nodes.filter((n) => n.s > s - BEHIND && n.s < s + AHEAD).slice(0, MAX);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {visible.map((n) => {
        const e = dataset.byId.get(n.id)!;
        const dim = !match.has(n.id);
        const claims = claimsByEntry.get(n.id) ?? [];
        const claim = claims[0];
        const side = n.x < 0 ? -1 : 1;
        return (
          <div key={n.id}>
            <Anchor id={`label:${n.id}`} position={[n.x, 0.06, -n.s]}>
              <span className="flex flex-col items-center">
                <button
                  type="button"
                  tabIndex={-1}
                  className={`pointer-events-auto whitespace-nowrap rounded-full border border-hairline bg-ink/90 px-3 py-1 text-left transition-opacity duration-500 ease-out-soft ${dim ? "opacity-20" : "opacity-100"}`}
                  onPointerEnter={(ev) => hoveredEntry.set({ id: n.id, x: ev.clientX, y: ev.clientY })}
                  onPointerLeave={() => hoveredEntry.set(null)}
                  onClick={() => openEntry.set(n.id)}
                >
                  <span className="flex items-center gap-2">
                    {logos[n.id] && (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white" style={{ boxShadow: `inset 0 0 0 2px ${SEGMENT_COLOR[e.primarySegment]}` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logos[n.id]} alt="" width={16} height={16} loading="lazy" className="h-4 w-4 object-contain" />
                      </span>
                    )}
                    <span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint tabular">
                        {formatYear(e.date)}
                        {e.roadFeature === "dead-end" && (
                          <span className="rounded-full bg-[#e0503a] px-1.5 py-px font-sans text-[9px] font-semibold normal-case tracking-normal text-white">Discontinued</span>
                        )}
                      </span>
                      <span className={`block text-[13px] text-paper ${e.roadFeature === "dead-end" ? "line-through decoration-[#e0503a]/70" : ""}`}>{e.title}</span>
                    </span>
                  </span>
                </button>
                {/* stem down to the marker on the road */}
                <span className={`h-5 w-px bg-paper/50 ${dim ? "opacity-20" : ""}`} />
              </span>
            </Anchor>
            {claim && (
              <Anchor id={`sign:${n.id}`} position={[n.x + side * 10, 5, -n.s]}>
                {/* Phones get claims in the detail panel; floating signposts would crowd the lane. */}
                <Signpost claim={claim} more={claims.length - 1} dim={dim} onOpen={() => openClaims.set(n.id)} />
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

function Signpost({ claim, more, dim, onOpen }: { claim: Dataset["claims"][number]; more: number; dim: boolean; onOpen: () => void }) {
  const asQuote = renderableAsQuote(claim);
  const o = OUTCOME[claim.outcome];
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onOpen}
      aria-label={`Claim by ${claim.speaker}: read the claim and what happened`}
      className={`pointer-events-auto hidden w-[210px] rounded-xl border border-hairline-strong bg-ink/90 px-3 py-2 text-left shadow-[0_12px_30px_-18px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-300 hover:-translate-y-0.5 md:block ${dim ? "opacity-15" : "opacity-100"}`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper-faint">Claim vs. Reality</span>
        <span className={`rounded-full border border-current px-1.5 font-mono text-[8.5px] uppercase tracking-[0.14em] ${o.tone}`}>{o.label}</span>
      </span>
      <span className="mt-1 line-clamp-2 font-serif text-[13.5px] leading-snug text-paper">
        {asQuote ? `“${claim.quote}”` : claim.attribution === "community-sentiment" ? `Sentiment: ${claim.quote}` : claim.quote}
      </span>
      <span className="mt-1 flex items-center justify-between gap-2 text-[10.5px] text-paper-muted">
        <span className="truncate">{claim.speaker}</span>
        <span className="shrink-0 text-paper-faint">{more > 0 ? `+${more} more · ` : ""}Read →</span>
      </span>
    </button>
  );
}
