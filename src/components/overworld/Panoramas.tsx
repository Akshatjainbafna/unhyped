import { Bubble, C, Cloud, Person, S } from "../concepts/kit";
import type { CatKind } from "./Cats";

/**
 * The 13 era landscapes the road travels through (futures and campfire are
 * drawn by the map). Each is a full-width panorama: sky, then landmarks
 * standing on a horizon at y=330 in a 1200×380 frame; the ground colour then
 * carries on under the road until the next era.
 */
export type Answer = { text: string; ok: "yes" | "meh" | "no" };
export type Panorama = {
  id: string;
  at: number; // era boundary: placed before the first stop that ends on or before it
  title: string;
  when: string;
  line: string; // what AI could demonstrably do here
  sky: [string, string]; // top, horizon
  ground: string;
  mist: string; // the era's atmosphere; blends continuously into the next era's
  hill: string; // soft land the landmarks stand on, fading into the mist
  night?: boolean;
  stage: 0 | 1 | 2 | 3 | 4;
  answers: [Answer, Answer, Answer]; // Draw a cat · Translate this sentence · Book my flight
  cat: CatKind; // what "Draw a cat" looked like in this era
  Art: () => React.ReactElement;
};

const F = { fontFamily: "var(--font-fredoka)", fontWeight: 700 } as const;
const HZ = 330;

function Building({ x, w, h, fill, rows = true, lit = C.sun, win = "#dff4ff" }: { x: number; w: number; h: number; fill: string; rows?: boolean; lit?: string; win?: string }) {
  const y = HZ - h;
  const cols = Math.max(1, Math.floor((w - 12) / 24));
  const rs = Math.max(0, Math.floor((h - 26) / 28));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} {...S} />
      {rows &&
        Array.from({ length: rs }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => (
            <rect key={`${r}-${c}`} x={x + 9 + c * 24} y={y + 12 + r * 28} width={13} height={15} rx={3} fill={(r * 3 + c + x) % 7 === 0 ? lit : win} stroke={C.ink} strokeWidth={2} />
          )),
        )}
    </g>
  );
}

