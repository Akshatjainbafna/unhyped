"use client";

import { Canvas } from "@react-three/fiber";
import Lenis from "lenis";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import type { Dataset } from "@/lib/dataset";
import type { HeroMoment } from "@/lib/road/director";
import { layoutRoad } from "@/lib/road/layout";
import { focusYear, hudPosition, roadPosition, travel } from "@/lib/store";
import { CameraRig } from "./scene/CameraRig";
import { LabelProjector, Labels } from "./scene/Labels";
import { Road } from "./scene/Road";
import { Campfire, Lanes, PathMarkers, Roadside } from "./scene/RoadFeatures";
import { Scenery } from "./scene/Scenery";
import { PANORAMAS } from "./overworld/Panoramas";
import { Minimap } from "./ui/Minimap";
import { RoadMarkers } from "./ui/RoadMarkers";

/** Page pixels per road unit: how far you scroll to travel one unit of road. */
const PX_PER_UNIT = 5;
/** Extra scroll above the futures so they never show on arrival, even on tall phones. */
const FUTURE_PAD = 900;

export function useMediaQuery(query: string) {
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

/** The 3D cinematic road. Shared chrome (nav, search, panels, quiz) lives in App. */
export function Experience({ dataset, logos }: { dataset: Dataset; logos: Record<string, string> }) {
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
  // Where each era landscape takes over the horizon (road distance, newest first).
  const boundaries = useMemo(() => PANORAMAS.map((p) => road.sAt(p.at)), [road]);
  const total = road.futureLength + road.length;

  // Scroll → road distance. The page starts scrolled to "Today"; up is the future.
  useEffect(() => {
    const toS = (y: number) => Math.max(0, y - FUTURE_PAD) / PX_PER_UNIT - road.futureLength;
    const toY = (s: number) => (s + road.futureLength) * PX_PER_UNIT + FUTURE_PAD;

    // Arrive where the 2D view left off, or at Today.
    const start = focusYear.get();
    const arrive = toY(start === null ? 0 : Math.max(0, road.sAt(start) - 18));
    window.scrollTo({ top: arrive, behavior: "instant" as ScrollBehavior });
    // Lenis must start from the arrival point, or its first frame snaps back to the top.
    const lenis = reducedMotion ? null : new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenis?.scrollTo(arrive, { immediate: true, force: true });
    travel.to = (s: number) => {
      if (lenis) lenis.scrollTo(toY(s), { duration: 2.2 });
      else window.scrollTo({ top: toY(s) });
    };
    const sById = new Map(road.nodes.map((n) => [n.id, n.s]));
    travel.toEntry = (id: string) => {
      // Major updates live on their parent's line, so travel to the parent.
      const s = sById.get(id) ?? sById.get(dataset.byId.get(id)?.parentId ?? "");
      if (s !== undefined) travel.to(Math.max(-road.futureLength, s - 18));
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
    const hud = window.setInterval(() => {
      hudPosition.set(Math.round(roadPosition.get() * 2) / 2);
      focusYear.set(Math.round(road.yearAt(roadPosition.get()) * 100) / 100);
    }, 100);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearInterval(hud);
      lenis?.destroy();
    };
  }, [road, reducedMotion, dataset]);

  return (
    <>
      <Scenery />
      <div
        className="fixed inset-0"
        aria-hidden="true"
      >
        <Canvas
          dpr={mobile ? 1 : [1, 1.75]}
          camera={{ fov: 45, near: 0.5, far: 600, position: [0, 18, 4] }}
          gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: true }}
          onCreated={({ scene }) => {
            scene.fog = new THREE.Fog("#eaf3ff", 60, 260);
          }}
        >
          <CameraRig road={road} heroes={heroes} reducedMotion={reducedMotion} weightsRef={weightsRef} boundaries={boundaries} />
          <Road road={road} />
          <PathMarkers road={road} />
          <Roadside road={road} />
          <hemisphereLight args={["#ffffff", "#6b5f52", 1.6]} />
          <directionalLight position={[40, 60, 20]} intensity={1.4} />
          <Lanes road={road} />
          <Campfire road={road} />
          <LabelProjector />
        </Canvas>
      </div>
      <Labels road={road} dataset={dataset} logos={logos} />

      {/* The scroll track: its height is the length of the journey. */}
      <main id="main" className="pointer-events-none relative z-20 [&_a]:pointer-events-auto [&_button]:pointer-events-auto" style={{ height: `calc(${Math.round(total * PX_PER_UNIT + FUTURE_PAD)}px + 100dvh)` }}>
        <h1 className="sr-only">Unhyped: the real history of AI, from today back to the first campfire</h1>
        <RoadMarkers road={road} dataset={dataset} pxPerUnit={PX_PER_UNIT} pad={FUTURE_PAD} />
      </main>

      <Minimap road={road} />
    </>
  );
}
