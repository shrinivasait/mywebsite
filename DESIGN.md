---
name: Shreenivas Joshi — Front Page (Cinematic)
description: A product-launch page for an AI engineering leader, built on true black with one lit blue-white accent and a single variable grotesque.
colors:
  black: "#000000"
  ink: "#050507"
  ink-2: "#0a0b0f"
  ink-3: "#101219"
  ink-4: "#171a24"
  white: "#f6f7fa"
  grey: "#a7adbd"
  grey-2: "#7b8194"
  lit: "#8fb0ff"
  lit-deep: "#3f5dd6"
  lit-wash: "rgb(143 176 255 / 0.1)"
  hair: "rgb(246 247 250 / 0.1)"
  hair-2: "rgb(246 247 250 / 0.055)"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6.1vw, 6.25rem)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 4.25rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2vw, 1.875rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.028em"
  figure:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 6rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.055em"
    fontFeature: "tabular-nums"
  lede:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.5vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  small:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.26em"
rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  sheet: "clamp(14px, 1.8vw, 26px)"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 4vw, 80px)"
  section: "clamp(56px, 5.4vw, 104px)"
  panel: "clamp(26px, 2.6vw, 46px)"
  card: "clamp(22px, 2.4vw, 38px)"
  seam: "1px"
  head: "74px"
components:
  button-primary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    rounded: "{rounded.pill}"
    padding: "15px 28px"
  button-primary-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.black}"
  button-secondary:
    backgroundColor: "rgb(246 247 250 / 0.04)"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "15px 28px"
  button-secondary-hover:
    backgroundColor: "rgb(246 247 250 / 0.1)"
    textColor: "{colors.white}"
  button-head:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.grey-2}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  chip-hover:
    textColor: "{colors.grey}"
  badge-live:
    backgroundColor: "{colors.lit}"
    textColor: "{colors.black}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
  status-pill:
    backgroundColor: "rgb(246 247 250 / 0.03)"
    textColor: "{colors.grey}"
    rounded: "{rounded.pill}"
    padding: "8px 16px 8px 12px"
  panel-glass:
    backgroundColor: "rgb(5 5 7 / 0.72)"
    textColor: "{colors.grey}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel}"
  panel-glass-hover:
    backgroundColor: "rgb(16 18 25 / 0.82)"
  node-card:
    backgroundColor: "{colors.ink-4}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "clamp(18px, 1.8vw, 26px)"
    height: "146px"
  spec-cell:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  link-inline:
    backgroundColor: "transparent"
    textColor: "{colors.lit}"
---

# Design System: Shreenivas Joshi — Front Page (Cinematic)

> **Scope.** This file documents the front page only — the route group `src/app/(cine)/`, which serves `/`. The datasheet at `/v2` is a separate world with its own document, `DESIGN.v2.md`; the two share no tokens, no classes and no type ramp. Their only shared surface is the content in `src/lib/content.ts`. Do not merge them, and do not resolve a question about one by reading the other.

## Overview

**Creative North Star: "The Product Launch, where the product is the system he builds"**

The page is staged the way a silicon or watch launch is staged: one lit, machined object held in the opening frame, true black underneath so the rendered object and the document share a single ground, type at launch scale, and evidence set as specification rather than as prose. Four earlier worlds on this route were rejected as generic or basic, and the diagnosis that finally stuck was that all four were *drawings* — flat fills and hairlines, no lit material and no motion. This world answers that with material: real depth, real light, and a page that is never completely still.

Every token is declared on the `.cn` scope, so the site-wide theme class on `<html>` has no vote here. The page is a single material in a single mode. Density is deliberate: the subject is an engineer, and a specification table is the most flattering thing you can print about one whose numbers hold up. Sections are dense and precise; the restraint is in the palette, not in the quantity of evidence.

The accent is not a brand colour. It is the colour of the light on the object — a cool blue-white that reads as a reflection of the thing on the stage, which is why it appears on marks that mean *live*, *signal* or *now*, and almost nowhere else.

**Key Characteristics:**
- True black ground (`#000000`) shared by the WebGL stage and the document.
- One typeface, one accent, three weights of cool white.
- Hairlines at 5.5–10% white do all the structural drawing; almost nothing has a radius.
- Glass panels with backdrop blur floating over a slowly drifting field of light.
- Motion is continuous and cheap: transform, opacity and custom properties only.
- Nothing is ever fully hidden; every entrance carries a fallback that resolves it.

