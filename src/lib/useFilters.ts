"use client";

import { useMemo } from "react";
import type { Dataset } from "./dataset";
import { matchFilters, type Filters } from "./graph";
import { ossOnly, selectedLayers, selectedSegments, selectedTypes, useStore } from "./store";

/** The current Map of AI filters, read from their stores. */
export function useFilters(): Filters {
  const segments = useStore(selectedSegments);
  const types = useStore(selectedTypes);
  const layers = useStore(selectedLayers);
  const oss = useStore(ossOnly);
  return useMemo(() => ({ segments, types, layers, oss }), [segments, types, layers, oss]);
}

/** Ids of entries that pass every active filter (all of them when none are set). */
export function useFilterMatch(dataset: Dataset) {
  const filters = useFilters();
  return useMemo(() => matchFilters(dataset, filters), [dataset, filters]);
}

export function clearFilters() {
  selectedSegments.set([]);
  selectedTypes.set([]);
  selectedLayers.set([]);
  ossOnly.set(false);
}
