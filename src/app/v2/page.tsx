import {
  expertise,
  leadership,
  projects,
  railFigures,
  roles,
  site,
  skills,
} from "@/lib/content";
import { Copy, CriticalPath, Head, Reveal } from "./_components/Chrome";
import { stackOrder } from "./_components/die";
import { Floorplan } from "./_components/Floorplan";
import { BUDGET_MS, CEILING_MS } from "./_components/turn";

/**
 * The die.
 *
 * Same person, same résumé, a third object — and the first two are the reason
 * for this one. A dark console read as generic because every AI tool ships
 * that look; a record sleeve read as basic because its whole grammar is
 * restraint. This page answers the brief it was actually given: dense,
 * layered, technical, and alive at the top.
 *
 * The conceit is load-bearing rather than decorative. An architect's job is
 * floorplanning — deciding which blocks exist, how they connect, and which
 * path is critical — so the work is laid out as macros on one die, the
 * organisation is drawn on the same silicon as the technical surface because
 * that pairing is the argument, the latency budget is the critical path with
 * real charge running it, the skills are a metal stack in cross-section, and
 * the contact details are a pinout.
 *
 * The rule kept from every version of this route: nothing moves that is not
 * also explained, and every figure is from the résumé.
 */

/** Which layer of the stack each skill group is printed on. */
const LAYERS: { id: string; tier: "metal" | "poly" | "implant" }[] = [
  { id: "M6", tier: "metal" },
  { id: "M5", tier: "metal" },
  { id: "M4", tier: "metal" },
  { id: "M3", tier: "metal" },
  { id: "M2", tier: "metal" },
  { id: "M1", tier: "metal" },
  { id: "POLY", tier: "poly" },
  { id: "DIFF", tier: "implant" },
];

