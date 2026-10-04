"use client";

import { ArrowUpRight, Scales } from "@phosphor-icons/react";
import compare from "../../../data/compare.json";
import { compareOpen, compareSeed } from "@/lib/store";

/** Opens the compare window with this tool picked. Renders nothing for tools without compare data. */
export function CompareCta({ entryId, onOpen }: { entryId: string; onOpen?: () => void }) {
  const tool = compare.tools.find((t) => t.entryId === entryId);
  if (!tool) return null;
  const others = compare.tools.filter((t) => t.class === tool.class && t.entryId !== entryId).length;
  return (
    <button
      type="button"
      onClick={() => {
        compareSeed.set([entryId]);
        onOpen?.();
        compareOpen.set(true);
      }}
      className="group mt-5 flex w-full items-center gap-3 rounded-2xl border border-hairline-strong bg-white/[0.04] p-3 text-left transition-[background-color,transform] duration-300 ease-spring hover:bg-white/[0.08] active:scale-[0.99]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-ink">
        <Scales weight="light" size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium text-paper">Compare with similar tools</span>
        <span className="block text-[12px] text-paper-muted">
          Side by side with {others} other{others === 1 ? "" : "s"}: price, features, best and worst fit
        </span>
      </span>
      <ArrowUpRight weight="light" size={18} className="shrink-0 text-paper-muted transition-transform duration-300 ease-spring group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:text-paper" />
    </button>
  );
}
