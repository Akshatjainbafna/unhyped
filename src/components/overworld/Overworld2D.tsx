"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { C, S, Traveller } from "../concepts/kit";
import { CatDrawing } from "./Cats";
import { PANORAMAS, type Panorama } from "./Panoramas";
import { Token } from "./Token";
import type { Dataset } from "@/lib/dataset";
import { entriesForSegments } from "@/lib/graph";
import { layoutOverworld, lengthAt, lengthAtPoint, pointAt, yAtLength, type Overworld } from "@/lib/overworld/layout";
import { buildStops, type Stop } from "@/lib/overworld/stops";
import { focusYear, personalRoad, quizOpen, selectedSegments, travel, useStore } from "@/lib/store";
import { SCENARIOS } from "@/lib/taxonomy";

const DESKTOP = { width: 1200, cols: 4, sceneHeight: 480 };
const MOBILE = { width: 440, cols: 1, sceneHeight: 330, radius: 40 };
const FUTURES_H = 500;
const FUTURES_MIST = "#f4faff";
const CAMPFIRE_MIST = "#f3c58e";
const CAMPFIRE_H = 520;

function stageFor(year: number): 0 | 1 | 2 | 3 | 4 {
  if (year >= 2024.7) return 4;
  if (year >= 2017.5) return 3;
  if (year >= 1940) return 2;
  if (year >= 1800) return 1;
  return 0;
}

/** Map width from the window: reliable even in background tabs, unlike ResizeObserver. */
function useWidth() {
  return useSyncExternalStore(
    (on) => {
      window.addEventListener("resize", on);
      return () => window.removeEventListener("resize", on);
    },
    () => Math.min(document.documentElement.clientWidth, 1380),
    () => 0,
  );
}

