import Image from "next/image";
import { Year } from "@/components/Year";
import {
  expertise,
  leadership,
  projects,
  railFigures,
  roles,
  site,
  skills,
} from "@/lib/content";
import { Copy, Figure, Head, HeroMotion, Reveal, Sequence } from "./_components/Chrome";
import { Kinetic } from "./_components/Kinetic";
import { Pointer } from "./_components/Pointer";
import { Words } from "./_components/words";
import { GrantSplit, SeatRail, SkillField, TeamCurve } from "./_components/Charts";
import { Circuit, Pipeline } from "./_components/Flow";
import { Stage } from "./_components/Stage";
import { BUDGET_MS, CEILING_MS } from "./_components/turn";

/**
 * The object.
 *
 * Built to a brief that took four attempts to state plainly: cinematic rather
 * than diagrammatic, with real imagery and 3D, more on screen, and more
 * motion. So the page is staged like a product launch — one lit, machined
 * object held on a fixed canvas behind the whole document and driven by scroll,
 * true black so the object and the page share a ground, type at launch scale,
 * and sections dense with specification rather than sparse with taste.
 *
 * Density is the substance here, not decoration: the subject is an engineer,
 * and a spec table is the most flattering thing you can print about one whose
 * numbers hold up. Every figure on the page comes from the résumé — stated as
 * the specification it is, without a note explaining that it is one.
 */

/** The headline figure each system is listed with. All of it is stated in `detail`. */
const HEADLINE: Record<string, { k: string; v: string }[]> = {
  "voice-negotiator": [
    { k: "End to end", v: "650–800 ms" },
    { k: "Channel", v: "Live telephony" },
  ],
  "rag-sales-assistant": [
    { k: "Corpus", v: "Enterprise scale" },
    { k: "Retrieval", v: "Hybrid + rerank" },
  ],
  medicalgpt: [
    { k: "Pipeline", v: "Pretrain → SFT" },
    { k: "Ownership", v: "End to end" },
  ],
  "virtual-trial-room": [
    { k: "Model", v: "Stable Diffusion" },
    { k: "Delivered", v: "Working MVP" },
  ],
};

