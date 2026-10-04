import Link from "next/link";
import { UPDATED_ISO } from "@/lib/seo";

const NAV = [
  { href: "/", label: "Map" },
  { href: "/timeline", label: "Timeline" },
  { href: "/tools", label: "Products" },
  { href: "/compare", label: "Compare" },
  { href: "/method", label: "Method" },
];

const updated = new Date(`${UPDATED_ISO}T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

/** Plain, fast, crawlable frame for the content pages (timeline, products, compare). */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-ink text-paper">
      <header className="border-b border-hairline">
        <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center gap-x-5 gap-y-2 overflow-x-auto px-4 py-4 text-[14px] [scrollbar-width:none]">
          <Link href="/" className="mr-2 shrink-0 font-serif text-xl text-paper">Unhyped</Link>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="inline-flex min-h-11 shrink-0 items-center text-paper-muted hover:text-paper">{n.label}</Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">{children}</main>
      <footer className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-8 text-[13px] text-paper-muted">
          <p>Unhyped is a sourced history of what AI could demonstrably do, and a side-by-side guide to the tools. Data updated <time dateTime={UPDATED_ISO}>{updated}</time>.</p>
          <p className="mt-2 flex flex-wrap gap-x-5">
            <Link href="/timeline" className="underline underline-offset-4 hover:text-paper">AI timeline</Link>
            <Link href="/tools" className="underline underline-offset-4 hover:text-paper">AI products and tools</Link>
            <Link href="/compare" className="underline underline-offset-4 hover:text-paper">Compare AI tools</Link>
            <Link href="/method" className="underline underline-offset-4 hover:text-paper">How we decide what is included</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
