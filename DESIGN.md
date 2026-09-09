---
name: Shreenivas Joshi — personal site
description: >-
  A two-ink technical document. Black ink carries every word and every rule on
  cool spec stock; one process cyan carries the plotted mark and the primary
  action. Nothing glows, nothing blurs, nothing is round, and there is no
  gradient anywhere on the page. The evidence is a characteristics table where
  every figure states its unit and its test condition, the pairing is drawn as
  one circuit with a feedback loop, the running head carries a sheet counter
  instead of a progress bar, and the 3D object is a solid orthographic loss
  landscape with contour rings on it and four optimisers descending at once,
  rather than a glass orb that spins.
colors:
  light:
    stock: "#f7f8f7"
    stock-plate: "#ffffff"
    stock-sunken: "#eef0ef"
    ink: "#14171b"
    ink-2: "#4a5157"
    ink-3: "#626a70"
    reticule: "#dcdfde"
    reticule-2: "#c4c9c8"
    trace: "#046a90"
    trace-bright: "#0a93c4"
    trace-wash: "rgb(4 106 144 / 0.07)"
    trace-fg: "#ffffff"
    scene-face: "#eceeed"
    scene-face-2: "#f7f8f7"
    scene-face-3: "#d8dcdb"
    scene-edge: "#14171b"
    scene-mark: "#046a90"
  dark:
    stock: "#101315"
    stock-plate: "#171b1e"
    stock-sunken: "#0b0e0f"
    ink: "#e7eae9"
    ink-2: "#a7afb3"
    ink-3: "#8b9297"
    reticule: "#23282b"
    reticule-2: "#363d41"
    trace: "#4fb9de"
    trace-bright: "#67c9ea"
    trace-wash: "rgb(79 185 222 / 0.1)"
    trace-fg: "#05242e"
    scene-face: "#23282b"
    scene-face-2: "#2c3236"
    scene-face-3: "#191d20"
    scene-edge: "#cfd5d4"
    scene-mark: "#4fb9de"
typography:
  spec-title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.375rem / 3.375rem at ≥640px"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  spec-section:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.075em"
    textTransform: uppercase
  spec-head:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem block titles, up to 1.875rem for the contact line"
    fontWeight: 600
    lineHeight: 1.32
    letterSpacing: "-0.018em"
  spec-label:
    fontFamily: "Chivo Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.09em"
    textTransform: uppercase
  spec-value:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    letterSpacing: "-0.012em"
    fontVariantNumeric: tabular-nums
  spec-datum:
    fontFamily: "Chivo Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.005em"
    fontVariantNumeric: tabular-nums
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem default / 0.875rem secondary"
    fontWeight: 400
    lineHeight: "1.65–1.7"
rounded:
  none: "0px"
spacing:
  section-top: "4rem / 6rem at ≥640px"
  front-page: "2.5rem top, 3.5rem bottom / 3.5rem and 4rem at ≥640px"
  container: "max-width 68rem, padding 1.25rem / 2rem at ≥640px"
  table-cell: "0.75rem 0.875rem body, 0.5rem 0.875rem header"
components:
  key-primary:
    backgroundColor: "{colors.light.trace}"
    textColor: "{colors.light.trace-fg}"
    rounded: "{rounded.none}"
    padding: "0.625rem 1rem"
    typography: "Archivo 600, 0.875rem"
  key-secondary:
    backgroundColor: "{colors.light.stock-plate}"
    textColor: "{colors.light.ink}"
    borderColor: "{colors.light.reticule-2}"
    rounded: "{rounded.none}"
    padding: "0.625rem 1rem"
  key-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.light.ink-2}"
    rounded: "{rounded.none}"
    padding: "0.625rem 0.5rem"
  plate:
    backgroundColor: "{colors.light.stock-plate}"
    borderColor: "{colors.light.reticule-2}"
    rounded: "{rounded.none}"
    padding: "1.5rem / 2rem for the featured plate"
  plate-sunken:
    backgroundColor: "{colors.light.stock-sunken}"
    borderColor: "{colors.light.reticule-2}"
    rounded: "{rounded.none}"
  tbl:
    backgroundColor: "{colors.light.stock-plate}"
    borderColor: "{colors.light.reticule-2}"
    rounded: "{rounded.none}"
  nav-item-active:
    backgroundColor: "{colors.light.stock-sunken}"
    textColor: "{colors.light.ink}"
    rounded: "{rounded.none}"
    padding: "0.375rem 0.625rem"
---

# Design System: Shreenivas Joshi — personal site

## Overview

**Creative North Star: "The Datasheet"**

A two-ink technical document. The page is one printed sheet on cool spec stock:
black ink carries every word, every rule and every frame, and a single process
cyan carries the plotted mark and the primary action. Nothing glows, nothing
blurs, nothing is round, and there is no gradient anywhere.

This world **replaces** the one recorded here before rather than refining it.
The previous system was a neutral ramp plus a violet accent carrying an aurora
of blurred blooms, a transmissive glass artifact with a lit core, grain over
large fields, rules that faded at both ends, and a pointer-tracked spotlight. It
was carefully built and thoroughly documented. It was also the single most
over-represented look in generated interfaces — violet light, glass, glow — and
the user's report was exactly that: *"Still UI looks like AI generated use
something unique and fantastics and premium."*

