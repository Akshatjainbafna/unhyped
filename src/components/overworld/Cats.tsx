import { C, S } from "../concepts/kit";

/**
 * "Draw a cat", answered by each era. Run down the map, these form one strip:
 * a cat video today, back through odd paws, DeepDream eyes, a blurry "cat
 * neuron", machines that cannot draw at all, to a human painting on a wall.
 */
export type CatKind = "video" | "photo" | "clip" | "paws" | "ascii" | "cartoon" | "neuron" | "none" | "digit" | "rule" | "perceptron" | "gears" | "cave";

const F = { fontFamily: "var(--font-fredoka)", fontWeight: 700 } as const;
const M = { fontFamily: "var(--font-geist-mono), monospace" } as const;

function Cat({ fill = C.orange, stripes = true }: { fill?: string; stripes?: boolean }) {
  return (
    <g>
      <path d="M22 78 q28 -46 56 0 z" fill={fill} {...S} />
      <circle cx={50} cy={40} r={18} fill={fill} {...S} />
      <path d="M36 30 l-5 -14 l12 8 M64 30 l5 -14 l-12 8" fill={fill} {...S} />
      <circle cx={43} cy={40} r={2.6} fill={C.ink} />
      <circle cx={57} cy={40} r={2.6} fill={C.ink} />
      <path d="M47 47 q3 3 6 0" fill="none" stroke={C.ink} strokeWidth={2} strokeLinecap="round" />
      {stripes && <path d="M42 64 h16 M40 70 h20" stroke="#d9772a" strokeWidth={3} strokeLinecap="round" />}
    </g>
  );
}

export function CatDrawing({ kind }: { kind: CatKind }) {
  return (
    <svg viewBox="0 0 100 90" width="100%" height="100%" aria-hidden="true">
      {kind === "video" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#e4f3ff" {...S} />
          <Cat />
          <path d="M78 12 l12 7 l-12 7 z" fill={C.coral} {...S} strokeWidth={2} />
          <path d="M10 80 h40" stroke={C.coral} strokeWidth={4} strokeLinecap="round" />
        </g>
      )}
      {kind === "photo" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#fff4e0" {...S} />
          <Cat fill="#e9a25a" />
          <circle cx={84} cy={14} r={4} fill={C.sun} stroke={C.ink} strokeWidth={1.5} />
        </g>
      )}
      {kind === "clip" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#ffe8f0" {...S} />
          <g transform="skewX(-6) translate(6 0)">
            <Cat fill="#d8a4f0" />
          </g>
          <path d="M72 70 q8 -10 16 0" fill="none" stroke={C.ink} strokeWidth={2} strokeDasharray="3 3" />
        </g>
      )}
      {kind === "paws" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#eef3ff" {...S} />
          <Cat fill="#b9b1a6" stripes={false} />
          {[26, 36, 46, 56, 66, 76].map((x) => (
            <ellipse key={x} cx={x} cy={80} rx={5} ry={3.5} fill="#b9b1a6" stroke={C.ink} strokeWidth={1.8} />
          ))}
        </g>
      )}
      {kind === "ascii" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#fffdf5" {...S} />
          <text x={50} y={36} textAnchor="middle" {...M} fontSize={15} fill={C.ink}>/\_/\</text>
          <text x={50} y={54} textAnchor="middle" {...M} fontSize={15} fill={C.ink}>( o.o )</text>
          <text x={50} y={72} textAnchor="middle" {...M} fontSize={15} fill={C.ink}>&gt; ^ &lt;</text>
        </g>
      )}
      {kind === "cartoon" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#f4f7ff" {...S} />
          {/* small, blocky, low-resolution */}
          {[[38, 30], [44, 30], [56, 30], [62, 30], [38, 36], [44, 36], [50, 36], [56, 36], [62, 36], [38, 42], [50, 42], [62, 42], [38, 48], [44, 48], [50, 48], [56, 48], [62, 48], [44, 54], [50, 54], [56, 54], [38, 60], [44, 60], [50, 60], [56, 60], [62, 60]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={6} height={6} fill={i % 7 === 3 ? C.ink : "#f0a860"} />
          ))}
        </g>
      )}
      {kind === "neuron" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#eef1f5" {...S} />
          {Array.from({ length: 49 }).map((_, i) => {
            const x = i % 7;
            const y = Math.floor(i / 7);
            const d = Math.hypot(x - 3, y - 3.2);
            return <rect key={i} x={22 + x * 8} y={14 + y * 8} width={8} height={8} fill={`rgba(38,40,59,${Math.max(0.06, 0.78 - d * 0.2)})`} />;
          })}
          <path d="M28 18 l6 -10 l4 10 M64 18 l6 -10 l4 10" fill="rgba(38,40,59,0.55)" />
        </g>
      )}
      {kind === "none" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#f3f3f3" stroke={C.ink} strokeWidth={3} strokeDasharray="6 5" />
          <path d="M36 32 l28 28 M64 32 l-28 28" stroke={C.coral} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}
      {kind === "digit" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#fff" {...S} />
          <path d="M34 26 h32 l-20 44" fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          <text x={80} y={78} textAnchor="end" {...M} fontSize={11} fill={C.ink}>“7” ✓</text>
        </g>
      )}
      {kind === "rule" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#1d3b2a" {...S} />
          <text x={12} y={30} {...M} fontSize={9.5} fill="#5fe39a">IF whiskers</text>
          <text x={12} y={44} {...M} fontSize={9.5} fill="#5fe39a">AND fur</text>
          <text x={12} y={58} {...M} fontSize={9.5} fill="#5fe39a">THEN cat</text>
          <rect x={12} y={66} width={7} height={11} fill="#5fe39a" />
        </g>
      )}
      {kind === "perceptron" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#d9d2c3" {...S} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={24 + i * 17} cy={34} r={6} fill={i === 1 ? C.sun : "#8e8778"} stroke={C.ink} strokeWidth={2} />
          ))}
          <text x={50} y={66} textAnchor="middle" {...F} fontSize={10.5} fill={C.ink}>LEFT? RIGHT?</text>
        </g>
      )}
      {kind === "gears" && (
        <g>
          <rect x={4} y={4} width={92} height={82} rx={10} fill="#f5e6cc" {...S} />
          {[[40, 46, 18], [66, 36, 12]].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r={r} fill="#e8c46a" {...S} strokeWidth={2.5} />
              {Array.from({ length: 10 }).map((_, k) => (
                <path key={k} d={`M0 ${-r} v-5`} transform={`rotate(${k * 36})`} stroke={C.ink} strokeWidth={3} />
              ))}
            </g>
          ))}
          <text x={50} y={80} textAnchor="middle" {...M} fontSize={9} fill={C.ink}>1, 4, 9, 16…</text>
        </g>
      )}
      {kind === "cave" && (
        <g>
          <path d="M4 86 q4 -76 60 -80 q34 8 32 80 z" fill="#caa27a" {...S} />
          <path d="M34 70 q16 -18 32 0 M40 56 q10 -12 20 0 M42 50 l-3 -8 l7 5 M58 50 l3 -8 l-7 5 M66 68 q12 4 8 -14" fill="none" stroke="#7a3b1c" strokeWidth={3.5} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
