import Image from "next/image";
import {
  expertise,
  leadership,
  railFigures,
  roles,
  site,
  skills,
} from "@/lib/content";
import { Copy, Head, Reveal, Tracks } from "./_components/Chrome";
import { Pipeline } from "./_components/Pipeline";
import { Trace } from "./_components/Trace";
import { BUDGET_MS, CEILING_MS } from "./_components/turn";

/**
 * The sleeve.
 *
 * Same person, same résumé, a different object. The primary route argues the
 * case as a printed specification. This one presents it as a record: a square
 * cover with a duotone plate, a track listing for the systems, personnel
 * credits for the organisation, session dates for the seats, and liner notes
 * for the depth.
 *
 * The conceit is doing work rather than dressing the page. Leading eighteen
 * engineers *is* a personnel credit. A production system with a latency budget
 * *is* a track with a runtime. And the one rule the route keeps from its
 * predecessor: nothing moves that is not also explained — the band plays a
 * designed budget, and the caption says exactly that.
 */

/** The one hard figure each track is listed with. All of it is already stated in `detail`. */
const TRACK_FACTS: Record<string, string> = {
  "voice-negotiator": "650–800 ms",
  "rag-sales-assistant": "LangChain · FAISS",
  medicalgpt: "pretrain → SFT",
  "virtual-trial-room": "diffusion try-on",
};