The direction was chosen through a roll rather than by ranking, and the user
locked the card presented as Impeccable's Pick with its familiarity risk stated
on its face. Two of the dealt challengers are worth recording because they
constrain future work. **Civic Bureau Prospectus** — bone white, hairline
rules, one violet action, a rendered teal-to-violet ribbon — was declined on
factual grounds rather than taste: it is the incumbent's own world with a
different gradient, and it is the enterprise-SaaS default the brief names as the
problem. **Custody of the Work** (a museum provenance ribbon) was judged
competitive and remains the standing alternate: it is the only dealt world that
turns the absence of case-study artefacts into a feature by distinguishing
verified passages from inferred ones.

Why this world and not another: **the product's own principles ask for it.**
PRODUCT.md says numbers are the proof and the page must be judgeable in forty
seconds. A datasheet is the document form that exists to make a claim checkable
at a glance, because every value states its unit and the condition it holds
under. So the four large hero figures became a nine-row characteristics table.
That is more evidence in less space, and it retires the hero-metric template
(big number, small label, accent) that the page was previously built on.

The **convention-over-invention** commitment in PRODUCT.md is honoured and not
overridden. Section names are still Work, Leadership, Technical depth,
Experience, About and Contact. There is no governing metaphor to decode, no
invented vocabulary, and no label that is jargon. What the world supplies is a
*grammar* — table, rule, plate, reticule, running head — not a new
set of names. That distinction is the whole reason this direction can be this
committed without breaking the brand commitment.

**Key Characteristics:**

- Two inks: one black in three measured weights, one process cyan. No third hue anywhere
- Zero border radius, with two drawn circles as the only exceptions (the portrait, the status mark)
- No gradient on the page: not on type, not on a rule, not on a surface, not behind anything
- Two shadows in the entire system, both on things that genuinely float
- Two faces, and exactly two weights of the text face
- The central evidence is a characteristics table with a conditions column
- The pairing is drawn as one circuit with a real feedback loop, not argued as two sections
- A running head with a sheet counter, in place of a coloured progress bar
- A solid orthographic loss landscape in WebGL: contour rings on the surface, projected on the plate, four concurrent descents and a live readout — drawn again as a contour map in SVG underneath
- Complete, legible and unhidden with JavaScript off and with WebGL absent

## Colors

Two inks on stock. The palette is small enough to state in one sentence, and
every value is measured rather than picked.

### Primary

- **Process Cyan** (light `#046a90`, dark `#4fb9de`): the second ink of a
  two-colour print run. It carries the primary action's fill, the leadership
  proof lines, the "Current" chip, the status mark, links inside prose, the
  focus ring, text selection, the caret, and the leads and marking on the 3D
  object. It is not violet, not terracotta, not neon and not a signal red —
  those are the three clusters a free aesthetic axis lands in, and process cyan
  is what a technical document actually runs as its plate. Measured 5.6:1 light,
  8.1:1 dark.
- **Cyan Bright** (`--trace-bright`, 3.3:1 light): the full-chroma ink, for
  graphics and large type only. It is never used for body text, and the two
  values exist precisely so that rule cannot be broken by accident.

### Neutral

- **Stock** (`--stock`, `#f7f8f7`): the printed ground, on `html` so it is
  continuous through overscroll. Cool, with a faint green-grey cast, because
  that is what technical print runs on. It is deliberately **not** cream: warm
  paper plus a high-contrast serif is the other cluster this redesign is
  escaping, and landing there would have been the default wearing different
  clothes.
- **Stock Plate / Stock Sunken**: a bordered region of print stock, and a well.
  A plate is pure white in light so it separates from the sheet by its own hard
  edge rather than by tone.
- **Ink** (`#14171b`, 16.0:1): headings, rules, frames, the running head's
  identity. Never pure black — a printed black is a dense grey.
- **Ink 2** (`#4a5157`, 7.3:1): all prose.
- **Ink 3** (`#626a70`, 4.9:1): units, symbols, test conditions, captions,
  column heads. Carries deliberate headroom over the 4.5 floor so a value
  sitting on `--stock-sunken` still passes.
- **Reticule / Reticule 2**: the drawn structure — the graph grid, the table
  hairline, the plate edge.

### Scene

`--scene-face`, `--scene-face-2`, `--scene-face-3`, `--scene-edge`,
`--scene-mark` and the scalar `--scene-key`. Not a second palette: the page's
own inks expressed as the six values the drawing needs, read off
`documentElement` and re-read whenever the theme class flips.

### Named Rules

**The Two-Ink Rule.** Black in three measured weights, plus one process cyan.
Adding a colour means adding a plate to a print run, which is a decision at the
level of the whole document, not a component. A third hue does not get added to
make something look interesting.

