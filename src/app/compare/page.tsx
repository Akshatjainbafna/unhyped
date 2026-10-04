import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, SiteShell } from "@/components/seo/SiteShell";
import { compareKinds, entryById, SITE_NAME, toolsOfKind, url } from "@/lib/seo";
import { kindBlurb } from "./kinds";

export const metadata: Metadata = {
  title: "Compare AI tools side by side: coding agents, models, frameworks and more",
  description: "Side-by-side comparisons of AI tools with sourced facts: price, license, features and what each is best and worst at. No overall score; find the one that fits your need.",
  alternates: { canonical: "/compare" },
};

export default function CompareHub() {
  const kinds = Object.entries(compareKinds).map(([id, label]) => ({ id, label, tools: toolsOfKind(id) })).filter((k) => k.tools.length);
  return (
    <SiteShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Compare AI tools",
          url: url("/compare"),
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: url("/") },
          mainEntity: { "@type": "ItemList", itemListElement: kinds.map((k, i) => ({ "@type": "ListItem", position: i + 1, url: url(`/compare/${k.id}`), name: `${k.label} compared` })) },
        }}
      />
      <h1 className="font-serif text-4xl leading-tight text-paper md:text-6xl">Compare AI tools</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper-muted">
        Tools of the same kind, side by side, with the source and date behind each fact. There is no overall score: each row shows where a tool is strong or weak so you can match it to what you need. A dash means we have not verified it.
      </p>
      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {kinds.map((k) => (
          <li key={k.id} className="rounded-2xl border border-hairline p-5">
            <h2 className="font-serif text-2xl text-paper"><Link href={`/compare/${k.id}`} className="underline decoration-hairline-strong underline-offset-4 hover:decoration-paper">{k.label}</Link></h2>
            <p className="mt-2 text-[14px] leading-relaxed text-paper-muted">{kindBlurb[k.id]}</p>
            <p className="mt-3 text-[13px] text-paper-faint">
              {k.tools.slice(0, 8).map((t) => entryById.get(t.entryId)?.title).filter(Boolean).join(", ")}{k.tools.length > 8 ? ` and ${k.tools.length - 8} more` : ""}
            </p>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
