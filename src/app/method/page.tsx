import type { Metadata } from "next";
import Link from "next/link";
import { ERAS, SEGMENT_GROUPS, SEGMENTS, STACK_LAYERS } from "@/lib/taxonomy";

export const metadata: Metadata = { title: "Method · Unhyped", description: "How Unhyped decides what goes on the road, and how it is sourced." };

export default function Method() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 md:py-28">
      <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper-faint hover:text-paper">← Back to the road</Link>
      <h1 className="mt-6 font-serif text-5xl leading-none text-paper md:text-6xl">Method</h1>
      <p className="mt-6 text-lg leading-relaxed text-paper-muted">
        Unhyped is a sourced history of what AI could demonstrably do at each point, and of what people said it would do.
        It is anti-hype, not anti-AI: claims that came true are shown as prominently as those that did not.
      </p>

      <h2 className="mt-14 font-serif text-3xl text-paper">What gets on the road</h2>
      <p className="mt-3 text-paper-muted">An entry qualifies if it meets at least one of these:</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-paper-muted">
        <li>It changed what AI could do.</li>
        <li>It changed who could use or build AI.</li>
        <li>It defined a layer of the stack or a standard.</li>
        <li>It was hyped enough to need a Claim vs. Reality check, including failures.</li>
        <li>It is an open-source project with major, sustained use. GitHub stars alone are not enough: they measure attention, and a 2026 study found millions of fake stars.</li>
      </ol>

      <h2 className="mt-14 font-serif text-3xl text-paper">Sourcing rules</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-paper-muted">
        <li>Every entry cites at least one dated source.</li>
        <li>Quotes are verbatim, from a named person, with a link. Only quotes checked against a primary source are shown in quotation marks; others are marked “wording not yet verified”.</li>
        <li>Sentiments with no named speaker (“RAG is dead”) are labelled community sentiment, never attributed.</li>
        <li>The Reality side of every Claim vs. Reality pair is written by a person, never generated.</li>
        <li>Forecasts name who made them, when, and for when, and are checked when they come due.</li>
      </ul>

      <h2 className="mt-14 font-serif text-3xl text-paper">Eras are capabilities, not dates</h2>
      <ol className="mt-4 space-y-1 text-paper-muted">
        {ERAS.map((e) => (
          <li key={e.id}><span className="font-mono text-[12px] text-paper-faint">{e.id}</span> {e.name}</li>
        ))}
      </ol>
      <p className="mt-3 text-paper-muted">Deep Blue (1997) is era 1: it searched, it did not learn. The backdrop follows the dominant capability of the time.</p>

      <h2 className="mt-14 font-serif text-3xl text-paper">Segments and the stack</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {Object.entries(SEGMENT_GROUPS).map(([g, ids]) => (
          <div key={g}>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">{g}</h3>
            <p className="mt-2 text-sm text-paper-muted">{(ids as readonly (keyof typeof SEGMENTS)[]).map((i) => SEGMENTS[i]).join(" · ")}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-paper-muted">Stack layers, bottom to top: {STACK_LAYERS.filter((l) => l.id !== "ops").map((l) => l.name).join(" → ")}, with Ops / Eval / Safety across all of them.</p>

      <h2 className="mt-14 font-serif text-3xl text-paper">Corrections</h2>
      <p className="mt-3 text-paper-muted">Every entry has a “Suggest an edit” button that opens a pre-filled GitHub issue. The dataset lives in the repository; changes arrive as reviewed pull requests.</p>
    </main>
  );
}
