import { Bubble, Bush, C, Cloud, Person, S, Traveller } from "./kit";

const W = 1200;
const H = 520;
const F = { fontFamily: "var(--font-fredoka)", fontWeight: 700 } as const;
const B = { fontFamily: "var(--font-nunito)", fontWeight: 700 } as const;

/** The three requests that recur in every era, each with that era's answer. */
function Requests({ y, answers, dark = false }: { y: number; answers: { ask: string; answer: React.ReactNode; ok: "yes" | "meh" | "no" }[]; dark?: boolean }) {
  const tone = { yes: C.teal, meh: C.orange, no: C.coral };
  return (
    <g>
      {answers.map((a, i) => (
        <g key={a.ask} transform={`translate(${40 + i * 380} ${y})`}>
          <rect width={350} height={96} rx={16} fill={dark ? "#223663" : "#fff"} {...S} />
          <text x={16} y={26} {...F} fontSize={15} fill={dark ? "#bcd0ff" : "#6b6f86"}>
            “{a.ask}”
          </text>
          <circle cx={326} cy={22} r={10} fill={tone[a.ok]} {...S} strokeWidth={2.5} />
          <g transform="translate(16 44)">{a.answer}</g>
        </g>
      ))}
    </g>
  );
}

function Ground({ color, road = true }: { color: string; road?: boolean }) {
  return (
    <g>
      <rect y={372} width={W} height={H - 372} fill={color} stroke={C.ink} strokeWidth={3} />
      {road && (
        <g>
          <rect y={380} width={W} height={34} fill={C.road} stroke={C.ink} strokeWidth={3} />
          <path d={`M0 397 H${W}`} stroke="#fff" strokeWidth={3} strokeDasharray="18 16" />
        </g>
      )}
    </g>
  );
}

/** 2026 — agents act across media. */
export function AgentCity() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="2026 agent city concept">
      <rect width={W} height={H} fill={C.sky} />
      <circle cx={1080} cy={70} r={34} fill={C.sun} {...S} />
      <Cloud x={120} y={40} />
      <Cloud x={520} y={20} s={0.8} />
      {/* skyline */}
      {[
        [60, 170, 90, C.blue], [170, 120, 80, C.pink], [270, 200, 70, C.teal], [360, 90, 110, "#fff"],
        [500, 150, 90, C.orange], [610, 110, 70, C.blue], [700, 190, 120, C.teal], [840, 140, 90, C.pink], [950, 100, 100, "#fff"],
      ].map(([x, y, w, fill], i) => (
        <g key={i}>
          <rect x={x as number} y={y as number} width={w as number} height={372 - (y as number)} fill={fill as string} {...S} />
          {Array.from({ length: Math.floor((372 - (y as number) - 20) / 30) }).map((_, r) =>
            Array.from({ length: Math.floor((w as number) / 26) }).map((__, c) => (
              <rect key={`${r}-${c}`} x={(x as number) + 10 + c * 26} y={(y as number) + 14 + r * 30} width={14} height={16} rx={3} fill={(r + c + i) % 5 === 0 ? C.sun : "#dff4ff"} stroke={C.ink} strokeWidth={2} />
            )),
          )}
        </g>
      ))}
      {/* studio sign: film + music being generated */}
      <g transform="translate(372 58)">
        <rect width={86} height={28} rx={8} fill={C.coral} {...S} />
        <text x={43} y={20} textAnchor="middle" {...F} fontSize={14} fill="#fff">STUDIO</text>
      </g>
      {/* delivery drones */}
      {[[260, 70], [760, 60]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M-26 0 h52" {...S} />
          <ellipse cx={-26} cy={-4} rx={12} ry={3} fill="#fff" {...S} strokeWidth={2} />
          <ellipse cx={26} cy={-4} rx={12} ry={3} fill="#fff" {...S} strokeWidth={2} />
          <rect x={-10} y={0} width={20} height={10} rx={4} fill={C.ink} />
          <path d="M0 10 v10" {...S} strokeWidth={2} />
          <rect x={-9} y={20} width={18} height={14} fill={C.dirt} {...S} strokeWidth={2.5} />
        </g>
      ))}
      {/* cutaway desk: a desktop agent sorting files */}
      <Bubble x={640} y={230} w={200} h={70}>
        <text x={14} y={24} {...B} fontSize={12.5} fill={C.ink}>Sorted 214 files into</text>
        <text x={14} y={42} {...B} fontSize={12.5} fill={C.ink}>7 folders · drafted 3 replies</text>
      </Bubble>
      <Ground color={C.grass} />
      <Bush x={30} y={352} />
      <Bush x={1110} y={352} />
      <Traveller x={600} y={392} stage={4} s={1.2} />
      <Requests
        y={420}
        answers={[
          { ask: "Draw a cat", ok: "yes", answer: <text {...B} fontSize={13} fill={C.ink}>A 10-second cat video, with sound.</text> },
          { ask: "Translate this sentence", ok: "yes", answer: <text {...B} fontSize={13} fill={C.ink}>Live, spoken, in your own voice.</text> },
          { ask: "Book my flight", ok: "yes", answer: <text {...B} fontSize={13} fill={C.ink}>Booked. Receipt filed. Calendar updated.</text> },
        ]}
      />
    </svg>
  );
}

