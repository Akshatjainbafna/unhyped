import { ImageResponse } from "next/og";
import { DIMENSIONS, type Dimension } from "@/lib/quiz/types";

/** Share card: Unhyped score, level, track and a radar of the dimensions. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const percent = Math.max(0, Math.min(100, Number(q.get("p")) || 0));
  const level = (q.get("l") ?? "").slice(0, 24);
  const track = q.get("t") === "builder" ? "AI Builder" : "AI User";
  const dims = (q.get("d") ?? "")
    .split(",")
    .map((kv) => kv.split(":"))
    .filter(([k]) => k in DIMENSIONS)
    .map(([k, v]) => ({ label: DIMENSIONS[k as Dimension], value: Math.max(0, Math.min(100, Number(v) || 0)) }));

  const size = 420;
  const c = size / 2;
  const R = c - 70;
  const n = Math.max(3, dims.length);
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0c0b0a", color: "#ece8e1", padding: 64, fontFamily: "serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 30, letterSpacing: -0.5 }}>Unhyped</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, color: "#a19c93", letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace" }}>
              {`Unhyped score · ${track}`}
            </div>
            <div style={{ fontSize: 190, lineHeight: 1, marginTop: 8 }}>{`${percent}%`}</div>
            <div style={{ fontSize: 52, color: "#e3b25a", marginTop: 8 }}>{level}</div>
          </div>
          <div style={{ fontSize: 22, color: "#6f6a62", fontFamily: "monospace" }}>The real history of AI, without the hype</div>
        </div>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <polygon key={k} points={dims.map((_, i) => pt(i, R * k).join(",")).join(" ")} fill="none" stroke="rgba(236,232,225,0.14)" />
          ))}
          <polygon points={dims.map((d, i) => pt(i, (R * d.value) / 100).join(",")).join(" ")} fill="rgba(227,178,90,0.3)" stroke="#ece8e1" strokeWidth={2} />
        </svg>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
