import type { Metadata } from "next";
import { site } from "@/lib/content";
import "./runtime.css";

/**
 * A second surface for the same record.
 *
 * It shares the root layout's fonts and nothing else: `runtime.css` redefines
 * every token on `.rt`, so the theme class on <html> has no effect in here and
 * this route is one material in one mode.
 *
 * Kept out of the index on purpose. Two pages carrying the same résumé under
 * one domain is duplicate content, and the primary route should be the one a
 * search engine ranks. Remove `robots` here if this becomes the primary.
 */
export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.intro,
  robots: { index: false, follow: false },
};

export default function RuntimeLayout({ children }: LayoutProps<"/v2">) {
  return <div className="rt">{children}</div>;
}
