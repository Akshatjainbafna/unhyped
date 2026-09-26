import {
  Brain, ChatCircleText, Code, Cpu, Database, Eye, FilmSlate, FlowArrow, GameController, Gauge,
  Graph, HardDrives, Lightbulb, Plug, Robot, ShieldCheck, Sparkle, SpeakerHigh, Stack, TreeStructure,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import entries from "../../../data/entries.json";
import { C } from "@/components/concepts/kit";
import { Overworld, type MonthStop } from "@/components/concepts/Overworld";
import { AgentCity, CatEcho, DeepBlueHall, LaunchNight, TravellerLineup } from "@/components/concepts/Scenes";
import type { Entry } from "@/lib/schema";
import { SEGMENT_GROUPS, SEGMENTS, type SegmentId } from "@/lib/taxonomy";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["500", "600", "700"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = { title: "Unhyped v2 · Concept board", robots: { index: false } };

const GROUPS = Object.keys(SEGMENT_GROUPS) as (keyof typeof SEGMENT_GROUPS)[];
const groupOf = (s: SegmentId) => GROUPS.findIndex((g) => (SEGMENT_GROUPS[g] as readonly string[]).includes(s));

/** Real launches + major updates per month for the last twelve months. */
function lastTwelveMonths(): MonthStop[] {
  const months = new Map<string, { groups: number[]; items: { label: string; group: number }[] }>();
  const add = (date: string, seg: SegmentId, label: string) => {
    const k = date.slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(k)) return;
    const m = months.get(k) ?? { groups: [0, 0, 0, 0], items: [] };
    m.groups[groupOf(seg)] += 1;
    m.items.push({ label, group: groupOf(seg) });
    months.set(k, m);
  };
  for (const e of entries as Entry[]) {
    if (e.type !== "person") add(e.date, e.primarySegment, e.title);
    for (const u of e.majorUpdates ?? []) add(u.date, e.primarySegment, `${e.title}: ${u.title}`);
  }
  const keys = [...months.keys()].filter((k) => k <= "2026-09").sort().slice(-12);
  return keys.map((k) => {
    const m = months.get(k)!;
    const label = new Date(`${k}-01T00:00:00Z`).toLocaleString("en", { month: "short", year: "2-digit", timeZone: "UTC" }).replace(" ", " '");
    return { key: k, label, total: m.items.length, groups: m.groups, items: m.items };
  });
}

const SEGMENT_STYLE: Record<SegmentId, { color: string; Icon: typeof Brain }> = {
  "symbolic-logic": { color: "#ff9f43", Icon: TreeStructure },
  "classical-ml": { color: "#ffb86b", Icon: Gauge },
  "neural-deep-learning": { color: "#ffcf5c", Icon: Brain },
  vision: { color: "#4d8dff", Icon: Eye },
  language: { color: "#6aa9ff", Icon: ChatCircleText },
  "speech-audio": { color: "#8ec5ff", Icon: SpeakerHigh },
  "rl-games": { color: "#3d74e0", Icon: GameController },
  "generative-media": { color: "#9b7bff", Icon: FilmSlate },
  "robotics-embodied": { color: "#5aa0c9", Icon: Robot },
  "foundation-models": { color: "#2ec4b6", Icon: Sparkle },
  "coding-agents": { color: "#1fa89b", Icon: Code },
  "personal-agents": { color: "#4fd6c2", Icon: Robot },
  "agent-frameworks": { color: "#20b486", Icon: Stack },
  "llmops-eval": { color: "#67c587", Icon: Gauge },
  "local-runtimes": { color: "#3fb8a6", Icon: HardDrives },
  "workflow-lowcode": { color: "#7ad3a1", Icon: FlowArrow },
  protocols: { color: "#16a0a0", Icon: Plug },
  "vector-rag": { color: "#5cc7b8", Icon: Database },
  "compute-hardware": { color: "#ff8fb1", Icon: Cpu },
  "safety-alignment": { color: "#ff6b8a", Icon: ShieldCheck },
};

function Frame({ n, title, judge, children }: { n: string; title: string; judge: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-[family-name:var(--font-fredoka)] text-3xl font-bold text-[#26283b]">
          <span className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-[#26283b] bg-[#ffd23f] text-lg">{n}</span>
          {title}
        </h2>
        <p className="max-w-[46ch] text-[15px] font-semibold text-[#55597a]">{judge}</p>
      </div>
      <div className="overflow-hidden rounded-[22px] border-[3px] border-[#26283b] shadow-[0_8px_0_#26283b]">{children}</div>
    </section>
  );
}

export default function Concepts() {
  const stops = lastTwelveMonths();
  return (
    <div className={`${fredoka.variable} ${nunito.variable} min-h-[100dvh] bg-[#fff8ea] font-[family-name:var(--font-nunito)] text-[#26283b]`}>
      <main className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <p className="inline-block rounded-full border-[3px] border-[#26283b] bg-white px-4 py-1 font-[family-name:var(--font-fredoka)] font-semibold">Unhyped v2 · concept board</p>
        <h1 className="mt-5 max-w-[20ch] font-[family-name:var(--font-fredoka)] text-5xl font-bold leading-[1.02] md:text-6xl">A game map of everything AI shipped.</h1>
        <p className="mt-4 max-w-[62ch] text-lg font-semibold text-[#55597a]">
          Flat, bright, one ink outline. Pick what works per frame. Scene details are illustrative; the month counts are real data from the dataset.
        </p>

        <Frame n="1" title="The overworld: one stop per month" judge="Stop number = launches and major updates that month; houses are coloured by segment family. Is the density readable at a glance?">
          <Overworld stops={stops} />
        </Frame>

        <Frame n="2" title="2026 · Agent city" judge="Agents act across media. Does the scene say what AI can do now, without text?">
          <AgentCity />
        </Frame>

        <Frame n="3" title="Nov 2022 · Launch night" judge="One glowing chat window, text only, a queue around the block.">
          <LaunchNight />
        </Frame>

        <Frame n="4" title="1997 · The chess hall" judge="Deep Blue won by brute-force search, not learning. The traveller is now a boxy terminal robot.">
          <DeepBlueHall />
        </Frame>

        <Frame n="5" title="The same request, back through time" judge="“Draw a cat” in six eras: the emotional through-line. The strip can also run along the bottom of the map.">
          <CatEcho />
        </Frame>

        <Frame n="6" title="The evolving traveller" judge="Walking back in time devolves the character.">
          <TravellerLineup />
        </Frame>

        <section className="mt-16">
          <h2 className="font-[family-name:var(--font-fredoka)] text-3xl font-bold">7 · Segments: colour + icon, four lane families</h2>
          <p className="mt-2 max-w-[62ch] font-semibold text-[#55597a]">
            The road has four lanes (one per family). An entry&apos;s marker takes its segment colour and icon, and its real logo when one exists; the marker <em>shape</em> shows the type.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {GROUPS.map((g) => (
              <div key={g} className="rounded-[20px] border-[3px] border-[#26283b] bg-white p-5 shadow-[0_6px_0_#26283b]">
                <h3 className="font-[family-name:var(--font-fredoka)] text-xl font-bold">{g}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {(SEGMENT_GROUPS[g] as readonly SegmentId[]).map((s) => {
                    const { color, Icon } = SEGMENT_STYLE[s];
                    return (
                      <li key={s} className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-[#26283b] py-1 pl-1 pr-3 text-sm font-bold" style={{ background: `${color}33` }}>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#26283b]" style={{ background: color }}>
                          <Icon size={16} weight="bold" color={C.ink} />
                        </span>
                        {SEGMENTS[s]}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 font-[family-name:var(--font-fredoka)] font-semibold">
            {[
              ["Product", "rounded-full"],
              ["Model", "rounded-lg rotate-45 scale-75"],
              ["Paper", "rounded-sm"],
              ["Open-source repo", "rounded-md"],
              ["Event", "[clip-path:polygon(50%_0,100%_100%,0_100%)]"],
            ].map(([label, shape]) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-[#26283b] bg-white px-3 py-1.5">
                <span className={`inline-block h-4 w-4 border-2 border-[#26283b] bg-[#2ec4b6] ${shape}`} /> {label}
              </span>
            ))}
            <span className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-[#26283b] bg-white px-3 py-1.5">
              <Lightbulb size={16} weight="bold" /> Real logos via Simple Icons; lettered badge when missing
            </span>
          </div>
        </section>
        <p className="mt-16 text-sm font-semibold text-[#55597a]">
          Also in this direction: a 2D ↔ 3D toggle like Google Maps (the current cinematic road becomes the 3D view), and all 15 storyboard scenes. <Graph className="inline" size={14} />
        </p>
      </main>
    </div>
  );
}
