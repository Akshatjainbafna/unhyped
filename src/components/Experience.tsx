"use client";

import { Canvas } from "@react-three/fiber";
import Lenis from "lenis";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { buildDataset } from "@/lib/dataset";
import type { HeroMoment } from "@/lib/road/director";
import { layoutRoad } from "@/lib/road/layout";
import type { RawDataset } from "@/lib/schema";
import { hudPosition, roadPosition, travel } from "@/lib/store";
import { Backdrop } from "./scene/Backdrop";
import { CameraRig } from "./scene/CameraRig";
import { LabelProjector, Labels } from "./scene/Labels";
import { Road } from "./scene/Road";
import { Campfire, DeadEnds, FutureForks, Lanes, Nodes } from "./scene/RoadFeatures";
import { DetailPanel } from "./ui/DetailPanel";
import { FilterBar } from "./ui/FilterBar";
import { HoverCard } from "./ui/HoverCard";
import { Minimap } from "./ui/Minimap";
import { Navbar } from "./ui/Navbar";
import { QuizModal } from "./quiz/QuizModal";
import { RoadMarkers } from "./ui/RoadMarkers";
import { SearchPalette } from "./ui/SearchPalette";

/** Page pixels per road unit: how far you scroll to travel one unit of road. */
const PX_PER_UNIT = 5;
/** Extra scroll above the futures so they never show on arrival, even on tall phones. */
const FUTURE_PAD = 900;

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (on) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", on);
      return () => m.removeEventListener("change", on);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function Experience({ raw }: { raw: RawDataset }) {
  const dataset = useMemo(() => buildDataset(raw), [raw]);
  const mobile = useMediaQuery("(max-width: 767px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const road = useMemo(
    () => layoutRoad(dataset.entries, { viewport: mobile ? "mobile" : "desktop" }),
    [dataset, mobile],
  );
  const heroes: HeroMoment[] = useMemo(
    () =>
      road.nodes
        .filter((n) => dataset.byId.get(n.id)?.heroMoment)
        .map((n) => ({ id: n.id, s: n.s })),
    [road, dataset],
  );
  const weightsRef = useRef<number[]>(new Array(9).fill(0));
  const total = road.futureLength + road.length;

  // Scroll → road distance. The page starts scrolled to "Today"; up is the future.
  useEffect(() => {
    const toS = (y: number) => Math.max(0, y - FUTURE_PAD) / PX_PER_UNIT - road.futureLength;
    const toY = (s: number) => (s + road.futureLength) * PX_PER_UNIT + FUTURE_PAD;
    const lenis = reducedMotion ? null : new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    window.scrollTo({ top: toY(0), behavior: "instant" as ScrollBehavior });
    travel.to = (s: number) => {
      if (lenis) lenis.scrollTo(toY(s), { duration: 2.2 });
      else window.scrollTo({ top: toY(s) });
    };
    const onScroll = () => roadPosition.set(toS(window.scrollY));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const hud = window.setInterval(() => hudPosition.set(Math.round(roadPosition.get() * 2) / 2), 100);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearInterval(hud);
      lenis?.destroy();
    };
  }, [road, reducedMotion]);

  return (
    <>
      <div
        className="fixed inset-0"
        aria-hidden="true"
      >
        <Canvas
          dpr={mobile ? 1 : [1, 1.75]}
          camera={{ fov: 45, near: 0.5, far: 600, position: [0, 18, 4] }}
          gl={{ antialias: !mobile, powerPreference: "high-performance" }}
          onCreated={({ scene }) => {
            scene.fog = new THREE.Fog("#0c0b0a", 60, 260);
          }}
        >
          <Backdrop weightsRef={weightsRef} detail={mobile ? 0.6 : 1} />
          <CameraRig road={road} heroes={heroes} reducedMotion={reducedMotion} weightsRef={weightsRef} />
          <Road road={road} />
          <Lanes road={road} />
          <DeadEnds road={road} />
          <FutureForks road={road} />
          <Nodes road={road} dataset={dataset} />
          <Campfire road={road} />
          <LabelProjector />
        </Canvas>
      </div>
      <Labels road={road} dataset={dataset} />

      {/* The scroll track: its height is the length of the journey. */}
      <main id="main" className="pointer-events-none relative z-20 [&_a]:pointer-events-auto [&_button]:pointer-events-auto" style={{ height: `calc(${Math.round(total * PX_PER_UNIT + FUTURE_PAD)}px + 100dvh)` }}>
        <h1 className="sr-only">Unhyped: the real history of AI, from today back to the first campfire</h1>
        <RoadMarkers road={road} dataset={dataset} pxPerUnit={PX_PER_UNIT} pad={FUTURE_PAD} />
      </main>

      <Navbar />
      <Minimap road={road} />
      <FilterBar />
      <SearchPalette dataset={dataset} road={road} />
      <HoverCard dataset={dataset} />
      <DetailPanel dataset={dataset} />
      <QuizModal dataset={dataset} />
    </>
  );
}
