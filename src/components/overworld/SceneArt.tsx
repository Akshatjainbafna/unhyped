import { AgentCity, DeepBlueHall, LaunchNight } from "../concepts/Scenes";
import { Bush, C, Cloud, S, Traveller } from "../concepts/kit";
import type { Scene } from "@/lib/overworld/layout";

type Banner = { title: string; when: string; line: string; sky: string; ground: string; stage: 0 | 1 | 2 | 3 | 4; night?: boolean };

/**
 * The 15-scene storyboard, placed where the road crosses each date. Three are
 * drawn; the rest are banners until their scenes are illustrated.
 */
export const STORYBOARD: (Scene & { drawn?: () => React.ReactNode; banner?: Banner })[] = [
  { id: "agent-city", at: 2026.8, drawn: AgentCity },
  { id: "reasoning-quarter", at: 2025.99, banner: { title: "The reasoning quarter", when: "2025", line: "Models that think before answering: olympiad-level maths, and agents that code for hours.", sky: "#a8dcff", ground: C.grass, stage: 4 } },
  { id: "media-studios", at: 2024.99, banner: { title: "Media studios", when: "2024", line: "Video, music and images from a sentence. Early clips still bend physics.", sky: "#ffd9e6", ground: "#8ad37a", stage: 3 } },
  { id: "chatbot-towers", at: 2023.99, banner: { title: "Chatbot towers", when: "2023", line: "A chat assistant in every window, plus retrieval and plugins, and confident mistakes.", sky: "#c9e8ff", ground: C.grass, stage: 3 } },
  { id: "launch-night", at: 2022.92, drawn: LaunchNight },
  { id: "language-factory", at: 2021.99, banner: { title: "The language factory", when: "2017–2021", line: "The Transformer: models that write a paragraph, then whole pages.", sky: "#e2f0ff", ground: "#9ad483", stage: 3 } },
  { id: "seeing-machines", at: 2016.99, banner: { title: "The seeing machines", when: "2012–2016", line: "Networks learn to see and hear: ImageNet, speech recognition, AlphaGo.", sky: "#d7ecff", ground: "#8fcf74", stage: 2 } },
  { id: "chess-hall", at: 2011.99, drawn: DeepBlueHall },
  { id: "learning-labs", at: 1989.99, banner: { title: "Learning labs", when: "1986–1996", line: "Backpropagation and small networks: reading handwritten digits on bank cheques.", sky: "#e9f1f7", ground: "#a6c98f", stage: 2 } },
  { id: "expert-offices", at: 1979.99, banner: { title: "Expert-system offices", when: "1966–1985", line: "Hand-written rules on green terminals, then an AI winter.", sky: "#dff3e8", ground: "#9fc7a0", stage: 2 } },
  { id: "dawn", at: 1959.99, banner: { title: "Dawn", when: "1943–1965", line: "The first programs that reason: logic, checkers, the perceptron.", sky: "#f7ecd6", ground: "#c7b27a", stage: 2 } },
  { id: "mechanical-age", at: 1939.99, banner: { title: "The mechanical age", when: "1800s", line: "Machines that compute: Babbage's engine, Lovelace's notes, the Jacquard loom.", sky: "#f6e2c4", ground: "#c9a26b", stage: 1 } },
  { id: "antiquity", at: 1799, banner: { title: "Antiquity", when: "Before 1800", line: "Tools that hold knowledge: writing, the abacus, the Antikythera mechanism.", sky: "#f3d6b0", ground: C.dirt, stage: 0 } },
];

function EraBanner({ b }: { b: Banner }) {
  return (
    <svg viewBox="0 0 1200 520" className="block h-auto w-full" role="img" aria-label={`${b.title}, ${b.when}: ${b.line}`}>
      <rect width={1200} height={520} fill={b.sky} />
      <Cloud x={120} y={50} />
      <Cloud x={880} y={30} s={0.8} />
      <path d="M0 360 q300 -90 600 -20 t600 -10 v190 h-1200z" fill={b.ground} {...S} />
      <Bush x={80} y={330} />
      <Bush x={1060} y={320} />
      <g transform="translate(160 150)">
        <rect width={880} height={140} rx={22} fill="#fff" {...S} />
        <text x={40} y={62} fontFamily="var(--font-fredoka)" fontWeight={700} fontSize={40} fill={C.ink}>{b.title}</text>
        <text x={40} y={104} fontFamily="var(--font-nunito)" fontWeight={700} fontSize={b.line.length > 80 ? 16.5 : 19} fill="#55597a">{b.line}</text>
        <rect x={880 - 40 - b.when.length * 12 - 24} y={30} width={b.when.length * 12 + 24} height={34} rx={10} fill={C.sun} {...S} />
        <text x={880 - 40 - 12} y={54} textAnchor="end" fontFamily="var(--font-fredoka)" fontWeight={700} fontSize={18} fill={C.ink}>{b.when}</text>
      </g>
      <Traveller x={600} y={420} stage={b.stage} s={1.4} />
    </svg>
  );
}

export function SceneArt({ id }: { id: string }) {
  const sc = STORYBOARD.find((s) => s.id === id);
  if (!sc) return null;
  const Drawn = sc.drawn;
  return (
    <div className="overflow-hidden rounded-[22px] border-[3px] border-[#26283b] bg-white shadow-[0_6px_0_#26283b]">
      {Drawn ? <Drawn /> : <EraBanner b={sc.banner!} />}
    </div>
  );
}