function Tree({ x, s = 1, fill = C.grassDark }: { x: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${HZ}) scale(${s})`}>
      <rect x={-5} y={-26} width={10} height={26} fill="#9a6b3f" {...S} />
      <circle cx={0} cy={-44} r={24} fill={fill} {...S} />
    </g>
  );
}

function Snow({ n = 40, seed = 1 }: { n?: number; seed?: number }) {
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} cx={(i * 97 * seed) % 1200} cy={20 + ((i * 53 * seed) % 290)} r={i % 3 ? 3 : 4.5} fill="#fff" stroke={C.ink} strokeWidth={1.2} />
      ))}
    </g>
  );
}

function Sign({ x, y, w, text, fill = "#fff", color = C.ink, size = 16 }: { x: number; y: number; w: number; text: string; fill?: string; color?: string; size?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={size + 16} rx={8} fill={fill} {...S} />
      <text x={w / 2} y={size + 5} textAnchor="middle" {...F} fontSize={size} fill={color}>{text}</text>
    </g>
  );
}

// 2026 · agents act across media
function AgentCityArt() {
  return (
    <g>
      <circle cx={1090} cy={70} r={34} fill={C.sun} {...S} />
      <Cloud x={140} y={40} />
      <Cloud x={620} y={24} s={0.8} />
      {[[40, 90, C.blue, 190], [140, 80, C.pink, 240], [230, 70, C.teal, 160], [310, 110, "#fff", 270], [430, 90, C.orange, 200], [530, 70, C.blue, 250], [610, 120, C.teal, 180], [740, 90, C.pink, 230], [840, 110, "#fff", 280], [960, 80, C.orange, 190], [1050, 110, C.blue, 240]].map(([x, w, f, h], i) => (
        <Building key={i} x={x as number} w={w as number} h={h as number} fill={f as string} />
      ))}
      <Sign x={320} y={42} w={90} text="STUDIO" fill={C.coral} color="#fff" size={14} />
      {[[270, 70], [780, 56], [1000, 110]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M-26 0 h52" {...S} />
          <ellipse cx={-26} cy={-4} rx={12} ry={3} fill="#fff" {...S} strokeWidth={2} />
          <ellipse cx={26} cy={-4} rx={12} ry={3} fill="#fff" {...S} strokeWidth={2} />
          <rect x={-10} y={0} width={20} height={10} rx={4} fill={C.ink} />
          <path d="M0 10 v10" {...S} strokeWidth={2} />
          <rect x={-9} y={20} width={18} height={14} fill={C.dirt} {...S} strokeWidth={2.5} />
        </g>
      ))}
      <Bubble x={610} y={150} w={210} h={62}>
        <text x={14} y={24} fontFamily="var(--font-nunito)" fontWeight={800} fontSize={13} fill={C.ink}>Sorted 214 files into 7 folders</text>
        <text x={14} y={42} fontFamily="var(--font-nunito)" fontWeight={800} fontSize={13} fill={C.ink}>and drafted 3 replies</text>
      </Bubble>
    </g>
  );
}

// 2025 · models that reason; agents that work for hours
function ReasoningArt() {
  return (
    <g>
      <Cloud x={80} y={40} />
      <Cloud x={900} y={50} s={0.9} />
      {/* olympiad podium */}
      <g transform="translate(120 190)">
        <rect x={0} y={60} width={70} height={80} fill="#c0c7d6" {...S} />
        <rect x={70} y={20} width={80} height={120} fill={C.sun} {...S} />
        <rect x={150} y={80} width={70} height={60} fill="#e39b5b" {...S} />
        <text x={110} y={80} textAnchor="middle" {...F} fontSize={34} fill={C.ink}>1</text>
        <circle cx={110} cy={-6} r={18} fill={C.sun} {...S} />
        <path d="M100 -22 l10 -24 l10 24" fill="none" stroke={C.coral} strokeWidth={5} />
        <Sign x={30} y={-78} w={160} text="MATH OLYMPIAD" size={14} />
      </g>
      {/* self-solving whiteboard */}
      <g transform="translate(420 110)">
        <rect width={300} height={200} rx={10} fill="#fff" {...S} />
        <path d="M-10 200 h320" {...S} />
        <text x={24} y={44} fontFamily="var(--font-geist-mono), monospace" fontSize={17} fill={C.ink}>∫ x·e^x dx = ?</text>
        <text x={24} y={80} fontFamily="var(--font-geist-mono), monospace" fontSize={15} fill={C.blue}>= x·e^x − ∫ e^x dx</text>
        <text x={24} y={112} fontFamily="var(--font-geist-mono), monospace" fontSize={15} fill={C.blue}>= e^x (x − 1) + C</text>
        <rect x={24} y={134} width={120} height={30} rx={8} fill={C.teal} {...S} strokeWidth={2.5} />
        <text x={84} y={155} textAnchor="middle" {...F} fontSize={14} fill="#fff">checked ✓</text>
      </g>
      {/* terminal building with an agent working for hours */}
      <g transform="translate(800 120)">
        <rect width={300} height={210} fill={C.ink} {...S} />
        <rect x={20} y={20} width={260} height={140} rx={8} fill="#1b2340" stroke="#5a6aa0" strokeWidth={2} />
        {["$ agent run --task migrate", "✓ 41 files updated", "✓ tests passing (312)", "→ opening pull request"].map((t, i) => (
          <text key={t} x={34} y={48 + i * 28} fontFamily="var(--font-geist-mono), monospace" fontSize={14} fill={i ? "#7ee3b0" : "#fff"}>{t}</text>
        ))}
        <circle cx={250} cy={188} r={16} fill="#fff" {...S} />
        <path d="M250 178 v10 l7 5" {...S} strokeWidth={2.5} />
        <text x={180} y={194} textAnchor="end" {...F} fontSize={13} fill="#fff">3h 12m</text>
      </g>
      <Tree x={60} s={0.9} />
      <Tree x={1140} s={1.1} />
    </g>
  );
}

// 2024 · video, music and images from a sentence
function MediaStudiosArt() {
  return (
    <g>
      <Cloud x={200} y={36} />
      <Cloud x={980} y={30} s={0.8} />
      {/* sound stage */}
      <g transform="translate(60 110)">
        <path d="M0 220 V40 q170 -70 340 0 V220 z" fill="#f4efe4" {...S} />
        <Sign x={100} y={70} w={140} text="STAGE 7" fill={C.coral} color="#fff" />
        <rect x={130} y={130} width={80} height={90} fill={C.ink} {...S} />
      </g>
      {/* camera and clapperboard */}
      <g transform="translate(460 190)">
        <rect x={0} y={20} width={110} height={70} rx={10} fill={C.ink} {...S} />
        <circle cx={25} cy={10} r={20} fill="#fff" {...S} />
        <circle cx={80} cy={8} r={22} fill="#fff" {...S} />
        <rect x={110} y={38} width={40} height={32} fill="#57607a" {...S} />
        <path d="M40 90 l-20 50 M70 90 l20 50 M55 90 v50" {...S} />
      </g>
      <g transform="translate(660 210)">
        <rect x={0} y={24} width={120} height={80} rx={6} fill={C.ink} {...S} />
        <path d="M0 24 l120 -22 l6 20 l-126 22 z" fill="#fff" {...S} />
        <path d="M20 20 l12 -14 M50 14 l12 -14 M80 8 l12 -14" stroke={C.ink} strokeWidth={6} />
        <text x={60} y={74} textAnchor="middle" {...F} fontSize={16} fill="#fff">TAKE 1</text>
      </g>
      {/* music booth with notes */}
      <g transform="translate(860 120)">
        <rect width={260} height={210} rx={12} fill={C.teal} {...S} />
        <rect x={24} y={24} width={212} height={110} rx={10} fill="#fff" {...S} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x={40 + i * 24} y={110 - ((i * 37) % 70) - 10} width={14} height={((i * 37) % 70) + 10} rx={4} fill={C.blue} stroke={C.ink} strokeWidth={2} />
        ))}
        <text x={130} y={170} textAnchor="middle" {...F} fontSize={18} fill={C.ink}>♪ generated track</text>
      </g>
      {[[400, 90], [440, 60], [820, 80]].map(([x, y], i) => (
        <text key={i} x={x} y={y} {...F} fontSize={34} fill={C.ink}>♪</text>
      ))}
    </g>
  );
}

// 2023 · a chat assistant in every window
function ChatbotTowersArt() {
  return (
    <g>
      <Cloud x={100} y={30} />
      <Cloud x={760} y={40} s={0.9} />
      {[[40, 150, "#fff", 240], [200, 130, C.blue, 280], [340, 120, "#fff", 220], [760, 140, C.teal, 260], [910, 130, "#fff", 300], [1050, 120, C.blue, 230]].map(([x, w, f, h], i) => (
        <g key={i}>
          <Building x={x as number} w={w as number} h={h as number} fill={f as string} rows={false} />
          {Array.from({ length: Math.floor(((h as number) - 30) / 46) }).map((_, r) => (
            <g key={r} transform={`translate(${(x as number) + 16} ${HZ - (h as number) + 18 + r * 46})`}>
              <rect width={(w as number) - 32} height={32} rx={8} fill="#fff" stroke={C.ink} strokeWidth={2} />
              <rect x={8} y={9} width={((w as number) - 60) * (0.4 + ((r + i) % 3) * 0.2)} height={6} rx={3} fill={(r + i) % 2 ? C.teal : "#b9c2d8"} />
              <rect x={8} y={19} width={((w as number) - 60) * 0.5} height={5} rx={2.5} fill="#dde3ef" />
            </g>
          ))}
        </g>
      ))}
      {/* the library: retrieval */}
      <g transform="translate(500 150)">
        <path d="M0 50 L120 0 L240 50 Z" fill={C.wall} {...S} />
        <rect x={10} y={50} width={220} height={130} fill={C.wall} {...S} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={30 + i * 50} y={70} width={22} height={110} fill="#fff" {...S} strokeWidth={2.5} />)}
        <Sign x={50} y={12} w={140} text="LIBRARY · RAG" size={13} />
      </g>
      {/* hallucination fog */}
      <g transform="translate(470 318)">
        <ellipse cx={80} cy={8} rx={110} ry={16} fill="#e9e3ff" stroke={C.ink} strokeWidth={2.5} strokeDasharray="6 5" />
        <text x={80} y={13} textAnchor="middle" {...F} fontSize={12} fill="#6b5fb0">confident mistakes</text>
      </g>
    </g>
  );
}

// Nov 30, 2022 · one chat window, text only
function LaunchNightArt() {
  return (
    <g>
      {Array.from({ length: 50 }).map((_, i) => (
        <circle key={i} cx={(i * 137) % 1200} cy={16 + ((i * 53) % 220)} r={i % 3 ? 2 : 3} fill="#fff" />
      ))}
      <circle cx={130} cy={70} r={30} fill="#fff4c2" {...S} />
      {[[30, 110, 160], [160, 90, 200], [900, 120, 180], [1040, 120, 220]].map(([x, w, h], i) => (
        <Building key={i} x={x} w={w} h={h} fill="#1c2c54" win="#2a3d6e" lit="#ffe07a" />
      ))}
      <g transform="translate(360 64)">
        <rect width={480} height={266} rx={12} fill="#fffdf5" {...S} />
        <rect x={20} y={18} width={440} height={32} rx={8} fill={C.teal} {...S} strokeWidth={2.5} />
        <text x={36} y={40} {...F} fontSize={16} fill="#fff">Chat · research preview</text>
        <Bubble x={30} y={66} w={260} h={46} fill="#eef3ff">
          <text x={14} y={28} fontFamily="var(--font-nunito)" fontWeight={800} fontSize={14} fill={C.ink}>Write a poem about my cat</text>
        </Bubble>
        <Bubble x={170} y={134} w={290} h={64} fill="#e8fbf6">
          <text x={14} y={26} fontFamily="var(--font-nunito)" fontWeight={800} fontSize={14} fill={C.ink}>In sunlit naps and midnight chase,</text>
          <text x={14} y={46} fontFamily="var(--font-nunito)" fontWeight={800} fontSize={14} fill={C.ink}>a velvet king patrols his space…</text>
        </Bubble>
        <path d="M30 240 h160" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      </g>
      {Array.from({ length: 12 }).map((_, i) => (
        <Person key={i} x={880 - i * 46 - (i > 5 ? 420 : 0)} y={HZ} shirt={[C.pink, C.orange, C.blue, C.teal, C.sun][i % 5]} s={0.95} flip={i % 2 === 1} />
      ))}
    </g>
  );
}

// 2017–2021 · the Transformer: machines that write
function LanguageFactoryArt() {
  return (
    <g>
      <Cloud x={700} y={30} s={0.8} />
      {/* factory */}
      <g transform="translate(80 110)">
        <rect x={0} y={60} width={420} height={160} fill={C.brick} {...S} />
        <path d="M0 60 l70 -40 v40 l70 -40 v40 l70 -40 v40 l70 -40 v40 l70 -40 v40 l70 -40 v40" fill={C.brick} {...S} />
        <rect x={330} y={-70} width={40} height={110} fill="#b76a45" {...S} />
        {["A", "b", "c", "é", "?"].map((l, i) => (
          <text key={l} x={345 + i * 22} y={-86 - i * 18} {...F} fontSize={22 + i * 2} fill={C.ink} opacity={1 - i * 0.12}>{l}</text>
        ))}
        <Sign x={90} y={96} w={240} text="TRANSFORMER WORKS · 2017" size={15} />
        {/* conveyor of pages */}
        <path d="M-20 212 h460" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${10 + i * 86} 168)`}>
            <rect width={44} height={40} rx={3} fill="#fff" {...S} strokeWidth={2.5} />
            {[0, 1, 2].map((r) => <path key={r} d={`M7 ${11 + r * 9} h${22 + ((i + r) % 3) * 4}`} stroke="#9aa3b8" strokeWidth={3} strokeLinecap="round" />)}
          </g>
        ))}
      </g>
      {/* avocado armchair billboard */}
      <g transform="translate(620 90)">
        <rect width={260} height={160} rx={12} fill="#fff" {...S} />
        <path d="M130 250 v-90" {...S} />
        <path d="M80 110 q-10 -70 50 -70 q60 0 50 70 z" fill="#8bc34a" {...S} />
        <ellipse cx={130} cy={96} rx={22} ry={24} fill="#8a5a2b" {...S} />
        <rect x={70} y={108} width={120} height={22} rx={8} fill="#6fae3a" {...S} />
        <text x={130} y={152} textAnchor="middle" {...F} fontSize={13} fill={C.ink}>“an armchair shaped like an avocado”</text>
      </g>
      <g transform="translate(940 140)">
        <rect width={200} height={190} fill="#fff" {...S} />
        <Sign x={30} y={-18} w={140} text="GPT-2 · 2019" size={14} />
        <text x={16} y={40} fontFamily="var(--font-nunito)" fontWeight={800} fontSize={12.5} fill={C.ink}>“In a shocking finding,</text>
        <text x={16} y={58} fontFamily="var(--font-nunito)" fontWeight={800} fontSize={12.5} fill={C.ink}>scientist discovered a</text>
        <text x={16} y={76} fontFamily="var(--font-nunito)" fontWeight={800} fontSize={12.5} fill={C.ink}>herd of unicorns…”</text>
      </g>
    </g>
  );
}

