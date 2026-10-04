"use client";

import { Check, MagnifyingGlass, Minus, Plus, X } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { CompareLimit, dimensionsFor, STAR_RUBRIC, type Cell, type CompareTool, type Dimension } from "@/lib/compare";

export type PickerTool = CompareTool & { title: string; date: string; logo: string | null; layer: string; segment: string };

function Stars({ n }: { n: number }) {
  return (
    <span role="img" aria-label={`${n} out of 5`} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} aria-hidden="true" className={`text-[15px] leading-none ${i <= n ? "text-paper" : "text-paper-faint/50"}`}>★</span>
      ))}
    </span>
  );
}

function Value({ dim, cell }: { dim: Dimension; cell: Cell | undefined }) {
  const v = cell?.v ?? null;
  if (v === null) return <span className="text-paper-faint" title="Not verified">—<span className="sr-only">Not verified</span></span>;
  if (dim.kind === "stars" && typeof v === "number") return <Stars n={v} />;
  if (dim.kind === "bool") {
    if (v === true) return <span className="inline-flex items-center gap-1.5 text-paper"><Check weight="bold" size={16} className="text-[#2ec4b6]" /><span className="sr-only">Yes</span></span>;
    if (v === false) return <span className="inline-flex items-center gap-1.5 text-paper"><X weight="bold" size={16} className="text-[#ff6b5b]" /><span className="sr-only">No</span></span>;
    if (v === "partial") return <span className="inline-flex items-center gap-1.5 text-paper"><Minus weight="bold" size={16} className="text-[#ffc21a]" />Partly</span>;
  }
  return <span className="text-[14px] leading-snug text-paper">{String(v)}</span>;
}

const same = (tools: PickerTool[], id: string) => new Set(tools.map((t) => JSON.stringify(t.cells[id]?.v ?? null))).size === 1;

const KIND_ROW: Dimension = { group: "Where it sits", id: "__kind", label: "What it is", kind: "text" };
const SEGMENT_ROW: Dimension = { group: "Where it sits", id: "__segment", label: "Segment", kind: "text" };