/** Nov 30, 2022 — one chat window, text only. */
export function LaunchNight() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="ChatGPT launch night 2022 concept">
      <rect width={W} height={H} fill={C.night} />
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={(i * 137) % W} cy={20 + ((i * 53) % 200)} r={i % 3 ? 2 : 3} fill="#fff" />
      ))}
      <circle cx={140} cy={80} r={30} fill="#fff4c2" {...S} />
      {/* dark town, one lit building */}
      {[[40, 230, 120], [180, 200, 100], [820, 210, 120], [960, 240, 110], [1080, 190, 100]].map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height={372 - y} fill={C.nightDeep} {...S} />
      ))}
      <rect x={380} y={110} width={400} height={262} rx={10} fill="#fffdf5" {...S} />
      <rect x={400} y={128} width={360} height={30} rx={8} fill={C.teal} {...S} strokeWidth={2.5} />
      <text x={416} y={149} {...F} fontSize={15} fill="#fff">Chat · research preview</text>
      <Bubble x={410} y={172} w={250} h={46} fill="#eef3ff">
        <text x={14} y={28} {...B} fontSize={13} fill={C.ink}>Write a poem about my cat</text>
      </Bubble>
      <Bubble x={480} y={236} w={270} h={64} fill="#e8fbf6">
        <text x={14} y={26} {...B} fontSize={13} fill={C.ink}>In sunlit naps and midnight chase,</text>
        <text x={14} y={44} {...B} fontSize={13} fill={C.ink}>a velvet king patrols his space…</text>
      </Bubble>
      <path d="M420 350 h120" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      <rect x={544} y={340} width={3} height={16} fill={C.ink} className="animate-pulse" />
      <Ground color="#2f6b43" />
      {/* the queue */}
      {Array.from({ length: 11 }).map((_, i) => (
        <Person key={i} x={880 - i * 44} y={376} shirt={[C.pink, C.orange, C.blue, C.teal, C.sun][i % 5]} s={0.9} flip={i % 2 === 1} />
      ))}
      <Traveller x={300} y={392} stage={3} s={1.15} />
      <Requests
        dark
        y={420}
        answers={[
          { ask: "Draw a cat", ok: "meh", answer: <text {...B} fontSize={13} fill="#fff">Text only. It can type /\_/\ ( o.o ).</text> },
          { ask: "Translate this sentence", ok: "yes", answer: <text {...B} fontSize={13} fill="#fff">Fluent, and it explains the grammar.</text> },
          { ask: "Book my flight", ok: "no", answer: <text {...B} fontSize={13} fill="#fff">“I can&apos;t browse the internet.”</text> },
        ]}
      />
    </svg>
  );
}

