import type { Metadata } from "next";
import { Archivo, Chivo_Mono } from "next/font/google";
import { site } from "@/lib/content";
import "./globals.css";

/**
 * Two faces, and two weights of the text face — not a variable axis. The
 * discipline is the point: with only 400 and 600 in the build there is no
 * third weight for a heading to drift into.
 *
 * Archivo is a grotesque drawn from printed signage and reference material.
 * Chivo Mono carries symbols, units, values and test conditions.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const chivoMono = Chivo_Mono({
  variable: "--font-chivo-mono",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.intro,
  keywords: [
    "GenAI Architect", "AI Lead", "Head of AI", "LLM", "RAG", "Agentic AI",
    "Voice AI", "MLOps", "AI engineering leadership", site.name,
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

/**
 * Resolve the theme before first paint. Inline and blocking on purpose: any
 * later and the wrong material flashes.
 */
const themeScript = `
try {
  var s = localStorage.getItem('theme');
  var d = s === 'dark' || (!s && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', d);
} catch (e) {}
document.documentElement.classList.add('js');
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${chivoMono.variable} scroll-smooth antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* The stock lives on `html` so the sheet's ground is continuous through
          overscroll; `body` carries only the ink. */}
      <body className="min-h-dvh text-ink">{children}</body>
    </html>
  );
}