// 2012–2016 · networks learn to see and hear
function SeeingMachinesArt() {
  return (
    <g>
      <Cloud x={420} y={30} />
      {/* photo lab labelling images */}
      <g transform="translate(60 100)">
        <rect width={360} height={230} fill="#fff" {...S} />
        <Sign x={100} y={-16} w={160} text="IMAGENET LAB" size={14} />
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`translate(${20 + (i % 4) * 84} ${30 + Math.floor(i / 4) * 96})`}>
            <rect width={70} height={56} rx={4} fill={["#ffe3b3", "#cfe8ff", "#d9f2d0", "#ffd6e0"][i % 4]} {...S} strokeWidth={2.5} />
            <text x={35} y={76} textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize={11} fill={C.ink}>{["cat .97", "dog .91", "car .88", "cat .64", "bird .93", "mug .71", "cat .99", "tree .82"][i]}</text>
          </g>
        ))}
      </g>
      {/* Go stadium */}
      <g transform="translate(480 120)">
        <path d="M0 210 V60 q160 -80 320 0 V210 z" fill="#e4ecf7" {...S} />
        <rect x={100} y={70} width={120} height={120} fill="#e8b96a" {...S} />
        {Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M${112 + i * 24} 76 V184 M106 ${82 + i * 24} H214`} stroke={C.ink} strokeWidth={1.5} />)}
        {[[136, 106, C.ink], [160, 130, "#fff"], [184, 106, C.ink], [160, 82, "#fff"], [136, 154, C.ink]].map(([x, y, f], i) => (
          <circle key={i} cx={x as number} cy={y as number} r={9} fill={f as string} stroke={C.ink} strokeWidth={2} />
        ))}
        <Sign x={96} y={24} w={128} text="MOVE 37" size={14} fill={C.sun} />
      </g>
      {/* self-driving test car */}
      <g transform="translate(900 250)">
        <rect x={0} y={30} width={200} height={50} rx={18} fill="#fff" {...S} />
        <path d="M40 30 q20 -34 60 -34 h20 q40 0 50 34" fill="#cfe8ff" {...S} />
        <rect x={86} y={-20} width={36} height={16} rx={6} fill={C.coral} {...S} />
        <circle cx={50} cy={80} r={16} fill={C.ink} />
        <circle cx={150} cy={80} r={16} fill={C.ink} />
        <Sign x={10} y={-80} w={200} text="FULL SELF-DRIVING NEXT YEAR" size={11} fill="#fff3c4" />
      </g>
    </g>
  );
}

// 1997 · Deep Blue wins by search
function ChessHallArt() {
  return (
    <g>
      <rect x={180} y={60} width={840} height={270} fill="#f7e7c9" {...S} />
      <rect x={180} y={60} width={840} height={48} fill={C.brick} {...S} />
      <Sign x={420} y={70} w={360} text="1997 · MAN VS MACHINE REMATCH" size={15} />
      <path d="M340 108 L260 330 L460 330 Z" fill="rgba(255,238,170,0.55)" />
      <path d="M860 108 L760 330 L960 330 Z" fill="rgba(255,238,170,0.55)" />
      <g transform="translate(520 130)">
        <rect x={-6} y={-6} width={172} height={172} rx={6} fill={C.ink} />
        {Array.from({ length: 64 }).map((_, i) => (
          <rect key={i} x={(i % 8) * 20} y={Math.floor(i / 8) * 20} width={20} height={20} fill={(i + Math.floor(i / 8)) % 2 ? "#8a5a3c" : "#f3dcb2"} />
        ))}
      </g>
      <rect x={250} y={290} width={200} height={14} rx={4} fill="#8a5a3c" {...S} />
      <Person x={310} y={290} shirt={C.ink} s={1.3} />
      <g transform="translate(830 160)">
        <rect width={100} height={170} rx={8} fill="#1f2d57" {...S} />
        {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={12} y={16 + i * 20} width={76} height={10} rx={3} fill={i % 3 ? "#38508f" : C.sun} stroke={C.ink} strokeWidth={2} />)}
        <text x={50} y={-10} textAnchor="middle" {...F} fontSize={14} fill={C.ink}>200M positions/sec</text>
      </g>
      {Array.from({ length: 9 }).map((_, i) => <Person key={i} x={230 + i * 90} y={HZ} shirt={[C.blue, C.coral, C.teal, C.orange][i % 4]} s={0.8} />)}
    </g>
  );
}

// 1986–1996 · backprop and small networks; the second winter
function LearningLabsArt() {
  return (
    <g>
      <Snow n={36} seed={3} />
      <g transform="translate(80 130)">
        <path d="M0 50 L180 0 L360 50 Z" fill={C.wall} {...S} />
        <rect x={10} y={50} width={340} height={150} fill={C.wall} {...S} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={36 + i * 64} y={70} width={30} height={130} fill="#fff" {...S} strokeWidth={2.5} />)}
        <Sign x={100} y={14} w={160} text="UNIVERSITY LAB" size={13} />
      </g>
      {/* blackboard with a network */}
      <g transform="translate(500 120)">
        <rect width={300} height={180} rx={8} fill="#2f5a45" {...S} />
        {[[40, 40], [40, 90], [40, 140]].map(([x, y], i) =>
          [[150, 60], [150, 120]].map(([x2, y2], j) => <path key={`${i}${j}`} d={`M${x} ${y} L${x2} ${y2}`} stroke="#e8f5e9" strokeWidth={2} />),
        )}
        {[[150, 60], [150, 120]].map(([x, y], i) => <path key={i} d={`M${x} ${y} L250 90`} stroke="#e8f5e9" strokeWidth={2} />)}
        {[[40, 40], [40, 90], [40, 140], [150, 60], [150, 120], [250, 90]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#2f5a45" stroke="#e8f5e9" strokeWidth={3} />)}
        <text x={150} y={170} textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize={13} fill="#e8f5e9">∂E/∂w · backprop</text>
      </g>
      {/* cheque reader */}
      <g transform="translate(870 150)">
        <rect width={240} height={180} rx={10} fill="#d9d2c3" {...S} />
        <rect x={20} y={20} width={200} height={70} rx={4} fill="#fff" {...S} strokeWidth={2.5} />
        <text x={40} y={66} fontFamily="cursive" fontSize={28} fill={C.blue}>$ 1,284</text>
        <rect x={20} y={110} width={200} height={40} rx={6} fill="#1d3b2a" {...S} strokeWidth={2.5} />
        <text x={120} y={137} textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize={16} fill="#5fe39a">READ: 1284 ✓</text>
      </g>
    </g>
  );
}

// 1966–1985 · hand-written rules, then winter
function ExpertOfficesArt() {
  return (
    <g>
      <Snow n={48} seed={5} />
      <g transform="translate(60 120)">
        <rect width={460} height={210} fill="#e7e1d3" {...S} />
        <Sign x={150} y={-16} w={160} text="EXPERT SYSTEMS" size={14} />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${30 + i * 145} 60)`}>
            <rect width={120} height={90} rx={8} fill="#c9c1ad" {...S} />
            <rect x={12} y={10} width={96} height={56} rx={4} fill="#1d3b2a" {...S} strokeWidth={2.5} />
            <text x={20} y={32} fontFamily="var(--font-geist-mono), monospace" fontSize={10} fill="#5fe39a">IF fever</text>
            <text x={20} y={46} fontFamily="var(--font-geist-mono), monospace" fontSize={10} fill="#5fe39a">THEN …</text>
            <rect x={30} y={90} width={60} height={50} fill="#8a7f68" {...S} strokeWidth={2.5} />
          </g>
        ))}
      </g>
      <g transform="translate(580 170)">
        <rect width={260} height={160} fill="#d6cfc0" {...S} />
        <Sign x={30} y={30} w={200} text="LISP MACHINES" size={14} />
        <rect x={40} y={80} width={180} height={60} rx={6} fill="#fff" {...S} />
        <text x={130} y={120} textAnchor="middle" {...F} fontSize={26} fill={C.coral}>CLOSED</text>
      </g>
      <g transform="translate(890 110)">
        <rect width={240} height={220} fill="#fff" {...S} />
        <path d="M0 0 L120 -40 L240 0" fill="#e3e8f0" {...S} />
        <Sign x={20} y={30} w={200} text="FIFTH GEN · TOKYO" size={13} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={24 + i * 52} y={90} width={36} height={130} fill="#cfd8e8" {...S} strokeWidth={2.5} />)}
      </g>
    </g>
  );
}

