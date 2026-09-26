/**
 * Shared vocabulary for the v2 flat game world: one ink outline, sunny accents,
 * chunky rounded shapes. Everything is plain SVG so frames can become assets.
 */
export const C = {
  ink: "#26283b",
  sky: "#8fd6ff",
  skyTop: "#bfe9ff",
  cloud: "#ffffff",
  grass: "#7fd36b",
  grassDark: "#5dba52",
  road: "#4b5063",
  roadEdge: "#f7f3e8",
  dirt: "#e0b178",
  water: "#62c5f0",
  sun: "#ffd23f",
  coral: "#ff6b5b",
  orange: "#ff9f43",
  teal: "#2ec4b6",
  blue: "#4d8dff",
  pink: "#ff8fb1",
  cream: "#fff8ea",
  night: "#233a6b",
  nightDeep: "#172649",
  wall: "#f3e3c3",
  brick: "#e98b5b",
};

export const S = { stroke: C.ink, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 30 q0-16 16-16 q4-14 22-14 q16 0 22 14 q16 0 16 16 z"
        fill={C.cloud}
        {...S}
      />
    </g>
  );
}

export function Bush({ x, y, s = 1, fill = C.grassDark }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 20 q0-14 12-14 q2-10 14-10 q12 0 14 10 q12 0 12 14 z" fill={fill} {...S} />
      <path d="M14 8 q4-4 8 0" fill="none" stroke="#9be58a" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

/** Speech/billboard panel with a pointer. */
export function Bubble({ x, y, w, h, fill = "#fff", children }: { x: number; y: number; w: number; h: number; fill?: string; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M10 0 h${w - 20} q10 0 10 10 v${h - 20} q0 10 -10 10 h${-(w / 2 - 22)} l-12 14 l-2 -14 h${-(w / 2 - 14)} q-10 0 -10 -10 v${-(h - 20)} q0 -10 10 -10 z`} fill={fill} {...S} />
      {children}
    </g>
  );
}

/** Tiny person for crowds. */
export function Person({ x, y, shirt = C.blue, s = 1, flip = false }: { x: number; y: number; shirt?: string; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <rect x={-7} y={-22} width={14} height={20} rx={6} fill={shirt} {...S} />
      <circle cx={0} cy={-30} r={8} fill="#ffd9b8" {...S} />
      <path d="M-6 -35 q6 -8 12 0" fill={C.ink} />
      <path d="M-4 -2 v8 M4 -2 v8" {...S} fill="none" />
    </g>
  );
}

/**
 * The evolving traveller. Stage 4 = agent robot (2026) … 0 = human with a torch.
 */
export function Traveller({ x, y, stage, s = 1 }: { x: number; y: number; stage: 0 | 1 | 2 | 3 | 4; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={22} ry={6} fill="rgba(38,40,59,0.18)" />
      {stage === 4 && (
        <g>
          <path d="M-8 0 v-10 M8 0 v-10" {...S} fill="none" />
          <rect x={-18} y={-44} width={36} height={36} rx={14} fill="#f7f7fb" {...S} />
          <rect x={-13} y={-37} width={26} height={16} rx={7} fill={C.ink} />
          <circle cx={-5} cy={-29} r={3} fill={C.teal} />
          <circle cx={5} cy={-29} r={3} fill={C.teal} />
          <path d="M0 -44 v-10" {...S} />
          <circle cx={0} cy={-58} r={5} fill={C.sun} {...S} />
          <path d="M-18 -26 q-10 4 -10 14 M18 -26 q10 -6 12 -18" {...S} fill="none" />
          <rect x={22} y={-54} width={16} height={12} rx={3} fill={C.orange} {...S} />
        </g>
      )}
      {stage === 3 && (
        <g>
          <path d="M-8 0 v-12 M8 0 v-12" {...S} fill="none" />
          <rect x={-22} y={-52} width={44} height={40} rx={10} fill={C.cream} {...S} />
          <rect x={-16} y={-46} width={32} height={20} rx={6} fill="#fff" {...S} />
          <path d="M-10 -38 h14 M-10 -32 h20" stroke={C.blue} strokeWidth={3} strokeLinecap="round" />
          <circle cx={-6} cy={-18} r={2.5} fill={C.ink} />
          <circle cx={6} cy={-18} r={2.5} fill={C.ink} />
        </g>
      )}
      {stage === 2 && (
        <g>
          <path d="M-8 0 v-12 M8 0 v-12" {...S} fill="none" />
          <rect x={-22} y={-50} width={44} height={38} rx={4} fill="#d9d2c3" {...S} />
          <rect x={-15} y={-44} width={30} height={20} rx={3} fill="#1d3b2a" {...S} />
          <path d="M-10 -36 h8" stroke="#5fe39a" strokeWidth={3} strokeLinecap="square" />
          <rect x={-10} y={-20} width={20} height={4} fill={C.ink} />
        </g>
      )}
      {stage === 1 && (
        <g>
          <path d="M-8 0 v-12 M8 0 v-12" {...S} fill="none" />
          <rect x={-16} y={-40} width={32} height={28} rx={8} fill="#d8a64a" {...S} />
          <circle cx={0} cy={-50} r={12} fill="#e6b95b" {...S} />
          <circle cx={-4} cy={-51} r={2.5} fill={C.ink} />
          <circle cx={4} cy={-51} r={2.5} fill={C.ink} />
          <circle cx={0} cy={-26} r={6} fill="#fff4d0" {...S} />
          <path d="M0 -26 l4 -3" stroke={C.ink} strokeWidth={2} />
        </g>
      )}
      {stage === 0 && (
        <g>
          <path d="M-6 0 v-14 M6 0 v-14" {...S} fill="none" />
          <path d="M-12 -14 l4 -26 h16 l4 26 z" fill="#b5763d" {...S} />
          <circle cx={0} cy={-48} r={10} fill="#ffd9b8" {...S} />
          <path d="M-9 -52 q9 -12 18 0" fill="#5a3b22" />
          <path d="M12 -30 l14 -22" stroke="#7a4a22" strokeWidth={5} strokeLinecap="round" />
          <path d="M26 -52 q-8 -10 0 -22 q8 12 0 22" fill={C.orange} {...S} />
        </g>
      )}
    </g>
  );
}

/** A chunky label plaque for maps. */
export function Plaque({ x, y, text, fill = "#fff", color = C.ink, w }: { x: number; y: number; text: string; fill?: string; color?: string; w?: number }) {
  const width = w ?? text.length * 8.6 + 18;
  return (
    <g transform={`translate(${x - width / 2} ${y})`}>
      <rect width={width} height={24} rx={8} fill={fill} {...S} />
      <text x={width / 2} y={17} textAnchor="middle" fontFamily="var(--font-fredoka)" fontWeight={600} fontSize={14} fill={color}>
        {text}
      </text>
    </g>
  );
}
