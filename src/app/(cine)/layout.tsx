import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./runtime.css";

/**
 * One face, variable, set from 11px labels to a 136px headline.
 *
 * Schibsted Grotesk is a contemporary neutral grotesque with slightly humanist
 * joints — it holds up at launch scale without the mechanical coldness of the
 * usual interface sans, and its tabular figures carry the specification tables.
 * A second face would only dilute a page whose voice is the object.
 */
const cine = Schibsted_Grotesk({
  variable: "--font-cine",
  subsets: ["latin"],
  display: "swap",
});

/**
 * The site's front page.
 *
 * A route group, so the folder names the world without adding a path segment:
 * this layout and its page serve `/`. Every token is redefined on `.cn`, so
 * the theme class on <html> has no say in here — the datasheet at `/v2` is the
 * surface that answers the theme, and this one is a single material.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function CineLayout({ children }: LayoutProps<"/">) {
  return <div className={`cn ${cine.variable}`}>{children}</div>;
}