**The No-Gradient Rule.** There is no gradient anywhere on this page. Not on
type, not on a rule, not on a surface, not behind the content. The previous
world's signature was a rule that faded to transparent at both ends; a printed
rule does not fade, so every rule here is hard. Tone comes from ink weight, from
a well, or from a frame — never from a fade. (Donated by the One-Bit Desktop
challenger, which earns every grey it shows through the density of its marks.)

**The One Ramp Rule.** Every colour is a custom property on `:root`, overridden
once under `.dark`, exposed to Tailwind through `@theme inline`. Nothing in a
component hard-codes a hex. The 3D object obeys this too: it has no colours of
its own. The one sanctioned exception is `opengraph-image.tsx`, where Satori
resolves no custom properties; the values there are copied and commented as
such.

**The Owned-Field Rule.** The second ink appears at full strength as a *field*
on the primary action, not as a 7%-opacity wash scattered over a neutral page.
The one wash in the system is the table row's hover, and it is transient.
(Donated by the Single-Hue Program challenger: a colour is either owned or it is
decoration.)

**The Negative, Not A Dark Theme.** Dark is the same document as a photostat
reversal, which is why the reticule survives the switch and the cyan brightens
rather than the whole palette flattening to grey. The scene inverts with it:
faces go dark and edges go light, so the drawing is still a drawing rather than
a pale object floating on black. The use scene decides which is primary — a
recruiter at a desk in daylight, often with the LinkedIn profile and the PDF
open in adjacent tabs — so light leads and the negative is the second material.

**The Measured Grey Rule.** Every text grey clears 4.5:1 body / 3:1 large
against its *effective* background resolved through ancestors, not picked by
eye. A new grey is measured or it does not ship.

**The Solid-Ground Rule.** A region that draws a pattern carries an explicit
`background-color` underneath it, never a transparent overlay. The reticule
without a ground let the page show through and left every annotation sitting on
a backdrop that could not be resolved — which is both a contrast failure and
wrong: a drawing region is printed on plate stock with the grid laid over it.

## Typography

**Text face:** Archivo (with `ui-sans-serif`, `system-ui`, `sans-serif`)
**Data face:** Chivo Mono (with `ui-monospace`, `monospace`)

Archivo is a grotesque drawn from printed signage and reference material — flat
terminals, tight apertures, numerals that hold a column. Chivo Mono carries
symbols, units, values, dates and test conditions. Neither is one of the
training-data defaults, and neither was chosen by subject association.

**Two weights ship: 400 and 600.** Not a variable axis — the weights are pinned
in `next/font` so there is physically no third weight for a heading to drift
into. `font-synthesis-weight` is off.

### Hierarchy

- **Spec Title** (600, 2.375rem → 3.375rem, 1.02, −0.03em): the name, once. The one place type is large.
- **Spec Section** (600, 0.8125rem, +0.075em, uppercase): a section head, sitting on a 2px ink rule.
- **Spec Head** (600, 1.0625rem block titles up to 1.875rem for the contact line, 1.32, −0.018em): block titles and the argument.
- **Spec Value** (600, 1.0625rem, tabular): a measured value in a table cell.
- **Spec Label** (Chivo Mono, 0.6875rem, +0.09em, uppercase): column heads and field labels.
- **Spec Datum** (Chivo Mono, 0.75rem, tabular, sentence case): symbols, units, dates, conditions, stack lines, the sheet counter.
- **Body** (400, 0.875–0.9375rem, 1.65–1.7, `--ink-2`): all prose, capped at 68–74ch.

### Named Rules

**The Head-Below-Content Rule.** A section head is *smaller* than the content
beneath it, set in small caps on a two-pixel ink rule. In a reference document
the table outranks its own label, and a section name set at display size would
be shouting the filing system at a reader who came for the contents. This is the
heading itself, not an eyebrow above one — the kicker remains banned.

**The Mono-Is-Measurement Rule.** Monospace carries symbols, values, units,
dates and conditions. It is never a costume for "technical", and prose never
goes mono. Where mono appears, something is being measured or indexed.

**The Tabular Rule.** Anything a reader compares down a column is set with
`tabular-nums`. Table values, the sheet counter and the date column are all
tabular; prose keeps proportional figures so sentences do not gap.

**The Measure Rule.** Reading text is capped at 68–74ch. A paragraph allowed to
run the full 68rem container is a defect, not a layout — including inside a
grid column, which is where this failed on the first pass. The one exception is
a table cell of joined data, and even the toolchain's `·`-joined list is capped
at 72ch because it reads as a line rather than as a value.

## Layout

A single 68rem centred container, 1.25rem gutters rising to 2rem at ≥640px,
against a one-breakpoint system: `sm` (640px) does almost all the responsive
work, with `md` switching the navigation and `lg` adding the running head's
section name.

The page is a stack of sheets on one continuous ground. Every section owns its
own container, so the measure is stated once per section rather than inherited
from a wrapper. There are no panels floating over a field, because there is no
field: the ground is stock, and content is printed on it.

**Sheet order.** Front page → characteristics → block diagram → selected work
→ leadership → technical depth → experience → about → contact. Nine sheets, and
the two evidence sheets sit immediately after the front page, before any prose.