export function CompareView({ tools, classes: kinds, layers, initial }: { tools: PickerTool[]; classes: Record<string, string>; layers: { id: string; name: string }[]; initial: string[] }) {
  const classes = useMemo<Record<string, string>>(() => ({ ...Object.fromEntries(layers.map((l) => [l.id, l.name])) }), [layers]);
  const classIds = layers.map((l) => l.id).filter((id) => tools.some((t) => t.layer === id));
  const seedClass = tools.find((t) => t.entryId === initial[0])?.layer;
  const [cls, setCls] = useState<string>(seedClass ?? classIds[0] ?? "");
  const [ids, setIds] = useState<string[]>(initial.filter((id) => tools.find((t) => t.entryId === id)?.layer === cls).slice(0, CompareLimit));
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [query, setQuery] = useState("");
  const picked = ids.map((id) => tools.find((t) => t.entryId === id)).filter((t): t is PickerTool => !!t);
  
  const switchClass = (id: string, keep: string[] = []) => {
    setCls(id);
    setIds(keep);
  };

  const { candidates, elsewhere } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hit = (t: PickerTool) => !q || t.title.toLowerCase().includes(q);
    const inClass = tools.filter((t) => t.layer === cls && (ids.includes(t.entryId) || hit(t)));
    // Selected first; capped so the list stays short.
    inClass.sort((a, b) => Number(ids.includes(b.entryId)) - Number(ids.includes(a.entryId)));
    return {
      candidates: inClass.slice(0, q ? 24 : 16),
      // Matches in other categories: one tap switches over to them.
      elsewhere: q ? tools.filter((t) => t.layer !== cls && hit(t)).slice(0, 6) : [],
    };
  }, [tools, ids, query, cls]);

  const toggle = (id: string) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < CompareLimit ? [...cur, id] : cur));

  const { groups, hidden } = useMemo(() => {
    // Rows of every kind of tool on screen, shared rows once. A row that only one picked tool has
    // can't compare anything, so it is hidden; a tool without a row shows "n/a".
    const kindsShown = [...new Set(picked.map((t) => t.class))];
    const seen = new Set<string>();
    const all = kindsShown.flatMap((c) => dimensionsFor(c)).filter((d) => !seen.has(d.id) && seen.add(d.id));
    const applies = (t: PickerTool, id: string) => dimensionsFor(t.class).some((x) => x.id === id);
    const shared = all.filter((d) => picked.length < 2 || picked.filter((t) => applies(t, d.id)).length >= 2);
    const rows = shared.filter((d) => !onlyDiff || picked.length < 2 || !same(picked, d.id));
    const byGroup = new Map<string, Dimension[]>();
    byGroup.set("Where it sits", kindsShown.length > 1 ? [SEGMENT_ROW, KIND_ROW] : [SEGMENT_ROW]);
    for (const d of rows) byGroup.set(d.group, [...(byGroup.get(d.group) ?? []), d]);
    return { groups: [...byGroup].map(([group, rs]) => ({ group, rows: rs })), hidden: all.length - shared.length };
  }, [onlyDiff, picked]);

  return (
    <>
      <section aria-label="Choose tools" className="mt-5">
        <div role="tablist" aria-label="Category" data-lenis-prevent className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {classIds.map((id) => {
            const on = id === cls;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => !on && switchClass(id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors ${on ? "border-paper bg-paper text-ink" : "border-hairline-strong text-paper-muted hover:text-paper"}`}
              >
                {classes[id]}
                <span className="font-mono text-[10px] opacity-60">{tools.filter((t) => t.layer === id).length}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper-faint">
            {classes[cls]} · {ids.length}/{CompareLimit}
          </h2>
          {ids.length > 0 && <button type="button" onClick={() => setIds([])} className="text-[13px] text-paper-muted underline underline-offset-4 hover:text-paper">Clear</button>}
        </div>
        <label className="mt-3 flex items-center gap-3 rounded-full border border-hairline-strong px-4 focus-within:border-paper/60">
          <MagnifyingGlass weight="light" size={16} className="shrink-0 text-paper-muted" />
          <span className="sr-only">Search tools to add</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${classes[cls]?.toLowerCase() ?? "tools"} to add`}
            className="h-11 w-full bg-transparent text-[14px] text-paper outline-none placeholder:text-paper-faint"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-paper-faint hover:text-paper">
              <X size={14} />
            </button>
          )}
        </label>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tools to add">
          {candidates.map((t) => {
            const on = ids.includes(t.entryId);
            const full = !on && ids.length >= CompareLimit;
            return (
              <li key={t.entryId}>
                <button
                  type="button"
                  aria-pressed={on}
                  disabled={full}
                  title={full ? `Up to ${CompareLimit} tools` : undefined}
                  onClick={() => toggle(t.entryId)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[14px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${on ? "border-paper bg-paper text-ink" : "border-hairline-strong text-paper-muted hover:text-paper"}`}
                >
                  {on ? <Check weight="bold" size={14} /> : <Plus weight="bold" size={14} />}
                  {t.title}
                </button>
              </li>
            );
          })}
          {candidates.length === 0 && elsewhere.length === 0 && (
            <li className="py-2 text-[13px] text-paper-muted">
              {query ? `No comparison data for “${query}” yet.` : "Nothing more to add."}
            </li>
          )}
          {elsewhere.map((t) => (
            <li key={t.entryId}>
              <button
                type="button"
                onClick={() => {
                  switchClass(t.layer, [t.entryId]);
                  setQuery("");
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dashed border-hairline-strong px-4 text-[14px] text-paper-muted hover:text-paper"
              >
                {t.title}
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">in {classes[t.layer]}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {picked.length === 0 ? (
        <p className="mt-10 max-w-md pb-4 text-paper-muted">Choose two to five tools above to see how they differ.</p>
      ) : (
        <section aria-label="Comparison" className="mt-5">
          <label className="mb-4 inline-flex min-h-11 cursor-pointer items-center gap-2 text-[14px] text-paper-muted">
            <input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} className="h-4 w-4 accent-[#2ec4b6]" />
            Show only rows that differ
          </label>
          <div className="rounded-2xl border border-hairline">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead className="sticky top-0 z-20 bg-ink">
                <tr className="border-b border-hairline">
                  <th scope="col" className="sticky left-0 z-30 w-32 bg-ink p-3 md:w-48"><span className="sr-only">Feature</span></th>
                  {picked.map((t) => (
                    <th key={t.entryId} scope="col" className="min-w-[150px] p-3 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-serif text-xl leading-tight text-paper">{t.title}</p>
                          <p className="mt-1 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-paper-faint">as of {t.asOf}</p>
                        </div>
                        <button type="button" aria-label={`Remove ${t.title}`} onClick={() => toggle(t.entryId)} className="-m-2 flex h-10 w-10 items-center justify-center rounded-full text-paper-faint hover:text-paper">
                          <X size={14} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {groups.map((g) => (
                <tbody key={g.group}>
                  <tr><th colSpan={picked.length + 1} scope="colgroup" className="sticky left-0 bg-ink-raised px-3 py-2 font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-paper-faint">{g.group}</th></tr>
                  {g.rows.map((d) => (
                    <tr key={d.id} className="border-t border-hairline align-top">
                      <th scope="row" className="sticky left-0 z-10 bg-ink p-3 text-[13px] font-normal text-paper-muted">
                        {d.label}
                        {d.kind === "stars" && <span className="mt-1 block text-[11px] leading-snug text-paper-faint">{STAR_RUBRIC[d.id]}</span>}
                      </th>
                      {picked.map((t) => {
                        const cell = t.cells[d.id];
                        const synthetic = d.id === KIND_ROW.id || d.id === SEGMENT_ROW.id;
                        const applies = synthetic || dimensionsFor(t.class).some((x) => x.id === d.id);
                        return (
                          <td key={t.entryId} className="p-3">
                            {synthetic ? <span className="text-[14px] text-paper">{d.id === SEGMENT_ROW.id ? t.segment : kinds[t.class] ?? t.class}</span> : applies ? <Value dim={d} cell={cell} /> : <span className="text-[13px] text-paper-faint" title="This row does not apply to this kind of tool">n/a</span>}
                            {cell?.note && (
                              <p className="mt-1 text-[12px] leading-snug text-paper-faint">
                                {cell.note}
                                {cell.src && <> · <a href={cell.src} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-paper">source</a></>}
                              </p>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <p className="mt-4 text-[13px] text-paper-faint">
            {hidden > 0 && <>{hidden} row{hidden > 1 ? "s" : ""} hidden because only one of these tools has {hidden > 1 ? "them" : "it"}. </>}
            Ratings are editorial and given only where the docs give evidence. Sources:{" "}
            {picked.flatMap((t) => t.sources.map((s) => [t.title, s] as const)).map(([title, s], i) => (
              <a key={s + i} href={s} target="_blank" rel="noreferrer" className="mr-3 underline underline-offset-2 hover:text-paper">{title}</a>
            ))}
          </p>
        </section>
      )}
    </>
  );
}
