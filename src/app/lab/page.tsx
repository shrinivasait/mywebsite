import type { Metadata } from "next";
import { HeroArtifact } from "@/components/HeroArtifact";
import { LatencyArtifact } from "@/components/LatencyArtifact";

/**
 * A comparison bench for the hero object, not a page of the site.
 *
 * Both candidates are mounted at the size and on the ground they would occupy
 * in the hero, side by side, so the choice is made by looking rather than by
 * reading a description of each. Delete this route once the object is chosen —
 * it is scaffolding, and it is kept out of the sitemap and out of the index in
 * the meantime.
 */
export const metadata: Metadata = {
  title: "Hero object bench",
  robots: { index: false, follow: false },
};

const CELLS = [
  {
    name: "A · Loss surface",
    note: "Shipping. Four optimisers descending; the fourth is trapped in a local minimum.",
    render: () => <HeroArtifact />,
  },
  {
    name: "B · Latency budget",
    note: "Candidate. One spoken turn against the 800 ms ceiling; every fourth run is hot.",
    render: () => <LatencyArtifact />,
  },
];

export default function Lab() {
  return (
    <main className="mx-auto max-w-[1400px] px-6 py-14">
      <header className="mb-10 border-b border-reticule-2 pb-5">
        <h1 className="text-2xl font-medium text-ink">Hero object bench</h1>
        <p className="mt-2 max-w-[60ch] text-ink-2">
          The same slot, the same inks, the same lighting. Toggle the theme to check both in the
          negative. Not linked from anywhere and not indexed.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-2">
        {CELLS.map((cell) => (
          <section key={cell.name}>
            <div className="relative aspect-[4/3] border border-reticule-2 bg-stock-sunken">
              {cell.render()}
            </div>
            <h2 className="spec-datum mt-3 text-ink">{cell.name}</h2>
            <p className="mt-1 max-w-[52ch] text-ink-2">{cell.note}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
