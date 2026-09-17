import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { site } from "@/lib/content";
import "./runtime.css";

/**
 * Two faces, chosen for material rather than for category.
 *
 * Bodoni Moda is a high-contrast didone with an optical-size axis: at display
 * sizes its hairlines go genuinely thin, which is the single most expensive
 * thing type can do on a dark ground. Jost is a geometric grotesque in the
 * Futura line — it sets the tracked-out small capitals a house uses for labels
 * without ever competing with the serif.
 */
const house = Bodoni_Moda({
  variable: "--font-house",
  subsets: ["latin"],
  display: "swap",
});

const grotesk = Jost({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

/**
 * A second surface for the same record.
 *
 * Every token is redefined on `.lx`, so the theme class on <html> has no say
 * in here. Kept out of the index on purpose: two pages carrying one résumé
 * under one domain is duplicate content, and the primary route should be the
 * one that ranks. Remove `robots` here if this becomes the primary.
 */
export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.intro,
  robots: { index: false, follow: false },
};

export default function HouseLayout({ children }: LayoutProps<"/v2">) {
  return <div className={`lx ${house.variable} ${grotesk.variable}`}>{children}</div>;
}