// 1943–1965 · the first programs that reason
function DawnArt() {
  return (
    <g>
      <Cloud x={560} y={40} />
      {/* Dartmouth-style hall */}
      <g transform="translate(60 110)">
        <rect x={0} y={60} width={340} height={160} fill="#fff" {...S} />
        <path d="M-10 60 L170 0 L350 60 Z" fill="#6d8fb8" {...S} />
        <rect x={150} y={-40} width={40} height={50} fill="#fff" {...S} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={24 + i * 62} y={90} width={30} height={46} fill="#cfe2f7" {...S} strokeWidth={2.5} />)}
        <Sign x={70} y={160} w={200} text="SUMMER 1956 · AI" size={14} fill={C.sun} />
      </g>
      {/* mainframe room */}
      <g transform="translate(470 130)">
        <rect width={380} height={200} fill="#ece6d6" {...S} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${20 + i * 90} 30)`}>
            <rect width={70} height={160} rx={4} fill="#c8c0ab" {...S} />
            <circle cx={22} cy={34} r={14} fill="#fff" {...S} strokeWidth={2.5} />
            <circle cx={50} cy={34} r={14} fill="#fff" {...S} strokeWidth={2.5} />
            {[0, 1, 2].map((r) => <circle key={r} cx={20 + r * 15} cy={80} r={4} fill={r === i % 3 ? C.orange : "#8e8778"} stroke={C.ink} strokeWidth={1.5} />)}
          </g>
        ))}
      </g>
      {/* punch cards + perceptron camera */}
      <g transform="translate(900 200)">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 12} ${-i * 10})`}>
            <rect width={130} height={70} rx={4} fill="#f5deb0" {...S} strokeWidth={2.5} />
            {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={12 + (k % 6) * 18} y={14 + Math.floor(k / 6) * 24} width={6} height={12} fill={C.ink} />)}
          </g>
        ))}
        <g transform="translate(160 -10)">
          <rect width={80} height={90} rx={6} fill="#d9d2c3" {...S} />
          <circle cx={40} cy={34} r={18} fill="#fff" {...S} />
          <circle cx={40} cy={34} r={7} fill={C.ink} />
          <text x={40} y={78} textAnchor="middle" {...F} fontSize={11} fill={C.ink}>PERCEPTRON</text>
        </g>
      </g>
    </g>
  );
}

