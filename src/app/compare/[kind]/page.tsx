import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, SiteShell } from "@/components/seo/SiteShell";
import { cellText, clip, compareKinds, dimensionsFor, entryById, humanDate, SITE_NAME, toolsOfKind, url } from "@/lib/seo";
import { kindBlurb } from "../kinds";

type Props = { params: Promise<{ kind: string }> };

const kinds = () => Object.keys(compareKinds).filter((k) => toolsOfKind(k).length && dimensionsFor(k).length);
export function generateStaticParams() {
  return kinds().map((kind) => ({ kind }));
}
export const dynamicParams = false;

const titles = (kind: string) => toolsOfKind(kind).map((t) => entryById.get(t.entryId)?.title).filter((x): x is string => !!x);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kind } = await params;
  if (!compareKinds[kind]) return {};
  const names = titles(kind);
  const short = names.map((n) => n.replace(/\s*\(.*?\)/g, "")).slice(0, 3);
  return {
    title: `${compareKinds[kind]} compared: ${short.join(" vs ")} and more`,
    description: clip(`Compare ${names.length} ${compareKinds[kind].toLowerCase()} side by side: ${names.slice(0, 6).join(", ")}. Sourced price, license, features, best and worst fit. No overall score.`, 158),
    alternates: { canonical: `/compare/${kind}` },
  };
}

export default async function CompareKindPage({ params }: Props) {
  const { kind } = await params;
  if (!compareKinds[kind] || !kinds().includes(kind)) notFound();
  const dims = dimensionsFor(kind);
  const tools = toolsOfKind(kind).filter((t) => entryById.get(t.entryId));
  const groups = dims.reduce<{ group: string; rows: typeof dims }[]>((acc, d) => {
    const last = acc[acc.length - 1];
    if (last?.group === d.group) last.rows.push(d);
    else acc.push({ group: d.group, rows: [d] });
    return acc;
  }, []);
  return (
    <SiteShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: SITE_NAME, item: url("/") },
              { "@type": "ListItem", position: 2, name: "Compare AI tools", item: url("/compare") },
              { "@type": "ListItem", position: 3, name: compareKinds[kind], item: url(`/compare/${kind}`) },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${compareKinds[kind]} compared`,
            itemListElement: tools.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: url(`/tools/${t.entryId}`), name: entryById.get(t.entryId)!.title })),
          },
        ]}
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper-faint"><Link href="/compare" className="hover:text-paper">Compare</Link> / {compareKinds[kind]}</p>
      <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-paper md:text-6xl">{compareKinds[kind]} compared</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-paper-muted">{kindBlurb[kind]} Every cell is sourced and dated; a dash means not verified. There is no overall score, so use the rows that matter to you.</p>
      <p className="mt-3 text-[14px] text-paper-muted">Want to pick your own five? Open the interactive comparison from the <Link href="/" className="underline underline-offset-4 hover:text-paper">map</Link>, using the Compare button.</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full border-collapse text-left" style={{ minWidth: `${160 + tools.length * 170}px` }}>
          <caption className="sr-only">{compareKinds[kind]} compared on {dims.map((d) => d.label.toLowerCase()).join(", ")}</caption>
          <thead>
            <tr className="border-b border-hairline">
              <th scope="col" className="sticky left-0 z-10 w-40 bg-ink p-3"><span className="sr-only">Feature</span></th>
              {tools.map((t) => {
                const e = entryById.get(t.entryId)!;
                return (
                  <th key={t.entryId} scope="col" className="min-w-[160px] p-3 align-top">
                    <Link href={`/tools/${t.entryId}`} className="font-serif text-lg text-paper underline decoration-hairline-strong underline-offset-4 hover:decoration-paper">{e.title}</Link>
                    <p className="mt-1 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-paper-faint">{humanDate(e.date)} · as of {t.asOf}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.group}>
              <tr><th colSpan={tools.length + 1} scope="colgroup" className="sticky left-0 bg-ink-raised px-3 py-2 font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-paper-faint">{g.group}</th></tr>
              {g.rows.map((d) => (
                <tr key={d.id} className="border-t border-hairline align-top">
                  <th scope="row" className="sticky left-0 z-10 bg-ink p-3 text-[13px] font-normal text-paper-muted">{d.label}</th>
                  {tools.map((t) => {
                    const cell = t.cells[d.id];
                    return (
                      <td key={t.entryId} className="p-3 text-[14px] leading-snug text-paper">
                        {cellText(d, cell?.v)}
                        {cell?.note && <span className="mt-1 block text-[12px] text-paper-faint">{cell.note}</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-paper">Sources</h2>
        <ul className="mt-4 grid gap-x-8 gap-y-3 text-[13px] text-paper-muted md:grid-cols-2">
          {tools.map((t) => (
            <li key={t.entryId}>
              <Link href={`/tools/${t.entryId}`} className="text-paper">{entryById.get(t.entryId)!.title}</Link>
              {t.sources.slice(0, 3).map((s) => (<span key={s}>{" · "}<a href={s} rel="noopener" className="underline decoration-hairline-strong underline-offset-2 hover:text-paper">{new URL(s).hostname.replace(/^www\./, "")}</a></span>))}
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
