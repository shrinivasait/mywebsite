import {
  expertise,
  leadership,
  projects,
  railFigures,
  roles,
  site,
  skills,
} from "@/lib/content";
import { Copy, Head, Reveal } from "./_components/Chrome";
import { Pipeline } from "./_components/Pipeline";
import { Topology } from "./_components/Topology";
import { Trace } from "./_components/Trace";
import { BUDGET_MS, CEILING_MS } from "./_components/turn";

/**
 * The console.
 *
 * Same person, same résumé, opposite argument. The primary route makes the
 * case as a printed specification: every claim a row, every row a measured
 * value with its test condition. This one makes it as a system you can watch
 * running — the hero is a live budget, the section under it is a trace you can
 * open span by span, and the work is drawn as topology rather than listed.
 *
 * The rule the whole route is built on: nothing animates that is not also
 * explained. Every instrument carries a note in half-technical English saying
 * what it is showing and where the number came from, because an architect's
 * site that impresses without explaining is arguing against its own claim.
 */

/** Section numbering, stated once, so the heads cannot drift out of order. */
const PARTS = {
  turn: "01",
  systems: "02",
  scale: "03",
  stack: "04",
  log: "05",
} as const;

export default function Runtime() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-[#c9f24d] focus:px-4 focus:py-2 focus:text-sm focus:text-[#0b1005]"
      >
        Skip to content
      </a>

      <Head />

      <main id="main">
        {/* ── Front ─────────────────────────────────────────────────────── */}
        <section className="rt-shell rt-hero">
          <div className="rt-hero-grid">
            <div>
              <p className="rt-status">
                <span className="rt-dot" aria-hidden />
                <span>{site.availability}</span>
              </p>

              <h1>
                I build production AI systems, and the <em>teams</em> that keep them running.
              </h1>

              <p className="rt-hero-sub">{site.intro}</p>

              <div className="rt-hero-acts">
                <a className="rt-btn rt-btn--key" href={`mailto:${site.email}`}>
                  Start a conversation
                </a>
                <a className="rt-btn" href={site.linkedin} rel="noopener noreferrer" target="_blank">
                  LinkedIn
                </a>
                <a className="rt-btn" href={site.resume}>
                  Résumé
                </a>
              </div>

              <div className="rt-rail">
                {railFigures.map((f) => (
                  <div key={f.label}>
                    <b className="rt-num">
                      {f.value}
                      <i>{f.unit}</i>
                    </b>
                    <small>{f.label}</small>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Pipeline />
              <p className="rt-note" style={{ marginTop: 18 }}>
                <b>What you are looking at.</b> One spoken turn of the phone-call negotiator,
                walking the six services it passes through, against the{" "}
                <code>{CEILING_MS} ms</code> ceiling a conversation stops feeling like a
                conversation above. The bars underneath are the last few turns — every fourth one
                runs hot, because a tail always exists and the honest thing is to draw it. These
                are the designed budgets, not a live probe.
              </p>
            </div>
          </div>
        </section>

        {/* ── 01 · Latency ──────────────────────────────────────────────── */}
        <section id="turn" className="rt-shell rt-sec">
          <div className="rt-sec-head">
            <span className="rt-idx">{PARTS.turn}</span>
            <h2>Where the {BUDGET_MS} milliseconds go</h2>
            <p>
              Real-time voice is the hardest thing on this page to claim, so it is the thing the
              page opens. Pick a span to see what that hop does and the decision that keeps it
              inside its slice.
            </p>
          </div>
          <Trace />
          <p className="rt-note" style={{ marginTop: 20 }}>
            <b>Why it is a budget and not a target.</b> Six services, one clock. Nothing here is
            fast because a fast model was chosen — it is fast because each hop was given a ceiling
            first and then built to fit, work was moved off the critical path wherever it could
            start early, and the two hops nobody controls (the caller&rsquo;s pause, the carrier)
            were reserved before any service got to spend.
          </p>
        </section>

        {/* ── 02 · Systems ──────────────────────────────────────────────── */}
        <section id="systems" className="rt-shell rt-sec">
          <div className="rt-sec-head">
            <span className="rt-idx">{PARTS.systems}</span>
            <h2>Systems, drawn as they run</h2>
            <p>
              Four production systems, each shown as the chain of components it actually is — the
              number of hops tells you more about a system than its name does.
            </p>
          </div>
          <div className="rt-systems rt-in">
            {projects.map((p, i) => (
              <article key={p.slug} className="rt-sys">
                <div className="rt-sys-top">
                  <h3>{p.title}</h3>
                  <span className="rt-mono">sys·{String(i + 1).padStart(2, "0")}</span>
                </div>
                <Topology stack={p.stack} />
                <p>{p.summary}</p>
                <p className="rt-sys-detail">{p.detail}</p>
                <div className="rt-sys-stack">
                  {p.stack.map((s) => (
                    <span key={s} className="rt-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 03 · Scale ────────────────────────────────────────────────── */}
        <section id="scale" className="rt-shell rt-sec">
          <div className="rt-sec-head">
            <span className="rt-idx">{PARTS.scale}</span>
            <h2>The part that is not code</h2>
            <p>
              An architecture is only as durable as the organisation running it. Four things I own
              besides the systems — each with the one fact underneath it that can be checked.
            </p>
          </div>
          <div className="rt-alloc">
            {leadership.map((pillar) => (
              <article key={pillar.title}>
                <div className="rt-meter" aria-hidden>
                  <i />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.detail}</p>
                <p className="rt-alloc-proof">{pillar.proof}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── 04 · Stack ────────────────────────────────────────────────── */}
        <section id="stack" className="rt-shell rt-sec">
          <div className="rt-sec-head">
            <span className="rt-idx">{PARTS.stack}</span>
            <h2>Depth, and where it came from</h2>
            <p>
              Six areas I can be interviewed on to depth, each with the production evidence behind
              it rather than a claim of familiarity — then the full surface underneath.
            </p>
          </div>

          <div className="rt-systems rt-in" style={{ marginBottom: 26 }}>
            {expertise.map((e) => (
              <article key={e.title} className="rt-sys">
                <div className="rt-sys-top">
                  <h3>{e.title}</h3>
                </div>
                <p>{e.detail}</p>
                <div className="rt-sys-stack">
                  {e.tags.map((t) => (
                    <span key={t} className="rt-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="rt-matrix rt-in">
            {skills.map((group) => (
              <section key={group.title} className="rt-cap">
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        {/* ── 05 · Record ───────────────────────────────────────────────── */}
        <section id="log" className="rt-shell rt-sec">
          <div className="rt-sec-head">
            <span className="rt-idx">{PARTS.log}</span>
            <h2>The record</h2>
            <p>Three seats in five years, read newest first, with the scope of each stated before the work.</p>
          </div>
          <div className="rt-log rt-in">
            {roles.map((role) => (
              <article key={role.org} className="rt-rel">
                <div className="rt-rel-meta">
                  {role.current ? (
                    <span className="rt-rel-live">
                      <span className="rt-dot" aria-hidden />
                      current
                    </span>
                  ) : null}
                  <span className="rt-rel-when">
                    {role.start} — {role.end}
                  </span>
                  <span className="rt-rel-org">{role.orgShort ?? role.org}</span>
                </div>
                <div>
                  <h3>{role.title}</h3>
                  <p className="rt-rel-scope">{role.scope}</p>
                  <ul>
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────────────────── */}
        <section id="contact" className="rt-shell rt-sec">
          <div className="rt-contact">
            <div>
              <h2>Open to leadership positions in AI.</h2>
              <p>
                If you are putting an AI function on the map — or you have one and it is not
                shipping — that is the conversation I want. Email is fastest.
              </p>
              <div className="rt-hero-acts">
                <a className="rt-btn rt-btn--key" href={`mailto:${site.email}`}>
                  Email {site.name.split(" ")[0]}
                </a>
                <a className="rt-btn" href={site.resume}>
                  Download résumé
                </a>
              </div>
            </div>

            <div className="rt-panel rt-card">
              <div className="rt-card-row">
                <span className="k">email</span>
                <a className="v rt-link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                <Copy value={site.email} label="email" />
              </div>
              <div className="rt-card-row">
                <span className="k">linkedin</span>
                <a className="v rt-link" href={site.linkedin} rel="noopener noreferrer" target="_blank">
                  /in/shreenivas-joshi
                </a>
                <span />
              </div>
              <div className="rt-card-row">
                <span className="k">based</span>
                <span className="v">{site.location}</span>
                <span />
              </div>
              <div className="rt-card-row">
                <span className="k">status</span>
                <span className="v" style={{ color: "var(--rt-sig-ink)" }}>
                  {site.availability}
                </span>
                <span />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="rt-shell rt-foot">
        <p>{site.name} · {site.role}</p>
        <p className="rt-spacer">
          Every figure on this page is from the résumé. The instruments draw designed budgets, not
          live traffic.
        </p>
      </footer>

      <Reveal />
    </>
  );
}
