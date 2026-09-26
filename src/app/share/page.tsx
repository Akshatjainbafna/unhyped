import type { Metadata } from "next";
import Link from "next/link";

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = await searchParams;
  const qs = new URLSearchParams(Object.entries(q).filter(([, v]) => v) as [string, string][]).toString();
  const title = `${q.p ?? "?"}% · ${q.l ?? "Unhyped"} — Unhyped score`;
  return {
    title,
    description: "How much of AI do you actually know? Travel the real history of AI and take the quiz.",
    openGraph: { title, images: [{ url: `/api/og?${qs}`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [`/api/og?${qs}`] },
  };
}

export default async function Share({ searchParams }: Props) {
  const q = await searchParams;
  const qs = new URLSearchParams(Object.entries(q).filter(([, v]) => v) as [string, string][]).toString();
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col justify-center gap-8 px-4 py-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/og?${qs}`} alt={`Unhyped score ${q.p}%, level ${q.l}`} width={1200} height={630} className="w-full rounded-[1.5rem] border border-hairline" />
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/" className="rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-ink">Travel the road and take the quiz</Link>
        <p className="text-sm text-paper-muted">Copy this page&apos;s URL to share your card.</p>
      </div>
    </main>
  );
}
