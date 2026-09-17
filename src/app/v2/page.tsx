import Image from "next/image";
import {
  expertise,
  leadership,
  projects,
  railFigures,
  roles,
  site,
  skills,
} from "@/lib/content";
import { Copy, Head, Instrument, Reveal } from "./_components/Chrome";
import { BUDGET_MS, CEILING_MS } from "./_components/turn";

/**
 * The house.
 *
 * Three worlds preceded this one on this route — a console, a record sleeve
 * and a silicon die — and all three were drawings: hairlines, small tracked
 * labels, flat fills, no material. Clever, and cheap-looking. This one is
 * built from the things that actually read as expensive: deep blacks with
 * light falling across them, real elevation, one metal, a portrait treated as
 * a plate rather than an avatar, type at a scale that has to be set, and space
 * that is obviously paid for.
 *
 * What did not change: every figure is from the résumé, the argument is still
 * the pairing of architect and organisation-builder, and the one moving thing
 * on the page — the chronometer holding a spoken turn against its 800 ms
 * ceiling — is the real budget with its own caption saying exactly that.
 */

export default function House() {
  const [first, ...rest] = site.name.split(" ");

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-[#c9a15a] focus:px-4 focus:py-2 focus:text-sm focus:text-[#0a0a0b]"
      >
        Skip to content
      </a>

      <Head />

      <main id="main">
        {/* ── Opening ───────────────────────────────────────────────────── */}
        <section className="lx-shell lx-open">
          <div>
            <p className="lx-open-status">
              <i aria-hidden />
              <span className="lx-eyebrow">{site.availability}</span>
            </p>

            <h1 className="lx-display">
              {first} <em>{rest.join(" ")}</em>
            </h1>

            <hr className="lx-rule" />

            <p className="lx-lede">{site.tagline}</p>
            <p className="lx-body" style={{ marginTop: 22, marginBottom: 34 }}>
              {site.intro}
            </p>

            <div className="lx-acts">
              <a className="lx-cta lx-cta--solid" href={`mailto:${site.email}`}>
                Start a conversation
              </a>
              <a className="lx-cta" href={site.resume}>
                Download résumé
              </a>
            </div>
          </div>

          <figure className="lx-plate" style={{ margin: 0 }}>
            <Image
              src="/profile.jpg"
              alt={`${site.name}, ${site.role}`}
              width={860}
              height={996}
              priority
              sizes="(min-width: 1080px) 42vw, 100vw"
            />
            <figcaption>
              <b>{site.role}</b>
              <span>{site.location}</span>
            </figcaption>
          </figure>
        </section>

        {/* ── The figures ───────────────────────────────────────────────── */}
        <section className="lx-shell">
          <div className="lx-figures lx-in">
            {railFigures.map((f) => (
              <div key={f.label} className="lx-fig">
                <b>
                  {f.value}
                  <i>{f.unit}</i>
                </b>
                <small>{f.label}</small>
              </div>
            ))}
          </div>
        </section>

        {/* ── Work ──────────────────────────────────────────────────────── */}
        <section id="work" className="lx-shell lx-sec">
          <div className="lx-head-block lx-in">
            <div>
              <p className="lx-eyebrow">Selected work</p>
              <h2 className="lx-title" style={{ marginTop: 22 }}>
                Four systems, <em>in production</em>
              </h2>
            </div>
            <p className="lx-body">
              Every one of these shipped to production and is described by what it does and what
              it runs on — no demos, and no client names that cannot be published.
            </p>
          </div>

          <div className="lx-works lx-in">
            {projects.map((p, i) => (
              <article key={p.slug} className="lx-work">
                <a href="#contact">
                  <span className="lx-work-no">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.summary}</p>
                  </div>
                  <div>
                    <p className="lx-work-detail">{p.detail}</p>
                    <div className="lx-tags">
                      {p.stack.map((s) => (
                        <span key={s} className="lx-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* ── The instrument ────────────────────────────────────────────── */}
        <section id="latency" className="lx-shell lx-sec">
          <div className="lx-head-block lx-in">
            <div>
              <p className="lx-eyebrow">The hardest claim on this page</p>
              <h2 className="lx-title" style={{ marginTop: 22 }}>
                One spoken turn, <em>{BUDGET_MS} milliseconds</em>
              </h2>
            </div>
            <p className="lx-body">
              Real-time voice over telephony: six services against a single clock, with a ceiling
              at {CEILING_MS} ms — above that a conversation stops feeling like one. Take any hop
              for what it does and the decision that keeps it inside its slice.
            </p>
          </div>

          <Instrument />

          <p className="lx-small lx-in" style={{ marginTop: 26, maxWidth: "88ch" }}>
            The dial holds the designed budget rather than live traffic, and every fourth turn
            runs long in retrieval because a tail always exists and drawing it is more honest
            than a page that hides it. Nothing here is fast because a fast model was chosen: each
            hop was given a ceiling first and then built to fit, work was moved off the critical
            path wherever it could start early, and the two hops nobody controls — the
            caller&rsquo;s pause and the carrier — were reserved before any service got to spend.
          </p>
        </section>

        {/* ── Leadership ────────────────────────────────────────────────── */}
        <section id="leadership" className="lx-shell lx-sec">
          <div className="lx-head-block lx-in">
            <div>
              <p className="lx-eyebrow">The other half</p>
              <h2 className="lx-title" style={{ marginTop: 22 }}>
                An architecture is only as durable as <em>the organisation running it</em>
              </h2>
            </div>
            <p className="lx-body">
              Four things I own besides the systems, each tied to the one fact that stands behind
              it. This pairing is the argument: most people are credibly one or the other.
            </p>
          </div>

          <div className="lx-pillars lx-in">
            {leadership.map((pillar, i) => (
              <article key={pillar.title} className="lx-pillar">
                <span className="lx-pillar-no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.detail}</p>
                <p className="lx-pillar-proof">{pillar.proof}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Depth ─────────────────────────────────────────────────────── */}
        <section id="depth" className="lx-shell lx-sec">
          <div className="lx-head-block lx-in">
            <div>
              <p className="lx-eyebrow">Technical depth</p>
              <h2 className="lx-title" style={{ marginTop: 22 }}>
                Six areas, <em>to depth</em>
              </h2>
            </div>
            <p className="lx-body">
              Each with the production evidence behind it rather than a claim of familiarity —
              and the full surface underneath.
            </p>
          </div>

          <div className="lx-depth lx-in">
            {expertise.map((e) => (
              <article key={e.title} className="lx-area">
                <h3>{e.title}</h3>
                <hr className="lx-rule" />
                <p>{e.detail}</p>
                <div className="lx-tags">
                  {e.tags.map((t) => (
                    <span key={t} className="lx-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <dl className="lx-craft lx-in">
            {skills.map((group) => (
              <div key={group.title} className="lx-craft-row">
                <dt>{group.title}</dt>
                <dd>{group.items.join("   ·   ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Experience ────────────────────────────────────────────────── */}
        <section id="experience" className="lx-shell lx-sec">
          <div className="lx-head-block lx-in">
            <div>
              <p className="lx-eyebrow">Experience</p>
              <h2 className="lx-title" style={{ marginTop: 22 }}>
                Three seats, <em>five years</em>
              </h2>
            </div>
          </div>

          <div className="lx-roles lx-in">
            {roles.map((role) => (
              <article key={role.org} className="lx-role">
                <div className="lx-role-meta">
                  {role.current ? <span className="lx-role-now">Current seat</span> : null}
                  <span className="lx-role-when">
                    {role.start} — {role.end}
                  </span>
                  <span className="lx-role-org">{role.orgShort ?? role.org}</span>
                </div>
                <div>
                  <h3>{role.title}</h3>
                  <p className="lx-role-scope">{role.scope}</p>
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

      {/* ── Closing ─────────────────────────────────────────────────────── */}
      <footer id="contact" className="lx-close">
        <div className="lx-shell lx-close-in">
          <div>
            <p className="lx-eyebrow">{site.availability}</p>
            <h2 className="lx-display">
              Let&rsquo;s build the <em>function</em>, not just the model.
            </h2>
            <p className="lx-lede">
              If you are putting an AI function on the map — or you have one and it is not
              shipping — that is the conversation I want. Email is fastest.
            </p>
            <div className="lx-acts" style={{ marginTop: 34 }}>
              <a className="lx-cta lx-cta--solid" href={`mailto:${site.email}`}>
                Email {first}
              </a>
              <a className="lx-cta" href={site.linkedin} rel="noopener noreferrer" target="_blank">
                LinkedIn
              </a>
            </div>
          </div>

          <dl className="lx-contact">
            <div className="lx-contact-row">
              <dt>Email</dt>
              <dd>
                <a className="lx-link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
              <Copy value={site.email} label="email" />
            </div>
            <div className="lx-contact-row">
              <dt>LinkedIn</dt>
              <dd>
                <a
                  className="lx-link"
                  href={site.linkedin}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  /in/shreenivas-joshi
                </a>
              </dd>
              <span />
            </div>
            <div className="lx-contact-row">
              <dt>Résumé</dt>
              <dd>
                <a className="lx-link" href={site.resume}>
                  Shreenivas_Joshi_Resume.pdf
                </a>
              </dd>
              <span />
            </div>
            <div className="lx-contact-row">
              <dt>Based</dt>
              <dd>{site.location}</dd>
              <span />
            </div>
          </dl>
        </div>

        <div className="lx-shell lx-foot">
          <p>
            {site.name} · {site.role}
          </p>
          <p>
            Every figure on this page is taken from the résumé. The dial holds a designed latency
            budget, not live traffic.
          </p>
        </div>
      </footer>

      <Reveal />
    </>
  );
}