**Front page.** A 12-column grid at ≥640px. Seven columns of text: name,
designation line, a 2px rule, the argument, the lead, the features list, three
actions. Five columns for the plot, in a framed reticule cell, with a compact
identity strip beneath it carrying the portrait, the current seat and the
availability mark.

The drawing is in the first viewport and the portrait is a 64px circle rather
than a five-column plate. Both facts are deliberate: the object has to be seen
without scrolling, and a face is load-bearing for this audience but does not
need a column of height to say so. On a narrow viewport the column order is
text → drawing → identity, so the argument always precedes both.

The drawing carries **no caption**. A line under it either restates what the
drawing already says or, worse, claims the object is something it is not — a
caption reading "multimodal voice stack" over a generic package was written and
removed for exactly that reason. The identity strip carries the information.

**The Say-It-Once Rule.** The first shipped composition put the name in the
running head, in the `h1`, and again in the identity strip, with the location
in two of the three. Three of one fact in one viewport is not emphasis, it is
noise, and it costs the space a second fact could have used. The running head
carries the name because a document names itself on every sheet; the `h1`
carries it because that is the page's subject; the strip therefore carries what
nothing else in the viewport says — the current seat, and the availability. Any
new element in the first viewport has to earn its place by adding a fact.

**Two-up registers.** Leadership, technical depth and the work list are all the
same shape: a `1fr / 1.35fr` grid, title and its datum on the left, prose on the
right, divided by hairlines. This deliberately replaces three separate grids of
same-size cards.

**Experience.** A 10.5rem mono date column beside the role — the
revision-history shape — collapsing to a single column with the date and the
"Current" chip inline below 640px.

### Named Rules

**The No-Cards-As-Structure Rule.** A grid of same-size cards, each an icon
above a heading above three lines, is not a page structure. The previous world
used it for work, leadership and technical depth. All three are now ruled
registers, and the two plates that remain (the featured system, the résumé) are
plates because each is genuinely a single object, not because a card was the
convenient container.

**The Wide-Content-Scrolls-Inside Rule.** The characteristics table and the
block diagram carry a `min-width` and scroll inside their own
`overflow-x: auto` container. A drawing you pan sideways is native to this
document form, and the sheet itself never scrolls horizontally.

**The Frame-Belongs-To-The-Table Rule.** A ruled table draws its own outer
frame; a bordered wrapper around it opens a gutter between the frame and the row
rules. The scroll container is transparent and the border lives on `.tbl`.

**The Unlayered Cascade Rule.** `.key`, `.plate`, `.tbl`, `.spec-*` and friends
are unlayered CSS, while Tailwind utilities live in `@layer utilities`.
Unlayered beats layered at equal importance, so a normal utility cannot override
one of these. An `!important` utility *does* win, which is why the header's
résumé control uses `max-sm:!hidden` and `!text-[0.8125rem]` rather than
`hidden sm:inline-flex`. This exact bug shipped once.

## Elevation & Depth

Print has no drop shadows, and a page full of them was the previous world. There
are **two shadows in the entire system**, and they exist only for the two things
that genuinely float above the sheet: the running head once it detaches on
scroll, and the query panel. Both carry a vertical offset and a soft blur in two
layers.

Everything else is depth by **frame and tone**: a plate is a hard-edged bordered
region of stock; a well is a step down in tone; a table is a frame with rules
inside it. There is no edge highlight, no sheen, no inset lift, and no
intermediate glass layer.

### Named Rules

**The Two-Shadows Rule.** If a third shadow is being added, the thing being
built probably wants a frame instead. A surface is raised by having an edge, not
by being given a halo.

**The Real Press Rule.** Every control moves 1px down on `:active` and drops its
lift. Hover treatments sit behind `@media (hover: hover)` so a touch device
never gets a stuck hover state.

## Shapes

**Radius is zero.** Every plate, key, chip, table, frame and well is a hard
rectangle, because a printed rule has no rounded corner — and four radius steps
was the clearest single tell of the world this replaces. The two exceptions are
drawn as circles on purpose: the availability mark and, where it appears, a
portrait. A "square dot" is used as the list bullet rather than a round one.

The 3D object obeys the same language: it is entirely right-angled, and its one
asymmetry is a square corner index.

### Named Rules

**The Zero-Radius Rule.** A new component gets no radius. If something reads as
unfriendly without one, the fix is spacing or ink weight, not a corner.

## Components

### Keys (controls)

A control is a printed key: a hard-edged rectangle, `0.625rem 1rem`, Archivo 600
at 0.875rem, with a 0.5rem gap to its 16px icon.

- **Primary:** the second ink at full strength, white label, one small lift.
  This is the only large field of cyan on the page, which is what makes it the
  primary action. Hover mixes 12% ink into the fill; active drops the lift and
  moves 1px down.
- **Secondary:** ink on plate stock inside a hairline. Hover strengthens the
  border to full ink.
- **Quiet:** muted ink, no chrome, gaining a well on hover.
- **Focus:** a square 2px cyan outline at 2px offset. Never removed, never
  replaced per component, and square because the world has no radius.

### Table

