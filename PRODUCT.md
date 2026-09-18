# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

**Next.js (App Router) + TypeScript + Tailwind CSS v4.** Changed by the user
from the earlier static HTML choice, for two stated reasons: they want a blog
and case studies later, and they asked for the redesign to be built in Next.js.
I recommended Astro for the writing use case and static HTML for everything
else; the user reaffirmed Next.js, so Next.js it is.

Deploy target is Vercel, which needs no build configuration — security headers
live in `next.config.ts`. Every route is statically prerendered.

Blog and case-study content was explicitly deferred ("it will be added later,
for now skip it"). The content system is not built yet; `src/lib/content.ts` is
structured so it can be added without disturbing the page.

**Two surfaces, one record.** `src/app/(cine)/` is the front page — a route
group, so the folder names the world without adding a path segment — and
`src/app/v2/` keeps the datasheet that held that seat before it. Both read the
same `src/lib/content.ts`, so a figure can never differ between them. The front
page is the indexed one; `/v2` is noindexed, because one résumé on two pages is
duplicate content.

## Users

Primary: **hiring managers and technical recruiters** filling senior AI
leadership roles (Lead AI, Head of AI, Director of AI). They arrive from
LinkedIn, a forwarded résumé, or a name search — usually already holding a
specific role — and they are skimming to answer one question: *is this person
operating at the level we need?* They decide in well under a minute whether to
reply. Many are non-engineers screening on behalf of an engineering org.

Secondary, not to be designed against: enterprise buyers evaluating GenAI
capability, and peers or collaborators.

## Product Purpose

A personal site for Shreenivas Joshi that converts a qualified stranger into an
inbound message about a senior AI leadership role. Success is measured in
contacts received, not in traffic or time on page.

## Positioning

The differentiated claim is **the pairing**: an engineer who both architects and
ships hard AI systems *and* builds, funds and institutionalises the organisation
around them. Most candidates are credibly one or the other. The page must argue
both and make the combination the point — neither half is allowed to become a
footnote to the other.

Evidence for the architect half: unified multimodal voice architecture holding
650–800 ms end-to-end latency; enterprise RAG over large document sets
(LangChain, Meta-LLaMA 3, FAISS, custom embeddings); continued pretraining plus
instruction fine-tuning on clinical text; an org-wide LLM evaluation and
benchmarking framework.

Evidence for the leadership half: first AI hire at Basal Analytics, built the AI
function from zero, team 6→10; now leads 18 engineers at HB Software Solutions;
secured ~USD 50K in cloud grants (AWS ~$20K, Azure ~$25K, Google ~$5K) and ₹3 Cr
(~USD 360K) incubation funding by authoring and presenting the AI strategy;
defined microservice reference architecture and MLOps standards still in use.

## Operating Context

Read on a laptop between other candidates, or on a phone. Often opened in a tab
alongside the LinkedIn profile and the PDF résumé, which means the site must not
merely restate the résumé — it must be the version that is faster to judge. The
résumé PDF is a real deliverable visitors download and forward internally.

## Capabilities and Constraints

- No backend, no API keys, no database today. Next.js API routes are available
  if a real assistant or contact form is added later.
- The keyword-matching résumé assistant was **removed** in the Next.js rebuild.
  It was never RAG and never an LLM, and it added a thing to explain on a page
  whose problem was already too much to decode. If it returns it must be a real
  LLM-backed endpoint, disclosed accurately.
- Canonical URL, Open Graph tags, `robots.txt` and `sitemap.xml` currently point
  at `https://shreenivasjoshi.com`. The real domain is **not yet confirmed**.
- Contact is `srinivasjoshi11@gmail.com` and
  `linkedin.com/in/shreenivas-joshi`. No phone number is published.
- Location: Gurugram, India.

## Brand Commitments

- Name in use: **Shreenivas Joshi**. The earlier "Shreenivas.ai" wordmark was
  dropped in the Next.js rebuild; the plain name is the wordmark now.
- The professional portrait (`public/profile.jpg`) is real and is an asset, not
  a placeholder. For a recruiter audience a face is load-bearing.
- No logo and no fixed brand palette.
- **Nothing has to be decoded.** Plain section names, no invented vocabulary,
  no governing metaphor a reader has to work out before they can read. If a
  label is jargon, it is a defect. This began as half of a wider
  "convention over invention" commitment, written after a high-concept
  "funding instrument" redesign was judged "not user friendly and very
  confusing", and it still holds without exception.
- **The other half of that commitment is retired.** It said the site should
  look like the familiar, well-made engineer's site and take the category
  standard. That described the surface now at `/v2`, which is kept. The front
  page is deliberately not that: over several rounds the user rejected four
  quieter directions in turn — a console ("generic"), a record sleeve
  ("basic"), a silicon die ("still not good") and a gold-on-black house
  ("basic; the others were good compared to this") — and then stated the brief
  directly: cinematic, premium, with real imagery and 3D, more on screen and
  more motion. The front page answers that brief.

  The two halves are separable, and the distinction is the whole point: the
  front page is expressive in *register* and plain in *language*. Its
  navigation reads Systems, Latency, Scale, Depth, Record, Contact.
- Craft bar, front page: the cinematic-launch register — Apple, Rolex,
  Bang & Olufsen — chosen by the user from a set of named alternatives. One lit
  object carrying the opening, type at launch scale, and sections dense with
  specification rather than sparse with taste.
- Craft bar, `/v2`: leerob.com / rauchg.com, Linear / Vercel, Stripe / Resend
  docs, and the polished developer-portfolio archetype — fast, restrained,
  strong typography, obvious structure.

## Evidence on Hand

- `public/Shreenivas_Joshi_Resume.pdf` — the real résumé, offered for download.
- `public/profile.jpg` — real professional portrait, 860×996.
- Role history, team sizes, funding figures and latency numbers listed above are
  taken from the résumé and the shipped site, and are treated as true.
- **Absences that must not be fabricated:** no client names, no logos of
  employers or partners, no testimonials, no public repository links with real
  metrics, no press, no talks, no published writing, no case-study artefacts
  (diagrams, dashboards, screenshots) from the production systems. A GitHub
  section was cut for exactly this reason: it described categories of work
  rather than actual repositories.

## Product Principles

1. **Judgeable in forty seconds.** A recruiter must be able to place his level
   and reply without scrolling. Depth exists below for whoever wants it.
2. **The pairing is the argument.** Architect and organisation-builder are
   presented as one claim, never as two unrelated sections.
3. **Numbers are the proof.** 18 engineers, 650–800 ms, ₹3 Cr, 6→10, 30%. Real
   figures do the persuading; adjectives do not.
4. **Never invent evidence.** No fake logos, clients, testimonials or metrics.
   Where proof is absent, the design must not leave a slot shaped like it.
5. **The build is itself a credential.** For an AI engineering leader, a site
   that is demonstrably well-engineered is an argument. It must never cost
   legibility to make that point.

## Accessibility & Inclusion

No user-specific requirement established. Baseline holds: WCAG AA contrast
(4.5:1 body, 3:1 large), full keyboard operation with visible focus, honoured
`prefers-reduced-motion`, and the page must remain readable and complete without
JavaScript. Verified in both light and dark themes at 1440 and 390.
