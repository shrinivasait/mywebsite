/**
 * The floorplan.
 *
 * Everything on this route is laid out from this one model: the canvas draws
 * from it, the interactive overlay positions its buttons from it, and the
 * sections below the die read their headings out of it. Coordinates are
 * fractions of the die area (0–1), so the drawing and the DOM agree at any
 * size without either one measuring the other.
 *
 * The blocks are not invented: six are the technical areas from
 * `expertise`, two are the organisation. Each carries the one figure that is
 * already stated elsewhere on the page.
 */

export type BlockKind = "signal" | "logic" | "org";

export type Block = {
  id: string;
  /** Set in the block, at the size a floorplan actually labels a macro. */
  label: string;
  /** What it is, in plain words, for the inspector. */
  title: string;
  /** The measured figure, in the block's second line. */
  datum: string;
  kind: BlockKind;
  /** Die coordinates, 0–1. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Section this block jumps to. */
  href: string;
  /** One sentence of half-technical English, shown on hover or focus. */
  note: string;
};

/**
 * Two rows of macros with a routing channel between them. `signal` blocks sit
 * on the critical path, `logic` blocks are the rest of the technical surface,
 * and `org` blocks are the half of the job that is not code — drawn on the
 * same die on purpose, because that is the argument the page is making.
 */
export const blocks: Block[] = [
  {
    id: "voice",
    label: "VOICE",
    title: "Real-time multimodal voice",
    datum: "650–800 ms",
    kind: "signal",
    x: 0.04,
    y: 0.06,
    w: 0.26,
    h: 0.36,
    href: "#path",
    note: "Speech in, speech out, over live telephony. Recognition, reasoning and synthesis run as separate services against one clock.",
  },
  {
    id: "retrieval",
    label: "RETRIEVAL",
    title: "Retrieval architecture",
    datum: "FAISS · hybrid",
    kind: "signal",
    x: 0.33,
    y: 0.06,
    w: 0.26,
    h: 0.36,
    href: "#blocks",
    note: "RAG over large enterprise document sets: chunking and embedding strategy, index design, and the failure modes that only appear at corpus scale.",
  },
  {
    id: "agents",
    label: "AGENTS",
    title: "Agentic systems",
    datum: "MCP · tool use",
    kind: "signal",
    x: 0.62,
    y: 0.06,
    w: 0.22,
    h: 0.36,
    href: "#blocks",
    note: "Task orchestration and multi-step planning, with tool and data access over MCP, guardrails, and system-of-record integration.",
  },
  {
    id: "eval",
    label: "EVAL",
    title: "Evaluation and benchmarking",
    datum: "regression",
    kind: "logic",
    x: 0.87,
    y: 0.06,
    w: 0.09,
    h: 0.36,
    href: "#blocks",
    note: "Accuracy, interpretability and regression tracking across production models — because a model is easy to demo and hard to keep working.",
  },
  {
    id: "adapt",
    label: "ADAPT",
    title: "Model adaptation",
    datum: "pretrain → SFT",
    kind: "logic",
    x: 0.04,
    y: 0.58,
    w: 0.24,
    h: 0.36,
    href: "#blocks",
    note: "Taking open-weight models to a domain: continued pretraining on unstructured text, instruction fine-tuning, and the work either side of it.",
  },
  {
    id: "platform",
    label: "PLATFORM",
    title: "Platform and MLOps",
    datum: "3 clouds · CI/CD",
    kind: "logic",
    x: 0.31,
    y: 0.58,
    w: 0.26,
    h: 0.36,
    href: "#blocks",
    note: "Training, deployment and monitoring pipelines across AWS, Azure and Google Cloud, delivered as a standard other teams build on.",
  },
  {
    id: "team",
    label: "TEAM",
    title: "The organisation",
    datum: "18 engineers",
    kind: "org",
    x: 0.60,
    y: 0.58,
    w: 0.20,
    h: 0.36,
    href: "#org",
    note: "An 18-engineer AI organisation today; before that the first AI hire at a company with no AI function, and a team grown from 6 to 10.",
  },
  {
    id: "strategy",
    label: "STRATEGY",
    title: "Funding and strategy",
    datum: "₹3 Cr · $50K",
    kind: "org",
    x: 0.83,
    y: 0.58,
    w: 0.13,
    h: 0.36,
    href: "#org",
    note: "The AI strategy that secured ₹3 Cr in incubation funding and about USD 50K in cloud grants — so the AI work never drew on core engineering budget.",
  },
];

export const blockById = (id: string) => blocks.find((b) => b.id === id);

/**
 * The critical path: one spoken turn, routed across the die.
 *
 * Each leg names the hop it carries from `turn.ts`, so the packet's speed and
 * the accumulating readout are the real budget rather than an animation
 * timing. The turn enters at the pad ring, crosses VOICE, drops into
 * RETRIEVAL, climbs to AGENTS, returns through VOICE and leaves by the pad.
 */
export type Leg = { hop: string; from: [number, number]; to: [number, number] };

export const path: Leg[] = [
  { hop: "endpoint", from: [-0.04, 0.24], to: [0.04, 0.24] },
  { hop: "asr", from: [0.04, 0.24], to: [0.30, 0.24] },
  { hop: "retrieve", from: [0.30, 0.24], to: [0.315, 0.50] },
  { hop: "reason", from: [0.315, 0.50], to: [0.73, 0.50] },
  { hop: "tts", from: [0.73, 0.50], to: [0.73, 0.24] },
  { hop: "transport", from: [0.73, 0.24], to: [1.04, 0.24] },
];

/** The pad ring. Three pads are real connections; the rest are structure. */
export const pads = [
  { at: 0.12, label: "EMAIL", live: true },
  { at: 0.30, label: "LINKEDIN", live: true },
  { at: 0.52, label: "RÉSUMÉ", live: true },
] as const;

/**
 * The metal stack, read as a cross-section. Top metal is the coarse,
 * long-distance routing — the things a lead is hired for — and the lower
 * layers are the fine structure everything above them is built on.
 */
export const stackOrder = [
  "Agentic AI",
  "Retrieval",
  "Real-time voice",
  "Model adaptation",
  "Platform & MLOps",
  "Open-weight models",
  "Vision & generation",
  "Engineering",
] as const;