// 1800s · machines that compute
function MechanicalArt() {
  return (
    <g>
      <Cloud x={300} y={40} />
      {/* difference engine */}
      <g transform="translate(90 120)">
        <rect x={0} y={170} width={300} height={40} fill="#8a5a3c" {...S} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${30 + i * 56} 20)`}>
            <path d="M0 150 V0" stroke="#b58a3c" strokeWidth={8} />
            {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={-18} y={10 + k * 28} width={36} height={18} rx={4} fill="#e8c46a" {...S} strokeWidth={2.5} />)}
          </g>
        ))}
        <Sign x={50} y={-26} w={200} text="DIFFERENCE ENGINE" size={14} />
      </g>
      {/* Jacquard loom */}
      <g transform="translate(480 130)">
        <rect x={0} y={0} width={240} height={200} fill="#c79a62" {...S} />
        <rect x={20} y={20} width={200} height={70} fill="#f5deb0" {...S} />
        {Array.from({ length: 20 }).map((_, k) => <rect key={k} x={30 + (k % 10) * 19} y={30 + Math.floor(k / 10) * 28} width={7} height={14} fill={C.ink} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${40 + i * 32} 100 V200`} stroke={[C.coral, C.blue, C.sun][i % 3]} strokeWidth={8} />)}
        <Sign x={50} y={-26} w={140} text="JACQUARD LOOM" size={13} />
      </g>
      {/* Lovelace's notes */}
      <g transform="translate(820 190)">
        <rect x={0} y={80} width={300} height={60} fill="#8a5a3c" {...S} />
        <g transform="rotate(-6 150 40)">
          <rect x={40} y={0} width={220} height={90} rx={4} fill="#fffaf0" {...S} />
          <text x={56} y={26} fontFamily="cursive" fontSize={15} fill={C.ink}>Note G · 1843</text>
          <text x={56} y={50} fontFamily="cursive" fontSize={13} fill="#55597a">B₁, B₃, B₅ …</text>
          <text x={56} y={72} fontFamily="cursive" fontSize={13} fill="#55597a">a program, before computers</text>
        </g>
        <path d="M270 70 l20 -60" stroke={C.ink} strokeWidth={3} />
      </g>
    </g>
  );
}

