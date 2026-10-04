"use client";

import { ArrowUpRight, List, MagnifyingGlass, SquaresFour, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { UPDATED_AT, UPDATED_ISO } from "@/lib/updated";
import { compareOpen, filterOpen, methodOpen, quizOpen, searchOpen, travel } from "@/lib/store";

/** Floating island nav: wordmark, Map of AI, Method, and the Quiz CTA. */
export function Navbar() {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);
  const item = "flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 text-left text-[15px] text-paper-muted active:bg-white/10";
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex flex-col items-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-4 md:pt-6">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex w-full max-w-sm items-center gap-1 sm:w-auto sm:max-w-none sm:justify-start rounded-full border border-white/10 bg-ink/55 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
      >
        <button
          type="button"
          onClick={() => travel.to(0)}
          className="rounded-full px-3 py-2 font-serif text-lg leading-none text-paper sm:px-4"
          aria-label="Unhyped, back to Today"
        >
          Unhyped
        </button>
        <button
          type="button"
          onClick={() => searchOpen.set(true)}
          aria-label="Search the road"
          className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 py-2 text-[13px] text-paper-muted transition-colors duration-300 hover:text-paper sm:ml-0 sm:min-h-0 sm:min-w-0 sm:px-4"
        >
          <MagnifyingGlass weight="light" size={16} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-hairline px-1 font-mono text-[10px] text-paper-faint lg:inline">⌘K</kbd>
        </button>
        <button
          type="button"
          onClick={() => filterOpen.set(!filterOpen.get())}
          className="hidden items-center gap-2 rounded-full px-4 py-2 text-[13px] text-paper-muted transition-colors duration-300 hover:text-paper sm:inline-flex"
        >
          <SquaresFour weight="light" size={16} /> Map of AI
        </button>
        <button
          type="button"
          onClick={() => methodOpen.set(true)}
          className="hidden rounded-full px-4 py-2 text-[13px] text-paper-muted transition-colors duration-300 hover:text-paper sm:inline-flex"
        >
          Method
        </button>
        <button
          type="button"
          onClick={() => compareOpen.set(true)}
          className="hidden rounded-full px-4 py-2 text-[13px] text-paper-muted transition-colors duration-300 hover:text-paper sm:inline-flex"
        >
          Compare
        </button>
        <button
          type="button"
          onClick={() => quizOpen.set(true)}
          className="group hidden items-center gap-2 rounded-full bg-paper py-1.5 pl-4 pr-1.5 text-[13px] font-medium text-ink transition-transform duration-300 ease-spring active:scale-[0.98] sm:inline-flex"
        >
          Take the quiz
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/10 transition-transform duration-300 ease-spring group-hover:-translate-y-px group-hover:translate-x-0.5">
            <ArrowUpRight weight="light" size={14} />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMenu((m) => !m)}
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-paper sm:hidden"
        >
          {menu ? <X weight="light" size={20} /> : <List weight="light" size={20} />}
        </button>
      </nav>
      {menu && (
        <>
          <button type="button" aria-label="Close menu" tabIndex={-1} onClick={() => setMenu(false)} className="pointer-events-auto fixed inset-0 -z-10 cursor-default bg-ink/45 sm:hidden" />
          <div className="pointer-events-auto mt-2 w-full max-w-sm rounded-3xl border border-white/10 bg-ink/90 p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:hidden">
            <button type="button" onClick={() => { setMenu(false); quizOpen.set(true); }} className="flex min-h-12 w-full items-center justify-between rounded-2xl bg-paper px-4 text-[15px] font-medium text-ink">
              Take the quiz <ArrowUpRight weight="light" size={16} />
            </button>
            <button type="button" onClick={() => { setMenu(false); filterOpen.set(true); }} className={`${item} mt-1`}>
              <SquaresFour weight="light" size={18} /> Map of AI
            </button>
            <button type="button" onClick={() => { setMenu(false); compareOpen.set(true); }} className={item}>Compare tools</button>
            <button type="button" onClick={() => { setMenu(false); methodOpen.set(true); }} className={item}>Method</button>
            <p className="px-4 pb-2 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-faint">Data updated <time dateTime={UPDATED_ISO}>{UPDATED_AT}</time></p>
          </div>
        </>
      )}
    </header>
  );
}
