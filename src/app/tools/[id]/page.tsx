import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, SiteShell } from "@/components/seo/SiteShell";
import { clip, compareKinds, entries, entryById, humanDate, kindOfEntry, layerName, SITE_NAME, TYPE_LABEL, url, yearOf } from "@/lib/seo";
import { ERAS, SEGMENTS } from "@/lib/taxonomy";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return entries.map((e) => ({ id: e.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = entryById.get((await params).id);
  if (!e) return {};
  const what = TYPE_LABEL[e.type].toLowerCase();
  return {
    title: `${e.title} (${yearOf(e.date)}): what it did and who built it`,
    description: clip(`${e.description} ${e.capabilityNote ?? ""}`.trim(), 158),
    alternates: { canonical: `/tools/${e.id}` },
    openGraph: { type: "article", images: ["/opengraph-image"], title: `${e.title}: ${what}, ${yearOf(e.date)}`, description: clip(e.description, 200), url: `/tools/${e.id}` },
  };
}

export default async function ToolPage({ params }: Props) {
  const e = entryById.get((await params).id);
  if (!e) notFound();
  const era = ERAS.find((x) => x.id === e.era);
  const kind = kindOfEntry(e.id);
  const related = e.edges.map((ed) => ({ type: ed.type, to: entryById.get(ed.target) })).filter((r) => r.to);
  const children = entries.filter((x) => x.parentId === e.id);
  return (
    <SiteShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: SITE_NAME, item: url("/") },
              { "@type": "ListItem", position: 2, name: "AI products and tools", item: url("/tools") },
              { "@type": "ListItem", position: 3, name: e.title, item: url(`/tools/${e.id}`) },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: e.title,
            url: url(`/tools/${e.id}`),
            description: clip(e.description, 200),
            datePublished: e.date.length >= 7 && !e.date.startsWith("-") ? e.date : undefined,
            isPartOf: { "@type": "WebSite", name: SITE_NAME, url: url("/") },
            about: { "@type": "Thing", name: e.title, description: clip(e.description, 200) },
          },
        ]}
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper-faint">
        <Link href="/tools" className="hover:text-paper">AI products and tools</Link> / {TYPE_LABEL[e.type]}
      </p>
      <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-paper md:text-6xl">{e.title}</h1>
      <p className="mt-3 text-[15px] text-paper-muted">
        {humanDate(e.date)}{e.endDate ? ` to ${humanDate(e.endDate)}` : ""}{e.creators.length ? ` · ${e.creators.join(", ")}` : ""}
      </p>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-paper/90">{e.description}</p>
      {e.capabilityNote && (
        <p className="mt-5 max-w-3xl border-l border-accent/60 pl-4 text-[16px] leading-relaxed text-paper-muted">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">What it could actually do</span><br />
          {e.capabilityNote}
        </p>
      )}

      <dl className="mt-8 grid max-w-3xl gap-x-8 gap-y-3 border-y border-hairline py-5 text-[14px] sm:grid-cols-[10rem_1fr]">
        <dt className="text-paper-faint">Segment</dt><dd className="text-paper">{SEGMENTS[e.primarySegment]}</dd>
        <dt className="text-paper-faint">Stack layer</dt><dd className="text-paper">{layerName(e.stackLayer)}</dd>
        {era && (<><dt className="text-paper-faint">Era</dt><dd className="text-paper"><Link href={`/timeline#era-${era.id}`} className="underline decoration-hairline-strong underline-offset-4 hover:decoration-paper">{era.name}</Link></dd></>)}
        {e.oss?.license && (<><dt className="text-paper-faint">License</dt><dd className="text-paper">{e.oss.license}</dd></>)}
        {e.oss?.repoUrl && (<><dt className="text-paper-faint">Repository</dt><dd><a href={e.oss.repoUrl} rel="noopener" className="text-paper underline decoration-hairline-strong underline-offset-4 hover:decoration-paper">{e.oss.repoUrl.replace("https://github.com/", "")}</a>{e.oss.archived ? " (archived)" : ""}</dd></>)}
      </dl>

      {kind && (
        <p className="mt-6 max-w-3xl text-[15px] text-paper-muted">
          <Link href={`/compare/${kind}`} className="rounded-full border border-hairline-strong px-4 py-2 text-paper hover:bg-white/10">Compare {e.title} with other {compareKinds[kind].toLowerCase()}</Link>
        </p>
      )}

      {(e.majorUpdates.length > 0 || children.length > 0) && (
        <section className="mt-10 max-w-3xl">
          <h2 className="font-serif text-2xl text-paper">Major updates</h2>
          <ol className="mt-4 space-y-4">
            {[...e.majorUpdates.map((u) => ({ date: u.date, title: u.title, summary: u.summary, id: undefined as string | undefined })), ...children.map((c) => ({ date: c.date, title: c.title, summary: c.description, id: c.id as string | undefined }))]
              .sort((a, b) => a.date.localeCompare(b.date)).map((u) => (
              <li key={u.date + u.title}>
                <p className="font-mono text-[12px] text-paper-muted">{humanDate(u.date)}</p>
                <p className="text-[16px] text-paper">{u.id ? <Link href={`/tools/${u.id}`} className="underline decoration-hairline-strong underline-offset-4">{u.title}</Link> : u.title}</p>
                <p className="text-[14px] text-paper-muted">{clip(u.summary, 240)}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10 max-w-3xl">
          <h2 className="font-serif text-2xl text-paper">Related</h2>
          <ul className="mt-3 space-y-1 text-[15px] text-paper-muted">
            {related.map((r) => (
              <li key={r.type + r.to!.id}>{r.type.replace(/-/g, " ")}: <Link href={`/tools/${r.to!.id}`} className="text-paper underline decoration-hairline-strong underline-offset-4">{r.to!.title}</Link></li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 max-w-3xl">
        <h2 className="font-serif text-2xl text-paper">Sources</h2>
        <ul className="mt-3 space-y-1 text-[14px] text-paper-muted">
          {e.sources.map((s) => (
            <li key={s.url}><a href={s.url} rel="noopener" className="underline decoration-hairline-strong underline-offset-4 hover:text-paper">{s.title ?? s.url}</a></li>
          ))}
        </ul>
      </section>
      <p className="mt-10 text-[14px] text-paper-muted">
        See where {e.title} sits on the <Link href="/" className="underline underline-offset-4 hover:text-paper">interactive map</Link> or in the <Link href="/timeline" className="underline underline-offset-4 hover:text-paper">full AI timeline</Link>.
      </p>
    </SiteShell>
  );
}