## Colors

A single-hue world: four blacks, three cool whites and one blue-white light, plus its deep and washed variants.

### Primary
- **Stage Light** (`#8fb0ff`, 8.6:1 on black): the light on the object, reused as the page's only accent. Figure and chart labels, accent halves of headlines, live marks, the active bar of the latency track, chart strokes, node numbers, inline links, focus rings, selection, caret. It is a signal, not a decoration.
- **Deep Beam** (`#3f5dd6`): the far end of the light. The base of accent gradients, the first segment of the stacked bar, the dash before a record bullet, the coloured shadow under a pointed-at card.
- **Light Wash** (`rgb(143 176 255 / 0.1)`): the accent at breathing strength — node-number pill fills, chart area fills, ambient washes on the stage.

### Neutral
- **True Black** (`#000000`): the page ground, the sheet's own fill, field rows, and the fill of chart dots. Not near-black: the WebGL canvas and the document must be indistinguishable at the seam.
- **Ink** (`#050507`) / **Ink 2** (`#0a0b0f`) / **Ink 3** (`#101219`) / **Ink 4** (`#171a24`): the four steps above the ground. Ink fills spec cells; Ink 2 backs the portrait plate; Ink 3 is the hover state of a glass panel and the top of the sequence gradient; Ink 4 is the lit top of a circuit node. Panels use these at 72–94% alpha over the stage so the light behind them still shows.
- **Cool White** (`#f6f7fa`, 19.6:1): headlines, figures, values, and any datum that is the answer to a label.
- **Grey** (`#a7adbd`, 9.1:1): prose — ledes, body, panel paragraphs.
- **Grey 2** (`#7b8194`, 5.2:1): labels, units, captions, ticks, inactive nav, and every piece of metadata that should be legible without competing.
- **Hairline** (`rgb(246 247 250 / 0.1)`) and **Hairline Faint** (`rgb(246 247 250 / 0.055)`): the two structural strokes. Faint is the default divider and grid seam; the stronger hairline marks the top of a table, the border of a control, and the hover state of a chip.

### Named Rules
**The Reflected Light Rule.** There is exactly one accent, and it is the colour of the light on the object. Anything that does not mean *live*, *signal*, *now* or *this is a link* stays white or grey. A second hue is never introduced — a state that needs distinguishing uses Deep Beam or the wash.

**The Shared Ground Rule.** The page ground is `#000000` and nothing else. The stage renders on the same value, so the canvas has no visible edge. Surfaces sit *above* black by alpha and blur, never by a lighter opaque fill.

**The Hairline Rule.** Structure is drawn at 5.5–10% white. A divider, a grid seam or a table rule is a hairline; it is never a filled bar, and it never strengthens past `rgb(246 247 250 / 0.1)`.

## Typography

**Display Font:** Schibsted Grotesk (variable, via `next/font`, with `system-ui, sans-serif`)
**Body Font:** Schibsted Grotesk — the same face
**Label/Mono Font:** none. Numerals use the same face with `font-variant-numeric: tabular-nums`.

**Character:** One contemporary neutral grotesque with slightly humanist joints, run from an 11px label to a ~100px headline. It holds at launch scale without the mechanical coldness of a default interface sans, and its tabular figures carry the specification tables. A second face would dilute a page whose voice is the object.

### Hierarchy
- **Display** (500, `clamp(2.75rem, 6.1vw, 6.25rem)`, 0.92, −0.045em): the name in the opening frame, and nothing else. Balanced wrapping, capped at 11ch.
- **Headline** (500, `clamp(2rem, 4.6vw, 4.25rem)`, 0.98, −0.04em): one per section. Set in two tones — the plain half in white, the accent half in an `<em>` that is not italic but Stage Light.
- **Title** (500, `clamp(1.375rem, 2vw, 1.875rem)`, 1.12, −0.028em): system, pillar and role names.
- **Figure** (500, `clamp(2.75rem, 6vw, 6rem)`, 1, −0.055em, tabular): the by-the-numbers row and the sequence clock. The unit rides beside it as a small accent uppercase glyph, never as part of the number.
- **Lede** (400, `clamp(1.0625rem, 1.5vw, 1.5rem)`, 1.5, −0.015em, grey, max 46–52ch): the paragraph directly under a display or closing headline.
- **Body** (400, 1rem, 1.7, grey, max 64ch): section-head prose and long explanation.
- **Small** (400, 0.8125rem, 1.7, grey 2): footnotes, captions, chart feet.
- **Label** (500, 0.6875rem, +0.26em, uppercase, Stage Light): the word that names a number — figure labels, chart captions.