/** May 1997 — Deep Blue beats the world champion by searching, not learning. */
export function DeepBlueHall() {
  const board = Array.from({ length: 64 });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Deep Blue 1997 chess hall concept">
      <rect width={W} height={H} fill="#f7e7c9" />
      {/* hall walls, banner */}
      <rect x={0} y={0} width={W} height={70} fill={C.brick} stroke={C.ink} strokeWidth={3} />
      <rect x={430} y={16} width={340} height={40} rx={10} fill="#fff" {...S} />
      <text x={600} y={43} textAnchor="middle" {...F} fontSize={18} fill={C.ink}>1997 · MAN VS MACHINE REMATCH</text>
      {/* spotlights */}
      <path d="M300 70 L200 372 L420 372 Z" fill="rgba(255,238,170,0.55)" />
      <path d="M900 70 L780 372 L1000 372 Z" fill="rgba(255,238,170,0.55)" />
      {/* demo board */}
      <g transform="translate(500 92)">
        <rect x={-8} y={-8} width={216} height={216} rx={8} fill={C.ink} />
        {board.map((_, i) => (
          <rect key={i} x={(i % 8) * 25} y={Math.floor(i / 8) * 25} width={25} height={25} fill={(i + Math.floor(i / 8)) % 2 ? "#8a5a3c" : "#f3dcb2"} />
        ))}
        <text x={62} y={70} {...F} fontSize={22} fill={C.ink}>♞</text>
        <text x={137} y={145} {...F} fontSize={22} fill="#fff">♛</text>
      </g>
      {/* player and the machine */}
      <rect x={180} y={300} width={260} height={16} rx={4} fill="#8a5a3c" {...S} />
      <Person x={250} y={300} shirt={C.ink} s={1.3} />
      <g transform="translate(860 190)">
        <rect width={110} height={182} rx={8} fill="#1f2d57" {...S} />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={14} y={16 + i * 19} width={82} height={10} rx={3} fill={i % 3 ? "#38508f" : C.sun} stroke={C.ink} strokeWidth={2} />
        ))}
        <text x={55} y={-10} textAnchor="middle" {...F} fontSize={15} fill={C.ink}>200M positions/sec</text>
      </g>
      <Ground color="#c98d5b" road={false} />
      {/* audience */}
      {Array.from({ length: 16 }).map((_, i) => (
        <Person key={i} x={70 + i * 70} y={410} shirt={[C.blue, C.coral, C.teal, C.orange][i % 4]} s={0.85} />
      ))}
      <Traveller x={640} y={404} stage={2} s={1.1} />
      <Requests
        y={420}
        answers={[
          { ask: "Draw a cat", ok: "no", answer: <text {...B} fontSize={13} fill={C.ink}>No. It can only play chess.</text> },
          { ask: "Translate this sentence", ok: "meh", answer: <text {...B} fontSize={13} fill={C.ink}>Rule-based, word by word, often clumsy.</text> },
          { ask: "Book my flight", ok: "no", answer: <text {...B} fontSize={13} fill={C.ink}>Call the airline. Press 1.</text> },
        ]}
      />
    </svg>
  );
}

