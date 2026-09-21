import { railFigures, roles } from "@/lib/content";

/**
 * Charts.
 *
 * Every figure drawn here is already written somewhere on the page — team
 * sizes, grant amounts, seat dates. Nothing is estimated and nothing is
 * scored: there are no invented ratings, no percentages of mastery, no radar
 * of self-assessed skill. A chart that plots an opinion is worse than the
 * sentence it replaced.
 *
 * All of it is server-rendered SVG and CSS. The only motion is a signal on a
 * path, and it stops under `prefers-reduced-motion`.
 */

/* ── The team, over time ──────────────────────────────────────────────────
   Three points, all from the résumé: the first AI hire at Basal Analytics
   joining a team of six, that team at ten by the time he left, and eighteen
   at HB Software Solutions today. Drawn as steps rather than a curve because
   headcount moves in whole people.
   ─────────────────────────────────────────────────────────────────────── */

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Oct 2021" → months since 2000. "Present" → now. */
function monthIndex(label: string): number {
  if (/present/i.test(label)) {
    const now = new Date();
    return (now.getFullYear() - 2000) * 12 + now.getMonth();
  }
  const [mon, year] = label.trim().split(/\s+/);
  const m = MONTHS.indexOf(mon.slice(0, 3).toLowerCase());
  return (Number(year) - 2000) * 12 + (m < 0 ? 0 : m);
}

const HEADS = [
  { at: "Jun 2022", n: 6, note: "First AI hire" },
  { at: "Jul 2025", n: 10, note: "Grown 6 → 10" },
  { at: "Aug 2025", n: 18, note: "Current seat" },
] as const;

/** The point tip, in the chart's own coordinate space. */
const TIP_W = 150;
const TIP_H = 64;