Between Body and Small the page uses a working pair of panel sizes: 0.9375rem/1.72 in grey for panel prose, and 0.875rem/1.7 in grey-2 for a second-rank detail line. Tracked uppercase metadata (role scopes, spec keys, node numbers) sits at 0.625–0.8125rem with +0.12em to +0.2em.

### Named Rules
**The One Face Rule.** Schibsted Grotesk from 11px to 100px. No second family, no monospace, no italic — every `<em>` on this page is `font-style: normal` and carries a colour, not a slant.

**The Negative Tracking Rule.** Type tightens as it grows: −0.015em at lede, −0.028em at title, −0.04em at headline, −0.045em at display, −0.055em at figure. Anything small and uppercase goes the other way, +0.12em to +0.26em.

**The Tabular Figure Rule.** Every number that can change or be compared — figures, clocks, chart keys, years, spec values — is set with `font-variant-numeric: tabular-nums`. The base scope explicitly turns tabular figures *off* (`font-feature-settings: "tnum" 0`) so prose keeps proportional numerals; tabular is opted into per element.

## Layout

A single centred shell, `max-width: 1680px`, with a fluid gutter of `clamp(20px, 4vw, 80px)` — the one horizontal measure on the page, reused for the absolute position of the scroll cue.

Vertical rhythm is `clamp(56px, 5.4vw, 104px)` of block padding per section. Consecutive sections each carry their own, so the gap between two is the sum; each is therefore kept tighter than a single section would want, or the page reads as a series of empty rooms.

The document is two full-height screens and then a stack: the opening (`100svh − 74px`, min 520px) and the figures screen (`min(100svh − 74px, 620px)`). `svh`, never `vh`, so a collapsing mobile toolbar cannot cut the scroll cue off the bottom. The running head is 74px; `html:has(.cn)` sets `scroll-padding-top: 74px` so anchor jumps land below it rather than under it.

Breakpoints, as actually used: 780px (field rows), 860/880/900px (areas, pillars, spec rows, charts, circuit), 960px (record rows), 1000px (systems, section heads, portrait, closing), 1040px (nav appears), 1100px (stage offset and hero column cap at 56%), 1340px (three-up areas, two-column record bullets). Height is a breakpoint too: at `min-height: 700px` the scroll cue leaves flow and pins to the bottom edge.

Grids are seamed, not gapped: the systems, pillars, charts, skill-field and spec-strip grids all use a 1px gap over a hairline-faint background, so the gap *is* the rule. Scroll snapping was tried and removed: with two full-height screens, proximity snapping fought every anchor jump.

### Named Rules
**The Seam Rule.** A grid of panels is drawn with `gap: 1px` over a hairline-faint background and a hairline-faint border. Never add per-card borders to a seamed grid; the seam already is the border.

**The Sheet Rule.** Everything after the opening lives inside one element that carries the page's own black, a top radius, a hairline of light and a long upward shadow. The opening stays pinned under the head while the sheet is pulled up over it. New sections go inside the sheet; nothing follows it except the closing footer.

## Elevation & Depth