// Before 1800 · tools that hold knowledge
function AntiquityArt() {
  return (
    <g>
      <circle cx={1080} cy={80} r={40} fill={C.sun} {...S} />
      <path d="M0 290 q200 -30 400 0 t400 0 t400 0 v40 h-1200z" fill="#6cc5ea" {...S} />
      {/* columns */}
      <g transform="translate(80 120)">
        <path d="M0 40 L140 0 L280 40 Z" fill="#f3ead6" {...S} />
        <rect x={0} y={40} width={280} height={18} fill="#f3ead6" {...S} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 70} y={58} width={30} height={150} fill="#fff" {...S} />)}
      </g>
      {/* abacus stall */}
      <g transform="translate(460 200)">
        <rect x={0} y={60} width={220} height={70} fill="#c79a62" {...S} />
        <path d="M-10 60 L110 10 L230 60 Z" fill={C.coral} {...S} />
        <g transform="translate(40 -60)">
          <rect width={140} height={90} rx={6} fill="none" stroke="#7a4a22" strokeWidth={6} />
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <path d={`M6 ${16 + r * 20} H134`} stroke="#7a4a22" strokeWidth={2} />
              {[0, 1, 2, 3, 4].map((b) => <circle key={b} cx={20 + b * 18 + (r % 2) * 30} cy={16 + r * 20} r={7} fill={[C.coral, C.sun, C.teal, C.blue][r]} stroke={C.ink} strokeWidth={1.5} />)}
            </g>
          ))}
        </g>
      </g>
      {/* clay tablet + Antikythera gears */}
      <g transform="translate(780 170)">
        <rect width={110} height={140} rx={14} fill="#caa27a" {...S} />
        {[0, 1, 2, 3, 4].map((r) => <path key={r} d={`M18 ${26 + r * 22} l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6`} fill="none" stroke="#7a4a22" strokeWidth={2.5} />)}
      </g>
      <g transform="translate(990 210)">
        {[[0, 0, 44], [70, 30, 28], [30, 70, 22]].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r={r} fill="#b58a3c" {...S} />
            {Array.from({ length: 12 }).map((_, k) => <path key={k} d={`M0 ${-r} v-7`} transform={`rotate(${k * 30})`} stroke={C.ink} strokeWidth={4} />)}
            <circle r={r * 0.3} fill="#8a5a3c" {...S} strokeWidth={2} />
          </g>
        ))}
      </g>
    </g>
  );
}