export function TeamCurve() {
  const W = 460;
  const H = 200;
  const padL = 26;
  const padB = 34;
  const max = 20;

  const t0 = monthIndex(HEADS[0].at);
  const now = monthIndex("Present");
  const span = Math.max(1, now - t0);
  const x = (at: string) => padL + ((monthIndex(at) - t0) / span) * (W - padL - 16);
  const right = padL + (W - padL - 16);
  const y = (n: number) => H - padB - (n / max) * (H - padB - 18);

  // A step path: hold the level, then rise, so the shape reads as hires rather
  // than as a smooth trend nobody actually experienced. The last level is held
  // out to today, because it is still true.
  const step = `${HEADS.map((h, i) =>
    i === 0 ? `M${x(h.at)} ${y(h.n)}` : `H${x(h.at)} V${y(h.n)}`,
  ).join(" ")} H${right}`;
  const area = `${step} V${H - padB} H${x(HEADS[0].at)} Z`;

  return (
    <figure className="cn-chart" aria-label="Team size: six engineers when he joined as the first AI hire, ten by the end of that seat, eighteen today.">
      <figcaption className="cn-chart-head">
        <span className="cn-label">Team</span>
        <span className="cn-chart-value">
          18<i>engineers today</i>
        </span>
      </figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} className="cn-chart-svg" aria-hidden>
        {[0, 10, 20].map((n) => (
          <g key={n}>
            <line className="cn-grid" x1={padL} y1={y(n)} x2={W - 16} y2={y(n)} vectorEffect="non-scaling-stroke" />
            <text className="cn-tick" x={padL - 8} y={y(n) + 4} textAnchor="end">
              {n}
            </text>
          </g>
        ))}

        <path className="cn-chart-area" d={area} />
        <path className="cn-step" d={step} vectorEffect="non-scaling-stroke" />
        <path className="cn-step cn-step--live" d={step} vectorEffect="non-scaling-stroke" />

        {HEADS.map((h, i) => {
          /* The tip is anchored away from the edge it is nearest, so it never
             hangs off the plot: left-aligned at the first point, right-aligned
             at the last, centred in between. */
          const anchor = i === 0 ? -12 : i === HEADS.length - 1 ? -TIP_W + 12 : -TIP_W / 2;
          /* A point near the top of the plot has no room above it, so its tip
             hangs below instead of being clipped by the frame. */
          const above = y(h.n) > TIP_H + 24;
          const top = above ? -TIP_H - 14 : 14;
          return (
            <g className="cn-pt" key={h.at}>
              {/* A hit area larger than the dot: a 4px target is not a target. */}
              <circle className="cn-pt-hit" cx={x(h.at)} cy={y(h.n)} r={16} />
              <circle className="cn-dot" cx={x(h.at)} cy={y(h.n)} r={4} />

              <g className="cn-pt-tip" transform={`translate(${x(h.at)} ${y(h.n)})`}>
                <rect className="cn-pt-box" x={anchor} y={top} width={TIP_W} height={TIP_H} rx={4} />
                <text className="cn-pt-when" x={anchor + 12} y={top + 19}>
                  {h.at}
                </text>
                <text className="cn-pt-n" x={anchor + 12} y={top + 41}>
                  {h.n}
                  <tspan className="cn-pt-unit" dx={5}>
                    engineers
                  </tspan>
                </text>
                <text className="cn-pt-note" x={anchor + 12} y={top + 57}>
                  {h.note}
                </text>
              </g>
            </g>
          );
        })}
        <text className="cn-tick" x={right} y={H - padB + 20} textAnchor="end">
          Today
        </text>
      </svg>

      <ul className="cn-chart-key">
        {HEADS.map((h) => (
          <li key={h.at}>
            <b>{h.n}</b>
            <span>{h.note}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* ── The grants ───────────────────────────────────────────────────────────
   Roughly USD 50K, and the page already states the split. A stacked bar is
   the whole chart: three parts of one total, which is exactly what a reader
   wants to check.
   ─────────────────────────────────────────────────────────────────────── */

const GRANTS = [
  { name: "Azure", k: 25 },
  { name: "AWS", k: 20 },
  { name: "Google", k: 5 },
] as const;

export function GrantSplit() {
  const total = GRANTS.reduce((s, g) => s + g.k, 0);

  return (
    <figure className="cn-chart" aria-label="Cloud grants secured: about USD 25K Azure, 20K AWS and 5K Google, roughly 50K in total.">
      <figcaption className="cn-chart-head">
        <span className="cn-label">Cloud grants secured</span>
        <span className="cn-chart-value">
          ≈50<i>USD K</i>
        </span>
      </figcaption>

      <div className="cn-bar" aria-hidden>
        {GRANTS.map((g, i) => (
          <span key={g.name} className="cn-bar-seg" data-i={i} style={{ flexGrow: g.k }}>
            <span className="cn-bar-fill" />
          </span>
        ))}
      </div>

      <ul className="cn-chart-key cn-chart-key--split">
        {GRANTS.map((g, i) => (
          <li key={g.name}>
            <i className="cn-swatch" data-i={i} aria-hidden />
            <b>≈{g.k}K</b>
            <span>{g.name}</span>
          </li>
        ))}
      </ul>

      <p className="cn-chart-foot">
        {Math.round((GRANTS[0].k / total) * 100)}% of it on one provider, and none of it drawn
        from the engineering budget.
      </p>
    </figure>
  );
}

/* ── The seats, to scale ──────────────────────────────────────────────────
   The three roles as a rail, each segment as wide as the time actually spent
   in it. Dates come from `roles`; the open-ended one is measured to the build
   date, which moves the rail by a few pixels a month and nothing else.
   ─────────────────────────────────────────────────────────────────────── */

export function SeatRail() {
  const spans = roles
    .map((r) => ({ role: r, from: monthIndex(r.start), to: monthIndex(r.end) }))
    .sort((a, b) => a.from - b.from);

  const first = spans[0].from;
  const last = spans[spans.length - 1].to;
  const total = Math.max(1, last - first);
  const pct = (m: number) => ((m - first) / total) * 100;

  // A tick per January inside the span, so the rail is read against real years
  // rather than against its own length.
  const years: number[] = [];
  for (let y = Math.ceil(first / 12); y * 12 <= last; y += 1) years.push(y);

  /* The headline figure is the résumé's, not one derived from these three
     bars. Measuring the listed seats end to end gives 4.9 years and reads as a
     correction to the 5+ stated everywhere else on the page — the experience
     starts before the first seat listed here. The bars still carry their own
     true durations; only the total is quoted rather than computed. */
  const experience = railFigures.find((f) => f.label === "Experience in AI");

  return (
    <figure className="cn-rail">
      <figcaption className="cn-chart-head">
        <span className="cn-label">Seats, to scale</span>
        <span className="cn-chart-value">
          {experience?.value ?? "5+"}
          <i>{experience?.unit ?? "years"} in AI</i>
        </span>
      </figcaption>

      <div className="cn-rail-track">
        {years.map((y) => (
          <span key={y} className="cn-rail-tick" style={{ left: `${pct(y * 12)}%` }} aria-hidden>
            <i />
            <em>{2000 + y}</em>
          </span>
        ))}

        {spans.map((s) => (
          <span
            key={s.role.org}
            className="cn-rail-seg"
            data-current={s.role.current ? "1" : "0"}
            style={{ left: `${pct(s.from)}%`, width: `${((s.to - s.from) / total) * 100}%` }}
          >
            <span className="cn-rail-fill" aria-hidden />
            <span className="cn-rail-copy">
              <b>{s.role.title}</b>
              <i>
                {s.role.orgShort ?? s.role.org} · {s.to - s.from} mo
              </i>
            </span>
            {s.role.current ? <span className="cn-rail-now">Now</span> : null}
          </span>
        ))}
      </div>
    </figure>
  );
}

/* ── The surface ──────────────────────────────────────────────────────────
   Every named thing he works with, one cell each, grouped by row. It encodes
   nothing but presence — which is the honest encoding, since there is no
   score behind any of it — and what it shows at a glance is breadth.
   ─────────────────────────────────────────────────────────────────────── */

export function SkillField({ groups }: { groups: readonly { title: string; items: readonly string[] }[] }) {
  const count = groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <figure className="cn-field">
      <figcaption className="cn-chart-head">
        <span className="cn-label">The surface</span>
        <span className="cn-chart-value">
          {count}<i>named tools, models and methods</i>
        </span>
      </figcaption>

      <div className="cn-field-grid">
        {groups.map((g) => (
          <div key={g.title} className="cn-field-row">
            <span className="cn-field-label">{g.title}</span>
            <span className="cn-field-cells">
              {g.items.map((item) => (
                <span key={item} className="cn-cell" title={item}>
                  <span className="sr-only">{item}</span>
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