Hybrid, and the depth is real rather than implied. Behind the opening, an absolutely positioned canvas inside the hero renders the object; below the fold it is neither drawn nor rendered. Behind the reading sections, a fixed, blurred field of three radial washes drifts on a 26s alternating loop, so the page keeps a light source after the object is gone. Every panel is a piece of glass over that field: an ink fill at 72–94% alpha, `backdrop-filter: blur(10–14px)`, and a hairline border. Depth comes from *translucency plus blur* first, shadow second.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 40px 90px -40px rgb(0 0 0 / 0.9), 0 10px 30px -18px rgb(0 0 0 / 0.8)`): the two-stop drop under the objects that must read as physical plates — the sequence panel and the portrait. A tight contact shadow plus a long ambient one.
- **Edge** (`box-shadow: inset 0 1px 0 0 rgb(246 247 250 / 0.07)`): the lit top edge of a plate, always paired with Lift.
- **Sheet** (`box-shadow: 0 -30px 70px -20px rgb(0 0 0 / 0.95), 0 -1px 0 0 rgb(246 247 250 / 0.08)`): upward — the only shadow that throws up, because the sheet passes over the pinned shot.
- **Node rest / hover** (`0 18px 40px -26px rgb(0 0 0 / 0.9)` → `0 26px 52px -26px rgb(0 0 0 / 0.95)`, each with an inset white edge): circuit nodes and rail seats.
- **Pointed-at** (`box-shadow: 0 24px 60px -34px rgb(63 93 214 / 0.8)`): the only coloured shadow. A card being pointed at throws the light's own colour, not black.
- **Glow** (`0 0 12px 2px`, `0 0 18px 0`, `0 0 22px -4px` in Stage Light at 55–70%): status dot, live node rails, the selected latency segment. Glow means live.

### Named Rules
**The Glass-Over-Light Rule.** A panel is a translucent ink fill plus `backdrop-filter`, never an opaque light grey. If the drifting field cannot be seen through a surface, the surface is wrong.

**The Coloured Shadow Rule.** Black shadows carry weight; the blue shadow carries attention. Only the pointer/hover response is allowed a coloured shadow.

## Shapes

Hard-edged by default. Panels, cards, charts, tables, spec cells, the portrait plate and the circuit nodes all have no radius — the form language is rectangles separated by hairlines, the way a specification sheet is set.

Four exceptions, each earned:
- **Pills (999px)** for anything that is a control or a token: buttons, chips, pipeline nodes, node numbers, the status pill, the "Now" and "Current seat" badges.
- **The sheet's top corners** (`clamp(14px, 1.8vw, 26px)`, top only) — the one radius that carries meaning: it is what makes the arrival read as a surface passing over another surface.
- **2px** on the small drawn parts: bar segments and fills, the latency track bars, key swatches, skill-field cells.
- **4px** on the rail seats, which are larger drawn parts of the same family.
- `50%` on the 6px status dot, which is a dot.

Borders are 1px hairlines almost everywhere; SVG strokes are 1.2–1.6px. A circuit node adds a 1px top rule that fades in from transparent at both ends, so a row of nodes reads as a run of instruments.

### Named Rules
**The Square-Unless-It-Is-a-Control Rule.** If it holds content, it has square corners. If it is pressable, selectable, or a token you could pick up, it is a pill. There is no middle radius.

## Components

### Buttons
- **Shape:** full pill (999px), inline-flex with a 10px gap.
- **Primary:** cool white fill, black text, weight 600, `15px 28px`. Hover goes to pure `#ffffff` and rises 1px.
- **Secondary:** 4% white fill over `blur(10px)`, hairline border, white text, weight 500, same padding. Hover raises the fill to 10% and the border to 22% white, and lifts 1px.
- **Ghost:** the secondary with a transparent fill.
- **In the running head:** the primary at `10px 20px`, 0.8125rem.
- **Focus:** a 2px Stage Light outline at 3px offset, page-wide.
- **Transitions:** 0.45s on the house easing.

### Chips
- **Style:** hairline-faint border, grey-2 text at 0.6875rem, pill, `6px 12px`, transparent fill. Pipeline nodes are the same chip with a small arrow glyph drawn between them.
- **State:** chips brighten from their *parent's* hover, not their own — hovering the area or system card raises every chip's border to the stronger hairline and its text to grey.

### Cards / Containers
- **Corner Style:** square.
- **Background:** ink at 72% over `blur(10–12px)`; hover moves to ink-3 at 82%.
- **Shadow Strategy:** none at rest inside a seamed grid; see Elevation for plates.
- **Border:** provided by the 1px seam of the grid; a standalone panel takes a hairline-faint border.
- **Internal Padding:** `clamp(26px, 2.6vw, 46px)` for feature panels, `clamp(22px, 2.4vw, 38px)` for charts, `12px 14px` for spec cells.
- **Hover:** the whole panel answers — a Stage Light border at 38%, the blue shadow, a 3px rise, and a single pane of light that crosses the block diagonally over 1.1s.