The characteristics table and the toolchain table share one anatomy: a header
band in a well with mono uppercase column heads, rows divided by hairlines,
values tabular and ranged right, units and conditions in `--ink-3`, and the
frame on the table itself. On a pointer device a row lights its own
`--trace-wash` and brings its conditions cell up to `--ink-2` — the only hover
response on the page that is not a control, and the reading gesture a spec table
actually wants.

### Navigation

A sticky running head, 3.5rem tall, transparent until scrolled, then 92% stock
with a small blur, a full-ink bottom border and the one small lift. Its three
fields are a document's: the subject at the left, the section you are reading in
the middle, the sheet number at the right. The current section is marked with a
well, never with a coloured underline. Below 768px the links collapse into a
disclosure panel that closes on Escape (returning focus to its trigger) and on
outside pointer-down; the panel is always in the DOM so `aria-controls`
resolves.

### Icons

Four authored marks on one 24-unit grid at 1.6 stroke, `currentColor`, rendered
at 14–16px. LinkedIn is the only filled mark, because its brand form is solid.
The four pillar icons the previous world carried are gone with it: a reference
document labels its fields, it does not illustrate them, and an icon tile above
every card was part of what made the page read as assembled. No icon font, and
no glyph or emoji standing in for an icon.

### Motion

Two easings: `--ease-plot` (0.16, 1, 0.3, 1) for the entrance,
`--ease-set` (0.25, 1, 0.5, 1) for state changes. State transitions run
0.1–0.2s.

**One authored moment: the sheet plots itself.** A pen plotter draws a technical
page in a fixed order — rules first, then the type. On the front page the 2px
rule draws from zero width (`[data-plot]`, 0.9s) and the type sets in sequence
(`[data-set]`, 0.55s opacity plus 6px). It happens once, in the first viewport,
and it is the only place the page performs.

Below the fold there is a second, deliberately duller population: `[data-reveal]`
at 0.5s opacity and six pixels. It exists because the user asked for the page to
feel alive as it is scrolled, and it is kept quiet so it reads as pages turning
rather than as eight sections each doing a trick.

**The Two Populations Rule.** Below-the-fold reveals are always the quieter one:
less travel, less time, group-relative stagger capped at six steps. A new
section gets `[data-reveal]`, never `[data-plot]`.

**The One-Contract-Two-Files Rule.** The population names live in `globals.css`
(which hides them) and in `Reveal.tsx` (which reveals them), and they must
match. When the hero population was renamed in the CSS and not in the component,
every element stayed at `opacity: 0` and **the entire front page rendered
blank** — silently, because hidden text still has valid computed styles, still
server-renders in the HTML, and passes every automated check including the
detector. `Reveal.tsx` now warns in development when the population is empty.
Renaming a `[data-*]` hook means editing both files and looking at the page.

**The Unhidden-Everywhere Rule.** Every hidden start state is `.js`-gated *and*
neutralised in three places: the reduced-motion block, `@media print`, and the
no-IntersectionObserver path. The reduced-motion override must match or exceed
`.js [data-set]` specificity or the start state wins and the page renders blank
— this exact failure has shipped here before, which is why all three populations
are listed explicitly rather than relying on a wildcard.

**Print is a real target.** This page and the résumé both get forwarded and
printed inside hiring teams, and an entrance that has not fired prints as one
header followed by empty sheets. It is also the one medium this world was
designed for, so print needs almost nothing undone: it hides the JavaScript-only
widget and the drawing band, and forces plates to pure white.

### The Running Head's Sheet Counter (signature)

The page's whole progress indicator is a **sheet number** — `03 / 09` in tabular
mono, with the section name beside it above 1024px. A document has page numbers;
it does not have a coloured bar creeping across the top. This replaces the
previous world's accent hairline and tells the visitor two things the hairline
never could: what they are currently inside, and how much document is left.

It is written straight to the DOM through a ref rather than through state, so a
scroll frame never re-renders the header, and it is recomputed on resize because
section offsets move with the viewport.

**The Document-Wayfinding Rule.** Progress is expressed in the document's own
units. If a future surface needs a progress affordance, it gets a count, an
index or a position — not a bar, and not the accent running the viewport width.

### The Loss Surface (signature)

A solid three-dimensional loss landscape with a graticule draped over it,
standing on a plate inside a drawn cage, with **contour rings traced onto the
surface itself**, **the same rings projected flat onto the plate below it**, a
sparse graticule draped over the form, and **four optimisers descending at
once** from starts spread around the field. Each runner lays down a faint
history line with a full-strength head trail and a faceted marker at its tip.
Three reach the deep basin by three different routes of 7.3 to 8.8 units; the
fourth settles in the shallow corner pocket. Then the traces retract and the
next cycle sets off from a different ring of starts. A small mono readout in the
corner of the cell reports the leading loss, the step count, and which minimum
is currently winning.

**One of the four runners always ends in the shallow local minimum instead of
the global one** — loss −0.24 against −1.35, and the composition is guaranteed
by construction rather than by luck: `cycleStarts` returns three global
approaches and one trap approach for every cycle. That is deliberate. Descent
does not always find the best answer, and a demonstration that pretends
otherwise is a worse demonstration.