/** The same request, travelling back: "Draw a cat". */
export function CatEcho() {
  const panels: { when: string; caption: string; draw: React.ReactNode; bg: string }[] = [
    {
      when: "2026",
      caption: "A cat video, with sound",
      bg: C.sky,
      draw: (
        <g>
          <rect x={20} y={20} width={140} height={100} rx={10} fill="#fff" {...S} />
          <path d="M60 104 q30 -60 60 0 z" fill={C.orange} {...S} />
          <circle cx={90} cy={58} r={22} fill={C.orange} {...S} />
          <path d="M72 44 l-6 -16 l14 10 M108 44 l6 -16 l-14 10" fill={C.orange} {...S} />
          <circle cx={82} cy={58} r={3} fill={C.ink} />
          <circle cx={98} cy={58} r={3} fill={C.ink} />
          <path d="M140 30 l12 8 l-12 8 z" fill={C.coral} {...S} strokeWidth={2} />
        </g>
      ),
    },
    {
      when: "2022",
      caption: "Close. Check the paws.",
      bg: "#e9f7ff",
      draw: (
        <g>
          <path d="M50 110 q40 -70 80 0 z" fill="#b9b1a6" {...S} />
          <circle cx={90} cy={56} r={24} fill="#b9b1a6" {...S} />
          <path d="M70 40 l-6 -18 l16 12 M110 40 l6 -18 l-16 12" fill="#b9b1a6" {...S} />
          <circle cx={81} cy={56} r={3} fill={C.ink} />
          <circle cx={99} cy={56} r={3} fill={C.ink} />
          {[56, 70, 84, 98, 112, 126].map((x) => (
            <ellipse key={x} cx={x} cy={112} rx={6} ry={4} fill="#b9b1a6" {...S} strokeWidth={2} />
          ))}
        </g>
      ),
    },
    {
      when: "2015",
      caption: "DeepDream: eyes everywhere",
      bg: "#fde7f1",
      draw: (
        <g>
          <circle cx={90} cy={68} r={46} fill="#c7a0ff" {...S} />
          {[[70, 50], [106, 48], [88, 78], [60, 86], [118, 84], [90, 34]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={8} fill="#fff" {...S} strokeWidth={2} />
              <circle cx={x} cy={y} r={3} fill={C.ink} />
            </g>
          ))}
        </g>
      ),
    },
    {
      when: "2012",
      caption: "Found a “cat neuron”, blurry",
      bg: "#eef1f5",
      draw: (
        <g>
          {Array.from({ length: 49 }).map((_, i) => {
            const x = i % 7;
            const y = Math.floor(i / 7);
            const d = Math.hypot(x - 3, y - 3.2);
            return <rect key={i} x={48 + x * 12} y={26 + y * 12} width={12} height={12} fill={`rgba(38,40,59,${Math.max(0.08, 0.8 - d * 0.2)})`} />;
          })}
          <path d="M60 30 l10 -14 l6 14 M108 30 l10 -14 l6 14" fill="rgba(38,40,59,0.6)" />
        </g>
      ),
    },
    {
      when: "1958",
      caption: "Perceptron: shapes, not cats",
      bg: "#fff3d6",
      draw: (
        <g>
          <rect x={40} y={30} width={100} height={70} rx={6} fill="#d9d2c3" {...S} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={58 + i * 22} cy={52} r={7} fill={i === 1 ? C.sun : "#8e8778"} {...S} strokeWidth={2} />
          ))}
          <text x={90} y={88} textAnchor="middle" {...F} fontSize={14} fill={C.ink}>LEFT? RIGHT?</text>
        </g>
      ),
    },
    {
      when: "Stone age",
      caption: "A human drew it",
      bg: "#e7c9a3",
      draw: (
        <g>
          <path d="M40 110 q10 -80 100 -84 q30 40 10 84 z" fill="#caa27a" {...S} />
          <path d="M70 90 q20 -20 40 0 M76 74 q14 -14 28 0 M78 66 l-4 -10 l8 6 M102 66 l4 -10 l-8 6 M110 88 q14 4 10 -16" fill="none" stroke="#7a3b1c" strokeWidth={4} strokeLinecap="round" />
        </g>
      ),
    },
  ];
  return (
    <svg viewBox={`0 0 ${W} 250`} className="block h-auto w-full" role="img" aria-label="The same request, Draw a cat, answered in six eras">
      <rect width={W} height={250} fill={C.cream} />
      {panels.map((p, i) => (
        <g key={p.when} transform={`translate(${14 + i * 197} 14)`}>
          <rect width={183} height={222} rx={16} fill={p.bg} {...S} />
          <g transform="translate(2 18)">{p.draw}</g>
          <rect x={10} y={10} width={p.when.length * 9 + 18} height={24} rx={8} fill="#fff" {...S} strokeWidth={2.5} />
          <text x={19} y={27} {...F} fontSize={14} fill={C.ink}>{p.when}</text>
          <text x={92} y={176} textAnchor="middle" {...B} fontSize={12.5} fill={C.ink}>{p.caption}</text>
          {i < panels.length - 1 && <path d={`M190 ${111} l10 0`} {...S} />}
        </g>
      ))}
    </svg>
  );
}

/** The traveller devolving as you walk back in time. */
export function TravellerLineup() {
  const stages: { stage: 0 | 1 | 2 | 3 | 4; label: string }[] = [
    { stage: 4, label: "2026 agent" },
    { stage: 3, label: "2022 chatbot" },
    { stage: 2, label: "1980s terminal" },
    { stage: 1, label: "1800s automaton" },
    { stage: 0, label: "Campfire human" },
  ];
  return (
    <svg viewBox="0 0 1200 220" className="block h-auto w-full" role="img" aria-label="The evolving traveller in five stages">
      <rect width={1200} height={220} fill={C.sky} />
      <rect y={160} width={1200} height={60} fill={C.grass} stroke={C.ink} strokeWidth={3} />
      <path d="M60 172 H1140" stroke={C.dirt} strokeWidth={14} strokeLinecap="round" />
      {stages.map((s, i) => (
        <g key={s.stage}>
          <Traveller x={140 + i * 230} y={170} stage={s.stage} s={1.5} />
          <text x={140 + i * 230} y={206} textAnchor="middle" {...F} fontSize={16} fill={C.ink}>{s.label}</text>
        </g>
      ))}
    </svg>
  );
}
