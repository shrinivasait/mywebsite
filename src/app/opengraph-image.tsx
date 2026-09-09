import { ImageResponse } from "next/og";
import { characteristics, site } from "@/lib/content";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card is the document's front page: stock, ink, one rule, and four rows
 * of the characteristics table with their units. Generated at build time, so
 * it cannot drift from the content it is quoting.
 *
 * next/og uses Satori, which supports a subset of CSS — flexbox only, no grid,
 * and every element with more than one child needs an explicit display. The
 * reticule and the second ink are hard-coded here because Satori resolves no
 * custom properties; they are the same values globals.css defines.
 */

const STOCK = "#f7f8f7";
const INK = "#14171b";
const INK_2 = "#4a5157";
const INK_3 = "#626a70";
const RETICULE = "#c4c9c8";
const TRACE = "#046a90";

export default async function OpengraphImage() {
  const rows = characteristics.slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: STOCK,
          color: INK,
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 21,
              letterSpacing: "0.14em",
              color: INK_3,
              textTransform: "uppercase",
            }}
          >
            {site.name}
          </div>
          <div style={{ display: "flex", height: 3, background: INK, marginTop: 18 }} />
          <div
            style={{
              marginTop: 34,
              fontSize: 58,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              fontWeight: 600,
              maxWidth: 880,
              display: "flex",
            }}
          >
            {site.tagline}
          </div>
          <div style={{ marginTop: 22, fontSize: 25, color: INK_2, display: "flex" }}>
            {site.role} &nbsp;·&nbsp; {site.location}
          </div>
        </div>

        {/* Four characteristics, each with its unit — the card states evidence
            rather than four decorative numbers. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, background: RETICULE }} />
          <div style={{ display: "flex", gap: 44, paddingTop: 22 }}>
            {rows.map((c) => (
              <div
                key={c.parameter}
                style={{ display: "flex", flexDirection: "column", maxWidth: 250 }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}>
                    {c.value}
                  </div>
                  <div style={{ fontSize: 19, color: TRACE }}>{c.unit}</div>
                </div>
                <div style={{ marginTop: 8, fontSize: 17, color: INK_3, display: "flex" }}>
                  {c.parameter}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