### Navigation
- **Running head:** sticky at top, 74px tall, transparent until stuck; at `data-stuck="1"` it takes black at 72% with `blur(18px) saturate(1.4)` and a hairline-faint bottom rule.
- **Links:** 0.8125rem grey-2, shown only at ≥1040px, with a Stage Light underline that wipes in from the left on hover and stays for the section you are in (`data-live="1"`).
- **Mark:** 0.9375rem, weight 600, −0.02em, white.

### Signature: the pinned opening and the sheet
The opening is the first screen and does not scroll away: `position: sticky; top: 74px`, `height: calc(100svh - 74px)`. The rest of the document is one element carrying the page's own ground, a top radius, a lit top hairline and an upward shadow, pulled up over it. Scroll writes `--p` (0–1, rounded to 1/100, one style write per frame, only while the hero is on screen) onto the hero, which CSS turns into a −5vh rise, a scale to 0.945, an opacity fall to 0.15 and a 5px blur.

### Signature: the stage and its CSS fallback
The object is a WebGL canvas absolutely positioned *inside the hero* — not fixed behind the document — so below the fold it is neither drawn nor rendered and the reading sections sit on plain black. At ≥1100px the stage is inset to `left: 34%`, which keeps the sphere a sphere and clears the reading column; narrower, it takes the full frame behind the type. Underneath it, and permanently when WebGL is missing or the context is lost twice, a CSS room drawn in the same values ships: three radial washes, a left-to-right black scrim over the reading side, and a hard fade into the page's black at the bottom edge. `data-live="1"` only drops the CSS room to 55% opacity over 1.2s once the object arrives. three.js is behind a dynamic import, so it is never in the initial bundle.

### Signature: kinetic headlines
Words are split into masked spans **on the server**, so the masked state is in the first frame and a headline never flashes. Two mechanisms, deliberately separate:
- The opening's headline runs a pure CSS animation (1.15s rise from 115% with a 2deg rotation, 110ms per word after a 150ms delay), so it plays whether or not JavaScript ever arrives.
- Every headline below it is masked *only once armed*: the client sets `data-armed="1"` on headings still below 90% of the viewport, then `data-play="1"` on intersection, with a 2.5s safety timer that plays anything the observer misses. A heading already on screen is never armed, so nothing visible is hidden and restored.

Each word carries `--i`, and a `start` offset continues the count across an accent `<em>` so a two-tone headline staggers as one line. Headlines are repeatably hoverable — the wave runs again at 45ms per word with a blue text-shadow — and accent words carry a slow 6s glint so a headline is never completely still. One light pass crosses the name once, behind the glyphs, after it lands.

### Signature: pointer light
One delegated `pointermove` listener for the whole document writes `--mx` / `--my` (percentages) on the card under the cursor — one style write per frame, nothing else. The highlight is a 340px radial gradient of Stage Light drawn in a `::before` on the five surfaces that read as objects: system cards, organisation panels, charts, rail seats and field rows. It is gated on `(any-hover: hover) and (any-pointer: fine)` — `any-`, so a touchscreen laptop's mouse still gets it. **The response does not depend on the script:** `:hover` lights the same card in CSS with the gradient defaulting to 50%/50%; the script only decides *where* the light falls. Text blocks never take it.

### Signature: drawn flows and charts
Diagrams are SVG drawn from figures already stated in prose. Structure is a 1.4px hairline stroke at 22% white; one live signal runs it as a dashed Stage Light stroke on a linear infinite loop (3.4s for wires, 3.6s for the chart step, a 5s reverse for the feedback loop, and 3.4s drop/lift on the two feedback stubs). Charts use hairline-faint grid lines, grey-2 ticks at 11px, an accent area fill at 9%, a hairline step path with a live accent path drawn over it, and black-filled dots with accent strokes. The stacked bar and the seat rail draw themselves open from the left on arrival (`scaleX(0)` → none over 0.9–1s, staggered 0.12s).

### Motion and the reduced-motion policy
One easing curve for the whole page: `cubic-bezier(0.16, 1, 0.3, 1)`. Durations are 0.35–0.6s for state, 0.9–1.2s for arrivals, and 2.2–26s for continuous life.