export default function Die() {
  const [first, ...rest] = site.name.split(" ");
  const layers = stackOrder
    .map((title, i) => ({ ...LAYERS[i], group: skills.find((g) => g.title === title) }))
    .filter((l) => l.group);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-[#57e0d4] focus:px-4 focus:py-2 focus:text-sm focus:text-[#03181b]"
      >
        Skip to content
      </a>

      <Head />

      <main id="main">
        {/* ── The die ───────────────────────────────────────────────────── */}
        <section className="d-hero">
          <div className="d-id">
            <p className="d-live">
              <i aria-hidden />
              <span className="d-mono">{site.availability}</span>
            </p>

            <h1 className="d-name">
              {first}
              <em>{rest.join(" ")}</em>
            </h1>
            <p className="d-role">{site.role}</p>

            <p className="d-claim">{site.tagline}</p>
            <p className="d-intro">{site.intro}</p>

            <div className="d-acts">
              <a className="d-key d-key--live" href={`mailto:${site.email}`}>
                Start a conversation
              </a>
              <a className="d-key" href={site.resume}>
                Résumé
              </a>
            </div>
          </div>

          <Floorplan />
        </section>

        <div className="d-strip">
          {railFigures.map((f) => (
            <div key={f.label}>
              <b>
                {f.value}
                <i>{f.unit}</i>
              </b>
              <small>{f.label}</small>
            </div>
          ))}
        </div>

        {/* ── Critical path ─────────────────────────────────────────────── */}
        <section id="path" className="d-shell d-sec">
          <div className="d-sec-head">
            <h2 className="d-h">The critical path</h2>
            <p className="d-mono">
              {BUDGET_MS} of {CEILING_MS} ms
            </p>
          </div>
          <hr className="d-rule" />
          <p className="d-prose d-sec-sub">
            Real-time voice is the hardest claim on this page, so it is the one the page opens.
            Six services, one clock, and a ceiling at {CEILING_MS} ms — above that a conversation
            stops feeling like a conversation. Pick a leg for what it does and the decision that
            keeps it inside its slice.
          </p>
          <div className="d-in">
            <CriticalPath />
          </div>
          <p className="d-prose" style={{ marginTop: 26 }}>
            Nothing here is fast because a fast model was chosen. Each hop was given a ceiling
            first and then built to fit, work was moved off the critical path wherever it could
            start early, and the two hops nobody controls — the caller&rsquo;s pause and the
            carrier — were reserved before any service got to spend. The charge crossing the die
            above runs this same budget; it is a design, not a live probe.
          </p>
        </section>

        {/* ── Work ──────────────────────────────────────────────────────── */}
        <section id="blocks" className="d-shell d-sec">
          <div className="d-sec-head">
            <h2 className="d-h">Selected work</h2>
            <p className="d-mono">Four systems in production</p>
          </div>
          <hr className="d-rule" />
          <p className="d-prose d-sec-sub">
            Each one shipped, with the interfaces it actually runs on listed underneath.
          </p>
          <div className="d-blocks d-in">
            {projects.map((p, i) => (
              <article key={p.slug} className="d-block">
                <div className="d-block-top">
                  <h3>{p.title}</h3>
                  <span className="d-block-ref">U{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p>{p.summary}</p>
                <p className="d-block-detail">{p.detail}</p>
                <div className="d-pins">
                  {p.stack.map((s, n) => (
                    <div key={s}>
                      <span>{n + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Organisation ──────────────────────────────────────────────── */}
        <section id="org" className="d-shell d-sec">
          <div className="d-sec-head">
            <h2 className="d-h">The blocks that are not code</h2>
            <p className="d-mono">Implant layer</p>
          </div>
          <hr className="d-rule" />
          <p className="d-prose d-sec-sub">
            An architecture is only as durable as the organisation running it. Four things I own
            besides the systems, each tied to the one fact that stands behind it.
          </p>
          <div className="d-org d-in">
            {leadership.map((pillar) => (
              <article key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.detail}</p>
                <p className="d-org-proof">{pillar.proof}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Depth ─────────────────────────────────────────────────────── */}
        <section id="stack" className="d-shell d-sec">
          <div className="d-sec-head">
            <h2 className="d-h">Depth, layer by layer</h2>
            <p className="d-mono">Six areas · full stack</p>
          </div>
          <hr className="d-rule" />
          <p className="d-prose d-sec-sub">
            What I can be interviewed on to depth, each with the production evidence behind it
            rather than a claim of familiarity — then the whole surface underneath, read as a
            cross-section: coarse routing at the top, fine structure at the bottom.
          </p>

          <div className="d-blocks d-blocks--three d-in" style={{ marginBottom: 26 }}>
            {expertise.map((e) => (
              <article key={e.title} className="d-block">
                <div className="d-block-top">
                  <h3>{e.title}</h3>
                </div>
                <p>{e.detail}</p>
                <div className="d-pins">
                  {e.tags.map((t, n) => (
                    <div key={t}>
                      <span>{n + 1}</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="d-stack d-in">
            {layers.map((l) => (
              <div key={l.id} className="d-layer" data-tier={l.tier}>
                <span className="d-layer-id">
                  <b aria-hidden />
                  {l.id}
                </span>
                <span className="d-layer-name">{l.group!.title}</span>
                <span className="d-layer-items">{l.group!.items.join("  ·  ")}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Experience ────────────────────────────────────────────────── */}
        <section id="revs" className="d-shell d-sec">
          <div className="d-sec-head">
            <h2 className="d-h">Revisions</h2>
            <p className="d-mono">Three seats · five years</p>
          </div>
          <hr className="d-rule" />
          <div className="d-revs d-in" style={{ marginTop: 26 }}>
            {roles.map((role, i) => (
              <article key={role.org} className="d-rev">
                <div className="d-rev-meta">
                  {role.current ? <span className="d-rev-live">Current seat</span> : null}
                  <span className="d-rev-when">
                    {role.start} — {role.end}
                  </span>
                  <span className="d-rev-org">{role.orgShort ?? role.org}</span>
                  <span className="d-mono">rev {roles.length - i}.0</span>
                </div>
                <div>
                  <h3>{role.title}</h3>
                  <p className="d-rev-scope">{role.scope}</p>
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
      </main>

      {/* ── Pinout ──────────────────────────────────────────────────────── */}
      <footer id="contact" className="d-out">
        <div className="d-shell d-out-in">
          <div>
            <h2>
              Open to leadership
              <br />
              <em>positions in AI</em>
            </h2>
            <p>
              If you are putting an AI function on the map — or you have one and it is not
              shipping — that is the conversation I want. Email is fastest.
            </p>
            <div className="d-acts">
              <a className="d-key d-key--live" href={`mailto:${site.email}`}>
                Email {first}
              </a>
              <a className="d-key" href={site.resume}>
                Download résumé
              </a>
            </div>
          </div>

          <div className="d-pinout">
            <div className="d-pin">
              <span className="n">01</span>
              <span className="k">Email</span>
              <a className="v" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <Copy value={site.email} label="email" />
            </div>
            <div className="d-pin">
              <span className="n">02</span>
              <span className="k">LinkedIn</span>
              <a className="v" href={site.linkedin} rel="noopener noreferrer" target="_blank">
                /in/shreenivas-joshi
              </a>
              <span />
            </div>
            <div className="d-pin">
              <span className="n">03</span>
              <span className="k">Résumé</span>
              <a className="v" href={site.resume}>
                Shreenivas_Joshi_Resume.pdf
              </a>
              <span />
            </div>
            <div className="d-pin">
              <span className="n">04</span>
              <span className="k">Located</span>
              <span className="v">{site.location}</span>
              <span />
            </div>
            <div className="d-pin">
              <span className="n">05</span>
              <span className="k">Status</span>
              <span className="v" style={{ color: "var(--d-via-ink)" }}>
                {site.availability}
              </span>
              <span />
            </div>
          </div>
        </div>

        <div className="d-shell d-colophon">
          <p>
            {site.name} · {site.role}
          </p>
          <p>
            Every figure on this page is taken from the résumé. The charge crossing the die runs
            a designed latency budget, not live traffic.
          </p>
        </div>
      </footer>

      <Reveal />
    </>
  );
}
