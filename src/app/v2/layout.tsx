import type { Metadata } from "next";
import { Bricolage_Grotesque, Martian_Mono } from "next/font/google";
import { site } from "@/lib/content";
import "./runtime.css";

/**
 * Two faces chosen as instruments rather than as defaults.
 *
 * Bricolage Grotesque is a variable grotesque with real character in its
 * joints — it sets a die label at 10px and a headline at 56px out of one file.
 * Martian Mono is a technical mono drawn for interfaces, and it carries every
 * measured value, every layer id and every pin on this route.
 */
const die = Bricolage_Grotesque({
  variable: "--font-die",
  subsets: ["latin"],
  display: "swap",
});

const probe = Martian_Mono({
  variable: "--font-probe",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

/**
 * A second surface for the same record: the die.
 *
 * Every token is redefined on `.die`, so the theme class on <html> has no
 * effect in here — a photomicrograph does not have a light mode.
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

export default function DieLayout({ children }: LayoutProps<"/v2">) {
  return <div className={`die ${die.variable} ${probe.variable}`}>{children}</div>;
}
