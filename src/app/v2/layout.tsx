import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { site } from "@/lib/content";
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
 * A second surface for the same record.
 *
 * Every token is redefined on `.cn`, so the theme class on <html> has no say
 * in here. Kept out of the index on purpose: two pages carrying one résumé
 * under one domain is duplicate content, and the primary route should be the
 * one that ranks. Remove `robots` here if this becomes the primary.
 */
export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.intro,
  robots: { index: false, follow: false },
};

export default function CineLayout({ children }: LayoutProps<"/v2">) {
  return <div className={`cn ${cine.variable}`}>{children}</div>;
}
