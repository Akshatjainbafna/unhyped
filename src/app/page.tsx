import { Experience } from "@/components/Experience";
import claims from "../../data/claims.json";
import entries from "../../data/entries.json";
import people from "../../data/people.json";
import scenarios from "../../data/scenarios.json";
import stillAlive from "../../data/still-alive.json";
import type { RawDataset } from "@/lib/schema";

export default function Home() {
  const raw = { entries, claims, stillAlive, people, scenarios } as RawDataset;
  return <Experience raw={raw} />;
}
