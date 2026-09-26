"use client";

import { useSyncExternalStore } from "react";
import type { SegmentId } from "./taxonomy";

/**
 * Tiny external stores. The per-frame road position lives outside React so the
 * WebGL scene and overlays can read it in animation frames without re-rendering;
 * HUD components subscribe at a throttled rate.
 */
export function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next: T) {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

/** Road distance under the camera (0 = Today, negative = the future). */
export const roadPosition = createStore(0);
/** Coarse copy of the position for HUD re-renders (updated ~10×/s). */
export const hudPosition = createStore(0);
export const selectedSegments = createStore<SegmentId[]>([]);
export const hoveredEntry = createStore<{ id: string; x: number; y: number } | null>(null);
export const openEntry = createStore<string | null>(null);
export const quizOpen = createStore(false);
export const filterOpen = createStore(false);
/** Personalised road: entry ids the quiz shows the user knows / missed. */
export const personalRoad = createStore<{ known: string[]; missed: string[] } | null>(null);

export function useStore<T>(store: { get: () => T; subscribe: (l: () => void) => () => void }) {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/** Scroll the page so the camera lands on road distance `s`. Set by the Experience. */
export const travel: { to: (s: number) => void } = { to: () => {} };
