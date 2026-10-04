import { ImageResponse } from "next/og";

export const alt = "Unhyped: the AI timeline, AI products and tool comparisons in one place";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Link-preview card used by every page that does not set its own image. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0c0b0a", color: "#ece8e1", padding: 80 }}>
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 6, textTransform: "uppercase", color: "#a19c93" }}>Unhyped</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, lineHeight: 1.05 }}>The real history of AI,</div>
          <div style={{ display: "flex", fontSize: 84, lineHeight: 1.05, color: "#a19c93" }}>without the hype.</div>
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#a19c93" }}>AI timeline · AI products · compare AI tools</div>
      </div>
    ),
    size,
  );
}
