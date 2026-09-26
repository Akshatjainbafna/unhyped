import type { Metadata, Viewport } from "next";
import { Fredoka, Geist, Geist_Mono, Instrument_Serif, Nunito } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["500", "600", "700"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Unhyped — the real history of AI",
  description:
    "Travel the road of AI from today back to the first campfire: what each technology demonstrably did, who built it, and which claims held up.",
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${fredoka.variable} ${nunito.variable} antialiased`}
    >
      <body className="grain">{children}</body>
    </html>
  );
}
