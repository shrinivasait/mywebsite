import Image from "next/image";
import {
  blockFeedback,
  blockStages,
  characteristics,
  expertise,
  features,
  leadership,
  projects,
  roles,
  sheets,
  site,
  skills,
} from "@/lib/content";
import { CircuitPackets } from "./Circuit";
import { CodeTerminal } from "./CodeTerminal";
import { MegaName, Parallax, StatusRail, Tilt, TimelineSpine, Uptime, Words } from "./Hud";
import { Magnetic, Marquee, Scramble, Ticker } from "./Kinetic";
import { LatencyBudget } from "./LatencyBudget";
import { Year } from "./Year";

/* ── Shared shells ───────────────────────────────────────────────────────────
   One measure, one gutter, one section anatomy. A reference document is
   consistent to the point of being boring about it, and that consistency is
   what lets a reader skim it.
   ─────────────────────────────────────────────────────────────────────────── */

function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[68rem] px-5 sm:px-8 ${className}`}>{children}</div>
  );
}

/**
 * A section head in the document's own grammar: the name set small in caps,
 * its one-line lead ranged opposite, and a two-pixel ink rule under both. The
 * head is smaller than the content beneath it on purpose — in a reference
 * document the table outranks its own label.
 */
function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <Container className="pt-16 sm:pt-24">
        <div
          data-reveal
          className="flex flex-col gap-1.5 pb-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
        >
          <div className="flex shrink-0 items-baseline gap-3">
            {/* The sheet index, taken from the document's own order rather
                than hand-numbered here, so inserting a section renumbers
                everything below it for free. */}
            <span aria-hidden className="sec-index">
              {String(sheets.findIndex((sh) => sh.id === id) + 1).padStart(2, "0")}
            </span>
            <Scramble as="h2" className="spec-section" text={title} />
          </div>
          {lead && <p className="spec-datum max-w-md text-ink-3 sm:text-right">{lead}</p>}
        </div>
        {/* One pass of light runs the rule as the head arrives. */}
        {/* A div, not an <hr>: the scan is a pseudo-element and `hr` is not
            a reliable host for one. `role="separator"` keeps the semantics.
            The wrapper exists so the observer has a box with area to watch —
            see the `data-wipe` note in globals.css. */}
        <div data-wipe>
          <div role="separator" className="rule-ink rule-scan" />
        </div>
        <div className="mt-7 sm:mt-9">{children}</div>
      </Container>
    </section>
  );
}

/** A field label over a block. Never set above a heading. */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="spec-label text-ink-3">{children}</p>;
}

/** The square bullet a printed list uses. Not a dot, and not a glyph. */
function SquareBullet() {
  return <span aria-hidden className="mt-[0.5rem] size-[3px] shrink-0 bg-ink-3" />;
}

/* ── Icons ────────────────────────────────────────────────────────────────────
   Four marks, one 24-unit grid, one 1.6 stroke. The four pillar icons the
   previous world carried are gone with it: a reference document labels its
   fields, it does not illustrate them, and an icon tile above every card was
   part of what made the page read as assembled.
   ─────────────────────────────────────────────────────────────────────────── */

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function ArrowOut({ className = "size-4" }: { className?: string }) {
  return (
    <svg {...stroke} className={className}>
      <path d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg {...stroke} className="size-4">
      <rect x="3" y="5.5" width="18" height="13" />
      <path d="m4 8 6.9 4.6a2 2 0 0 0 2.2 0L20 8" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg {...stroke} className="size-4">
      <path d="M12 3.5v11m0 0 4-4m-4 4-4-4M4.5 18.5h15" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05c.53-.95 1.83-1.95 3.77-1.95C20.2 8.69 21 10.8 21 14.02V21h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.61-2.38 3.28V21h-4V9Z" />
    </svg>
  );
}

/* ── The front page ──────────────────────────────────────────────────────────
   Designation, functional description, the argument, the features list, and
   the actions — with the portrait as the document's plate of the subject.

   The four large hero figures the previous world opened with are gone. They
   were the hero-metric template: a number, a label, and an accent, with no
   way to check any of it. Those figures are now nine rows of a characteristics
   table immediately below, each carrying its unit and the condition it was
   measured under. That is more evidence in less space, which is what
   PRODUCT.md's forty-second test actually asks for.
   ─────────────────────────────────────────────────────────────────────────── */

export function PartHeader() {
  return (
    <section id="top" tabIndex={-1} className="focus:outline-none">
      <Container className="pt-8 pb-12 sm:pt-12 sm:pb-16">
        {/* The status line. What a machine prints before it prints anything
            else: what it is, where it is, how long it has been up. */}
        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-reticule-2 pb-3"
          data-set
        >
          <span className="hud">{site.role}</span>
          <span aria-hidden className="hud text-reticule-2">
            /
          </span>
          <span className="hud">{site.location}</span>
          <span className="hud ml-auto flex items-center gap-2">
            <span aria-hidden className="size-1.5 bg-volt" />
            <span className="hud-on">uptime</span>
            <Uptime />
          </span>
        </div>

        {/* The name, at the size a title block is set at when the document is
            the person. One glyph at a time, and it splits into its two ink
            channels under the pointer — a registration error, which is the
            print world's own version of a glitch. */}
        {/* The name and the screen leave at different rates: the name is
            the near plane, the screen sits fractionally further back. Both
            shallow — past about fifteen per cent parallax stops saying "this
            surface is closer" and starts saying "this text is not attached
            to anything". */}
        <Parallax depth={0.06} className="mt-6 sm:mt-8">
          <div data-set>
            <MegaName text={site.name} />
          </div>
        </Parallax>

        {/* `grid-cols-1` and not the implicit single track: the terminal sets its
            code in `white-space: pre`, so an auto track sizes to the longest
            line and drags the prose column out with it. Tailwind's numbered
            column utilities are `minmax(0, 1fr)`, which is the cap that keeps
            the sheet from scrolling sideways on a phone. */}
        <div className="mt-8 grid grid-cols-1 gap-10 sm:mt-12 sm:grid-cols-12 sm:gap-10">
          <div className="order-2 min-w-0 sm:order-none sm:col-span-5">
            <p className="spec-head max-w-[28ch] text-[1.375rem] sm:text-[1.5rem]" data-set>
              {site.tagline}
            </p>
            <p className="measure mt-4 text-[0.9375rem] leading-[1.65] text-ink-2" data-set>
              {site.intro}
            </p>

            <div className="mt-7" data-set>
              <FieldLabel>Features</FieldLabel>
              <ul className="mt-3 space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex gap-3 text-[0.875rem] leading-[1.55] text-ink-2">
                    <SquareBullet />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-2" data-set>
              <Magnetic>
                <a href={`mailto:${site.email}`} className="key key-primary">
                  <MailIcon />
                  Get in touch
                </a>
              </Magnetic>
              <Magnetic>
                <a href={site.resume} download className="key key-secondary">
                  <DownloadIcon />
                  Download résumé
                </a>
              </Magnetic>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="key key-quiet"
              >
                <LinkedInIcon />
                LinkedIn
                <ArrowOut className="size-3.5" />
              </a>
            </div>

            <div className="panel bracket mt-8 flex items-center gap-3.5 p-3.5" data-set>
              <Image
                src="/profile.jpg"
                alt={`${site.name}, ${site.role}`}
                width={860}
                height={996}
                priority
                sizes="72px"
                className="size-16 shrink-0 rounded-full object-cover object-top"
              />
              <div className="min-w-0">
                <p className="hud">Current seat</p>
                <p className="mt-1 text-[0.9375rem] leading-snug font-semibold">
                  {roles[0].title}
                </p>
                <p className="spec-datum mt-0.5 text-ink-3">
                  {roles[0].orgShort ?? roles[0].org}
                </p>
                {site.available && (
                  <p className="mt-2.5 flex items-center gap-2 border-t border-reticule pt-2.5 text-[0.8125rem] text-ink-2">
                    <span aria-hidden className="size-1.5 shrink-0 bg-volt" />
                    {site.availability}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* The screen, given the wider half of the spread. It is the first
              thing in the viewport that moves, and the numbers it prints are
              the ones the characteristics table states below. */}
          <div className="order-1 min-w-0 sm:order-none sm:col-span-7" data-set>
            <Parallax depth={-0.04}>
              <div className="h-[24rem] w-full sm:h-[28rem]">
                <CodeTerminal />
              </div>
            </Parallax>
          </div>
        </div>

        {/* The rail. Three résumé figures and a trace behind each, with the
            caption saying plainly that the traces are shapes and not a feed. */}
        <div className="mt-10 sm:mt-14" data-set>
          <StatusRail />
          <p className="hud mt-2.5 text-ink-3">
            Figures from the characteristics table · traces are indicative, not a live feed
          </p>
        </div>
      </Container>

      {/* The stack, running. Full-bleed on purpose: it is the one band that
          crosses the whole sheet, which is what makes it read as a ticker
          rather than as another list inside the measure. It pauses on hover
          so an item can actually be read, and it is aria-hidden because the
          same names are set as a proper list in Technical depth below. */}
      <Marquee items={skills.flatMap((g) => g.items)} />
      {/* The problem domains, running the other way. Counter-motion is what
          makes two bands read as a machine rather than as one strip sliding
          past twice. */}
      <div className="marquee-back">
        <Marquee items={expertise.flatMap((e) => e.tags)} />
      </div>
    </section>
  );
}

/* ── Characteristics ─────────────────────────────────────────────────────────
   The page's central evidence. Nine measured values, each with its unit and
   the condition it holds under, so a reader cannot take a figure without also
   taking where it came from.
   ─────────────────────────────────────────────────────────────────────────── */

export function Characteristics() {
  return (
    <Section
      id="characteristics"
      title="Characteristics"
      lead="Every figure on this page, with the condition it was measured under."
    >
      <div className="tbl-scroll" data-reveal>
        <table className="tbl min-w-[44rem]">
          <caption className="sr-only">
            Measured characteristics, with symbol, value, unit and test conditions
          </caption>
          <thead>
            <tr className="spec-label">
              <th scope="col">Parameter</th>
              <th scope="col" className="w-14">
                Sym
              </th>
              <th scope="col" className="w-28 text-right">
                Value
              </th>
              <th scope="col" className="w-24">
                Unit
              </th>
              <th scope="col">Conditions</th>
            </tr>
          </thead>
          <tbody data-rows>
            {characteristics.map((c) => (
              <tr key={c.parameter}>
                <th scope="row" className="text-left text-[0.875rem] font-normal text-ink">
                  {c.parameter}
                </th>
                <td className="spec-datum text-ink-3">{c.symbol ?? "—"}</td>
                <td className="spec-value whitespace-nowrap text-right text-[1.0625rem]">
                  <Ticker value={c.value} />
                </td>
                <td className="spec-datum text-ink-3">{c.unit}</td>
                <td className="tbl-cond spec-datum text-ink-3">{c.conditions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* ── Block diagram ───────────────────────────────────────────────────────────
   The pairing, drawn as one circuit instead of argued as two sections. The
   organisation half is the input stage, the systems half is the output stage,
   and the evaluation framework closes the loop back onto the architecture.

   Authored SVG at a fixed viewBox, scrolling inside its own container on a
   narrow viewport — a drawing you pan sideways is native to this document
   form, and it keeps the sheet itself from ever scrolling horizontally.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * SVG text takes its face and weight from an inline style, never from the
 * `.spec-*` classes. Those classes set `font-size`, and CSS beats an SVG
 * presentation attribute, so a class here silently overrides every `fontSize`
 * in the drawing.
 */
const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
  fontWeight: 600,
  letterSpacing: "-0.012em",
  fill: "var(--ink)",
};
const DATUM: React.CSSProperties = {
  fontFamily: "var(--font-chivo-mono), ui-monospace, monospace",
  fontWeight: 400,
  fill: "var(--ink-2)",
};

export function BlockDiagram() {
  const W = 232;
  const GAP = 30;
  const Y = 34;
  const H = 62;

  return (
    <Section
      id="diagram"
      title="Block diagram"
      lead="The two halves are one circuit: strategy funds the team, the team builds the architecture, and evaluation closes the loop."
    >
      {/* Plain stock, not the reticule: a block diagram is drawn on a plate,
          and the graph grid is reserved for the measurement surface above. */}
      <div className="tbl-scroll plate" data-rise>
        <svg
          viewBox={`0 0 ${4 * W + 3 * GAP + 48} 250`}
          className="h-auto w-full min-w-[52rem]"
          role="img"
          aria-label="Block diagram: AI strategy and funding feeds the team, which builds the reference architecture, which produces the production systems; evaluation and benchmarking feeds back from the production systems onto the reference architecture."
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 10 5 0 10Z" style={{ fill: "var(--ink)" }} />
            </marker>
          </defs>

          {blockStages.map((s, i) => {
            const x = 24 + i * (W + GAP);
            const last = i === blockStages.length - 1;
            return (
              <g key={s.label}>
                <rect
                  x={x}
                  y={Y}
                  width={W}
                  height={H}
                  strokeWidth={last ? 2 : 1.5}
                  /* Each stage takes the signal a beat after the one before
                     it. The last stage is already drawn in the trace — it is
                     the output, and it stays lit. */
                  className={last ? undefined : "circuit-stage"}
                  style={{
                    fill: "var(--stock-plate)",
                    stroke: last ? "var(--trace)" : "var(--ink)",
                    ["--d" as string]: `${i * 1.5}s`,
                  }}
                />
                <text x={x + 14} y={Y + 27} fontSize="14" style={LABEL}>
                  {s.label}
                </text>
                <text x={x + 14} y={Y + 47} fontSize="12" style={DATUM}>
                  {s.datum}
                </text>
                {!last && (
                  <line
                    x1={x + W}
                    y1={Y + H / 2}
                    x2={x + W + GAP - 2}
                    y2={Y + H / 2}
                    strokeWidth={1.5}
                    markerEnd="url(#arrow)"
                    style={{ stroke: "var(--ink)" }}
                  />
                )}
              </g>
            );
          })}

          {/* The signal. Its legs are built from the same constants the
              drawing is built from, so editing the layout moves the packets
              with it — the geometry is never restated.

              Drawn before the feedback group and after the stages, which in
              SVG paint order means over the connectors but under the
              evaluation block. A packet therefore disappears into that block
              and comes out the other side, which is what the diagram is
              claiming happens. Painted last, it slid across the block's own
              label and read as a stray dot on the text. */}
          {(() => {
            const xArch = 24 + 2 * (W + GAP);
            const xProd = 24 + 3 * (W + GAP);
            const yBus = 186;
            const forward = blockStages.slice(0, -1).map((_, i) => {
              const x = 24 + i * (W + GAP);
              return `M ${x + W} ${Y + H / 2} H ${x + W + GAP - 2}`;
            });
            const feedback =
              `M ${xProd + W / 2} ${Y + H} V ${yBus} ` +
              `H ${xArch + W / 2} V ${Y + H + 2}`;
            return <CircuitPackets forward={forward} feedback={feedback} />;
          })()}

          {/* The feedback path: down from the production systems, back along
              the sheet, and up into the reference architecture. */}
          {(() => {
            const xArch = 24 + 2 * (W + GAP);
            const xProd = 24 + 3 * (W + GAP);
            const yBus = 186;
            const fbX = xArch + 26;
            const fbW = W + GAP - 52;
            return (
              <g>
                <path
                  d={`M ${xProd + W / 2} ${Y + H} V ${yBus}`}
                  strokeWidth={1.5}
                  style={{ fill: "none", stroke: "var(--ink)" }}
                />
                <path
                  d={`M ${xProd + W / 2} ${yBus} H ${xArch + W / 2}`}
                  strokeWidth={1.5}
                  style={{ fill: "none", stroke: "var(--ink)" }}
                />
                <path
                  d={`M ${xArch + W / 2} ${yBus} V ${Y + H + 2}`}
                  strokeWidth={1.5}
                  markerEnd="url(#arrow)"
                  style={{ fill: "none", stroke: "var(--ink)" }}
                />
                <rect
                  x={fbX}
                  y={yBus - 28}
                  width={fbW}
                  height={56}
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                  style={{ fill: "var(--stock-plate)", stroke: "var(--ink)" }}
                />
                <text x={fbX + 13} y={yBus - 6} fontSize="13" style={LABEL}>
                  {blockFeedback.label}
                </text>
                <text x={fbX + 13} y={yBus + 15} fontSize="12" style={DATUM}>
                  {blockFeedback.datum}
                </text>
              </g>
            );
          })()}

        </svg>
      </div>
    </Section>
  );
}

/* ── Work ────────────────────────────────────────────────────────────────────
   The featured system gets a plate and room to explain itself; the other three
   are a ruled register beneath it. Four identical cards would have claimed all
   four mattered equally, and a grid of same-size cards was the scaffold the
   previous world was built out of.
   ─────────────────────────────────────────────────────────────────────────── */

function StackLine({ items }: { items: string[] }) {
  return <p className="spec-datum mt-3 text-ink-3">{items.join("  ·  ")}</p>;
}

export function Work() {
  const [featured, ...rest] = projects;

  return (
    <Section
      id="work"
      title="Selected work"
      lead="Systems taken from architecture through to production."
    >
      <Tilt>
        <div className="panel bracket plate-live p-6 sm:p-8" data-rise>
        <p className="hud mb-4 flex items-center gap-2">
          <span aria-hidden className="size-1.5 bg-volt" />
          <span className="hud-on">Featured system</span>
        </p>
        <div className="grid gap-6 sm:grid-cols-[1fr_1px_1fr] sm:gap-10">
          <div>
            <h3 className="spec-head text-xl sm:text-[1.375rem]">{featured.title}</h3>
            <p className="mt-3.5 text-[0.9375rem] leading-[1.65] text-ink-2">
              {featured.summary}
            </p>
            <StackLine items={featured.stack} />
          </div>
          <div aria-hidden className="rule-hair-v hidden self-stretch sm:block" />
          <p className="max-w-[70ch] text-[0.9375rem] leading-[1.65] text-ink-2">
            {featured.detail}
          </p>
        </div>

        {/* The claim, running. This system's whole argument is that four
            stages of a spoken turn fit inside 800 ms over telephony, and
            this is that budget being spent in real time — the most animated
            thing on the page after the terminal, and also the most
            informative, which is the order those two have to come in. */}
        <div className="mt-7">
          <LatencyBudget />
        </div>
        </div>
      </Tilt>

      <ul className="mt-10">
        {rest.map((p, i) => (
          <li
            key={p.slug}
            data-slide
            className="row-live grid gap-x-10 gap-y-2 border-t border-reticule-2 py-6 sm:grid-cols-[1fr_1.35fr]"
          >
            <h3 className="spec-head flex items-baseline gap-3 text-[1.0625rem]">
              <span aria-hidden className="sec-index">
                {String(i + 2).padStart(2, "0")}
              </span>
              {p.title}
            </h3>
            <div className="min-w-0">
              <p className="max-w-[70ch] text-[0.9375rem] leading-[1.65] text-ink-2">
                {p.summary}
              </p>
              <p className="mt-2 max-w-[74ch] text-[0.875rem] leading-[1.6] text-ink-3">
                {p.detail}
              </p>
              <StackLine items={p.stack} />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── Leadership ──────────────────────────────────────────────────────────────
   Four claims, each with the one measurable fact under it. A leadership claim
   without a number is a personality description.
   ─────────────────────────────────────────────────────────────────────────── */

export function Leadership() {
  return (
    <Section
      id="leadership"
      title="Leadership"
      lead="Teams, architecture and strategy — the work that outlasts any one model."
    >
      <ul>
        {leadership.map((pillar, i) => (
          <li
            key={pillar.title}
            data-slide
            className={`row-live grid gap-x-10 gap-y-2.5 py-6 sm:grid-cols-[1fr_1.35fr] ${
              i > 0 ? "border-t border-reticule-2" : "pt-0"
            }`}
          >
            <div>
              <h3 className="spec-head text-[1.0625rem]">{pillar.title}</h3>
              <p className="spec-datum mt-2 text-trace">{pillar.proof}</p>
            </div>
            <p className="max-w-[70ch] text-[0.9375rem] leading-[1.65] text-ink-2">
              {pillar.detail}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── Technical depth ─────────────────────────────────────────────────────── */

export function Expertise() {
  return (
    <Section
      id="expertise"
      title="Technical depth"
      lead="Where the systems above were actually hard, and what I learned holding them up."
    >
      <ul>
        {expertise.map((area, i) => (
          <li
            key={area.title}
            data-slide
            className={`row-live grid gap-x-10 gap-y-2 py-6 sm:grid-cols-[1fr_1.35fr] ${
              i > 0 ? "border-t border-reticule-2" : "pt-0"
            }`}
          >
            <div>
              <h3 className="spec-head text-[1.0625rem]">{area.title}</h3>
              <p className="spec-datum mt-2 text-ink-3">{area.tags.join("  ·  ")}</p>
            </div>
            <p className="max-w-[70ch] text-[0.9375rem] leading-[1.65] text-ink-2">
              {area.detail}
            </p>
          </li>
        ))}
      </ul>

      {/* The toolchain as a reference table, not a wall of chips. */}
      <div className="mt-12" data-reveal>
        <FieldLabel>Toolchain</FieldLabel>
        <div className="tbl-scroll mt-3">
          <table className="tbl min-w-[36rem]">
            <thead>
              <tr className="spec-label">
                <th scope="col" className="w-52">
                  Group
                </th>
                <th scope="col">Tools</th>
              </tr>
            </thead>
            <tbody data-rows>
              {skills.map((g) => (
                <tr key={g.title}>
                  <th scope="row" className="text-left text-[0.875rem] font-normal text-ink">
                    {g.title}
                  </th>
                  <td className="spec-datum text-ink-2">
                    <span className="block max-w-[72ch]">{g.items.join("  ·  ")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

/* ── Experience ──────────────────────────────────────────────────────────────
   Dated, in a fixed mono date column: the revision-history shape, which is how
   a reference document states what changed and when.
   ─────────────────────────────────────────────────────────────────────────── */

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      {/* The spine fills as the list is scrolled and each role's node lights
          as it passes the reading line. The revision-history list underneath
          is unchanged — this makes the passage of time visible while you are
          moving through it, and carries no information of its own. */}
      <ol className="timeline relative pl-8">
        <TimelineSpine />
        {roles.map((r, i) => (
          <li
            key={r.title}
            data-slide
            className={`relative grid gap-x-10 gap-y-4 sm:grid-cols-[10.5rem_1fr] ${
              i > 0 ? "mt-10 border-t border-reticule-2 pt-10 sm:mt-12 sm:pt-12" : ""
            }`}
          >
            <span
              aria-hidden
              className="timeline-node"
              style={{ top: i > 0 ? "2.85rem" : "0.35rem" }}
            />
            <div className="flex flex-wrap items-center gap-3 sm:block">
              <p className="spec-datum whitespace-nowrap text-ink-3">
                {r.start} — {r.end}
              </p>
              {r.current && (
                <p className="spec-label mt-0 inline-flex items-center gap-1.5 border border-trace px-1.5 py-1 text-trace sm:mt-3">
                  <span aria-hidden className="size-1 shrink-0 bg-trace" />
                  Current
                </p>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="spec-head text-[1.125rem] sm:text-xl">{r.title}</h3>
              <p className="mt-1 text-[0.9375rem] text-ink-2">{r.org}</p>
              <p className="spec-datum mt-2.5 text-ink-3">{r.scope}</p>
              <ul className="measure mt-4 space-y-2">
                {r.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex gap-3 text-[0.9375rem] leading-[1.6] text-ink-2"
                  >
                    <SquareBullet />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ── About ───────────────────────────────────────────────────────────────── */

export function About() {
  return (
    <Section id="about" title="About">
      <div className="grid gap-12 sm:grid-cols-[1.3fr_1fr] sm:gap-14">
        <div data-reveal className="measure space-y-4 text-[0.9375rem] leading-[1.7] text-ink-2">
          <p>
            I started in computer vision, building detection and segmentation systems for
            geospatial defence work where a false positive has a real cost. That taught me to
            care about evaluation before anything else.
          </p>
          <p>
            Since then I have mostly been building AI functions rather than just models. At
            Basal Analytics I was the first AI hire and built the practice from nothing —
            including writing the strategy that secured the grants and incubation funding to
            pay for it. Today I lead an 18-engineer team shipping enterprise GenAI: retrieval
            over large document sets, agentic workflows, and real-time voice.
          </p>
          <p>
            The part I care about most is the boring part — evaluation frameworks, reference
            architectures, MLOps standards. Models are easy to demo and hard to keep working.
            My job as a lead is to make those the default an engineer inherits, not something
            they have to argue for.
          </p>
        </div>

        {/* The résumé, given a plate of its own: it is the deliverable a
            hiring team actually forwards. */}
        <div data-rise className="plate plate-live flex flex-col p-6">
          <h3 className="spec-head text-[1.0625rem]">Full résumé</h3>
          <p className="mt-2.5 text-[0.875rem] leading-[1.6] text-ink-2">
            Every role, project and figure on this page, in one page of PDF — the version to
            forward to a hiring team.
          </p>
          <dl className="mt-5">
            {[
              ["Role", site.role],
              ["Based in", site.location],
              ["Format", "PDF · 1 page"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-6 border-t border-reticule py-2.5"
              >
                <dt className="spec-label text-ink-3">{k}</dt>
                <dd className="spec-datum text-right text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto pt-6">
            <a href={site.resume} download className="key key-primary w-full">
              <DownloadIcon />
              Download résumé
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="key key-quiet mt-1 w-full"
            >
              View in browser
              <ArrowOut className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ── Contact ─────────────────────────────────────────────────────────────────
   Where a datasheet puts ordering information: last, and unambiguous.
   ─────────────────────────────────────────────────────────────────────────── */

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20">
      <Container className="pt-16 sm:pt-24">
        <div className="flex items-baseline gap-3 pb-2.5" data-reveal>
          <span aria-hidden className="sec-index">
            {String(sheets.findIndex((sh) => sh.id === "contact") + 1).padStart(2, "0")}
          </span>
          <Scramble as="h2" className="spec-section" text="Contact" />
        </div>
        <div data-wipe>
          <div role="separator" className="rule-ink rule-scan" />
        </div>
        <div className="callout bracket mt-8 grid gap-10 sm:grid-cols-[1.3fr_1fr] sm:gap-14">
          <div>
            <p className="hud mb-4 flex items-center gap-2" data-reveal>
              <span aria-hidden className="size-1.5 bg-volt" />
              <span className="hud-on">{site.availability}</span>
            </p>
            <p className="spec-head max-w-[26ch] text-[1.75rem] sm:text-[2.25rem]">
              <Words text="If you are hiring for AI leadership, I would like to hear from you." />
            </p>
            <p className="measure mt-4 text-[0.9375rem] leading-[1.65] text-ink-2" data-reveal>
              Equally happy to talk about building GenAI systems that hold up in production —
              retrieval, agents, real-time voice, and the evaluation that keeps them honest.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2" data-reveal>
              <a href={`mailto:${site.email}`} className="key key-primary">
                <MailIcon />
                {site.email}
              </a>
              <a href={site.resume} download className="key key-secondary">
                <DownloadIcon />
                Download résumé
              </a>
            </div>
          </div>

          <dl className="panel h-fit p-5" data-rise>
            {[
              ["Email", site.email, `mailto:${site.email}`],
              ["LinkedIn", "shreenivas-joshi", site.linkedin],
              ["Based in", site.location, null],
            ].map(([k, v, href]) => (
              <div
                key={k as string}
                className="flex items-baseline justify-between gap-4 border-t border-reticule-2 py-2.5 first:border-t-0 first:pt-0"
              >
                <dt className="spec-label text-ink-3">{k}</dt>
                <dd className="spec-datum min-w-0 break-words text-right">
                  {href ? (
                    <a
                      href={href as string}
                      target={k === "LinkedIn" ? "_blank" : undefined}
                      rel={k === "LinkedIn" ? "noopener noreferrer" : undefined}
                      className="link"
                    >
                      {v}
                    </a>
                  ) : (
                    <span className="text-ink-2">{v}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

/* ── Running foot ────────────────────────────────────────────────────────────
   A document's foot, not a website's footer: the subject, the seat, and the
   revision date of the sheet.
   ─────────────────────────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="mt-20 sm:mt-24">
      {/* The document's closing rule draws itself like every other rule here,
          rather than being a border that is simply present. */}
      <div role="separator" className="rule-ink foot-rule" data-reveal />
      <Container className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="spec-datum text-ink-2">
          {site.name} &nbsp;·&nbsp; {site.role}
        </p>
        <p className="spec-label text-ink-3">
          Rev. <Year /> &nbsp;·&nbsp; {site.location}
        </p>
      </Container>
    </footer>
  );
}
