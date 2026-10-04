"use client";

import { X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { MethodContent } from "./MethodContent";
import { methodOpen, useStore } from "@/lib/store";
import { UPDATED_AT, UPDATED_ISO } from "@/lib/updated";

/** How Unhyped decides what goes on the road, as a sheet like the quiz and the Map of AI. */
export function MethodModal() {
  const open = useStore(methodOpen);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && methodOpen.set(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  const close = () => methodOpen.set(false);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button type="button" aria-label="Close method" className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={close} />
      <div
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="method-title"
        className="relative w-full max-w-[720px] animate-[fadeUp_380ms_var(--ease-out)] rounded-[2rem] border border-white/15 bg-white/[0.06] p-1.5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] outline-none backdrop-blur-2xl backdrop-saturate-150"
      >
        <div data-lenis-prevent className="glass-ink overscroll-contain relative max-h-[86dvh] overflow-y-auto rounded-[calc(2rem-0.375rem)] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] px-6 pb-8 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.04)] sm:px-9">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-muted">Method · Updated <time dateTime={UPDATED_ISO}>{UPDATED_AT}</time></p>
            <button type="button" onClick={close} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-paper-muted hover:text-paper">
              <X weight="light" size={16} />
            </button>
          </div>
          <h2 id="method-title" className="mt-2 font-serif text-3xl leading-none text-paper md:text-4xl">How this works</h2>
          <div className="mt-5 [&_h2]:mt-9 [&_h2]:text-2xl">
            <MethodContent />
          </div>
        </div>
      </div>
    </div>
  );
}
