import { App } from "@/components/App";
import claims from "../../data/claims.json";
import entries from "../../data/entries.json";
import logos from "../../data/logos.json";
import people from "../../data/people.json";
import scenarios from "../../data/scenarios.json";
import stillAlive from "../../data/still-alive.json";
import type { RawDataset } from "@/lib/schema";

export default function Home() {
  const raw = { entries, claims, stillAlive, people, scenarios } as RawDataset;
  return <App raw={raw} logos={logos as Record<string, string>} />;
}
