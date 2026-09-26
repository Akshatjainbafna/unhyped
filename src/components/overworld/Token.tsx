"use client";

import { memo } from "react";
import type { Token as T } from "@/lib/overworld/stops";
import { SEGMENT_COLOR } from "@/lib/overworld/style";
import { hoveredEntry, openEntry } from "@/lib/store";

// Shape says what kind of thing it is; colour says which segment.
const SHAPE: Record<T["type"], string> = {
  product: "rounded-full",
  model: "rounded-[12px]",
  paper: "rounded-[4px]",
  "oss-repo": "rounded-[14px_4px_14px_4px]",
  "major-update": "rounded-full",
  update: "rounded-full",
  person: "rounded-full",
  org: "rounded-[8px]",
  event: "rounded-[4px] rotate-45",
};

function Letter({ title }: { title: string }) {
  const word = title.replace(/^[^A-Za-z0-9]+/, "");
  return <span className="font-game text-[15px] font-bold leading-none text-[#26283b]">{word.slice(0, 2)}</span>;
}

/** One launch on the map: real logo when there is one, segment colour ring, type shape. */
export const Token = memo(function Token({
  token,
  logo,
  dim,
  ring,
}: {
  token: T;
  logo?: string;
  dim: boolean;
  ring?: "known" | "missed";
}) {
  const update = token.type === "update";
  const size = update ? 34 : 44;
  const color = SEGMENT_COLOR[token.segment];
  return (
    <button
      type="button"
      data-entry={token.entryId}
      aria-label={`${token.title} (${token.date})`}
      onPointerEnter={(e) => hoveredEntry.set({ id: token.entryId, x: e.clientX, y: e.clientY })}
      onPointerLeave={() => hoveredEntry.set(null)}
      onFocus={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        hoveredEntry.set({ id: token.entryId, x: r.right, y: r.top });
      }}
      onBlur={() => hoveredEntry.set(null)}
      onClick={() => openEntry.set(token.entryId)}
      className={`group relative flex items-center justify-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:scale-110 active:scale-95 ${dim ? "opacity-25" : "opacity-100"}`}
      style={{ width: size, height: size }}
    >
      <span
        className={`absolute inset-0 border-[3px] border-[#26283b] bg-white ${SHAPE[token.type]}`}
        style={{ boxShadow: `inset 0 0 0 3px ${color}, 0 3px 0 #26283b` }}
      />
      {ring && (
        <span className={`absolute -inset-[5px] rounded-full border-[3px] ${ring === "known" ? "border-[#ffc21a]" : "border-[#ff6b5b]"}`} />
      )}
      <span className="relative flex items-center justify-center" style={{ width: size * 0.56, height: size * 0.56 }}>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" width={Math.round(size * 0.56)} height={Math.round(size * 0.56)} loading="lazy" decoding="async" className="h-full w-full object-contain" />
        ) : (
          <Letter title={token.title} />
        )}
      </span>
      {update && (
        <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#26283b] bg-[#ffd23f] text-[9px] font-black leading-none text-[#26283b]">
          ↑
        </span>
      )}
    </button>
  );
});