**Four at once, not one at a time.** This was the enhancement that mattered most
when the object was refined. Running concurrently turns a demonstration into a
*comparison*, which is also what the work actually looks like — you run a sweep,
not a job — and it is what makes the trapped runner legible: it fails *beside*
three that succeed, rather than in a cycle of its own that nobody connects to
the others. Runners are staggered by 0.19s and the stagger is re-normalised over
the remaining span, so the last to set off still finishes rather than being cut
off mid-descent.

**Contour rings are what turn a shaded blob into a plot.** They are real
iso-lines of the same function the surface is displaced by, so they tighten
where the field is steep and open out where it is flat, and their nesting reads
as depth with no colour doing the work. The projection on the plate is the
standard convention for the same reason: it gives the surface a floor to be
measured against. The draped graticule was made sparser and quieter when they
arrived — a regular grid and a set of iso-lines at the same weight on the same
surface is two overlapping patterns, so the grid steps back to saying "ruled
plot" and lets the contours carry the topography. Ticks up the back post sit at
the contour levels, so the rings on the surface and the scale on the axis are
the same set of numbers.

This is the **third** object to occupy this slot, and the sequence is the record
of the same lesson learned twice:

1. **A transmissive glass sphere with a lit core.** Real optics, well built, and
   the single most recognisable ornament in generated interfaces. Replaced when
   the whole world was replaced.
2. **An exploded chip package.** Correctly drawn, and it read as *semiconductor
   hardware* rather than as AI systems. It was the datasheet's own default
   object, reached for because the world offered it rather than because the
   product did.
3. **A 16×16 attention surface as 256 extruded columns.** Honest and on-world,
   and still wrong: a field of thin bars has no mass. From an axonometric view
   it read as fuzz, and structurally it was a bar chart rather than a form.

A loss landscape answers all three failures at once. It is the most recognisable
image in machine learning, so it needs no caption to say what it is. It is a
genuinely **solid body** rather than a scatter of small parts. And it is a
*surface plot with a traced path*, which is native to the document this page is
— a datasheet's typical performance characteristics are surfaces exactly like
this one, so the object belongs to the world instead of being placed in it.

**The Product's-Object Rule.** When the visual world offers a default artifact
and the product has an artifact of its own, the product's wins. The chip package
was the datasheet's object; the loss surface is this engineer's object. A world
supplies grammar, not subject matter.

**The Field Is Shared Code.** `loss-surface.ts` holds the closed-form field, the
measured range, the four starts and the numerical descent, as pure functions
with no three.js and no DOM. The scene and the SVG fallback both import it, so
the 3D surface and the flat contour map are the same function with the same
paths on it and cannot drift.

**The Tuned-Not-Eyeballed Rule.** Every constant in that field was tuned against
the actual integration, and the first version proved why: it looked plausible
and was wrong. With no global trend the gradients vanished on the outer plateau,
three of four runs never reached the basin, two landed on the same point, and
one slid into the domain wall and stopped. The `bowl` term is the fix and it is
also the honest one — a real loss surface has an overall convex trend with local
structure on top, not local structure alone. The shipped values were verified by
evaluating the shipped module directly: field range −1.354 to 1.366 inside its
declared bounds, three convergences on the global basin from three directions
travelling 7.5 to 8.5 units each, one settling in the trap after 5.8 units, and
no path touching the boundary. A generated field is measured or it does not
ship.

**The Static-Surface Rule.** The landscape does not morph; only the descents
move. A surface that also animates gives the eye nothing to follow, and the
whole point is watching the paths find the bottom.

**The Readout-Is-A-Measurement Rule.** The corner box carries a value that
changes as the traces descend — the number a visitor watches fall — which is
why it earns a place where a line *describing* the drawing did not, and was
removed. It sits on its own plate so its ink is never read against the canvas,
and it is reported on change rather than per frame: sixty DOM writes a second
for a value that moves in the third decimal is waste. It starts out `hidden` and
is revealed by the first sample, so a visitor with no scripting or no WebGL
never sees an empty readout frame.

**The `display: contents` Trap.** `.js-only` resolves to `display: contents`,
which generates no box at all — so an absolutely positioned element carrying
that class silently loses its positioning. It is a wrapper gate, correct for the
query panel and wrong for anything placed. Anything positioned uses the `hidden`
attribute instead. This shipped once in this build.

The mechanics below are rules because each one already broke:

**The Orthographic Rule.** A surface plot is read, not looked at: parallel edges
must stay parallel, so two points at the same height are at the same height on
screen wherever they sit in the field. Perspective would make the plot lie. The
frustum is derived from the host's aspect so the field keeps its proportions at
every width, and a cell taller than it is wide fits across its width instead of
running out of frame sideways.

**The Polygon-Offset Rule.** The draped graticule lies exactly on the surface it
describes, so the filled surface carries `polygonOffset` to push it a hair back.
Without it the drape z-fights into stipple and the whole object looks broken.
Hidden-line removal is then free: the opaque surface occludes the lines running
behind it, which is what makes a wireframe drape read as a solid body.