/** The 2D level-select overworld: every month since 2022 as a stop, logos as tokens. */
export function Overworld2D({ dataset, logos }: { dataset: Dataset; logos: Record<string, string> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const traveller = useRef<HTMLDivElement>(null);
  const width = useWidth();
  const mobile = width > 0 && width < 720;
  const stops = useMemo(() => buildStops(dataset), [dataset]);
  const ow: Overworld = useMemo(
    () => layoutOverworld(stops, PANORAMAS, { ...(mobile ? MOBILE : DESKTOP), top: FUTURES_H }),
    [stops, mobile],
  );
  const scale = width ? Math.min(1.15, width / ow.width) : 1;
  const selected = useStore(selectedSegments);
  const personal = useStore(personalRoad);
  const match = useMemo(() => entriesForSegments(dataset, selected), [dataset, selected]);
  const known = useMemo(() => new Set(personal?.known ?? []), [personal]);
  const missed = useMemo(() => new Set(personal?.missed ?? []), [personal]);
  const [here, setHere] = useState<Stop | null>(stops[0] ?? null);
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(4);

  const mapTop = () => (wrap.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
  const total = ow.height + CAMPFIRE_H;

  // Arrive where the 3D view left off (or at Today), and let search find tokens.
  useEffect(() => {
    if (!width) return;
    const y = focusYear.get();
    const target = y === null ? ow.stops[0] : ow.stops.find((s) => s.stop.from <= y) ?? ow.stops[0];
    // Put the traveller exactly on the target stop (focus sits at 55% of the viewport).
    if (target) {
      const focus = yAtLength(ow, lengthAtPoint(ow, target.x, target.y));
      window.scrollTo({ top: mapTop() + focus * scale - window.innerHeight * 0.55, behavior: "instant" as ScrollBehavior });
    }
    travel.toEntry = (id: string) => {
      const parent = dataset.byId.get(id)?.parentId;
      const el =
        document.querySelector<HTMLElement>(`[data-entry="${CSS.escape(id)}"]`) ??
        (parent ? document.querySelector<HTMLElement>(`[data-entry="${CSS.escape(parent)}"]`) : null);
      if (!el) return;
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      el.animate([{ transform: "scale(1)" }, { transform: "scale(1.5)" }, { transform: "scale(1)" }], { duration: 700, delay: 500, easing: "cubic-bezier(0.34,1.56,0.64,1)" });
    };
    travel.to = () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ow, width > 0]);

  // Scroll drives the traveller along the road and the "Now at" readout.
  useEffect(() => {
    if (!width) return;
    let raf = 0;
    let lastKey = "";
    let lastStage = -1;
    const tick = () => {
      raf = 0;
      const focus = (window.scrollY + window.innerHeight * 0.55 - mapTop()) / scale;
      const p = pointAt(ow, lengthAt(ow, focus));
      const el = traveller.current;
      if (el) {
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        if (p.dx) el.dataset.facing = p.dx > 0 ? "right" : "left";
      }
      // Current row by scroll, then the stop in that row nearest the traveller.
      const rowY = [...ow.stops].reverse().find((s) => s.y - 60 <= focus)?.y ?? ow.stops[0]?.y;
      const current = ow.stops
        .filter((s) => s.y === rowY)
        .reduce<(typeof ow.stops)[number] | undefined>((best, s) => (!best || Math.abs(s.x - p.x) < Math.abs(best.x - p.x) ? s : best), undefined);
      if (current && current.stop.key !== lastKey) {
        lastKey = current.stop.key;
        setHere(current.stop);
        focusYear.set(current.stop.from);
      }
      const st = stageFor(current?.stop.from ?? 2026);
      if (st !== lastStage) {
        lastStage = st;
        setStage(st);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // mapTop reads layout at call time; ow/scale capture the geometry.
  }, [ow, scale, width]);

  // Era zones: each era's atmosphere fills its stretch of road and blends
  // into the next over a long crossfade, so the world flows instead of stacking.
  const zones = useMemo(() => {
    const scenes = ow.blocks.filter((b): b is Extract<typeof b, { kind: "scene" }> => b.kind === "scene");
    return scenes.map((b, i) => ({ block: b, pano: PANORAMAS.find((p) => p.id === b.id)!, start: b.y, end: scenes[i + 1]?.y ?? ow.height }));
  }, [ow]);
  const atmosphere = useMemo(() => {
    const pct = (y: number) => `${((y / total) * 100).toFixed(3)}%`;
    const stops = [`${FUTURES_MIST} 0%`, `${FUTURES_MIST} ${pct(FUTURES_H * 0.5)}`];
    for (const z of zones) {
      const h = z.end - z.start;
      // Night is a moment, not a year: it holds briefly, then dawn returns.
      const plateauEnd = z.pano.night ? z.start + h * 0.4 : z.end - Math.min(260, h * 0.3);
      stops.push(`${z.pano.mist} ${pct(z.start + Math.min(260, h * 0.3))}`, `${z.pano.mist} ${pct(plateauEnd)}`);
    }
    stops.push(`${CAMPFIRE_MIST} ${pct(ow.height + 160)}`, `${CAMPFIRE_MIST} 100%`);
    return `linear-gradient(180deg, ${stops.join(", ")})`;
  }, [zones, total, ow.height]);

  return (
    <div className="min-h-[100dvh]" style={{ background: FUTURES_MIST }}>
      <h1 className="sr-only">Unhyped: every AI launch as a stop on a map, from today back to the first campfire</h1>

      {/* HUD: where the traveller is */}
      {here && (
        <div className="pointer-events-none fixed left-3 top-20 z-30 md:left-6 md:top-6">
          <div className="rounded-2xl border-[3px] border-[#26283b] bg-white px-4 py-2 shadow-[0_4px_0_#26283b]">
            <p className="font-game text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7d819c]">Now at</p>
            <p className="font-game text-lg font-bold leading-tight text-[#26283b]" aria-live="polite">
              {here.long}
            </p>
            <p className="text-[13px] font-bold text-[#55597a]">
              {here.events} {here.events === 1 ? "launch or update" : "launches and updates"}
            </p>
          </div>
        </div>
      )}

      <div ref={wrap} className="relative w-full overflow-hidden">
        {width > 0 && (
          <div className="relative origin-top-left" style={{ width: ow.width, height: total, transform: `scale(${scale})`, marginBottom: total * (scale - 1), marginLeft: (width - ow.width * scale) / 2 }}>
            {/* Full-bleed era worlds behind everything */}
            <div aria-hidden="true" className="absolute top-0" style={{ left: -4000, width: ow.width + 8000, height: total }}>
              <div className="absolute inset-0" style={{ background: atmosphere }} />
              <Ambient zones={zones} total={total} />
            </div>
            {/* Futures: three roads into the clouds */}
            <Futures width={ow.width} startX={ow.segs[0]?.kind === "line" ? ow.segs[0].x0 : 120} mobile={mobile} dataset={dataset} />

            {/* Ground detail and the road */}
            <svg width={ow.width} height={total} className="absolute inset-0" aria-hidden="true">
              <path d={ow.road} fill="none" stroke={C.ink} strokeWidth={mobile ? 50 : 70} strokeLinejoin="round" strokeLinecap="round" />
              <path d={ow.road} fill="none" stroke={C.roadEdge} strokeWidth={mobile ? 44 : 64} strokeLinejoin="round" strokeLinecap="round" />
              <path d={ow.road} fill="none" stroke={C.road} strokeWidth={mobile ? 36 : 54} strokeLinejoin="round" strokeLinecap="round" />
              <path d={ow.road} fill="none" stroke="#ffffff" strokeWidth={mobile ? 3 : 4} strokeDasharray={mobile ? "12 12" : "18 16"} strokeLinejoin="round" />
            </svg>

            {/* Era panoramas where the road enters a new world */}
            {zones.map(({ block, pano }) => (
              <PanoramaView key={pano.id} pano={pano} top={block.y} width={ow.width} mobile={mobile} />
            ))}

            {/* Stops: level dot, plaque, and the month's launches as logo tokens */}
            {ow.stops.map(({ stop, x, y }) => {
              const count = stop.events;
              const shown = stop.tokens.slice(0, 20);
              return (
                <section key={stop.key} aria-label={`${stop.long}: ${count} launches and updates`} className="absolute" style={{ left: x, top: y, width: 0, height: 0 }}>
                  <div className="absolute -translate-x-1/2 -translate-y-[62px] whitespace-nowrap rounded-[10px] border-[3px] border-[#26283b] bg-white px-2.5 py-0.5 font-game text-[15px] font-bold text-[#26283b] shadow-[0_3px_0_#26283b]">
                    {stop.label}
                  </div>
                  <div
                    className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-[#26283b] font-game text-lg font-bold text-[#26283b] shadow-[0_3px_0_#26283b] ${count === 0 ? "bg-[#e9e4d6]" : "bg-[#ffd23f]"}`}
                    title={`${count} launches and updates`}
                  >
                    {count}
                  </div>
                  <div className="absolute grid -translate-x-1/2 grid-cols-[repeat(5,44px)] place-items-center gap-2" style={{ top: 44, width: 5 * 44 + 4 * 8 }}>
                    {shown.map((t) => (
                      <Token
                        key={t.key}
                        token={t}
                        logo={logos[t.key.split("#")[0]]}
                        dim={!match.has(t.entryId)}
                        ring={known.has(t.entryId) ? "known" : missed.has(t.entryId) ? "missed" : undefined}
                      />
                    ))}
                    {stop.tokens.length > shown.length && (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-dashed border-[#26283b] bg-white/70 font-game text-sm font-bold">+{stop.tokens.length - shown.length}</span>
                    )}
                  </div>
                </section>
              );
            })}

            {/* The traveller, moved by scroll */}
            <div ref={traveller} className="pointer-events-none absolute left-0 top-0 z-10 transition-transform duration-150 ease-out will-change-transform [&[data-facing=left]_svg]:-scale-x-100" style={{ transform: "translate3d(-200px,-200px,0)" }}>
              <svg width={120} height={120} viewBox="-60 -100 120 120" className="-translate-x-1/2 -translate-y-[88%]" aria-hidden="true">
                <Traveller x={0} y={0} stage={stage} s={1.3} />
              </svg>
            </div>

            <Campfire top={ow.height} width={ow.width} />
          </div>
        )}
      </div>
    </div>
  );
}

const TONE = { yes: "#2ec4b6", meh: "#ff9f43", no: "#ff6b5b" } as const;
const ASKS = ["Draw a cat", "Translate this sentence", "Book my flight"];

/** A full-width era landscape with its title and the three recurring requests. */
function PanoramaView({ pano, top, width, mobile }: { pano: Panorama; top: number; width: number; mobile: boolean }) {
  const { Art } = pano;
  // Desktop keeps landmarks inside the road's loop; the sky and ground run full-bleed.
  const inset = mobile ? 0 : 175;
  const artW = width - inset * 2;
  const artH = (artW * 380) / 1200;
  return (
    <section aria-label={`${pano.title}, ${pano.when}: ${pano.line}`} className="absolute left-0" style={{ top, width }}>
      <svg viewBox="0 0 1200 380" width={artW} height={artH} className="mx-auto block overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`hill-${pano.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pano.hill} />
            <stop offset="0.55" stopColor={pano.hill} stopOpacity="0.85" />
            <stop offset="1" stopColor={pano.hill} stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`land-${pano.id}`} cx="0.5" cy="0.2" r="0.7">
            <stop offset="0.55" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={`fade-${pano.id}`}>
            <rect x={-200} y={-40} width={1600} height={520} fill={`url(#land-${pano.id})`} />
          </mask>
        </defs>
        {/* Rolling land that melts into the era's air on every side */}
        <path d="M-200 342 C 80 300, 260 318, 420 330 S 760 312, 900 326 S 1180 306, 1400 338 L1400 470 L-200 470 Z" fill={`url(#hill-${pano.id})`} mask={`url(#fade-${pano.id})`} />
        <Art />
      </svg>
      <div className={`relative z-[1] mx-auto flex items-start gap-3 ${mobile ? "-mt-2 flex-col px-3" : "mt-2 w-[880px] justify-between"}`}>
        <div className={`rounded-2xl border-[3px] border-[#26283b] bg-white px-4 py-2 shadow-[0_4px_0_#26283b] ${mobile ? "w-full" : "max-w-[270px]"}`}>
          <p className="font-game text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7d819c]">{pano.when}</p>
          <h2 className="font-game text-xl font-bold leading-tight text-[#26283b]">{pano.title}</h2>
          <p className="text-[13px] font-semibold leading-snug text-[#55597a]">{pano.line}</p>
        </div>
        <ul className={`gap-2 ${mobile ? "grid w-full grid-cols-1" : "flex items-stretch"}`} aria-label="The same three requests in this era">
          {pano.answers.map((a, i) => (
            <li key={ASKS[i]} className={`rounded-xl border-[3px] border-[#26283b] bg-white px-3 py-1.5 shadow-[0_3px_0_#26283b] ${mobile ? "" : i === 0 ? "w-[238px]" : "w-[160px]"}`}>
              <p className="flex items-center justify-between gap-2 font-game text-[12px] font-semibold text-[#7d819c]">
                “{ASKS[i]}”
                <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#26283b]" style={{ background: TONE[a.ok] }} aria-label={a.ok === "yes" ? "can do" : a.ok === "meh" ? "partly" : "cannot"} />
              </p>
              {i === 0 ? (
                // The "Draw a cat" strip: each era's answer, drawn, all the way down the map.
                <div className="mt-1 flex items-center gap-2.5">
                  <span className="h-[58px] w-[64px] shrink-0">
                    <CatDrawing kind={pano.cat} />
                  </span>
                  <p className="text-[12.5px] font-bold leading-snug text-[#26283b]">{a.text}</p>
                </div>
              ) : (
                <p className="text-[12.5px] font-bold leading-snug text-[#26283b]">{a.text}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Weather that drifts across era boundaries: clouds by day, stars around
 * launch night, snow through the AI winters. Each patch fades in and out.
 */
function Ambient({ zones, total }: { zones: { pano: Panorama; start: number; end: number }[]; total: number }) {
  const bits: React.ReactNode[] = [];
  zones.forEach(({ pano, start, end }, zi) => {
    const kind = pano.night ? "star" : pano.id === "learning-labs" || pano.id === "expert-offices" ? "snow" : "cloud";
    const count = Math.max(4, Math.round((end - start) / (kind === "cloud" ? 260 : 70)));
    for (let i = 0; i < count; i++) {
      const r = ((i + 1) * 9301 + zi * 49297) % 233280;
      const x = (r / 233280) * 100;
      const y = start - 120 + ((i + 0.5) / count) * (end - start + 240);
      const stop = kind === "star" ? start + (end - start) * 0.5 : end;
      if (y > stop + 120) continue;
      const edge = Math.min(1, Math.min(y - (start - 120), stop + 120 - y) / 240);
      const style = { left: `${x}%`, top: y, opacity: Math.max(0, edge) * (kind === "cloud" ? 0.9 : 1) } as const;
      if (kind === "cloud")
        bits.push(
          <svg key={`${zi}-${i}`} className="absolute animate-[drift_40s_ease-in-out_infinite_alternate]" style={{ ...style, animationDelay: `${-i * 7}s` }} width={130} height={46} viewBox="0 0 90 32">
            <path d="M4 30 q0-14 14-14 q4-12 20-12 q14 0 20 12 q14 0 14 14 z" fill="#fff" stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" />
          </svg>,
        );
      else if (kind === "star")
        bits.push(<span key={`${zi}-${i}`} className="absolute h-1.5 w-1.5 animate-pulse rounded-full bg-white" style={{ ...style, animationDelay: `${(i % 7) * 0.4}s` }} />);
      else
        bits.push(<span key={`${zi}-${i}`} className="absolute h-2.5 w-2.5 animate-[fall_9s_linear_infinite] rounded-full border border-[#26283b]/40 bg-white" style={{ ...style, animationDelay: `${-(i % 9)}s` }} />);
    }
  });
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ height: total }}>
      {bits}
    </div>
  );
}

function Futures({ width, startX, mobile, dataset }: { width: number; startX: number; mobile: boolean; dataset: Dataset }) {
  const cx = startX;
  return (
    <div className="absolute inset-x-0 top-0" style={{ height: FUTURES_H }}>
      <svg width={width} height={FUTURES_H} className="absolute inset-0" aria-hidden="true">
        <defs>
          <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[-1, 0, 1].map((k) => (
          <path key={k} d={`M${cx} ${FUTURES_H - 60} C ${cx} ${FUTURES_H - 160}, ${cx + k * 180} ${FUTURES_H - 200}, ${cx + k * 240 + (k === 0 ? 0 : 0)} 40`} fill="none" stroke={C.road} strokeWidth={mobile ? 22 : 34} strokeLinecap="round" opacity={0.55} />
        ))}
        <rect width={width} height={FUTURES_H * 0.7} fill="url(#fog)" />
      </svg>
      <div className={`absolute ${mobile ? "left-4 right-4 top-24" : "left-[300px] right-8 top-28"}`}>
        <p className="font-game text-sm font-semibold uppercase tracking-[0.18em] text-[#55597a]">The futures · scroll down to travel back in time</p>
        <h2 className="mt-1 max-w-[22ch] font-game text-3xl font-bold leading-tight text-[#26283b] md:text-4xl">The road forks. Nobody knows which one we are on.</h2>
        <ul className={`mt-4 grid gap-3 ${mobile ? "" : "grid-cols-3"}`}>
          {SCENARIOS.map((s) => {
            const d = dataset.scenarios.find((x) => x.id === s.id);
            return (
              <li key={s.id} className="rounded-2xl border-[3px] border-[#26283b] bg-white p-3 shadow-[0_4px_0_#26283b]">
                <p className="font-game text-lg font-bold text-[#26283b]">{s.name}</p>
                <p className="mt-1 line-clamp-3 text-[13px] font-semibold text-[#55597a]">{d?.summary}</p>
                <p className="mt-2 text-[12px] font-bold text-[#7d819c]">{d?.forecasts.length ?? 0} sourced forecasts</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Campfire({ top, width }: { top: number; width: number }) {
  return (
    <div className="absolute inset-x-0 text-center" style={{ top: top + 60 }}>
      <svg width={width} height={220} viewBox={`0 0 ${width} 220`} aria-hidden="true">
        <ellipse cx={width / 2} cy={190} rx={180} ry={26} fill={C.dirt} {...S} />
        <path d={`M${width / 2 - 36} 186 l72 -22 M${width / 2 + 36} 186 l-72 -22`} stroke="#6b3f1f" strokeWidth={10} strokeLinecap="round" />
        <path d={`M${width / 2} 70 q40 60 18 110 q-18 12 -36 0 q-22 -50 18 -110z`} fill={C.orange} {...S} className="origin-bottom animate-pulse" />
        <path d={`M${width / 2} 118 q18 30 8 58 q-8 6 -16 0 q-10 -28 8 -58z`} fill={C.sun} />
        <g transform={`translate(${width / 2 - 150} 190)`}>
          <Traveller x={0} y={0} stage={0} s={1.3} />
        </g>
      </svg>
      <h2 className="mx-auto mt-4 max-w-[16ch] font-game text-4xl font-bold leading-tight text-[#26283b]">This is where it started.</h2>
      <p className="mx-auto mt-2 max-w-[44ch] font-semibold text-[#3d5a2f]">People have always handed thinking to tools. How much of this road did you already know?</p>
      <button
        type="button"
        onClick={() => quizOpen.set(true)}
        className="mt-5 rounded-full border-[3px] border-[#26283b] bg-[#ffd23f] px-6 py-2.5 font-game text-lg font-bold text-[#26283b] shadow-[0_4px_0_#26283b] transition-transform active:translate-y-1 active:shadow-none"
      >
        Take the Unhyped quiz
      </button>
    </div>
  );
}