The arrival gesture never hides anything: it starts at 0.25 opacity, 20px down and 5px blurred, and resolves on intersection with an 80ms sibling stagger (capped at six) — plus a 1.2s fallback attribute that resolves anything the observer missed.

`prefers-reduced-motion: reduce` is read as being about *movement, not feedback*. Everything that travels is removed: entrances, the hero parallax, word rises, bar and rail fills, hover lifts, and every continuous loop — ambient drift, breathing marks, running signals, the scroll-cue arrow, the light pane. Everything that is feedback is kept: colour changes, border changes, the glow under the cursor, and the pointer light itself, which changes brightness rather than position.

### Named Rules
**The Never-Hidden Rule.** No entrance may set `opacity: 0` or `display: none` on content. The arrival floor is 0.25 opacity, and every deferred reveal carries a timer that resolves it regardless.

**The Scripting-Query Rule.** The only three rules on this page whose initial state withholds content — the arrival pre-state, the bar fill and the rail fill — are wrapped in `@media (scripting: enabled)`. Any future rule whose "before" state is invisible goes in that query or does not ship.

**The No-`.js`-Gate Rule.** Never gate styling on a `.js` class on `<html>`. React restores the server-rendered className on `<html>` during hydration and removes it, so a `.js`-gated style dies mid-session. Use `@media (scripting: enabled)` or a data attribute owned by the component.

**The Power-On Opt-Out Rule.** The app-wide `power-on` first-paint animation in `globals.css` belongs to the datasheet's main, not to this route. `.cn main { animation: none }` opts out, and that line must survive any refactor of this stylesheet.

## Do's and Don'ts

### Do:
- **Do** declare every new token as a custom property on `.cn`. The `<html>` theme class has no vote inside this world; it is a single material in a single mode.
- **Do** ground new surfaces on `#000000` and lift them with translucent ink plus `backdrop-filter`, not with an opaque grey.
- **Do** use the one easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`) for every transition and every timed animation.
- **Do** draw structure with hairlines at 5.5–10% white, and build panel grids with a 1px seam over a hairline-faint background.
- **Do** keep the accent to marks that mean live, signal, now, or link, and set the accent half of a headline in a non-italic `<em>`.
- **Do** set every comparable number with `font-variant-numeric: tabular-nums`, since the scope turns tabular figures off by default.
- **Do** give any new reveal both an intersection trigger and a hard fallback timer, and start it at 0.25 opacity rather than 0.
- **Do** split kinetic words on the server, and arm a mask only on elements that are below the fold at the time.
- **Do** write pointer state as `--mx` / `--my` custom properties and let CSS draw; keep the per-frame cost at one style write.
- **Do** keep a CSS-only fallback for every scripted visual — the CSS stage for WebGL, `:hover` for the pointer light, the hero's pure-CSS word rise.
- **Do** suppress movement under `prefers-reduced-motion` while keeping colour, border and glow feedback.

### Don't:
- **Don't** gate any style on a `.js` class on `<html>`. React removes it during hydration; use `@media (scripting: enabled)`.
- **Don't** let the app-wide `power-on` animation reach this route; `.cn main { animation: none }` stays.
- **Don't** add a radius to a content surface. Panels, tables, plates and nodes are square; pills are for controls and tokens; 2px and 4px are for small drawn chart parts only.
- **Don't** introduce a second typeface, an italic, or a monospace face.
- **Don't** introduce a second hue. States distinguish themselves with Deep Beam, the 10% wash, or opacity.
- **Don't** write a rule whose initial state is invisible outside `@media (scripting: enabled)`, and don't ship a reveal without a fallback.
- **Don't** reuse a class name across two sections (`.cn-role` for a record row and for the hero's identity line); a shared name silently donates that section's grid column and border.
- **Don't** target the running head with `.cn > header`; that selector outranks `.cn-head` on specificity and takes its stickiness away.
- **Don't** add scroll snapping. With two full-height screens it fights every anchor jump and was removed for that reason.
- **Don't** put the pointer light on text blocks. It belongs on surfaces that read as objects.
- **Don't** use `vh` for a full-screen section; use `svh`, so a collapsing mobile toolbar cannot clip the bottom.
- **Don't** merge anything from `DESIGN.v2.md` into this system. `/v2` is a separate, still-shipping world; the two share content, not tokens.