**The Two-Light Rule.** One key, one low fill, one hemisphere, and no
environment map. A surface this large needs the fill or its shaded side goes
flat black in the negative. No specular highlight anywhere — a highlight would
be the first thing that made this look rendered rather than plotted, and a
mirror-smooth lit surface is precisely the ornament this world was chosen to
escape.

**The Growing-Draw-Range Rule.** Every trace is a fixed-length buffer whose
`drawRange` grows as the run proceeds, so a path draws itself without
reallocating, and `pose` allocates nothing at all — the write helper is hoisted
out of the loop. Each bounding sphere is computed once from a buffer that is
still all zeros and never recomputed, so every dynamic line sets
`frustumCulled = false`: cheaper and safer than recomputing bounds per frame.

**The Two-Lines-Not-A-Shader Rule.** The comet effect is a faint full-length
history line plus a full-strength 24-point head trail, because
`LineBasicMaterial` carries one opacity for the whole line. Two draw ranges over
two buffers is the whole trick; a per-vertex ramp would need a custom shader for
an effect that is invisible at this line weight.

**The Precompute-Per-Cycle Rule.** Paths are integrated once when a cycle
begins and reused for every frame of it. Integrating 130 momentum steps per
runner per frame would be four numerical descents sixty times a second to draw
a curve that never changes.

**The Retract-Before-Restart Rule.** A finished run retracts to its start before
the next begins. Cutting a new path in over a completed one reads as a glitch
rather than as a new run.

**The Turned-Not-Spun Rule.** The plot oscillates ±6.9° about the vertical and
±1.6° in nod, over 33 and 48 seconds. It is a chart being turned on a desk. A
full rotation would read the surface from underneath, and a continuously
spinning object is a logo animation rather than a plot.

**The Accumulated Delta Rule.** Animation time is an accumulated
`clock.getDelta()` clamped to 1/30, not `getElapsedTime()`. The loop is gated on
tab visibility and on-screen state, and elapsed time otherwise keeps running
while the loop is paused and resumes the run from the wrong place.

**The Live Reduced-Motion Rule.** `prefers-reduced-motion` is re-read through a
`matchMedia("change")` listener. Under it the drawing is a completed run held
still, the pointer lean is never applied, and the scene renders exactly once — a
loss surface with a finished descent on it is still the whole drawing. The
pointer listener stays registered and is gated inside itself, so a mid-session
change is honoured.

**The Theme-Redraw Rule.** The theme observer re-renders rather than only
setting material colours, because the loop may be parked (off-screen, hidden
tab, reduced motion) and a colour change with no draw leaves a stale frame in
the old palette.

**The Rebuild-On-Loss Rule.** A lost WebGL context cannot be recovered in place;
three.js does not rebuild GPU resources for a restored context. The component
tears the scene down, restores the SVG contour map, and builds a fresh one,
bounded to 2 rebuilds so a machine that keeps dropping the context settles on
the fallback instead of thrashing.

**The Fallback-Is-The-Other-Standard-Drawing Rule.** The flat version is a
**contour map with the same paths on it** — real iso-lines traced by marching
squares over a 48×48 sample, eight levels, the sub-zero ones drawn heavier so
depth is carried by line weight. That is how this figure is shown on paper, so
the fallback is not a compromise; it is the other standard drawing of the same
thing, and it is what prints.

**The Fallback-Has-A-Budget Rule.** The first version of that flat drawing was a
grid of 1,600 opacity-ramped tiles: **150KB of the page's 335KB of HTML, 45% of
the document spent on a drawing that is replaced within a second of load.** Eight
contour paths are 23KB and a better drawing — nested rings read as depth, where a
tile grid reads as a screenshot of a heatmap. A server-rendered fallback is paid
for by every visitor including the ones who never see it, so it is measured in
bytes as well as in looks.

**The SVG-Token Rule.** A token colour in an SVG goes in an inline `style`,
never in a presentation attribute. `fill="var(--ink)"` does not resolve
reliably, and a `.spec-*` class on an SVG `<text>` is worse: those classes set
`font-size`, and CSS beats a presentation attribute, so every `fontSize` in a
drawing gets silently overridden. Both bugs shipped in this build and were
caught in inspection.

### The Reticule

A two-axis grid, minor at 8px and major at 40px, drawn from the ink family over
a solid plate ground. It appears in **exactly one place**: the front page's
plot cell, which is a measurement surface.

**The Measurement-Surface-Only Rule.** A drawn grid is allowed where it is the
graph something is plotted on, and nowhere else. It never sits behind prose, and
it was removed from the block diagram during inspection because a block diagram
is drawn on a plate, not on graph paper. This is the surviving half of the
previous world's Light-Not-Pattern Rule, kept for the reason that rule was
right: a pattern behind text competes with the text however faint it is made.

### The Query Panel

The scripted answer panel is an **application-notes** register, not a chat: a
plate with a full-ink head, and a ruled transcript where a fixed-width mono mark
column (`Q` / `A`) aligns questions and answers down an invisible rule. There
are no chat bubbles, because this is a document rather than a messaging app. Its
launcher is a secondary key labelled "Common questions" — not "Ask me
anything", because there is no text input and the answer set is fixed.