export default function Sleeve() {
  const [first, ...rest] = site.name.split(" ");

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-[#12100e] focus:px-4 focus:py-2 focus:text-sm focus:text-[#e9e5dc]"
      >
        Skip to content
      </a>

      <Head />

      <main id="main">
        {/* ── Front cover ───────────────────────────────────────────────── */}
        <section className="bn-shell bn-cover">
          <div className="bn-sleeve">
            <div className="bn-sleeve-type">
              <p className="bn-stereo">
                <span className="bn-caps">{site.availability}</span>
              </p>

              <h1 className="bn-shout bn-name">
                {first}
                <em>{rest.join(" ")}</em>
              </h1>

              <p className="bn-caps bn-role">{site.role}</p>

              <div className="bn-cat">
                <span className="bn-caps">{site.location}</span>
                <span className="bn-caps">Five years · AI &amp; deep learning</span>
              </div>

              <div className="bn-cover-acts">
                <a className="bn-press bn-press--plate" href={`mailto:${site.email}`}>
                  Start a conversation
                </a>
                <a className="bn-press bn-press--bone" href={site.resume}>
                  Résumé
                </a>
              </div>
            </div>

            <div className="bn-portrait">
              <Image
                src="/profile.jpg"
                alt={`${site.name}, ${site.role}`}
                width={860}
                height={996}
                priority
                sizes="(min-width: 900px) 46vw, 100vw"
              />
            </div>
          </div>

          <div className="bn-lede">
            <h2>{site.tagline}</h2>
            <p className="bn-prose">{site.intro}</p>
          </div>

          <div className="bn-figs" style={{ marginTop: 34 }}>
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
        </section>

        {/* ── Work ──────────────────────────────────────────────────────── */}
        <section id="systems" className="bn-shell bn-side">
          <div className="bn-side-head">
            <h2 className="bn-shout">Selected work</h2>
            <p className="bn-caps">Four systems in production</p>
          </div>
          <hr className="bn-rule bn-rule--thick" />
          <p className="bn-prose bn-side-sub">
            Open a title for what it is and how it was built. Every one of these shipped; none of
            them are demos.
          </p>
          <div className="bn-in">
            <Tracks facts={TRACK_FACTS} />
          </div>
        </section>

        {/* ── The featured track ────────────────────────────────────────── */}
        <section id="turn" className="bn-shell bn-side">
          <div className="bn-side-head">
            <h2 className="bn-shout">Where the {BUDGET_MS} milliseconds go</h2>
            <p className="bn-caps">The featured track</p>
          </div>
          <hr className="bn-rule bn-rule--thick" />
          <p className="bn-prose bn-side-sub">
            Real-time voice is the hardest claim on this page, so it is the one the page opens up.
            Six services, one clock, and a ceiling at {CEILING_MS} ms — above that a conversation
            stops feeling like a conversation.
          </p>

          <div className="bn-in">
            <Pipeline />
          </div>

          <p className="bn-note" style={{ margin: "14px 0 46px", maxWidth: "72ch" }}>
            The band plays the designed budget, not a live probe: each segment is as wide as its
            share of the clock, and every fourth take runs long because a tail always exists and
            drawing it is more honest than a page that hides it.
          </p>

          <div className="bn-in">
            <Trace />
          </div>

          <p className="bn-prose" style={{ marginTop: 34 }}>
            Nothing here is fast because a fast model was chosen. Each hop was given a ceiling
            first and then built to fit, work was moved off the critical path wherever it could
            start early, and the two hops nobody controls — the caller&rsquo;s pause and the
            carrier — were reserved before any service got to spend.
          </p>
        </section>

        {/* ── Personnel ─────────────────────────────────────────────────── */}
        <section id="personnel" className="bn-shell bn-side">
          <div className="bn-side-head">
            <h2 className="bn-shout">Personnel</h2>
            <p className="bn-caps">The part that is not code</p>
          </div>
          <hr className="bn-rule bn-rule--thick" />
          <p className="bn-prose bn-side-sub">
            An architecture is only as durable as the organisation running it. Four things I own
            besides the systems, each tied to the one fact that stands behind it.
          </p>
          <div className="bn-personnel bn-in">
            {leadership.map((pillar) => (
              <article key={pillar.title} className="bn-credit">
                <div className="bn-credit-lead">
                  <h3>{pillar.title}</h3>
                  <span className="bn-credit-dots" aria-hidden />
                  <span className="bn-credit-proof">{pillar.proof}</span>
                </div>
                <p>{pillar.detail}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Liner notes ───────────────────────────────────────────────── */}
        <section id="notes" className="bn-shell bn-side">
          <div className="bn-side-head">
            <h2 className="bn-shout">Liner notes</h2>
            <p className="bn-caps">Six areas, to depth</p>
          </div>
          <hr className="bn-rule bn-rule--thick" />
          <p className="bn-prose bn-side-sub">
            What I can be interviewed on to depth, each with the production evidence behind it
            rather than a claim of familiarity.
          </p>

          <div className="bn-liner bn-in">
            <div className="bn-liner-cols">
              {expertise.map((e) => (
                <section key={e.title}>
                  <h3>{e.title}</h3>
                  <p>{e.detail}</p>
                  <p className="bn-note">{e.tags.join(" · ")}</p>
                </section>
              ))}
            </div>

            <dl className="bn-instr">
              {skills.map((group) => (
                <div key={group.title} className="bn-instr-row">
                  <dt>{group.title}</dt>
                  <dd>{group.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Sessions ──────────────────────────────────────────────────── */}
        <section id="sessions" className="bn-shell bn-side">
          <div className="bn-side-head">
            <h2 className="bn-shout">Sessions</h2>
            <p className="bn-caps">Three seats, five years</p>
          </div>
          <hr className="bn-rule bn-rule--thick" />
          <div className="bn-sessions bn-in" style={{ marginTop: 34 }}>
            {roles.map((role) => (
              <article key={role.org} className="bn-session">
                <div className="bn-session-when">
                  {role.current ? <span className="bn-session-live">Current seat</span> : null}
                  <span className="bn-session-date">
                    {role.start} — {role.end}
                  </span>
                  <span className="bn-session-org">{role.orgShort ?? role.org}</span>
                </div>
                <div>
                  <h3>{role.title}</h3>
                  <p className="bn-session-scope">{role.scope}</p>
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

      {/* ── Back cover ──────────────────────────────────────────────────── */}
      <footer id="contact" className="bn-back">
        <div className="bn-shell bn-back-in">
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
            <div className="bn-back-acts">
              <a className="bn-press bn-press--plate" href={`mailto:${site.email}`}>
                Email {first}
              </a>
              <a className="bn-press bn-press--bone" href={site.resume}>
                Download résumé
              </a>
            </div>
          </div>

          <div className="bn-back-rows">
            <div className="bn-back-row">
              <span className="k">Email</span>
              <a className="v" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <Copy value={site.email} label="email" />
            </div>
            <div className="bn-back-row">
              <span className="k">LinkedIn</span>
              <a className="v" href={site.linkedin} rel="noopener noreferrer" target="_blank">
                /in/shreenivas-joshi
              </a>
              <span />
            </div>
            <div className="bn-back-row">
              <span className="k">Based</span>
              <span className="v">{site.location}</span>
              <span />
            </div>
            <div className="bn-back-row">
              <span className="k">Status</span>
              <span className="v">{site.availability}</span>
              <span />
            </div>
          </div>
        </div>

        <div className="bn-shell bn-colophon">
          <p>
            {site.name} · {site.role}
          </p>
          <p>
            Every figure on this page is taken from the résumé. The band plays a designed latency
            budget, not live traffic.
          </p>
        </div>
      </footer>

      <Reveal />
    </>
  );
}
