import type { Metadata } from "next";
import { IngestForm } from "./IngestForm";

export const metadata: Metadata = { title: "Ingest · Unhyped", robots: { index: false } };

export default function IngestPage() {
  return (
    <main className="mx-auto min-h-[100dvh] max-w-3xl px-4 py-16 md:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-faint">Admin</p>
      <h1 className="mt-3 font-serif text-5xl text-paper">Add to the road</h1>
      <p className="mt-4 max-w-[60ch] text-paper-muted">
        Paste an article URL or its text about a new development or a forecast. It is classified against the inclusion criteria,
        drafted into schema-valid records, de-duplicated, and opened as a draft pull request. Nothing is published until you merge it.
      </p>
      <IngestForm />
    </main>
  );
}