### Browser Surfaces

Selection is cyan on white. The caret and `accent-color` are cyan. The focus
ring is a square cyan outline. The scrollbar reads as the sheet's trim margin: a
well for the track with a hairline edge, a `--reticule-2` thumb inset 3px, going
to `--ink-3` on hover, and square. Link underline offset and thickness are set
from the design, and the thickness doubles on hover rather than the colour
changing.

## Do's and Don'ts

**Do**

- State a figure with its unit and the condition it holds under. A number without a condition is an adjective.
- State a fact once per viewport, and let the next element carry the next fact.
- Read the availability line from `site.availability`, so the offer is worded in one place.
- Reach for a table, a rule or a plate before reaching for a container.
- Cap every paragraph at the reading window, including inside a grid column.
- Put a token colour in an SVG through inline `style`.
- Measure a new grey against its effective background, in both materials.
- Let a drawing region scroll inside itself rather than letting the sheet scroll sideways.

**Don't**

- Add a gradient. Not to type, not to a rule, not to a surface, not behind anything.
- Add a border radius.
- Add a third shadow, an edge highlight, a sheen, or a glass layer.
- Add a third hue, or a third weight of the text face.
- Build a section as a grid of same-size icon-heading-text cards.
- Set the uppercase mono label above a heading. It is a field label; the kicker stays banned.
- Draw the reticule anywhere that is not a measurement surface.
- Express progress as a bar.
- Put prose in the mono face, or a glyph where an icon belongs.
- Repeat the name or the location because a slot happened to be there.
- Reach for the world's default artifact when the product has an artifact of its own. The datasheet's object is a package; this product's object is a loss surface.
- Ship a generated field without measuring it. A plausible-looking function whose descent paths stall, collide or hit the wall is a wrong drawing, not a rough one.
- Let a server-rendered fallback cost more bytes than the content it stands in front of.

## Verified

Checked on the built page at the close of this pass:

- **Contrast:** every text role measured against its effective background in both materials. Light: ink 16.0:1, ink-2 7.3:1, ink-3 4.9:1, trace 5.6:1. Negative: 15.3:1, 8.4:1, 5.9:1, 8.1:1. `--trace-bright` at 3.3:1 is restricted to graphics and large type.
- **Detector:** `impeccable detect` on the running page — 0 anti-patterns. One advisory remains, `codex-grid-background`, and it is the sanctioned case the advisory itself names: the grid appears only on the measurement surface.
- **Build:** `next build` clean, `tsc --noEmit` clean, all routes statically prerendered.
- **Fixed in inspection:** SVG token colours in presentation attributes; `.spec-*` classes overriding SVG `fontSize`; `.spec-head` leading at 1.25 under the 1.3 floor; four uncapped prose measures at 85–136ch; `--ink-3` annotation at 3.3:1 sitting directly on the reticule; a transparent reticule field with no ground; a bordered wrapper double-framing the tables.
- **Fourth pass on the 3D object, a refinement rather than a replacement.** Added contour rings on the surface and projected on the plate, axis ticks at the contour levels, four concurrent staggered runners with comet head trails, and a live loss readout; the draped graticule stepped back to make room. Every cycle's composition was verified by evaluating the shipped module: three global convergences of 7.3–8.8 units and one trap of 5.5–5.8 units, across six consecutive cycles, none touching the boundary. Page HTML unchanged at 165KB, because all of it is WebGL rather than markup.
- **Third pass on the 3D object.** Replaced the attention-column field with the loss landscape, for fit and for mass. The field's constants were tuned against the integration and verified by evaluating the shipped module: range −1.354 to 1.366, three global convergences of 7.5–8.5 units, one trap at −0.24 after 5.8 units, no boundary contact. The flat fallback became a real contour map and the page's HTML halved, 335KB to 165KB.
- **Fixed in the second review:** the name appeared three times in the first viewport and the location twice — the identity strip now carries the current seat and the availability instead. The availability wording moved to `site.availability` and reads "Open to leadership positions in AI". The toolchain gained an open-weight-model group (Llama 3, Mistral, Mixtral, Qwen, Gemma, Phi, DeepSeek, Mamba, BERT), a model-adaptation group, and an agentic group carrying MCP, tool use and planning; the agentic expertise area names MCP too. The 3D object was replaced for fit, not for craft.
- **Fixed after the user looked at it:** the front page rendered completely blank, because the entrance population was renamed in `globals.css` and not in `Reveal.tsx`. Nothing automated caught it — the markup, the build, the contrast maths and the detector were all clean while the page was invisible. The lesson is recorded as The One-Contract-Two-Files Rule, and a development warning now fires when the population is empty. Also removed in the same pass: a caption under the drawing that described the implementation ("drawn live in WebGL, and drawn again in SVG underneath") to an audience that does not care, and its replacement, which named the object as something it is not.

## Known drift

`PRODUCT.md` records that the scripted answer panel was **removed** in the
Next.js rebuild. It is present in the code and shipped in this pass, re-skinned
as the application-notes register. Removing a working function is the user's
call, not a redesign's, so it was preserved. This is reported, not repaired.
