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

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://unhyped-ai.vercel.app").replace(/\/$/, "");
const TITLE = "Unhyped: the AI timeline, AI products and tool comparisons in one place";
const DESCRIPTION =
  "Travel the complete history of AI from the first tools to today: every breakthrough, model, product and open-source project, with sources, plus side-by-side comparisons of AI tools to find the one that fits.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Unhyped" },
  description: DESCRIPTION,
  applicationName: "Unhyped",
  keywords: ["AI timeline", "history of AI", "AI products", "AI tools comparison", "compare AI tools", "AI coding agents compared", "AI models comparison", "AI advancements", "open-source AI tools"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Unhyped", title: TITLE, description: DESCRIPTION, url: "/" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Matches the light sky at the top of the map, so the phone's browser bar blends in.
  themeColor: "#f4faff",
  // Draw under the notch/home indicator; the docks pad themselves with the safe-area insets.
  viewportFit: "cover",
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