/**
 * Structured data for the person, which moves with the seat: it describes who
 * the site is about, so it belongs on the page that is actually indexed.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}/profile.jpg`,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  sameAs: [site.linkedin],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gurugram",
    addressCountry: "IN",
  },
  worksFor: { "@type": "Organization", name: roles[0].org },
  knowsAbout: [
    "Generative AI",
    "Large Language Models",
    "Retrieval-Augmented Generation",
    "Agentic AI",
    "Voice AI",
    "MLOps",
    "Computer Vision",
    "AI Engineering Leadership",
  ],
  hasOccupation: projects.map((p) => ({ "@type": "CreativeWork", name: p.title })),
};

export default function Cine() {
  const [first] = site.name.split(" ");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black"
      >
        Skip to content
      </a>

      <Head />

      <main id="main">
        {/* ── Opening shot ──────────────────────────────────────────────── */}
        <section id="top" className="cn-hero">
          <Stage />

          <div className="cn-shell cn-hero-in">
            <p className="cn-hero-status">
              <i aria-hidden />
              <span>{site.availability}</span>
            </p>

            <h1 className="cn-display">
              <span className="cn-name-wrap">
                <span className="cn-sweep" aria-hidden />
                <span data-kinetic>
                  <Words>{site.name}</Words>
                </span>
              </span>
            </h1>
            <p className="cn-title">{site.role}</p>

            <p className="cn-lede">
              {site.tagline} Five years across AI and deep learning, from computer vision for
              geospatial defence to enterprise GenAI — leading an 18-engineer team today, and
              before that building an AI function from zero.
            </p>

          <div className="cn-hero-acts">
            <a className="cn-btn cn-btn--light" href={`mailto:${site.email}`}>
              Start a conversation
            </a>
            <a className="cn-btn" href={site.resume}>
              Download résumé
            </a>
          </div>

            <div className="cn-hero-foot">
              <span className="cn-scroll">
                <span className="cn-scroll-rail">
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden>
                    <path d="M8 0v15" stroke="currentColor" strokeWidth="1.2" />
                    <path
                      d="M2.5 10.5 8 16l5.5-5.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
                Scroll
              </span>
            </div>
          </div>
        </section>

        {/* The sheet: everything after the opening travels as one surface,
            drawn up over the shot that stays pinned behind it. */}
        <div className="cn-after">
        <div className="cn-ambient" aria-hidden />
        {/* ── Figures: the second screen ────────────────────────────────── */}
        <section className="cn-shell cn-screen">
          <div className="cn-screen-head cn-in">
            <p className="cn-label">By the numbers</p>
          </div>
          <div className="cn-figures cn-in">
            {railFigures.map((f) => (
              <Figure key={f.label} value={f.value} unit={f.unit} label={f.label} />
            ))}
          </div>
        </section>

        {/* ── Systems ───────────────────────────────────────────────────── */}
        <section id="systems" className="cn-shell cn-sec">
          <div className="cn-sec-head cn-in">
            <div>
              <p className="cn-label">Selected work</p>
              <h2 className="cn-h2" data-kinetic>
                <Words>{"Four systems,"}</Words> <em><Words start={2}>{"in production"}</Words></em>
              </h2>
            </div>
            <p className="cn-body">
              Each shipped and running: what it does, how it is built, and the figure it is
              held to.
            </p>
          </div>

          <div className="cn-systems cn-in">
            {projects.map((p, i) => (
              <article key={p.slug} className="cn-system">
                <div className="cn-system-top">
                  <span className="cn-system-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cn-system-live">In production</span>
                </div>
                <h3 className="cn-h3">{p.title}</h3>
                <p>{p.summary}</p>
                <p className="cn-system-detail">{p.detail}</p>
                <Pipeline stack={p.stack} />
                <dl className="cn-specs">
                  {HEADLINE[p.slug].map((row) => (
                    <div key={row.k}>
                      <dt>{row.k}</dt>
                      <dd>{row.v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>

        {/* ── The circuit ───────────────────────────────────────────────── */}
        <section className="cn-shell cn-sec">
          <div className="cn-sec-head cn-in">
            <div>
              <p className="cn-label">How the halves connect</p>
              <h2 className="cn-h2" data-kinetic>
                <Words>{"One circuit,"}</Words> <em><Words start={2}>{"not two careers"}</Words></em>
              </h2>
            </div>
            <p className="cn-body">
              Strategy funds the team, the team builds the reference architecture, the
              architecture produces the systems — and the evaluation framework closes the loop
              back onto the architecture once they are live.
            </p>
          </div>
          <div className="cn-in">
            <Circuit />
          </div>
        </section>

        {/* ── Latency ───────────────────────────────────────────────────── */}
        <section id="latency" className="cn-shell cn-sec">
          <div className="cn-sec-head cn-in">
            <div>
              <p className="cn-label">The hardest claim on this page</p>
              <h2 className="cn-h2" data-kinetic>
                <Words>{"One spoken turn,"}</Words> <em><Words start={3}>{`${BUDGET_MS} milliseconds`}</Words></em>
              </h2>
            </div>
            <p className="cn-body">
              Six services against a single clock, with a ceiling at {CEILING_MS} ms — above that
              a conversation stops feeling like one. Scroll carries the turn through its budget;
              take any hop to hold it.
            </p>
          </div>

          <div className="cn-in">
            <Sequence />
          </div>

          <p className="cn-small cn-in" style={{ marginTop: 24, maxWidth: "92ch" }}>
            Nothing here is fast because a fast model was chosen: each hop was given a ceiling
            first and then built to fit, work was moved off the critical path wherever it could
            start early, and the two hops nobody controls — the caller&rsquo;s pause and the
            carrier — were reserved before any service got to spend.
          </p>
        </section>

        {/* ── Scale ─────────────────────────────────────────────────────── */}
        <section id="scale" className="cn-shell cn-sec">
          <div className="cn-sec-head cn-in">
            <div>
              <p className="cn-label">The other half</p>
              <h2 className="cn-h2" data-kinetic>
                <Words>{"An architecture is only as durable as"}</Words> <em><Words start={7}>{"the organisation running it"}</Words></em>
              </h2>
            </div>
            <p className="cn-body">
              Four things I own besides the systems, each tied to the one fact that stands behind
              it. The pairing is the argument: most people are credibly one or the other.
            </p>
          </div>

          <div className="cn-charts cn-in">
            <TeamCurve />
            <GrantSplit />
          </div>

          <div className="cn-pillars cn-in">
            {leadership.map((pillar, i) => (
              <article key={pillar.title} className="cn-pillar">
                <span className="cn-pillar-no">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="cn-h3">{pillar.title}</h3>
                <p>{pillar.detail}</p>
                <p className="cn-pillar-proof">{pillar.proof}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Depth ─────────────────────────────────────────────────────── */}
        <section id="depth" className="cn-shell cn-sec">
          <div className="cn-sec-head cn-in">
            <div>
              <p className="cn-label">Technical depth</p>
              <h2 className="cn-h2" data-kinetic>
                <Words>{"Six areas,"}</Words> <em><Words start={2}>{"to depth"}</Words></em>
              </h2>
            </div>
            <p className="cn-body">
              Each with the production evidence behind it rather than a claim of familiarity —
              then the full specification underneath.
            </p>
          </div>

          <div className="cn-areas cn-in">
            {expertise.map((e) => (
              <article key={e.title} className="cn-area">
                <h3>{e.title}</h3>
                <p>{e.detail}</p>
                <div className="cn-chips">
                  {e.tags.map((t) => (
                    <span key={t} className="cn-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="cn-in">
            <SkillField groups={skills} />
          </div>

          <dl className="cn-spec-table cn-in">
            {skills.map((group) => (
              <div key={group.title} className="cn-spec-row">
                <dt>{group.title}</dt>
                <dd>{group.items.join("   ·   ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Record ────────────────────────────────────────────────────── */}
        <section id="record" className="cn-shell cn-sec">
          <div className="cn-sec-head cn-in">
            <div>
              <p className="cn-label">Record</p>
              <h2 className="cn-h2" data-kinetic>
                <Words>{"Three seats,"}</Words> <em><Words start={2}>{"five years"}</Words></em>
              </h2>
            </div>
          </div>

          <div className="cn-in">
            <SeatRail />
          </div>

          <div className="cn-roles cn-in">
            {roles.map((role) => (
              <article key={role.org} className="cn-role">
                <div className="cn-role-meta">
                  {role.current ? <span className="cn-role-now">Current seat</span> : null}
                  <span className="cn-role-when">
                    {role.start} — {role.end}
                  </span>
                  <span className="cn-role-org">{role.orgShort ?? role.org}</span>
                </div>
                <div>
                  <h3 className="cn-h3">{role.title}</h3>
                  <p className="cn-role-scope">{role.scope}</p>
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

        {/* ── The portrait ──────────────────────────────────────────────── */}
        <section className="cn-shell cn-sec">
          <div className="cn-portrait cn-in">
            <figure className="cn-portrait-plate">
              <Image
                src="/profile.jpg"
                alt={`${site.name}, ${site.role}`}
                width={860}
                height={996}
                sizes="(min-width: 1000px) 38vw, 100vw"
              />
            </figure>

            <div className="cn-portrait-copy">
              <p className="cn-label">{site.location}</p>
              <h2 className="cn-h2" data-kinetic>
                <Words>{"I lead the work"}</Words> <em><Words start={4}>{"and do it"}</Words></em>
              </h2>
              <p className="cn-body">
                Five years across AI and deep learning, from computer vision for geospatial
                defence to enterprise GenAI. I define the reference architecture rather than
                review it, I hire and grow the engineers who build on it, and I have written the
                strategy that paid for both.
              </p>
              <dl className="cn-card">
                <div>
                  <dt>Current seat</dt>
                  <dd>
                    {roles[0].title}, {roles[0].orgShort ?? roles[0].org}
                  </dd>
                </div>
                <div>
                  <dt>Based</dt>
                  <dd>{site.location}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{site.availability}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
        </div>
      </main>

      {/* ── Closing ─────────────────────────────────────────────────────── */}
      <footer id="contact" className="cn-close">
        <div className="cn-shell cn-close-in">
          <div>
            <p className="cn-label">{site.availability}</p>
            <h2 className="cn-h2" data-kinetic>
              <Words>{"Let’s build the function,"}</Words> <em><Words start={4}>{"not just the model"}</Words></em>
            </h2>
            <p className="cn-lede">
              If you are putting an AI function on the map — or you have one and it is not
              shipping — that is the conversation I want. Email is fastest.
            </p>
            <div className="cn-hero-acts">
              <a className="cn-btn cn-btn--light" href={`mailto:${site.email}`}>
                Email {first}
              </a>
              <a
                className="cn-btn"
                href={site.linkedin}
                rel="noopener noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <dl className="cn-contact">
            <div className="cn-contact-row">
              <dt>Email</dt>
              <dd>
                <a className="cn-link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
              <Copy value={site.email} label="email" />
            </div>
            <div className="cn-contact-row">
              <dt>LinkedIn</dt>
              <dd>
                <a
                  className="cn-link"
                  href={site.linkedin}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  /in/shreenivas-joshi
                </a>
              </dd>
              <span />
            </div>
            <div className="cn-contact-row">
              <dt>Résumé</dt>
              <dd>
                <a className="cn-link" href={site.resume}>
                  Shreenivas_Joshi_Resume.pdf
                </a>
              </dd>
              <span />
            </div>
            <div className="cn-contact-row">
              <dt>Based</dt>
              <dd>{site.location}</dd>
              <span />
            </div>
          </dl>
        </div>

        <div className="cn-shell cn-foot">
          <p>
            {site.name} · {site.role}
          </p>
          <p>
            <Year /> · {site.location}
          </p>
        </div>
      </footer>

      <HeroMotion />
      <Kinetic />
      <Pointer />
      <Reveal />
    </>
  );
}
