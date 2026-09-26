/** Radar of dimension scores (0–100). Pure SVG so it also works in the OG image. */
export function Radar({ dims, size = 300, stroke = "#ece8e1", fill = "rgba(227,178,90,0.28)" }: { dims: { label: string; value: number }[]; size?: number; stroke?: string; fill?: string }) {
  const c = size / 2;
  const R = c - 72;
  const n = Math.max(3, dims.length);
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  };
  const poly = dims.map((d, i) => pt(i, (R * d.value) / 100).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-label={dims.map((d) => `${d.label} ${d.value}%`).join(", ")}>
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <polygon key={k} points={dims.map((_, i) => pt(i, R * k).join(",")).join(" ")} fill="none" stroke="rgba(236,232,225,0.12)" />
      ))}
      {dims.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="rgba(236,232,225,0.1)" />;
      })}
      <polygon points={poly} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {dims.map((d, i) => {
        const [x, y] = pt(i, R + 22);
        return (
          <text key={d.label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#a19c93" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
            {d.label} {d.value}
          </text>
        );
      })}
    </svg>
  );
}
