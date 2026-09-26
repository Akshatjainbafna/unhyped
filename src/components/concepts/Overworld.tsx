import { Bush, C, Cloud, Plaque, S, Traveller } from "./kit";

export type MonthStop = { key: string; label: string; total: number; groups: number[]; items: { label: string; group: number }[] };

const GROUP_COLORS = [C.orange, C.blue, C.teal, C.pink]; // Foundations, Capabilities, Modern stack, Cross-cutting

// Serpentine overworld path: 3 rows of 4 stops, like a level-select map.
const POINTS = [
  [140, 150], [420, 150], [700, 150], [980, 150],
  [980, 330], [700, 330], [420, 330], [140, 330],
  [140, 510], [420, 510], [700, 510], [980, 510],
];

function House({ x, y, roof }: { x: number; y: number; roof: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-9} y={-12} width={18} height={14} fill={C.wall} {...S} strokeWidth={2.5} />
      <path d="M-12 -11 L0 -23 L12 -11 Z" fill={roof} {...S} strokeWidth={2.5} />
      <rect x={-3} y={-6} width={6} height={8} fill={C.ink} />
    </g>
  );
}

/** One town per month; building count = that month's real launches and updates. */
function Town({ x, y, stop, above }: { x: number; y: number; stop: MonthStop; above: boolean }) {
  const roofs = stop.groups.flatMap((n, g) => Array(n).fill(GROUP_COLORS[g]));
  const cols = 6;
  return (
    <g>
      {roofs.slice(0, 18).map((roof, i) => {
        const cx = x - 70 + (i % cols) * 26 + (Math.floor(i / cols) % 2) * 12;
        const cy = above ? y - 48 - Math.floor(i / cols) * 20 : y + 62 + Math.floor(i / cols) * 20;
        return <House key={i} x={cx} y={cy} roof={roof} />;
      })}
    </g>
  );
}

export function Overworld({ stops }: { stops: MonthStop[] }) {
  const path = POINTS.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const current = stops.length - 1;
  const busiest = stops.reduce((b, s, i) => (s.total > stops[b].total ? i : b), 0);
  return (
    <svg viewBox="0 0 1200 790" className="block h-auto w-full" role="img" aria-label="Overworld map concept: the last twelve months as level stops, town size equals launches that month">
      <rect width={1200} height={790} fill={C.grass} />
      {/* terrain */}
      <path d="M1080 0 h120 v240 q-60 20 -80 -30 q-30 -90 -40 -210z" fill={C.water} {...S} />
      <rect y={630} width={1200} height={160} fill="#6cc55a" />
      {[[40, 60], [300, 240], [560, 250], [860, 240], [60, 420], [1100, 420]].map(([x, y], i) => (
        <Bush key={i} x={x} y={y} s={1.1} />
      ))}
      <Cloud x={260} y={20} s={0.9} />
      <Cloud x={760} y={24} s={0.7} />

      {/* road: edge, asphalt, centre dashes */}
      <path d={path} fill="none" stroke={C.ink} strokeWidth={50} strokeLinejoin="round" strokeLinecap="round" />
      <path d={path} fill="none" stroke={C.roadEdge} strokeWidth={44} strokeLinejoin="round" strokeLinecap="round" />
      <path d={path} fill="none" stroke={C.road} strokeWidth={36} strokeLinejoin="round" strokeLinecap="round" />
      <path d={path} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="14 14" strokeLinejoin="round" />

      {stops.map((stop, i) => {
        const [x, y] = POINTS[i];
        const above = i < 4;
        return (
          <g key={stop.key}>
            <Town x={x} y={y} stop={stop} above={above} />
            <circle cx={x} cy={y} r={20} fill={i === current ? C.coral : C.sun} {...S} />
            <text x={x} y={y + 6} textAnchor="middle" fontFamily="var(--font-fredoka)" fontWeight={700} fontSize={17} fill={C.ink}>
              {stop.total}
            </text>
            <Plaque x={x} y={above ? y + 26 : y - 50} text={stop.label} fill={i === busiest ? C.sun : "#fff"} />
          </g>
        );
      })}

      <Traveller x={POINTS[current][0] + 46} y={POINTS[current][1] + 10} stage={4} s={1.1} />

      {/* selected stop panel (the busiest month), linked to its stop */}
      <path d={`M${POINTS[busiest][0]} ${POINTS[busiest][1] + 20} V660`} stroke={C.ink} strokeWidth={3} strokeDasharray="6 6" />
      <g transform="translate(40 660)">
        <rect width={1120} height={104} rx={16} fill="#fff" {...S} />
        <text x={20} y={30} fontFamily="var(--font-fredoka)" fontWeight={700} fontSize={18} fill={C.ink}>
          {stops[busiest].label} · {stops[busiest].total} launches and updates
        </text>
        {stops[busiest].items.slice(0, 6).map(({ label: t, group }, i) => (
          <g key={t} transform={`translate(${20 + (i % 3) * 366} ${58 + Math.floor(i / 3) * 28})`}>
            <rect width={20} height={20} rx={6} y={-15} fill={GROUP_COLORS[group]} stroke={C.ink} strokeWidth={2} />
            <text x={10} y={0} textAnchor="middle" fontFamily="var(--font-fredoka)" fontWeight={700} fontSize={12} fill={C.ink}>
              {t[0]}
            </text>
            <text x={28} y={0} fontFamily="var(--font-nunito)" fontWeight={700} fontSize={13.5} fill={C.ink}>
              {t.length > 40 ? `${t.slice(0, 39)}…` : t}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
