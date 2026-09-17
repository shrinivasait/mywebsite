import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { site } from "@/lib/content";
import "./runtime.css";

/**
 * One family, loaded with its width axis open.
 *
 * A sleeve of this era mixes widths rather than faces — the shop set a shouted
 * line in condensed wood type and the credits in something wider, because that
 * is what was in the case. Driving `wdth` gives that range from a single file,
 * so the whole display system costs one font.
 */
const bill = Archivo({
  variable: "--font-bill",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/**
 * A second surface for the same record: the sleeve.
 *
 * It shares the root layout's mono face for credits and nothing else —
 * `runtime.css` redefines every token on `.bn`, so the theme class on <html>
 * has no effect in here. A record sleeve has a front and a back, not a dark
 * mode.
 *
 * Kept out of the index on purpose: two pages carrying one résumé under one
 * domain is duplicate content, and the primary route should be the one that
 * ranks. Remove `robots` here if this becomes the primary.
 */
export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.intro,
  robots: { index: false, follow: false },
};

export default function SleeveLayout({ children }: LayoutProps<"/v2">) {
  return <div className={`bn ${bill.variable}`}>{children}</div>;
}
