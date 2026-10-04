import type { Metadata } from "next";
import Link from "next/link";
import { UPDATED_AT, UPDATED_ISO } from "@/lib/updated";
import { MethodContent } from "@/components/method/MethodContent";

export const metadata: Metadata = { title: "Method · Unhyped", description: "How Unhyped decides what goes on the road, and how it is sourced." };

export default function Method() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 md:py-28">
      <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper-faint hover:text-paper">← Back to the road</Link>
      <h1 className="mt-6 font-serif text-5xl leading-none text-paper md:text-6xl">Method</h1>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-paper-faint">Updated <time dateTime={UPDATED_ISO}>{UPDATED_AT}</time></p>
      <div className="mt-6">
        <MethodContent />
      </div>
    </main>
  );
}