const y = (text: string): Answer => ({ text, ok: "yes" });
const m = (text: string): Answer => ({ text, ok: "meh" });
const n = (text: string): Answer => ({ text, ok: "no" });

export const PANORAMAS: Panorama[] = [
  { id: "agent-city", cat: "video", at: 2026.8, title: "Agent city", when: "2026", line: "Agents act across media: they file, book, write, film and compose.", sky: ["#7fcdfb", "#c9ecff"], ground: "#7fd36b", mist: "#d4efff", hill: "#b6e1f7", stage: 4, Art: AgentCityArt,
    answers: [y("A 10-second cat video, with sound."), y("Live, spoken, in your own voice."), y("Booked. Receipt filed.")] },
  { id: "reasoning-quarter", cat: "photo", at: 2026, title: "The reasoning quarter", when: "2025", line: "Models think before answering: olympiad maths, and agents that code for hours.", sky: ["#8fd3ff", "#d6f0ff"], ground: "#86d47a", mist: "#e0f1ff", hill: "#c4e2fa", stage: 4, Art: ReasoningArt,
    answers: [y("Photoreal images, short clips."), y("Near-human quality in most languages."), m("A browser agent books it; you confirm.")] },
  { id: "media-studios", cat: "clip", at: 2025, title: "Media studios", when: "2024", line: "Video, music and images from a sentence. Early clips still bend physics.", sky: ["#bfe8df", "#e4f6f2"], ground: "#94d680", mist: "#e2f5f0", hill: "#c4e6dd", stage: 3, Art: MediaStudiosArt,
    answers: [y("A short video clip. Check the physics."), y("Real-time voice translation demos."), m("Plans the trip; you still click Buy.")] },
  { id: "chatbot-towers", cat: "paws", at: 2024, title: "Chatbot towers", when: "2023", line: "A chat assistant in every window, plus retrieval, plugins and confident mistakes.", sky: ["#a9dcff", "#e1f3ff"], ground: "#7cc96e", mist: "#e2f1ff", hill: "#c7e2fa", stage: 3, Art: ChatbotTowersArt,
    answers: [y("Good images; watch the hands."), y("Fluent text translation."), m("Suggests flights via plugins; you book.")] },
  { id: "launch-night", cat: "ascii", at: 2022.92, title: "Launch night", when: "Nov 30, 2022", line: "One chat window, text only, and a queue around the block.", sky: ["#172649", "#2b4a86"], ground: "#3f7d4f", mist: "#253d73", hill: "#314f8c", night: true, stage: 3, Art: LaunchNightArt,
    answers: [m("Text only. It types /\\_/\\ ( o.o )."), y("Fluent, and it explains the grammar."), n("“I can't browse the internet.”")] },
  { id: "language-factory", cat: "cartoon", at: 2022, title: "The language factory", when: "2017–2021", line: "The Transformer arrives: models write a paragraph, then whole pages.", sky: ["#bfe2ff", "#eaf6ff"], ground: "#8fcf74", mist: "#eaf3ff", hill: "#cfe3fa", stage: 3, Art: LanguageFactoryArt,
    answers: [m("DALL·E (2021): small, cartoonish cats."), y("Neural translation, a big quality jump."), n("Assistants set reminders, not bookings.")] },
  { id: "seeing-machines", cat: "neuron", at: 2017, title: "The seeing machines", when: "2012–2016", line: "Networks learn to see and hear: ImageNet, speech recognition, AlphaGo.", sky: ["#b8dcff", "#e6f2ff"], ground: "#86c96a", mist: "#e4f0ff", hill: "#cadffa", stage: 2, Art: SeeingMachinesArt,
    answers: [m("It can spot a cat in a photo, not draw one."), m("Google Translate turns neural in 2016."), n("“Here are some search results.”")] },
  { id: "chess-hall", cat: "none", at: 2010, title: "The chess hall", when: "1997–2011", line: "Deep Blue wins by searching 200 million positions a second, not by learning.", sky: ["#f5d7b0", "#fbead2"], ground: "#a9c77e", mist: "#fbe8cd", hill: "#f0d2a8", stage: 2, Art: ChessHallArt,
    answers: [n("No. It can only play chess."), m("Rule-based, then statistical, often clumsy."), n("Call the airline. Press 1.")] },
  { id: "learning-labs", cat: "digit", at: 1990, title: "Learning labs", when: "1986–1996", line: "Backpropagation and small networks read handwritten digits on bank cheques.", sky: ["#dfe9f2", "#f2f6fa"], ground: "#b7d3a2", mist: "#e9eff5", hill: "#d2dde9", stage: 2, Art: LearningLabsArt,
    answers: [n("No. It can read handwritten digits."), m("Statistical translation research begins."), n("A human travel agent books it.")] },
  { id: "expert-offices", cat: "rule", at: 1980, title: "Expert-system offices", when: "1966–1985", line: "Hand-written rules on green terminals, then an AI winter.", sky: ["#dbe7ee", "#f1f5f8"], ground: "#c6dccb", mist: "#e6edf1", hill: "#d0dce4", stage: 2, Art: ExpertOfficesArt,
    answers: [n("No."), m("Rules for narrow domains only."), n("A human travel agent books it.")] },
  { id: "dawn", cat: "perceptron", at: 1960, title: "Dawn", when: "1943–1965", line: "The first programs that reason: logic, checkers, and the perceptron.", sky: ["#ffe2b8", "#fff3dd"], ground: "#c9c58a", mist: "#fff1d9", hill: "#f5d9ae", stage: 2, Art: DawnArt,
    answers: [n("No. The perceptron sorts simple shapes."), m("Georgetown–IBM: 60 Russian sentences (1954)."), n("Phone the airline.")] },
  { id: "mechanical-age", cat: "gears", at: 1940, title: "The mechanical age", when: "1800s", line: "Machines that compute tables, a loom run by punched cards, and Lovelace's notes.", sky: ["#f3d9b5", "#fbeedd"], ground: "#d2b77f", mist: "#f7e5c9", hill: "#eacca1", stage: 1, Art: MechanicalArt,
    answers: [n("No. Machines compute tables of numbers."), n("A human translator."), n("No airlines until 1914.")] },
  { id: "antiquity", cat: "cave", at: 1800, title: "Antiquity", when: "Before 1800", line: "Tools that hold knowledge: writing, the abacus, the Antikythera mechanism.", sky: ["#ffd9a8", "#fff0da"], ground: "#e0c08a", mist: "#ffe8c6", hill: "#f3cf9c", stage: 0, Art: AntiquityArt,
    answers: [n("A human draws it."), n("A human interpreter."), n("No flights. Walk.")] },
];
