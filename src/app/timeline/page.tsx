import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, SiteShell } from "@/components/seo/SiteShell";
import { clip, entries, humanDate, SITE_NAME, TYPE_LABEL, url, yearOf } from "@/lib/seo";
import { dateValue } from "@/lib/dataset";
import { ERAS } from "@/lib/taxonomy";

const sorted = [...entries].sort((a, b) => dateValue(b.date) - dateValue(a.date));
const first = [...entries].sort((a, b) => dateValue(a.date) - dateValue(b.date))[0];

export const metadata: Metadata = {
  title: "AI timeline: every major breakthrough, model and product, from ancient tools to today",
  description: `A sourced timeline of ${entries.length} milestones in artificial intelligence, from ${yearOf(first.date)} to today: the papers, models, products and open-source projects that changed what AI could do, and which claims held up.`,
  alternates: { canonical: "/timeline" },
};

export default function TimelinePage() {
  // Newest first, like the map; grouped by the capability era each entry belongs to.
  const byEra = ERAS.filter((e) => e.id !== 8)
    .map((era) => ({ era, items: sorted.filter((e) => e.era === era.id) }))
    .filter((g) => g.items.length)
    .reverse();
  return (
    <SiteShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AI timeline",
          url: url("/timeline"),
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: url("/") },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: sorted.length,
            itemListElement: sorted.slice(0, 100).map((e, i) => ({ "@type": "ListItem", position: i + 1, url: url(`/tools/${e.id}`), name: e.title })),
          },
        }}
      />
      <h1 className="font-serif text-4xl leading-tight text-paper md:text-6xl">The complete AI timeline</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper-muted">
        {entries.length} sourced milestones from {yearOf(first.date)} to today: what each technology demonstrably did, who built it, and where the hype and the reality parted. Newest first, grouped by what machines could do at the time.
      </p>
      <p className="mt-3 text-[14px] text-paper-muted">
        Prefer to explore? <Link href="/" className="underline underline-offset-4 hover:text-paper">Travel the interactive map</Link>, browse <Link href="/tools" className="underline underline-offset-4 hover:text-paper">AI products and tools</Link>, or <Link href="/compare" className="underline underline-offset-4 hover:text-paper">compare tools side by side</Link>.
      </p>
      <nav aria-label="Eras" className="mt-8 flex flex-wrap gap-2">
        {byEra.map(({ era }) => (
          <a key={era.id} href={`#era-${era.id}`} className="inline-flex min-h-11 items-center rounded-full border border-hairline-strong px-4 text-[13px] text-paper-muted hover:text-paper">{era.short}</a>
        ))}
      </nav>
      {byEra.map(({ era, items }) => (
        <section key={era.id} id={`era-${era.id}`} aria-labelledby={`h-${era.id}`} className="mt-14 scroll-mt-6">
          <h2 id={`h-${era.id}`} className="font-serif text-3xl text-paper">{era.name}</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-paper-faint">{items.length} milestones</p>
          <ol className="mt-5 divide-y divide-hairline border-y border-hairline">
            {items.map((e) => (
              <li key={e.id} className="grid gap-1 py-4 md:grid-cols-[9rem_1fr] md:gap-6">
                <p className="font-mono text-[12px] text-paper-muted tabular">{humanDate(e.date)}</p>
                <div>
                  <h3 className="text-[17px] text-paper"><Link href={`/tools/${e.id}`} className="underline decoration-hairline-strong underline-offset-4 hover:decoration-paper">{e.title}</Link></h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-paper-muted">{clip(e.description, 220)}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper-faint">{TYPE_LABEL[e.type]}{e.creators.length ? ` · ${e.creators.slice(0, 2).join(", ")}` : ""}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </SiteShell>
  );
}
