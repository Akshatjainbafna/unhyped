import Link from "next/link";
import { App } from "@/components/App";
import { JsonLd } from "@/components/seo/SiteShell";
import { SITE_URL } from "@/lib/seo";
import claims from "../../data/claims.json";
import entries from "../../data/entries.json";
import logos from "../../data/logos.json";
import people from "../../data/people.json";
import scenarios from "../../data/scenarios.json";
import stillAlive from "../../data/still-alive.json";
import type { RawDataset } from "@/lib/schema";

export default function Home() {
  const raw = { entries, claims, stillAlive, people, scenarios } as RawDataset;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Unhyped",
          url: SITE_URL,
          description: "The complete AI timeline, AI products and side-by-side tool comparisons, with sources.",
        }}
      />
      <App raw={raw} logos={logos as Record<string, string>} />
      {/* Crawlable entry points into the content pages; the map itself is interactive. */}
      <nav aria-label="Explore Unhyped" className="sr-only">
        <Link href="/timeline">The complete AI timeline</Link>
        <Link href="/tools">AI products, models and open-source tools</Link>
        <Link href="/compare">Compare AI tools side by side</Link>
        <Link href="/compare/coding-agents">AI coding agents compared</Link>
        <Link href="/compare/models">AI models compared</Link>
        <Link href="/method">How Unhyped decides what to include</Link>
      </nav>
    </>
  );
}
