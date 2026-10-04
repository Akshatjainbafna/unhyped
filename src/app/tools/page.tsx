import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, SiteShell } from "@/components/seo/SiteShell";
import { dateValue } from "@/lib/dataset";
import { clip, entries, kindOfEntry, SITE_NAME, url, yearOf } from "@/lib/seo";
import { STACK_LAYERS } from "@/lib/taxonomy";

const PRODUCT_TYPES = new Set(["product", "model", "oss-repo", "major-update"]);
const products = entries.filter((e) => PRODUCT_TYPES.has(e.type));

export const metadata: Metadata = {
  title: "AI products, models and open-source tools: the directory",
  description: `${products.length} AI products, models and open-source projects in one place, from apps and coding agents to frameworks, vector databases and chips, each with its release date, creators and sources.`,
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  const groups = [...STACK_LAYERS].reverse().map((l) => ({
    layer: l,
    items: products.filter((e) => e.stackLayer === l.id).sort((a, b) => dateValue(b.date) - dateValue(a.date)),
  })).filter((g) => g.items.length);
  return (
    <SiteShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AI products, models and open-source tools",
          url: url("/tools"),
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: url("/") },
          mainEntity: { "@type": "ItemList", numberOfItems: products.length, itemListElement: products.slice(0, 100).map((e, i) => ({ "@type": "ListItem", position: i + 1, url: url(`/tools/${e.id}`), name: e.title })) },
        }}
      />
      <h1 className="font-serif text-4xl leading-tight text-paper md:text-6xl">AI products and tools, in one place</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper-muted">
        Every product, model and open-source project on the road, organised by where it sits in the AI stack. Tools marked <span className="text-paper">Compare</span> have a side-by-side page. See also the <Link href="/timeline" className="underline underline-offset-4 hover:text-paper">full AI timeline</Link>.
      </p>
      <nav aria-label="Stack layers" className="mt-8 flex flex-wrap gap-2">
        {groups.map(({ layer }) => (
          <a key={layer.id} href={`#layer-${layer.id}`} className="inline-flex min-h-11 items-center rounded-full border border-hairline-strong px-4 text-[13px] text-paper-muted hover:text-paper">{layer.name}</a>
        ))}
      </nav>
      {groups.map(({ layer, items }) => (
        <section key={layer.id} id={`layer-${layer.id}`} aria-labelledby={`h-${layer.id}`} className="mt-14 scroll-mt-6">
          <h2 id={`h-${layer.id}`} className="font-serif text-3xl text-paper">{layer.name}</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-paper-faint">{items.length} entries</p>
          <ul className="mt-5 grid gap-x-8 divide-y divide-hairline border-y border-hairline md:grid-cols-2 md:divide-y-0">
            {items.map((e) => (
              <li key={e.id} className="border-b border-hairline py-3 md:[&:nth-last-child(-n+2)]:border-b-0">
                <Link href={`/tools/${e.id}`} className="text-[16px] text-paper underline decoration-hairline-strong underline-offset-4 hover:decoration-paper">{e.title}</Link>
                <span className="ml-2 font-mono text-[11px] text-paper-faint tabular">{yearOf(e.date)}</span>
                {kindOfEntry(e.id) && <span className="ml-2 rounded-full border border-hairline-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper-muted">Compare</span>}
                <p className="mt-1 text-[13px] leading-snug text-paper-muted">{clip(e.description, 140)}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </SiteShell>
  );
}
