"use client";

import { ArrowUpRight, SquaresFour } from "@phosphor-icons/react";
import { filterOpen, quizOpen, travel } from "@/lib/store";

/** Floating island nav: wordmark, Map of AI, Method, and the Quiz CTA. */
export function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 md:pt-6">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-ink/55 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
      >
        <button
          type="button"
          onClick={() => travel.to(0)}
          className="rounded-full px-4 py-2 font-serif text-lg leading-none text-paper"
          aria-label="Unhyped, back to Today"
        >
          Unhyped
        </button>
        <button
          type="button"
          onClick={() => filterOpen.set(!filterOpen.get())}
          className="hidden items-center gap-2 rounded-full px-4 py-2 text-[13px] text-paper-muted transition-colors duration-300 hover:text-paper sm:inline-flex"
        >
          <SquaresFour weight="light" size={16} /> Map of AI
        </button>
        <a
          href="/method"
          className="hidden rounded-full px-4 py-2 text-[13px] text-paper-muted transition-colors duration-300 hover:text-paper sm:inline-flex"
        >
          Method
        </a>
        <button
          type="button"
          onClick={() => quizOpen.set(true)}
          className="group inline-flex items-center gap-2 rounded-full bg-paper py-1.5 pl-4 pr-1.5 text-[13px] font-medium text-ink transition-transform duration-300 ease-spring active:scale-[0.98]"
        >
          Take the quiz
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/10 transition-transform duration-300 ease-spring group-hover:-translate-y-px group-hover:translate-x-0.5">
            <ArrowUpRight weight="light" size={14} />
          </span>
        </button>
      </nav>
    </header>
  );
}
