/**
 * One spoken turn, as a budget.
 *
 * Both instruments on this route — the pipeline canvas in the hero and the
 * trace waterfall below it — are two views of this same array, so the numbers
 * can never disagree with each other. The stage budgets sum to 750 ms, which
 * sits inside the 650–800 ms band the résumé claims for production telephony;
 * the ceiling is 800.
 *
 * Nothing here is measured live. It is the shape of the budget the voice
 * architecture was designed against, drawn honestly, and the page says so.
 */

export type Stage = {
  id: string;
  /** Short form, for the canvas node. */
  short: string;
  /** Long form, for the trace row. */
  name: string;
  /** Budgeted milliseconds for this hop. */
  ms: number;
  /** Compute is the signal colour; io is the cold channel; risk is coral. */
  kind: "compute" | "io" | "risk";
  /** What this hop actually does, in half-technical English. */
  what: string;
  /** The engineering decision that keeps it inside its budget. */
  lever: string;
  /** The named technique, for the readout. */
  technique: string;
};

export const stages: Stage[] = [
  {
    id: "endpoint",
    short: "VAD",
    name: "endpoint · speech detect",
    ms: 90,
    kind: "risk",
    what: "Decide the caller has actually stopped talking, rather than paused mid-sentence. Everything downstream waits on this call, so it is the most expensive 90 ms on the chain.",
    lever: "Endpointing is tuned aggressively and paired with barge-in: if the decision is wrong, the caller talks over the reply and the turn is cancelled and restarted rather than queued behind it.",
    technique: "voice activity detection + barge-in",
  },
  {
    id: "asr",
    short: "ASR",
    name: "asr · streaming transcript",
    ms: 140,
    kind: "compute",
    what: "Turn audio into text. The transcript has been streaming in partials since the caller started speaking — this budget covers only the final flush after endpointing.",
    lever: "Streaming recognition, not batch. Partial hypotheses are already priming retrieval, so the finalised text costs a correction rather than a full pass.",
    technique: "streaming STT, partial hypotheses",
  },
  {
    id: "retrieve",
    short: "RAG",
    name: "retrieve · vector + rerank",
    ms: 120,
    kind: "io",
    what: "Fetch the handful of passages the model needs to answer about this account, this contract, this price — from an index over the client's own documents.",
    lever: "Hybrid search over a warm FAISS index with a shortlist rerank, speculatively started on the partial transcript so this hop is mostly finished by the time the final text lands.",
    technique: "hybrid retrieval + rerank, speculative start",
  },
  {
    id: "reason",
    short: "LLM",
    name: "reason · plan + first token",
    ms: 210,
    kind: "compute",
    what: "The model reads the transcript, the retrieved context and the negotiation state, then decides what to say and whether to call a tool. Measured to the first token, not the last.",
    lever: "Time-to-first-token is the only figure that matters here, because synthesis starts on it. Short system prompt, cached prefix, tool schemas kept small.",
    technique: "prefix caching, TTFT-bound generation",
  },
  {
    id: "tts",
    short: "TTS",
    name: "synthesise · first audio byte",
    ms: 130,
    kind: "compute",
    what: "Turn the reply into speech and start sending it. Only the first chunk is on the clock; the rest is generated while the caller is already hearing the sentence.",
    lever: "Synthesis is chunked at clause boundaries and streamed, so the reply begins before the model has finished writing it.",
    technique: "chunked streaming synthesis",
  },
  {
    id: "transport",
    short: "NET",
    name: "transport · telephony + jitter",
    ms: 60,
    kind: "io",
    what: "Carrier network, codec and the jitter buffer between the service and the caller's handset. Not code — but it is spent from the same budget as everything above it.",
    lever: "Media stays in-region and the buffer is held short; the budget is written with this hop reserved first, so no service upstream can spend it.",
    technique: "in-region media, short jitter buffer",
  },
];

export const CEILING_MS = 800;
export const BUDGET_MS = stages.reduce((sum, s) => sum + s.ms, 0);

/** Cumulative start offset of each stage, in ms. */
export const offsets: number[] = stages.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + stages[i - 1].ms);
  return acc;
}, []);

/**
 * Tool calls the agent makes inside the reasoning hop. They do not get their
 * own budget line because they run against the model's own turn — but a
 * reader who knows the architecture will look for them, so they are stated.
 */
export const sideEffects = [
  "crm.lookup(account)",
  "policy.check(offer)",
  "crm.write(outcome)",
];
